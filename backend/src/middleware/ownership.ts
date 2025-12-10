import { Request, Response, NextFunction } from 'express';
import prisma from '@/services/prisma.service';
import { Role } from '@/generated/prisma/client';

// Generic function to check if the current user owns a resource
// Returns true for Admins automatically
export const checkOwnership = (
  model: 'roadmap' | 'cV' | 'learningEvent' | 'interviewSession' | 'aINote' | 'certificate', 
  idParam: string, 
  ownerField: string = 'user_id', 
  idField?: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.user_id;
      const userRole = req.user?.role;
      const resourceId = req.params[idParam];

      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
      if (userRole === Role.admin) return next(); // Admin override

      // Determine primary key field name if not provided (assume [model]_id convention usually works, but specific cases handled)
      const pkField = idField || `${model === 'cV' ? 'cv' : model}_id`;

      // @ts-ignore - Dynamic access to prisma delegate
      const resource = await prisma[model].findUnique({
        where: { [pkField]: resourceId },
        select: { [ownerField]: true }
      });

      if (!resource) {
        return res.status(404).json({ success: false, error: 'Resource not found' });
      }

      if (resource[ownerField] !== userId) {
        return res.status(403).json({ success: false, error: 'Forbidden: You do not own this resource' });
      }

      return next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
};

// Check if a creator owns the roadmap they are trying to add modules/exercises to
export const verifyRoadmapOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.user_id;
  const userRole = req.user?.role;
  // roadmapId might be in params (creating module) or body (creating exercise linking to roadmap?)
  // For createModule: params.roadmapId
  const roadmapId = req.params.roadmapId || req.body.roadmap_id;

  if (userRole === Role.admin) return next();

  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmap_id: roadmapId },
    select: { created_by: true }
  });

  if (!roadmap) return res.status(404).json({ success: false, error: 'Roadmap not found' });
  
  if (roadmap.created_by !== userId) {
    return res.status(403).json({ success: false, error: 'Forbidden: You are not the creator of this roadmap' });
  }
  next();
};

// Check if user owns the module (via roadmap) - for updating/deleting modules
export const verifyModuleOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.user_id;
  const userRole = req.user?.role;
  // Module ID usually in params for update/delete
  const moduleId = req.params.moduleId || req.body.module_id;

  if (userRole === Role.admin) return next();

  const moduleData = await prisma.module.findUnique({
    where: { module_id: moduleId },
    include: { roadmap: { select: { created_by: true } } }
  });

  if (!moduleData) return res.status(404).json({ success: false, error: 'Module not found' });

  if (moduleData.roadmap.created_by !== userId) {
    return res.status(403).json({ success: false, error: 'Forbidden: You do not own the parent roadmap' });
  }
  next();
};

// Check if user owns the exercise (via module -> roadmap)
export const verifyExerciseOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.user_id;
  const userRole = req.user?.role;
  const exerciseId = req.params.exerciseId;

  if (userRole === Role.admin) return next();

  const exercise = await prisma.exercise.findUnique({
    where: { exercise_id: exerciseId },
    include: { module: { include: { roadmap: { select: { created_by: true } } } } }
  });

  if (!exercise) return res.status(404).json({ success: false, error: 'Exercise not found' });

  if (exercise.module.roadmap.created_by !== userId) {
    return res.status(403).json({ success: false, error: 'Forbidden: You do not own this exercise' });
  }
  next();
};

// Check if user is enrolled in the module's roadmap (for accessing content/notes)
export const checkEnrollment = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.user_id;
  const moduleId = req.params.moduleId || req.query.module_id as string;

  if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
  if (!moduleId) return res.status(400).json({ success: false, error: 'Module ID is required' });

  if (req.user?.role === Role.admin || req.user?.role === Role.creator) return next();

  const progress = await prisma.userProgress.findUnique({
    where: {
      user_id_module_id: {
        user_id: userId,
        module_id: moduleId
      }
    }
  });

  if (!progress) {
    return res.status(403).json({ success: false, error: 'Forbidden: You are not enrolled in this module' });
  }
  next();
};

