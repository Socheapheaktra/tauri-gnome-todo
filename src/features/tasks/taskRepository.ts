import {
  Prisma,
  type Project,
  type Task,
  TaskPriority,
  TaskStatus
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type TaskWithProject = Task & {
  project: Project;
};

export type CreateTaskInput = {
  projectId: string;
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  dueDate?: Date | string | null;
  sortOrder?: number;
};

export type UpdateTaskInput = {
  projectId?: string;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | string | null;
  completedAt?: Date | string | null;
  sortOrder?: number;
};

export type ReorderTaskInput = {
  id: string;
  sortOrder: number;
};

export type SmartTaskListOptions = {
  includeCompleted?: boolean;
  now?: Date;
};

const taskOrder: Prisma.TaskOrderByWithRelationInput[] = [
  { sortOrder: "asc" },
  { createdAt: "asc" }
];

function coerceNullableDate(value: Date | string | null | undefined) {
  if (value === undefined || value === null || value instanceof Date) {
    return value;
  }

  return new Date(value);
}

function getTodayRange(now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  return { start, end };
}

export function createTask(input: CreateTaskInput): Promise<Task> {
  return prisma.task.create({
    data: {
      projectId: input.projectId,
      title: input.title,
      description: input.description,
      priority: input.priority ?? TaskPriority.MEDIUM,
      dueDate: coerceNullableDate(input.dueDate),
      sortOrder: input.sortOrder ?? 0
    }
  });
}

export function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  return prisma.task.update({
    where: { id },
    data: {
      ...input,
      dueDate: coerceNullableDate(input.dueDate),
      completedAt: coerceNullableDate(input.completedAt)
    }
  });
}

export function deleteTask(id: string): Promise<Task> {
  return prisma.task.delete({
    where: { id }
  });
}

export function completeTask(id: string): Promise<Task> {
  return updateTask(id, {
    status: TaskStatus.DONE,
    completedAt: new Date()
  });
}

export function reopenTask(id: string): Promise<Task> {
  return updateTask(id, {
    status: TaskStatus.TODO,
    completedAt: null
  });
}

export function listTasksByProject(projectId: string): Promise<Task[]> {
  return prisma.task.findMany({
    where: { projectId },
    orderBy: taskOrder
  });
}

export function listTodayTasks(
  options: SmartTaskListOptions = {}
): Promise<TaskWithProject[]> {
  const now = options.now ?? new Date();
  const { start, end } = getTodayRange(now);

  return prisma.task.findMany({
    where: {
      project: { isArchived: false },
      status: options.includeCompleted ? undefined : { not: TaskStatus.DONE },
      dueDate: {
        gte: start,
        lt: end
      }
    },
    include: { project: true },
    orderBy: taskOrder
  });
}

export function listOverdueTasks(
  options: Pick<SmartTaskListOptions, "now"> = {}
): Promise<TaskWithProject[]> {
  const now = options.now ?? new Date();
  const today = getTodayRange(now).start;

  return prisma.task.findMany({
    where: {
      project: { isArchived: false },
      dueDate: { lt: today },
      status: { not: TaskStatus.DONE }
    },
    include: { project: true },
    orderBy: [{ dueDate: "asc" }, ...taskOrder]
  });
}

export function reorderTasks(tasks: ReorderTaskInput[]): Promise<Task[]> {
  return prisma.$transaction(
    tasks.map((task) =>
      prisma.task.update({
        where: { id: task.id },
        data: { sortOrder: task.sortOrder }
      })
    )
  );
}
