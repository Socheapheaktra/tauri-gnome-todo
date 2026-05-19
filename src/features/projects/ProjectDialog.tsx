import { useEffect, useId, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import type { ProjectSummary, ProjectDraft } from "@/stores/projectStore";

const projectColors = ["#3584e4", "#2ec27e", "#e5a50a", "#e66100", "#c061cb", "#26a269"];

type ProjectDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  project?: ProjectSummary | null;
  onClose: () => void;
  onSubmit: (draft: ProjectDraft) => void;
};

export function ProjectDialog({
  open,
  mode,
  project,
  onClose,
  onSubmit
}: ProjectDialogProps) {
  const titleId = useId();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(projectColors[0]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(project?.name ?? "");
    setDescription(project?.description ?? "");
    setColor(project?.color ?? projectColors[0]);
  }, [open, project]);

  if (!open) {
    return null;
  }

  const canSubmit = name.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent aria-labelledby={titleId}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSubmit) {
            return;
          }

          onSubmit({ name, description, color });
        }}
      >
        <DialogHeader>
          <DialogTitle id={titleId}>
            {mode === "create" ? "Create Project" : "Edit Project"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-4 py-4">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Name</span>
            <input
              autoFocus
              className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              onChange={(event) => setName(event.target.value)}
              placeholder="Project name"
              value={name}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Description</span>
            <textarea
              className="mt-1 min-h-20 w-full resize-none rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional project notes"
              value={description}
            />
          </label>

          <fieldset>
            <legend className="text-sm font-medium text-zinc-700">Color</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {projectColors.map((projectColor) => (
                <button
                  aria-label={`Use color ${projectColor}`}
                  className={`h-7 w-7 rounded-full border-2 ${
                    color === projectColor ? "border-zinc-950" : "border-transparent"
                  }`}
                  key={projectColor}
                  onClick={() => setColor(projectColor)}
                  style={{ backgroundColor: projectColor }}
                  type="button"
                />
              ))}
            </div>
          </fieldset>
        </div>

        <DialogFooter>
          <button
            className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="h-9 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
            disabled={!canSubmit}
            type="submit"
          >
            {mode === "create" ? "Create" : "Save"}
          </button>
        </DialogFooter>
      </form>
      </DialogContent>
    </Dialog>
  );
}
