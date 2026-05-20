import { CheckCircle2, FolderPlus, Plus, SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/EmptyState";
import { DeleteTaskDialog } from "@/features/tasks/DeleteTaskDialog";
import { TaskDetailPanel } from "@/features/tasks/TaskDetailPanel";
import { TaskFormDialog } from "@/features/tasks/TaskFormDialog";
import { TaskList } from "@/features/tasks/TaskList";
import { searchTasks } from "@/features/tasks/search";
import {
  filterTasksBySmartView,
  formatSmartDate,
  groupCompletedTasksByDate,
  smartViewDescriptions,
  smartViewLabels
} from "@/features/tasks/smartViews";
import type { Task } from "@/features/tasks/taskTypes";
import { useProjectStore } from "@/stores/projectStore";
import { useTaskStore } from "@/stores/taskStore";

export function TasksPage() {
  const projects = useProjectStore((state) => state.projects);
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const tasks = useTaskStore((state) => state.tasks);
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId);
  const selectedSmartView = useTaskStore((state) => state.selectedSmartView);
  const searchQuery = useTaskStore((state) => state.searchQuery);
  const createTask = useTaskStore((state) => state.createTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);
  const selectTask = useTaskStore((state) => state.selectTask);
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  useEffect(() => {
    const openTaskDialog = () => setTaskDialogOpen(true);

    window.addEventListener("todo:new-task", openTaskDialog);
    return () => window.removeEventListener("todo:new-task", openTaskDialog);
  }, []);

  const activeProjects = useMemo(
    () => projects.filter((project) => !project.isArchived),
    [projects]
  );

  const activeTasks = useMemo(() => {
    const activeProjectIds = new Set(activeProjects.map((project) => project.id));
    return tasks.filter((task) => activeProjectIds.has(task.projectId));
  }, [activeProjects, tasks]);

  const isSearching = searchQuery.trim().length > 0;

  const visibleTasks = useMemo(() => {
    if (isSearching) {
      return searchTasks(activeTasks, activeProjects, searchQuery).sort(
        (first, second) => first.sortOrder - second.sortOrder
      );
    }

    const baseTasks = selectedProjectId
      ? activeTasks.filter((task) => task.projectId === selectedProjectId)
      : filterTasksBySmartView(activeTasks, selectedSmartView);

    return [...baseTasks].sort((first, second) => first.sortOrder - second.sortOrder);
  }, [
    activeProjects,
    activeTasks,
    isSearching,
    searchQuery,
    selectedProjectId,
    selectedSmartView
  ]);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null;
  const selectedProject = activeProjects.find((project) => project.id === selectedProjectId);
  const openTaskCount = visibleTasks.filter((task) => task.status !== "completed").length;
  const completedTaskCount = visibleTasks.filter((task) => task.status === "completed").length;
  const dueTodayCount = visibleTasks.filter((task) => task.dueDate === getToday()).length;
  const completedGroups = groupCompletedTasksByDate(visibleTasks);
  const completedGroupEntries = Object.entries(completedGroups).sort(([first], [second]) =>
    second.localeCompare(first)
  );
  const pageTitle = isSearching
    ? "Search Results"
    : selectedProject?.name ?? smartViewLabels[selectedSmartView];
  const pageDescription = isSearching
    ? `Matching tasks for "${searchQuery.trim()}".`
    : selectedProject?.description ?? smartViewDescriptions[selectedSmartView];

  return (
    <div className="grid min-h-full grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="min-w-0 px-4 py-5 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-blue-700">
              {isSearching ? "Search" : selectedProject ? "Project" : "Smart View"}
            </p>
            <h2 className="mt-1 truncate text-2xl font-semibold tracking-normal text-zinc-950">
              {pageTitle}
            </h2>
            <p className="mt-1 text-sm text-zinc-600">{pageDescription}</p>
          </div>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
            onClick={() => window.dispatchEvent(new CustomEvent("todo:new-task"))}
            type="button"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Task
          </button>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-xs text-zinc-500">Open</p>
            <p className="mt-1 text-lg font-semibold">{openTaskCount}</p>
          </div>
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-xs text-zinc-500">Due Today</p>
            <p className="mt-1 text-lg font-semibold">{dueTodayCount}</p>
          </div>
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
            <p className="text-xs text-zinc-500">Completed</p>
            <p className="mt-1 text-lg font-semibold">{completedTaskCount}</p>
          </div>
        </div>

        {activeProjects.length === 0 ? (
          <EmptyState
            icon={FolderPlus}
            title="Create your first project"
            description="Projects keep related tasks together and give new tasks a default home."
            action={
              <button
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700"
                onClick={() => window.dispatchEvent(new CustomEvent("todo:new-project"))}
                type="button"
              >
                <FolderPlus className="h-4 w-4" aria-hidden="true" />
                New Project
              </button>
            }
          />
        ) : null}

        {activeProjects.length === 0 ? null : selectedSmartView === "completed" &&
          !selectedProject &&
          !isSearching ? (
          <div className="space-y-5">
            {completedGroupEntries.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="No completed tasks yet"
                description="Completed tasks will be grouped here by completion date."
              />
            ) : (
              completedGroupEntries.map(([date, groupTasks]) => (
                <section key={date}>
                  <h3 className="mb-2 text-sm font-semibold text-zinc-700">
                    {formatSmartDate(date)}
                  </h3>
                  <TaskList
                    onDeleteTask={setTaskPendingDelete}
                    onReorderTask={reorderTasks}
                    onSelectTask={selectTask}
                    onToggleTask={toggleTaskCompletion}
                    projects={projects}
                    selectedTaskId={selectedTaskId}
                    tasks={groupTasks}
                  />
                </section>
              ))
            )}
          </div>
        ) : visibleTasks.length === 0 && isSearching ? (
          <EmptyState
            icon={SearchX}
            title="No search results"
            description="Try a different task title, description, or project name."
          />
        ) : visibleTasks.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title={selectedSmartView === "all" ? "All caught up" : "Nothing here"}
            description={
              selectedSmartView === "all"
                ? "Every active task is complete. Add a task when there is something new to track."
                : "Tasks will appear here when they match this view."
            }
          />
        ) : (
          <TaskList
            onDeleteTask={setTaskPendingDelete}
            onReorderTask={reorderTasks}
            onSelectTask={selectTask}
            onToggleTask={toggleTaskCompletion}
            projects={projects}
            selectedTaskId={selectedTaskId}
            tasks={visibleTasks}
          />
        )}
      </section>

      <TaskDetailPanel
        onDeleteTask={setTaskPendingDelete}
        onUpdateTask={updateTask}
        projects={activeProjects}
        task={selectedTask}
      />

      <DeleteTaskDialog
        onClose={() => setTaskPendingDelete(null)}
        onConfirm={() => {
          if (taskPendingDelete) {
            deleteTask(taskPendingDelete.id);
            setTaskPendingDelete(null);
          }
        }}
        task={taskPendingDelete}
      />

      <TaskFormDialog
        onClose={() => setTaskDialogOpen(false)}
        onCreateTask={createTask}
        open={taskDialogOpen}
        projects={activeProjects}
        selectedProjectId={selectedProjectId}
      />
    </div>
  );
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}
