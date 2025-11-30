## File: src/app.ts

```typescript
import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import authRouter from './api/auth/auth.routes';
import calendarRouter from './api/calendar/calendar.routes';
import certificatesRouter from './api/certificates/certificates.routes';
import cvsRouter from './api/cvs/cvs.routes';
import exercisesRouter from './api/exercises/exercises.routes';
import interviewsRouter from './api/interviews/interviews.routes';
import notesRouter from './api/notes/notes.routes';
import progressRouter from './api/progress/progress.routes';
import roadmapsRouter from './api/roadmaps/roadmaps.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/auth', authRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/progress', progressRouter);
app.use('/api/roadmaps', roadmapsRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/cvs', cvsRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/interviews', interviewsRouter);
app.use('/api/modules/:moduleId', notesRouter);
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({success: true, message: 'Welcome to SkillSync API'});
});

export default app;
```

## File: src/server.ts

```typescript
import app from './app';
import config from './config';

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});



```

## File: src/api/auth/auth.controller.ts

```typescript
import { Request, Response } from 'express';
import { createUser } from './auth.services';
import { RegisterInput } from './auth.validation';

export async function registerUserHandler(req: Request, res: Response) {
    try {
        const userInput: RegisterInput = req.body;
        const user = await createUser(userInput);
        const { password_hash, ...userResponse} = user;
        
        return res.status(201).json({success: true, data: userResponse, error: null});
    } catch (error: any){
        if (error.code == 'P2002' && error.meta?.target?.includes('email')){
            return res.status(409).json({
                success: false,
                data: null,
                error: 'An user with this email already exists.',
            });
        }
        return res.status(500).json({
            success: false,
            data: null,
            error: 'Internal Server Error',
        });
    }
}
```

## File: src/api/auth/auth.routes.ts

```typescript
import { Router } from 'express';
import { registerUserHandler } from './auth.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { validateRegisterInput } from './auth.validation';

const router: Router = Router();

router.post('/register', validateRequest(validateRegisterInput), registerUserHandler);

export default router;
```

## File: src/api/auth/auth.services.ts

```typescript
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function createUser(input: Omit<User, 'user_id' | 'created_at' | 'updated_at' | 'current_level' | 'role' | 'avatar_url' | 'password_hash'> & { password: string }): Promise<User> {
    const {email, password, full_name } = input;

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            email,
            password_hash, 
            full_name
        },
    });

    return user;
}
```

## File: src/api/auth/auth.validation.ts

```typescript
export interface RegisterInput {
  full_name: string;
  email: string;
  password: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateRegisterInput(input: RegisterInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.full_name || input.full_name.trim().length < 3) {
    errors.push({
      field: 'full_name',
      message: 'Full name must be at least 3 characters long',
    });
  }

  if (!input.email || !/^\S+@\S+\.\S+$/.test(input.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email address',
    });
  }

  if (!input.password || input.password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters long',
    });
  }

  return errors;
}
```

## File: src/api/calendar/calendar.controller.ts

```typescript
import { Request, Response } from 'express';
import { createLearningEvent, listLearningEvents, softDeleteLearningEvent, updateLearningEvent } from './calendar.services';
import { validateCalendarQuery } from './calendar.validation';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function listEventsHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const errors = validateCalendarQuery({
      start: typeof req.query.start === 'string' ? req.query.start : undefined,
      end: typeof req.query.end === 'string' ? req.query.end : undefined,
    });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, data: null, error: 'Validation failed', details: errors });
    }
    const events = await listLearningEvents(userId, {
      start: typeof req.query.start === 'string' ? req.query.start : undefined,
      end: typeof req.query.end === 'string' ? req.query.end : undefined,
    });
    return res.status(200).json({ success: true, data: events, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function createEventHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const event = await createLearningEvent(userId, req.body);
    return res.status(201).json({ success: true, data: event, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function updateEventHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { eventId } = req.params;
    const updated = await updateLearningEvent(eventId, userId, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, data: null, error: 'Event not found' });
    }
    return res.status(200).json({ success: true, data: updated, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function deleteEventHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { eventId } = req.params;
    const deleted = await softDeleteLearningEvent(eventId, userId);
    if (!deleted) {
      return res.status(404).json({ success: false, data: null, error: 'Event not found' });
    }
    return res.status(200).json({ success: true, data: deleted, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

```

## File: src/api/calendar/calendar.routes.ts

```typescript
import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { createEventHandler, deleteEventHandler, listEventsHandler, updateEventHandler } from './calendar.controller';
import { validateCalendarCreation, validateCalendarUpdate } from './calendar.validation';

const router: Router = Router();

router.get('/events', listEventsHandler);
router.post('/events', validateRequest(validateCalendarCreation), createEventHandler);
router.put('/events/:eventId', validateRequest(validateCalendarUpdate), updateEventHandler);
router.delete('/events/:eventId', deleteEventHandler);

export default router;

```

## File: src/api/calendar/calendar.services.ts

