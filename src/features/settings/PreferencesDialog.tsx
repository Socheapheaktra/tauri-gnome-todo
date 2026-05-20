import { Check, Monitor, Moon, Settings, Sun } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import type {
  StartupViewPreference,
  ThemePreference
} from "@/stores/settingsStore";

type PreferencesDialogProps = {
  open: boolean;
  startupView: StartupViewPreference;
  theme: ThemePreference;
  onClose: () => void;
  onStartupViewChange: (startupView: StartupViewPreference) => void;
  onThemeChange: (theme: ThemePreference) => void;
};

const themeOptions: Array<{
  value: ThemePreference;
  label: string;
  description: string;
  icon: typeof Monitor;
}> = [
  {
    value: "system",
    label: "System",
    description: "Follow the desktop appearance.",
    icon: Monitor
  },
  {
    value: "light",
    label: "Light",
    description: "Use the bright GNOME-style interface.",
    icon: Sun
  },
  {
    value: "dark",
    label: "Dark",
    description: "Use a darker interface for low-light work.",
    icon: Moon
  }
];

const startupViewOptions: Array<{
  value: StartupViewPreference;
  label: string;
  description: string;
}> = [
  {
    value: "all",
    label: "All Tasks",
    description: "Start with every open task across active projects."
  },
  {
    value: "today",
    label: "Today",
    description: "Start with tasks due today."
  },
  {
    value: "lastProject",
    label: "Last Opened Project",
    description: "Return to the most recent project when available."
  }
];

export function PreferencesDialog({
  open,
  startupView,
  theme,
  onClose,
  onStartupViewChange,
  onThemeChange
}: PreferencesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="inline-flex items-center gap-2">
            <Settings className="h-4 w-4 text-blue-600" aria-hidden="true" />
            Preferences
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-4 py-4">
          <section>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">
              Theme
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {themeOptions.map((option) => (
                <PreferenceOption
                  description={option.description}
                  icon={option.icon}
                  key={option.value}
                  label={option.label}
                  onClick={() => onThemeChange(option.value)}
                  selected={theme === option.value}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">
              Startup View
            </h3>
            <div className="mt-3 space-y-2">
              {startupViewOptions.map((option) => (
                <button
                  className={`flex w-full items-start gap-3 rounded-md border px-3 py-3 text-left ${
                    startupView === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-950 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-100"
                      : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  }`}
                  key={option.value}
                  onClick={() => onStartupViewChange(option.value)}
                  type="button"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      startupView === option.value
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {startupView === option.value ? (
                      <Check className="h-3 w-3" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{option.label}</span>
                    <span className="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">
                      {option.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <DialogFooter>
          <button
            className="h-9 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700"
            onClick={onClose}
            type="button"
          >
            Done
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PreferenceOption({
  description,
  icon: Icon,
  label,
  selected,
  onClick
}: {
  description: string;
  icon: typeof Monitor;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-md border px-3 py-3 text-left ${
        selected
          ? "border-blue-500 bg-blue-50 text-blue-950 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-100"
          : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center justify-between gap-2">
        <Icon className="h-4 w-4 text-blue-600 dark:text-blue-300" aria-hidden="true" />
        {selected ? <Check className="h-4 w-4 text-blue-600" aria-hidden="true" /> : null}
      </div>
      <p className="mt-3 text-sm font-medium">{label}</p>
      <p className="mt-1 text-sm leading-5 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </button>
  );
}
