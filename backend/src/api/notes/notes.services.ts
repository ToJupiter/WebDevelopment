import { NoteType } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';

export async function getModuleById(moduleId: string) {
  return prisma.module.findUnique({
    where: { module_id: moduleId },
    select: { module_id: true, title: true },
  });
}

export async function getNextSequenceOrder(userId: string, moduleId: string) {
  const lastNote = await prisma.aINote.findFirst({
    where: { user_id: userId, module_id: moduleId },
    orderBy: { sequence_order: 'desc' },
    select: { sequence_order: true },
  });
  return lastNote ? lastNote.sequence_order + 1 : 1;
}

export async function createModuleNote(userId: string, moduleId: string, content: string, noteType: NoteType, sequenceOrder: number) {
  return prisma.aINote.create({
    data: {
      user_id: userId,
      module_id: moduleId,
      content,
      note_type: noteType,
      sequence_order: sequenceOrder,
    },
  });
}

export async function listModuleNotes(userId: string, moduleId: string) {
  return prisma.aINote.findMany({
    where: { user_id: userId, module_id: moduleId },
    orderBy: { sequence_order: 'asc' },
    select: {
      note_id: true,
      note_type: true,
      content: true,
      created_at: true,
      sequence_order: true,
    },
  });
}