```typescript
import { Prisma, LearningEvent, EventStatus } from '@prisma/client';
import prisma from '@/services/prisma.service';

type EventFilters = {
  start?: string;
  end?: string;
};

type CreatePayload = {
  title: string;
  description?: string;
  start_utc: string;
  end_utc: string;
  timezone?: string;
  module_id?: string;
  color?: string;
  all_day?: boolean;
  reminder_minutes?: number;
};

type UpdatePayload = {
  title?: string;
  description?: string;
  start_utc?: string;
  end_utc?: string;
  timezone?: string;
  module_id?: string | null;
  color?: string;
  all_day?: boolean;
  reminder_minutes?: number | null;
  status?: EventStatus;
};

export async function listLearningEvents(userId: string, filters: EventFilters) {
  const where: Prisma.LearningEventWhereInput = {
    user_id: userId,
    is_deleted: false,
  };

  if (filters.start) {
    where.start_utc = { gte: new Date(filters.start) };
  }
  if (filters.end) {
    where.end_utc = { lte: new Date(filters.end) };
  }

  return prisma.learningEvent.findMany({
    where,
    orderBy: { start_utc: 'asc' },
  });
}

export async function createLearningEvent(userId: string, payload: CreatePayload) {
  const data = {
    user_id: userId,
    title: payload.title,
    description: payload.description,
    start_utc: new Date(payload.start_utc),
    end_utc: new Date(payload.end_utc),
    timezone: payload.timezone,
    module_id: payload.module_id,
    color: payload.color,
    all_day: payload.all_day ?? false,
    reminder_minutes: payload.reminder_minutes,
    status: EventStatus.planned,
  };
  return prisma.learningEvent.create({ data });
}

export async function updateLearningEvent(eventId: string, userId: string, payload: UpdatePayload) {
  const event = await prisma.learningEvent.findUnique({
    where: { event_id: eventId },
  });
  if (!event || event.user_id !== userId || event.is_deleted) {
    return null;
  }
  const data: Record<string, unknown> = {};
  if (payload.title) {
    data.title = payload.title;
  }
  if (payload.description !== undefined) {
    data.description = payload.description;
  }
  if (payload.start_utc) {
    data.start_utc = new Date(payload.start_utc);
  }
  if (payload.end_utc) {
    data.end_utc = new Date(payload.end_utc);
  }
  if (payload.timezone) {
    data.timezone = payload.timezone;
  }
  if (payload.module_id !== undefined) {
    data.module_id = payload.module_id;
  }
  if (payload.color) {
    data.color = payload.color;
  }
  if (payload.all_day !== undefined) {
    data.all_day = payload.all_day;
  }
  if (payload.reminder_minutes !== undefined) {
    data.reminder_minutes = payload.reminder_minutes;
  }
  if (payload.status) {
    data.status = payload.status;
  }
  return prisma.learningEvent.update({ where: { event_id: eventId }, data });
}

export async function softDeleteLearningEvent(eventId: string, userId: string) {
  const event = await prisma.learningEvent.findUnique({
    where: { event_id: eventId },
  });
  if (!event || event.user_id !== userId || event.is_deleted) {
    return null;
  }
  return prisma.learningEvent.update({
    where: { event_id: eventId },
    data: { is_deleted: true },
  });
}

```

## File: src/api/calendar/calendar.validation.ts

```typescript
import { ValidationError } from '@/api/auth/auth.validation';

function isValidIsoDate(value?: string) {
  if (!value || typeof value != 'string') {
    return false;
  }
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString() === value;
}

export function validateCalendarQuery(query: { start?: string; end?: string }) {
  const errors: ValidationError[] = [];
  if (query.start && !isValidIsoDate(query.start)) {
    errors.push({ field: 'start', message: 'start must be a valid ISO date string' });
  }
  if (query.end && !isValidIsoDate(query.end)) {
    errors.push({ field: 'end', message: 'end must be a valid ISO date string' });
  }
  return errors;
}

export function validateCalendarCreation(body: { title?: string; start_utc?: string; end_utc?: string }) {
  const errors: ValidationError[] = [];
  if (!body.title || body.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'title is required and must be at least 3 characters' });
  }
  if (!isValidIsoDate(body.start_utc)) {
    errors.push({ field: 'start_utc', message: 'start_utc must be a valid ISO date string' });
  }
  if (!isValidIsoDate(body.end_utc)) {
    errors.push({ field: 'end_utc', message: 'end_utc must be a valid ISO date string' });
  }
  if (body.start_utc && body.end_utc) {
    const start = new Date(body.start_utc);
    const end = new Date(body.end_utc);
    if (start > end) {
      errors.push({ field: 'end_utc', message: 'end_utc must be after start_utc' });
    }
  }
  return errors;
}

export function validateCalendarUpdate(body: { title?: string; start_utc?: string; end_utc?: string }) {
  const errors: ValidationError[] = [];
  if (body.title && body.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'title must be at least 3 characters if provided' });
  }
  if (body.start_utc && !isValidIsoDate(body.start_utc)) {
    errors.push({ field: 'start_utc', message: 'start_utc must be a valid ISO date string' });
  }
  if (body.end_utc && !isValidIsoDate(body.end_utc)) {
    errors.push({ field: 'end_utc', message: 'end_utc must be a valid ISO date string' });
  }
  if (body.start_utc && body.end_utc) {
    const start = new Date(body.start_utc);
    const end = new Date(body.end_utc);
    if (start > end) {
      errors.push({ field: 'end_utc', message: 'end_utc must be after start_utc' });
    }
  }
  return errors;
}

```

## File: src/api/certificates/certificates.controller.ts

```typescript
import { Request, Response } from 'express';
import { listUserCertificates, issueCertificate } from './certificates.services';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function listCertificatesHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const certificates = await listUserCertificates(userId);
    return res.status(200).json({ success: true, data: certificates, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function issueCertificateHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { roadmap_id } = req.body;
    const certificateName = req.body.certificate_name;
    const created = await issueCertificate(userId, roadmap_id, certificateName);
    if (!created) {
      return res.status(409).json({ success: false, data: null, error: 'Certificate already issued' });
    }
    return res.status(201).json({ success: true, data: created, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

```

## File: src/api/certificates/certificates.routes.ts

```typescript
import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { issueCertificateHandler, listCertificatesHandler } from './certificates.controller';
import { validateCertificatePayload } from './certificates.validation';

const router: Router = Router();

router.get('/', listCertificatesHandler);
router.post('/', validateRequest(validateCertificatePayload), issueCertificateHandler);

export default router;

```

## File: src/api/certificates/certificates.services.ts

