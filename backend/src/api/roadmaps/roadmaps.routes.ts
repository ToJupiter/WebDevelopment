import { Router } from 'express';
import { listRoadmapsHandler, getRoadmapHandler, enrollRoadmapHandler, createModuleHandler, createRoadmapHandler } from './roadmaps.controller';
import { requireAuth, requireRole } from '@/middleware/authenticate';

const router: Router = Router();

// Public
router.get('/', listRoadmapsHandler);
router.get('/:roadmapId', getRoadmapHandler);

// User
router.post('/:roadmapId/enroll', requireAuth, enrollRoadmapHandler);

// Admin / Creator (Protected)
router.post('/', requireAuth, requireRole(['admin', 'creator']), createRoadmapHandler);
router.post('/:roadmapId/modules', requireAuth, requireRole(['admin', 'creator']), createModuleHandler);

export default router;
