import { Prisma } from "@/generated/prisma/client";
import prisma from "@/services/prisma.service";

export async function listExercises(moduleId?: string) {
  const where = moduleId ? { module_id: moduleId } : undefined;
  return prisma.exercise.findMany({
    where,
    orderBy: { created_at: "desc" },
  });
}

type JsonPayload = Prisma.InputJsonValue;

export async function createExercise(payload: {
  module_id: string;
  title: string;
  description: string;
  difficulty?: "easy" | "medium" | "hard";
  examples?: JsonPayload;
}) {
  return prisma.exercise.create({
    data: {
      module_id: payload.module_id,
      title: payload.title,
      description: payload.description,
      difficulty: payload.difficulty ?? "medium",
      examples: payload.examples,
    },
  });
}

export async function updateExercise(
  exerciseId: string,
  payload: Partial<{
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    examples?: JsonPayload;
  }>,
) {
  const existing = await prisma.exercise.findUnique({
    where: { exercise_id: exerciseId },
  });
  if (!existing) {
    return null;
  }
  const data = {} as Record<string, unknown>;
  if (payload.title) {
    data.title = payload.title;
  }
  if (payload.description) {
    data.description = payload.description;
  }
  if (payload.difficulty) {
    data.difficulty = payload.difficulty;
  }
  if (payload.examples !== undefined) {
    data.examples = payload.examples;
  }
  return prisma.exercise.update({
    where: { exercise_id: exerciseId },
    data,
  });
}

export async function deleteExercise(exerciseId: string) {
  const existing = await prisma.exercise.findUnique({
    where: { exercise_id: exerciseId },
  });
  if (!existing) {
    return null;
  }
  return prisma.exercise.delete({ where: { exercise_id: exerciseId } });
}

export async function submitExercise(
  exerciseId: string,
  userId: string,
  answerText: string,
) {
  // Verify exercise exists
  const exercise = await prisma.exercise.findUnique({
    where: { exercise_id: exerciseId },
    select: {
      exercise_id: true,
      module_id: true,
      title: true,
      difficulty: true,
    }
  });

  if (!exercise) {
    return null;
  }

  const existingSubmission = await prisma.exerciseSubmission.findFirst({
    where: {
      exercise_id: exerciseId,
      user_id: userId,
    }
  });

  let submission;
  if (existingSubmission) {
    submission = await prisma.exerciseSubmission.update({
      where: { submission_id: existingSubmission.submission_id },
      data: { answer_text: answerText, submitted_at: new Date() },
      include: {
        exercise: {
          select: {
            title: true,
            difficulty: true,
          },
        },
      },
    });
  } else {
    submission = await prisma.exerciseSubmission.create({
      data: {
        exercise_id: exerciseId,
        user_id: userId,
        answer_text: answerText,
      },
      include: {
        exercise: {
          select: {
            title: true,
            difficulty: true,
          },
        },
      },
    });
  }

  await checkAndCompleteModule(userId, exercise.module_id);

  return submission;
}

async function checkAndCompleteModule(userId: string, moduleId: string) {
  const allExercises = await prisma.exercise.findMany({
    where: { module_id: moduleId },
    select: { exercise_id: true }
  });

  if (allExercises.length === 0) return;

  const submissions = await prisma.exerciseSubmission.findMany({
    where: {
      user_id: userId,
      exercise: { module_id: moduleId }
    },
    select: { exercise_id: true }
  });

  const submittedExerciseIds = new Set(submissions.map(s => s.exercise_id));
  const allExerciseIds = allExercises.map(e => e.exercise_id);
  
  const allCompleted = allExerciseIds.every(id => submittedExerciseIds.has(id));

  if (allCompleted) {
    await prisma.userProgress.upsert({
      where: {
        user_id_module_id: {
          user_id: userId,
          module_id: moduleId
        }
      },
      create: {
        user_id: userId,
        module_id: moduleId,
        status: 'completed',
        completion_percentage: 100,
        started_at: new Date(),
        completed_at: new Date(),
      },
      update: {
        status: 'completed',
        completion_percentage: 100,
        completed_at: new Date(),
      }
    });

    await checkAndIssueCertificate(userId, moduleId);
  }
}

async function checkAndIssueCertificate(userId: string, moduleId: string) {
  const module = await prisma.module.findUnique({
    where: { module_id: moduleId },
    select: { 
      roadmap_id: true,
      roadmap: { select: { title: true } }
    }
  });

  if (!module) return;

  const roadmapId = module.roadmap_id;

  const allModules = await prisma.module.findMany({
    where: { roadmap_id: roadmapId },
    select: { module_id: true }
  });

  const completedModules = await prisma.userProgress.findMany({
    where: {
      user_id: userId,
      module_id: { in: allModules.map(m => m.module_id) },
      status: 'completed'
    }
  });

  if (completedModules.length === allModules.length && allModules.length > 0) {
    const existingCert = await prisma.certificate.findUnique({
      where: {
        user_id_roadmap_id: {
          user_id: userId,
          roadmap_id: roadmapId
        }
      }
    });

    if (!existingCert) {
      await prisma.certificate.create({
        data: {
          user_id: userId,
          roadmap_id: roadmapId,
          certificate_name: `${module.roadmap.title} Certificate of Completion`,
          pdf_url: `/api/certificates/${userId}/${roadmapId}.pdf`
        }
      });
      console.log(`✅ Certificate issued to user ${userId} for roadmap ${roadmapId}`);
    }
  }
}

export async function getExerciseById(exerciseId: string) {
  return prisma.exercise.findUnique({
    where: { exercise_id: exerciseId },
    include: {
      module: {
        select: { title: true, roadmap_id: true }
      }
    }
  });
}

export async function getUserExerciseSubmissions(userId: string, moduleId?: string) {
  const where: any = { user_id: userId };
  
  if (moduleId) {
    where.exercise = {
      module_id: moduleId
    };
  }

  return prisma.exerciseSubmission.findMany({
    where,
    include: {
      exercise: {
        select: {
          exercise_id: true,
          title: true,
          module_id: true
        }
      }
    },
    orderBy: { submitted_at: 'desc' }
  });
}