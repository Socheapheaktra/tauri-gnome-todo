import type { Task } from "@/features/tasks/taskTypes";

export type SmartView = "all" | "today" | "upcoming" | "overdue" | "completed";

export const smartViewLabels: Record<SmartView, string> = {
  all: "All Tasks",
  today: "Today",
  upcoming: "Upcoming",
  overdue: "Overdue",
  completed: "Completed"
};

export const smartViewDescriptions: Record<SmartView, string> = {
  all: "All incomplete tasks across projects.",
  today: "Tasks due today.",
  upcoming: "Future scheduled tasks.",
  overdue: "Tasks past their due date.",
  completed: "Completed tasks grouped by completion date."
};

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function filterTasksBySmartView(tasks: Task[], view: SmartView, today = getTodayDate()) {
  switch (view) {
    case "today":
      return tasks.filter((task) => task.status !== "completed" && task.dueDate === today);
    case "upcoming":
      return tasks.filter(
        (task) => task.status !== "completed" && task.dueDate !== undefined && task.dueDate > today
      );
    case "overdue":
      return tasks.filter(
        (task) => task.status !== "completed" && task.dueDate !== undefined && task.dueDate < today
      );
    case "completed":
      return tasks.filter((task) => task.status === "completed");
    case "all":
    default:
      return tasks.filter((task) => task.status !== "completed");
  }
}

export function groupCompletedTasksByDate(tasks: Task[]) {
  return tasks.reduce<Record<string, Task[]>>((groups, task) => {
    const key = task.completedAt?.slice(0, 10) ?? "Unknown";
    return {
      ...groups,
      [key]: [...(groups[key] ?? []), task]
    };
  }, {});
}

export function formatSmartDate(value: string) {
  if (value === "Unknown") {
    return "Unknown completion date";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}
