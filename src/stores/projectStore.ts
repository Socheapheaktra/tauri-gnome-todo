import { create } from "zustand";

import type { Project } from "@/features/projects/projectTypes";

export type ProjectSummary = Project & {
  taskCount: number;
};

export type ProjectDraft = {
  name: string;
  description?: string;
  color?: string;
};

interface ProjectState {
  projects: ProjectSummary[];
  selectedProjectId: string | null;
  createProject: (draft: ProjectDraft) => void;
  updateProject: (id: string, draft: ProjectDraft) => void;
  archiveProject: (id: string) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;
}

const now = new Date().toISOString();

const initialProjects: ProjectSummary[] = [
  {
    id: "project-personal",
    name: "Personal",
    description: "Personal errands and reminders.",
    color: "#2ec27e",
    isArchived: false,
    taskCount: 5,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "project-home",
    name: "Home",
    description: "Household maintenance and planning.",
    color: "#e5a50a",
    isArchived: false,
    taskCount: 3,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "project-desktop-app",
    name: "Desktop App",
    description: "GNOME-inspired Tauri TODO app work.",
    color: "#3584e4",
    isArchived: false,
    taskCount: 4,
    createdAt: now,
    updatedAt: now
  }
];

function createProjectId() {
  return `project-${crypto.randomUUID()}`;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: initialProjects,
  selectedProjectId: null,
  createProject: (draft) =>
    set((state) => {
      const createdAt = new Date().toISOString();
      const project: ProjectSummary = {
        id: createProjectId(),
        name: draft.name.trim(),
        description: draft.description?.trim() || undefined,
        color: draft.color,
        isArchived: false,
        taskCount: 0,
        createdAt,
        updatedAt: createdAt
      };

      return {
        projects: [...state.projects, project],
        selectedProjectId: project.id
      };
    }),
  updateProject: (id, draft) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? {
              ...project,
              name: draft.name.trim(),
              description: draft.description?.trim() || undefined,
              color: draft.color,
              updatedAt: new Date().toISOString()
            }
          : project
      )
    })),
  archiveProject: (id) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? { ...project, isArchived: true, updatedAt: new Date().toISOString() }
          : project
      ),
      selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId
    })),
  selectProject: (id) => set({ selectedProjectId: id })
}));
