import { CalendarDays, CheckCircle2, Plus } from "lucide-react";

import { TaskList } from "@/features/tasks/TaskList";

export function TasksPage() {
  return (
    <div className="grid min-h-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="min-w-0 px-6 py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-blue-700">Smart View</p>
            <h2 className="mt-1 truncate text-2xl font-semibold tracking-normal text-zinc-950">
              All Tasks
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Active tasks across projects, ordered by project position.
            </p>
          </div>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
            type="button"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Task
          </button>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-xs text-zinc-500">Open</p>
            <p className="mt-1 text-lg font-semibold">12</p>
          </div>
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-xs text-zinc-500">Due Today</p>
            <p className="mt-1 text-lg font-semibold">4</p>
          </div>
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-xs text-zinc-500">Overdue</p>
            <p className="mt-1 text-lg font-semibold">2</p>
          </div>
        </div>

        <TaskList />
      </section>

      <aside className="hidden min-h-full border-l border-zinc-200 bg-zinc-50 px-5 py-6 lg:block">
        <div className="mb-5">
          <p className="text-sm font-medium text-zinc-500">Task Details</p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-950">
            Wire project commands to the UI
          </h2>
        </div>

        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-zinc-500">Project</dt>
            <dd className="mt-1 font-medium text-zinc-900">Desktop App</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Status</dt>
            <dd className="mt-1 inline-flex items-center gap-2 rounded-md bg-white px-2 py-1 font-medium text-zinc-900">
              <CheckCircle2 className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              Todo
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Due Date</dt>
            <dd className="mt-1 inline-flex items-center gap-2 font-medium text-zinc-900">
              <CalendarDays className="h-4 w-4 text-blue-600" aria-hidden="true" />
              Today
            </dd>
          </div>
        </dl>

        <div className="mt-6 rounded-md border border-zinc-200 bg-white p-3">
          <p className="text-sm text-zinc-600">
            Detail editing controls will attach here when task forms are added.
          </p>
        </div>
      </aside>
    </div>
  );
}
