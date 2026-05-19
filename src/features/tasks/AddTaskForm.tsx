import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import type { TaskPriority } from "@/features/tasks/taskTypes";
import type { ProjectSummary } from "@/stores/projectStore";
import type { CreateTaskDraft } from "@/stores/taskStore";

type AddTaskFormProps = {
  projects: ProjectSummary[];
  selectedProjectId: string | null;
  onCreateTask: (draft: CreateTaskDraft) => void;
};

export function AddTaskForm({
  projects,
  selectedProjectId,
  onCreateTask
}: AddTaskFormProps) {
  const activeProjects = useMemo(
    () => projects.filter((project) => !project.isArchived),
    [projects]
  );
  const defaultProjectId = selectedProjectId ?? activeProjects[0]?.id ?? "";
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(defaultProjectId);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const canSubmit = title.trim().length > 0 && projectId.length > 0;

  return (
    <form
      className="mb-4 rounded-md border border-zinc-200 bg-zinc-50 p-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSubmit) {
          return;
        }

        onCreateTask({
          projectId,
          title,
          dueDate,
          priority
        });
        setTitle("");
      }}
    >
      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_160px_140px_120px_auto]">
        <input
          className="h-9 min-w-0 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a task"
          value={title}
        />
        <select
          className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          onChange={(event) => setProjectId(event.target.value)}
          value={projectId}
        >
          {activeProjects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <input
          className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          onChange={(event) => setDueDate(event.target.value)}
          type="date"
          value={dueDate}
        />
        <select
          className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm capitalize outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          onChange={(event) => setPriority(event.target.value as TaskPriority)}
          value={priority}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
          disabled={!canSubmit}
          type="submit"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add
        </button>
      </div>
    </form>
  );
}
