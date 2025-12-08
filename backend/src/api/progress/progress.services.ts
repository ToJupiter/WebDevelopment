import { ProgressStatus } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';

export async function findModuleProgress(userId: string, moduleId: string) {
  return prisma.userProgress.findUnique({
    where: { user_id_module_id: { user_id: userId, module_id: moduleId } },
  });
}

export async function updateModuleProgress(userId: string, moduleId: string, status: ProgressStatus, completionPercentage: number) {
  const updatedProgress = await prisma.userProgress.upsert({
    where: { user_id_module_id: { user_id: userId, module_id: moduleId } },
    create: {
      user_id: userId,
      module_id: moduleId,
      status,
      completion_percentage: completionPercentage,
      started_at: status === 'in_progress' ? new Date() : undefined,
      completed_at: status === 'completed' ? new Date() : undefined,
    },
    update: {
      status,
      completion_percentage: completionPercentage,
      completed_at: status === 'completed' ? new Date() : undefined,
    },
  });

  if (status === 'completed') {
    await checkAndIssueCertificate(userId, moduleId);
  }

  return updatedProgress;
}

async function checkAndIssueCertificate(userId: string, moduleId: string) {
  const moduleData = await prisma.module.findUnique({
    where: { module_id: moduleId },
    select: { roadmap_id: true, roadmap: { select: { title: true } } }
  });

  if (!moduleData) return;

  const roadmapId = moduleData.roadmap_id;

  const totalModules = await prisma.module.count({
    where: { roadmap_id: roadmapId }
  });

  const completedModules = await prisma.userProgress.count({
    where: {
      user_id: userId,
      module: { roadmap_id: roadmapId },
      status: 'completed'
    }
  });

  if (totalModules > 0 && completedModules === totalModules) {
    const existingCert = await prisma.certificate.findUnique({
      where: { user_id_roadmap_id: { user_id: userId, roadmap_id: roadmapId } }
    });

    if (!existingCert) {
      await prisma.certificate.create({
        data: {
          user_id: userId,
          roadmap_id: roadmapId,
          certificate_name: `${moduleData.roadmap.title} Certificate of Completion`,
          pdf_url: `/api/certificates/${userId}/${roadmapId}.pdf`
        }
      });
      console.log(`Certificate issued to user ${userId} for roadmap ${roadmapId}`);
    }
  }
}
