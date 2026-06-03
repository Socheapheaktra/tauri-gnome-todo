import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { TaskStatusBar } from "./TaskStatusBar";

describe("TaskStatusBar", () => {
  it("renders every task status as a selectable step", () => {
    const markup = renderToStaticMarkup(
      <TaskStatusBar value="in_progress" onChange={() => undefined} />
    );

    assert.match(markup, /role="radiogroup"/);
    assert.match(markup, /Todo/);
    assert.match(markup, /In Progress/);
    assert.match(markup, /Completed/);
    assert.match(markup, /aria-checked="true"/);
  });
});
