import { Router } from 'express';
import { 
  listRoadmapsHandler, getRoadmapHandler, enrollRoadmapHandler, 
  createModuleHandler, createRoadmapHandler, listEnrolledRoadmapsHandler,
  updateRoadmapHandler, deleteRoadmapHandler, 
  getModuleHandler, updateModuleHandler, deleteModuleHandler 
} from './roadmaps.controller';

import { requireAuth, requireRole } from '@/middleware/authenticate';
import { verifyRoadmapOwnership, checkOwnership, verifyModuleOwnership } from '@/middleware/ownership';
import { Role } from '@/generated/prisma/client';
import notesRouter from '../notes/notes.routes';

const router: Router = Router();

// Public: Roadmap (List, View)
router.get('/', listRoadmapsHandler);
router.get('/:roadmapId', getRoadmapHandler);

// User: Roadmap (enroll)
router.get('/enrolled/list', requireAuth, listEnrolledRoadmapsHandler);
router.post('/:roadmapId/enroll', requireAuth, enrollRoadmapHandler);

// Admin / Creator: Roadmap (ownership, update, delete)
router.post('/', requireAuth, requireRole([Role.admin, Role.creator]), createRoadmapHandler);
router.put('/:roadmapId', requireAuth, requireRole([Role.admin, Role.creator]), verifyRoadmapOwnership, updateRoadmapHandler);
router.delete('/:roadmapId', requireAuth, requireRole([Role.admin, Role.creator]), verifyRoadmapOwnership, deleteRoadmapHandler);

// Admin / Creator: Module (create)
router.post('/:roadmapId/modules', requireAuth, requireRole([Role.admin, Role.creator]), verifyRoadmapOwnership, createModuleHandler);
router.get('/:roadmapId/modules/:moduleId', requireAuth, getModuleHandler);
router.put('/:roadmapId/modules/:moduleId', requireAuth, requireRole([Role.admin, Role.creator]), verifyModuleOwnership, updateModuleHandler);
router.delete('/:roadmapId/modules/:moduleId', requireAuth, requireRole([Role.admin, Role.creator]), verifyModuleOwnership, deleteModuleHandler);

router.use('/:roadmapId/modules/:moduleId/notes', notesRouter);

export default router;
