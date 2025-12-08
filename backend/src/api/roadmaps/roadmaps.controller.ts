import { Request, Response } from 'express';
import { listPublishedRoadmaps, getRoadmapWithModules, enrollUserInRoadmap } from './roadmaps.services';
import { isValidRoadmapId } from './roadmaps.validation';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function listRoadmapsHandler(req: Request, res: Response) {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const roadmaps = await listPublishedRoadmaps(category);
    return res.status(200).json({ success: true, data: roadmaps, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function getRoadmapHandler(req: Request, res: Response) {
  try {
    const { roadmapId } = req.params;
    if (!isValidRoadmapId(roadmapId)) {
      return res.status(400).json({ success: false, data: null, error: 'Invalid roadmap identifier' });
    }
    const roadmap = await getRoadmapWithModules(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ success: false, data: null, error: 'Roadmap not found' });
    }
    return res.status(200).json({ success: true, data: roadmap, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function enrollRoadmapHandler(req: Request, res: Response) {
  try {
    const { roadmapId } = req.params;
    if (!isValidRoadmapId(roadmapId)) {
      return res.status(400).json({ success: false, data: null, error: 'Invalid roadmap identifier' });
    }
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const result = await enrollUserInRoadmap(userId, roadmapId);
    if (!result) {
      return res.status(404).json({ success: false, data: null, error: 'Roadmap not found' });
    }
    return res.status(201).json({ success: true, data: result, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}
