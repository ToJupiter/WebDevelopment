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
import { issueCertificateHandler, listCertificatesHandler, downloadCertificatePdfHandler } from './certificates.controller';
import { validateCertificatePayload } from './certificates.validation';
import { requireAuth, requireRole } from '@/middleware/authenticate';
import { Role } from '@/generated/prisma/client';
import { checkOwnership } from '@/middleware/ownership';

const router: Router = Router();

router.use(requireAuth);

router.get('/', listCertificatesHandler);
router.get('/:certificateId/download', checkOwnership('certificate', 'certificateId', 'user_id', 'certificate_id'), downloadCertificatePdfHandler);

// Admin: Certificates (Create manually)
router.post('/', requireRole([Role.admin]),validateRequest(validateCertificatePayload), issueCertificateHandler);

export default router;
```

---

## File 4: `backend/src/api/cvs/cvs.routes.ts`

```typescript
import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { createCVHandler, listCVsHandler, optimizeCVHandler, updateCVHandler, generatePDFHandler, deleteCVHandler } from './cvs.controller';
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


router.delete('/:cvId', checkOwnership('cV', 'cvId'), deleteCVHandler); 

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
  getExerciseHandler
} from './exercises.controller';
import { validateExerciseCreation, validateExerciseSubmission, validateExerciseUpdate } from './exercises.validation';
import { requireAuth, requireRole } from '@/middleware/authenticate';
import { verifyExerciseOwnership, verifyModuleOwnership, checkEnrollment } from '@/middleware/ownership';
import { Role } from '@/generated/prisma/client';

const router: Router = Router();

// User: Exercises (list, get detail)
router.get('/', requireAuth, checkEnrollment, listExercisesHandler);
router.get('/:exerciseId', requireAuth, verifyExerciseOwnership, getExerciseHandler);

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
router.use(requireAuth);

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
import { 
  listRoadmapsHandler, getRoadmapHandler, enrollRoadmapHandler, 
  createModuleHandler, createRoadmapHandler, listEnrolledRoadmapsHandler,
  updateRoadmapHandler, deleteRoadmapHandler, 
  getModuleHandler, updateModuleHandler, deleteModuleHandler 
} from './roadmaps.controller';

import { requireAuth, requireRole } from '@/middleware/authenticate';
import { verifyRoadmapOwnership, checkOwnership, verifyModuleOwnership } from '@/middleware/ownership';
import { Role } from '@/generated/prisma/client';

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

export default router;
```

---

## File 10: `backend/src/api/users/users.routes.ts`

```typescript
import { Router } from 'express';
import { requireAuth } from '@/middleware/authenticate';
import { changePasswordHandler, getMeHandler, updateMeHandler } from './users.controller';

const router: Router = Router();

router.use(requireAuth);

router.get('/me', getMeHandler);
router.put('/me', updateMeHandler);
router.put('/me/password', changePasswordHandler);

