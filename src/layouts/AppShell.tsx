import { CalendarDays, CheckCircle2, Inbox, Plus, Settings } from "lucide-react";
import type { PropsWithChildren } from "react";

const navigationItems = [
  { label: "Inbox", icon: Inbox },
  { label: "Today", icon: CalendarDays },
  { label: "Completed", icon: CheckCircle2 }
];

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b bg-white px-4">
        <h1 className="text-sm font-semibold">Tasks</h1>
        <div className="flex items-center gap-2">
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white text-foreground hover:bg-zinc-100">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Add task</span>
          </button>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white text-foreground hover:bg-zinc-100">
            <Settings className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Settings</span>
          </button>
        </div>
      </header>
      <div className="grid flex-1 grid-cols-[240px_1fr]">
        <aside className="border-r bg-zinc-50 px-3 py-4">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <button
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-zinc-200"
                key={item.label}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 p-6">{children}</main>
      </div>
    </div>
  );
}
