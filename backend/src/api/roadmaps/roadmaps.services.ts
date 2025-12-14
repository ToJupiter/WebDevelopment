import { Status } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';

export async function listPublishedRoadmaps(category?: string) {
  const where = category ? { status: Status.published, category } : { status: Status.published };
  const roadmaps = await prisma.roadmap.findMany({
    where,
    select: {
      roadmap_id: true,
      title: true,
      description: true,
      category: true,
      image_url: true,
      status: true,
      created_at: true,
      updated_at: true,
      modules: { select: { module_id: true } },
    },
    orderBy: { updated_at: 'desc' },
  });
  return roadmaps.map((roadmap) => ({
    roadmap_id: roadmap.roadmap_id,
    title: roadmap.title,
    description: roadmap.description,
    category: roadmap.category,
    image_url: roadmap.image_url,
    status: roadmap.status,
    created_at: roadmap.created_at,
    updated_at: roadmap.updated_at,
    module_count: roadmap.modules.length,
  }));
}

export async function getRoadmapWithModules(roadmapId: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmap_id: roadmapId },
    include: {
      modules: {
        select: {
          module_id: true,
          title: true,
          description: true,
          content: true,
          order_index: true,
          estimated_hours: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: { order_index: 'asc' },
      },
    },
  });
  if (!roadmap) {
    return null;
  }
  return {
    roadmap_id: roadmap.roadmap_id,
    title: roadmap.title,
    description: roadmap.description,
    category: roadmap.category,
    image_url: roadmap.image_url,
    status: roadmap.status,
    created_at: roadmap.created_at,
    updated_at: roadmap.updated_at,
    modules: roadmap.modules,
    module_count: roadmap.modules.length,
  };
}

export async function enrollUserInRoadmap(userId: string, roadmapId: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmap_id: roadmapId },
    include: { modules: { select: { module_id: true } } },
  });
  if (!roadmap) {
    return null;
  }
  const moduleIds = roadmap.modules.map((module) => module.module_id);
  if (moduleIds.length === 0) {
    return { roadmap_id: roadmapId, enrolled: 0 };
  }
  const existingProgress = await prisma.userProgress.findMany({
    where: { user_id: userId, module_id: { in: moduleIds } },
    select: { module_id: true },
  });
  const existingModuleIds = new Set(existingProgress.map((entry) => entry.module_id));
  const toCreate = moduleIds.filter((moduleId) => !existingModuleIds.has(moduleId));
  if (toCreate.length > 0) {
    const operations = toCreate.map((moduleId) =>
      prisma.userProgress.create({
        data: {
          user_id: userId,
          module_id: moduleId,
          status: 'not_started',
          completion_percentage: 0,
        },
      })
    );
    await prisma.$transaction(operations);
  }
  return { roadmap_id: roadmapId, enrolled: toCreate.length };
}

export async function updateRoadmap(roadmapId: string, data: { title?: string; description?: string; category?: string; status?: Status; image_url?: string }) {
  return prisma.roadmap.update({
    where: { roadmap_id: roadmapId },
    data,
  });
}

export async function deleteRoadmap(roadmapId: string) {
  // Cascading delete handles modules/progress via schema
  return prisma.roadmap.delete({
    where: { roadmap_id: roadmapId },
  });
}

export async function getModuleDetail(moduleId: string) {
  return prisma.module.findUnique({
    where: { module_id: moduleId },
  });
}

export async function updateModule(moduleId: string, data: { title?: string; description?: string; content?: string; order_index?: number; estimated_hours?: number }) {
  return prisma.module.update({
    where: { module_id: moduleId },
    data,
  });
}

export async function deleteModule(moduleId: string) {
  return prisma.module.delete({
    where: { module_id: moduleId },
  });
}