```typescript
import prisma from '@/services/prisma.service';

export type CertificateRecord = {
  certificate_id: string;
  roadmap_id: string;
  certificate_name: string;
  issue_date: Date;
  pdf_url: string | null;
};

export async function listUserCertificates(userId: string) {
  return prisma.certificate.findMany({
    where: { user_id: userId },
    orderBy: { issue_date: 'desc' },
    select: {
      certificate_id: true,
      roadmap_id: true,
      certificate_name: true,
      issue_date: true,
      pdf_url: true,
    },
  });
}

export async function issueCertificate(userId: string, roadmapId: string, certificateName: string) {
  const existing = await prisma.certificate.findUnique({
    where: { user_id_roadmap_id: { user_id: userId, roadmap_id: roadmapId } },
  });
  if (existing) {
    return null;
  }
  return prisma.certificate.create({
    data: {
      user_id: userId,
      roadmap_id: roadmapId,
      certificate_name: certificateName,
    },
  });
}

```

## File: src/api/certificates/certificates.validation.ts

```typescript
import { ValidationError } from '@/api/auth/auth.validation';

export function validateCertificatePayload(body: { road_map?: string; roadmap_id?: string; certificate_name?: string }) {
  const errors: ValidationError[] = [];
  const roadmapId = body.roadmap_id || body.road_map;
  if (!roadmapId || roadmapId.trim().length === 0) {
    errors.push({ field: 'roadmap_id', message: 'roadmap_id is required' });
  }
  if (!body.certificate_name || body.certificate_name.trim().length < 3) {
    errors.push({ field: 'certificate_name', message: 'certificate_name must be at least 3 characters' });
  }
  return errors;
}

```

## File: src/api/cvs/cvs.controller.ts

```typescript
import { Request, Response } from 'express';
import { TemplateStyle } from '@prisma/client';
import { createCV, listUserCVs, optimizeCVSection, updateCV } from './cvs.services';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function listCVsHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const cvs = await listUserCVs(userId);
    return res.status(200).json({ success: true, data: cvs, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function createCVHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const created = await createCV(userId, {
      cv_name: req.body.cv_name,
      template_style: req.body.template_style as TemplateStyle,
      personal_info: req.body.personal_info,
      education: req.body.education,
      experience: req.body.experience,
      skills: req.body.skills,
      projects: req.body.projects,
    });
    return res.status(201).json({ success: true, data: created, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function updateCVHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { cvId } = req.params;
    const updated = await updateCV(userId, cvId, {
      cv_name: req.body.cv_name,
      template_style: req.body.template_style as TemplateStyle,
      personal_info: req.body.personal_info,
      education: req.body.education,
      experience: req.body.experience,
      skills: req.body.skills,
      projects: req.body.projects,
    });
    if (!updated) {
      return res.status(404).json({ success: false, data: null, error: 'CV not found' });
    }
    return res.status(200).json({ success: true, data: updated, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function optimizeCVHandler(req: Request, res: Response) {
  try {
    const { cvId } = req.params;
    const { section, index, text } = req.body;
    const result = await optimizeCVSection(cvId, section, typeof index === 'number' ? index : null, text);
    return res.status(200).json({ success: true, data: result, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

```

## File: src/api/cvs/cvs.routes.ts

```typescript
import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { createCVHandler, listCVsHandler, optimizeCVHandler, updateCVHandler } from './cvs.controller';
import { validateCVCreation, validateCVOptimization, validateCVUpdate } from './cvs.validation';

const router: Router = Router();

router.get('/', listCVsHandler);
router.post('/', validateRequest(validateCVCreation), createCVHandler);
router.put('/:cvId', validateRequest(validateCVUpdate), updateCVHandler);
router.post('/:cvId/optimize', validateRequest(validateCVOptimization), optimizeCVHandler);

export default router;

```

## File: src/api/cvs/cvs.services.ts

```typescript
import { Prisma, TemplateStyle } from '@prisma/client';
import prisma from '@/services/prisma.service';

export const templateStyles: TemplateStyle[] = ['modern', 'classic', 'minimal'];

type JsonPayload = Prisma.InputJsonValue;

export async function listUserCVs(userId: string) {
  return prisma.cV.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    select: {
      cv_id: true,
      cv_name: true,
      template_style: true,
      created_at: true,
      updated_at: true,
      pdf_url: true,
    },
  });
}

export async function createCV(userId: string, payload: { cv_name: string; template_style: TemplateStyle; personal_info?: JsonPayload; education?: JsonPayload; experience?: JsonPayload; skills?: JsonPayload; projects?: JsonPayload }) {
  return prisma.cV.create({
    data: {
      user_id: userId,
      cv_name: payload.cv_name,
      template_style: payload.template_style,
      personal_info: payload.personal_info,
      education: payload.education,
      experience: payload.experience,
      skills: payload.skills,
      projects: payload.projects,
    },
  });
}

export async function updateCV(userId: string, cvId: string, payload: Partial<{ cv_name: string; template_style: TemplateStyle; personal_info: JsonPayload; education: JsonPayload; experience: JsonPayload; skills: JsonPayload; projects: JsonPayload }>) {
  const existing = await prisma.cV.findUnique({ where: { cv_id: cvId } });
  if (!existing || existing.user_id !== userId) {
    return null;
  }
  const data: Prisma.CVUpdateInput = {};
  if (payload.cv_name) {
    data.cv_name = payload.cv_name;
  }
  if (payload.template_style) {
    data.template_style = payload.template_style;
  }
  if (payload.personal_info !== undefined) {
    data.personal_info = payload.personal_info;
  }
  if (payload.education !== undefined) {
    data.education = payload.education;
  }
  if (payload.experience !== undefined) {
    data.experience = payload.experience;
  }
  if (payload.skills !== undefined) {
    data.skills = payload.skills;
  }
  if (payload.projects !== undefined) {
    data.projects = payload.projects;
  }
  return prisma.cV.update({
    where: { cv_id: cvId },
    data,
  });
}

export async function optimizeCVSection(cvId: string, section: 'personal_info' | 'education' | 'experience' | 'skills' | 'projects', index: number | null, text: string) {
  return {
    cv_id: cvId,
    section,
    optimized_text: `Optimized: ${text}`,
    index,
  };
}

```

