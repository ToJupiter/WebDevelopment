import { Request, Response } from 'express';
import { createLearningEvent, listLearningEvents, softDeleteLearningEvent, updateLearningEvent } from './calendar.services';
import { validateCalendarQuery } from './calendar.validation';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function listEventsHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;
    
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const errors = validateCalendarQuery({
      start: typeof req.query.start === 'string' ? req.query.start : undefined,
      end: typeof req.query.end === 'string' ? req.query.end : undefined,
    });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, data: null, error: 'Validation failed', details: errors });
    }
    const events = await listLearningEvents(userId, {
      start: typeof req.query.start === 'string' ? req.query.start : undefined,
      end: typeof req.query.end === 'string' ? req.query.end : undefined,
    });
    return res.status(200).json({ success: true, data: events, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function createEventHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const event = await createLearningEvent(userId, req.body);
    return res.status(201).json({ success: true, data: event, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function updateEventHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { eventId } = req.params;
    const updated = await updateLearningEvent(eventId, userId, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, data: null, error: 'Event not found' });
    }
    return res.status(200).json({ success: true, data: updated, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function deleteEventHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { eventId } = req.params;
    const deleted = await softDeleteLearningEvent(eventId, userId);
    if (!deleted) {
      return res.status(404).json({ success: false, data: null, error: 'Event not found' });
    }
    return res.status(200).json({ success: true, data: deleted, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}
