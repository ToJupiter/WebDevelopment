import { Request, Response } from 'express';
import { listPublishedRoadmaps, getRoadmapWithModules, enrollUserInRoadmap, listEnrolledRoadmaps } from './roadmaps.services';
import { isValidRoadmapId } from './roadmaps.validation';
import { Status } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';
import { updateRoadmap, deleteRoadmap, getModuleDetail, updateModule, deleteModule } from './roadmaps.services';



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


export async function createRoadmapHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.user_id;

    if (!req.body.title || !req.body.category) {
        return res.status(400).json({ success: false, error: "Title and Category are required" });
    }

    const roadmap = await prisma.roadmap.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        image_url: req.body.image_url,
        created_by: userId!, 
        status: Status.published // Defaulting to published for demo speed
      }
    });
    return res.status(201).json({ success: true, data: roadmap });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function createModuleHandler(req: Request, res: Response) {
  try {
    const {roadmapId} = req.params;

    const moduleData = await prisma.module.create({
      data: {
        roadmap_id: roadmapId,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content || "Placeholder content",
        order_index: req.body.order_index || 1,
        estimated_hours: req.body.estimated_hours || 1
    }
  });
    return res.status(201).json({ success: true, data: moduleData });
}
  catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function listEnrolledRoadmapsHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const roadmaps = await listEnrolledRoadmaps(userId);
    return res.status(200).json({ success: true, data: roadmaps });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function updateRoadmapHandler(req: Request, res: Response) {
  try {
    const { roadmapId } = req.params;
    const updated = await updateRoadmap(roadmapId, req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function deleteRoadmapHandler(req: Request, res: Response) {
  try {
    const { roadmapId } = req.params;
    await deleteRoadmap(roadmapId);
    return res.status(200).json({ success: true, data: { message: 'Roadmap deleted' } });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function getModuleHandler(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    const moduleData = await getModuleDetail(moduleId);
    if (!moduleData) return res.status(404).json({ success: false, error: 'Module not found' });
    return res.status(200).json({ success: true, data: moduleData });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function updateModuleHandler(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    const updated = await updateModule(moduleId, req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function deleteModuleHandler(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    await deleteModule(moduleId);
    return res.status(200).json({ success: true, data: { message: 'Module deleted' } });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}