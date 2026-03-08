import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { aiChatHandler, listNotesHandler } from './notes.controller';
import { validateAiChatPayload } from './notes.validation';
import { requireAuth } from '@/middleware/authenticate';

const router: Router = Router({ mergeParams: true });

router.use(requireAuth);

router.post('/ai-chat', validateRequest(validateAiChatPayload), aiChatHandler);
router.get('/ai-notes', listNotesHandler);

export default router;