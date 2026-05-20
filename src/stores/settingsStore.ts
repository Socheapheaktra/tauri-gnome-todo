import { create } from "zustand";

import * as api from "@/lib/tauriApi";

export type ThemePreference = "system" | "light" | "dark";
export type StartupViewPreference = "all" | "today" | "lastProject";

type PersistedSettings = {
  theme: ThemePreference;
  startupView: StartupViewPreference;
  lastOpenedProjectId: string | null;
};

interface SettingsState extends PersistedSettings {
  isLoading: boolean;
  error: string | null;
  hydrateSettings: () => Promise<void>;
  setTheme: (theme: ThemePreference) => Promise<void>;
  setStartupView: (startupView: StartupViewPreference) => Promise<void>;
  setLastOpenedProjectId: (projectId: string | null) => Promise<void>;
}

const storageKey = "gnome-todo-settings";

const defaultSettings: PersistedSettings = {
  theme: "system",
  startupView: "all",
  lastOpenedProjectId: null
};

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

  return settings;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  ...defaultSettings,
  isLoading: true,
  error: null,
  hydrateSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const setting = await api.getAppSetting<PersistedSettings>(storageKey);
      set({ ...(setting?.value ?? defaultSettings), isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },
  setTheme: async (theme) => {
    const settings = updateSettings(useSettingsStore.getState(), { theme });
    set({ ...settings, error: null });
    await persistSettings(settings, set);
  },
  setStartupView: async (startupView) => {
    const settings = updateSettings(useSettingsStore.getState(), { startupView });
    set({ ...settings, error: null });
    await persistSettings(settings, set);
  },
  setLastOpenedProjectId: async (lastOpenedProjectId) => {
    const settings = updateSettings(useSettingsStore.getState(), { lastOpenedProjectId });
    set({ ...settings, error: null });
    await persistSettings(settings, set);
  }
}));

async function persistSettings(
  settings: PersistedSettings,
  set: (
    partial:
      | Partial<SettingsState>
      | ((state: SettingsState) => Partial<SettingsState>)
  ) => void
) {
  try {
    await api.updateAppSetting(storageKey, settings);
  } catch (error) {
    set({ error: getErrorMessage(error) });
  }
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }

  return "Unable to update settings";
}