export default router;
```

## File 11: `backend/src/api/interviews/interviews.websocket.ts`
``` ts
import { Server as HttpServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { verifyToken } from '@/services/jwt.service';
import prisma from '@/services/prisma.service';
import { createAudioTranscription } from '@/services/groq.service';
import { createTempFile, deleteTempFile } from '@/services/file.service';
import { Prisma } from '@/generated/prisma/client';

interface InterviewMessage {
  type: 'auth' | 'answer_audio' | 'answer_text' | 'next_question' | 'end_session';
  payload?: any;
}

interface Question {
  question_id: string;
  text: string;
  topic?: string;
}

export function setupInterviewWebSocket(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: '/interviews/ws' });

  wss.on('connection', (ws: WebSocket) => {
    let userId: string | null = null;
    let sessionId: string | null = null;
    let currentQuestions: Question[] = [];
    let currentQuestionIndex = 0;

    console.log('New WebSocket connection established');

    ws.on('message', async (data) => {
      try {
        const message: InterviewMessage = JSON.parse(data.toString());

        switch (message.type) {
          case 'auth':
            await handleAuth(message.payload);
            break;
          case 'answer_audio':
            await handleAudioAnswer(message.payload);
            break;
          case 'answer_text':
            await handleTextAnswer(message.payload);
            break;
          case 'end_session':
            handleEndSession();
            break;
          default:
            sendError('Unknown message type');
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        sendError('Internal server error');
      }
    });

    // --- Handlers ---

    async function handleAuth(payload: { token: string; session_id: string }) {
      const decoded = verifyToken(payload.token);
      if (!decoded) {
        sendError('Invalid token');
        ws.close();
        return;
      }

      userId = decoded.user_id;
      sessionId = payload.session_id;

      const session = await prisma.interviewSession.findUnique({
        where: { session_id: sessionId },
      });

      if (!session || session.user_id !== userId) {
        sendError('Session not found or unauthorized');
        ws.close();
        return;
      }

      // Load Questions
      currentQuestions = session.questions as unknown as Question[];
      
      // Determine where to start (if resuming)
      const existingAnswers = (session.user_answers as unknown as any[]) || [];
      currentQuestionIndex = existingAnswers.length;

      if (currentQuestionIndex >= currentQuestions.length) {
        sendMessage('finished', { message: 'Interview already completed' });
      } else {
        sendNextQuestion();
      }
    }

    async function handleAudioAnswer(payload: { audio_base64: string }) {
      if (!userId || !sessionId) return sendError('Not authenticated');

      const buffer = Buffer.from(payload.audio_base64, 'base64');
      const tempPath = await createTempFile(buffer, '.webm'); // Assuming webm from browser

      try {
        // 1. Transcribe
        const transcription = await createAudioTranscription(tempPath);
        const textAnswer = transcription.text;

        // 2. Save Answer
        await saveAnswerToDB(textAnswer);

        // 3. Ack to client
        sendMessage('transcription', { text: textAnswer, question_id: currentQuestions[currentQuestionIndex].question_id });

        // 4. Move Next
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
          sendNextQuestion();
        } else {
          sendMessage('finished', { message: 'All questions answered' });
        }

      } catch (error) {
        console.error('Transcription error:', error);
        sendError('Failed to process audio');
      } finally {
        await deleteTempFile(tempPath);
      }
    }

    async function handleTextAnswer(payload: { text: string }) {
      if (!userId || !sessionId) return sendError('Not authenticated');
      
      await saveAnswerToDB(payload.text);
      
      currentQuestionIndex++;
      if (currentQuestionIndex < currentQuestions.length) {
        sendNextQuestion();
      } else {
        sendMessage('finished', { message: 'All questions answered' });
      }
    }

    async function saveAnswerToDB(answerText: string) {
      if (!sessionId) return;
      
      const currentQ = currentQuestions[currentQuestionIndex];
      const newAnswer = {
        question_id: currentQ.question_id,
        question_text: currentQ.text,
        answer: answerText,
        timestamp: new Date()
      };

      // Atomic update of the JSON array
      // Note: Prisma doesn't support direct array push easily for JSON, 
      // so we fetch, push, update. In high concurency this is bad, 
      // but for single user session it's acceptable.
      const session = await prisma.interviewSession.findUnique({ where: { session_id: sessionId }});
      const currentAnswers = (session?.user_answers as unknown as any[]) || [];
      
      await prisma.interviewSession.update({
        where: { session_id: sessionId },
        data: {
          user_answers: [...currentAnswers, newAnswer] as Prisma.InputJsonValue
        }
      });
    }

    function sendNextQuestion() {
      const q = currentQuestions[currentQuestionIndex];
      sendMessage('question', {
        index: currentQuestionIndex,
        total: currentQuestions.length,
        question_id: q.question_id,
        text: q.text
      });
    }

    function handleEndSession() {
      // Trigger AI feedback generation logic here if needed, 
      // or client calls the REST submit endpoint to finalize.
      ws.close();
    }

    function sendMessage(type: string, payload: any) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type, payload }));
      }
    }

    function sendError(message: string) {
      sendMessage('error', { message });
    }
  });
}
```