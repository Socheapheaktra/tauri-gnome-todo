import { create } from "zustand";

import type { SmartView } from "@/features/tasks/smartViews";
import type { Task, TaskPriority, TaskStatus } from "@/features/tasks/taskTypes";
import * as api from "@/lib/tauriApi";

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
  isLoading: boolean;
  error: string | null;
  hydrateTasks: () => Promise<void>;
  createTask: (draft: CreateTaskDraft) => Promise<void>;
  updateTask: (id: string, draft: UpdateTaskDraft) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  reorderTasks: (sourceId: string, targetId: string) => Promise<void>;
  selectTask: (id: string | null) => void;
  selectSmartView: (view: SmartView) => void;
  setSearchQuery: (query: string) => void;
}

function normalizeTaskOrder(tasks: Task[]) {
  return tasks.map((task, index) => ({ ...task, sortOrder: index }));
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  selectedTaskId: null,
  selectedSmartView: "all",
  searchQuery: "",
  isLoading: true,
  error: null,
  hydrateTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await api.listTasks();
      set({ tasks, selectedTaskId: null, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },
  createTask: async (draft) => {
    try {
      const task = await api.createTask(draft);
      set((state) => ({
        tasks: [...state.tasks, task],
        selectedTaskId: null,
        error: null
      }));
    } catch (error) {
      set({ error: getErrorMessage(error) });
    }
  },
  updateTask: async (id, draft) => {
    try {
      const updatedTask = await api.updateTask(id, draft);
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        error: null
      }));
    } catch (error) {
      set({ error: getErrorMessage(error) });
    }
  },
  deleteTask: async (id) => {
    try {
      await api.deleteTask(id);
      set((state) => {
        const remainingTasks = normalizeTaskOrder(state.tasks.filter((task) => task.id !== id));

        return {
          tasks: remainingTasks,
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
          error: null
        };
      });
    } catch (error) {
      set({ error: getErrorMessage(error) });
    }
  },
  toggleTaskCompletion: async (id) => {
    const task = useTaskStore.getState().tasks.find((task) => task.id === id);
    if (!task) {
      return;
    }

    try {
      const updatedTask =
        task.status === "completed" ? await api.reopenTask(id) : await api.completeTask(id);
      set((state) => ({
        tasks: state.tasks.map((currentTask) =>
          currentTask.id === id ? updatedTask : currentTask
        ),
        error: null
      }));
    } catch (error) {
      set({ error: getErrorMessage(error) });
    }
  },
  reorderTasks: async (sourceId, targetId) => {
    const state = useTaskStore.getState();
    const sourceIndex = state.tasks.findIndex((task) => task.id === sourceId);
    const targetIndex = state.tasks.findIndex((task) => task.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
      return;
    }

    const reorderedTasks = [...state.tasks];
    const [sourceTask] = reorderedTasks.splice(sourceIndex, 1);
    reorderedTasks.splice(targetIndex, 0, sourceTask);
    const normalizedTasks = normalizeTaskOrder(reorderedTasks);

    set({ tasks: normalizedTasks });

    try {
      const updatedTasks = await api.reorderTasks(
        normalizedTasks.map((task) => ({ id: task.id, sortOrder: task.sortOrder }))
      );
      const updatedById = new Map(updatedTasks.map((task) => [task.id, task]));
      set((currentState) => ({
        tasks: currentState.tasks.map((task) => updatedById.get(task.id) ?? task),
        error: null
      }));
    } catch (error) {
      set({ tasks: state.tasks, error: getErrorMessage(error) });
    }
  },
  selectTask: (id) => set({ selectedTaskId: id }),
  selectSmartView: (view) => set({ selectedSmartView: view, selectedTaskId: null }),
  setSearchQuery: (query) => set({ searchQuery: query, selectedTaskId: null })
}));

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }

  return "Unable to update tasks";
}
