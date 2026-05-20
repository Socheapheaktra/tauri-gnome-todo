import { invoke } from "@tauri-apps/api/core";

import type { Project } from "@/features/projects/projectTypes";
import type { Task } from "@/features/tasks/taskTypes";
import type { CreateTaskDraft, UpdateTaskDraft } from "@/stores/taskStore";
import type { ProjectDraft } from "@/stores/projectStore";

export type ReorderTaskPayload = {
  id: string;
  sortOrder: number;
};

export function listProjects(includeArchived = true) {
  return invoke<Project[]>("list_projects", { includeArchived });
}

export function createProject(payload: ProjectDraft) {
  return invoke<Project>("create_project", { payload });
}

export function updateProject(id: string, payload: ProjectDraft) {
  return invoke<Project>("update_project", { id, payload });
}

export function archiveProject(id: string) {
  return invoke<Project>("archive_project", { id });
}

export function deleteProject(id: string) {
  return invoke<Project>("delete_project", { id });
}

export function listTasks() {
  return invoke<Task[]>("list_all_tasks");
}

export function createTask(payload: CreateTaskDraft) {
  return invoke<Task>("create_task", { payload });
}

export function updateTask(id: string, payload: UpdateTaskDraft) {
  return invoke<Task>("update_task", { id, payload });
}

export function deleteTask(id: string) {
  return invoke<Task>("delete_task", { id });
}

export function completeTask(id: string) {
  return invoke<Task>("complete_task", { id });
}

export function reopenTask(id: string) {
  return invoke<Task>("reopen_task", { id });
}

export function reorderTasks(tasks: ReorderTaskPayload[]) {
  return invoke<Task[]>("reorder_tasks", { tasks });
}

export type AppSetting<T> = {
  key: string;
  value: T;
};

export function getAppSetting<T>(key: string) {
  return invoke<AppSetting<T> | null>("get_app_setting", { key });
}

export function updateAppSetting<T>(key: string, value: T) {
  return invoke<AppSetting<T>>("update_app_setting", { key, value });
}
