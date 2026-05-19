import type { Task } from "@/features/tasks/taskTypes";
import type { ProjectSummary } from "@/stores/projectStore";

export function searchTasks(tasks: Task[], projects: ProjectSummary[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const projectNameById = new Map(
    projects.map((project) => [project.id, project.name.toLowerCase()])
  );

  return tasks.filter((task) => {
    const title = task.title.toLowerCase();
    const description = task.description?.toLowerCase() ?? "";
    const projectName = projectNameById.get(task.projectId) ?? "";

    return (
      title.includes(normalizedQuery) ||
      description.includes(normalizedQuery) ||
      projectName.includes(normalizedQuery)
    );
  });
}
