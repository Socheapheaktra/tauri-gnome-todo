import type { ProjectSummary } from "@/stores/projectStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

type DeleteProjectDialogProps = {
  project: ProjectSummary | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteProjectDialog({
  project,
  onClose,
  onConfirm
}: DeleteProjectDialogProps) {
  if (!project) {
    return null;
  }

  return (
    <Dialog open={project !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
        <DialogTitle id="delete-project-title">
          Delete {project.name}?
        </DialogTitle>
        <DialogDescription className="mt-2">
          This removes the project and its related tasks from this workspace.
        </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button
            className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="h-9 rounded-md bg-red-600 px-3 text-sm font-medium text-white hover:bg-red-700"
            onClick={onConfirm}
            type="button"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
