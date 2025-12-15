## File 1: `backend/src/api/auth/auth.routes.ts`

```typescript
import { Router } from 'express';
import { registerUserHandler, loginUserHandler, logoutUserHandler } from './auth.controller';
import { validateRequest } from '@/middleware/validateRequest';
import { validateRegisterInput, validateLoginInput } from './auth.validation';

const router: Router = Router();

router.post('/register', validateRequest(validateRegisterInput), registerUserHandler);
router.post('/login', validateRequest(validateLoginInput), loginUserHandler);
router.post('/logout', logoutUserHandler);

export default router;
```

---

## File 2: `backend/src/api/calendar/calendar.routes.ts`

```typescript
import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { createEventHandler, deleteEventHandler, listEventsHandler, updateEventHandler } from './calendar.controller';
import { validateCalendarCreation, validateCalendarUpdate } from './calendar.validation';
import { requireAuth } from '@/middleware/authenticate';
import { checkOwnership } from '@/middleware/ownership';

const router: Router = Router();
router.use(requireAuth);

router.get('/events', listEventsHandler);
router.post('/events', validateRequest(validateCalendarCreation), createEventHandler);

// User (Update/ Delete Calendar Events)
router.put('/events/:eventId', 
    checkOwnership('learningEvent', 'eventId', 'user_id', 'event_id'),
    validateRequest(validateCalendarUpdate), 
    updateEventHandler
);

router.delete('/events/:eventId', 
    checkOwnership('learningEvent', 'eventId', 'user_id', 'event_id'),
    deleteEventHandler
);

export default router;
```

---

## File 3: `backend/src/api/certificates/certificates.routes.ts`

```typescript
import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { issueCertificateHandler, listCertificatesHandler } from './certificates.controller';
import { validateCertificatePayload } from './certificates.validation';
import { requireAuth, requireRole } from '@/middleware/authenticate';
import { Role } from '@/generated/prisma/client';

const router: Router = Router();

router.use(requireAuth);

router.get('/', listCertificatesHandler);

// Admin: Certificates (Create manually)
router.post('/', requireRole([Role.admin]),validateRequest(validateCertificatePayload), issueCertificateHandler);

export default router;
```

---

## File 4: `backend/src/api/cvs/cvs.routes.ts`

```typescript
import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { createCVHandler, listCVsHandler, optimizeCVHandler, updateCVHandler, generatePDFHandler } from './cvs.controller';
import { validateCVCreation, validateCVOptimization, validateCVUpdate } from './cvs.validation';
import { requireAuth } from '@/middleware/authenticate';
import { checkOwnership } from '@/middleware/ownership';

const router: Router = Router();

router.use(requireAuth);

router.get('/', listCVsHandler);
router.post('/', validateRequest(validateCVCreation), createCVHandler);


router.put('/:cvId', 
    checkOwnership('cV', 'cvId'),
    validateRequest(validateCVUpdate), 
    updateCVHandler
);

router.post('/:cvId/optimize', 
    checkOwnership('cV', 'cvId'),
    validateRequest(validateCVOptimization), 
    optimizeCVHandler
);

router.post('/:cvId/generate-pdf',
    checkOwnership('cV', 'cvId'),
    generatePDFHandler
);


// router.delete('/:cvId', checkOwnership('cV', 'cvId'), deleteCVHandler); 

export default router;
```

---

## File 5: `backend/src/api/exercises/exercises.routes.ts`

```typescript
import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import {
  createExerciseHandler,
  deleteExerciseHandler,
  listExercisesHandler,
  submitExerciseHandler,
  updateExerciseHandler,
} from './exercises.controller';
import { validateExerciseCreation, validateExerciseSubmission, validateExerciseUpdate } from './exercises.validation';
import { requireAuth, requireRole } from '@/middleware/authenticate';
import { verifyExerciseOwnership, verifyModuleOwnership, checkEnrollment } from '@/middleware/ownership';
import { Role } from '@/generated/prisma/client';

const router: Router = Router();

// User: Exercises (list)
router.get('/', requireAuth, checkEnrollment, listExercisesHandler);

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
```

---

## File 6: `backend/src/api/interviews/interviews.routes.ts`

```typescript
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
```

---

## File 7: `backend/src/api/notes/notes.routes.ts`

```typescript
import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { aiChatHandler, listNotesHandler } from './notes.controller';
import { validateAiChatPayload } from './notes.validation';
import { requireAuth } from '@/middleware/authenticate';
import { checkEnrollment } from '@/middleware/ownership';

const router: Router = Router({ mergeParams: true });

// Enrollment check
router.use(requireAuth, checkEnrollment);

router.post('/ai-chat', validateRequest(validateAiChatPayload), aiChatHandler);
router.get('/ai-notes', listNotesHandler);

export default router;
```

---

## File 8: `backend/src/api/progress/progress.routes.ts`

```typescript
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
```

---

## File 9: `backend/src/api/roadmaps/roadmaps.routes.ts`

```typescript
import { Router } from 'express';
import { listRoadmapsHandler, getRoadmapHandler, enrollRoadmapHandler, createModuleHandler, createRoadmapHandler } from './roadmaps.controller';
import { requireAuth, requireRole } from '@/middleware/authenticate';
import { verifyRoadmapOwnership, checkOwnership, verifyModuleOwnership } from '@/middleware/ownership';
import { Role } from '@/generated/prisma/client';
import { 
  updateRoadmapHandler, deleteRoadmapHandler, 
  getModuleHandler, updateModuleHandler, deleteModuleHandler 
} from './roadmaps.controller';

const router: Router = Router();

// Public: Roadmap (List, View)
router.get('/', listRoadmapsHandler);
router.get('/:roadmapId', getRoadmapHandler);

// User: Roadmap (enroll)
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

export default router;
```

