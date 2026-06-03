import { Check } from "lucide-react";

import type { TaskStatus } from "@/features/tasks/taskTypes";
import { cn } from "@/lib/utils";

type TaskStatusBarProps = {
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
};

const statusSteps: Array<{ value: TaskStatus; label: string }> = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" }
];

export function TaskStatusBar({ value, onChange }: TaskStatusBarProps) {
  const currentIndex = statusSteps.findIndex((step) => step.value === value);

  return (
    <div
      aria-label="Task status"
      className="inline-flex max-w-full items-stretch overflow-x-auto rounded-md border border-zinc-300 bg-zinc-100 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      role="radiogroup"
    >
      {statusSteps.map((step, index) => {
        const selected = step.value === value;
        const completed = index < currentIndex;
        const isLast = index === statusSteps.length - 1;

        return (
          <button
            aria-checked={selected}
            className={cn(
              "relative inline-flex h-9 shrink-0 cursor-pointer items-center justify-start gap-1.5 border-r border-zinc-300 py-1.5 pl-3 pr-7 font-medium outline-none transition last:border-r-0 focus:z-20 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:focus:ring-blue-950",
              index > 0 && "pl-8",
              isLast && "pr-4",
              completed &&
                "bg-blue-50 text-blue-800 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-950/60",
              selected &&
                "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700",
              !completed &&
                !selected &&
                "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
            )}
            key={step.value}
            onClick={() => onChange(step.value)}
            role="radio"
            style={{
              clipPath: getStepClipPath(index, isLast),
              marginLeft: index > 0 ? "-0.75rem" : undefined
            }}
            type="button"
          >
            {completed ? (
              <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : null}
            <span className="whitespace-nowrap">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function getStepClipPath(index: number, isLast: boolean) {
  if (index === 0 && isLast) {
    return undefined;
  }

  if (index === 0) {
    return "polygon(0 0, calc(100% - 0.75rem) 0, 100% 50%, calc(100% - 0.75rem) 100%, 0 100%)";
  }

  if (isLast) {
    return "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0.75rem 50%)";
  }

  return "polygon(0 0, calc(100% - 0.75rem) 0, 100% 50%, calc(100% - 0.75rem) 100%, 0 100%, 0.75rem 50%)";
}
