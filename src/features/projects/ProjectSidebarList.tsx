import { Archive, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { EmptyState } from "@/components/EmptyState";
import type { ProjectSummary } from "@/stores/projectStore";

type ProjectSidebarListProps = {
  projects: ProjectSummary[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onEditProject: (project: ProjectSummary) => void;
  onArchiveProject: (project: ProjectSummary) => void;
  onDeleteProject: (project: ProjectSummary) => void;
};

export function ProjectSidebarList({
  projects,
  selectedProjectId,
  onSelectProject,
  onEditProject,
  onArchiveProject,
  onDeleteProject
}: ProjectSidebarListProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={Pencil}
        title="No projects"
        description="Create a project to group related tasks."
      />
    );
  }

  return (
    <div className="space-y-1">
      {projects.map((project) => (
        <div className="group relative" key={project.id}>
          <button
            className={`flex h-9 w-full items-center gap-2 rounded-md px-2 pr-9 text-left text-sm ${
              selectedProjectId === project.id
                ? "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
                : "text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
            onClick={() => onSelectProject(project.id)}
            type="button"
          >
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <span className="min-w-0 flex-1 truncate">{project.name}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{project.taskCount}</span>
          </button>

          <div className="absolute right-1 top-1 flex opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
            <ProjectActionButton label="Edit project" onClick={() => onEditProject(project)}>
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            </ProjectActionButton>
            <ProjectActionButton label="Archive project" onClick={() => onArchiveProject(project)}>
              <Archive className="h-3.5 w-3.5" aria-hidden="true" />
            </ProjectActionButton>
            <ProjectActionButton label="Delete project" onClick={() => onDeleteProject(project)}>
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </ProjectActionButton>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectActionButton({
  children,
  label,
  onClick
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-zinc-50 text-zinc-500 hover:bg-white hover:text-zinc-950 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      title={label}
      type="button"
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}
