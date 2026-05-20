import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Inbox,
  Plus,
  Search,
  Settings
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PropsWithChildren } from "react";

import { PreferencesDialog } from "@/features/settings/PreferencesDialog";
import { DeleteProjectDialog } from "@/features/projects/DeleteProjectDialog";
import { ProjectDialog } from "@/features/projects/ProjectDialog";
import { ProjectSidebarList } from "@/features/projects/ProjectSidebarList";
import {
  filterTasksBySmartView,
  smartViewLabels,
  type SmartView
} from "@/features/tasks/smartViews";
import type { ProjectSummary } from "@/stores/projectStore";
import { useProjectStore } from "@/stores/projectStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTaskStore } from "@/stores/taskStore";

const smartViews = [
  { id: "all", icon: Inbox },
  { id: "today", icon: CalendarDays },
  { id: "upcoming", icon: CalendarClock },
  { id: "overdue", icon: Clock3 },
  { id: "completed", icon: CheckCircle2 }
] satisfies Array<{
  id: SmartView;
  icon: typeof Inbox;
}>;

function HeaderButton({
  children,
  label,
  isPrimary = false,
  onClick
}: PropsWithChildren<{ label: string; isPrimary?: boolean; onClick?: () => void }>) {
  return (
    <button
      className={
        isPrimary
          ? "inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          : "inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      }
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

export function AppShell({ children }: PropsWithChildren) {
  const projects = useProjectStore((state) => state.projects);
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const projectsLoading = useProjectStore((state) => state.isLoading);
  const hydrateProjects = useProjectStore((state) => state.hydrateProjects);
  const createProject = useProjectStore((state) => state.createProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const archiveProject = useProjectStore((state) => state.archiveProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const selectProject = useProjectStore((state) => state.selectProject);
  const tasks = useTaskStore((state) => state.tasks);
  const tasksLoading = useTaskStore((state) => state.isLoading);
  const hydrateTasks = useTaskStore((state) => state.hydrateTasks);
  const selectedSmartView = useTaskStore((state) => state.selectedSmartView);
  const searchQuery = useTaskStore((state) => state.searchQuery);
  const selectSmartView = useTaskStore((state) => state.selectSmartView);
  const setSearchQuery = useTaskStore((state) => state.setSearchQuery);
  const selectTask = useTaskStore((state) => state.selectTask);
  const theme = useSettingsStore((state) => state.theme);
  const startupView = useSettingsStore((state) => state.startupView);
  const lastOpenedProjectId = useSettingsStore((state) => state.lastOpenedProjectId);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setStartupView = useSettingsStore((state) => state.setStartupView);
  const setLastOpenedProjectId = useSettingsStore((state) => state.setLastOpenedProjectId);
  const settingsLoading = useSettingsStore((state) => state.isLoading);
  const hydrateSettings = useSettingsStore((state) => state.hydrateSettings);
  const [projectDialogMode, setProjectDialogMode] = useState<"create" | "edit" | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectSummary | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectSummary | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const dataHydratedRef = useRef(false);
  const startupAppliedRef = useRef(false);

  const activeProjects = useMemo(
    () =>
      projects
        .filter((project) => !project.isArchived)
        .map((project) => ({
          ...project,
          taskCount: tasks.filter(
            (task) => task.projectId === project.id && task.status !== "completed"
          ).length
        })),
    [projects, tasks]
  );

  const closeProjectDialog = () => {
    setProjectDialogMode(null);
    setEditingProject(null);
  };

  useEffect(() => {
    if (dataHydratedRef.current) {
      return;
    }

    dataHydratedRef.current = true;
    void hydrateSettings();
    void hydrateProjects();
    void hydrateTasks();
  }, [hydrateProjects, hydrateSettings, hydrateTasks]);

  const openProjectDialog = () => setProjectDialogMode("create");
  const focusSearch = () => {
    const searchInput =
      window.matchMedia("(min-width: 768px)").matches
        ? desktopSearchRef.current
        : mobileSearchRef.current;

    searchInput?.focus();
    searchInput?.select();
  };
  const focusNewTask = () => {
    window.dispatchEvent(new CustomEvent("todo:new-task"));
  };

  useEffect(() => {
    const openProject = () => openProjectDialog();

    window.addEventListener("todo:new-project", openProject);
    return () => window.removeEventListener("todo:new-project", openProject);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const shouldUseDark = theme === "dark" || (theme === "system" && mediaQuery.matches);
      document.documentElement.classList.toggle("dark", shouldUseDark);
    };

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [theme]);

  useEffect(() => {
    if (startupAppliedRef.current) {
      return;
    }

    if (projectsLoading || settingsLoading || tasksLoading) {
      return;
    }

    startupAppliedRef.current = true;

    if (startupView === "today") {
      selectProject(null);
      selectSmartView("today");
      return;
    }

    if (startupView === "lastProject") {
      const lastProject = activeProjects.find((project) => project.id === lastOpenedProjectId);

      if (lastProject) {
        selectProject(lastProject.id);
        return;
      }
    }

    selectProject(null);
    selectSmartView("all");
  }, [
    activeProjects,
    lastOpenedProjectId,
    projectsLoading,
    selectProject,
    selectSmartView,
    settingsLoading,
    startupView,
    tasksLoading
  ]);

  useEffect(() => {
    if (!startupAppliedRef.current || selectedProjectId === null) {
      return;
    }

    setLastOpenedProjectId(selectedProjectId);
  }, [selectedProjectId, setLastOpenedProjectId]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        selectTask(null);
        desktopSearchRef.current?.blur();
        mobileSearchRef.current?.blur();
        return;
      }

      if (!event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        focusSearch();
        return;
      }

      if (event.key.toLowerCase() === "n" && event.shiftKey) {
        event.preventDefault();
        openProjectDialog();
        return;
      }

      if (event.key.toLowerCase() === "n" && !event.shiftKey) {
        event.preventDefault();
        focusNewTask();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [selectTask]);

  const smartViewCounts = useMemo(
    () =>
      smartViews.reduce<Record<SmartView, number>>(
        (counts, view) => ({
          ...counts,
          [view.id]: filterTasksBySmartView(tasks, view.id).length
        }),
        {
          all: 0,
          today: 0,
          upcoming: 0,
          overdue: 0,
          completed: 0
        }
      ),
    [tasks]
  );

  return (
    <div className="flex h-screen min-h-[560px] flex-col overflow-hidden bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-300 bg-zinc-50/95 px-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/95">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="truncate text-sm font-semibold">Tasks</h1>
          <label className="hidden h-8 min-w-[280px] items-center gap-2 rounded-md border border-zinc-300 bg-white px-2.5 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 md:flex">
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Search tasks</span>
            <input
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search tasks"
              ref={desktopSearchRef}
              value={searchQuery}
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <HeaderButton label="Add task" isPrimary onClick={focusNewTask}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Add Task</span>
          </HeaderButton>
          <HeaderButton label="Search" onClick={focusSearch}>
            <Search className="h-4 w-4" aria-hidden="true" />
          </HeaderButton>
          <HeaderButton label="Settings" onClick={() => setPreferencesOpen(true)}>
            <Settings className="h-4 w-4" aria-hidden="true" />
          </HeaderButton>
        </div>
      </header>
      <div className="border-b border-zinc-300 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900 md:hidden">
        <label className="flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-2.5 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Search tasks</span>
          <input
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search tasks"
            ref={mobileSearchRef}
            value={searchQuery}
          />
        </label>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(208px,248px)_minmax(0,1fr)]">
        <aside className="max-h-52 overflow-y-auto border-b border-zinc-300 bg-zinc-50 px-3 py-3 dark:border-zinc-800 dark:bg-zinc-900 md:max-h-none md:min-h-0 md:border-b-0 md:border-r md:py-4">
          <nav className="space-y-5" aria-label="Task navigation">
            <section>
              <h2 className="px-2 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                Views
              </h2>
              <div className="mt-2 space-y-1">
                {smartViews.map((item) => (
                  <button
                    className={`flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm ${
                      selectedSmartView === item.id && selectedProjectId === null
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
                        : "text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }`}
                    key={item.id}
                    onClick={() => {
                      selectProject(null);
                      selectSmartView(item.id);
                    }}
                    type="button"
                  >
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{smartViewLabels[item.id]}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {smartViewCounts[item.id]}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                  Projects
                </h2>
                <button
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  onClick={openProjectDialog}
                  type="button"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Add project</span>
                </button>
              </div>
              <div className="mt-2 space-y-1">
                <ProjectSidebarList
                  projects={activeProjects}
                  selectedProjectId={selectedProjectId}
                  onArchiveProject={(project) => archiveProject(project.id)}
                  onDeleteProject={setDeletingProject}
                  onEditProject={(project) => {
                    setEditingProject(project);
                    setProjectDialogMode("edit");
                  }}
                  onSelectProject={selectProject}
                />
              </div>
            </section>

            <section className="rounded-md border border-zinc-300 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-950">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                <Circle className="h-4 w-4 text-blue-600" aria-hidden="true" />
                Focus Queue
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {smartViewCounts.today} tasks due today
              </p>
            </section>
          </nav>
        </aside>

        <main className="min-h-0 min-w-0 overflow-y-auto bg-white dark:bg-zinc-950">
          {children}
        </main>
      </div>

      <ProjectDialog
        mode={projectDialogMode ?? "create"}
        onClose={closeProjectDialog}
        onSubmit={(draft) => {
          if (projectDialogMode === "edit" && editingProject) {
            updateProject(editingProject.id, draft);
          } else {
            createProject(draft);
          }

          closeProjectDialog();
        }}
        open={projectDialogMode !== null}
        project={editingProject}
      />
      <DeleteProjectDialog
        onClose={() => setDeletingProject(null)}
        onConfirm={() => {
          if (deletingProject) {
            deleteProject(deletingProject.id);
            setDeletingProject(null);
          }
        }}
        project={deletingProject}
      />
      <PreferencesDialog
        onClose={() => setPreferencesOpen(false)}
        onStartupViewChange={setStartupView}
        onThemeChange={setTheme}
        open={preferencesOpen}
        startupView={startupView}
        theme={theme}
      />
    </div>
  );
}
