import { Router } from 'express';
import { getModuleProgressHandler, updateModuleProgressHandler } from './progress.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { validateProgressUpdate } from './progress.validation';
import { requireAuth } from '@/middleware/authenticate';
import { checkEnrollment } from '@/middleware/ownership';
import { getOverviewHandler, getRoadmapProgressHandler } from './progress.controller';
import { getUserDashboardOverview, getRoadmapProgress } from './progress.services';

const router: Router = Router();
router.get('/overview', getOverviewHandler);
router.get('/roadmaps/:roadmapId', getRoadmapProgressHandler);

router.use('/modules/:moduleId/progress', requireAuth, checkEnrollment);

router.get('/modules/:moduleId/progress', getModuleProgressHandler);
router.patch('/modules/:moduleId/progress', validateRequest(validateProgressUpdate), updateModuleProgressHandler);

export default router;