## File: src/api/cvs/cvs.validation.ts

```typescript
import { TemplateStyle } from '@prisma/client';
import { ValidationError } from '@/api/auth/auth.validation';
import { templateStyles } from './cvs.services';

const optimizationSections = ['personal_info', 'education', 'experience', 'skills', 'projects'];

export function validateCVCreation(body: { cv_name?: string; template_style?: string }) {
  const errors: ValidationError[] = [];
  if (!body.cv_name || body.cv_name.trim().length < 3) {
    errors.push({ field: 'cv_name', message: 'cv_name is required and must be at least 3 characters' });
  }
  if (!body.template_style || !templateStyles.includes(body.template_style as TemplateStyle)) {
    errors.push({ field: 'template_style', message: 'template_style must be modern, classic, or minimal' });
  }
  return errors;
}

export function validateCVUpdate(body: { template_style?: string }) {
  const errors: ValidationError[] = [];
  if (body.template_style && !templateStyles.includes(body.template_style as TemplateStyle)) {
    errors.push({ field: 'template_style', message: 'template_style must be modern, classic, or minimal' });
  }
  return errors;
}

export function validateCVOptimization(body: { section?: string; text?: string }) {
  const errors: ValidationError[] = [];
  if (!body.section || !optimizationSections.includes(body.section)) {
    errors.push({ field: 'section', message: 'section must be one of personal_info, education, experience, skills, projects' });
  }
  if (!body.text || body.text.trim().length === 0) {
    errors.push({ field: 'text', message: 'text is required for optimization' });
  }
  return errors;
}

```

## File: src/api/exercises/exercises.controller.ts

```typescript
import { Request, Response } from 'express';
import { createExercise, deleteExercise, listExercises, submitExercise, updateExercise } from './exercises.services';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function listExercisesHandler(req: Request, res: Response) {
  try {
    const moduleId = typeof req.query.module_id === 'string' ? req.query.module_id : undefined;
    const exercises = await listExercises(moduleId);
    return res.status(200).json({ success: true, data: exercises, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function createExerciseHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const exercise = await createExercise({
      module_id: req.body.module_id,
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      examples: req.body.examples,
    });
    return res.status(201).json({ success: true, data: exercise, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function updateExerciseHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { exerciseId } = req.params;
    const updated = await updateExercise(exerciseId, {
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      examples: req.body.examples,
    });
    if (!updated) {
      return res.status(404).json({ success: false, data: null, error: 'Exercise not found' });
    }
    return res.status(200).json({ success: true, data: updated, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function deleteExerciseHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { exerciseId } = req.params;
    const deleted = await deleteExercise(exerciseId);
    if (!deleted) {
      return res.status(404).json({ success: false, data: null, error: 'Exercise not found' });
    }
    return res.status(200).json({ success: true, data: deleted, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function submitExerciseHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    const { exerciseId } = req.params;
    const submission = await submitExercise(exerciseId, {
      answer_text: req.body.answer_text,
      user_id: userId,
    });
    return res.status(201).json({ success: true, data: submission, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

```

## File: src/api/exercises/exercises.routes.ts

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

const router: Router = Router();

router.get('/', listExercisesHandler);
router.post('/', validateRequest(validateExerciseCreation), createExerciseHandler);
router.put('/:exerciseId', validateRequest(validateExerciseUpdate), updateExerciseHandler);
router.delete('/:exerciseId', deleteExerciseHandler);
router.post('/:exerciseId/submit', validateRequest(validateExerciseSubmission), submitExerciseHandler);

export default router;

```

## File: src/api/exercises/exercises.services.ts

```typescript
import { Prisma } from '@prisma/client';
import prisma from '@/services/prisma.service';

export async function listExercises(moduleId?: string) {
  const where = moduleId ? { module_id: moduleId } : undefined;
  return prisma.exercise.findMany({
    where,
    orderBy: { created_at: 'desc' },
  });
}

type JsonPayload = Prisma.InputJsonValue;

export async function createExercise(payload: { module_id: string; title: string; description: string; difficulty?: 'easy' | 'medium' | 'hard'; examples?: JsonPayload }) {
  return prisma.exercise.create({
    data: {
      module_id: payload.module_id,
      title: payload.title,
      description: payload.description,
      difficulty: payload.difficulty ?? 'medium',
      examples: payload.examples,
    },
  });
}

export async function updateExercise(exerciseId: string, payload: Partial<{ title: string; description: string; difficulty: 'easy' | 'medium' | 'hard'; examples?: JsonPayload }>) {
  const existing = await prisma.exercise.findUnique({ where: { exercise_id: exerciseId } });
  if (!existing) {
    return null;
  }
  const data = {} as Record<string, unknown>;
  if (payload.title) {
    data.title = payload.title;
  }
  if (payload.description) {
    data.description = payload.description;
  }
  if (payload.difficulty) {
    data.difficulty = payload.difficulty;
  }
  if (payload.examples !== undefined) {
    data.examples = payload.examples;
  }
  return prisma.exercise.update({
    where: { exercise_id: exerciseId },
    data,
  });
}

export async function deleteExercise(exerciseId: string) {
  const existing = await prisma.exercise.findUnique({ where: { exercise_id: exerciseId } });
  if (!existing) {
    return null;
  }
  return prisma.exercise.delete({ where: { exercise_id: exerciseId } });
}

