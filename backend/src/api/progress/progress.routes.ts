import { Router } from 'express';
import { getModuleProgressHandler, updateModuleProgressHandler } from './progress.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { validateProgressUpdate } from './progress.validation';
import { requireAuth } from '@/middleware/authenticate';
import { checkEnrollment } from '@/middleware/ownership';

const router: Router = Router();

router.use('/modules/:moduleId/progress', requireAuth, checkEnrollment);

router.get('/modules/:moduleId/progress', getModuleProgressHandler);
router.patch('/modules/:moduleId/progress', validateRequest(validateProgressUpdate), updateModuleProgressHandler);

export default router;
