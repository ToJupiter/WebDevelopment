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

export async function getUserDashboardOverview(userId: string) {
  const distinctRoadmaps = await prisma.userProgress.findMany({
    where: { user_id: userId },
    select: { module: { select: { roadmap_id: true } } },
    distinct: ['module_id']
  });
  
  const roadmapIds = new Set(distinctRoadmaps.map(p => p.module.roadmap_id));
  
  const completedModules = await prisma.userProgress.count({
    where: { user_id: userId, status: 'completed' }
  });

  const allProgress = await prisma.userProgress.findMany({
    where: { user_id: userId },
    select: { completion_percentage: true }
  });
  
  const avgCompletion = allProgress.length > 0 
    ? allProgress.reduce((acc, curr) => acc + Number(curr.completion_percentage), 0) / allProgress.length
    : 0;

  return {
    enrolled_roadmaps: roadmapIds.size,
    completed_modules: completedModules,
    average_completion: avgCompletion.toFixed(2)
  };
}

export async function getRoadmapProgress(userId: string, roadmapId: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmap_id: roadmapId },
    select: { title: true }
  });

  if (!roadmap) return null;

  const modules = await prisma.module.findMany({
    where: { roadmap_id: roadmapId },
    include: {
      userProgress: {
        where: { user_id: userId }
      }
    },
    orderBy: { order_index: 'asc' }
  });

  const progressData = modules.map(m => ({
    module_id: m.module_id,
    title: m.title,
    status: m.userProgress[0]?.status ?? 'not_started',
    percentage: m.userProgress[0]?.completion_percentage ?? 0
  }));

  const total = progressData.length;
  const completed = progressData.filter(p => p.status === 'completed').length;
  const overall = total > 0 ? (completed / total) * 100 : 0;

  return {
    roadmap_title: roadmap.title,
    overall_progress: overall,
    modules: progressData
  };
}