export async function submitExercise(exerciseId: string, payload: { user_id?: string; answer_text: string }) {
  return {
    exercise_id: exerciseId,
    submitted_at: new Date().toISOString(),
    user_id: payload.user_id ?? null,
    status: 'received',
    answer_text: payload.answer_text,
  };
}

```

## File: src/api/exercises/exercises.validation.ts

```typescript
import { ValidationError } from '@/api/auth/auth.validation';

const difficultyValues = ['easy', 'medium', 'hard'];

export function validateExerciseCreation(body: { module_id?: string; title?: string; description?: string; difficulty?: string }) {
  const errors: ValidationError[] = [];
  if (!body.module_id || body.module_id.trim().length === 0) {
    errors.push({ field: 'module_id', message: 'module_id is required' });
  }
  if (!body.title || body.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'title is required' });
  }
  if (!body.description || body.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'description is required' });
  }
  if (body.difficulty && !difficultyValues.includes(body.difficulty)) {
    errors.push({ field: 'difficulty', message: 'difficulty must be easy, medium, or hard' });
  }
  return errors;
}

export function validateExerciseUpdate(body: { difficulty?: string }) {
  const errors: ValidationError[] = [];
  if (body.difficulty && !difficultyValues.includes(body.difficulty)) {
    errors.push({ field: 'difficulty', message: 'difficulty must be easy, medium, or hard' });
  }
  return errors;
}

export function validateExerciseSubmission(body: { answer_text?: string }) {
  const errors: ValidationError[] = [];
  if (!body.answer_text || body.answer_text.trim().length === 0) {
    errors.push({ field: 'answer_text', message: 'answer_text is required' });
  }
  return errors;
}

