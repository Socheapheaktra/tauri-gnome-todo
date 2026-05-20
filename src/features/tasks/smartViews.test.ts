import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  filterTasksBySmartView,
  formatSmartDate,
  groupCompletedTasksByDate
} from "./smartViews";
import type { Task } from "./taskTypes";

const tasks: Task[] = [
  makeTask("open-today", { dueDate: "2026-05-20" }),
  makeTask("open-upcoming", { dueDate: "2026-05-21" }),
  makeTask("open-overdue", { dueDate: "2026-05-19" }),
  makeTask("unscheduled"),
  makeTask("completed-today", {
    completedAt: "2026-05-20T08:30:00.000Z",
    dueDate: "2026-05-20",
    status: "completed"
  }),
  makeTask("completed-unknown", {
    completedAt: undefined,
    status: "completed"
  })
];

describe("filterTasksBySmartView", () => {
  it("returns all incomplete tasks for the all view", () => {
    assert.deepEqual(ids(filterTasksBySmartView(tasks, "all", "2026-05-20")), [
      "open-today",
      "open-upcoming",
      "open-overdue",
      "unscheduled"
    ]);
  });

  it("returns only incomplete tasks due today", () => {
    assert.deepEqual(ids(filterTasksBySmartView(tasks, "today", "2026-05-20")), [
      "open-today"
    ]);
  });

  it("separates upcoming and overdue scheduled tasks", () => {
    assert.deepEqual(ids(filterTasksBySmartView(tasks, "upcoming", "2026-05-20")), [
      "open-upcoming"
    ]);
    assert.deepEqual(ids(filterTasksBySmartView(tasks, "overdue", "2026-05-20")), [
      "open-overdue"
    ]);
  });

  it("returns completed tasks for the completed view", () => {
    assert.deepEqual(ids(filterTasksBySmartView(tasks, "completed", "2026-05-20")), [
      "completed-today",
      "completed-unknown"
    ]);
  });
});

describe("groupCompletedTasksByDate", () => {
  it("groups by completion date and keeps unknown completions separate", () => {
    const groups = groupCompletedTasksByDate(filterTasksBySmartView(tasks, "completed"));

    assert.deepEqual(ids(groups["2026-05-20"]), ["completed-today"]);
    assert.deepEqual(ids(groups.Unknown), ["completed-unknown"]);
  });
});

describe("formatSmartDate", () => {
  it("formats unknown completion dates with explicit copy", () => {
    assert.equal(formatSmartDate("Unknown"), "Unknown completion date");
  });
});

function ids(value: Task[] | undefined) {
  return (value ?? []).map((task) => task.id);
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
