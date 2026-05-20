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
    <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50/70 px-6 py-10 text-center shadow-sm">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-md border border-zinc-200 bg-white text-blue-600 shadow-sm">
        <Icon className="h-5 w-5" aria-hidden={true} />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-zinc-950">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-zinc-600">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
