import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import config from './config';

// Middleware
import { authLimiter, apiLimiter } from './middleware/rateLimiter';
import { requireAuth } from './middleware/authenticate';

// Routers
import authRouter from './api/auth/auth.routes';
import calendarRouter from './api/calendar/calendar.routes';
import certificatesRouter from './api/certificates/certificates.routes';
import cvsRouter from './api/cvs/cvs.routes';
import exercisesRouter from './api/exercises/exercises.routes';
import interviewsRouter from './api/interviews/interviews.routes';
import notesRouter from './api/notes/notes.routes';
import progressRouter from './api/progress/progress.routes';
import roadmapsRouter from './api/roadmaps/roadmaps.routes';
import usersRouter from './api/users/users.routes';

const app: Application = express();

// --- Security middleware ---
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// CORS Configuration
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

// --- Routes ---

// Public
app.use('/api/auth', authLimiter, authRouter);

// Health
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Welcome to SkillSync API' });
});

// Protected routes
app.use('/api', apiLimiter)

// User Routes
app.use('/api/users', usersRouter);

// requireAuth
app.use('/api/calendar', requireAuth, calendarRouter);
app.use('/api/progress', requireAuth, progressRouter);
app.use('/api/roadmaps', roadmapsRouter);
app.use('/api/certificates', requireAuth, certificatesRouter);
app.use('/api/cvs', requireAuth, cvsRouter);
app.use('/api/exercises', requireAuth, exercisesRouter);
app.use('/api/interviews', requireAuth, interviewsRouter);
app.use('/api/modules/:moduleId', requireAuth, notesRouter);


// app.use('/api/auth', authRouter);
// app.use('/api/calendar', calendarRouter);
// app.use('/api/progress', progressRouter);
// app.use('/api/roadmaps', roadmapsRouter);
// app.use('/api/certificates', certificatesRouter);
// app.use('/api/cvs', cvsRouter);
// app.use('/api/exercises', exercisesRouter);
// app.use('/api/interviews', interviewsRouter);
// app.use('/api/modules/:moduleId', notesRouter);
// app.get('/', (req: Request, res: Response) => {
//     res.status(200).json({success: true, message: 'Welcome to SkillSync API'});
// });

export default app;