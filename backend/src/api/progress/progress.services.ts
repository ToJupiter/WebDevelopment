import { ProgressStatus } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';

export async function findModuleProgress(userId: string, moduleId: string) {
  return prisma.userProgress.findUnique({
    where: { user_id_module_id: { user_id: userId, module_id: moduleId } },
  });
}

export async function updateModuleProgress(userId: string, moduleId: string, status: ProgressStatus, completionPercentage: number) {
  return prisma.userProgress.upsert({
    where: { user_id_module_id: { user_id: userId, module_id: moduleId } },
    create: {
      user_id: userId,
      module_id: moduleId,
      status,
      completion_percentage: completionPercentage,
    },
    update: {
      status,
      completion_percentage: completionPercentage,
    },
  });
}
