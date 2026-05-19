import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import type { Task } from "@/features/tasks/taskTypes";

type DeleteTaskDialogProps = {
  task: Task | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteTaskDialog({ task, onClose, onConfirm }: DeleteTaskDialogProps) {
  if (!task) {
    return null;
  }

  return (
    <Dialog open={task !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete task?</DialogTitle>
          <DialogDescription className="mt-2">
            This removes "{task.title}" from the current task list.
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
