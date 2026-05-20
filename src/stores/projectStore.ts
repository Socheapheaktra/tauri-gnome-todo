import { create } from "zustand";

import type { Project } from "@/features/projects/projectTypes";
import * as api from "@/lib/tauriApi";

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
  isLoading: boolean;
  error: string | null;
  hydrateProjects: () => Promise<void>;
  createProject: (draft: ProjectDraft) => Promise<void>;
  updateProject: (id: string, draft: ProjectDraft) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  selectProject: (id: string | null) => void;
}

function toProjectSummary(project: Project): ProjectSummary {
  return { ...project, taskCount: 0 };
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProjectId: null,
  isLoading: true,
  error: null,
  hydrateProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await api.listProjects(true);
      set({ projects: projects.map(toProjectSummary), isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },
  createProject: async (draft) => {
    try {
      const project = toProjectSummary(await api.createProject(draft));
      set((state) => ({
        projects: [...state.projects, project],
        selectedProjectId: project.id,
        error: null
      }));
    } catch (error) {
      set({ error: getErrorMessage(error) });
    }
  },
  updateProject: async (id, draft) => {
    try {
      const updatedProject = toProjectSummary(await api.updateProject(id, draft));
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? { ...updatedProject, taskCount: project.taskCount } : project
        ),
        error: null
      }));
    } catch (error) {
      set({ error: getErrorMessage(error) });
    }
  },
  archiveProject: async (id) => {
    try {
      const archivedProject = toProjectSummary(await api.archiveProject(id));
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? { ...archivedProject, taskCount: project.taskCount } : project
        ),
        selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
        error: null
      }));
    } catch (error) {
      set({ error: getErrorMessage(error) });
    }
  },
  deleteProject: async (id) => {
    try {
      await api.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
        error: null
      }));
    } catch (error) {
      set({ error: getErrorMessage(error) });
    }
  },
  selectProject: (id) => set({ selectedProjectId: id })
}));

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }

  return "Unable to update projects";
}
