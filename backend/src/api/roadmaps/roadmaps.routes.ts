import { Router } from 'express';
import { listRoadmapsHandler, getRoadmapHandler, enrollRoadmapHandler, createModuleHandler, createRoadmapHandler } from './roadmaps.controller';
import { requireAuth, requireRole } from '@/middleware/authenticate';
import { verifyRoadmapOwnership, checkOwnership } from '@/middleware/ownership';
import { Role } from '@/generated/prisma/client';

const router: Router = Router();

// Public: Roadmap (List, View)
router.get('/', listRoadmapsHandler);
router.get('/:roadmapId', getRoadmapHandler);

// User: Roadmap (enroll)
router.post('/:roadmapId/enroll', requireAuth, enrollRoadmapHandler);

// Admin / Creator: Roadmap (ownership), Module (create)
router.post('/', requireAuth, requireRole([Role.admin, Role.creator]), createRoadmapHandler);
router.post('/:roadmapId/modules', requireAuth, requireRole([Role.admin, Role.creator]), verifyRoadmapOwnership, createModuleHandler);

export default router;
