import { Prisma, LearningEvent, EventStatus } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';

type EventFilters = {
  start?: string;
  end?: string;
};

type CreatePayload = {
  title: string;
  description?: string;
  start_utc: string;
  end_utc: string;
  timezone?: string;
  module_id?: string;
  color?: string;
  all_day?: boolean;
  reminder_minutes?: number;
};

type UpdatePayload = {
  title?: string;
  description?: string;
  start_utc?: string;
  end_utc?: string;
  timezone?: string;
  module_id?: string | null;
  color?: string;
  all_day?: boolean;
  reminder_minutes?: number | null;
  status?: EventStatus;
};

export async function listLearningEvents(userId: string, filters: EventFilters) {
  const where: Prisma.LearningEventWhereInput = {
    user_id: userId,
    is_deleted: false,
  };

  if (filters.start) {
    where.start_utc = { gte: new Date(filters.start) };
  }
  if (filters.end) {
    where.end_utc = { lte: new Date(filters.end) };
  }

  return prisma.learningEvent.findMany({
    where,
    orderBy: { start_utc: 'asc' },
  });
}

export async function createLearningEvent(userId: string, payload: CreatePayload) {
  const data = {
    user_id: userId,
    title: payload.title,
    description: payload.description,
    start_utc: new Date(payload.start_utc),
    end_utc: new Date(payload.end_utc),
    timezone: payload.timezone,
    module_id: payload.module_id,
    color: payload.color,
    all_day: payload.all_day ?? false,
    reminder_minutes: payload.reminder_minutes,
    status: EventStatus.planned,
  };
  return prisma.learningEvent.create({ data });
}

export async function updateLearningEvent(eventId: string, userId: string, payload: UpdatePayload) {
  const event = await prisma.learningEvent.findUnique({
    where: { event_id: eventId },
  });
  if (!event || event.user_id !== userId || event.is_deleted) {
    return null;
  }
  const data: Record<string, unknown> = {};
  if (payload.title) {
    data.title = payload.title;
  }
  if (payload.description !== undefined) {
    data.description = payload.description;
  }
  if (payload.start_utc) {
    data.start_utc = new Date(payload.start_utc);
  }
  if (payload.end_utc) {
    data.end_utc = new Date(payload.end_utc);
  }
  if (payload.timezone) {
    data.timezone = payload.timezone;
  }
  if (payload.module_id !== undefined) {
    data.module_id = payload.module_id;
  }
  if (payload.color) {
    data.color = payload.color;
  }
  if (payload.all_day !== undefined) {
    data.all_day = payload.all_day;
  }
  if (payload.reminder_minutes !== undefined) {
    data.reminder_minutes = payload.reminder_minutes;
  }
  if (payload.status) {
    data.status = payload.status;
  }
  return prisma.learningEvent.update({ where: { event_id: eventId }, data });
}

export async function softDeleteLearningEvent(eventId: string, userId: string) {
  const event = await prisma.learningEvent.findUnique({
    where: { event_id: eventId },
  });
  if (!event || event.user_id !== userId || event.is_deleted) {
    return null;
  }
  return prisma.learningEvent.update({
    where: { event_id: eventId },
    data: { is_deleted: true },
  });
}
