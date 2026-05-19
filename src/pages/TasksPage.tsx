import { TaskList } from "@/features/tasks/TaskList";

export function TasksPage() {
  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-normal">Inbox</h2>
          <p className="mt-1 text-sm text-zinc-600">Capture tasks before assigning them to a project.</p>
        </div>
      </div>
      <TaskList />
    </section>
  );
}
