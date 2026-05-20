import { create } from "zustand";

export type ThemePreference = "system" | "light" | "dark";
export type StartupViewPreference = "all" | "today" | "lastProject";

type PersistedSettings = {
  theme: ThemePreference;
  startupView: StartupViewPreference;
  lastOpenedProjectId: string | null;
};

interface SettingsState extends PersistedSettings {
  setTheme: (theme: ThemePreference) => void;
  setStartupView: (startupView: StartupViewPreference) => void;
  setLastOpenedProjectId: (projectId: string | null) => void;
}

const storageKey = "gnome-todo-settings";

const defaultSettings: PersistedSettings = {
  theme: "system",
  startupView: "all",
  lastOpenedProjectId: null
};

function readSettings(): PersistedSettings {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  const rawSettings = window.localStorage.getItem(storageKey);

  if (!rawSettings) {
    return defaultSettings;
  }

  try {
    return { ...defaultSettings, ...JSON.parse(rawSettings) };
  } catch {
    return defaultSettings;
  }
}

function persistSettings(settings: PersistedSettings) {
  window.localStorage.setItem(storageKey, JSON.stringify(settings));
}

function updateSettings(
  state: SettingsState,
  nextSettings: Partial<PersistedSettings>
): PersistedSettings {
  const settings = {
    theme: "theme" in nextSettings ? nextSettings.theme ?? state.theme : state.theme,
    startupView:
      "startupView" in nextSettings
        ? nextSettings.startupView ?? state.startupView
        : state.startupView,
    lastOpenedProjectId:
      "lastOpenedProjectId" in nextSettings
        ? nextSettings.lastOpenedProjectId ?? null
        : state.lastOpenedProjectId
  };

  persistSettings(settings);
  return settings;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  ...readSettings(),
  setTheme: (theme) => set((state) => updateSettings(state, { theme })),
  setStartupView: (startupView) =>
    set((state) => updateSettings(state, { startupView })),
  setLastOpenedProjectId: (lastOpenedProjectId) =>
    set((state) => updateSettings(state, { lastOpenedProjectId }))
}));
