import { useEffect, useState } from "react";

import type { Task, TaskPriority, TaskStatus } from "@/features/tasks/taskTypes";
import type { ProjectSummary } from "@/stores/projectStore";
import type { UpdateTaskDraft } from "@/stores/taskStore";

type TaskDetailPanelProps = {
  task: Task | null;
  projects: ProjectSummary[];
  onUpdateTask: (id: string, draft: UpdateTaskDraft) => void;
  onDeleteTask: (task: Task) => void;
};

export function TaskDetailPanel({
  task,
  projects,
  onUpdateTask,
  onDeleteTask
}: TaskDetailPanelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");

  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setProjectId(task?.projectId ?? projects[0]?.id ?? "");
    setDueDate(task?.dueDate ?? "");
    setPriority(task?.priority ?? "medium");
    setStatus(task?.status ?? "todo");
  }, [projects, task]);

  if (!task) {
    return (
      <aside className="hidden min-h-full border-l border-zinc-200 bg-zinc-50 px-5 py-6 dark:border-zinc-800 dark:bg-zinc-900 xl:block">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Task Details</p>
        <div className="mt-4 rounded-md border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
          Select a task to edit its details.
        </div>
      </aside>
    );
  }

  const canSave = title.trim().length > 0 && projectId.length > 0;

  return (
    <aside className="hidden min-h-full border-l border-zinc-200 bg-zinc-50 px-5 py-6 dark:border-zinc-800 dark:bg-zinc-900 xl:block">
      <div className="mb-5">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Task Details</p>
        <h2 className="mt-1 line-clamp-2 text-lg font-semibold text-zinc-950 dark:text-zinc-100">
          {task.title}
        </h2>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSave) {
            return;
          }

          onUpdateTask(task.id, {
            projectId,
            title,
            description,
            dueDate,
            priority,
            status
          });
        }}
      >
        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</span>
          <input
            className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-blue-950"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-blue-950"
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Project</span>
          <select
            className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-blue-950"
            onChange={(event) => setProjectId(event.target.value)}
            value={projectId}
          >
            {projects
              .filter((project) => !project.isArchived)
              .map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Due Date</span>
          <input
            className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-blue-950"
            onChange={(event) => setDueDate(event.target.value)}
            type="date"
            value={dueDate}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Priority</span>
            <select
              className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-blue-950"
              onChange={(event) => setPriority(event.target.value as TaskPriority)}
              value={priority}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status</span>
            <select
              className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-blue-950"
              onChange={(event) => setStatus(event.target.value as TaskStatus)}
              value={status}
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            className="h-9 flex-1 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
            disabled={!canSave}
            type="submit"
          >
            Save
          </button>
          <button
            className="h-9 rounded-md border border-red-200 bg-white px-3 text-sm font-medium text-red-700 hover:bg-red-50"
            onClick={() => onDeleteTask(task)}
            type="button"
          >
            Delete
          </button>
        </div>
      </form>
    </aside>
  );
}
