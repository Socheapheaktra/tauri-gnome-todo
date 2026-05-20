import { CalendarDays, ClipboardList, Flag, FolderKanban, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import type { ProjectSummary } from "@/stores/projectStore";
import type { CreateTaskDraft } from "@/stores/taskStore";
import type { TaskPriority } from "./taskTypes";

type TaskFormDialogProps = {
  open: boolean;
  projects: ProjectSummary[];
  selectedProjectId: string | null;
  onClose: () => void;
  onCreateTask: (draft: CreateTaskDraft) => void;
};

const priorityOptions: Array<{ value: TaskPriority; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

export function TaskFormDialog({
  open,
  projects,
  selectedProjectId,
  onClose,
  onCreateTask
}: TaskFormDialogProps) {
  const activeProjects = useMemo(
    () => projects.filter((project) => !project.isArchived),
    [projects]
  );
  const defaultProjectId = selectedProjectId ?? activeProjects[0]?.id ?? "";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(defaultProjectId);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle("");
    setDescription("");
    setProjectId(defaultProjectId);
    setDueDate("");
    setPriority("medium");
  }, [defaultProjectId, open]);

  const selectedProject = activeProjects.find((project) => project.id === projectId);
  const canSubmit = title.trim().length > 0 && projectId.length > 0;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-4xl overflow-hidden">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!canSubmit) {
              return;
            }

            onCreateTask({
              projectId,
              title,
              description,
              dueDate,
              priority
            });
            onClose();
          }}
        >
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>

          <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-4 px-4 py-4">
              <label className="block">
                <span className="text-sm font-medium text-zinc-700">Task</span>
                <input
                  autoFocus
                  className="mt-1 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-base font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="What needs to be done?"
                  value={title}
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-700">Description</span>
                <textarea
                  className="mt-1 min-h-44 w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Add context, acceptance notes, or reminders."
                  value={description}
                />
              </label>
            </div>

            <aside className="border-t border-zinc-200 bg-zinc-50 px-4 py-4 md:border-l md:border-t-0">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900">
                <ClipboardList className="h-4 w-4 text-blue-600" aria-hidden="true" />
                Details
              </div>

              {activeProjects.length === 0 ? (
                <div className="rounded-md border border-dashed border-zinc-300 bg-white px-3 py-4 text-sm text-zinc-600">
                  Create a project before adding tasks.
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
                      <FolderKanban className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                      Project
                    </span>
                    <select
                      className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      onChange={(event) => setProjectId(event.target.value)}
                      value={projectId}
                    >
                      {activeProjects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
                      <CalendarDays className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                      Due Date
                    </span>
                    <input
                      className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      onChange={(event) => setDueDate(event.target.value)}
                      type="date"
                      value={dueDate}
                    />
                  </label>

                  <label className="block">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
                      <Flag className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                      Priority
                    </span>
                    <select
                      className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      onChange={(event) => setPriority(event.target.value as TaskPriority)}
                      value={priority}
                    >
                      {priorityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="rounded-md border border-zinc-200 bg-white p-3 text-sm">
                    <p className="font-medium text-zinc-900">New task preview</p>
                    <p className="mt-2 text-zinc-600">{title.trim() || "Untitled task"}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {selectedProject?.name ?? "No project"} · {priority} priority
                    </p>
                  </div>
                </div>
              )}
            </aside>
          </div>

          <DialogFooter>
            <button
              className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
              disabled={!canSubmit}
              type="submit"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Task
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
