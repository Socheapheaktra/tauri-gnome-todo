import { CalendarDays, Check, Flag, GripVertical, MoreHorizontal, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import type { ProjectSummary } from "@/stores/projectStore";
import type { Task } from "@/features/tasks/taskTypes";

type TaskListProps = {
  tasks: Task[];
  projects: ProjectSummary[];
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (task: Task) => void;
  onReorderTask: (sourceId: string, targetId: string) => void;
};

const priorityClasses = {
  low: "text-zinc-500",
  medium: "text-amber-600",
  high: "text-red-600"
};

export function TaskList({
  tasks,
  projects,
  selectedTaskId,
  onSelectTask,
  onToggleTask,
  onDeleteTask,
  onReorderTask
}: TaskListProps) {
  const projectNameById = new Map(projects.map((project) => [project.id, project.name]));

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={Check}
        title="No tasks"
        description="This view is clear. New tasks will appear here when they match the current view."
      />
    );
  }

  return (
    <div className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white shadow-sm">
      {tasks.map((task) => (
        <article
          className={`grid grid-cols-[auto_auto_minmax(0,1fr)_auto] gap-3 px-4 py-3 hover:bg-zinc-50 ${
            selectedTaskId === task.id ? "bg-blue-50" : ""
          }`}
          draggable
          key={task.id}
          onClick={() => onSelectTask(task.id)}
          onDragOver={(event) => event.preventDefault()}
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", task.id);
          }}
          onDrop={(event) => {
            event.preventDefault();
            const sourceId = event.dataTransfer.getData("text/plain");
            if (sourceId) {
              onReorderTask(sourceId, task.id);
            }
          }}
        >
          <button
            className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            type="button"
          >
            <GripVertical className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Drag {task.title}</span>
          </button>

          <button
            className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
              task.status === "completed"
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-zinc-400 hover:border-blue-600"
            }`}
            onClick={(event) => {
              event.stopPropagation();
              onToggleTask(task.id);
            }}
            type="button"
          >
            {task.status === "completed" ? (
              <Check className="h-3 w-3" aria-hidden="true" />
            ) : null}
            <span className="sr-only">
              {task.status === "completed" ? "Reopen" : "Complete"} {task.title}
            </span>
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3
                className={`truncate text-sm font-medium ${
                  task.status === "completed"
                    ? "text-zinc-500 line-through"
                    : "text-zinc-950"
                }`}
              >
                {task.title}
              </h3>
              {task.status === "in_progress" ? (
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  In Progress
                </span>
              ) : null}
              {task.status === "completed" ? (
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                  Completed
                </span>
              ) : null}
            </div>
            {task.description ? (
              <p className="mt-1 truncate text-sm text-zinc-600">{task.description}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              {task.dueDate ? (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatDate(task.dueDate)}
                </span>
              ) : null}
              <span className={`inline-flex items-center gap-1 ${priorityClasses[task.priority]}`}>
                <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                {formatPriority(task.priority)}
              </span>
              <span>{projectNameById.get(task.projectId) ?? "Unknown Project"}</span>
            </div>
          </div>

          <div className="flex">
            <button
              className="h-8 w-8 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              onClick={(event) => {
                event.stopPropagation();
                onSelectTask(task.id);
              }}
              type="button"
            >
              <MoreHorizontal className="mx-auto h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Task actions</span>
            </button>
            <button
              className="h-8 w-8 rounded-md text-zinc-500 hover:bg-red-50 hover:text-red-700"
              onClick={(event) => {
                event.stopPropagation();
                onDeleteTask(task);
              }}
              type="button"
            >
              <Trash2 className="mx-auto h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Delete task</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function formatPriority(priority: Task["priority"]) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}
