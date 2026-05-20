import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { searchTasks } from "./search";
import type { Task } from "./taskTypes";
import type { ProjectSummary } from "@/stores/projectStore";

const projects: ProjectSummary[] = [
  makeProject("project-alpha", "Desktop App"),
  makeProject("project-beta", "Home")
];

const tasks: Task[] = [
  makeTask("task-title", {
    title: "Wire preferences dialog",
    projectId: "project-alpha"
  }),
  makeTask("task-description", {
    description: "Buy replacement filters",
    projectId: "project-beta",
    title: "Maintenance"
  }),
  makeTask("task-project", {
    projectId: "project-alpha",
    title: "Review bundle metadata"
  })
];

describe("searchTasks", () => {
  it("matches task titles case-insensitively", () => {
    assert.deepEqual(ids(searchTasks(tasks, projects, "PREFERENCES")), ["task-title"]);
  });

  it("matches task descriptions", () => {
    assert.deepEqual(ids(searchTasks(tasks, projects, "filters")), ["task-description"]);
  });

  it("matches project names", () => {
    assert.deepEqual(ids(searchTasks(tasks, projects, "desktop")), [
      "task-title",
      "task-project"
    ]);
  });

  it("returns no results for blank queries", () => {
    assert.deepEqual(searchTasks(tasks, projects, "   "), []);
  });
});

function ids(value: Task[]) {
  return value.map((task) => task.id);
}

function makeTask(id: string, overrides: Partial<Task> = {}): Task {
  return {
    id,
    projectId: "project-alpha",
    title: id,
    status: "todo",
    priority: "medium",
    sortOrder: 0,
    createdAt: "2026-05-20T00:00:00.000Z",
    updatedAt: "2026-05-20T00:00:00.000Z",
    ...overrides
  };
}

function makeProject(id: string, name: string): ProjectSummary {
  return {
    id,
    name,
    isArchived: false,
    taskCount: 0,
    createdAt: "2026-05-20T00:00:00.000Z",
    updatedAt: "2026-05-20T00:00:00.000Z"
  };
}
