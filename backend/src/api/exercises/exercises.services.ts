import { Prisma } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';

export async function listExercises(moduleId?: string) {
  const where = moduleId ? { module_id: moduleId } : undefined;
  return prisma.exercise.findMany({
    where,
    orderBy: { created_at: 'desc' },
  });
}

type JsonPayload = Prisma.InputJsonValue;

export async function createExercise(payload: { module_id: string; title: string; description: string; difficulty?: 'easy' | 'medium' | 'hard'; examples?: JsonPayload }) {
  return prisma.exercise.create({
    data: {
      module_id: payload.module_id,
      title: payload.title,
      description: payload.description,
      difficulty: payload.difficulty ?? 'medium',
      examples: payload.examples,
    },
  });
}

export async function updateExercise(exerciseId: string, payload: Partial<{ title: string; description: string; difficulty: 'easy' | 'medium' | 'hard'; examples?: JsonPayload }>) {
  const existing = await prisma.exercise.findUnique({ where: { exercise_id: exerciseId } });
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
  const existing = await prisma.exercise.findUnique({ where: { exercise_id: exerciseId } });
  if (!existing) {
    return null;
  }
  return prisma.exercise.delete({ where: { exercise_id: exerciseId } });
}

export async function submitExercise(exerciseId: string, payload: { user_id?: string; answer_text: string }) {
  return {
    exercise_id: exerciseId,
    submitted_at: new Date().toISOString(),
    user_id: payload.user_id ?? null,
    status: 'received',
    answer_text: payload.answer_text,
  };
}
