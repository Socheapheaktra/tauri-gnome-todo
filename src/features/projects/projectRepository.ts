import type { Prisma, Project } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type CreateProjectInput = {
  name: string;
  description?: string | null;
  color?: string | null;
};

export type UpdateProjectInput = Partial<CreateProjectInput> & {
  isArchived?: boolean;
};

const activeProjectOrder: Prisma.ProjectOrderByWithRelationInput[] = [
  { isArchived: "asc" },
  { updatedAt: "desc" },
  { name: "asc" }
];

export function createProject(input: CreateProjectInput): Promise<Project> {
  return prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      color: input.color
    }
  });
}

export function updateProject(
  id: string,
  input: UpdateProjectInput
): Promise<Project> {
  return prisma.project.update({
    where: { id },
    data: input
  });
}

export function deleteProject(id: string): Promise<Project> {
  return prisma.project.delete({
    where: { id }
  });
}

export function archiveProject(id: string): Promise<Project> {
  return updateProject(id, { isArchived: true });
}

export function listProjects(options?: {
  includeArchived?: boolean;
}): Promise<Project[]> {
  return prisma.project.findMany({
    where: options?.includeArchived ? undefined : { isArchived: false },
    orderBy: activeProjectOrder
  });
}

export function getProjectById(id: string): Promise<Project | null> {
  return prisma.project.findUnique({
    where: { id }
  });
}
