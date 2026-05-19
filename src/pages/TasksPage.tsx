import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { AddTaskForm } from "@/features/tasks/AddTaskForm";
import { DeleteTaskDialog } from "@/features/tasks/DeleteTaskDialog";
import { TaskDetailPanel } from "@/features/tasks/TaskDetailPanel";
import { TaskList } from "@/features/tasks/TaskList";
import type { Task } from "@/features/tasks/taskTypes";
import { useProjectStore } from "@/stores/projectStore";
import { useTaskStore } from "@/stores/taskStore";

export function TasksPage() {
  const projects = useProjectStore((state) => state.projects);
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const tasks = useTaskStore((state) => state.tasks);
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId);
  const createTask = useTaskStore((state) => state.createTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);
  const selectTask = useTaskStore((state) => state.selectTask);
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null);

  const activeProjects = useMemo(
    () => projects.filter((project) => !project.isArchived),
    [projects]
  );

  const visibleTasks = useMemo(() => {
    const baseTasks = selectedProjectId
      ? tasks.filter((task) => task.projectId === selectedProjectId)
      : tasks;

    return [...baseTasks].sort((first, second) => first.sortOrder - second.sortOrder);
  }, [selectedProjectId, tasks]);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null;
  const selectedProject = activeProjects.find((project) => project.id === selectedProjectId);
  const openTaskCount = visibleTasks.filter((task) => task.status !== "completed").length;
  const completedTaskCount = visibleTasks.filter((task) => task.status === "completed").length;
  const dueTodayCount = visibleTasks.filter((task) => task.dueDate === getToday()).length;

  return (
    <div className="grid min-h-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="min-w-0 px-6 py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-blue-700">
              {selectedProject ? "Project" : "Smart View"}
            </p>
            <h2 className="mt-1 truncate text-2xl font-semibold tracking-normal text-zinc-950">
              {selectedProject?.name ?? "All Tasks"}
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              {selectedProject?.description ??
                "Active tasks across projects, ordered by project position."}
            </p>
          </div>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
            onClick={() => selectTask(null)}
            type="button"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Task
          </button>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-xs text-zinc-500">Open</p>
            <p className="mt-1 text-lg font-semibold">{openTaskCount}</p>
          </div>
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-xs text-zinc-500">Due Today</p>
            <p className="mt-1 text-lg font-semibold">{dueTodayCount}</p>
          </div>
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-xs text-zinc-500">Completed</p>
            <p className="mt-1 text-lg font-semibold">{completedTaskCount}</p>
          </div>
        </div>

        <AddTaskForm
          onCreateTask={createTask}
          projects={activeProjects}
          selectedProjectId={selectedProjectId}
        />

        <TaskList
          onDeleteTask={setTaskPendingDelete}
          onReorderTask={reorderTasks}
          onSelectTask={selectTask}
          onToggleTask={toggleTaskCompletion}
          projects={projects}
          selectedTaskId={selectedTaskId}
          tasks={visibleTasks}
        />
      </section>

      <TaskDetailPanel
        onDeleteTask={setTaskPendingDelete}
        onUpdateTask={updateTask}
        projects={activeProjects}
        task={selectedTask}
      />

      <DeleteTaskDialog
        onClose={() => setTaskPendingDelete(null)}
        onConfirm={() => {
          if (taskPendingDelete) {
            deleteTask(taskPendingDelete.id);
            setTaskPendingDelete(null);
          }
        }}
        task={taskPendingDelete}
      />
    </div>
  );
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}
