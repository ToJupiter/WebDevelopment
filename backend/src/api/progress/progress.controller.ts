import { Request, Response } from 'express';
import { findModuleProgress, updateModuleProgress } from './progress.services';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function getModuleProgressHandler(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const progress = await findModuleProgress(userId, moduleId);
    if (!progress) {
      return res.status(404).json({ success: false, data: null, error: 'Progress entry not found' });
    }
    return res.status(200).json({ success: true, data: progress, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function updateModuleProgressHandler(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { status, completion_percentage } = req.body;
    const updated = await updateModuleProgress(userId, moduleId, status, completion_percentage);
    return res.status(200).json({ success: true, data: updated, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}
