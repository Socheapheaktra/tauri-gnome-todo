import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { DatePicker } from "@/components/ui/date-picker";
import type { Task, TaskPriority, TaskStatus } from "@/features/tasks/taskTypes";
import type { ProjectSummary } from "@/stores/projectStore";
import type { UpdateTaskDraft } from "@/stores/taskStore";

type TaskFormViewProps = {
  task: Task;
  projects: ProjectSummary[];
  onUpdateTask: (id: string, draft: UpdateTaskDraft) => void;
  onDeleteTask: (task: Task) => void;
  onBack: () => void;
};

export function TaskFormView({
  task,
  projects,
  onUpdateTask,
  onDeleteTask,
  onBack
}: TaskFormViewProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setProjectId(task.projectId);
    setDueDate(task.dueDate ?? getTodayDate());
    setPriority(task.priority);
    setStatus(task.status);
  }, [task]);

  const canSave = title.trim().length > 0 && projectId.length > 0;

  return (
    <section className="min-w-0 px-4 py-5 sm:px-6">
      <form
        className="mx-auto max-w-5xl"
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
          onBack();
        }}
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              onClick={onBack}
              title="Back to tasks"
              type="button"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Back to tasks</span>
            </button>
            <div className="min-w-0">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Task</p>
              <h2 className="mt-1 truncate text-2xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100">
                {task.title}
              </h2>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="inline-flex h-9 items-center gap-2 rounded-md border border-red-200 bg-white px-3 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:bg-zinc-950 dark:text-red-300 dark:hover:bg-red-950/40"
              onClick={() => onDeleteTask(task)}
              type="button"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete
            </button>
            <button
              className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
              disabled={!canSave}
              type="submit"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              Save
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</span>
            <input
              className="mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-blue-950"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Description
            </span>
            <textarea
              className="mt-1 min-h-56 w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-blue-950"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add task notes, context, or next steps"
              value={description}
            />
          </label>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-zinc-200 pt-5 sm:grid-cols-2 lg:grid-cols-4 dark:border-zinc-800">
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
            <div className="mt-1">
              <DatePicker value={dueDate} onChange={setDueDate} placeholder="Due date"/>
            </div>
          </label>

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
      </form>
    </section>
  );
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}
