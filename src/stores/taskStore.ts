import { create } from "zustand";

import type { SmartView } from "@/features/tasks/smartViews";
import type { Task, TaskPriority, TaskStatus } from "@/features/tasks/taskTypes";

export type CreateTaskDraft = {
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
};

export type UpdateTaskDraft = {
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
};

interface TaskState {
  tasks: Task[];
  selectedTaskId: string | null;
  selectedSmartView: SmartView;
  searchQuery: string;
  createTask: (draft: CreateTaskDraft) => void;
  updateTask: (id: string, draft: UpdateTaskDraft) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  reorderTasks: (sourceId: string, targetId: string) => void;
  selectTask: (id: string | null) => void;
  selectSmartView: (view: SmartView) => void;
  setSearchQuery: (query: string) => void;
}

const now = new Date().toISOString();

const initialTasks: Task[] = [
  {
    id: "task-project-commands",
    projectId: "project-desktop-app",
    title: "Wire project commands to the UI",
    description: "Connect the shell to the Tauri command contracts.",
    status: "todo",
    priority: "high",
    dueDate: new Date().toISOString().slice(0, 10),
    sortOrder: 0,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "task-project-dialogs",
    projectId: "project-desktop-app",
    title: "Sketch project management dialogs",
    description: "Create and edit project flows for the sidebar.",
    status: "todo",
    priority: "medium",
    dueDate: getOffsetDate(1),
    sortOrder: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "task-error-copy",
    projectId: "project-home",
    title: "Review database command error copy",
    description: "Keep user-facing failures short and actionable.",
    status: "in_progress",
    priority: "low",
    dueDate: getOffsetDate(3),
    sortOrder: 2,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "task-package-review",
    projectId: "project-desktop-app",
    title: "Review phase package boundaries",
    description: "Make sure completed and upcoming smart views stay readable.",
    status: "completed",
    priority: "medium",
    dueDate: getOffsetDate(-1),
    completedAt: now,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "task-overdue-invoice",
    projectId: "project-personal",
    title: "Pay utility invoice",
    description: "Move this out of the overdue view once completed.",
    status: "todo",
    priority: "high",
    dueDate: getOffsetDate(-2),
    sortOrder: 4,
    createdAt: now,
    updatedAt: now
  }
];

function getOffsetDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function createTaskId() {
  return `task-${crypto.randomUUID()}`;
}

function normalizeTaskOrder(tasks: Task[]) {
  return tasks.map((task, index) => ({ ...task, sortOrder: index }));
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,
  selectedTaskId: initialTasks[0]?.id ?? null,
  selectedSmartView: "all",
  searchQuery: "",
  createTask: (draft) =>
    set((state) => {
      const createdAt = new Date().toISOString();
      const task: Task = {
        id: createTaskId(),
        projectId: draft.projectId,
        title: draft.title.trim(),
        description: draft.description?.trim() || undefined,
        status: "todo",
        priority: draft.priority,
        dueDate: draft.dueDate || undefined,
        sortOrder: state.tasks.length,
        createdAt,
        updatedAt: createdAt
      };

      return {
        tasks: [...state.tasks, task],
        selectedTaskId: task.id
      };
    }),
  updateTask: (id, draft) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              projectId: draft.projectId,
              title: draft.title.trim(),
              description: draft.description?.trim() || undefined,
              status: draft.status,
              priority: draft.priority,
              dueDate: draft.dueDate || undefined,
              completedAt:
                draft.status === "completed"
                  ? task.completedAt ?? new Date().toISOString()
                  : undefined,
              updatedAt: new Date().toISOString()
            }
          : task
      )
    })),
  deleteTask: (id) =>
    set((state) => {
      const remainingTasks = normalizeTaskOrder(state.tasks.filter((task) => task.id !== id));

      return {
        tasks: remainingTasks,
        selectedTaskId:
          state.selectedTaskId === id ? remainingTasks[0]?.id ?? null : state.selectedTaskId
      };
    }),
  toggleTaskCompletion: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "completed" ? "todo" : "completed",
              completedAt:
                task.status === "completed" ? undefined : new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : task
      )
    })),
  reorderTasks: (sourceId, targetId) =>
    set((state) => {
      const sourceIndex = state.tasks.findIndex((task) => task.id === sourceId);
      const targetIndex = state.tasks.findIndex((task) => task.id === targetId);

      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
        return state;
      }

      const reorderedTasks = [...state.tasks];
      const [sourceTask] = reorderedTasks.splice(sourceIndex, 1);
      reorderedTasks.splice(targetIndex, 0, sourceTask);

      return { tasks: normalizeTaskOrder(reorderedTasks) };
    }),
  selectTask: (id) => set({ selectedTaskId: id }),
  selectSmartView: (view) => set({ selectedSmartView: view, selectedTaskId: null }),
  setSearchQuery: (query) => set({ searchQuery: query, selectedTaskId: null })
}));
