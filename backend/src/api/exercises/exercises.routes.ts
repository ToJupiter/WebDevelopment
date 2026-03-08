import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import {
  createExerciseHandler,
  deleteExerciseHandler,
  listExercisesHandler,
  submitExerciseHandler,
  updateExerciseHandler,
  getExerciseHandler,
  getUserSubmissionsHandler
} from './exercises.controller';
import { validateExerciseCreation, validateExerciseSubmission, validateExerciseUpdate } from './exercises.validation';
import { requireAuth, requireRole } from '@/middleware/authenticate';
import { verifyExerciseOwnership, verifyModuleOwnership, checkEnrollment } from '@/middleware/ownership';
import { Role } from '@/generated/prisma/client';

const router: Router = Router();

// User: Exercises (list, get detail, submissions)
router.get('/', requireAuth, checkEnrollment, listExercisesHandler);
router.get('/submissions/my', requireAuth, getUserSubmissionsHandler);
router.get('/:exerciseId', requireAuth, getExerciseHandler);

// Creator/ Admin: Exercises (create)
router.post('/', 
  requireAuth, 
  requireRole([Role.admin, Role.creator]), 
  verifyModuleOwnership, 
  validateRequest(validateExerciseCreation), 
  createExerciseHandler
);

// Creator/Admin: Exercises (Update/ Delete)
router.put('/:exerciseId', 
  requireAuth, 
  requireRole([Role.admin, Role.creator]), 
  validateRequest(validateExerciseUpdate), 
  updateExerciseHandler
);

router.delete('/:exerciseId', 
  requireAuth,
  requireRole([Role.admin, Role.creator]), 
  verifyExerciseOwnership, 
  deleteExerciseHandler
);

// User: Exercises (Submit)
router.post('/:exerciseId/submit', 
  requireAuth, 
  validateRequest(validateExerciseSubmission), 
  submitExerciseHandler
);

// TODO: get exercises detail

export default router;
