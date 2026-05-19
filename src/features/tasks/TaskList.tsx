const placeholderTasks = [
  { id: "1", title: "Set up Tauri shell", status: "Planned" },
  { id: "2", title: "Configure Prisma schema", status: "Next" },
  { id: "3", title: "Build project sidebar", status: "Next" }
];

export function TaskList() {
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      {placeholderTasks.map((task) => (
        <div className="flex items-center justify-between border-b px-4 py-3 last:border-b-0" key={task.id}>
          <span className="text-sm font-medium">{task.title}</span>
          <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600">{task.status}</span>
        </div>
      ))}
    </div>
  );
}