```

## File: src/api/interviews/interviews.controller.ts

```typescript
import { Request, Response } from 'express';
import {
  createInterviewSession,
  listSessions,
  submitInterviewSession,
  InterviewAnswer,
} from './interviews.services';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function startInterviewHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const session = await createInterviewSession(userId, {
      session_name: req.body.session_name,
      interview_type: req.body.interview_type,
    });
    return res.status(201).json({
      success: true,
      data: {
        session_id: session.session_id,
        questions: session.questions,
      },
      error: null,
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function submitInterviewHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { sessionId } = req.params;
    const answers: InterviewAnswer[] = req.body.user_answers;
    const updated = await submitInterviewSession(userId, sessionId, answers);
    if (!updated) {
      return res.status(404).json({ success: false, data: null, error: 'Session not found' });
    }
    return res.status(200).json({
      success: true,
      data: {
        session_id: updated.session_id,
        ai_feedback: updated.ai_feedback,
        score: updated.score,
      },
      error: null,
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function listInterviewsHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const sessions = await listSessions(userId);
    return res.status(200).json({ success: true, data: sessions, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}
```

## File: src/api/interviews/interviews.routes.ts

```typescript
import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import {
  listInterviewsHandler,
  startInterviewHandler,
  submitInterviewHandler,
} from './interviews.controller';
import { validateInterviewCreation, validateInterviewSubmission } from './interviews.validation';

const router: Router = Router();

router.post('/sessions', validateRequest(validateInterviewCreation), startInterviewHandler);
router.post('/sessions/:sessionId/submit', validateRequest(validateInterviewSubmission), submitInterviewHandler);
router.get('/sessions', listInterviewsHandler);

export default router;
```

## File: src/api/interviews/interviews.services.ts

```typescript
import { InterviewType, Prisma } from '@prisma/client';
import prisma from '@/services/prisma.service';
import { createChatCompletion, extractFirstMessageContent, ChatMessage } from '@/services/groq.service';

export interface InterviewQuestion {
  question_id: string;
  text: string;
  topic?: string;
  context?: string;
}

export interface InterviewAnswer {
  question_id: string;
  answer: string;
}

const questionBank: InterviewQuestion[] = [
  {
    question_id: 'react-lifecycle',
    text: 'Explain the React component lifecycle and how it relates to rendering patterns.',
    topic: 'React',
  },
  {
    question_id: 'async-await',
    text: 'Describe how async/await differs from raw Promises and event loop timing.',
    topic: 'JavaScript',
  },
  {
    question_id: 'rest-security',
    text: 'What techniques do you use to secure a REST API in production?',
    topic: 'Security',
  },
  {
    question_id: 'sql-optimization',
    text: 'How do you approach optimizing a slow SQL query?',
    topic: 'Database',
  },
  {
    question_id: 'testing-strategy',
    text: 'Explain your testing pyramid for a new feature.',
    topic: 'Testing',
  },
  {
    question_id: 'design-tradeoffs',
    text: 'Describe how you balance developer productivity versus technical debt.',
    topic: 'Architecture',
  },
  {
    question_id: 'teamwork',
    text: 'How do you collaborate effectively with product and design during a release?',
    topic: 'Soft Skills',
  },
];

const SESSION_QUESTION_COUNT = 4;

async function selectQuestionsForUser(userId: string) {
  const progress = await prisma.userProgress.findMany({
    where: { user_id: userId },
    orderBy: { last_accessed_at: 'desc' },
    take: 5,
  });
  const recentTopics = new Set<string>();
  progress.forEach((entry) => {
    if (entry.module_id) {
      recentTopics.add(entry.module_id);
    }
  });

  const selected: InterviewQuestion[] = [];
  const usedIds = new Set<string>();

  for (const question of questionBank) {
    if (selected.length >= SESSION_QUESTION_COUNT) {
      break;
    }
    if (recentTopics.has(question.question_id)) {
      usedIds.add(question.question_id);
      selected.push(question);
    }
  }

  for (const question of questionBank) {
    if (selected.length >= SESSION_QUESTION_COUNT) {
      break;
    }
    if (!usedIds.has(question.question_id)) {
      usedIds.add(question.question_id);
      selected.push(question);
    }
  }

  return selected;
}

interface InterviewFeedback {
  summary: string;
  score: number;
  highlights?: string;
  areas_for_growth?: string;
  raw?: string;
}

async function buildInterviewFeedback(questions: InterviewQuestion[], answers: InterviewAnswer[]) {
  const questionList = questions.map((question, index) => `${index + 1}. ${question.text}`).join('\n');
  const answerList = answers.map((answer, index) => `${index + 1}. ${answer.question_id}: ${answer.answer}`).join('\n');
  const systemMessage: ChatMessage = {
    role: 'system',
    content: 'You are an interview coach. Provide concise, constructive feedback.',
  };
  const userMessage: ChatMessage = {
    role: 'user',
    content: `Questions:\n${questionList}\n\nAnswers:\n${answerList}\n\nRespond as JSON with summary, score, highlights, areas_for_growth. Score between 0 and 100.`,
  };

  const completion = await createChatCompletion([systemMessage, userMessage], 'gpt-oss-20b', 0.5);
  const raw = extractFirstMessageContent(completion);
  let parsed: Partial<InterviewFeedback> = {};
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      parsed = {};
    }
  }

  const scoreCandidate = typeof parsed.score === 'number' ? parsed.score : Number(parsed.score ?? NaN);
  const normalizedScore = Number.isFinite(scoreCandidate) ? Math.min(Math.max(scoreCandidate, 0), 100) : 0;

  return {
    summary: parsed.summary ?? raw ?? 'Insights currently unavailable.',
    score: normalizedScore,
    highlights: parsed.highlights,
    areas_for_growth: parsed.areas_for_growth,
    raw,
  };
}

export async function createInterviewSession(userId: string, payload: { session_name: string; interview_type: InterviewType }) {
  const questions = await selectQuestionsForUser(userId);
  const payloadJson = questions as unknown as Prisma.InputJsonValue;
  return prisma.interviewSession.create({
    data: {
      user_id: userId,
      session_name: payload.session_name,
      interview_type: payload.interview_type,
      questions: payloadJson,
    },
  });
}

export async function submitInterviewSession(userId: string, sessionId: string, answers: InterviewAnswer[]) {
  const session = await prisma.interviewSession.findUnique({ where: { session_id: sessionId } });
  if (!session || session.user_id !== userId) {
    return null;
  }
  const storedQuestions = (session.questions as unknown as InterviewQuestion[]) ?? [];
  const feedback = await buildInterviewFeedback(storedQuestions, answers);
  const answersJson = answers as unknown as Prisma.InputJsonValue;
  return prisma.interviewSession.update({
    where: { session_id: sessionId },
    data: {
      user_answers: answersJson,
      ai_feedback: feedback,
      score: feedback.score,
    },
  });
}

export async function listSessions(userId: string) {
  const sessions = await prisma.interviewSession.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    select: {
      session_id: true,
      session_name: true,
      interview_type: true,
      score: true,
      created_at: true,
      ai_feedback: true,
    },
  });
  return sessions.map((session) => ({
    ...session,
    score: session.score ? Number(session.score) : null,
  }));
}
```

## File: src/api/interviews/interviews.validation.ts

```typescript
import { InterviewType } from '@prisma/client';
import { ValidationError } from '../auth/auth.validation';

const ALLOWED_TYPES: InterviewType[] = ['simulated', 'prep_feedback'];

export function validateInterviewCreation(body: { session_name?: string; interview_type?: string }) {
  const errors: ValidationError[] = [];
  if (!body.session_name || body.session_name.trim().length < 3) {
    errors.push({ field: 'session_name', message: 'Session name must be at least 3 characters long' });
  }
  if (!body.interview_type || !ALLOWED_TYPES.includes(body.interview_type as InterviewType)) {
    errors.push({ field: 'interview_type', message: `Interview type must be one of ${ALLOWED_TYPES.join(', ')}` });
  }
  return errors;
}

export function validateInterviewSubmission(body: { user_answers?: Array<{ question_id?: string; answer?: string }> }) {
  const errors: ValidationError[] = [];
  if (!Array.isArray(body.user_answers) || body.user_answers.length === 0) {
    errors.push({ field: 'user_answers', message: 'At least one answer is required' });
    return errors;
  }
  body.user_answers.forEach((answer, index) => {
    if (!answer.question_id || typeof answer.question_id !== 'string') {
      errors.push({ field: `user_answers[${index}].question_id`, message: 'Question identifier is required' });
    }
    if (!answer.answer || answer.answer.trim().length === 0) {
      errors.push({ field: `user_answers[${index}].answer`, message: 'Answer text is required' });
    }
  });
  return errors;
}
```

## File: src/api/notes/notes.controller.ts

```typescript
import { Request, Response } from 'express';
import { NoteType } from '@prisma/client';
import { createChatCompletion, extractFirstMessageContent, ChatMessage } from '@/services/groq.service';
import { createModuleNote, getModuleById, getNextSequenceOrder, listModuleNotes } from './notes.services';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function aiChatHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { moduleId } = req.params;
    const moduleMeta = await getModuleById(moduleId);
    if (!moduleMeta) {
      return res.status(404).json({ success: false, data: null, error: 'Module not found' });
    }
    const question = req.body.question.trim();
    const sequenceOrder = await getNextSequenceOrder(userId, moduleId);
    await createModuleNote(userId, moduleId, question, NoteType.user_question, sequenceOrder);

    const systemMessage: ChatMessage = {
      role: 'system',
      content: 'You are a friendly learning assistant for SkillSync. Answer clearly and keep the tone helpful.',
    };
    const userMessage: ChatMessage = {
      role: 'user',
      content: `Module: ${moduleMeta.title ?? 'the current module'}\nQuestion: ${question}\nAnswer in a concise bullet-style explanation with a key takeaway.`,
    };
    const completion = await createChatCompletion([systemMessage, userMessage], 'openai/gpt-oss-20b', 0.5);
    const answer = extractFirstMessageContent(completion) ?? 'Unable to generate a response at this time.';
    const aiNote = await createModuleNote(userId, moduleId, answer, NoteType.ai_response, sequenceOrder + 1);
    return res.status(200).json({ success: true, data: { answer, note_id: aiNote.note_id }, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function listNotesHandler(req: Request, res: Response) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { moduleId } = req.params;
    const moduleMeta = await getModuleById(moduleId);
    if (!moduleMeta) {
      return res.status(404).json({ success: false, data: null, error: 'Module not found' });
    }
    const notes = await listModuleNotes(userId, moduleId);
    return res.status(200).json({ success: true, data: notes, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}
```

## File: src/api/notes/notes.routes.ts

```typescript
import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { aiChatHandler, listNotesHandler } from './notes.controller';
import { validateAiChatPayload } from './notes.validation';

const router: Router = Router({ mergeParams: true });

router.post('/ai-chat', validateRequest(validateAiChatPayload), aiChatHandler);
router.get('/ai-notes', listNotesHandler);

export default router;
```

## File: src/api/notes/notes.services.ts

```typescript
import { NoteType } from '@prisma/client';
import prisma from '@/services/prisma.service';

export async function getModuleById(moduleId: string) {
  return prisma.module.findUnique({
    where: { module_id: moduleId },
    select: { module_id: true, title: true },
  });
}

export async function getNextSequenceOrder(userId: string, moduleId: string) {
  const lastNote = await prisma.aINote.findFirst({
    where: { user_id: userId, module_id: moduleId },
    orderBy: { sequence_order: 'desc' },
    select: { sequence_order: true },
  });
  return lastNote ? lastNote.sequence_order + 1 : 1;
}

export async function createModuleNote(userId: string, moduleId: string, content: string, noteType: NoteType, sequenceOrder: number) {
  return prisma.aINote.create({
    data: {
      user_id: userId,
      module_id: moduleId,
      content,
      note_type: noteType,
      sequence_order: sequenceOrder,
    },
  });
}

export async function listModuleNotes(userId: string, moduleId: string) {
  return prisma.aINote.findMany({
    where: { user_id: userId, module_id: moduleId },
    orderBy: { sequence_order: 'asc' },
    select: {
      note_id: true,
      note_type: true,
      content: true,
      created_at: true,
      sequence_order: true,
    },
  });
}
```

## File: src/api/notes/notes.validation.ts

```typescript
import { ValidationError } from '@/api/auth/auth.validation';

export function validateAiChatPayload(body: { question?: string }) {
  const errors: ValidationError[] = [];
  if (!body.question || body.question.trim().length < 5) {
    errors.push({ field: 'question', message: 'Question must be at least 5 characters long' });
  }
  return errors;
}
```

## File: src/api/progress/progress.controller.ts

```typescript
import { Request, Response } from 'express';
import { findModuleProgress, updateModuleProgress } from './progress.services';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function getModuleProgressHandler(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const progress = await findModuleProgress(userId, moduleId);
    if (!progress) {
      return res.status(404).json({ success: false, data: null, error: 'Progress entry not found' });
    }
    return res.status(200).json({ success: true, data: progress, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function updateModuleProgressHandler(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { status, completion_percentage } = req.body;
    const updated = await updateModuleProgress(userId, moduleId, status, completion_percentage);
    return res.status(200).json({ success: true, data: updated, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

```

## File: src/api/progress/progress.routes.ts

```typescript
import { Router } from 'express';
import { getModuleProgressHandler, updateModuleProgressHandler } from './progress.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { validateProgressUpdate } from './progress.validation';

const router: Router = Router();

router.get('/modules/:moduleId/progress', getModuleProgressHandler);
router.patch('/modules/:moduleId/progress', validateRequest(validateProgressUpdate), updateModuleProgressHandler);

export default router;

```

## File: src/api/progress/progress.services.ts

```typescript
import { ProgressStatus } from '@prisma/client';
import prisma from '@/services/prisma.service';

export async function findModuleProgress(userId: string, moduleId: string) {
  return prisma.userProgress.findUnique({
    where: { user_id_module_id: { user_id: userId, module_id: moduleId } },
  });
}

export async function updateModuleProgress(userId: string, moduleId: string, status: ProgressStatus, completionPercentage: number) {
  return prisma.userProgress.upsert({
    where: { user_id_module_id: { user_id: userId, module_id: moduleId } },
    create: {
      user_id: userId,
      module_id: moduleId,
      status,
      completion_percentage: completionPercentage,
    },
    update: {
      status,
      completion_percentage: completionPercentage,
    },
  });
}

```

## File: src/api/progress/progress.validation.ts

```typescript
import { ProgressStatus } from '@prisma/client';
import { ValidationError } from '@/api/auth/auth.validation';

const allowedStatuses: ProgressStatus[] = ['not_started', 'in_progress', 'completed'];

export function validateProgressUpdate(body: { status?: string; completion_percentage?: number }): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!body.status || !allowedStatuses.includes(body.status as ProgressStatus)) {
    errors.push({ field: 'status', message: 'Status is required and must be not_started, in_progress, or completed' });
  }
  const completion = body.completion_percentage;
  if (typeof completion !== 'number' || completion < 0 || completion > 100) {
    errors.push({ field: 'completion_percentage', message: 'Completion percentage must be a number between 0 and 100' });
  }
  return errors;
}

```

## File: src/api/roadmaps/roadmaps.controller.ts

```typescript
import { Request, Response } from 'express';
import { listPublishedRoadmaps, getRoadmapWithModules, enrollUserInRoadmap } from './roadmaps.services';
import { isValidRoadmapId } from './roadmaps.validation';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function listRoadmapsHandler(req: Request, res: Response) {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const roadmaps = await listPublishedRoadmaps(category);
    return res.status(200).json({ success: true, data: roadmaps, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function getRoadmapHandler(req: Request, res: Response) {
  try {
    const { roadmapId } = req.params;
    if (!isValidRoadmapId(roadmapId)) {
      return res.status(400).json({ success: false, data: null, error: 'Invalid roadmap identifier' });
    }
    const roadmap = await getRoadmapWithModules(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ success: false, data: null, error: 'Roadmap not found' });
    }
    return res.status(200).json({ success: true, data: roadmap, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function enrollRoadmapHandler(req: Request, res: Response) {
  try {
    const { roadmapId } = req.params;
    if (!isValidRoadmapId(roadmapId)) {
      return res.status(400).json({ success: false, data: null, error: 'Invalid roadmap identifier' });
    }
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const result = await enrollUserInRoadmap(userId, roadmapId);
    if (!result) {
      return res.status(404).json({ success: false, data: null, error: 'Roadmap not found' });
    }
    return res.status(201).json({ success: true, data: result, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

```

## File: src/api/roadmaps/roadmaps.routes.ts

```typescript
import { Router } from 'express';
import { listRoadmapsHandler, getRoadmapHandler, enrollRoadmapHandler } from './roadmaps.controller';

const router: Router = Router();

router.get('/', listRoadmapsHandler);
router.get('/:roadmapId', getRoadmapHandler);
router.post('/:roadmapId/enroll', enrollRoadmapHandler);

export default router;

```

## File: src/api/roadmaps/roadmaps.services.ts

```typescript
import { Status } from '@prisma/client';
import prisma from '@/services/prisma.service';

export async function listPublishedRoadmaps(category?: string) {
  const where = category ? { status: Status.published, category } : { status: Status.published };
  const roadmaps = await prisma.roadmap.findMany({
    where,
    select: {
      roadmap_id: true,
      title: true,
      description: true,
      category: true,
      image_url: true,
      status: true,
      created_at: true,
      updated_at: true,
      modules: { select: { module_id: true } },
    },
    orderBy: { updated_at: 'desc' },
  });
  return roadmaps.map((roadmap) => ({
    roadmap_id: roadmap.roadmap_id,
    title: roadmap.title,
    description: roadmap.description,
    category: roadmap.category,
    image_url: roadmap.image_url,
    status: roadmap.status,
    created_at: roadmap.created_at,
    updated_at: roadmap.updated_at,
    module_count: roadmap.modules.length,
  }));
}

export async function getRoadmapWithModules(roadmapId: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmap_id: roadmapId },
    include: {
      modules: {
        select: {
          module_id: true,
          title: true,
          description: true,
          content: true,
          order_index: true,
          estimated_hours: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: { order_index: 'asc' },
      },
    },
  });
  if (!roadmap) {
    return null;
  }
  return {
    roadmap_id: roadmap.roadmap_id,
    title: roadmap.title,
    description: roadmap.description,
    category: roadmap.category,
    image_url: roadmap.image_url,
    status: roadmap.status,
    created_at: roadmap.created_at,
    updated_at: roadmap.updated_at,
    modules: roadmap.modules,
    module_count: roadmap.modules.length,
  };
}

export async function enrollUserInRoadmap(userId: string, roadmapId: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmap_id: roadmapId },
    include: { modules: { select: { module_id: true } } },
  });
  if (!roadmap) {
    return null;
  }
  const moduleIds = roadmap.modules.map((module) => module.module_id);
  if (moduleIds.length === 0) {
    return { roadmap_id: roadmapId, enrolled: 0 };
  }
  const existingProgress = await prisma.userProgress.findMany({
    where: { user_id: userId, module_id: { in: moduleIds } },
    select: { module_id: true },
  });
  const existingModuleIds = new Set(existingProgress.map((entry) => entry.module_id));
  const toCreate = moduleIds.filter((moduleId) => !existingModuleIds.has(moduleId));
  if (toCreate.length > 0) {
    const operations = toCreate.map((moduleId) =>
      prisma.userProgress.create({
        data: {
          user_id: userId,
          module_id: moduleId,
          status: 'not_started',
          completion_percentage: 0,
        },
      })
    );
    await prisma.$transaction(operations);
  }
  return { roadmap_id: roadmapId, enrolled: toCreate.length };
}

```

## File: src/api/roadmaps/roadmaps.validation.ts

```typescript
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidRoadmapId(value: string) {
  return uuidRegex.test(value);
}

```

## File: src/config/index.ts

```typescript
import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
};

export default config;


```

## File: src/middleware/validateRequest.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@/api/auth/auth.validation';

export const validateRequest =
  (validator: (body: any) => ValidationError[] | Promise<ValidationError[]>) =>
    async (req: Request, res: Response, next: NextFunction) => {

      try {
        const errors = await validator(req.body);
        if (errors.length > 0) {
          return res.status(400).json({
            success: false,
            data: null,
            error: 'Validation failed',
            details: errors
          });
        }
        return next();
      } catch (error){
        return res.status(500).json({
          success: false,
          data: null,
          error: 'Internal Server Error'
        });
      }
    };
    
```

## File: src/services/groq.service.ts

```typescript
import Groq from 'groq-sdk';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groqClient = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

export async function createChatCompletion(messages: ChatMessage[], model = 'gpt-oss-20b', temperature = 0.6) {
  if (!groqClient) {
    throw new Error('Missing GROQ_API_KEY environment variable');
  }
  const completion = await groqClient.chat.completions.create({
    model,
    messages,
    temperature,
  });
  return completion;
}

export interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export function extractFirstMessageContent(completion: Groq.Chat.Completions.ChatCompletion | null) {
  return completion?.choices?.[0]?.message?.content?.trim() || null;
}
```

## File: src/services/prisma.service.ts

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

```
