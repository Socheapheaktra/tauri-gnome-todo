import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import { TaskList } from "./TaskList";
import type { Task } from "./taskTypes";
import type { ProjectSummary } from "@/stores/projectStore";

const projects: ProjectSummary[] = [
  {
    id: "project-alpha",
    name: "Desktop App",
    isArchived: false,
    taskCount: 1,
    createdAt: "2026-05-20T00:00:00.000Z",
    updatedAt: "2026-05-20T00:00:00.000Z"
  }
];

describe("TaskList", () => {
  it("renders an empty state when there are no tasks", () => {
    const markup = renderToStaticMarkup(
      <TaskList
        onDeleteTask={() => undefined}
        onReorderTask={() => undefined}
        onSelectTask={() => undefined}
        onToggleTask={() => undefined}
        projects={projects}
        selectedTaskId={null}
        tasks={[]}
      />
    );

    assert.match(markup, /No tasks/);
    assert.match(markup, /This view is clear/);
  });

  it("renders task metadata with project context", () => {
    const markup = renderToStaticMarkup(
      <TaskList
        onDeleteTask={() => undefined}
        onReorderTask={() => undefined}
        onSelectTask={() => undefined}
        onToggleTask={() => undefined}
        projects={projects}
        selectedTaskId="task-alpha"
        tasks={[
          makeTask("task-alpha", {
            description: "Confirm bundle targets",
            dueDate: "2026-05-20",
            priority: "high",
            title: "Review Linux packaging"
          })
        ]}
      />
    );

    assert.match(markup, /Review Linux packaging/);
    assert.match(markup, /Confirm bundle targets/);
    assert.match(markup, /High/);
    assert.match(markup, /Desktop App/);
  });

  it("renders task descriptions as markdown", () => {
    const markup = renderToStaticMarkup(
      <TaskList
        onDeleteTask={() => undefined}
        onReorderTask={() => undefined}
        onSelectTask={() => undefined}
        onToggleTask={() => undefined}
        projects={projects}
        selectedTaskId={null}
        tasks={[
          makeTask("task-markdown", {
            description: "**Confirm** `bundle` targets",
            title: "Review Linux packaging"
          })
        ]}
      />
    );

    assert.match(markup, /<strong/);
    assert.match(markup, /Confirm/);
    assert.match(markup, /<code/);
    assert.match(markup, /bundle/);
  });

  it("preserves line breaks in task descriptions", () => {
    const markup = renderToStaticMarkup(
      <TaskList
        onDeleteTask={() => undefined}
        onReorderTask={() => undefined}
        onSelectTask={() => undefined}
        onToggleTask={() => undefined}
        projects={projects}
        selectedTaskId={null}
        tasks={[
          makeTask("task-line-breaks", {
            description: "First line\nSecond line",
            title: "Review Linux packaging"
          })
        ]}
      />
    );

    assert.match(markup, /First line/);
    assert.match(markup, /<br/);
    assert.match(markup, /Second line/);
  });

  it("renders bullet lists in task descriptions", () => {
    const markup = renderToStaticMarkup(
      <TaskList
        onDeleteTask={() => undefined}
        onReorderTask={() => undefined}
        onSelectTask={() => undefined}
        onToggleTask={() => undefined}
        projects={projects}
        selectedTaskId={null}
        tasks={[
          makeTask("task-bullets", {
            description: "- First item\n- Second item",
            title: "Review Linux packaging"
          })
        ]}
      />
    );

    assert.match(markup, /<ul/);
    assert.match(markup, /<li/);
    assert.match(markup, /First item/);
    assert.match(markup, /Second item/);
  });
});

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
