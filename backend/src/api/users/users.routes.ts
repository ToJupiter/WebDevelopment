import { Router } from 'express';
import { requireAuth } from '@/middleware/authenticate';
import { changePasswordHandler, getMeHandler, updateMeHandler } from './users.controller';

const router: Router = Router();

router.use(requireAuth);

router.get('/me', getMeHandler);
router.put('/me', updateMeHandler);
router.put('/me/password', changePasswordHandler);

export default router;