import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50/70 px-6 py-10 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-md border border-zinc-200 bg-white text-blue-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-blue-300">
        <Icon className="h-5 w-5" aria-hidden={true} />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-zinc-950 dark:text-zinc-100">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
