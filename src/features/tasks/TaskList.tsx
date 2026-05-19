import { CalendarDays, Flag, MoreHorizontal } from "lucide-react";

const placeholderTasks = [
  {
    id: "1",
    title: "Wire project commands to the UI",
    description: "Connect the shell to the Tauri command contracts.",
    dueDate: "Today",
    priority: "High",
    project: "Desktop App",
    status: "todo"
  },
  {
    id: "2",
    title: "Sketch project management dialogs",
    description: "Create and edit project flows for the sidebar.",
    dueDate: "Tomorrow",
    priority: "Medium",
    project: "Desktop App",
    status: "todo"
  },
  {
    id: "3",
    title: "Review database command error copy",
    description: "Keep user-facing failures short and actionable.",
    dueDate: "Friday",
    priority: "Low",
    project: "Home",
    status: "in_progress"
  }
];

export function TaskList() {
  return (
    <div className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white">
      {placeholderTasks.map((task) => (
        <article
          className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 px-4 py-3 hover:bg-zinc-50"
          key={task.id}
        >
          <button
            className="mt-0.5 h-5 w-5 rounded-full border-2 border-zinc-400 hover:border-blue-600"
            type="button"
          >
            <span className="sr-only">Complete {task.title}</span>
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="truncate text-sm font-medium text-zinc-950">{task.title}</h3>
              {task.status === "in_progress" ? (
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  In Progress
                </span>
              ) : null}
            </div>
            <p className="mt-1 truncate text-sm text-zinc-600">{task.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                {task.dueDate}
              </span>
              <span className="inline-flex items-center gap-1">
                <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                {task.priority}
              </span>
              <span>{task.project}</span>
            </div>
          </div>

          <button
            className="h-8 w-8 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            type="button"
          >
            <MoreHorizontal className="mx-auto h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Task actions</span>
          </button>
        </article>
      ))}
    </div>
  );
}
