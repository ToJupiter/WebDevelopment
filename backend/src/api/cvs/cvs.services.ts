import { Prisma, TemplateStyle } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';

export const templateStyles: TemplateStyle[] = ['modern', 'classic', 'minimal'];

type JsonPayload = Prisma.InputJsonValue;

export async function listUserCVs(userId: string) {
  return prisma.cV.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    select: {
      cv_id: true,
      cv_name: true,
      template_style: true,
      created_at: true,
      updated_at: true,
      pdf_url: true,
    },
  });
}

export async function createCV(userId: string, payload: { cv_name: string; template_style: TemplateStyle; personal_info?: JsonPayload; education?: JsonPayload; experience?: JsonPayload; skills?: JsonPayload; projects?: JsonPayload }) {
  return prisma.cV.create({
    data: {
      user_id: userId,
      cv_name: payload.cv_name,
      template_style: payload.template_style,
      personal_info: payload.personal_info,
      education: payload.education,
      experience: payload.experience,
      skills: payload.skills,
      projects: payload.projects,
    },
  });
}

export async function updateCV(userId: string, cvId: string, payload: Partial<{ cv_name: string; template_style: TemplateStyle; personal_info: JsonPayload; education: JsonPayload; experience: JsonPayload; skills: JsonPayload; projects: JsonPayload }>) {
  const existing = await prisma.cV.findUnique({ where: { cv_id: cvId } });
  if (!existing || existing.user_id !== userId) {
    return null;
  }
  const data: Prisma.CVUpdateInput = {};
  if (payload.cv_name) {
    data.cv_name = payload.cv_name;
  }
  if (payload.template_style) {
    data.template_style = payload.template_style;
  }
  if (payload.personal_info !== undefined) {
    data.personal_info = payload.personal_info;
  }
  if (payload.education !== undefined) {
    data.education = payload.education;
  }
  if (payload.experience !== undefined) {
    data.experience = payload.experience;
  }
  if (payload.skills !== undefined) {
    data.skills = payload.skills;
  }
  if (payload.projects !== undefined) {
    data.projects = payload.projects;
  }
  return prisma.cV.update({
    where: { cv_id: cvId },
    data,
  });
}

export async function optimizeCVSection(cvId: string, section: 'personal_info' | 'education' | 'experience' | 'skills' | 'projects', index: number | null, text: string) {
  return {
    cv_id: cvId,
    section,
    optimized_text: `Optimized: ${text}`,
    index,
  };
}

export async function getCVById(cvId: string) {
  return prisma.cV.findUnique({
    where: { cv_id: cvId },
  });
}