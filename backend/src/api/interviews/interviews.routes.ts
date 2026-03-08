import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import {
  listInterviewsHandler,
  startInterviewHandler,
  submitInterviewHandler,
} from './interviews.controller';
import { validateInterviewCreation, validateInterviewSubmission } from './interviews.validation';
import { requireAuth } from '@/middleware/authenticate';
import { checkOwnership } from '@/middleware/ownership';

const router: Router = Router();
router.use(requireAuth);

router.post('/sessions', validateRequest(validateInterviewCreation), startInterviewHandler);

router.post('/sessions/:sessionId/submit', 
  checkOwnership('interviewSession', 'sessionId', 'user_id', 'session_id'),
  validateRequest(validateInterviewSubmission), 
  submitInterviewHandler
);

router.get('/sessions', listInterviewsHandler);

export default router;