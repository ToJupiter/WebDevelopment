## File: prisma/schema.prisma
``` prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "mysql"
}

model User {
  user_id           String             @id @default(uuid()) @db.VarChar(36)
  email             String             @unique @db.VarChar(255)
  password_hash     String             @db.VarChar(255)
  full_name         String             @db.VarChar(100)
  current_level     Level              @default(beginner)
  role              Role               @default(user)
  avatar_url        String?            @db.VarChar(4096)
  created_at        DateTime           @default(now())
  updated_at        DateTime           @updatedAt
  aiNotes           AINote[]
  cvs               CV[]
  certificates      Certificate[]
  interviewSessions InterviewSession[]
  learningEvents    LearningEvent[]
  roadmaps          Roadmap[]
  progress          UserProgress[]
  exerciseSubmissions ExerciseSubmission[]

  @@index([email])
  @@map("Users")
}

model Roadmap {
  roadmap_id   String        @id @default(uuid()) @db.VarChar(36)
  title        String        @db.VarChar(100)
  description  String?       @db.Text
  category     String        @db.VarChar(50)
  image_url    String?       @db.VarChar(500)
  created_by   String        @db.VarChar(36)
  status       Status        @default(draft)
  created_at   DateTime      @default(now())
  updated_at   DateTime      @updatedAt
  certificates Certificate[]
  modules      Module[]
  creator      User          @relation(fields: [created_by], references: [user_id])

  @@index([category])
  @@index([created_by], map: "Roadmaps_created_by_fkey")
  @@map("Roadmaps")
}

model Module {
  module_id       String          @id @default(uuid()) @db.VarChar(36)
  roadmap_id      String          @db.VarChar(36)
  title           String          @db.VarChar(100)
  description     String?         @db.Text
  content         String?         @db.LongText
  order_index     Int
  estimated_hours Decimal?        @db.Decimal(4, 1)
  created_at      DateTime        @default(now())
  updated_at      DateTime        @updatedAt
  aiNotes         AINote[]
  exercises       Exercise[]
  learningEvents  LearningEvent[]
  roadmap         Roadmap         @relation(fields: [roadmap_id], references: [roadmap_id], onDelete: Cascade)
  userProgress    UserProgress[]

  @@unique([roadmap_id, order_index])
  @@index([roadmap_id, order_index])
  @@map("Modules")
}

model UserProgress {
  progress_id           String         @id @default(uuid()) @db.VarChar(36)
  user_id               String         @db.VarChar(36)
  module_id             String         @db.VarChar(36)
  status                ProgressStatus @default(not_started)
  completion_percentage Decimal        @default(0.00) @db.Decimal(5, 2)
  started_at            DateTime?
  completed_at          DateTime?
  last_accessed_at      DateTime       @default(now()) @updatedAt
  module                Module         @relation(fields: [module_id], references: [module_id], onDelete: Cascade)
  user                  User           @relation(fields: [user_id], references: [user_id], onDelete: Cascade)

  @@unique([user_id, module_id])
  @@index([user_id, status])
  @@index([module_id], map: "UserProgress_module_id_fkey")
  @@map("UserProgress")
}

model Exercise {
  exercise_id   String     @id @default(uuid()) @db.VarChar(36)
  module_id     String     @db.VarChar(36)
  title         String     @db.VarChar(100)
  description   String     @db.Text
  examples      Json?
  starter_code  String?    @db.MediumText
  solution_code String?    @db.MediumText
  difficulty    Difficulty @default(medium)
  created_at    DateTime   @default(now())
  updated_at    DateTime   @updatedAt
  module        Module     @relation(fields: [module_id], references: [module_id], onDelete: Cascade)
  submissions   ExerciseSubmission[]

  @@index([module_id, difficulty])
  @@map("Exercises")
}

model ExerciseSubmission {
  submission_id String   @id @default(uuid()) @db.VarChar(36)
  exercise_id   String   @db.VarChar(36)
  user_id       String   @db.VarChar(36)
  answer_text   String   @db.LongText
  submitted_at  DateTime @default(now())
  exercise      Exercise @relation(fields: [exercise_id], references: [exercise_id], onDelete: Cascade)
  user          User     @relation(fields: [user_id], references: [user_id], onDelete: Cascade)

  @@index([exercise_id, user_id])
  @@index([user_id, submitted_at])
  @@map("ExerciseSubmissions")
}

model InterviewSession {
  session_id     String        @id @default(uuid()) @db.VarChar(36)
  user_id        String        @db.VarChar(36)
  session_name   String        @db.VarChar(100)
  interview_type InterviewType
  questions      Json
  user_answers   Json?
  ai_feedback    Json?
  score          Decimal?      @db.Decimal(5, 2)
  created_at     DateTime      @default(now())
  user           User          @relation(fields: [user_id], references: [user_id], onDelete: Cascade)

  @@index([user_id, created_at])
  @@map("InterviewSessions")
}

model CV {
  cv_id          String        @id @default(uuid()) @db.VarChar(36)
  user_id        String        @db.VarChar(36)
  cv_name        String        @db.VarChar(100)
  template_style TemplateStyle @default(modern)
  personal_info  Json?
  education      Json?
  experience     Json?
  skills         Json?
  projects       Json?
  pdf_url        String?       @db.VarChar(500)
  created_at     DateTime      @default(now())
  updated_at     DateTime      @updatedAt
  user           User          @relation(fields: [user_id], references: [user_id], onDelete: Cascade)

  @@index([user_id, created_at])
  @@map("CVs")
}

model Certificate {
  certificate_id   String   @id @default(uuid()) @db.VarChar(36)
  user_id          String   @db.VarChar(36)
  roadmap_id       String   @db.VarChar(36)
  certificate_name String   @db.VarChar(100)
  issue_date       DateTime @default(now())
  pdf_url          String?  @db.VarChar(500)
  roadmap          Roadmap  @relation(fields: [roadmap_id], references: [roadmap_id], onDelete: Cascade)
  user             User     @relation(fields: [user_id], references: [user_id], onDelete: Cascade)

  @@unique([user_id, roadmap_id])
  @@index([user_id, roadmap_id])
  @@index([roadmap_id], map: "Certificates_roadmap_id_fkey")
  @@map("Certificates")
}

model LearningEvent {
  event_id         String      @id @default(uuid()) @db.VarChar(36)
  user_id          String      @db.VarChar(36)
  title            String      @default("Study Session") @db.VarChar(150)
  description      String?     @db.MediumText
  status           EventStatus @default(planned)
  start_utc        DateTime    @db.DateTime(0)
  end_utc          DateTime    @db.DateTime(0)
  all_day          Boolean     @default(false)
  timezone         String      @default("Asia/Ho_Chi_Minh") @db.VarChar(50)
  module_id        String?     @db.VarChar(36)
  color            String      @default("#3B82F6") @db.VarChar(7)
  is_ai_suggested  Boolean     @default(false)
  reminder_minutes Int?        @db.SmallInt
  is_deleted       Boolean     @default(false)
  created_at       DateTime    @default(now())
  updated_at       DateTime    @updatedAt
  module           Module?     @relation(fields: [module_id], references: [module_id])
  user             User        @relation(fields: [user_id], references: [user_id], onDelete: Cascade)

  @@index([user_id, start_utc])
  @@index([module_id])
  @@index([user_id, is_ai_suggested])
  @@map("LearningEvents")
}

model AINote {
  note_id        String   @id @default(uuid()) @db.VarChar(36)
  user_id        String   @db.VarChar(36)
  module_id      String   @db.VarChar(36)
  note_type      NoteType
  content        String   @db.LongText
  created_at     DateTime @default(now())
  sequence_order Int
  module         Module   @relation(fields: [module_id], references: [module_id], onDelete: Cascade)
  user           User     @relation(fields: [user_id], references: [user_id], onDelete: Cascade)

  @@index([user_id, module_id, sequence_order])
  @@index([module_id, note_type])
  @@map("AINotes")
}

enum Level {
  beginner
  intermediate
  advanced
}

enum Role {
  user
  admin
  creator
}

enum Status {
  draft
  published
  archived
}

enum ProgressStatus {
  not_started
  in_progress
  completed
}

enum Difficulty {
  easy
  medium
  hard
}

enum InterviewType {
  simulated
  prep_feedback
}

enum TemplateStyle {
  modern
  classic
  minimal
}

enum EventStatus {
  planned
  done
  missed
  cancelled
}

enum NoteType {
  summary
  hint
  explanation
  feedback
  user_question
  ai_response
}
```


## File: prisma.config.ts

```typescript
// This file was generated by Prisma and assumes you have installed the following:
// npm install --save-dev prisma dotenv
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("MYSQL_CONNECTION_STRING"),
  },
});

```

## File: src/app.ts

```typescript
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
```

## File: src/server.ts

```typescript
import app from './app';
import config from './config';
import http from 'http';
import { setupInterviewWebSocket } from './api/interviews/interviews.websocket';

const server = http.createServer(app);
setupInterviewWebSocket(server);

const PORT = config.port;
server.listen(PORT, () => {
    console.log(`Server (HTTP + WebSocket) is running on ${PORT}`);
});



```

## File: src/types/express/index.d.ts

```typescript
import { Role, User } from '@/generated/prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        role: Role;
        email: string;
      };
    }
  }
}

export {};
```

## File: src/middleware/authenticate.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/services/jwt.service';
import config from '../config';
import { Role } from '@/generated/prisma/client';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies[config.cookieName];

  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, data: null, error: 'Unauthorized: No token provided' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, data: null, error: 'Unauthorized: Invalid or expired token' });
  }

  req.user = decoded;

  return next();
};

export const requireRole = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, data: null, error: 'Forbidden: Insufficient permissions' });
  }
  return next();
};
```

## File: src/middleware/ownership.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import prisma from '@/services/prisma.service';
import { Role } from '@/generated/prisma/client';

// Generic function to check if the current user owns a resource
// Returns true for Admins automatically
export const checkOwnership = (
  model: 'roadmap' | 'cV' | 'learningEvent' | 'interviewSession' | 'aINote' | 'certificate', 
  idParam: string, 
  ownerField: string = 'user_id', 
  idField?: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.user_id;
      const userRole = req.user?.role;
      const resourceId = req.params[idParam];

      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
      if (userRole === Role.admin) return next(); // Admin override

      // Determine primary key field name if not provided (assume [model]_id convention usually works, but specific cases handled)
      const pkField = idField || `${model === 'cV' ? 'cv' : model}_id`;

      // @ts-ignore - Dynamic access to prisma delegate
      const resource = await prisma[model].findUnique({
        where: { [pkField]: resourceId },
        select: { [ownerField]: true }
      });

      if (!resource) {
        return res.status(404).json({ success: false, error: 'Resource not found' });
      }

      if (resource[ownerField] !== userId) {
        return res.status(403).json({ success: false, error: 'Forbidden: You do not own this resource' });
      }

      return next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
};

// Check if a creator owns the roadmap they are trying to add modules/exercises to
export const verifyRoadmapOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.user_id;
  const userRole = req.user?.role;
  // roadmapId might be in params (creating module) or body (creating exercise linking to roadmap?)
  // For createModule: params.roadmapId
  const roadmapId = req.params.roadmapId || req.body.roadmap_id;

  if (userRole === Role.admin) return next();

  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmap_id: roadmapId },
    select: { created_by: true }
  });

  if (!roadmap) return res.status(404).json({ success: false, error: 'Roadmap not found' });
  
  if (roadmap.created_by !== userId) {
    return res.status(403).json({ success: false, error: 'Forbidden: You are not the creator of this roadmap' });
  }
  next();
};

// Check if user owns the module (via roadmap) - for updating/deleting modules
export const verifyModuleOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.user_id;
  const userRole = req.user?.role;
  // Module ID usually in params for update/delete
  const moduleId = req.params.moduleId || req.body.module_id;

  if (userRole === Role.admin) return next();

  const moduleData = await prisma.module.findUnique({
    where: { module_id: moduleId },
    include: { roadmap: { select: { created_by: true } } }
  });

  if (!moduleData) return res.status(404).json({ success: false, error: 'Module not found' });

  if (moduleData.roadmap.created_by !== userId) {
    return res.status(403).json({ success: false, error: 'Forbidden: You do not own the parent roadmap' });
  }
  next();
};

// Check if user owns the exercise (via module -> roadmap)
export const verifyExerciseOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.user_id;
  const userRole = req.user?.role;
  const exerciseId = req.params.exerciseId;

  if (userRole === Role.admin) return next();

  const exercise = await prisma.exercise.findUnique({
    where: { exercise_id: exerciseId },
    include: { module: { include: { roadmap: { select: { created_by: true } } } } }
  });

  if (!exercise) return res.status(404).json({ success: false, error: 'Exercise not found' });

  if (exercise.module.roadmap.created_by !== userId) {
    return res.status(403).json({ success: false, error: 'Forbidden: You do not own this exercise' });
  }
  next();
};

// Check if user is enrolled in the module's roadmap (for accessing content/notes)
export const checkEnrollment = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.user_id;
  const moduleId = req.params.moduleId || req.query.module_id as string;

  if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
  if (!moduleId) return res.status(400).json({ success: false, error: 'Module ID is required' });

  if (req.user?.role === Role.admin || req.user?.role === Role.creator) return next();

  const progress = await prisma.userProgress.findUnique({
    where: {
      user_id_module_id: {
        user_id: userId,
        module_id: moduleId
      }
    }
  });

  if (!progress) {
    return res.status(403).json({ success: false, error: 'Forbidden: You are not enrolled in this module' });
  }
  next();
};


```

## File: src/middleware/rateLimiter.ts

```typescript
import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: { success: false, data: null, error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, data: null, error: 'Too many requests, please try again later' },
});
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

## File: src/generated/prisma/browser.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file should be your main import to use Prisma-related types and utilities in a browser. 
 * Use it to get access to models, enums, and input types.
 * 
 * This file does not contain a `PrismaClient` class, nor several other helpers that are intended as server-side only.
 * See `client.ts` for the standard, server-side entry point.
 *
 * 🟢 You can import this file directly.
 */

import * as Prisma from './internal/prismaNamespaceBrowser'
export { Prisma }
export * as $Enums from './enums'
export * from './enums';
/**
 * Model User
 * 
 */
export type User = Prisma.UserModel
/**
 * Model Roadmap
 * 
 */
export type Roadmap = Prisma.RoadmapModel
/**
 * Model Module
 * 
 */
export type Module = Prisma.ModuleModel
/**
 * Model UserProgress
 * 
 */
export type UserProgress = Prisma.UserProgressModel
/**
 * Model Exercise
 * 
 */
export type Exercise = Prisma.ExerciseModel
/**
 * Model ExerciseSubmission
 * 
 */
export type ExerciseSubmission = Prisma.ExerciseSubmissionModel
/**
 * Model InterviewSession
 * 
 */
export type InterviewSession = Prisma.InterviewSessionModel
/**
 * Model CV
 * 
 */
export type CV = Prisma.CVModel
/**
 * Model Certificate
 * 
 */
export type Certificate = Prisma.CertificateModel
/**
 * Model LearningEvent
 * 
 */
export type LearningEvent = Prisma.LearningEventModel
/**
 * Model AINote
 * 
 */
export type AINote = Prisma.AINoteModel

```

## File: src/generated/prisma/client.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file should be your main import to use Prisma. Through it you get access to all the models, enums, and input types.
 * If you're looking for something you can import in the client-side of your application, please refer to the `browser.ts` file instead.
 *
 * 🟢 You can import this file directly.
 */

import * as process from 'node:process'
import * as path from 'node:path'

import * as runtime from "@prisma/client/runtime/client"
import * as $Enums from "./enums"
import * as $Class from "./internal/class"
import * as Prisma from "./internal/prismaNamespace"

export * as $Enums from './enums'
export * from "./enums"
/**
 * ## Prisma Client
 * 
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 * 
 * Read more in our [docs](https://pris.ly/d/client).
 */
export const PrismaClient = $Class.getPrismaClientClass()
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>
export { Prisma }

/**
 * Model User
 * 
 */
export type User = Prisma.UserModel
/**
 * Model Roadmap
 * 
 */
export type Roadmap = Prisma.RoadmapModel
/**
 * Model Module
 * 
 */
export type Module = Prisma.ModuleModel
/**
 * Model UserProgress
 * 
 */
export type UserProgress = Prisma.UserProgressModel
/**
 * Model Exercise
 * 
 */
export type Exercise = Prisma.ExerciseModel
/**
 * Model ExerciseSubmission
 * 
 */
export type ExerciseSubmission = Prisma.ExerciseSubmissionModel
/**
 * Model InterviewSession
 * 
 */
export type InterviewSession = Prisma.InterviewSessionModel
/**
 * Model CV
 * 
 */
export type CV = Prisma.CVModel
/**
 * Model Certificate
 * 
 */
export type Certificate = Prisma.CertificateModel
/**
 * Model LearningEvent
 * 
 */
export type LearningEvent = Prisma.LearningEventModel
/**
 * Model AINote
 * 
 */
export type AINote = Prisma.AINoteModel

```

## File: src/generated/prisma/commonInputTypes.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file exports various common sort, input & filter types that are not directly linked to a particular model.
 *
 * 🟢 You can import this file directly.
 */

import type * as runtime from "@prisma/client/runtime/client"
import * as $Enums from "./enums"
import type * as Prisma from "./internal/prismaNamespace"


export type StringFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel>
  in?: string[]
  notIn?: string[]
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  search?: string
  not?: Prisma.NestedStringFilter<$PrismaModel> | string
}

export type EnumLevelFilter<$PrismaModel = never> = {
  equals?: $Enums.Level | Prisma.EnumLevelFieldRefInput<$PrismaModel>
  in?: $Enums.Level[]
  notIn?: $Enums.Level[]
  not?: Prisma.NestedEnumLevelFilter<$PrismaModel> | $Enums.Level
}

export type EnumRoleFilter<$PrismaModel = never> = {
  equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>
  in?: $Enums.Role[]
  notIn?: $Enums.Role[]
  not?: Prisma.NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
}

export type StringNullableFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null
  in?: string[] | null
  notIn?: string[] | null
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  search?: string
  not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null
}

export type DateTimeFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  in?: Date[] | string[]
  notIn?: Date[] | string[]
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string
}

export type SortOrderInput = {
  sort: Prisma.SortOrder
  nulls?: Prisma.NullsOrder
}

export type StringWithAggregatesFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel>
  in?: string[]
  notIn?: string[]
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  search?: string
  not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedStringFilter<$PrismaModel>
  _max?: Prisma.NestedStringFilter<$PrismaModel>
}

export type EnumLevelWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.Level | Prisma.EnumLevelFieldRefInput<$PrismaModel>
  in?: $Enums.Level[]
  notIn?: $Enums.Level[]
  not?: Prisma.NestedEnumLevelWithAggregatesFilter<$PrismaModel> | $Enums.Level
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumLevelFilter<$PrismaModel>
  _max?: Prisma.NestedEnumLevelFilter<$PrismaModel>
}

export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>
  in?: $Enums.Role[]
  notIn?: $Enums.Role[]
  not?: Prisma.NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumRoleFilter<$PrismaModel>
  _max?: Prisma.NestedEnumRoleFilter<$PrismaModel>
}

export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null
  in?: string[] | null
  notIn?: string[] | null
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  search?: string
  not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _min?: Prisma.NestedStringNullableFilter<$PrismaModel>
  _max?: Prisma.NestedStringNullableFilter<$PrismaModel>
}

export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  in?: Date[] | string[]
  notIn?: Date[] | string[]
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedDateTimeFilter<$PrismaModel>
  _max?: Prisma.NestedDateTimeFilter<$PrismaModel>
}

export type EnumStatusFilter<$PrismaModel = never> = {
  equals?: $Enums.Status | Prisma.EnumStatusFieldRefInput<$PrismaModel>
  in?: $Enums.Status[]
  notIn?: $Enums.Status[]
  not?: Prisma.NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
}

export type EnumStatusWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.Status | Prisma.EnumStatusFieldRefInput<$PrismaModel>
  in?: $Enums.Status[]
  notIn?: $Enums.Status[]
  not?: Prisma.NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumStatusFilter<$PrismaModel>
  _max?: Prisma.NestedEnumStatusFilter<$PrismaModel>
}

export type IntFilter<$PrismaModel = never> = {
  equals?: number | Prisma.IntFieldRefInput<$PrismaModel>
  in?: number[]
  notIn?: number[]
  lt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  lte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  not?: Prisma.NestedIntFilter<$PrismaModel> | number
}

export type DecimalNullableFilter<$PrismaModel = never> = {
  equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null
  in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null
  notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null
  lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null
}

export type IntWithAggregatesFilter<$PrismaModel = never> = {
  equals?: number | Prisma.IntFieldRefInput<$PrismaModel>
  in?: number[]
  notIn?: number[]
  lt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  lte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _avg?: Prisma.NestedFloatFilter<$PrismaModel>
  _sum?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedIntFilter<$PrismaModel>
  _max?: Prisma.NestedIntFilter<$PrismaModel>
}

export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null
  in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null
  notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null
  lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>
  _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>
  _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>
  _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>
}

export type EnumProgressStatusFilter<$PrismaModel = never> = {
  equals?: $Enums.ProgressStatus | Prisma.EnumProgressStatusFieldRefInput<$PrismaModel>
  in?: $Enums.ProgressStatus[]
  notIn?: $Enums.ProgressStatus[]
  not?: Prisma.NestedEnumProgressStatusFilter<$PrismaModel> | $Enums.ProgressStatus
}

export type DecimalFilter<$PrismaModel = never> = {
  equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[]
  notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[]
  lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string
}

export type DateTimeNullableFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null
  in?: Date[] | string[] | null
  notIn?: Date[] | string[] | null
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
}

export type EnumProgressStatusWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.ProgressStatus | Prisma.EnumProgressStatusFieldRefInput<$PrismaModel>
  in?: $Enums.ProgressStatus[]
  notIn?: $Enums.ProgressStatus[]
  not?: Prisma.NestedEnumProgressStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProgressStatus
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumProgressStatusFilter<$PrismaModel>
  _max?: Prisma.NestedEnumProgressStatusFilter<$PrismaModel>
}

export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
  equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[]
  notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[]
  lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _avg?: Prisma.NestedDecimalFilter<$PrismaModel>
  _sum?: Prisma.NestedDecimalFilter<$PrismaModel>
  _min?: Prisma.NestedDecimalFilter<$PrismaModel>
  _max?: Prisma.NestedDecimalFilter<$PrismaModel>
}

export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null
  in?: Date[] | string[] | null
  notIn?: Date[] | string[] | null
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>
  _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>
}

export type JsonNullableFilter<$PrismaModel = never> =
| Prisma.PatchUndefined<
    Prisma.Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
    Required<JsonNullableFilterBase<$PrismaModel>>
  >
| Prisma.OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

export type JsonNullableFilterBase<$PrismaModel = never> = {
  equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter
  path?: string
  mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>
  string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>
  string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>
  array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  lt?: runtime.InputJsonValue
  lte?: runtime.InputJsonValue
  gt?: runtime.InputJsonValue
  gte?: runtime.InputJsonValue
  not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter
}

export type EnumDifficultyFilter<$PrismaModel = never> = {
  equals?: $Enums.Difficulty | Prisma.EnumDifficultyFieldRefInput<$PrismaModel>
  in?: $Enums.Difficulty[]
  notIn?: $Enums.Difficulty[]
  not?: Prisma.NestedEnumDifficultyFilter<$PrismaModel> | $Enums.Difficulty
}

export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
| Prisma.PatchUndefined<
    Prisma.Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
    Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
  >
| Prisma.OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
  equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter
  path?: string
  mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>
  string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>
  string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>
  array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  lt?: runtime.InputJsonValue
  lte?: runtime.InputJsonValue
  gt?: runtime.InputJsonValue
  gte?: runtime.InputJsonValue
  not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _min?: Prisma.NestedJsonNullableFilter<$PrismaModel>
  _max?: Prisma.NestedJsonNullableFilter<$PrismaModel>
}

export type EnumDifficultyWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.Difficulty | Prisma.EnumDifficultyFieldRefInput<$PrismaModel>
  in?: $Enums.Difficulty[]
  notIn?: $Enums.Difficulty[]
  not?: Prisma.NestedEnumDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.Difficulty
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumDifficultyFilter<$PrismaModel>
  _max?: Prisma.NestedEnumDifficultyFilter<$PrismaModel>
}

export type EnumInterviewTypeFilter<$PrismaModel = never> = {
  equals?: $Enums.InterviewType | Prisma.EnumInterviewTypeFieldRefInput<$PrismaModel>
  in?: $Enums.InterviewType[]
  notIn?: $Enums.InterviewType[]
  not?: Prisma.NestedEnumInterviewTypeFilter<$PrismaModel> | $Enums.InterviewType
}

export type JsonFilter<$PrismaModel = never> =
| Prisma.PatchUndefined<
    Prisma.Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
    Required<JsonFilterBase<$PrismaModel>>
  >
| Prisma.OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

export type JsonFilterBase<$PrismaModel = never> = {
  equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter
  path?: string
  mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>
  string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>
  string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>
  array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  lt?: runtime.InputJsonValue
  lte?: runtime.InputJsonValue
  gt?: runtime.InputJsonValue
  gte?: runtime.InputJsonValue
  not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter
}

export type EnumInterviewTypeWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.InterviewType | Prisma.EnumInterviewTypeFieldRefInput<$PrismaModel>
  in?: $Enums.InterviewType[]
  notIn?: $Enums.InterviewType[]
  not?: Prisma.NestedEnumInterviewTypeWithAggregatesFilter<$PrismaModel> | $Enums.InterviewType
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumInterviewTypeFilter<$PrismaModel>
  _max?: Prisma.NestedEnumInterviewTypeFilter<$PrismaModel>
}

export type JsonWithAggregatesFilter<$PrismaModel = never> =
| Prisma.PatchUndefined<
    Prisma.Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
    Required<JsonWithAggregatesFilterBase<$PrismaModel>>
  >
| Prisma.OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
  equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter
  path?: string
  mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>
  string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>
  string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>
  array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  lt?: runtime.InputJsonValue
  lte?: runtime.InputJsonValue
  gt?: runtime.InputJsonValue
  gte?: runtime.InputJsonValue
  not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedJsonFilter<$PrismaModel>
  _max?: Prisma.NestedJsonFilter<$PrismaModel>
}

export type EnumTemplateStyleFilter<$PrismaModel = never> = {
  equals?: $Enums.TemplateStyle | Prisma.EnumTemplateStyleFieldRefInput<$PrismaModel>
  in?: $Enums.TemplateStyle[]
  notIn?: $Enums.TemplateStyle[]
  not?: Prisma.NestedEnumTemplateStyleFilter<$PrismaModel> | $Enums.TemplateStyle
}

export type EnumTemplateStyleWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.TemplateStyle | Prisma.EnumTemplateStyleFieldRefInput<$PrismaModel>
  in?: $Enums.TemplateStyle[]
  notIn?: $Enums.TemplateStyle[]
  not?: Prisma.NestedEnumTemplateStyleWithAggregatesFilter<$PrismaModel> | $Enums.TemplateStyle
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumTemplateStyleFilter<$PrismaModel>
  _max?: Prisma.NestedEnumTemplateStyleFilter<$PrismaModel>
}

export type EnumEventStatusFilter<$PrismaModel = never> = {
  equals?: $Enums.EventStatus | Prisma.EnumEventStatusFieldRefInput<$PrismaModel>
  in?: $Enums.EventStatus[]
  notIn?: $Enums.EventStatus[]
  not?: Prisma.NestedEnumEventStatusFilter<$PrismaModel> | $Enums.EventStatus
}

export type BoolFilter<$PrismaModel = never> = {
  equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>
  not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean
}

export type IntNullableFilter<$PrismaModel = never> = {
  equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null
  in?: number[] | null
  notIn?: number[] | null
  lt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  lte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null
}

export type EnumEventStatusWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.EventStatus | Prisma.EnumEventStatusFieldRefInput<$PrismaModel>
  in?: $Enums.EventStatus[]
  notIn?: $Enums.EventStatus[]
  not?: Prisma.NestedEnumEventStatusWithAggregatesFilter<$PrismaModel> | $Enums.EventStatus
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumEventStatusFilter<$PrismaModel>
  _max?: Prisma.NestedEnumEventStatusFilter<$PrismaModel>
}

export type BoolWithAggregatesFilter<$PrismaModel = never> = {
  equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>
  not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedBoolFilter<$PrismaModel>
  _max?: Prisma.NestedBoolFilter<$PrismaModel>
}

export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null
  in?: number[] | null
  notIn?: number[] | null
  lt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  lte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>
  _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _min?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _max?: Prisma.NestedIntNullableFilter<$PrismaModel>
}

export type EnumNoteTypeFilter<$PrismaModel = never> = {
  equals?: $Enums.NoteType | Prisma.EnumNoteTypeFieldRefInput<$PrismaModel>
  in?: $Enums.NoteType[]
  notIn?: $Enums.NoteType[]
  not?: Prisma.NestedEnumNoteTypeFilter<$PrismaModel> | $Enums.NoteType
}

export type EnumNoteTypeWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.NoteType | Prisma.EnumNoteTypeFieldRefInput<$PrismaModel>
  in?: $Enums.NoteType[]
  notIn?: $Enums.NoteType[]
  not?: Prisma.NestedEnumNoteTypeWithAggregatesFilter<$PrismaModel> | $Enums.NoteType
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumNoteTypeFilter<$PrismaModel>
  _max?: Prisma.NestedEnumNoteTypeFilter<$PrismaModel>
}

export type NestedStringFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel>
  in?: string[]
  notIn?: string[]
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  search?: string
  not?: Prisma.NestedStringFilter<$PrismaModel> | string
}

export type NestedEnumLevelFilter<$PrismaModel = never> = {
  equals?: $Enums.Level | Prisma.EnumLevelFieldRefInput<$PrismaModel>
  in?: $Enums.Level[]
  notIn?: $Enums.Level[]
  not?: Prisma.NestedEnumLevelFilter<$PrismaModel> | $Enums.Level
}

export type NestedEnumRoleFilter<$PrismaModel = never> = {
  equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>
  in?: $Enums.Role[]
  notIn?: $Enums.Role[]
  not?: Prisma.NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
}

export type NestedStringNullableFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null
  in?: string[] | null
  notIn?: string[] | null
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  search?: string
  not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null
}

export type NestedDateTimeFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  in?: Date[] | string[]
  notIn?: Date[] | string[]
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string
}

export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel>
  in?: string[]
  notIn?: string[]
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  search?: string
  not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedStringFilter<$PrismaModel>
  _max?: Prisma.NestedStringFilter<$PrismaModel>
}

export type NestedIntFilter<$PrismaModel = never> = {
  equals?: number | Prisma.IntFieldRefInput<$PrismaModel>
  in?: number[]
  notIn?: number[]
  lt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  lte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  not?: Prisma.NestedIntFilter<$PrismaModel> | number
}

export type NestedEnumLevelWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.Level | Prisma.EnumLevelFieldRefInput<$PrismaModel>
  in?: $Enums.Level[]
  notIn?: $Enums.Level[]
  not?: Prisma.NestedEnumLevelWithAggregatesFilter<$PrismaModel> | $Enums.Level
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumLevelFilter<$PrismaModel>
  _max?: Prisma.NestedEnumLevelFilter<$PrismaModel>
}

export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>
  in?: $Enums.Role[]
  notIn?: $Enums.Role[]
  not?: Prisma.NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumRoleFilter<$PrismaModel>
  _max?: Prisma.NestedEnumRoleFilter<$PrismaModel>
}

export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null
  in?: string[] | null
  notIn?: string[] | null
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  search?: string
  not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _min?: Prisma.NestedStringNullableFilter<$PrismaModel>
  _max?: Prisma.NestedStringNullableFilter<$PrismaModel>
}

export type NestedIntNullableFilter<$PrismaModel = never> = {
  equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null
  in?: number[] | null
  notIn?: number[] | null
  lt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  lte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null
}

export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  in?: Date[] | string[]
  notIn?: Date[] | string[]
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedDateTimeFilter<$PrismaModel>
  _max?: Prisma.NestedDateTimeFilter<$PrismaModel>
}

export type NestedEnumStatusFilter<$PrismaModel = never> = {
  equals?: $Enums.Status | Prisma.EnumStatusFieldRefInput<$PrismaModel>
  in?: $Enums.Status[]
  notIn?: $Enums.Status[]
  not?: Prisma.NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
}

export type NestedEnumStatusWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.Status | Prisma.EnumStatusFieldRefInput<$PrismaModel>
  in?: $Enums.Status[]
  notIn?: $Enums.Status[]
  not?: Prisma.NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumStatusFilter<$PrismaModel>
  _max?: Prisma.NestedEnumStatusFilter<$PrismaModel>
}

export type NestedDecimalNullableFilter<$PrismaModel = never> = {
  equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null
  in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null
  notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null
  lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null
}

export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
  equals?: number | Prisma.IntFieldRefInput<$PrismaModel>
  in?: number[]
  notIn?: number[]
  lt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  lte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _avg?: Prisma.NestedFloatFilter<$PrismaModel>
  _sum?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedIntFilter<$PrismaModel>
  _max?: Prisma.NestedIntFilter<$PrismaModel>
}

export type NestedFloatFilter<$PrismaModel = never> = {
  equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  in?: number[]
  notIn?: number[]
  lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  not?: Prisma.NestedFloatFilter<$PrismaModel> | number
}

export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null
  in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null
  notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | null
  lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>
  _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>
  _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>
  _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>
}

export type NestedEnumProgressStatusFilter<$PrismaModel = never> = {
  equals?: $Enums.ProgressStatus | Prisma.EnumProgressStatusFieldRefInput<$PrismaModel>
  in?: $Enums.ProgressStatus[]
  notIn?: $Enums.ProgressStatus[]
  not?: Prisma.NestedEnumProgressStatusFilter<$PrismaModel> | $Enums.ProgressStatus
}

export type NestedDecimalFilter<$PrismaModel = never> = {
  equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[]
  notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[]
  lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string
}

export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null
  in?: Date[] | string[] | null
  notIn?: Date[] | string[] | null
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
}

export type NestedEnumProgressStatusWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.ProgressStatus | Prisma.EnumProgressStatusFieldRefInput<$PrismaModel>
  in?: $Enums.ProgressStatus[]
  notIn?: $Enums.ProgressStatus[]
  not?: Prisma.NestedEnumProgressStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProgressStatus
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumProgressStatusFilter<$PrismaModel>
  _max?: Prisma.NestedEnumProgressStatusFilter<$PrismaModel>
}

export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
  equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[]
  notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[]
  lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _avg?: Prisma.NestedDecimalFilter<$PrismaModel>
  _sum?: Prisma.NestedDecimalFilter<$PrismaModel>
  _min?: Prisma.NestedDecimalFilter<$PrismaModel>
  _max?: Prisma.NestedDecimalFilter<$PrismaModel>
}

export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null
  in?: Date[] | string[] | null
  notIn?: Date[] | string[] | null
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>
  _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>
}

export type NestedEnumDifficultyFilter<$PrismaModel = never> = {
  equals?: $Enums.Difficulty | Prisma.EnumDifficultyFieldRefInput<$PrismaModel>
  in?: $Enums.Difficulty[]
  notIn?: $Enums.Difficulty[]
  not?: Prisma.NestedEnumDifficultyFilter<$PrismaModel> | $Enums.Difficulty
}

export type NestedJsonNullableFilter<$PrismaModel = never> =
| Prisma.PatchUndefined<
    Prisma.Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
    Required<NestedJsonNullableFilterBase<$PrismaModel>>
  >
| Prisma.OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
  equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter
  path?: string
  mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>
  string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>
  string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>
  array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  lt?: runtime.InputJsonValue
  lte?: runtime.InputJsonValue
  gt?: runtime.InputJsonValue
  gte?: runtime.InputJsonValue
  not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter
}

export type NestedEnumDifficultyWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.Difficulty | Prisma.EnumDifficultyFieldRefInput<$PrismaModel>
  in?: $Enums.Difficulty[]
  notIn?: $Enums.Difficulty[]
  not?: Prisma.NestedEnumDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.Difficulty
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumDifficultyFilter<$PrismaModel>
  _max?: Prisma.NestedEnumDifficultyFilter<$PrismaModel>
}

export type NestedEnumInterviewTypeFilter<$PrismaModel = never> = {
  equals?: $Enums.InterviewType | Prisma.EnumInterviewTypeFieldRefInput<$PrismaModel>
  in?: $Enums.InterviewType[]
  notIn?: $Enums.InterviewType[]
  not?: Prisma.NestedEnumInterviewTypeFilter<$PrismaModel> | $Enums.InterviewType
}

export type NestedEnumInterviewTypeWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.InterviewType | Prisma.EnumInterviewTypeFieldRefInput<$PrismaModel>
  in?: $Enums.InterviewType[]
  notIn?: $Enums.InterviewType[]
  not?: Prisma.NestedEnumInterviewTypeWithAggregatesFilter<$PrismaModel> | $Enums.InterviewType
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumInterviewTypeFilter<$PrismaModel>
  _max?: Prisma.NestedEnumInterviewTypeFilter<$PrismaModel>
}

export type NestedJsonFilter<$PrismaModel = never> =
| Prisma.PatchUndefined<
    Prisma.Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
    Required<NestedJsonFilterBase<$PrismaModel>>
  >
| Prisma.OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

export type NestedJsonFilterBase<$PrismaModel = never> = {
  equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter
  path?: string
  mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>
  string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>
  string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>
  array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null
  lt?: runtime.InputJsonValue
  lte?: runtime.InputJsonValue
  gt?: runtime.InputJsonValue
  gte?: runtime.InputJsonValue
  not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter
}

export type NestedEnumTemplateStyleFilter<$PrismaModel = never> = {
  equals?: $Enums.TemplateStyle | Prisma.EnumTemplateStyleFieldRefInput<$PrismaModel>
  in?: $Enums.TemplateStyle[]
  notIn?: $Enums.TemplateStyle[]
  not?: Prisma.NestedEnumTemplateStyleFilter<$PrismaModel> | $Enums.TemplateStyle
}

export type NestedEnumTemplateStyleWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.TemplateStyle | Prisma.EnumTemplateStyleFieldRefInput<$PrismaModel>
  in?: $Enums.TemplateStyle[]
  notIn?: $Enums.TemplateStyle[]
  not?: Prisma.NestedEnumTemplateStyleWithAggregatesFilter<$PrismaModel> | $Enums.TemplateStyle
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumTemplateStyleFilter<$PrismaModel>
  _max?: Prisma.NestedEnumTemplateStyleFilter<$PrismaModel>
}

export type NestedEnumEventStatusFilter<$PrismaModel = never> = {
  equals?: $Enums.EventStatus | Prisma.EnumEventStatusFieldRefInput<$PrismaModel>
  in?: $Enums.EventStatus[]
  notIn?: $Enums.EventStatus[]
  not?: Prisma.NestedEnumEventStatusFilter<$PrismaModel> | $Enums.EventStatus
}

export type NestedBoolFilter<$PrismaModel = never> = {
  equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>
  not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean
}

export type NestedEnumEventStatusWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.EventStatus | Prisma.EnumEventStatusFieldRefInput<$PrismaModel>
  in?: $Enums.EventStatus[]
  notIn?: $Enums.EventStatus[]
  not?: Prisma.NestedEnumEventStatusWithAggregatesFilter<$PrismaModel> | $Enums.EventStatus
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumEventStatusFilter<$PrismaModel>
  _max?: Prisma.NestedEnumEventStatusFilter<$PrismaModel>
}

export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
  equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>
  not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedBoolFilter<$PrismaModel>
  _max?: Prisma.NestedBoolFilter<$PrismaModel>
}

export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null
  in?: number[] | null
  notIn?: number[] | null
  lt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  lte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>
  _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _min?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _max?: Prisma.NestedIntNullableFilter<$PrismaModel>
}

export type NestedFloatNullableFilter<$PrismaModel = never> = {
  equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null
  in?: number[] | null
  notIn?: number[] | null
  lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null
}

export type NestedEnumNoteTypeFilter<$PrismaModel = never> = {
  equals?: $Enums.NoteType | Prisma.EnumNoteTypeFieldRefInput<$PrismaModel>
  in?: $Enums.NoteType[]
  notIn?: $Enums.NoteType[]
  not?: Prisma.NestedEnumNoteTypeFilter<$PrismaModel> | $Enums.NoteType
}

export type NestedEnumNoteTypeWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.NoteType | Prisma.EnumNoteTypeFieldRefInput<$PrismaModel>
  in?: $Enums.NoteType[]
  notIn?: $Enums.NoteType[]
  not?: Prisma.NestedEnumNoteTypeWithAggregatesFilter<$PrismaModel> | $Enums.NoteType
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumNoteTypeFilter<$PrismaModel>
  _max?: Prisma.NestedEnumNoteTypeFilter<$PrismaModel>
}



```

## File: src/generated/prisma/enums.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
* This file exports all enum related types from the schema.
*
* 🟢 You can import this file directly.
*/

export const Level = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced'
} as const

export type Level = (typeof Level)[keyof typeof Level]


export const Role = {
  user: 'user',
  admin: 'admin',
  creator: 'creator'
} as const

export type Role = (typeof Role)[keyof typeof Role]


export const Status = {
  draft: 'draft',
  published: 'published',
  archived: 'archived'
} as const

export type Status = (typeof Status)[keyof typeof Status]


export const ProgressStatus = {
  not_started: 'not_started',
  in_progress: 'in_progress',
  completed: 'completed'
} as const

export type ProgressStatus = (typeof ProgressStatus)[keyof typeof ProgressStatus]


export const Difficulty = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard'
} as const

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty]


export const InterviewType = {
  simulated: 'simulated',
  prep_feedback: 'prep_feedback'
} as const

export type InterviewType = (typeof InterviewType)[keyof typeof InterviewType]


export const TemplateStyle = {
  modern: 'modern',
  classic: 'classic',
  minimal: 'minimal'
} as const

export type TemplateStyle = (typeof TemplateStyle)[keyof typeof TemplateStyle]


export const EventStatus = {
  planned: 'planned',
  done: 'done',
  missed: 'missed',
  cancelled: 'cancelled'
} as const

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus]


export const NoteType = {
  summary: 'summary',
  hint: 'hint',
  explanation: 'explanation',
  feedback: 'feedback',
  user_question: 'user_question',
  ai_response: 'ai_response'
} as const

export type NoteType = (typeof NoteType)[keyof typeof NoteType]

```

## File: src/generated/prisma/models.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This is a barrel export file for all models and their related types.
 *
 * 🟢 You can import this file directly.
 */
export type * from './models/User'
export type * from './models/Roadmap'
export type * from './models/Module'
export type * from './models/UserProgress'
export type * from './models/Exercise'
export type * from './models/ExerciseSubmission'
export type * from './models/InterviewSession'
export type * from './models/CV'
export type * from './models/Certificate'
export type * from './models/LearningEvent'
export type * from './models/AINote'
export type * from './commonInputTypes'
```

## File: src/generated/prisma/internal/class.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * WARNING: This is an internal file that is subject to change!
 *
 * 🛑 Under no circumstances should you import this file directly! 🛑
 *
 * Please import the `PrismaClient` class from the `client.ts` file instead.
 */

import * as runtime from "@prisma/client/runtime/client"
import type * as Prisma from "./prismaNamespace"


const config: runtime.GetPrismaClientConfig = {
  "previewFeatures": [],
  "clientVersion": "7.1.0",
  "engineVersion": "ab635e6b9d606fa5c8fb8b1a7f909c3c3c1c98ba",
  "activeProvider": "mysql",
  "inlineSchema": "generator client {\n  provider = \"prisma-client\"\n  output   = \"../src/generated/prisma\"\n}\n\ndatasource db {\n  provider = \"mysql\"\n}\n\nmodel User {\n  user_id             String               @id @default(uuid()) @db.VarChar(36)\n  email               String               @unique @db.VarChar(255)\n  password_hash       String               @db.VarChar(255)\n  full_name           String               @db.VarChar(100)\n  current_level       Level                @default(beginner)\n  role                Role                 @default(user)\n  avatar_url          String?              @db.VarChar(4096)\n  created_at          DateTime             @default(now())\n  updated_at          DateTime             @updatedAt\n  aiNotes             AINote[]\n  cvs                 CV[]\n  certificates        Certificate[]\n  interviewSessions   InterviewSession[]\n  learningEvents      LearningEvent[]\n  roadmaps            Roadmap[]\n  progress            UserProgress[]\n  exerciseSubmissions ExerciseSubmission[]\n\n  @@index([email])\n  @@map(\"Users\")\n}\n\nmodel Roadmap {\n  roadmap_id   String        @id @default(uuid()) @db.VarChar(36)\n  title        String        @db.VarChar(100)\n  description  String?       @db.Text\n  category     String        @db.VarChar(50)\n  image_url    String?       @db.VarChar(500)\n  created_by   String        @db.VarChar(36)\n  status       Status        @default(draft)\n  created_at   DateTime      @default(now())\n  updated_at   DateTime      @updatedAt\n  certificates Certificate[]\n  modules      Module[]\n  creator      User          @relation(fields: [created_by], references: [user_id])\n\n  @@index([category])\n  @@index([created_by], map: \"Roadmaps_created_by_fkey\")\n  @@map(\"Roadmaps\")\n}\n\nmodel Module {\n  module_id       String          @id @default(uuid()) @db.VarChar(36)\n  roadmap_id      String          @db.VarChar(36)\n  title           String          @db.VarChar(100)\n  description     String?         @db.Text\n  content         String?         @db.LongText\n  order_index     Int\n  estimated_hours Decimal?        @db.Decimal(4, 1)\n  created_at      DateTime        @default(now())\n  updated_at      DateTime        @updatedAt\n  aiNotes         AINote[]\n  exercises       Exercise[]\n  learningEvents  LearningEvent[]\n  roadmap         Roadmap         @relation(fields: [roadmap_id], references: [roadmap_id], onDelete: Cascade)\n  userProgress    UserProgress[]\n\n  @@unique([roadmap_id, order_index])\n  @@index([roadmap_id, order_index])\n  @@map(\"Modules\")\n}\n\nmodel UserProgress {\n  progress_id           String         @id @default(uuid()) @db.VarChar(36)\n  user_id               String         @db.VarChar(36)\n  module_id             String         @db.VarChar(36)\n  status                ProgressStatus @default(not_started)\n  completion_percentage Decimal        @default(0.00) @db.Decimal(5, 2)\n  started_at            DateTime?\n  completed_at          DateTime?\n  last_accessed_at      DateTime       @default(now()) @updatedAt\n  module                Module         @relation(fields: [module_id], references: [module_id], onDelete: Cascade)\n  user                  User           @relation(fields: [user_id], references: [user_id], onDelete: Cascade)\n\n  @@unique([user_id, module_id])\n  @@index([user_id, status])\n  @@index([module_id], map: \"UserProgress_module_id_fkey\")\n  @@map(\"UserProgress\")\n}\n\nmodel Exercise {\n  exercise_id   String               @id @default(uuid()) @db.VarChar(36)\n  module_id     String               @db.VarChar(36)\n  title         String               @db.VarChar(100)\n  description   String               @db.Text\n  examples      Json?\n  starter_code  String?              @db.MediumText\n  solution_code String?              @db.MediumText\n  difficulty    Difficulty           @default(medium)\n  created_at    DateTime             @default(now())\n  updated_at    DateTime             @updatedAt\n  module        Module               @relation(fields: [module_id], references: [module_id], onDelete: Cascade)\n  submissions   ExerciseSubmission[]\n\n  @@index([module_id, difficulty])\n  @@map(\"Exercises\")\n}\n\nmodel ExerciseSubmission {\n  submission_id String   @id @default(uuid()) @db.VarChar(36)\n  exercise_id   String   @db.VarChar(36)\n  user_id       String   @db.VarChar(36)\n  answer_text   String   @db.LongText\n  submitted_at  DateTime @default(now())\n  exercise      Exercise @relation(fields: [exercise_id], references: [exercise_id], onDelete: Cascade)\n  user          User     @relation(fields: [user_id], references: [user_id], onDelete: Cascade)\n\n  @@index([exercise_id, user_id])\n  @@index([user_id, submitted_at])\n  @@map(\"ExerciseSubmissions\")\n}\n\nmodel InterviewSession {\n  session_id     String        @id @default(uuid()) @db.VarChar(36)\n  user_id        String        @db.VarChar(36)\n  session_name   String        @db.VarChar(100)\n  interview_type InterviewType\n  questions      Json\n  user_answers   Json?\n  ai_feedback    Json?\n  score          Decimal?      @db.Decimal(5, 2)\n  created_at     DateTime      @default(now())\n  user           User          @relation(fields: [user_id], references: [user_id], onDelete: Cascade)\n\n  @@index([user_id, created_at])\n  @@map(\"InterviewSessions\")\n}\n\nmodel CV {\n  cv_id          String        @id @default(uuid()) @db.VarChar(36)\n  user_id        String        @db.VarChar(36)\n  cv_name        String        @db.VarChar(100)\n  template_style TemplateStyle @default(modern)\n  personal_info  Json?\n  education      Json?\n  experience     Json?\n  skills         Json?\n  projects       Json?\n  pdf_url        String?       @db.VarChar(500)\n  created_at     DateTime      @default(now())\n  updated_at     DateTime      @updatedAt\n  user           User          @relation(fields: [user_id], references: [user_id], onDelete: Cascade)\n\n  @@index([user_id, created_at])\n  @@map(\"CVs\")\n}\n\nmodel Certificate {\n  certificate_id   String   @id @default(uuid()) @db.VarChar(36)\n  user_id          String   @db.VarChar(36)\n  roadmap_id       String   @db.VarChar(36)\n  certificate_name String   @db.VarChar(100)\n  issue_date       DateTime @default(now())\n  pdf_url          String?  @db.VarChar(500)\n  roadmap          Roadmap  @relation(fields: [roadmap_id], references: [roadmap_id], onDelete: Cascade)\n  user             User     @relation(fields: [user_id], references: [user_id], onDelete: Cascade)\n\n  @@unique([user_id, roadmap_id])\n  @@index([user_id, roadmap_id])\n  @@index([roadmap_id], map: \"Certificates_roadmap_id_fkey\")\n  @@map(\"Certificates\")\n}\n\nmodel LearningEvent {\n  event_id         String      @id @default(uuid()) @db.VarChar(36)\n  user_id          String      @db.VarChar(36)\n  title            String      @default(\"Study Session\") @db.VarChar(150)\n  description      String?     @db.MediumText\n  status           EventStatus @default(planned)\n  start_utc        DateTime    @db.DateTime(0)\n  end_utc          DateTime    @db.DateTime(0)\n  all_day          Boolean     @default(false)\n  timezone         String      @default(\"Asia/Ho_Chi_Minh\") @db.VarChar(50)\n  module_id        String?     @db.VarChar(36)\n  color            String      @default(\"#3B82F6\") @db.VarChar(7)\n  is_ai_suggested  Boolean     @default(false)\n  reminder_minutes Int?        @db.SmallInt\n  is_deleted       Boolean     @default(false)\n  created_at       DateTime    @default(now())\n  updated_at       DateTime    @updatedAt\n  module           Module?     @relation(fields: [module_id], references: [module_id])\n  user             User        @relation(fields: [user_id], references: [user_id], onDelete: Cascade)\n\n  @@index([user_id, start_utc])\n  @@index([module_id])\n  @@index([user_id, is_ai_suggested])\n  @@map(\"LearningEvents\")\n}\n\nmodel AINote {\n  note_id        String   @id @default(uuid()) @db.VarChar(36)\n  user_id        String   @db.VarChar(36)\n  module_id      String   @db.VarChar(36)\n  note_type      NoteType\n  content        String   @db.LongText\n  created_at     DateTime @default(now())\n  sequence_order Int\n  module         Module   @relation(fields: [module_id], references: [module_id], onDelete: Cascade)\n  user           User     @relation(fields: [user_id], references: [user_id], onDelete: Cascade)\n\n  @@index([user_id, module_id, sequence_order])\n  @@index([module_id, note_type])\n  @@map(\"AINotes\")\n}\n\nenum Level {\n  beginner\n  intermediate\n  advanced\n}\n\nenum Role {\n  user\n  admin\n  creator\n}\n\nenum Status {\n  draft\n  published\n  archived\n}\n\nenum ProgressStatus {\n  not_started\n  in_progress\n  completed\n}\n\nenum Difficulty {\n  easy\n  medium\n  hard\n}\n\nenum InterviewType {\n  simulated\n  prep_feedback\n}\n\nenum TemplateStyle {\n  modern\n  classic\n  minimal\n}\n\nenum EventStatus {\n  planned\n  done\n  missed\n  cancelled\n}\n\nenum NoteType {\n  summary\n  hint\n  explanation\n  feedback\n  user_question\n  ai_response\n}\n",
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"user_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password_hash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"full_name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"current_level\",\"kind\":\"enum\",\"type\":\"Level\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"Role\"},{\"name\":\"avatar_url\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"aiNotes\",\"kind\":\"object\",\"type\":\"AINote\",\"relationName\":\"AINoteToUser\"},{\"name\":\"cvs\",\"kind\":\"object\",\"type\":\"CV\",\"relationName\":\"CVToUser\"},{\"name\":\"certificates\",\"kind\":\"object\",\"type\":\"Certificate\",\"relationName\":\"CertificateToUser\"},{\"name\":\"interviewSessions\",\"kind\":\"object\",\"type\":\"InterviewSession\",\"relationName\":\"InterviewSessionToUser\"},{\"name\":\"learningEvents\",\"kind\":\"object\",\"type\":\"LearningEvent\",\"relationName\":\"LearningEventToUser\"},{\"name\":\"roadmaps\",\"kind\":\"object\",\"type\":\"Roadmap\",\"relationName\":\"RoadmapToUser\"},{\"name\":\"progress\",\"kind\":\"object\",\"type\":\"UserProgress\",\"relationName\":\"UserToUserProgress\"},{\"name\":\"exerciseSubmissions\",\"kind\":\"object\",\"type\":\"ExerciseSubmission\",\"relationName\":\"ExerciseSubmissionToUser\"}],\"dbName\":\"Users\"},\"Roadmap\":{\"fields\":[{\"name\":\"roadmap_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"image_url\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"created_by\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"Status\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"certificates\",\"kind\":\"object\",\"type\":\"Certificate\",\"relationName\":\"CertificateToRoadmap\"},{\"name\":\"modules\",\"kind\":\"object\",\"type\":\"Module\",\"relationName\":\"ModuleToRoadmap\"},{\"name\":\"creator\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"RoadmapToUser\"}],\"dbName\":\"Roadmaps\"},\"Module\":{\"fields\":[{\"name\":\"module_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"roadmap_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"order_index\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"estimated_hours\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"aiNotes\",\"kind\":\"object\",\"type\":\"AINote\",\"relationName\":\"AINoteToModule\"},{\"name\":\"exercises\",\"kind\":\"object\",\"type\":\"Exercise\",\"relationName\":\"ExerciseToModule\"},{\"name\":\"learningEvents\",\"kind\":\"object\",\"type\":\"LearningEvent\",\"relationName\":\"LearningEventToModule\"},{\"name\":\"roadmap\",\"kind\":\"object\",\"type\":\"Roadmap\",\"relationName\":\"ModuleToRoadmap\"},{\"name\":\"userProgress\",\"kind\":\"object\",\"type\":\"UserProgress\",\"relationName\":\"ModuleToUserProgress\"}],\"dbName\":\"Modules\"},\"UserProgress\":{\"fields\":[{\"name\":\"progress_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"module_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"ProgressStatus\"},{\"name\":\"completion_percentage\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"started_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"completed_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"last_accessed_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"module\",\"kind\":\"object\",\"type\":\"Module\",\"relationName\":\"ModuleToUserProgress\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToUserProgress\"}],\"dbName\":\"UserProgress\"},\"Exercise\":{\"fields\":[{\"name\":\"exercise_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"module_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"examples\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"starter_code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"solution_code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"difficulty\",\"kind\":\"enum\",\"type\":\"Difficulty\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"module\",\"kind\":\"object\",\"type\":\"Module\",\"relationName\":\"ExerciseToModule\"},{\"name\":\"submissions\",\"kind\":\"object\",\"type\":\"ExerciseSubmission\",\"relationName\":\"ExerciseToExerciseSubmission\"}],\"dbName\":\"Exercises\"},\"ExerciseSubmission\":{\"fields\":[{\"name\":\"submission_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"exercise_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"answer_text\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"submitted_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"exercise\",\"kind\":\"object\",\"type\":\"Exercise\",\"relationName\":\"ExerciseToExerciseSubmission\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ExerciseSubmissionToUser\"}],\"dbName\":\"ExerciseSubmissions\"},\"InterviewSession\":{\"fields\":[{\"name\":\"session_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"session_name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"interview_type\",\"kind\":\"enum\",\"type\":\"InterviewType\"},{\"name\":\"questions\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"user_answers\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"ai_feedback\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"score\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"InterviewSessionToUser\"}],\"dbName\":\"InterviewSessions\"},\"CV\":{\"fields\":[{\"name\":\"cv_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"cv_name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"template_style\",\"kind\":\"enum\",\"type\":\"TemplateStyle\"},{\"name\":\"personal_info\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"education\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"experience\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"skills\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"projects\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"pdf_url\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CVToUser\"}],\"dbName\":\"CVs\"},\"Certificate\":{\"fields\":[{\"name\":\"certificate_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"roadmap_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"certificate_name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"issue_date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"pdf_url\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"roadmap\",\"kind\":\"object\",\"type\":\"Roadmap\",\"relationName\":\"CertificateToRoadmap\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CertificateToUser\"}],\"dbName\":\"Certificates\"},\"LearningEvent\":{\"fields\":[{\"name\":\"event_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"EventStatus\"},{\"name\":\"start_utc\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"end_utc\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"all_day\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"timezone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"module_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"color\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"is_ai_suggested\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"reminder_minutes\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"is_deleted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"module\",\"kind\":\"object\",\"type\":\"Module\",\"relationName\":\"LearningEventToModule\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"LearningEventToUser\"}],\"dbName\":\"LearningEvents\"},\"AINote\":{\"fields\":[{\"name\":\"note_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"module_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"note_type\",\"kind\":\"enum\",\"type\":\"NoteType\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"sequence_order\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"module\",\"kind\":\"object\",\"type\":\"Module\",\"relationName\":\"AINoteToModule\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AINoteToUser\"}],\"dbName\":\"AINotes\"}},\"enums\":{},\"types\":{}}")

async function decodeBase64AsWasm(wasmBase64: string): Promise<WebAssembly.Module> {
  const { Buffer } = await import('node:buffer')
  const wasmArray = Buffer.from(wasmBase64, 'base64')
  return new WebAssembly.Module(wasmArray)
}

config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_bg.mysql.js"),

  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_bg.mysql.wasm-base64.js")
    return await decodeBase64AsWasm(wasm)
  }
}



export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> =
  'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never

export interface PrismaClientConstructor {
    /**
   * ## Prisma Client
   * 
   * Type-safe database client for TypeScript
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   * 
   * Read more in our [docs](https://pris.ly/d/client).
   */

  new <
    Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
    LogOpts extends LogOptions<Options> = LogOptions<Options>,
    OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends { omit: infer U } ? U : Prisma.PrismaClientOptions['omit'],
    ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs
  >(options: Prisma.Subset<Options, Prisma.PrismaClientOptions> ): PrismaClient<LogOpts, OmitOpts, ExtArgs>
}

/**
 * ## Prisma Client
 * 
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 * 
 * Read more in our [docs](https://pris.ly/d/client).
 */

export interface PrismaClient<
  in LogOpts extends Prisma.LogLevel = never,
  in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined,
  in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

  $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): runtime.Types.Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): runtime.Types.Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): runtime.Types.Utils.JsPromise<R>

  $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, { omit: OmitOpts }>;

  /**
   * `prisma.roadmap`: Exposes CRUD operations for the **Roadmap** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roadmaps
    * const roadmaps = await prisma.roadmap.findMany()
    * ```
    */
  get roadmap(): Prisma.RoadmapDelegate<ExtArgs, { omit: OmitOpts }>;

  /**
   * `prisma.module`: Exposes CRUD operations for the **Module** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Modules
    * const modules = await prisma.module.findMany()
    * ```
    */
  get module(): Prisma.ModuleDelegate<ExtArgs, { omit: OmitOpts }>;

  /**
   * `prisma.userProgress`: Exposes CRUD operations for the **UserProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserProgresses
    * const userProgresses = await prisma.userProgress.findMany()
    * ```
    */
  get userProgress(): Prisma.UserProgressDelegate<ExtArgs, { omit: OmitOpts }>;

  /**
   * `prisma.exercise`: Exposes CRUD operations for the **Exercise** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Exercises
    * const exercises = await prisma.exercise.findMany()
    * ```
    */
  get exercise(): Prisma.ExerciseDelegate<ExtArgs, { omit: OmitOpts }>;

  /**
   * `prisma.exerciseSubmission`: Exposes CRUD operations for the **ExerciseSubmission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExerciseSubmissions
    * const exerciseSubmissions = await prisma.exerciseSubmission.findMany()
    * ```
    */
  get exerciseSubmission(): Prisma.ExerciseSubmissionDelegate<ExtArgs, { omit: OmitOpts }>;

  /**
   * `prisma.interviewSession`: Exposes CRUD operations for the **InterviewSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InterviewSessions
    * const interviewSessions = await prisma.interviewSession.findMany()
    * ```
    */
  get interviewSession(): Prisma.InterviewSessionDelegate<ExtArgs, { omit: OmitOpts }>;

  /**
   * `prisma.cV`: Exposes CRUD operations for the **CV** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CVS
    * const cVS = await prisma.cV.findMany()
    * ```
    */
  get cV(): Prisma.CVDelegate<ExtArgs, { omit: OmitOpts }>;

  /**
   * `prisma.certificate`: Exposes CRUD operations for the **Certificate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Certificates
    * const certificates = await prisma.certificate.findMany()
    * ```
    */
  get certificate(): Prisma.CertificateDelegate<ExtArgs, { omit: OmitOpts }>;

  /**
   * `prisma.learningEvent`: Exposes CRUD operations for the **LearningEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LearningEvents
    * const learningEvents = await prisma.learningEvent.findMany()
    * ```
    */
  get learningEvent(): Prisma.LearningEventDelegate<ExtArgs, { omit: OmitOpts }>;

  /**
   * `prisma.aINote`: Exposes CRUD operations for the **AINote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AINotes
    * const aINotes = await prisma.aINote.findMany()
    * ```
    */
  get aINote(): Prisma.AINoteDelegate<ExtArgs, { omit: OmitOpts }>;
}

export function getPrismaClientClass(): PrismaClientConstructor {
  return runtime.getPrismaClient(config) as unknown as PrismaClientConstructor
}

```

## File: src/generated/prisma/internal/prismaNamespace.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * WARNING: This is an internal file that is subject to change!
 *
 * 🛑 Under no circumstances should you import this file directly! 🛑
 *
 * All exports from this file are wrapped under a `Prisma` namespace object in the client.ts file.
 * While this enables partial backward compatibility, it is not part of the stable public API.
 *
 * If you are looking for your Models, Enums, and Input Types, please import them from the respective
 * model files in the `model` directory!
 */

import * as runtime from "@prisma/client/runtime/client"
import type * as Prisma from "../models"
import { type PrismaClient } from "./class"

export type * from '../models'

export type DMMF = typeof runtime.DMMF

export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>

/**
 * Prisma Errors
 */

export const PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError

export const PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError

export const PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError

export const PrismaClientInitializationError = runtime.PrismaClientInitializationError
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError

export const PrismaClientValidationError = runtime.PrismaClientValidationError
export type PrismaClientValidationError = runtime.PrismaClientValidationError

/**
 * Re-export of sql-template-tag
 */
export const sql = runtime.sqltag
export const empty = runtime.empty
export const join = runtime.join
export const raw = runtime.raw
export const Sql = runtime.Sql
export type Sql = runtime.Sql



/**
 * Decimal.js
 */
export const Decimal = runtime.Decimal
export type Decimal = runtime.Decimal

export type DecimalJsLike = runtime.DecimalJsLike

/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs
export const getExtensionContext = runtime.Extensions.getExtensionContext
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>

export type PrismaVersion = {
  client: string
  engine: string
}

/**
 * Prisma Client JS version: 7.1.0
 * Query Engine version: ab635e6b9d606fa5c8fb8b1a7f909c3c3c1c98ba
 */
export const prismaVersion: PrismaVersion = {
  client: "7.1.0",
  engine: "ab635e6b9d606fa5c8fb8b1a7f909c3c3c1c98ba"
}

/**
 * Utility Types
 */

export type Bytes = runtime.Bytes
export type JsonObject = runtime.JsonObject
export type JsonArray = runtime.JsonArray
export type JsonValue = runtime.JsonValue
export type InputJsonObject = runtime.InputJsonObject
export type InputJsonArray = runtime.InputJsonArray
export type InputJsonValue = runtime.InputJsonValue


export const NullTypes = {
  DbNull: runtime.NullTypes.DbNull as (new (secret: never) => typeof runtime.DbNull),
  JsonNull: runtime.NullTypes.JsonNull as (new (secret: never) => typeof runtime.JsonNull),
  AnyNull: runtime.NullTypes.AnyNull as (new (secret: never) => typeof runtime.AnyNull),
}
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export const DbNull = runtime.DbNull

/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export const JsonNull = runtime.JsonNull

/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export const AnyNull = runtime.AnyNull


type SelectAndInclude = {
  select: any
  include: any
}

type SelectAndOmit = {
  select: any
  omit: any
}

/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

export type Enumerable<T> = T | Array<T>;

/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export type Subset<T, U> = {
  [key in keyof T]: key extends keyof U ? T[key] : never;
};

/**
 * SelectSubset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
 * Additionally, it validates, if both select and include are present. If the case, it errors.
 */
export type SelectSubset<T, U> = {
  [key in keyof T]: key extends keyof U ? T[key] : never
} &
  (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {})

/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
  [key in keyof T]: key extends keyof U ? T[key] : never
} &
  K

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> =
  T extends object ?
  U extends object ?
    (Without<T, U> & U) | (Without<U, T> & T)
  : U : T


/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any>
? False
: T extends Date
? False
: T extends Uint8Array
? False
: T extends BigInt
? False
: T extends object
? True
: False


/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

/**
 * From ts-toolbelt
 */

type __Either<O extends object, K extends Key> = Omit<O, K> &
  {
    // Merge all but K
    [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
  }[K]

type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

type _Either<
  O extends object,
  K extends Key,
  strict extends Boolean
> = {
  1: EitherStrict<O, K>
  0: EitherLoose<O, K>
}[strict]

export type Either<
  O extends object,
  K extends Key,
  strict extends Boolean = 1
> = O extends unknown ? _Either<O, K, strict> : never

export type Union = any

export type PatchUndefined<O extends object, O1 extends object> = {
  [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
} & {}

/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};

type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;

type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];

export type ComputeRaw<A extends any> = A extends Function ? A : {
  [K in keyof A]: A[K];
} & {};

export type OptionalFlat<O> = {
  [K in keyof O]?: O[K];
} & {};

type _Record<K extends keyof any, T> = {
  [P in K]: T;
};

// cause typescript not to expand types and preserve names
type NoExpand<T> = T extends unknown ? T : never;

// this type assumes the passed object is entirely optional
export type AtLeast<O extends object, K extends string> = NoExpand<
  O extends unknown
  ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
    | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
  : never>;

type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/

export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

export type Boolean = True | False

export type True = 1

export type False = 0

export type Not<B extends Boolean> = {
  0: 1
  1: 0
}[B]

export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
  ? 0 // anything `never` is false
  : A1 extends A2
  ? 1
  : 0

export type Has<U extends Union, U1 extends Union> = Not<
  Extends<Exclude<U1, U>, U1>
>

export type Or<B1 extends Boolean, B2 extends Boolean> = {
  0: {
    0: 0
    1: 1
  }
  1: {
    0: 1
    1: 1
  }
}[B1][B2]

export type Keys<U extends Union> = U extends unknown ? keyof U : never

export type GetScalarType<T, O> = O extends object ? {
  [P in keyof T]: P extends keyof O
    ? O[P]
    : never
} : never

type FieldPaths<
  T,
  U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
> = IsObject<T> extends True ? U : T

export type GetHavingFields<T> = {
  [K in keyof T]: Or<
    Or<Extends<'OR', K>, Extends<'AND', K>>,
    Extends<'NOT', K>
  > extends True
    ? // infer is only needed to not hit TS limit
      // based on the brilliant idea of Pierre-Antoine Mills
      // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
      T[K] extends infer TK
      ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
      : never
    : {} extends FieldPaths<T[K]>
    ? never
    : K
}[keyof T]

/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


export const ModelName = {
  User: 'User',
  Roadmap: 'Roadmap',
  Module: 'Module',
  UserProgress: 'UserProgress',
  Exercise: 'Exercise',
  ExerciseSubmission: 'ExerciseSubmission',
  InterviewSession: 'InterviewSession',
  CV: 'CV',
  Certificate: 'Certificate',
  LearningEvent: 'LearningEvent',
  AINote: 'AINote'
} as const

export type ModelName = (typeof ModelName)[keyof typeof ModelName]



export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{extArgs: runtime.Types.Extensions.InternalArgs }, runtime.Types.Utils.Record<string, any>> {
  returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>
}

export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
  globalOmitOptions: {
    omit: GlobalOmitOptions
  }
  meta: {
    modelProps: "user" | "roadmap" | "module" | "userProgress" | "exercise" | "exerciseSubmission" | "interviewSession" | "cV" | "certificate" | "learningEvent" | "aINote"
    txIsolationLevel: TransactionIsolationLevel
  }
  model: {
    User: {
      payload: Prisma.$UserPayload<ExtArgs>
      fields: Prisma.UserFieldRefs
      operations: {
        findUnique: {
          args: Prisma.UserFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>
        }
        findFirst: {
          args: Prisma.UserFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>
        }
        findMany: {
          args: Prisma.UserFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[]
        }
        create: {
          args: Prisma.UserCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>
        }
        createMany: {
          args: Prisma.UserCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        delete: {
          args: Prisma.UserDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>
        }
        update: {
          args: Prisma.UserUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>
        }
        deleteMany: {
          args: Prisma.UserDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.UserUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        upsert: {
          args: Prisma.UserUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>
        }
        aggregate: {
          args: Prisma.UserAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateUser>
        }
        groupBy: {
          args: Prisma.UserGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[]
        }
        count: {
          args: Prisma.UserCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number
        }
      }
    }
    Roadmap: {
      payload: Prisma.$RoadmapPayload<ExtArgs>
      fields: Prisma.RoadmapFieldRefs
      operations: {
        findUnique: {
          args: Prisma.RoadmapFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapPayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.RoadmapFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapPayload>
        }
        findFirst: {
          args: Prisma.RoadmapFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapPayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.RoadmapFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapPayload>
        }
        findMany: {
          args: Prisma.RoadmapFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapPayload>[]
        }
        create: {
          args: Prisma.RoadmapCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapPayload>
        }
        createMany: {
          args: Prisma.RoadmapCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        delete: {
          args: Prisma.RoadmapDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapPayload>
        }
        update: {
          args: Prisma.RoadmapUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapPayload>
        }
        deleteMany: {
          args: Prisma.RoadmapDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.RoadmapUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        upsert: {
          args: Prisma.RoadmapUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$RoadmapPayload>
        }
        aggregate: {
          args: Prisma.RoadmapAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateRoadmap>
        }
        groupBy: {
          args: Prisma.RoadmapGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.RoadmapGroupByOutputType>[]
        }
        count: {
          args: Prisma.RoadmapCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.RoadmapCountAggregateOutputType> | number
        }
      }
    }
    Module: {
      payload: Prisma.$ModulePayload<ExtArgs>
      fields: Prisma.ModuleFieldRefs
      operations: {
        findUnique: {
          args: Prisma.ModuleFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.ModuleFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>
        }
        findFirst: {
          args: Prisma.ModuleFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.ModuleFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>
        }
        findMany: {
          args: Prisma.ModuleFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>[]
        }
        create: {
          args: Prisma.ModuleCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>
        }
        createMany: {
          args: Prisma.ModuleCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        delete: {
          args: Prisma.ModuleDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>
        }
        update: {
          args: Prisma.ModuleUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>
        }
        deleteMany: {
          args: Prisma.ModuleDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.ModuleUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        upsert: {
          args: Prisma.ModuleUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ModulePayload>
        }
        aggregate: {
          args: Prisma.ModuleAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateModule>
        }
        groupBy: {
          args: Prisma.ModuleGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.ModuleGroupByOutputType>[]
        }
        count: {
          args: Prisma.ModuleCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.ModuleCountAggregateOutputType> | number
        }
      }
    }
    UserProgress: {
      payload: Prisma.$UserProgressPayload<ExtArgs>
      fields: Prisma.UserProgressFieldRefs
      operations: {
        findUnique: {
          args: Prisma.UserProgressFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.UserProgressFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>
        }
        findFirst: {
          args: Prisma.UserProgressFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.UserProgressFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>
        }
        findMany: {
          args: Prisma.UserProgressFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>[]
        }
        create: {
          args: Prisma.UserProgressCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>
        }
        createMany: {
          args: Prisma.UserProgressCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        delete: {
          args: Prisma.UserProgressDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>
        }
        update: {
          args: Prisma.UserProgressUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>
        }
        deleteMany: {
          args: Prisma.UserProgressDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.UserProgressUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        upsert: {
          args: Prisma.UserProgressUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>
        }
        aggregate: {
          args: Prisma.UserProgressAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateUserProgress>
        }
        groupBy: {
          args: Prisma.UserProgressGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.UserProgressGroupByOutputType>[]
        }
        count: {
          args: Prisma.UserProgressCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.UserProgressCountAggregateOutputType> | number
        }
      }
    }
    Exercise: {
      payload: Prisma.$ExercisePayload<ExtArgs>
      fields: Prisma.ExerciseFieldRefs
      operations: {
        findUnique: {
          args: Prisma.ExerciseFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExercisePayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.ExerciseFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExercisePayload>
        }
        findFirst: {
          args: Prisma.ExerciseFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExercisePayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.ExerciseFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExercisePayload>
        }
        findMany: {
          args: Prisma.ExerciseFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExercisePayload>[]
        }
        create: {
          args: Prisma.ExerciseCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExercisePayload>
        }
        createMany: {
          args: Prisma.ExerciseCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        delete: {
          args: Prisma.ExerciseDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExercisePayload>
        }
        update: {
          args: Prisma.ExerciseUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExercisePayload>
        }
        deleteMany: {
          args: Prisma.ExerciseDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.ExerciseUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        upsert: {
          args: Prisma.ExerciseUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExercisePayload>
        }
        aggregate: {
          args: Prisma.ExerciseAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateExercise>
        }
        groupBy: {
          args: Prisma.ExerciseGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.ExerciseGroupByOutputType>[]
        }
        count: {
          args: Prisma.ExerciseCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.ExerciseCountAggregateOutputType> | number
        }
      }
    }
    ExerciseSubmission: {
      payload: Prisma.$ExerciseSubmissionPayload<ExtArgs>
      fields: Prisma.ExerciseSubmissionFieldRefs
      operations: {
        findUnique: {
          args: Prisma.ExerciseSubmissionFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExerciseSubmissionPayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.ExerciseSubmissionFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExerciseSubmissionPayload>
        }
        findFirst: {
          args: Prisma.ExerciseSubmissionFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExerciseSubmissionPayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.ExerciseSubmissionFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExerciseSubmissionPayload>
        }
        findMany: {
          args: Prisma.ExerciseSubmissionFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExerciseSubmissionPayload>[]
        }
        create: {
          args: Prisma.ExerciseSubmissionCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExerciseSubmissionPayload>
        }
        createMany: {
          args: Prisma.ExerciseSubmissionCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        delete: {
          args: Prisma.ExerciseSubmissionDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExerciseSubmissionPayload>
        }
        update: {
          args: Prisma.ExerciseSubmissionUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExerciseSubmissionPayload>
        }
        deleteMany: {
          args: Prisma.ExerciseSubmissionDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.ExerciseSubmissionUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        upsert: {
          args: Prisma.ExerciseSubmissionUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$ExerciseSubmissionPayload>
        }
        aggregate: {
          args: Prisma.ExerciseSubmissionAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateExerciseSubmission>
        }
        groupBy: {
          args: Prisma.ExerciseSubmissionGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.ExerciseSubmissionGroupByOutputType>[]
        }
        count: {
          args: Prisma.ExerciseSubmissionCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.ExerciseSubmissionCountAggregateOutputType> | number
        }
      }
    }
    InterviewSession: {
      payload: Prisma.$InterviewSessionPayload<ExtArgs>
      fields: Prisma.InterviewSessionFieldRefs
      operations: {
        findUnique: {
          args: Prisma.InterviewSessionFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewSessionPayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.InterviewSessionFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
        }
        findFirst: {
          args: Prisma.InterviewSessionFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewSessionPayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.InterviewSessionFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
        }
        findMany: {
          args: Prisma.InterviewSessionFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewSessionPayload>[]
        }
        create: {
          args: Prisma.InterviewSessionCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
        }
        createMany: {
          args: Prisma.InterviewSessionCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        delete: {
          args: Prisma.InterviewSessionDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
        }
        update: {
          args: Prisma.InterviewSessionUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
        }
        deleteMany: {
          args: Prisma.InterviewSessionDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.InterviewSessionUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        upsert: {
          args: Prisma.InterviewSessionUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
        }
        aggregate: {
          args: Prisma.InterviewSessionAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateInterviewSession>
        }
        groupBy: {
          args: Prisma.InterviewSessionGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.InterviewSessionGroupByOutputType>[]
        }
        count: {
          args: Prisma.InterviewSessionCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.InterviewSessionCountAggregateOutputType> | number
        }
      }
    }
    CV: {
      payload: Prisma.$CVPayload<ExtArgs>
      fields: Prisma.CVFieldRefs
      operations: {
        findUnique: {
          args: Prisma.CVFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CVPayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.CVFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CVPayload>
        }
        findFirst: {
          args: Prisma.CVFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CVPayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.CVFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CVPayload>
        }
        findMany: {
          args: Prisma.CVFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CVPayload>[]
        }
        create: {
          args: Prisma.CVCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CVPayload>
        }
        createMany: {
          args: Prisma.CVCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        delete: {
          args: Prisma.CVDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CVPayload>
        }
        update: {
          args: Prisma.CVUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CVPayload>
        }
        deleteMany: {
          args: Prisma.CVDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.CVUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        upsert: {
          args: Prisma.CVUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CVPayload>
        }
        aggregate: {
          args: Prisma.CVAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateCV>
        }
        groupBy: {
          args: Prisma.CVGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.CVGroupByOutputType>[]
        }
        count: {
          args: Prisma.CVCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.CVCountAggregateOutputType> | number
        }
      }
    }
    Certificate: {
      payload: Prisma.$CertificatePayload<ExtArgs>
      fields: Prisma.CertificateFieldRefs
      operations: {
        findUnique: {
          args: Prisma.CertificateFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificatePayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.CertificateFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificatePayload>
        }
        findFirst: {
          args: Prisma.CertificateFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificatePayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.CertificateFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificatePayload>
        }
        findMany: {
          args: Prisma.CertificateFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificatePayload>[]
        }
        create: {
          args: Prisma.CertificateCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificatePayload>
        }
        createMany: {
          args: Prisma.CertificateCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        delete: {
          args: Prisma.CertificateDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificatePayload>
        }
        update: {
          args: Prisma.CertificateUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificatePayload>
        }
        deleteMany: {
          args: Prisma.CertificateDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.CertificateUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        upsert: {
          args: Prisma.CertificateUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$CertificatePayload>
        }
        aggregate: {
          args: Prisma.CertificateAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateCertificate>
        }
        groupBy: {
          args: Prisma.CertificateGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.CertificateGroupByOutputType>[]
        }
        count: {
          args: Prisma.CertificateCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.CertificateCountAggregateOutputType> | number
        }
      }
    }
    LearningEvent: {
      payload: Prisma.$LearningEventPayload<ExtArgs>
      fields: Prisma.LearningEventFieldRefs
      operations: {
        findUnique: {
          args: Prisma.LearningEventFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$LearningEventPayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.LearningEventFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$LearningEventPayload>
        }
        findFirst: {
          args: Prisma.LearningEventFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$LearningEventPayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.LearningEventFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$LearningEventPayload>
        }
        findMany: {
          args: Prisma.LearningEventFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$LearningEventPayload>[]
        }
        create: {
          args: Prisma.LearningEventCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$LearningEventPayload>
        }
        createMany: {
          args: Prisma.LearningEventCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        delete: {
          args: Prisma.LearningEventDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$LearningEventPayload>
        }
        update: {
          args: Prisma.LearningEventUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$LearningEventPayload>
        }
        deleteMany: {
          args: Prisma.LearningEventDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.LearningEventUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        upsert: {
          args: Prisma.LearningEventUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$LearningEventPayload>
        }
        aggregate: {
          args: Prisma.LearningEventAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateLearningEvent>
        }
        groupBy: {
          args: Prisma.LearningEventGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.LearningEventGroupByOutputType>[]
        }
        count: {
          args: Prisma.LearningEventCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.LearningEventCountAggregateOutputType> | number
        }
      }
    }
    AINote: {
      payload: Prisma.$AINotePayload<ExtArgs>
      fields: Prisma.AINoteFieldRefs
      operations: {
        findUnique: {
          args: Prisma.AINoteFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$AINotePayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.AINoteFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$AINotePayload>
        }
        findFirst: {
          args: Prisma.AINoteFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$AINotePayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.AINoteFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$AINotePayload>
        }
        findMany: {
          args: Prisma.AINoteFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$AINotePayload>[]
        }
        create: {
          args: Prisma.AINoteCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$AINotePayload>
        }
        createMany: {
          args: Prisma.AINoteCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        delete: {
          args: Prisma.AINoteDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$AINotePayload>
        }
        update: {
          args: Prisma.AINoteUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$AINotePayload>
        }
        deleteMany: {
          args: Prisma.AINoteDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.AINoteUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        upsert: {
          args: Prisma.AINoteUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$AINotePayload>
        }
        aggregate: {
          args: Prisma.AINoteAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateAINote>
        }
        groupBy: {
          args: Prisma.AINoteGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AINoteGroupByOutputType>[]
        }
        count: {
          args: Prisma.AINoteCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AINoteCountAggregateOutputType> | number
        }
      }
    }
  }
} & {
  other: {
    payload: any
    operations: {
      $executeRaw: {
        args: [query: TemplateStringsArray | Sql, ...values: any[]],
        result: any
      }
      $executeRawUnsafe: {
        args: [query: string, ...values: any[]],
        result: any
      }
      $queryRaw: {
        args: [query: TemplateStringsArray | Sql, ...values: any[]],
        result: any
      }
      $queryRawUnsafe: {
        args: [query: string, ...values: any[]],
        result: any
      }
    }
  }
}

/**
 * Enums
 */

export const TransactionIsolationLevel = runtime.makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
} as const)

export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


export const UserScalarFieldEnum = {
  user_id: 'user_id',
  email: 'email',
  password_hash: 'password_hash',
  full_name: 'full_name',
  current_level: 'current_level',
  role: 'role',
  avatar_url: 'avatar_url',
  created_at: 'created_at',
  updated_at: 'updated_at'
} as const

export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


export const RoadmapScalarFieldEnum = {
  roadmap_id: 'roadmap_id',
  title: 'title',
  description: 'description',
  category: 'category',
  image_url: 'image_url',
  created_by: 'created_by',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at'
} as const

export type RoadmapScalarFieldEnum = (typeof RoadmapScalarFieldEnum)[keyof typeof RoadmapScalarFieldEnum]


export const ModuleScalarFieldEnum = {
  module_id: 'module_id',
  roadmap_id: 'roadmap_id',
  title: 'title',
  description: 'description',
  content: 'content',
  order_index: 'order_index',
  estimated_hours: 'estimated_hours',
  created_at: 'created_at',
  updated_at: 'updated_at'
} as const

export type ModuleScalarFieldEnum = (typeof ModuleScalarFieldEnum)[keyof typeof ModuleScalarFieldEnum]


export const UserProgressScalarFieldEnum = {
  progress_id: 'progress_id',
  user_id: 'user_id',
  module_id: 'module_id',
  status: 'status',
  completion_percentage: 'completion_percentage',
  started_at: 'started_at',
  completed_at: 'completed_at',
  last_accessed_at: 'last_accessed_at'
} as const

export type UserProgressScalarFieldEnum = (typeof UserProgressScalarFieldEnum)[keyof typeof UserProgressScalarFieldEnum]


export const ExerciseScalarFieldEnum = {
  exercise_id: 'exercise_id',
  module_id: 'module_id',
  title: 'title',
  description: 'description',
  examples: 'examples',
  starter_code: 'starter_code',
  solution_code: 'solution_code',
  difficulty: 'difficulty',
  created_at: 'created_at',
  updated_at: 'updated_at'
} as const

export type ExerciseScalarFieldEnum = (typeof ExerciseScalarFieldEnum)[keyof typeof ExerciseScalarFieldEnum]


export const ExerciseSubmissionScalarFieldEnum = {
  submission_id: 'submission_id',
  exercise_id: 'exercise_id',
  user_id: 'user_id',
  answer_text: 'answer_text',
  submitted_at: 'submitted_at'
} as const

export type ExerciseSubmissionScalarFieldEnum = (typeof ExerciseSubmissionScalarFieldEnum)[keyof typeof ExerciseSubmissionScalarFieldEnum]


export const InterviewSessionScalarFieldEnum = {
  session_id: 'session_id',
  user_id: 'user_id',
  session_name: 'session_name',
  interview_type: 'interview_type',
  questions: 'questions',
  user_answers: 'user_answers',
  ai_feedback: 'ai_feedback',
  score: 'score',
  created_at: 'created_at'
} as const

export type InterviewSessionScalarFieldEnum = (typeof InterviewSessionScalarFieldEnum)[keyof typeof InterviewSessionScalarFieldEnum]


export const CVScalarFieldEnum = {
  cv_id: 'cv_id',
  user_id: 'user_id',
  cv_name: 'cv_name',
  template_style: 'template_style',
  personal_info: 'personal_info',
  education: 'education',
  experience: 'experience',
  skills: 'skills',
  projects: 'projects',
  pdf_url: 'pdf_url',
  created_at: 'created_at',
  updated_at: 'updated_at'
} as const

export type CVScalarFieldEnum = (typeof CVScalarFieldEnum)[keyof typeof CVScalarFieldEnum]


export const CertificateScalarFieldEnum = {
  certificate_id: 'certificate_id',
  user_id: 'user_id',
  roadmap_id: 'roadmap_id',
  certificate_name: 'certificate_name',
  issue_date: 'issue_date',
  pdf_url: 'pdf_url'
} as const

export type CertificateScalarFieldEnum = (typeof CertificateScalarFieldEnum)[keyof typeof CertificateScalarFieldEnum]


export const LearningEventScalarFieldEnum = {
  event_id: 'event_id',
  user_id: 'user_id',
  title: 'title',
  description: 'description',
  status: 'status',
  start_utc: 'start_utc',
  end_utc: 'end_utc',
  all_day: 'all_day',
  timezone: 'timezone',
  module_id: 'module_id',
  color: 'color',
  is_ai_suggested: 'is_ai_suggested',
  reminder_minutes: 'reminder_minutes',
  is_deleted: 'is_deleted',
  created_at: 'created_at',
  updated_at: 'updated_at'
} as const

export type LearningEventScalarFieldEnum = (typeof LearningEventScalarFieldEnum)[keyof typeof LearningEventScalarFieldEnum]


export const AINoteScalarFieldEnum = {
  note_id: 'note_id',
  user_id: 'user_id',
  module_id: 'module_id',
  note_type: 'note_type',
  content: 'content',
  created_at: 'created_at',
  sequence_order: 'sequence_order'
} as const

export type AINoteScalarFieldEnum = (typeof AINoteScalarFieldEnum)[keyof typeof AINoteScalarFieldEnum]


export const SortOrder = {
  asc: 'asc',
  desc: 'desc'
} as const

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


export const NullableJsonNullValueInput = {
  DbNull: DbNull,
  JsonNull: JsonNull
} as const

export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


export const JsonNullValueInput = {
  JsonNull: JsonNull
} as const

export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


export const NullsOrder = {
  first: 'first',
  last: 'last'
} as const

export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


export const UserOrderByRelevanceFieldEnum = {
  user_id: 'user_id',
  email: 'email',
  password_hash: 'password_hash',
  full_name: 'full_name',
  avatar_url: 'avatar_url'
} as const

export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


export const RoadmapOrderByRelevanceFieldEnum = {
  roadmap_id: 'roadmap_id',
  title: 'title',
  description: 'description',
  category: 'category',
  image_url: 'image_url',
  created_by: 'created_by'
} as const

export type RoadmapOrderByRelevanceFieldEnum = (typeof RoadmapOrderByRelevanceFieldEnum)[keyof typeof RoadmapOrderByRelevanceFieldEnum]


export const ModuleOrderByRelevanceFieldEnum = {
  module_id: 'module_id',
  roadmap_id: 'roadmap_id',
  title: 'title',
  description: 'description',
  content: 'content'
} as const

export type ModuleOrderByRelevanceFieldEnum = (typeof ModuleOrderByRelevanceFieldEnum)[keyof typeof ModuleOrderByRelevanceFieldEnum]


export const UserProgressOrderByRelevanceFieldEnum = {
  progress_id: 'progress_id',
  user_id: 'user_id',
  module_id: 'module_id'
} as const

export type UserProgressOrderByRelevanceFieldEnum = (typeof UserProgressOrderByRelevanceFieldEnum)[keyof typeof UserProgressOrderByRelevanceFieldEnum]


export const JsonNullValueFilter = {
  DbNull: DbNull,
  JsonNull: JsonNull,
  AnyNull: AnyNull
} as const

export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


export const QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
} as const

export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


export const ExerciseOrderByRelevanceFieldEnum = {
  exercise_id: 'exercise_id',
  module_id: 'module_id',
  title: 'title',
  description: 'description',
  starter_code: 'starter_code',
  solution_code: 'solution_code'
} as const

export type ExerciseOrderByRelevanceFieldEnum = (typeof ExerciseOrderByRelevanceFieldEnum)[keyof typeof ExerciseOrderByRelevanceFieldEnum]


export const ExerciseSubmissionOrderByRelevanceFieldEnum = {
  submission_id: 'submission_id',
  exercise_id: 'exercise_id',
  user_id: 'user_id',
  answer_text: 'answer_text'
} as const

export type ExerciseSubmissionOrderByRelevanceFieldEnum = (typeof ExerciseSubmissionOrderByRelevanceFieldEnum)[keyof typeof ExerciseSubmissionOrderByRelevanceFieldEnum]


export const InterviewSessionOrderByRelevanceFieldEnum = {
  session_id: 'session_id',
  user_id: 'user_id',
  session_name: 'session_name'
} as const

export type InterviewSessionOrderByRelevanceFieldEnum = (typeof InterviewSessionOrderByRelevanceFieldEnum)[keyof typeof InterviewSessionOrderByRelevanceFieldEnum]


export const CVOrderByRelevanceFieldEnum = {
  cv_id: 'cv_id',
  user_id: 'user_id',
  cv_name: 'cv_name',
  pdf_url: 'pdf_url'
} as const

export type CVOrderByRelevanceFieldEnum = (typeof CVOrderByRelevanceFieldEnum)[keyof typeof CVOrderByRelevanceFieldEnum]


export const CertificateOrderByRelevanceFieldEnum = {
  certificate_id: 'certificate_id',
  user_id: 'user_id',
  roadmap_id: 'roadmap_id',
  certificate_name: 'certificate_name',
  pdf_url: 'pdf_url'
} as const

export type CertificateOrderByRelevanceFieldEnum = (typeof CertificateOrderByRelevanceFieldEnum)[keyof typeof CertificateOrderByRelevanceFieldEnum]


export const LearningEventOrderByRelevanceFieldEnum = {
  event_id: 'event_id',
  user_id: 'user_id',
  title: 'title',
  description: 'description',
  timezone: 'timezone',
  module_id: 'module_id',
  color: 'color'
} as const

export type LearningEventOrderByRelevanceFieldEnum = (typeof LearningEventOrderByRelevanceFieldEnum)[keyof typeof LearningEventOrderByRelevanceFieldEnum]


export const AINoteOrderByRelevanceFieldEnum = {
  note_id: 'note_id',
  user_id: 'user_id',
  module_id: 'module_id',
  content: 'content'
} as const

export type AINoteOrderByRelevanceFieldEnum = (typeof AINoteOrderByRelevanceFieldEnum)[keyof typeof AINoteOrderByRelevanceFieldEnum]



/**
 * Field references
 */


/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


/**
 * Reference to a field of type 'Level'
 */
export type EnumLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Level'>
    


/**
 * Reference to a field of type 'Role'
 */
export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


/**
 * Reference to a field of type 'Status'
 */
export type EnumStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Status'>
    


/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


/**
 * Reference to a field of type 'Decimal'
 */
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


/**
 * Reference to a field of type 'ProgressStatus'
 */
export type EnumProgressStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProgressStatus'>
    


/**
 * Reference to a field of type 'Json'
 */
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


/**
 * Reference to a field of type 'QueryMode'
 */
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


/**
 * Reference to a field of type 'Difficulty'
 */
export type EnumDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Difficulty'>
    


/**
 * Reference to a field of type 'InterviewType'
 */
export type EnumInterviewTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InterviewType'>
    


/**
 * Reference to a field of type 'TemplateStyle'
 */
export type EnumTemplateStyleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TemplateStyle'>
    


/**
 * Reference to a field of type 'EventStatus'
 */
export type EnumEventStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EventStatus'>
    


/**
 * Reference to a field of type 'Boolean'
 */
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


/**
 * Reference to a field of type 'NoteType'
 */
export type EnumNoteTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NoteType'>
    


/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    

/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
  count: number
}

export const defineExtension = runtime.Extensions.defineExtension as unknown as runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>
export type DefaultPrismaClient = PrismaClient
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
export type PrismaClientOptions = ({
  /**
   * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-pg`.
   */
  adapter: runtime.SqlDriverAdapterFactory
  accelerateUrl?: never
} | {
  /**
   * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
   */
  accelerateUrl: string
  adapter?: never
}) & {
  /**
   * @default "colorless"
   */
  errorFormat?: ErrorFormat
  /**
   * @example
   * ```
   * // Shorthand for `emit: 'stdout'`
   * log: ['query', 'info', 'warn', 'error']
   * 
   * // Emit as events only
   * log: [
   *   { emit: 'event', level: 'query' },
   *   { emit: 'event', level: 'info' },
   *   { emit: 'event', level: 'warn' }
   *   { emit: 'event', level: 'error' }
   * ]
   * 
   * / Emit as events and log to stdout
   * og: [
   *  { emit: 'stdout', level: 'query' },
   *  { emit: 'stdout', level: 'info' },
   *  { emit: 'stdout', level: 'warn' }
   *  { emit: 'stdout', level: 'error' }
   * 
   * ```
   * Read more in our [docs](https://pris.ly/d/logging).
   */
  log?: (LogLevel | LogDefinition)[]
  /**
   * The default values for transactionOptions
   * maxWait ?= 2000
   * timeout ?= 5000
   */
  transactionOptions?: {
    maxWait?: number
    timeout?: number
    isolationLevel?: TransactionIsolationLevel
  }
  /**
   * Global configuration for omitting model fields by default.
   * 
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   omit: {
   *     user: {
   *       password: true
   *     }
   *   }
   * })
   * ```
   */
  omit?: GlobalOmitConfig
  /**
   * SQL commenter plugins that add metadata to SQL queries as comments.
   * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
   * 
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter,
   *   comments: [
   *     traceContext(),
   *     queryInsights(),
   *   ],
   * })
   * ```
   */
  comments?: runtime.SqlCommenterPlugin[]
}
export type GlobalOmitConfig = {
  user?: Prisma.UserOmit
  roadmap?: Prisma.RoadmapOmit
  module?: Prisma.ModuleOmit
  userProgress?: Prisma.UserProgressOmit
  exercise?: Prisma.ExerciseOmit
  exerciseSubmission?: Prisma.ExerciseSubmissionOmit
  interviewSession?: Prisma.InterviewSessionOmit
  cV?: Prisma.CVOmit
  certificate?: Prisma.CertificateOmit
  learningEvent?: Prisma.LearningEventOmit
  aINote?: Prisma.AINoteOmit
}

/* Types for Logging */
export type LogLevel = 'info' | 'query' | 'warn' | 'error'
export type LogDefinition = {
  level: LogLevel
  emit: 'stdout' | 'event'
}

export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

export type GetLogType<T> = CheckIsLogLevel<
  T extends LogDefinition ? T['level'] : T
>;

export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
  ? GetLogType<T[number]>
  : never;

export type QueryEvent = {
  timestamp: Date
  query: string
  params: string
  duration: number
  target: string
}

export type LogEvent = {
  timestamp: Date
  message: string
  target: string
}
/* End Types for Logging */


export type PrismaAction =
  | 'findUnique'
  | 'findUniqueOrThrow'
  | 'findMany'
  | 'findFirst'
  | 'findFirstOrThrow'
  | 'create'
  | 'createMany'
  | 'createManyAndReturn'
  | 'update'
  | 'updateMany'
  | 'updateManyAndReturn'
  | 'upsert'
  | 'delete'
  | 'deleteMany'
  | 'executeRaw'
  | 'queryRaw'
  | 'aggregate'
  | 'count'
  | 'runCommandRaw'
  | 'findRaw'
  | 'groupBy'

/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>


```

## File: src/generated/prisma/internal/prismaNamespaceBrowser.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * WARNING: This is an internal file that is subject to change!
 *
 * 🛑 Under no circumstances should you import this file directly! 🛑
 *
 * All exports from this file are wrapped under a `Prisma` namespace object in the browser.ts file.
 * While this enables partial backward compatibility, it is not part of the stable public API.
 *
 * If you are looking for your Models, Enums, and Input Types, please import them from the respective
 * model files in the `model` directory!
 */

import * as runtime from "@prisma/client/runtime/index-browser"

export type * from '../models'
export type * from './prismaNamespace'

export const Decimal = runtime.Decimal


export const NullTypes = {
  DbNull: runtime.NullTypes.DbNull as (new (secret: never) => typeof runtime.DbNull),
  JsonNull: runtime.NullTypes.JsonNull as (new (secret: never) => typeof runtime.JsonNull),
  AnyNull: runtime.NullTypes.AnyNull as (new (secret: never) => typeof runtime.AnyNull),
}
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export const DbNull = runtime.DbNull

/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export const JsonNull = runtime.JsonNull

/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export const AnyNull = runtime.AnyNull


export const ModelName = {
  User: 'User',
  Roadmap: 'Roadmap',
  Module: 'Module',
  UserProgress: 'UserProgress',
  Exercise: 'Exercise',
  ExerciseSubmission: 'ExerciseSubmission',
  InterviewSession: 'InterviewSession',
  CV: 'CV',
  Certificate: 'Certificate',
  LearningEvent: 'LearningEvent',
  AINote: 'AINote'
} as const

export type ModelName = (typeof ModelName)[keyof typeof ModelName]

/*
 * Enums
 */

export const TransactionIsolationLevel = {
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
} as const

export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


export const UserScalarFieldEnum = {
  user_id: 'user_id',
  email: 'email',
  password_hash: 'password_hash',
  full_name: 'full_name',
  current_level: 'current_level',
  role: 'role',
  avatar_url: 'avatar_url',
  created_at: 'created_at',
  updated_at: 'updated_at'
} as const

export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


export const RoadmapScalarFieldEnum = {
  roadmap_id: 'roadmap_id',
  title: 'title',
  description: 'description',
  category: 'category',
  image_url: 'image_url',
  created_by: 'created_by',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at'
} as const

export type RoadmapScalarFieldEnum = (typeof RoadmapScalarFieldEnum)[keyof typeof RoadmapScalarFieldEnum]


export const ModuleScalarFieldEnum = {
  module_id: 'module_id',
  roadmap_id: 'roadmap_id',
  title: 'title',
  description: 'description',
  content: 'content',
  order_index: 'order_index',
  estimated_hours: 'estimated_hours',
  created_at: 'created_at',
  updated_at: 'updated_at'
} as const

export type ModuleScalarFieldEnum = (typeof ModuleScalarFieldEnum)[keyof typeof ModuleScalarFieldEnum]


export const UserProgressScalarFieldEnum = {
  progress_id: 'progress_id',
  user_id: 'user_id',
  module_id: 'module_id',
  status: 'status',
  completion_percentage: 'completion_percentage',
  started_at: 'started_at',
  completed_at: 'completed_at',
  last_accessed_at: 'last_accessed_at'
} as const

export type UserProgressScalarFieldEnum = (typeof UserProgressScalarFieldEnum)[keyof typeof UserProgressScalarFieldEnum]


export const ExerciseScalarFieldEnum = {
  exercise_id: 'exercise_id',
  module_id: 'module_id',
  title: 'title',
  description: 'description',
  examples: 'examples',
  starter_code: 'starter_code',
  solution_code: 'solution_code',
  difficulty: 'difficulty',
  created_at: 'created_at',
  updated_at: 'updated_at'
} as const

export type ExerciseScalarFieldEnum = (typeof ExerciseScalarFieldEnum)[keyof typeof ExerciseScalarFieldEnum]


export const ExerciseSubmissionScalarFieldEnum = {
  submission_id: 'submission_id',
  exercise_id: 'exercise_id',
  user_id: 'user_id',
  answer_text: 'answer_text',
  submitted_at: 'submitted_at'
} as const

export type ExerciseSubmissionScalarFieldEnum = (typeof ExerciseSubmissionScalarFieldEnum)[keyof typeof ExerciseSubmissionScalarFieldEnum]


export const InterviewSessionScalarFieldEnum = {
  session_id: 'session_id',
  user_id: 'user_id',
  session_name: 'session_name',
  interview_type: 'interview_type',
  questions: 'questions',
  user_answers: 'user_answers',
  ai_feedback: 'ai_feedback',
  score: 'score',
  created_at: 'created_at'
} as const

export type InterviewSessionScalarFieldEnum = (typeof InterviewSessionScalarFieldEnum)[keyof typeof InterviewSessionScalarFieldEnum]


export const CVScalarFieldEnum = {
  cv_id: 'cv_id',
  user_id: 'user_id',
  cv_name: 'cv_name',
  template_style: 'template_style',
  personal_info: 'personal_info',
  education: 'education',
  experience: 'experience',
  skills: 'skills',
  projects: 'projects',
  pdf_url: 'pdf_url',
  created_at: 'created_at',
  updated_at: 'updated_at'
} as const

export type CVScalarFieldEnum = (typeof CVScalarFieldEnum)[keyof typeof CVScalarFieldEnum]


export const CertificateScalarFieldEnum = {
  certificate_id: 'certificate_id',
  user_id: 'user_id',
  roadmap_id: 'roadmap_id',
  certificate_name: 'certificate_name',
  issue_date: 'issue_date',
  pdf_url: 'pdf_url'
} as const

export type CertificateScalarFieldEnum = (typeof CertificateScalarFieldEnum)[keyof typeof CertificateScalarFieldEnum]


export const LearningEventScalarFieldEnum = {
  event_id: 'event_id',
  user_id: 'user_id',
  title: 'title',
  description: 'description',
  status: 'status',
  start_utc: 'start_utc',
  end_utc: 'end_utc',
  all_day: 'all_day',
  timezone: 'timezone',
  module_id: 'module_id',
  color: 'color',
  is_ai_suggested: 'is_ai_suggested',
  reminder_minutes: 'reminder_minutes',
  is_deleted: 'is_deleted',
  created_at: 'created_at',
  updated_at: 'updated_at'
} as const

export type LearningEventScalarFieldEnum = (typeof LearningEventScalarFieldEnum)[keyof typeof LearningEventScalarFieldEnum]


export const AINoteScalarFieldEnum = {
  note_id: 'note_id',
  user_id: 'user_id',
  module_id: 'module_id',
  note_type: 'note_type',
  content: 'content',
  created_at: 'created_at',
  sequence_order: 'sequence_order'
} as const

export type AINoteScalarFieldEnum = (typeof AINoteScalarFieldEnum)[keyof typeof AINoteScalarFieldEnum]


export const SortOrder = {
  asc: 'asc',
  desc: 'desc'
} as const

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


export const NullableJsonNullValueInput = {
  DbNull: 'DbNull',
  JsonNull: 'JsonNull'
} as const

export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


export const JsonNullValueInput = {
  JsonNull: 'JsonNull'
} as const

export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


export const NullsOrder = {
  first: 'first',
  last: 'last'
} as const

export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


export const UserOrderByRelevanceFieldEnum = {
  user_id: 'user_id',
  email: 'email',
  password_hash: 'password_hash',
  full_name: 'full_name',
  avatar_url: 'avatar_url'
} as const

export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


export const RoadmapOrderByRelevanceFieldEnum = {
  roadmap_id: 'roadmap_id',
  title: 'title',
  description: 'description',
  category: 'category',
  image_url: 'image_url',
  created_by: 'created_by'
} as const

export type RoadmapOrderByRelevanceFieldEnum = (typeof RoadmapOrderByRelevanceFieldEnum)[keyof typeof RoadmapOrderByRelevanceFieldEnum]


export const ModuleOrderByRelevanceFieldEnum = {
  module_id: 'module_id',
  roadmap_id: 'roadmap_id',
  title: 'title',
  description: 'description',
  content: 'content'
} as const

export type ModuleOrderByRelevanceFieldEnum = (typeof ModuleOrderByRelevanceFieldEnum)[keyof typeof ModuleOrderByRelevanceFieldEnum]


export const UserProgressOrderByRelevanceFieldEnum = {
  progress_id: 'progress_id',
  user_id: 'user_id',
  module_id: 'module_id'
} as const

export type UserProgressOrderByRelevanceFieldEnum = (typeof UserProgressOrderByRelevanceFieldEnum)[keyof typeof UserProgressOrderByRelevanceFieldEnum]


export const JsonNullValueFilter = {
  DbNull: 'DbNull',
  JsonNull: 'JsonNull',
  AnyNull: 'AnyNull'
} as const

export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


export const QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
} as const

export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


export const ExerciseOrderByRelevanceFieldEnum = {
  exercise_id: 'exercise_id',
  module_id: 'module_id',
  title: 'title',
  description: 'description',
  starter_code: 'starter_code',
  solution_code: 'solution_code'
} as const

export type ExerciseOrderByRelevanceFieldEnum = (typeof ExerciseOrderByRelevanceFieldEnum)[keyof typeof ExerciseOrderByRelevanceFieldEnum]


export const ExerciseSubmissionOrderByRelevanceFieldEnum = {
  submission_id: 'submission_id',
  exercise_id: 'exercise_id',
  user_id: 'user_id',
  answer_text: 'answer_text'
} as const

export type ExerciseSubmissionOrderByRelevanceFieldEnum = (typeof ExerciseSubmissionOrderByRelevanceFieldEnum)[keyof typeof ExerciseSubmissionOrderByRelevanceFieldEnum]


export const InterviewSessionOrderByRelevanceFieldEnum = {
  session_id: 'session_id',
  user_id: 'user_id',
  session_name: 'session_name'
} as const

export type InterviewSessionOrderByRelevanceFieldEnum = (typeof InterviewSessionOrderByRelevanceFieldEnum)[keyof typeof InterviewSessionOrderByRelevanceFieldEnum]


export const CVOrderByRelevanceFieldEnum = {
  cv_id: 'cv_id',
  user_id: 'user_id',
  cv_name: 'cv_name',
  pdf_url: 'pdf_url'
} as const

export type CVOrderByRelevanceFieldEnum = (typeof CVOrderByRelevanceFieldEnum)[keyof typeof CVOrderByRelevanceFieldEnum]


export const CertificateOrderByRelevanceFieldEnum = {
  certificate_id: 'certificate_id',
  user_id: 'user_id',
  roadmap_id: 'roadmap_id',
  certificate_name: 'certificate_name',
  pdf_url: 'pdf_url'
} as const

export type CertificateOrderByRelevanceFieldEnum = (typeof CertificateOrderByRelevanceFieldEnum)[keyof typeof CertificateOrderByRelevanceFieldEnum]


export const LearningEventOrderByRelevanceFieldEnum = {
  event_id: 'event_id',
  user_id: 'user_id',
  title: 'title',
  description: 'description',
  timezone: 'timezone',
  module_id: 'module_id',
  color: 'color'
} as const

export type LearningEventOrderByRelevanceFieldEnum = (typeof LearningEventOrderByRelevanceFieldEnum)[keyof typeof LearningEventOrderByRelevanceFieldEnum]


export const AINoteOrderByRelevanceFieldEnum = {
  note_id: 'note_id',
  user_id: 'user_id',
  module_id: 'module_id',
  content: 'content'
} as const

export type AINoteOrderByRelevanceFieldEnum = (typeof AINoteOrderByRelevanceFieldEnum)[keyof typeof AINoteOrderByRelevanceFieldEnum]


```

## File: src/generated/prisma/models/AINote.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file exports the `AINote` model and its related types.
 *
 * 🟢 You can import this file directly.
 */
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"

/**
 * Model AINote
 * 
 */
export type AINoteModel = runtime.Types.Result.DefaultSelection<Prisma.$AINotePayload>

export type AggregateAINote = {
  _count: AINoteCountAggregateOutputType | null
  _avg: AINoteAvgAggregateOutputType | null
  _sum: AINoteSumAggregateOutputType | null
  _min: AINoteMinAggregateOutputType | null
  _max: AINoteMaxAggregateOutputType | null
}

export type AINoteAvgAggregateOutputType = {
  sequence_order: number | null
}

export type AINoteSumAggregateOutputType = {
  sequence_order: number | null
}

export type AINoteMinAggregateOutputType = {
  note_id: string | null
  user_id: string | null
  module_id: string | null
  note_type: $Enums.NoteType | null
  content: string | null
  created_at: Date | null
  sequence_order: number | null
}

export type AINoteMaxAggregateOutputType = {
  note_id: string | null
  user_id: string | null
  module_id: string | null
  note_type: $Enums.NoteType | null
  content: string | null
  created_at: Date | null
  sequence_order: number | null
}

export type AINoteCountAggregateOutputType = {
  note_id: number
  user_id: number
  module_id: number
  note_type: number
  content: number
  created_at: number
  sequence_order: number
  _all: number
}


export type AINoteAvgAggregateInputType = {
  sequence_order?: true
}

export type AINoteSumAggregateInputType = {
  sequence_order?: true
}

export type AINoteMinAggregateInputType = {
  note_id?: true
  user_id?: true
  module_id?: true
  note_type?: true
  content?: true
  created_at?: true
  sequence_order?: true
}

export type AINoteMaxAggregateInputType = {
  note_id?: true
  user_id?: true
  module_id?: true
  note_type?: true
  content?: true
  created_at?: true
  sequence_order?: true
}

export type AINoteCountAggregateInputType = {
  note_id?: true
  user_id?: true
  module_id?: true
  note_type?: true
  content?: true
  created_at?: true
  sequence_order?: true
  _all?: true
}

export type AINoteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which AINote to aggregate.
   */
  where?: Prisma.AINoteWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of AINotes to fetch.
   */
  orderBy?: Prisma.AINoteOrderByWithRelationInput | Prisma.AINoteOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the start position
   */
  cursor?: Prisma.AINoteWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` AINotes from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` AINotes.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Count returned AINotes
  **/
  _count?: true | AINoteCountAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to average
  **/
  _avg?: AINoteAvgAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to sum
  **/
  _sum?: AINoteSumAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the minimum value
  **/
  _min?: AINoteMinAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the maximum value
  **/
  _max?: AINoteMaxAggregateInputType
}

export type GetAINoteAggregateType<T extends AINoteAggregateArgs> = {
      [P in keyof T & keyof AggregateAINote]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateAINote[P]>
    : Prisma.GetScalarType<T[P], AggregateAINote[P]>
}




export type AINoteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.AINoteWhereInput
  orderBy?: Prisma.AINoteOrderByWithAggregationInput | Prisma.AINoteOrderByWithAggregationInput[]
  by: Prisma.AINoteScalarFieldEnum[] | Prisma.AINoteScalarFieldEnum
  having?: Prisma.AINoteScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: AINoteCountAggregateInputType | true
  _avg?: AINoteAvgAggregateInputType
  _sum?: AINoteSumAggregateInputType
  _min?: AINoteMinAggregateInputType
  _max?: AINoteMaxAggregateInputType
}

export type AINoteGroupByOutputType = {
  note_id: string
  user_id: string
  module_id: string
  note_type: $Enums.NoteType
  content: string
  created_at: Date
  sequence_order: number
  _count: AINoteCountAggregateOutputType | null
  _avg: AINoteAvgAggregateOutputType | null
  _sum: AINoteSumAggregateOutputType | null
  _min: AINoteMinAggregateOutputType | null
  _max: AINoteMaxAggregateOutputType | null
}

type GetAINoteGroupByPayload<T extends AINoteGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<AINoteGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof AINoteGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], AINoteGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], AINoteGroupByOutputType[P]>
      }
    >
  >



export type AINoteWhereInput = {
  AND?: Prisma.AINoteWhereInput | Prisma.AINoteWhereInput[]
  OR?: Prisma.AINoteWhereInput[]
  NOT?: Prisma.AINoteWhereInput | Prisma.AINoteWhereInput[]
  note_id?: Prisma.StringFilter<"AINote"> | string
  user_id?: Prisma.StringFilter<"AINote"> | string
  module_id?: Prisma.StringFilter<"AINote"> | string
  note_type?: Prisma.EnumNoteTypeFilter<"AINote"> | $Enums.NoteType
  content?: Prisma.StringFilter<"AINote"> | string
  created_at?: Prisma.DateTimeFilter<"AINote"> | Date | string
  sequence_order?: Prisma.IntFilter<"AINote"> | number
  module?: Prisma.XOR<Prisma.ModuleScalarRelationFilter, Prisma.ModuleWhereInput>
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}

export type AINoteOrderByWithRelationInput = {
  note_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  note_type?: Prisma.SortOrder
  content?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  sequence_order?: Prisma.SortOrder
  module?: Prisma.ModuleOrderByWithRelationInput
  user?: Prisma.UserOrderByWithRelationInput
  _relevance?: Prisma.AINoteOrderByRelevanceInput
}

export type AINoteWhereUniqueInput = Prisma.AtLeast<{
  note_id?: string
  AND?: Prisma.AINoteWhereInput | Prisma.AINoteWhereInput[]
  OR?: Prisma.AINoteWhereInput[]
  NOT?: Prisma.AINoteWhereInput | Prisma.AINoteWhereInput[]
  user_id?: Prisma.StringFilter<"AINote"> | string
  module_id?: Prisma.StringFilter<"AINote"> | string
  note_type?: Prisma.EnumNoteTypeFilter<"AINote"> | $Enums.NoteType
  content?: Prisma.StringFilter<"AINote"> | string
  created_at?: Prisma.DateTimeFilter<"AINote"> | Date | string
  sequence_order?: Prisma.IntFilter<"AINote"> | number
  module?: Prisma.XOR<Prisma.ModuleScalarRelationFilter, Prisma.ModuleWhereInput>
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}, "note_id">

export type AINoteOrderByWithAggregationInput = {
  note_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  note_type?: Prisma.SortOrder
  content?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  sequence_order?: Prisma.SortOrder
  _count?: Prisma.AINoteCountOrderByAggregateInput
  _avg?: Prisma.AINoteAvgOrderByAggregateInput
  _max?: Prisma.AINoteMaxOrderByAggregateInput
  _min?: Prisma.AINoteMinOrderByAggregateInput
  _sum?: Prisma.AINoteSumOrderByAggregateInput
}

export type AINoteScalarWhereWithAggregatesInput = {
  AND?: Prisma.AINoteScalarWhereWithAggregatesInput | Prisma.AINoteScalarWhereWithAggregatesInput[]
  OR?: Prisma.AINoteScalarWhereWithAggregatesInput[]
  NOT?: Prisma.AINoteScalarWhereWithAggregatesInput | Prisma.AINoteScalarWhereWithAggregatesInput[]
  note_id?: Prisma.StringWithAggregatesFilter<"AINote"> | string
  user_id?: Prisma.StringWithAggregatesFilter<"AINote"> | string
  module_id?: Prisma.StringWithAggregatesFilter<"AINote"> | string
  note_type?: Prisma.EnumNoteTypeWithAggregatesFilter<"AINote"> | $Enums.NoteType
  content?: Prisma.StringWithAggregatesFilter<"AINote"> | string
  created_at?: Prisma.DateTimeWithAggregatesFilter<"AINote"> | Date | string
  sequence_order?: Prisma.IntWithAggregatesFilter<"AINote"> | number
}

export type AINoteCreateInput = {
  note_id?: string
  note_type: $Enums.NoteType
  content: string
  created_at?: Date | string
  sequence_order: number
  module: Prisma.ModuleCreateNestedOneWithoutAiNotesInput
  user: Prisma.UserCreateNestedOneWithoutAiNotesInput
}

export type AINoteUncheckedCreateInput = {
  note_id?: string
  user_id: string
  module_id: string
  note_type: $Enums.NoteType
  content: string
  created_at?: Date | string
  sequence_order: number
}

export type AINoteUpdateInput = {
  note_id?: Prisma.StringFieldUpdateOperationsInput | string
  note_type?: Prisma.EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
  content?: Prisma.StringFieldUpdateOperationsInput | string
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  sequence_order?: Prisma.IntFieldUpdateOperationsInput | number
  module?: Prisma.ModuleUpdateOneRequiredWithoutAiNotesNestedInput
  user?: Prisma.UserUpdateOneRequiredWithoutAiNotesNestedInput
}

export type AINoteUncheckedUpdateInput = {
  note_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  note_type?: Prisma.EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
  content?: Prisma.StringFieldUpdateOperationsInput | string
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  sequence_order?: Prisma.IntFieldUpdateOperationsInput | number
}

export type AINoteCreateManyInput = {
  note_id?: string
  user_id: string
  module_id: string
  note_type: $Enums.NoteType
  content: string
  created_at?: Date | string
  sequence_order: number
}

export type AINoteUpdateManyMutationInput = {
  note_id?: Prisma.StringFieldUpdateOperationsInput | string
  note_type?: Prisma.EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
  content?: Prisma.StringFieldUpdateOperationsInput | string
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  sequence_order?: Prisma.IntFieldUpdateOperationsInput | number
}

export type AINoteUncheckedUpdateManyInput = {
  note_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  note_type?: Prisma.EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
  content?: Prisma.StringFieldUpdateOperationsInput | string
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  sequence_order?: Prisma.IntFieldUpdateOperationsInput | number
}

export type AINoteListRelationFilter = {
  every?: Prisma.AINoteWhereInput
  some?: Prisma.AINoteWhereInput
  none?: Prisma.AINoteWhereInput
}

export type AINoteOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type AINoteOrderByRelevanceInput = {
  fields: Prisma.AINoteOrderByRelevanceFieldEnum | Prisma.AINoteOrderByRelevanceFieldEnum[]
  sort: Prisma.SortOrder
  search: string
}

export type AINoteCountOrderByAggregateInput = {
  note_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  note_type?: Prisma.SortOrder
  content?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  sequence_order?: Prisma.SortOrder
}

export type AINoteAvgOrderByAggregateInput = {
  sequence_order?: Prisma.SortOrder
}

export type AINoteMaxOrderByAggregateInput = {
  note_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  note_type?: Prisma.SortOrder
  content?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  sequence_order?: Prisma.SortOrder
}

export type AINoteMinOrderByAggregateInput = {
  note_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  note_type?: Prisma.SortOrder
  content?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  sequence_order?: Prisma.SortOrder
}

export type AINoteSumOrderByAggregateInput = {
  sequence_order?: Prisma.SortOrder
}

export type AINoteCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.AINoteCreateWithoutUserInput, Prisma.AINoteUncheckedCreateWithoutUserInput> | Prisma.AINoteCreateWithoutUserInput[] | Prisma.AINoteUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.AINoteCreateOrConnectWithoutUserInput | Prisma.AINoteCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.AINoteCreateManyUserInputEnvelope
  connect?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
}

export type AINoteUncheckedCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.AINoteCreateWithoutUserInput, Prisma.AINoteUncheckedCreateWithoutUserInput> | Prisma.AINoteCreateWithoutUserInput[] | Prisma.AINoteUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.AINoteCreateOrConnectWithoutUserInput | Prisma.AINoteCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.AINoteCreateManyUserInputEnvelope
  connect?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
}

export type AINoteUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.AINoteCreateWithoutUserInput, Prisma.AINoteUncheckedCreateWithoutUserInput> | Prisma.AINoteCreateWithoutUserInput[] | Prisma.AINoteUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.AINoteCreateOrConnectWithoutUserInput | Prisma.AINoteCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.AINoteUpsertWithWhereUniqueWithoutUserInput | Prisma.AINoteUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.AINoteCreateManyUserInputEnvelope
  set?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  disconnect?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  delete?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  connect?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  update?: Prisma.AINoteUpdateWithWhereUniqueWithoutUserInput | Prisma.AINoteUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.AINoteUpdateManyWithWhereWithoutUserInput | Prisma.AINoteUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.AINoteScalarWhereInput | Prisma.AINoteScalarWhereInput[]
}

export type AINoteUncheckedUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.AINoteCreateWithoutUserInput, Prisma.AINoteUncheckedCreateWithoutUserInput> | Prisma.AINoteCreateWithoutUserInput[] | Prisma.AINoteUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.AINoteCreateOrConnectWithoutUserInput | Prisma.AINoteCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.AINoteUpsertWithWhereUniqueWithoutUserInput | Prisma.AINoteUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.AINoteCreateManyUserInputEnvelope
  set?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  disconnect?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  delete?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  connect?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  update?: Prisma.AINoteUpdateWithWhereUniqueWithoutUserInput | Prisma.AINoteUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.AINoteUpdateManyWithWhereWithoutUserInput | Prisma.AINoteUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.AINoteScalarWhereInput | Prisma.AINoteScalarWhereInput[]
}

export type AINoteCreateNestedManyWithoutModuleInput = {
  create?: Prisma.XOR<Prisma.AINoteCreateWithoutModuleInput, Prisma.AINoteUncheckedCreateWithoutModuleInput> | Prisma.AINoteCreateWithoutModuleInput[] | Prisma.AINoteUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.AINoteCreateOrConnectWithoutModuleInput | Prisma.AINoteCreateOrConnectWithoutModuleInput[]
  createMany?: Prisma.AINoteCreateManyModuleInputEnvelope
  connect?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
}

export type AINoteUncheckedCreateNestedManyWithoutModuleInput = {
  create?: Prisma.XOR<Prisma.AINoteCreateWithoutModuleInput, Prisma.AINoteUncheckedCreateWithoutModuleInput> | Prisma.AINoteCreateWithoutModuleInput[] | Prisma.AINoteUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.AINoteCreateOrConnectWithoutModuleInput | Prisma.AINoteCreateOrConnectWithoutModuleInput[]
  createMany?: Prisma.AINoteCreateManyModuleInputEnvelope
  connect?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
}

export type AINoteUpdateManyWithoutModuleNestedInput = {
  create?: Prisma.XOR<Prisma.AINoteCreateWithoutModuleInput, Prisma.AINoteUncheckedCreateWithoutModuleInput> | Prisma.AINoteCreateWithoutModuleInput[] | Prisma.AINoteUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.AINoteCreateOrConnectWithoutModuleInput | Prisma.AINoteCreateOrConnectWithoutModuleInput[]
  upsert?: Prisma.AINoteUpsertWithWhereUniqueWithoutModuleInput | Prisma.AINoteUpsertWithWhereUniqueWithoutModuleInput[]
  createMany?: Prisma.AINoteCreateManyModuleInputEnvelope
  set?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  disconnect?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  delete?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  connect?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  update?: Prisma.AINoteUpdateWithWhereUniqueWithoutModuleInput | Prisma.AINoteUpdateWithWhereUniqueWithoutModuleInput[]
  updateMany?: Prisma.AINoteUpdateManyWithWhereWithoutModuleInput | Prisma.AINoteUpdateManyWithWhereWithoutModuleInput[]
  deleteMany?: Prisma.AINoteScalarWhereInput | Prisma.AINoteScalarWhereInput[]
}

export type AINoteUncheckedUpdateManyWithoutModuleNestedInput = {
  create?: Prisma.XOR<Prisma.AINoteCreateWithoutModuleInput, Prisma.AINoteUncheckedCreateWithoutModuleInput> | Prisma.AINoteCreateWithoutModuleInput[] | Prisma.AINoteUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.AINoteCreateOrConnectWithoutModuleInput | Prisma.AINoteCreateOrConnectWithoutModuleInput[]
  upsert?: Prisma.AINoteUpsertWithWhereUniqueWithoutModuleInput | Prisma.AINoteUpsertWithWhereUniqueWithoutModuleInput[]
  createMany?: Prisma.AINoteCreateManyModuleInputEnvelope
  set?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  disconnect?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  delete?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  connect?: Prisma.AINoteWhereUniqueInput | Prisma.AINoteWhereUniqueInput[]
  update?: Prisma.AINoteUpdateWithWhereUniqueWithoutModuleInput | Prisma.AINoteUpdateWithWhereUniqueWithoutModuleInput[]
  updateMany?: Prisma.AINoteUpdateManyWithWhereWithoutModuleInput | Prisma.AINoteUpdateManyWithWhereWithoutModuleInput[]
  deleteMany?: Prisma.AINoteScalarWhereInput | Prisma.AINoteScalarWhereInput[]
}

export type EnumNoteTypeFieldUpdateOperationsInput = {
  set?: $Enums.NoteType
}

export type AINoteCreateWithoutUserInput = {
  note_id?: string
  note_type: $Enums.NoteType
  content: string
  created_at?: Date | string
  sequence_order: number
  module: Prisma.ModuleCreateNestedOneWithoutAiNotesInput
}

export type AINoteUncheckedCreateWithoutUserInput = {
  note_id?: string
  module_id: string
  note_type: $Enums.NoteType
  content: string
  created_at?: Date | string
  sequence_order: number
}

export type AINoteCreateOrConnectWithoutUserInput = {
  where: Prisma.AINoteWhereUniqueInput
  create: Prisma.XOR<Prisma.AINoteCreateWithoutUserInput, Prisma.AINoteUncheckedCreateWithoutUserInput>
}

export type AINoteCreateManyUserInputEnvelope = {
  data: Prisma.AINoteCreateManyUserInput | Prisma.AINoteCreateManyUserInput[]
  skipDuplicates?: boolean
}

export type AINoteUpsertWithWhereUniqueWithoutUserInput = {
  where: Prisma.AINoteWhereUniqueInput
  update: Prisma.XOR<Prisma.AINoteUpdateWithoutUserInput, Prisma.AINoteUncheckedUpdateWithoutUserInput>
  create: Prisma.XOR<Prisma.AINoteCreateWithoutUserInput, Prisma.AINoteUncheckedCreateWithoutUserInput>
}

export type AINoteUpdateWithWhereUniqueWithoutUserInput = {
  where: Prisma.AINoteWhereUniqueInput
  data: Prisma.XOR<Prisma.AINoteUpdateWithoutUserInput, Prisma.AINoteUncheckedUpdateWithoutUserInput>
}

export type AINoteUpdateManyWithWhereWithoutUserInput = {
  where: Prisma.AINoteScalarWhereInput
  data: Prisma.XOR<Prisma.AINoteUpdateManyMutationInput, Prisma.AINoteUncheckedUpdateManyWithoutUserInput>
}

export type AINoteScalarWhereInput = {
  AND?: Prisma.AINoteScalarWhereInput | Prisma.AINoteScalarWhereInput[]
  OR?: Prisma.AINoteScalarWhereInput[]
  NOT?: Prisma.AINoteScalarWhereInput | Prisma.AINoteScalarWhereInput[]
  note_id?: Prisma.StringFilter<"AINote"> | string
  user_id?: Prisma.StringFilter<"AINote"> | string
  module_id?: Prisma.StringFilter<"AINote"> | string
  note_type?: Prisma.EnumNoteTypeFilter<"AINote"> | $Enums.NoteType
  content?: Prisma.StringFilter<"AINote"> | string
  created_at?: Prisma.DateTimeFilter<"AINote"> | Date | string
  sequence_order?: Prisma.IntFilter<"AINote"> | number
}

export type AINoteCreateWithoutModuleInput = {
  note_id?: string
  note_type: $Enums.NoteType
  content: string
  created_at?: Date | string
  sequence_order: number
  user: Prisma.UserCreateNestedOneWithoutAiNotesInput
}

export type AINoteUncheckedCreateWithoutModuleInput = {
  note_id?: string
  user_id: string
  note_type: $Enums.NoteType
  content: string
  created_at?: Date | string
  sequence_order: number
}

export type AINoteCreateOrConnectWithoutModuleInput = {
  where: Prisma.AINoteWhereUniqueInput
  create: Prisma.XOR<Prisma.AINoteCreateWithoutModuleInput, Prisma.AINoteUncheckedCreateWithoutModuleInput>
}

export type AINoteCreateManyModuleInputEnvelope = {
  data: Prisma.AINoteCreateManyModuleInput | Prisma.AINoteCreateManyModuleInput[]
  skipDuplicates?: boolean
}

export type AINoteUpsertWithWhereUniqueWithoutModuleInput = {
  where: Prisma.AINoteWhereUniqueInput
  update: Prisma.XOR<Prisma.AINoteUpdateWithoutModuleInput, Prisma.AINoteUncheckedUpdateWithoutModuleInput>
  create: Prisma.XOR<Prisma.AINoteCreateWithoutModuleInput, Prisma.AINoteUncheckedCreateWithoutModuleInput>
}

export type AINoteUpdateWithWhereUniqueWithoutModuleInput = {
  where: Prisma.AINoteWhereUniqueInput
  data: Prisma.XOR<Prisma.AINoteUpdateWithoutModuleInput, Prisma.AINoteUncheckedUpdateWithoutModuleInput>
}

export type AINoteUpdateManyWithWhereWithoutModuleInput = {
  where: Prisma.AINoteScalarWhereInput
  data: Prisma.XOR<Prisma.AINoteUpdateManyMutationInput, Prisma.AINoteUncheckedUpdateManyWithoutModuleInput>
}

export type AINoteCreateManyUserInput = {
  note_id?: string
  module_id: string
  note_type: $Enums.NoteType
  content: string
  created_at?: Date | string
  sequence_order: number
}

export type AINoteUpdateWithoutUserInput = {
  note_id?: Prisma.StringFieldUpdateOperationsInput | string
  note_type?: Prisma.EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
  content?: Prisma.StringFieldUpdateOperationsInput | string
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  sequence_order?: Prisma.IntFieldUpdateOperationsInput | number
  module?: Prisma.ModuleUpdateOneRequiredWithoutAiNotesNestedInput
}

export type AINoteUncheckedUpdateWithoutUserInput = {
  note_id?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  note_type?: Prisma.EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
  content?: Prisma.StringFieldUpdateOperationsInput | string
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  sequence_order?: Prisma.IntFieldUpdateOperationsInput | number
}

export type AINoteUncheckedUpdateManyWithoutUserInput = {
  note_id?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  note_type?: Prisma.EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
  content?: Prisma.StringFieldUpdateOperationsInput | string
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  sequence_order?: Prisma.IntFieldUpdateOperationsInput | number
}

export type AINoteCreateManyModuleInput = {
  note_id?: string
  user_id: string
  note_type: $Enums.NoteType
  content: string
  created_at?: Date | string
  sequence_order: number
}

export type AINoteUpdateWithoutModuleInput = {
  note_id?: Prisma.StringFieldUpdateOperationsInput | string
  note_type?: Prisma.EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
  content?: Prisma.StringFieldUpdateOperationsInput | string
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  sequence_order?: Prisma.IntFieldUpdateOperationsInput | number
  user?: Prisma.UserUpdateOneRequiredWithoutAiNotesNestedInput
}

export type AINoteUncheckedUpdateWithoutModuleInput = {
  note_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  note_type?: Prisma.EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
  content?: Prisma.StringFieldUpdateOperationsInput | string
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  sequence_order?: Prisma.IntFieldUpdateOperationsInput | number
}

export type AINoteUncheckedUpdateManyWithoutModuleInput = {
  note_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  note_type?: Prisma.EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
  content?: Prisma.StringFieldUpdateOperationsInput | string
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  sequence_order?: Prisma.IntFieldUpdateOperationsInput | number
}



export type AINoteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  note_id?: boolean
  user_id?: boolean
  module_id?: boolean
  note_type?: boolean
  content?: boolean
  created_at?: boolean
  sequence_order?: boolean
  module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}, ExtArgs["result"]["aINote"]>



export type AINoteSelectScalar = {
  note_id?: boolean
  user_id?: boolean
  module_id?: boolean
  note_type?: boolean
  content?: boolean
  created_at?: boolean
  sequence_order?: boolean
}

export type AINoteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"note_id" | "user_id" | "module_id" | "note_type" | "content" | "created_at" | "sequence_order", ExtArgs["result"]["aINote"]>
export type AINoteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}

export type $AINotePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "AINote"
  objects: {
    module: Prisma.$ModulePayload<ExtArgs>
    user: Prisma.$UserPayload<ExtArgs>
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    note_id: string
    user_id: string
    module_id: string
    note_type: $Enums.NoteType
    content: string
    created_at: Date
    sequence_order: number
  }, ExtArgs["result"]["aINote"]>
  composites: {}
}

export type AINoteGetPayload<S extends boolean | null | undefined | AINoteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AINotePayload, S>

export type AINoteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<AINoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AINoteCountAggregateInputType | true
  }

export interface AINoteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AINote'], meta: { name: 'AINote' } }
  /**
   * Find zero or one AINote that matches the filter.
   * @param {AINoteFindUniqueArgs} args - Arguments to find a AINote
   * @example
   * // Get one AINote
   * const aINote = await prisma.aINote.findUnique({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUnique<T extends AINoteFindUniqueArgs>(args: Prisma.SelectSubset<T, AINoteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AINoteClient<runtime.Types.Result.GetResult<Prisma.$AINotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find one AINote that matches the filter or throw an error with `error.code='P2025'`
   * if no matches were found.
   * @param {AINoteFindUniqueOrThrowArgs} args - Arguments to find a AINote
   * @example
   * // Get one AINote
   * const aINote = await prisma.aINote.findUniqueOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUniqueOrThrow<T extends AINoteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AINoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AINoteClient<runtime.Types.Result.GetResult<Prisma.$AINotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first AINote that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {AINoteFindFirstArgs} args - Arguments to find a AINote
   * @example
   * // Get one AINote
   * const aINote = await prisma.aINote.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends AINoteFindFirstArgs>(args?: Prisma.SelectSubset<T, AINoteFindFirstArgs<ExtArgs>>): Prisma.Prisma__AINoteClient<runtime.Types.Result.GetResult<Prisma.$AINotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first AINote that matches the filter or
   * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {AINoteFindFirstOrThrowArgs} args - Arguments to find a AINote
   * @example
   * // Get one AINote
   * const aINote = await prisma.aINote.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends AINoteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AINoteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AINoteClient<runtime.Types.Result.GetResult<Prisma.$AINotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find zero or more AINotes that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {AINoteFindManyArgs} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all AINotes
   * const aINotes = await prisma.aINote.findMany()
   * 
   * // Get first 10 AINotes
   * const aINotes = await prisma.aINote.findMany({ take: 10 })
   * 
   * // Only select the `note_id`
   * const aINoteWithNote_idOnly = await prisma.aINote.findMany({ select: { note_id: true } })
   * 
   */
  findMany<T extends AINoteFindManyArgs>(args?: Prisma.SelectSubset<T, AINoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AINotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  /**
   * Create a AINote.
   * @param {AINoteCreateArgs} args - Arguments to create a AINote.
   * @example
   * // Create one AINote
   * const AINote = await prisma.aINote.create({
   *   data: {
   *     // ... data to create a AINote
   *   }
   * })
   * 
   */
  create<T extends AINoteCreateArgs>(args: Prisma.SelectSubset<T, AINoteCreateArgs<ExtArgs>>): Prisma.Prisma__AINoteClient<runtime.Types.Result.GetResult<Prisma.$AINotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Create many AINotes.
   * @param {AINoteCreateManyArgs} args - Arguments to create many AINotes.
   * @example
   * // Create many AINotes
   * const aINote = await prisma.aINote.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   *     
   */
  createMany<T extends AINoteCreateManyArgs>(args?: Prisma.SelectSubset<T, AINoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Delete a AINote.
   * @param {AINoteDeleteArgs} args - Arguments to delete one AINote.
   * @example
   * // Delete one AINote
   * const AINote = await prisma.aINote.delete({
   *   where: {
   *     // ... filter to delete one AINote
   *   }
   * })
   * 
   */
  delete<T extends AINoteDeleteArgs>(args: Prisma.SelectSubset<T, AINoteDeleteArgs<ExtArgs>>): Prisma.Prisma__AINoteClient<runtime.Types.Result.GetResult<Prisma.$AINotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Update one AINote.
   * @param {AINoteUpdateArgs} args - Arguments to update one AINote.
   * @example
   * // Update one AINote
   * const aINote = await prisma.aINote.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends AINoteUpdateArgs>(args: Prisma.SelectSubset<T, AINoteUpdateArgs<ExtArgs>>): Prisma.Prisma__AINoteClient<runtime.Types.Result.GetResult<Prisma.$AINotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Delete zero or more AINotes.
   * @param {AINoteDeleteManyArgs} args - Arguments to filter AINotes to delete.
   * @example
   * // Delete a few AINotes
   * const { count } = await prisma.aINote.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany<T extends AINoteDeleteManyArgs>(args?: Prisma.SelectSubset<T, AINoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Update zero or more AINotes.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {AINoteUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many AINotes
   * const aINote = await prisma.aINote.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany<T extends AINoteUpdateManyArgs>(args: Prisma.SelectSubset<T, AINoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Create or update one AINote.
   * @param {AINoteUpsertArgs} args - Arguments to update or create a AINote.
   * @example
   * // Update or create a AINote
   * const aINote = await prisma.aINote.upsert({
   *   create: {
   *     // ... data to create a AINote
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the AINote we want to update
   *   }
   * })
   */
  upsert<T extends AINoteUpsertArgs>(args: Prisma.SelectSubset<T, AINoteUpsertArgs<ExtArgs>>): Prisma.Prisma__AINoteClient<runtime.Types.Result.GetResult<Prisma.$AINotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


  /**
   * Count the number of AINotes.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {AINoteCountArgs} args - Arguments to filter AINotes to count.
   * @example
   * // Count the number of AINotes
   * const count = await prisma.aINote.count({
   *   where: {
   *     // ... the filter for the AINotes we want to count
   *   }
   * })
  **/
  count<T extends AINoteCountArgs>(
    args?: Prisma.Subset<T, AINoteCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], AINoteCountAggregateOutputType>
      : number
  >

  /**
   * Allows you to perform aggregations operations on a AINote.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {AINoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Ordered by age ascending
   * // Where email contains prisma.io
   * // Limited to the 10 users
   * const aggregations = await prisma.user.aggregate({
   *   _avg: {
   *     age: true,
   *   },
   *   where: {
   *     email: {
   *       contains: "prisma.io",
   *     },
   *   },
   *   orderBy: {
   *     age: "asc",
   *   },
   *   take: 10,
   * })
  **/
  aggregate<T extends AINoteAggregateArgs>(args: Prisma.Subset<T, AINoteAggregateArgs>): Prisma.PrismaPromise<GetAINoteAggregateType<T>>

  /**
   * Group by AINote.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {AINoteGroupByArgs} args - Group by arguments.
   * @example
   * // Group by city, order by createdAt, get count
   * const result = await prisma.user.groupBy({
   *   by: ['city', 'createdAt'],
   *   orderBy: {
   *     createdAt: true
   *   },
   *   _count: {
   *     _all: true
   *   },
   * })
   * 
  **/
  groupBy<
    T extends AINoteGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: AINoteGroupByArgs['orderBy'] }
      : { orderBy?: AINoteGroupByArgs['orderBy'] },
    OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>,
    ByFields extends Prisma.MaybeTupleToUnion<T['by']>,
    ByValid extends Prisma.Has<ByFields, OrderFields>,
    HavingFields extends Prisma.GetHavingFields<T['having']>,
    HavingValid extends Prisma.Has<ByFields, HavingFields>,
    ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False,
    InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
          ? never
          : P extends string
          ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
          : [
              Error,
              'Field ',
              P,
              ` in "having" needs to be provided in "by"`,
            ]
      }[HavingFields]
    : 'take' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
          ? never
          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
      }[OrderFields]
  >(args: Prisma.SubsetIntersection<T, AINoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAINoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
/**
 * Fields of the AINote model
 */
readonly fields: AINoteFieldRefs;
}

/**
 * The delegate class that acts as a "Promise-like" for AINote.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__AINoteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  module<T extends Prisma.ModuleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ModuleDefaultArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}




/**
 * Fields of the AINote model
 */
export interface AINoteFieldRefs {
  readonly note_id: Prisma.FieldRef<"AINote", 'String'>
  readonly user_id: Prisma.FieldRef<"AINote", 'String'>
  readonly module_id: Prisma.FieldRef<"AINote", 'String'>
  readonly note_type: Prisma.FieldRef<"AINote", 'NoteType'>
  readonly content: Prisma.FieldRef<"AINote", 'String'>
  readonly created_at: Prisma.FieldRef<"AINote", 'DateTime'>
  readonly sequence_order: Prisma.FieldRef<"AINote", 'Int'>
}
    

// Custom InputTypes
/**
 * AINote findUnique
 */
export type AINoteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the AINote
   */
  select?: Prisma.AINoteSelect<ExtArgs> | null
  /**
   * Omit specific fields from the AINote
   */
  omit?: Prisma.AINoteOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.AINoteInclude<ExtArgs> | null
  /**
   * Filter, which AINote to fetch.
   */
  where: Prisma.AINoteWhereUniqueInput
}

/**
 * AINote findUniqueOrThrow
 */
export type AINoteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the AINote
   */
  select?: Prisma.AINoteSelect<ExtArgs> | null
  /**
   * Omit specific fields from the AINote
   */
  omit?: Prisma.AINoteOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.AINoteInclude<ExtArgs> | null
  /**
   * Filter, which AINote to fetch.
   */
  where: Prisma.AINoteWhereUniqueInput
}

/**
 * AINote findFirst
 */
export type AINoteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the AINote
   */
  select?: Prisma.AINoteSelect<ExtArgs> | null
  /**
   * Omit specific fields from the AINote
   */
  omit?: Prisma.AINoteOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.AINoteInclude<ExtArgs> | null
  /**
   * Filter, which AINote to fetch.
   */
  where?: Prisma.AINoteWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of AINotes to fetch.
   */
  orderBy?: Prisma.AINoteOrderByWithRelationInput | Prisma.AINoteOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for AINotes.
   */
  cursor?: Prisma.AINoteWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` AINotes from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` AINotes.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of AINotes.
   */
  distinct?: Prisma.AINoteScalarFieldEnum | Prisma.AINoteScalarFieldEnum[]
}

/**
 * AINote findFirstOrThrow
 */
export type AINoteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the AINote
   */
  select?: Prisma.AINoteSelect<ExtArgs> | null
  /**
   * Omit specific fields from the AINote
   */
  omit?: Prisma.AINoteOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.AINoteInclude<ExtArgs> | null
  /**
   * Filter, which AINote to fetch.
   */
  where?: Prisma.AINoteWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of AINotes to fetch.
   */
  orderBy?: Prisma.AINoteOrderByWithRelationInput | Prisma.AINoteOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for AINotes.
   */
  cursor?: Prisma.AINoteWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` AINotes from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` AINotes.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of AINotes.
   */
  distinct?: Prisma.AINoteScalarFieldEnum | Prisma.AINoteScalarFieldEnum[]
}

/**
 * AINote findMany
 */
export type AINoteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the AINote
   */
  select?: Prisma.AINoteSelect<ExtArgs> | null
  /**
   * Omit specific fields from the AINote
   */
  omit?: Prisma.AINoteOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.AINoteInclude<ExtArgs> | null
  /**
   * Filter, which AINotes to fetch.
   */
  where?: Prisma.AINoteWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of AINotes to fetch.
   */
  orderBy?: Prisma.AINoteOrderByWithRelationInput | Prisma.AINoteOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for listing AINotes.
   */
  cursor?: Prisma.AINoteWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` AINotes from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` AINotes.
   */
  skip?: number
  distinct?: Prisma.AINoteScalarFieldEnum | Prisma.AINoteScalarFieldEnum[]
}

/**
 * AINote create
 */
export type AINoteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the AINote
   */
  select?: Prisma.AINoteSelect<ExtArgs> | null
  /**
   * Omit specific fields from the AINote
   */
  omit?: Prisma.AINoteOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.AINoteInclude<ExtArgs> | null
  /**
   * The data needed to create a AINote.
   */
  data: Prisma.XOR<Prisma.AINoteCreateInput, Prisma.AINoteUncheckedCreateInput>
}

/**
 * AINote createMany
 */
export type AINoteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to create many AINotes.
   */
  data: Prisma.AINoteCreateManyInput | Prisma.AINoteCreateManyInput[]
  skipDuplicates?: boolean
}

/**
 * AINote update
 */
export type AINoteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the AINote
   */
  select?: Prisma.AINoteSelect<ExtArgs> | null
  /**
   * Omit specific fields from the AINote
   */
  omit?: Prisma.AINoteOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.AINoteInclude<ExtArgs> | null
  /**
   * The data needed to update a AINote.
   */
  data: Prisma.XOR<Prisma.AINoteUpdateInput, Prisma.AINoteUncheckedUpdateInput>
  /**
   * Choose, which AINote to update.
   */
  where: Prisma.AINoteWhereUniqueInput
}

/**
 * AINote updateMany
 */
export type AINoteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to update AINotes.
   */
  data: Prisma.XOR<Prisma.AINoteUpdateManyMutationInput, Prisma.AINoteUncheckedUpdateManyInput>
  /**
   * Filter which AINotes to update
   */
  where?: Prisma.AINoteWhereInput
  /**
   * Limit how many AINotes to update.
   */
  limit?: number
}

/**
 * AINote upsert
 */
export type AINoteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the AINote
   */
  select?: Prisma.AINoteSelect<ExtArgs> | null
  /**
   * Omit specific fields from the AINote
   */
  omit?: Prisma.AINoteOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.AINoteInclude<ExtArgs> | null
  /**
   * The filter to search for the AINote to update in case it exists.
   */
  where: Prisma.AINoteWhereUniqueInput
  /**
   * In case the AINote found by the `where` argument doesn't exist, create a new AINote with this data.
   */
  create: Prisma.XOR<Prisma.AINoteCreateInput, Prisma.AINoteUncheckedCreateInput>
  /**
   * In case the AINote was found with the provided `where` argument, update it with this data.
   */
  update: Prisma.XOR<Prisma.AINoteUpdateInput, Prisma.AINoteUncheckedUpdateInput>
}

/**
 * AINote delete
 */
export type AINoteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the AINote
   */
  select?: Prisma.AINoteSelect<ExtArgs> | null
  /**
   * Omit specific fields from the AINote
   */
  omit?: Prisma.AINoteOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.AINoteInclude<ExtArgs> | null
  /**
   * Filter which AINote to delete.
   */
  where: Prisma.AINoteWhereUniqueInput
}

/**
 * AINote deleteMany
 */
export type AINoteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which AINotes to delete
   */
  where?: Prisma.AINoteWhereInput
  /**
   * Limit how many AINotes to delete.
   */
  limit?: number
}

/**
 * AINote without action
 */
export type AINoteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the AINote
   */
  select?: Prisma.AINoteSelect<ExtArgs> | null
  /**
   * Omit specific fields from the AINote
   */
  omit?: Prisma.AINoteOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.AINoteInclude<ExtArgs> | null
}

```

## File: src/generated/prisma/models/CV.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file exports the `CV` model and its related types.
 *
 * 🟢 You can import this file directly.
 */
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"

/**
 * Model CV
 * 
 */
export type CVModel = runtime.Types.Result.DefaultSelection<Prisma.$CVPayload>

export type AggregateCV = {
  _count: CVCountAggregateOutputType | null
  _min: CVMinAggregateOutputType | null
  _max: CVMaxAggregateOutputType | null
}

export type CVMinAggregateOutputType = {
  cv_id: string | null
  user_id: string | null
  cv_name: string | null
  template_style: $Enums.TemplateStyle | null
  pdf_url: string | null
  created_at: Date | null
  updated_at: Date | null
}

export type CVMaxAggregateOutputType = {
  cv_id: string | null
  user_id: string | null
  cv_name: string | null
  template_style: $Enums.TemplateStyle | null
  pdf_url: string | null
  created_at: Date | null
  updated_at: Date | null
}

export type CVCountAggregateOutputType = {
  cv_id: number
  user_id: number
  cv_name: number
  template_style: number
  personal_info: number
  education: number
  experience: number
  skills: number
  projects: number
  pdf_url: number
  created_at: number
  updated_at: number
  _all: number
}


export type CVMinAggregateInputType = {
  cv_id?: true
  user_id?: true
  cv_name?: true
  template_style?: true
  pdf_url?: true
  created_at?: true
  updated_at?: true
}

export type CVMaxAggregateInputType = {
  cv_id?: true
  user_id?: true
  cv_name?: true
  template_style?: true
  pdf_url?: true
  created_at?: true
  updated_at?: true
}

export type CVCountAggregateInputType = {
  cv_id?: true
  user_id?: true
  cv_name?: true
  template_style?: true
  personal_info?: true
  education?: true
  experience?: true
  skills?: true
  projects?: true
  pdf_url?: true
  created_at?: true
  updated_at?: true
  _all?: true
}

export type CVAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which CV to aggregate.
   */
  where?: Prisma.CVWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of CVS to fetch.
   */
  orderBy?: Prisma.CVOrderByWithRelationInput | Prisma.CVOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the start position
   */
  cursor?: Prisma.CVWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` CVS from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` CVS.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Count returned CVS
  **/
  _count?: true | CVCountAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the minimum value
  **/
  _min?: CVMinAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the maximum value
  **/
  _max?: CVMaxAggregateInputType
}

export type GetCVAggregateType<T extends CVAggregateArgs> = {
      [P in keyof T & keyof AggregateCV]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateCV[P]>
    : Prisma.GetScalarType<T[P], AggregateCV[P]>
}




export type CVGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.CVWhereInput
  orderBy?: Prisma.CVOrderByWithAggregationInput | Prisma.CVOrderByWithAggregationInput[]
  by: Prisma.CVScalarFieldEnum[] | Prisma.CVScalarFieldEnum
  having?: Prisma.CVScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: CVCountAggregateInputType | true
  _min?: CVMinAggregateInputType
  _max?: CVMaxAggregateInputType
}

export type CVGroupByOutputType = {
  cv_id: string
  user_id: string
  cv_name: string
  template_style: $Enums.TemplateStyle
  personal_info: runtime.JsonValue | null
  education: runtime.JsonValue | null
  experience: runtime.JsonValue | null
  skills: runtime.JsonValue | null
  projects: runtime.JsonValue | null
  pdf_url: string | null
  created_at: Date
  updated_at: Date
  _count: CVCountAggregateOutputType | null
  _min: CVMinAggregateOutputType | null
  _max: CVMaxAggregateOutputType | null
}

type GetCVGroupByPayload<T extends CVGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<CVGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof CVGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], CVGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], CVGroupByOutputType[P]>
      }
    >
  >



export type CVWhereInput = {
  AND?: Prisma.CVWhereInput | Prisma.CVWhereInput[]
  OR?: Prisma.CVWhereInput[]
  NOT?: Prisma.CVWhereInput | Prisma.CVWhereInput[]
  cv_id?: Prisma.StringFilter<"CV"> | string
  user_id?: Prisma.StringFilter<"CV"> | string
  cv_name?: Prisma.StringFilter<"CV"> | string
  template_style?: Prisma.EnumTemplateStyleFilter<"CV"> | $Enums.TemplateStyle
  personal_info?: Prisma.JsonNullableFilter<"CV">
  education?: Prisma.JsonNullableFilter<"CV">
  experience?: Prisma.JsonNullableFilter<"CV">
  skills?: Prisma.JsonNullableFilter<"CV">
  projects?: Prisma.JsonNullableFilter<"CV">
  pdf_url?: Prisma.StringNullableFilter<"CV"> | string | null
  created_at?: Prisma.DateTimeFilter<"CV"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"CV"> | Date | string
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}

export type CVOrderByWithRelationInput = {
  cv_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  cv_name?: Prisma.SortOrder
  template_style?: Prisma.SortOrder
  personal_info?: Prisma.SortOrderInput | Prisma.SortOrder
  education?: Prisma.SortOrderInput | Prisma.SortOrder
  experience?: Prisma.SortOrderInput | Prisma.SortOrder
  skills?: Prisma.SortOrderInput | Prisma.SortOrder
  projects?: Prisma.SortOrderInput | Prisma.SortOrder
  pdf_url?: Prisma.SortOrderInput | Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
  user?: Prisma.UserOrderByWithRelationInput
  _relevance?: Prisma.CVOrderByRelevanceInput
}

export type CVWhereUniqueInput = Prisma.AtLeast<{
  cv_id?: string
  AND?: Prisma.CVWhereInput | Prisma.CVWhereInput[]
  OR?: Prisma.CVWhereInput[]
  NOT?: Prisma.CVWhereInput | Prisma.CVWhereInput[]
  user_id?: Prisma.StringFilter<"CV"> | string
  cv_name?: Prisma.StringFilter<"CV"> | string
  template_style?: Prisma.EnumTemplateStyleFilter<"CV"> | $Enums.TemplateStyle
  personal_info?: Prisma.JsonNullableFilter<"CV">
  education?: Prisma.JsonNullableFilter<"CV">
  experience?: Prisma.JsonNullableFilter<"CV">
  skills?: Prisma.JsonNullableFilter<"CV">
  projects?: Prisma.JsonNullableFilter<"CV">
  pdf_url?: Prisma.StringNullableFilter<"CV"> | string | null
  created_at?: Prisma.DateTimeFilter<"CV"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"CV"> | Date | string
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}, "cv_id">

export type CVOrderByWithAggregationInput = {
  cv_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  cv_name?: Prisma.SortOrder
  template_style?: Prisma.SortOrder
  personal_info?: Prisma.SortOrderInput | Prisma.SortOrder
  education?: Prisma.SortOrderInput | Prisma.SortOrder
  experience?: Prisma.SortOrderInput | Prisma.SortOrder
  skills?: Prisma.SortOrderInput | Prisma.SortOrder
  projects?: Prisma.SortOrderInput | Prisma.SortOrder
  pdf_url?: Prisma.SortOrderInput | Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
  _count?: Prisma.CVCountOrderByAggregateInput
  _max?: Prisma.CVMaxOrderByAggregateInput
  _min?: Prisma.CVMinOrderByAggregateInput
}

export type CVScalarWhereWithAggregatesInput = {
  AND?: Prisma.CVScalarWhereWithAggregatesInput | Prisma.CVScalarWhereWithAggregatesInput[]
  OR?: Prisma.CVScalarWhereWithAggregatesInput[]
  NOT?: Prisma.CVScalarWhereWithAggregatesInput | Prisma.CVScalarWhereWithAggregatesInput[]
  cv_id?: Prisma.StringWithAggregatesFilter<"CV"> | string
  user_id?: Prisma.StringWithAggregatesFilter<"CV"> | string
  cv_name?: Prisma.StringWithAggregatesFilter<"CV"> | string
  template_style?: Prisma.EnumTemplateStyleWithAggregatesFilter<"CV"> | $Enums.TemplateStyle
  personal_info?: Prisma.JsonNullableWithAggregatesFilter<"CV">
  education?: Prisma.JsonNullableWithAggregatesFilter<"CV">
  experience?: Prisma.JsonNullableWithAggregatesFilter<"CV">
  skills?: Prisma.JsonNullableWithAggregatesFilter<"CV">
  projects?: Prisma.JsonNullableWithAggregatesFilter<"CV">
  pdf_url?: Prisma.StringNullableWithAggregatesFilter<"CV"> | string | null
  created_at?: Prisma.DateTimeWithAggregatesFilter<"CV"> | Date | string
  updated_at?: Prisma.DateTimeWithAggregatesFilter<"CV"> | Date | string
}

export type CVCreateInput = {
  cv_id?: string
  cv_name: string
  template_style?: $Enums.TemplateStyle
  personal_info?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  education?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  experience?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  skills?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  projects?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  pdf_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  user: Prisma.UserCreateNestedOneWithoutCvsInput
}

export type CVUncheckedCreateInput = {
  cv_id?: string
  user_id: string
  cv_name: string
  template_style?: $Enums.TemplateStyle
  personal_info?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  education?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  experience?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  skills?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  projects?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  pdf_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
}

export type CVUpdateInput = {
  cv_id?: Prisma.StringFieldUpdateOperationsInput | string
  cv_name?: Prisma.StringFieldUpdateOperationsInput | string
  template_style?: Prisma.EnumTemplateStyleFieldUpdateOperationsInput | $Enums.TemplateStyle
  personal_info?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  education?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  experience?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  skills?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  projects?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  user?: Prisma.UserUpdateOneRequiredWithoutCvsNestedInput
}

export type CVUncheckedUpdateInput = {
  cv_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  cv_name?: Prisma.StringFieldUpdateOperationsInput | string
  template_style?: Prisma.EnumTemplateStyleFieldUpdateOperationsInput | $Enums.TemplateStyle
  personal_info?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  education?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  experience?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  skills?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  projects?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type CVCreateManyInput = {
  cv_id?: string
  user_id: string
  cv_name: string
  template_style?: $Enums.TemplateStyle
  personal_info?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  education?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  experience?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  skills?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  projects?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  pdf_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
}

export type CVUpdateManyMutationInput = {
  cv_id?: Prisma.StringFieldUpdateOperationsInput | string
  cv_name?: Prisma.StringFieldUpdateOperationsInput | string
  template_style?: Prisma.EnumTemplateStyleFieldUpdateOperationsInput | $Enums.TemplateStyle
  personal_info?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  education?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  experience?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  skills?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  projects?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type CVUncheckedUpdateManyInput = {
  cv_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  cv_name?: Prisma.StringFieldUpdateOperationsInput | string
  template_style?: Prisma.EnumTemplateStyleFieldUpdateOperationsInput | $Enums.TemplateStyle
  personal_info?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  education?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  experience?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  skills?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  projects?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type CVListRelationFilter = {
  every?: Prisma.CVWhereInput
  some?: Prisma.CVWhereInput
  none?: Prisma.CVWhereInput
}

export type CVOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type CVOrderByRelevanceInput = {
  fields: Prisma.CVOrderByRelevanceFieldEnum | Prisma.CVOrderByRelevanceFieldEnum[]
  sort: Prisma.SortOrder
  search: string
}

export type CVCountOrderByAggregateInput = {
  cv_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  cv_name?: Prisma.SortOrder
  template_style?: Prisma.SortOrder
  personal_info?: Prisma.SortOrder
  education?: Prisma.SortOrder
  experience?: Prisma.SortOrder
  skills?: Prisma.SortOrder
  projects?: Prisma.SortOrder
  pdf_url?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type CVMaxOrderByAggregateInput = {
  cv_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  cv_name?: Prisma.SortOrder
  template_style?: Prisma.SortOrder
  pdf_url?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type CVMinOrderByAggregateInput = {
  cv_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  cv_name?: Prisma.SortOrder
  template_style?: Prisma.SortOrder
  pdf_url?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type CVCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.CVCreateWithoutUserInput, Prisma.CVUncheckedCreateWithoutUserInput> | Prisma.CVCreateWithoutUserInput[] | Prisma.CVUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.CVCreateOrConnectWithoutUserInput | Prisma.CVCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.CVCreateManyUserInputEnvelope
  connect?: Prisma.CVWhereUniqueInput | Prisma.CVWhereUniqueInput[]
}

export type CVUncheckedCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.CVCreateWithoutUserInput, Prisma.CVUncheckedCreateWithoutUserInput> | Prisma.CVCreateWithoutUserInput[] | Prisma.CVUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.CVCreateOrConnectWithoutUserInput | Prisma.CVCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.CVCreateManyUserInputEnvelope
  connect?: Prisma.CVWhereUniqueInput | Prisma.CVWhereUniqueInput[]
}

export type CVUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.CVCreateWithoutUserInput, Prisma.CVUncheckedCreateWithoutUserInput> | Prisma.CVCreateWithoutUserInput[] | Prisma.CVUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.CVCreateOrConnectWithoutUserInput | Prisma.CVCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.CVUpsertWithWhereUniqueWithoutUserInput | Prisma.CVUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.CVCreateManyUserInputEnvelope
  set?: Prisma.CVWhereUniqueInput | Prisma.CVWhereUniqueInput[]
  disconnect?: Prisma.CVWhereUniqueInput | Prisma.CVWhereUniqueInput[]
  delete?: Prisma.CVWhereUniqueInput | Prisma.CVWhereUniqueInput[]
  connect?: Prisma.CVWhereUniqueInput | Prisma.CVWhereUniqueInput[]
  update?: Prisma.CVUpdateWithWhereUniqueWithoutUserInput | Prisma.CVUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.CVUpdateManyWithWhereWithoutUserInput | Prisma.CVUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.CVScalarWhereInput | Prisma.CVScalarWhereInput[]
}

export type CVUncheckedUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.CVCreateWithoutUserInput, Prisma.CVUncheckedCreateWithoutUserInput> | Prisma.CVCreateWithoutUserInput[] | Prisma.CVUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.CVCreateOrConnectWithoutUserInput | Prisma.CVCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.CVUpsertWithWhereUniqueWithoutUserInput | Prisma.CVUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.CVCreateManyUserInputEnvelope
  set?: Prisma.CVWhereUniqueInput | Prisma.CVWhereUniqueInput[]
  disconnect?: Prisma.CVWhereUniqueInput | Prisma.CVWhereUniqueInput[]
  delete?: Prisma.CVWhereUniqueInput | Prisma.CVWhereUniqueInput[]
  connect?: Prisma.CVWhereUniqueInput | Prisma.CVWhereUniqueInput[]
  update?: Prisma.CVUpdateWithWhereUniqueWithoutUserInput | Prisma.CVUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.CVUpdateManyWithWhereWithoutUserInput | Prisma.CVUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.CVScalarWhereInput | Prisma.CVScalarWhereInput[]
}

export type EnumTemplateStyleFieldUpdateOperationsInput = {
  set?: $Enums.TemplateStyle
}

export type CVCreateWithoutUserInput = {
  cv_id?: string
  cv_name: string
  template_style?: $Enums.TemplateStyle
  personal_info?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  education?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  experience?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  skills?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  projects?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  pdf_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
}

export type CVUncheckedCreateWithoutUserInput = {
  cv_id?: string
  cv_name: string
  template_style?: $Enums.TemplateStyle
  personal_info?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  education?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  experience?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  skills?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  projects?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  pdf_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
}

export type CVCreateOrConnectWithoutUserInput = {
  where: Prisma.CVWhereUniqueInput
  create: Prisma.XOR<Prisma.CVCreateWithoutUserInput, Prisma.CVUncheckedCreateWithoutUserInput>
}

export type CVCreateManyUserInputEnvelope = {
  data: Prisma.CVCreateManyUserInput | Prisma.CVCreateManyUserInput[]
  skipDuplicates?: boolean
}

export type CVUpsertWithWhereUniqueWithoutUserInput = {
  where: Prisma.CVWhereUniqueInput
  update: Prisma.XOR<Prisma.CVUpdateWithoutUserInput, Prisma.CVUncheckedUpdateWithoutUserInput>
  create: Prisma.XOR<Prisma.CVCreateWithoutUserInput, Prisma.CVUncheckedCreateWithoutUserInput>
}

export type CVUpdateWithWhereUniqueWithoutUserInput = {
  where: Prisma.CVWhereUniqueInput
  data: Prisma.XOR<Prisma.CVUpdateWithoutUserInput, Prisma.CVUncheckedUpdateWithoutUserInput>
}

export type CVUpdateManyWithWhereWithoutUserInput = {
  where: Prisma.CVScalarWhereInput
  data: Prisma.XOR<Prisma.CVUpdateManyMutationInput, Prisma.CVUncheckedUpdateManyWithoutUserInput>
}

export type CVScalarWhereInput = {
  AND?: Prisma.CVScalarWhereInput | Prisma.CVScalarWhereInput[]
  OR?: Prisma.CVScalarWhereInput[]
  NOT?: Prisma.CVScalarWhereInput | Prisma.CVScalarWhereInput[]
  cv_id?: Prisma.StringFilter<"CV"> | string
  user_id?: Prisma.StringFilter<"CV"> | string
  cv_name?: Prisma.StringFilter<"CV"> | string
  template_style?: Prisma.EnumTemplateStyleFilter<"CV"> | $Enums.TemplateStyle
  personal_info?: Prisma.JsonNullableFilter<"CV">
  education?: Prisma.JsonNullableFilter<"CV">
  experience?: Prisma.JsonNullableFilter<"CV">
  skills?: Prisma.JsonNullableFilter<"CV">
  projects?: Prisma.JsonNullableFilter<"CV">
  pdf_url?: Prisma.StringNullableFilter<"CV"> | string | null
  created_at?: Prisma.DateTimeFilter<"CV"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"CV"> | Date | string
}

export type CVCreateManyUserInput = {
  cv_id?: string
  cv_name: string
  template_style?: $Enums.TemplateStyle
  personal_info?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  education?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  experience?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  skills?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  projects?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  pdf_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
}

export type CVUpdateWithoutUserInput = {
  cv_id?: Prisma.StringFieldUpdateOperationsInput | string
  cv_name?: Prisma.StringFieldUpdateOperationsInput | string
  template_style?: Prisma.EnumTemplateStyleFieldUpdateOperationsInput | $Enums.TemplateStyle
  personal_info?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  education?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  experience?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  skills?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  projects?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type CVUncheckedUpdateWithoutUserInput = {
  cv_id?: Prisma.StringFieldUpdateOperationsInput | string
  cv_name?: Prisma.StringFieldUpdateOperationsInput | string
  template_style?: Prisma.EnumTemplateStyleFieldUpdateOperationsInput | $Enums.TemplateStyle
  personal_info?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  education?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  experience?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  skills?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  projects?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type CVUncheckedUpdateManyWithoutUserInput = {
  cv_id?: Prisma.StringFieldUpdateOperationsInput | string
  cv_name?: Prisma.StringFieldUpdateOperationsInput | string
  template_style?: Prisma.EnumTemplateStyleFieldUpdateOperationsInput | $Enums.TemplateStyle
  personal_info?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  education?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  experience?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  skills?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  projects?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}



export type CVSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  cv_id?: boolean
  user_id?: boolean
  cv_name?: boolean
  template_style?: boolean
  personal_info?: boolean
  education?: boolean
  experience?: boolean
  skills?: boolean
  projects?: boolean
  pdf_url?: boolean
  created_at?: boolean
  updated_at?: boolean
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}, ExtArgs["result"]["cV"]>



export type CVSelectScalar = {
  cv_id?: boolean
  user_id?: boolean
  cv_name?: boolean
  template_style?: boolean
  personal_info?: boolean
  education?: boolean
  experience?: boolean
  skills?: boolean
  projects?: boolean
  pdf_url?: boolean
  created_at?: boolean
  updated_at?: boolean
}

export type CVOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"cv_id" | "user_id" | "cv_name" | "template_style" | "personal_info" | "education" | "experience" | "skills" | "projects" | "pdf_url" | "created_at" | "updated_at", ExtArgs["result"]["cV"]>
export type CVInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}

export type $CVPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "CV"
  objects: {
    user: Prisma.$UserPayload<ExtArgs>
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    cv_id: string
    user_id: string
    cv_name: string
    template_style: $Enums.TemplateStyle
    personal_info: runtime.JsonValue | null
    education: runtime.JsonValue | null
    experience: runtime.JsonValue | null
    skills: runtime.JsonValue | null
    projects: runtime.JsonValue | null
    pdf_url: string | null
    created_at: Date
    updated_at: Date
  }, ExtArgs["result"]["cV"]>
  composites: {}
}

export type CVGetPayload<S extends boolean | null | undefined | CVDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CVPayload, S>

export type CVCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<CVFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CVCountAggregateInputType | true
  }

export interface CVDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CV'], meta: { name: 'CV' } }
  /**
   * Find zero or one CV that matches the filter.
   * @param {CVFindUniqueArgs} args - Arguments to find a CV
   * @example
   * // Get one CV
   * const cV = await prisma.cV.findUnique({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUnique<T extends CVFindUniqueArgs>(args: Prisma.SelectSubset<T, CVFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CVClient<runtime.Types.Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find one CV that matches the filter or throw an error with `error.code='P2025'`
   * if no matches were found.
   * @param {CVFindUniqueOrThrowArgs} args - Arguments to find a CV
   * @example
   * // Get one CV
   * const cV = await prisma.cV.findUniqueOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUniqueOrThrow<T extends CVFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CVFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CVClient<runtime.Types.Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first CV that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CVFindFirstArgs} args - Arguments to find a CV
   * @example
   * // Get one CV
   * const cV = await prisma.cV.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends CVFindFirstArgs>(args?: Prisma.SelectSubset<T, CVFindFirstArgs<ExtArgs>>): Prisma.Prisma__CVClient<runtime.Types.Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first CV that matches the filter or
   * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CVFindFirstOrThrowArgs} args - Arguments to find a CV
   * @example
   * // Get one CV
   * const cV = await prisma.cV.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends CVFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CVFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CVClient<runtime.Types.Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find zero or more CVS that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CVFindManyArgs} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all CVS
   * const cVS = await prisma.cV.findMany()
   * 
   * // Get first 10 CVS
   * const cVS = await prisma.cV.findMany({ take: 10 })
   * 
   * // Only select the `cv_id`
   * const cVWithCv_idOnly = await prisma.cV.findMany({ select: { cv_id: true } })
   * 
   */
  findMany<T extends CVFindManyArgs>(args?: Prisma.SelectSubset<T, CVFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  /**
   * Create a CV.
   * @param {CVCreateArgs} args - Arguments to create a CV.
   * @example
   * // Create one CV
   * const CV = await prisma.cV.create({
   *   data: {
   *     // ... data to create a CV
   *   }
   * })
   * 
   */
  create<T extends CVCreateArgs>(args: Prisma.SelectSubset<T, CVCreateArgs<ExtArgs>>): Prisma.Prisma__CVClient<runtime.Types.Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Create many CVS.
   * @param {CVCreateManyArgs} args - Arguments to create many CVS.
   * @example
   * // Create many CVS
   * const cV = await prisma.cV.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   *     
   */
  createMany<T extends CVCreateManyArgs>(args?: Prisma.SelectSubset<T, CVCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Delete a CV.
   * @param {CVDeleteArgs} args - Arguments to delete one CV.
   * @example
   * // Delete one CV
   * const CV = await prisma.cV.delete({
   *   where: {
   *     // ... filter to delete one CV
   *   }
   * })
   * 
   */
  delete<T extends CVDeleteArgs>(args: Prisma.SelectSubset<T, CVDeleteArgs<ExtArgs>>): Prisma.Prisma__CVClient<runtime.Types.Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Update one CV.
   * @param {CVUpdateArgs} args - Arguments to update one CV.
   * @example
   * // Update one CV
   * const cV = await prisma.cV.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends CVUpdateArgs>(args: Prisma.SelectSubset<T, CVUpdateArgs<ExtArgs>>): Prisma.Prisma__CVClient<runtime.Types.Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Delete zero or more CVS.
   * @param {CVDeleteManyArgs} args - Arguments to filter CVS to delete.
   * @example
   * // Delete a few CVS
   * const { count } = await prisma.cV.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany<T extends CVDeleteManyArgs>(args?: Prisma.SelectSubset<T, CVDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Update zero or more CVS.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CVUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many CVS
   * const cV = await prisma.cV.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany<T extends CVUpdateManyArgs>(args: Prisma.SelectSubset<T, CVUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Create or update one CV.
   * @param {CVUpsertArgs} args - Arguments to update or create a CV.
   * @example
   * // Update or create a CV
   * const cV = await prisma.cV.upsert({
   *   create: {
   *     // ... data to create a CV
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the CV we want to update
   *   }
   * })
   */
  upsert<T extends CVUpsertArgs>(args: Prisma.SelectSubset<T, CVUpsertArgs<ExtArgs>>): Prisma.Prisma__CVClient<runtime.Types.Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


  /**
   * Count the number of CVS.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CVCountArgs} args - Arguments to filter CVS to count.
   * @example
   * // Count the number of CVS
   * const count = await prisma.cV.count({
   *   where: {
   *     // ... the filter for the CVS we want to count
   *   }
   * })
  **/
  count<T extends CVCountArgs>(
    args?: Prisma.Subset<T, CVCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], CVCountAggregateOutputType>
      : number
  >

  /**
   * Allows you to perform aggregations operations on a CV.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CVAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Ordered by age ascending
   * // Where email contains prisma.io
   * // Limited to the 10 users
   * const aggregations = await prisma.user.aggregate({
   *   _avg: {
   *     age: true,
   *   },
   *   where: {
   *     email: {
   *       contains: "prisma.io",
   *     },
   *   },
   *   orderBy: {
   *     age: "asc",
   *   },
   *   take: 10,
   * })
  **/
  aggregate<T extends CVAggregateArgs>(args: Prisma.Subset<T, CVAggregateArgs>): Prisma.PrismaPromise<GetCVAggregateType<T>>

  /**
   * Group by CV.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CVGroupByArgs} args - Group by arguments.
   * @example
   * // Group by city, order by createdAt, get count
   * const result = await prisma.user.groupBy({
   *   by: ['city', 'createdAt'],
   *   orderBy: {
   *     createdAt: true
   *   },
   *   _count: {
   *     _all: true
   *   },
   * })
   * 
  **/
  groupBy<
    T extends CVGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: CVGroupByArgs['orderBy'] }
      : { orderBy?: CVGroupByArgs['orderBy'] },
    OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>,
    ByFields extends Prisma.MaybeTupleToUnion<T['by']>,
    ByValid extends Prisma.Has<ByFields, OrderFields>,
    HavingFields extends Prisma.GetHavingFields<T['having']>,
    HavingValid extends Prisma.Has<ByFields, HavingFields>,
    ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False,
    InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
          ? never
          : P extends string
          ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
          : [
              Error,
              'Field ',
              P,
              ` in "having" needs to be provided in "by"`,
            ]
      }[HavingFields]
    : 'take' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
          ? never
          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
      }[OrderFields]
  >(args: Prisma.SubsetIntersection<T, CVGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCVGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
/**
 * Fields of the CV model
 */
readonly fields: CVFieldRefs;
}

/**
 * The delegate class that acts as a "Promise-like" for CV.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__CVClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}




/**
 * Fields of the CV model
 */
export interface CVFieldRefs {
  readonly cv_id: Prisma.FieldRef<"CV", 'String'>
  readonly user_id: Prisma.FieldRef<"CV", 'String'>
  readonly cv_name: Prisma.FieldRef<"CV", 'String'>
  readonly template_style: Prisma.FieldRef<"CV", 'TemplateStyle'>
  readonly personal_info: Prisma.FieldRef<"CV", 'Json'>
  readonly education: Prisma.FieldRef<"CV", 'Json'>
  readonly experience: Prisma.FieldRef<"CV", 'Json'>
  readonly skills: Prisma.FieldRef<"CV", 'Json'>
  readonly projects: Prisma.FieldRef<"CV", 'Json'>
  readonly pdf_url: Prisma.FieldRef<"CV", 'String'>
  readonly created_at: Prisma.FieldRef<"CV", 'DateTime'>
  readonly updated_at: Prisma.FieldRef<"CV", 'DateTime'>
}
    

// Custom InputTypes
/**
 * CV findUnique
 */
export type CVFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the CV
   */
  select?: Prisma.CVSelect<ExtArgs> | null
  /**
   * Omit specific fields from the CV
   */
  omit?: Prisma.CVOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CVInclude<ExtArgs> | null
  /**
   * Filter, which CV to fetch.
   */
  where: Prisma.CVWhereUniqueInput
}

/**
 * CV findUniqueOrThrow
 */
export type CVFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the CV
   */
  select?: Prisma.CVSelect<ExtArgs> | null
  /**
   * Omit specific fields from the CV
   */
  omit?: Prisma.CVOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CVInclude<ExtArgs> | null
  /**
   * Filter, which CV to fetch.
   */
  where: Prisma.CVWhereUniqueInput
}

/**
 * CV findFirst
 */
export type CVFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the CV
   */
  select?: Prisma.CVSelect<ExtArgs> | null
  /**
   * Omit specific fields from the CV
   */
  omit?: Prisma.CVOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CVInclude<ExtArgs> | null
  /**
   * Filter, which CV to fetch.
   */
  where?: Prisma.CVWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of CVS to fetch.
   */
  orderBy?: Prisma.CVOrderByWithRelationInput | Prisma.CVOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for CVS.
   */
  cursor?: Prisma.CVWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` CVS from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` CVS.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of CVS.
   */
  distinct?: Prisma.CVScalarFieldEnum | Prisma.CVScalarFieldEnum[]
}

/**
 * CV findFirstOrThrow
 */
export type CVFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the CV
   */
  select?: Prisma.CVSelect<ExtArgs> | null
  /**
   * Omit specific fields from the CV
   */
  omit?: Prisma.CVOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CVInclude<ExtArgs> | null
  /**
   * Filter, which CV to fetch.
   */
  where?: Prisma.CVWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of CVS to fetch.
   */
  orderBy?: Prisma.CVOrderByWithRelationInput | Prisma.CVOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for CVS.
   */
  cursor?: Prisma.CVWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` CVS from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` CVS.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of CVS.
   */
  distinct?: Prisma.CVScalarFieldEnum | Prisma.CVScalarFieldEnum[]
}

/**
 * CV findMany
 */
export type CVFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the CV
   */
  select?: Prisma.CVSelect<ExtArgs> | null
  /**
   * Omit specific fields from the CV
   */
  omit?: Prisma.CVOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CVInclude<ExtArgs> | null
  /**
   * Filter, which CVS to fetch.
   */
  where?: Prisma.CVWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of CVS to fetch.
   */
  orderBy?: Prisma.CVOrderByWithRelationInput | Prisma.CVOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for listing CVS.
   */
  cursor?: Prisma.CVWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` CVS from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` CVS.
   */
  skip?: number
  distinct?: Prisma.CVScalarFieldEnum | Prisma.CVScalarFieldEnum[]
}

/**
 * CV create
 */
export type CVCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the CV
   */
  select?: Prisma.CVSelect<ExtArgs> | null
  /**
   * Omit specific fields from the CV
   */
  omit?: Prisma.CVOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CVInclude<ExtArgs> | null
  /**
   * The data needed to create a CV.
   */
  data: Prisma.XOR<Prisma.CVCreateInput, Prisma.CVUncheckedCreateInput>
}

/**
 * CV createMany
 */
export type CVCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to create many CVS.
   */
  data: Prisma.CVCreateManyInput | Prisma.CVCreateManyInput[]
  skipDuplicates?: boolean
}

/**
 * CV update
 */
export type CVUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the CV
   */
  select?: Prisma.CVSelect<ExtArgs> | null
  /**
   * Omit specific fields from the CV
   */
  omit?: Prisma.CVOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CVInclude<ExtArgs> | null
  /**
   * The data needed to update a CV.
   */
  data: Prisma.XOR<Prisma.CVUpdateInput, Prisma.CVUncheckedUpdateInput>
  /**
   * Choose, which CV to update.
   */
  where: Prisma.CVWhereUniqueInput
}

/**
 * CV updateMany
 */
export type CVUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to update CVS.
   */
  data: Prisma.XOR<Prisma.CVUpdateManyMutationInput, Prisma.CVUncheckedUpdateManyInput>
  /**
   * Filter which CVS to update
   */
  where?: Prisma.CVWhereInput
  /**
   * Limit how many CVS to update.
   */
  limit?: number
}

/**
 * CV upsert
 */
export type CVUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the CV
   */
  select?: Prisma.CVSelect<ExtArgs> | null
  /**
   * Omit specific fields from the CV
   */
  omit?: Prisma.CVOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CVInclude<ExtArgs> | null
  /**
   * The filter to search for the CV to update in case it exists.
   */
  where: Prisma.CVWhereUniqueInput
  /**
   * In case the CV found by the `where` argument doesn't exist, create a new CV with this data.
   */
  create: Prisma.XOR<Prisma.CVCreateInput, Prisma.CVUncheckedCreateInput>
  /**
   * In case the CV was found with the provided `where` argument, update it with this data.
   */
  update: Prisma.XOR<Prisma.CVUpdateInput, Prisma.CVUncheckedUpdateInput>
}

/**
 * CV delete
 */
export type CVDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the CV
   */
  select?: Prisma.CVSelect<ExtArgs> | null
  /**
   * Omit specific fields from the CV
   */
  omit?: Prisma.CVOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CVInclude<ExtArgs> | null
  /**
   * Filter which CV to delete.
   */
  where: Prisma.CVWhereUniqueInput
}

/**
 * CV deleteMany
 */
export type CVDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which CVS to delete
   */
  where?: Prisma.CVWhereInput
  /**
   * Limit how many CVS to delete.
   */
  limit?: number
}

/**
 * CV without action
 */
export type CVDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the CV
   */
  select?: Prisma.CVSelect<ExtArgs> | null
  /**
   * Omit specific fields from the CV
   */
  omit?: Prisma.CVOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CVInclude<ExtArgs> | null
}

```

## File: src/generated/prisma/models/Certificate.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file exports the `Certificate` model and its related types.
 *
 * 🟢 You can import this file directly.
 */
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"

/**
 * Model Certificate
 * 
 */
export type CertificateModel = runtime.Types.Result.DefaultSelection<Prisma.$CertificatePayload>

export type AggregateCertificate = {
  _count: CertificateCountAggregateOutputType | null
  _min: CertificateMinAggregateOutputType | null
  _max: CertificateMaxAggregateOutputType | null
}

export type CertificateMinAggregateOutputType = {
  certificate_id: string | null
  user_id: string | null
  roadmap_id: string | null
  certificate_name: string | null
  issue_date: Date | null
  pdf_url: string | null
}

export type CertificateMaxAggregateOutputType = {
  certificate_id: string | null
  user_id: string | null
  roadmap_id: string | null
  certificate_name: string | null
  issue_date: Date | null
  pdf_url: string | null
}

export type CertificateCountAggregateOutputType = {
  certificate_id: number
  user_id: number
  roadmap_id: number
  certificate_name: number
  issue_date: number
  pdf_url: number
  _all: number
}


export type CertificateMinAggregateInputType = {
  certificate_id?: true
  user_id?: true
  roadmap_id?: true
  certificate_name?: true
  issue_date?: true
  pdf_url?: true
}

export type CertificateMaxAggregateInputType = {
  certificate_id?: true
  user_id?: true
  roadmap_id?: true
  certificate_name?: true
  issue_date?: true
  pdf_url?: true
}

export type CertificateCountAggregateInputType = {
  certificate_id?: true
  user_id?: true
  roadmap_id?: true
  certificate_name?: true
  issue_date?: true
  pdf_url?: true
  _all?: true
}

export type CertificateAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which Certificate to aggregate.
   */
  where?: Prisma.CertificateWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Certificates to fetch.
   */
  orderBy?: Prisma.CertificateOrderByWithRelationInput | Prisma.CertificateOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the start position
   */
  cursor?: Prisma.CertificateWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Certificates from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Certificates.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Count returned Certificates
  **/
  _count?: true | CertificateCountAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the minimum value
  **/
  _min?: CertificateMinAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the maximum value
  **/
  _max?: CertificateMaxAggregateInputType
}

export type GetCertificateAggregateType<T extends CertificateAggregateArgs> = {
      [P in keyof T & keyof AggregateCertificate]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateCertificate[P]>
    : Prisma.GetScalarType<T[P], AggregateCertificate[P]>
}




export type CertificateGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.CertificateWhereInput
  orderBy?: Prisma.CertificateOrderByWithAggregationInput | Prisma.CertificateOrderByWithAggregationInput[]
  by: Prisma.CertificateScalarFieldEnum[] | Prisma.CertificateScalarFieldEnum
  having?: Prisma.CertificateScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: CertificateCountAggregateInputType | true
  _min?: CertificateMinAggregateInputType
  _max?: CertificateMaxAggregateInputType
}

export type CertificateGroupByOutputType = {
  certificate_id: string
  user_id: string
  roadmap_id: string
  certificate_name: string
  issue_date: Date
  pdf_url: string | null
  _count: CertificateCountAggregateOutputType | null
  _min: CertificateMinAggregateOutputType | null
  _max: CertificateMaxAggregateOutputType | null
}

type GetCertificateGroupByPayload<T extends CertificateGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<CertificateGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof CertificateGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], CertificateGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], CertificateGroupByOutputType[P]>
      }
    >
  >



export type CertificateWhereInput = {
  AND?: Prisma.CertificateWhereInput | Prisma.CertificateWhereInput[]
  OR?: Prisma.CertificateWhereInput[]
  NOT?: Prisma.CertificateWhereInput | Prisma.CertificateWhereInput[]
  certificate_id?: Prisma.StringFilter<"Certificate"> | string
  user_id?: Prisma.StringFilter<"Certificate"> | string
  roadmap_id?: Prisma.StringFilter<"Certificate"> | string
  certificate_name?: Prisma.StringFilter<"Certificate"> | string
  issue_date?: Prisma.DateTimeFilter<"Certificate"> | Date | string
  pdf_url?: Prisma.StringNullableFilter<"Certificate"> | string | null
  roadmap?: Prisma.XOR<Prisma.RoadmapScalarRelationFilter, Prisma.RoadmapWhereInput>
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}

export type CertificateOrderByWithRelationInput = {
  certificate_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  roadmap_id?: Prisma.SortOrder
  certificate_name?: Prisma.SortOrder
  issue_date?: Prisma.SortOrder
  pdf_url?: Prisma.SortOrderInput | Prisma.SortOrder
  roadmap?: Prisma.RoadmapOrderByWithRelationInput
  user?: Prisma.UserOrderByWithRelationInput
  _relevance?: Prisma.CertificateOrderByRelevanceInput
}

export type CertificateWhereUniqueInput = Prisma.AtLeast<{
  certificate_id?: string
  user_id_roadmap_id?: Prisma.CertificateUser_idRoadmap_idCompoundUniqueInput
  AND?: Prisma.CertificateWhereInput | Prisma.CertificateWhereInput[]
  OR?: Prisma.CertificateWhereInput[]
  NOT?: Prisma.CertificateWhereInput | Prisma.CertificateWhereInput[]
  user_id?: Prisma.StringFilter<"Certificate"> | string
  roadmap_id?: Prisma.StringFilter<"Certificate"> | string
  certificate_name?: Prisma.StringFilter<"Certificate"> | string
  issue_date?: Prisma.DateTimeFilter<"Certificate"> | Date | string
  pdf_url?: Prisma.StringNullableFilter<"Certificate"> | string | null
  roadmap?: Prisma.XOR<Prisma.RoadmapScalarRelationFilter, Prisma.RoadmapWhereInput>
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}, "certificate_id" | "user_id_roadmap_id">

export type CertificateOrderByWithAggregationInput = {
  certificate_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  roadmap_id?: Prisma.SortOrder
  certificate_name?: Prisma.SortOrder
  issue_date?: Prisma.SortOrder
  pdf_url?: Prisma.SortOrderInput | Prisma.SortOrder
  _count?: Prisma.CertificateCountOrderByAggregateInput
  _max?: Prisma.CertificateMaxOrderByAggregateInput
  _min?: Prisma.CertificateMinOrderByAggregateInput
}

export type CertificateScalarWhereWithAggregatesInput = {
  AND?: Prisma.CertificateScalarWhereWithAggregatesInput | Prisma.CertificateScalarWhereWithAggregatesInput[]
  OR?: Prisma.CertificateScalarWhereWithAggregatesInput[]
  NOT?: Prisma.CertificateScalarWhereWithAggregatesInput | Prisma.CertificateScalarWhereWithAggregatesInput[]
  certificate_id?: Prisma.StringWithAggregatesFilter<"Certificate"> | string
  user_id?: Prisma.StringWithAggregatesFilter<"Certificate"> | string
  roadmap_id?: Prisma.StringWithAggregatesFilter<"Certificate"> | string
  certificate_name?: Prisma.StringWithAggregatesFilter<"Certificate"> | string
  issue_date?: Prisma.DateTimeWithAggregatesFilter<"Certificate"> | Date | string
  pdf_url?: Prisma.StringNullableWithAggregatesFilter<"Certificate"> | string | null
}

export type CertificateCreateInput = {
  certificate_id?: string
  certificate_name: string
  issue_date?: Date | string
  pdf_url?: string | null
  roadmap: Prisma.RoadmapCreateNestedOneWithoutCertificatesInput
  user: Prisma.UserCreateNestedOneWithoutCertificatesInput
}

export type CertificateUncheckedCreateInput = {
  certificate_id?: string
  user_id: string
  roadmap_id: string
  certificate_name: string
  issue_date?: Date | string
  pdf_url?: string | null
}

export type CertificateUpdateInput = {
  certificate_id?: Prisma.StringFieldUpdateOperationsInput | string
  certificate_name?: Prisma.StringFieldUpdateOperationsInput | string
  issue_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  roadmap?: Prisma.RoadmapUpdateOneRequiredWithoutCertificatesNestedInput
  user?: Prisma.UserUpdateOneRequiredWithoutCertificatesNestedInput
}

export type CertificateUncheckedUpdateInput = {
  certificate_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  certificate_name?: Prisma.StringFieldUpdateOperationsInput | string
  issue_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
}

export type CertificateCreateManyInput = {
  certificate_id?: string
  user_id: string
  roadmap_id: string
  certificate_name: string
  issue_date?: Date | string
  pdf_url?: string | null
}

export type CertificateUpdateManyMutationInput = {
  certificate_id?: Prisma.StringFieldUpdateOperationsInput | string
  certificate_name?: Prisma.StringFieldUpdateOperationsInput | string
  issue_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
}

export type CertificateUncheckedUpdateManyInput = {
  certificate_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  certificate_name?: Prisma.StringFieldUpdateOperationsInput | string
  issue_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
}

export type CertificateListRelationFilter = {
  every?: Prisma.CertificateWhereInput
  some?: Prisma.CertificateWhereInput
  none?: Prisma.CertificateWhereInput
}

export type CertificateOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type CertificateOrderByRelevanceInput = {
  fields: Prisma.CertificateOrderByRelevanceFieldEnum | Prisma.CertificateOrderByRelevanceFieldEnum[]
  sort: Prisma.SortOrder
  search: string
}

export type CertificateUser_idRoadmap_idCompoundUniqueInput = {
  user_id: string
  roadmap_id: string
}

export type CertificateCountOrderByAggregateInput = {
  certificate_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  roadmap_id?: Prisma.SortOrder
  certificate_name?: Prisma.SortOrder
  issue_date?: Prisma.SortOrder
  pdf_url?: Prisma.SortOrder
}

export type CertificateMaxOrderByAggregateInput = {
  certificate_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  roadmap_id?: Prisma.SortOrder
  certificate_name?: Prisma.SortOrder
  issue_date?: Prisma.SortOrder
  pdf_url?: Prisma.SortOrder
}

export type CertificateMinOrderByAggregateInput = {
  certificate_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  roadmap_id?: Prisma.SortOrder
  certificate_name?: Prisma.SortOrder
  issue_date?: Prisma.SortOrder
  pdf_url?: Prisma.SortOrder
}

export type CertificateCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.CertificateCreateWithoutUserInput, Prisma.CertificateUncheckedCreateWithoutUserInput> | Prisma.CertificateCreateWithoutUserInput[] | Prisma.CertificateUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.CertificateCreateOrConnectWithoutUserInput | Prisma.CertificateCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.CertificateCreateManyUserInputEnvelope
  connect?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
}

export type CertificateUncheckedCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.CertificateCreateWithoutUserInput, Prisma.CertificateUncheckedCreateWithoutUserInput> | Prisma.CertificateCreateWithoutUserInput[] | Prisma.CertificateUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.CertificateCreateOrConnectWithoutUserInput | Prisma.CertificateCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.CertificateCreateManyUserInputEnvelope
  connect?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
}

export type CertificateUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.CertificateCreateWithoutUserInput, Prisma.CertificateUncheckedCreateWithoutUserInput> | Prisma.CertificateCreateWithoutUserInput[] | Prisma.CertificateUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.CertificateCreateOrConnectWithoutUserInput | Prisma.CertificateCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.CertificateUpsertWithWhereUniqueWithoutUserInput | Prisma.CertificateUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.CertificateCreateManyUserInputEnvelope
  set?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  disconnect?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  delete?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  connect?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  update?: Prisma.CertificateUpdateWithWhereUniqueWithoutUserInput | Prisma.CertificateUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.CertificateUpdateManyWithWhereWithoutUserInput | Prisma.CertificateUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.CertificateScalarWhereInput | Prisma.CertificateScalarWhereInput[]
}

export type CertificateUncheckedUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.CertificateCreateWithoutUserInput, Prisma.CertificateUncheckedCreateWithoutUserInput> | Prisma.CertificateCreateWithoutUserInput[] | Prisma.CertificateUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.CertificateCreateOrConnectWithoutUserInput | Prisma.CertificateCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.CertificateUpsertWithWhereUniqueWithoutUserInput | Prisma.CertificateUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.CertificateCreateManyUserInputEnvelope
  set?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  disconnect?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  delete?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  connect?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  update?: Prisma.CertificateUpdateWithWhereUniqueWithoutUserInput | Prisma.CertificateUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.CertificateUpdateManyWithWhereWithoutUserInput | Prisma.CertificateUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.CertificateScalarWhereInput | Prisma.CertificateScalarWhereInput[]
}

export type CertificateCreateNestedManyWithoutRoadmapInput = {
  create?: Prisma.XOR<Prisma.CertificateCreateWithoutRoadmapInput, Prisma.CertificateUncheckedCreateWithoutRoadmapInput> | Prisma.CertificateCreateWithoutRoadmapInput[] | Prisma.CertificateUncheckedCreateWithoutRoadmapInput[]
  connectOrCreate?: Prisma.CertificateCreateOrConnectWithoutRoadmapInput | Prisma.CertificateCreateOrConnectWithoutRoadmapInput[]
  createMany?: Prisma.CertificateCreateManyRoadmapInputEnvelope
  connect?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
}

export type CertificateUncheckedCreateNestedManyWithoutRoadmapInput = {
  create?: Prisma.XOR<Prisma.CertificateCreateWithoutRoadmapInput, Prisma.CertificateUncheckedCreateWithoutRoadmapInput> | Prisma.CertificateCreateWithoutRoadmapInput[] | Prisma.CertificateUncheckedCreateWithoutRoadmapInput[]
  connectOrCreate?: Prisma.CertificateCreateOrConnectWithoutRoadmapInput | Prisma.CertificateCreateOrConnectWithoutRoadmapInput[]
  createMany?: Prisma.CertificateCreateManyRoadmapInputEnvelope
  connect?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
}

export type CertificateUpdateManyWithoutRoadmapNestedInput = {
  create?: Prisma.XOR<Prisma.CertificateCreateWithoutRoadmapInput, Prisma.CertificateUncheckedCreateWithoutRoadmapInput> | Prisma.CertificateCreateWithoutRoadmapInput[] | Prisma.CertificateUncheckedCreateWithoutRoadmapInput[]
  connectOrCreate?: Prisma.CertificateCreateOrConnectWithoutRoadmapInput | Prisma.CertificateCreateOrConnectWithoutRoadmapInput[]
  upsert?: Prisma.CertificateUpsertWithWhereUniqueWithoutRoadmapInput | Prisma.CertificateUpsertWithWhereUniqueWithoutRoadmapInput[]
  createMany?: Prisma.CertificateCreateManyRoadmapInputEnvelope
  set?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  disconnect?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  delete?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  connect?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  update?: Prisma.CertificateUpdateWithWhereUniqueWithoutRoadmapInput | Prisma.CertificateUpdateWithWhereUniqueWithoutRoadmapInput[]
  updateMany?: Prisma.CertificateUpdateManyWithWhereWithoutRoadmapInput | Prisma.CertificateUpdateManyWithWhereWithoutRoadmapInput[]
  deleteMany?: Prisma.CertificateScalarWhereInput | Prisma.CertificateScalarWhereInput[]
}

export type CertificateUncheckedUpdateManyWithoutRoadmapNestedInput = {
  create?: Prisma.XOR<Prisma.CertificateCreateWithoutRoadmapInput, Prisma.CertificateUncheckedCreateWithoutRoadmapInput> | Prisma.CertificateCreateWithoutRoadmapInput[] | Prisma.CertificateUncheckedCreateWithoutRoadmapInput[]
  connectOrCreate?: Prisma.CertificateCreateOrConnectWithoutRoadmapInput | Prisma.CertificateCreateOrConnectWithoutRoadmapInput[]
  upsert?: Prisma.CertificateUpsertWithWhereUniqueWithoutRoadmapInput | Prisma.CertificateUpsertWithWhereUniqueWithoutRoadmapInput[]
  createMany?: Prisma.CertificateCreateManyRoadmapInputEnvelope
  set?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  disconnect?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  delete?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  connect?: Prisma.CertificateWhereUniqueInput | Prisma.CertificateWhereUniqueInput[]
  update?: Prisma.CertificateUpdateWithWhereUniqueWithoutRoadmapInput | Prisma.CertificateUpdateWithWhereUniqueWithoutRoadmapInput[]
  updateMany?: Prisma.CertificateUpdateManyWithWhereWithoutRoadmapInput | Prisma.CertificateUpdateManyWithWhereWithoutRoadmapInput[]
  deleteMany?: Prisma.CertificateScalarWhereInput | Prisma.CertificateScalarWhereInput[]
}

export type CertificateCreateWithoutUserInput = {
  certificate_id?: string
  certificate_name: string
  issue_date?: Date | string
  pdf_url?: string | null
  roadmap: Prisma.RoadmapCreateNestedOneWithoutCertificatesInput
}

export type CertificateUncheckedCreateWithoutUserInput = {
  certificate_id?: string
  roadmap_id: string
  certificate_name: string
  issue_date?: Date | string
  pdf_url?: string | null
}

export type CertificateCreateOrConnectWithoutUserInput = {
  where: Prisma.CertificateWhereUniqueInput
  create: Prisma.XOR<Prisma.CertificateCreateWithoutUserInput, Prisma.CertificateUncheckedCreateWithoutUserInput>
}

export type CertificateCreateManyUserInputEnvelope = {
  data: Prisma.CertificateCreateManyUserInput | Prisma.CertificateCreateManyUserInput[]
  skipDuplicates?: boolean
}

export type CertificateUpsertWithWhereUniqueWithoutUserInput = {
  where: Prisma.CertificateWhereUniqueInput
  update: Prisma.XOR<Prisma.CertificateUpdateWithoutUserInput, Prisma.CertificateUncheckedUpdateWithoutUserInput>
  create: Prisma.XOR<Prisma.CertificateCreateWithoutUserInput, Prisma.CertificateUncheckedCreateWithoutUserInput>
}

export type CertificateUpdateWithWhereUniqueWithoutUserInput = {
  where: Prisma.CertificateWhereUniqueInput
  data: Prisma.XOR<Prisma.CertificateUpdateWithoutUserInput, Prisma.CertificateUncheckedUpdateWithoutUserInput>
}

export type CertificateUpdateManyWithWhereWithoutUserInput = {
  where: Prisma.CertificateScalarWhereInput
  data: Prisma.XOR<Prisma.CertificateUpdateManyMutationInput, Prisma.CertificateUncheckedUpdateManyWithoutUserInput>
}

export type CertificateScalarWhereInput = {
  AND?: Prisma.CertificateScalarWhereInput | Prisma.CertificateScalarWhereInput[]
  OR?: Prisma.CertificateScalarWhereInput[]
  NOT?: Prisma.CertificateScalarWhereInput | Prisma.CertificateScalarWhereInput[]
  certificate_id?: Prisma.StringFilter<"Certificate"> | string
  user_id?: Prisma.StringFilter<"Certificate"> | string
  roadmap_id?: Prisma.StringFilter<"Certificate"> | string
  certificate_name?: Prisma.StringFilter<"Certificate"> | string
  issue_date?: Prisma.DateTimeFilter<"Certificate"> | Date | string
  pdf_url?: Prisma.StringNullableFilter<"Certificate"> | string | null
}

export type CertificateCreateWithoutRoadmapInput = {
  certificate_id?: string
  certificate_name: string
  issue_date?: Date | string
  pdf_url?: string | null
  user: Prisma.UserCreateNestedOneWithoutCertificatesInput
}

export type CertificateUncheckedCreateWithoutRoadmapInput = {
  certificate_id?: string
  user_id: string
  certificate_name: string
  issue_date?: Date | string
  pdf_url?: string | null
}

export type CertificateCreateOrConnectWithoutRoadmapInput = {
  where: Prisma.CertificateWhereUniqueInput
  create: Prisma.XOR<Prisma.CertificateCreateWithoutRoadmapInput, Prisma.CertificateUncheckedCreateWithoutRoadmapInput>
}

export type CertificateCreateManyRoadmapInputEnvelope = {
  data: Prisma.CertificateCreateManyRoadmapInput | Prisma.CertificateCreateManyRoadmapInput[]
  skipDuplicates?: boolean
}

export type CertificateUpsertWithWhereUniqueWithoutRoadmapInput = {
  where: Prisma.CertificateWhereUniqueInput
  update: Prisma.XOR<Prisma.CertificateUpdateWithoutRoadmapInput, Prisma.CertificateUncheckedUpdateWithoutRoadmapInput>
  create: Prisma.XOR<Prisma.CertificateCreateWithoutRoadmapInput, Prisma.CertificateUncheckedCreateWithoutRoadmapInput>
}

export type CertificateUpdateWithWhereUniqueWithoutRoadmapInput = {
  where: Prisma.CertificateWhereUniqueInput
  data: Prisma.XOR<Prisma.CertificateUpdateWithoutRoadmapInput, Prisma.CertificateUncheckedUpdateWithoutRoadmapInput>
}

export type CertificateUpdateManyWithWhereWithoutRoadmapInput = {
  where: Prisma.CertificateScalarWhereInput
  data: Prisma.XOR<Prisma.CertificateUpdateManyMutationInput, Prisma.CertificateUncheckedUpdateManyWithoutRoadmapInput>
}

export type CertificateCreateManyUserInput = {
  certificate_id?: string
  roadmap_id: string
  certificate_name: string
  issue_date?: Date | string
  pdf_url?: string | null
}

export type CertificateUpdateWithoutUserInput = {
  certificate_id?: Prisma.StringFieldUpdateOperationsInput | string
  certificate_name?: Prisma.StringFieldUpdateOperationsInput | string
  issue_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  roadmap?: Prisma.RoadmapUpdateOneRequiredWithoutCertificatesNestedInput
}

export type CertificateUncheckedUpdateWithoutUserInput = {
  certificate_id?: Prisma.StringFieldUpdateOperationsInput | string
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  certificate_name?: Prisma.StringFieldUpdateOperationsInput | string
  issue_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
}

export type CertificateUncheckedUpdateManyWithoutUserInput = {
  certificate_id?: Prisma.StringFieldUpdateOperationsInput | string
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  certificate_name?: Prisma.StringFieldUpdateOperationsInput | string
  issue_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
}

export type CertificateCreateManyRoadmapInput = {
  certificate_id?: string
  user_id: string
  certificate_name: string
  issue_date?: Date | string
  pdf_url?: string | null
}

export type CertificateUpdateWithoutRoadmapInput = {
  certificate_id?: Prisma.StringFieldUpdateOperationsInput | string
  certificate_name?: Prisma.StringFieldUpdateOperationsInput | string
  issue_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  user?: Prisma.UserUpdateOneRequiredWithoutCertificatesNestedInput
}

export type CertificateUncheckedUpdateWithoutRoadmapInput = {
  certificate_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  certificate_name?: Prisma.StringFieldUpdateOperationsInput | string
  issue_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
}

export type CertificateUncheckedUpdateManyWithoutRoadmapInput = {
  certificate_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  certificate_name?: Prisma.StringFieldUpdateOperationsInput | string
  issue_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  pdf_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
}



export type CertificateSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  certificate_id?: boolean
  user_id?: boolean
  roadmap_id?: boolean
  certificate_name?: boolean
  issue_date?: boolean
  pdf_url?: boolean
  roadmap?: boolean | Prisma.RoadmapDefaultArgs<ExtArgs>
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}, ExtArgs["result"]["certificate"]>



export type CertificateSelectScalar = {
  certificate_id?: boolean
  user_id?: boolean
  roadmap_id?: boolean
  certificate_name?: boolean
  issue_date?: boolean
  pdf_url?: boolean
}

export type CertificateOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"certificate_id" | "user_id" | "roadmap_id" | "certificate_name" | "issue_date" | "pdf_url", ExtArgs["result"]["certificate"]>
export type CertificateInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  roadmap?: boolean | Prisma.RoadmapDefaultArgs<ExtArgs>
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}

export type $CertificatePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "Certificate"
  objects: {
    roadmap: Prisma.$RoadmapPayload<ExtArgs>
    user: Prisma.$UserPayload<ExtArgs>
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    certificate_id: string
    user_id: string
    roadmap_id: string
    certificate_name: string
    issue_date: Date
    pdf_url: string | null
  }, ExtArgs["result"]["certificate"]>
  composites: {}
}

export type CertificateGetPayload<S extends boolean | null | undefined | CertificateDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CertificatePayload, S>

export type CertificateCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<CertificateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CertificateCountAggregateInputType | true
  }

export interface CertificateDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Certificate'], meta: { name: 'Certificate' } }
  /**
   * Find zero or one Certificate that matches the filter.
   * @param {CertificateFindUniqueArgs} args - Arguments to find a Certificate
   * @example
   * // Get one Certificate
   * const certificate = await prisma.certificate.findUnique({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUnique<T extends CertificateFindUniqueArgs>(args: Prisma.SelectSubset<T, CertificateFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CertificateClient<runtime.Types.Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find one Certificate that matches the filter or throw an error with `error.code='P2025'`
   * if no matches were found.
   * @param {CertificateFindUniqueOrThrowArgs} args - Arguments to find a Certificate
   * @example
   * // Get one Certificate
   * const certificate = await prisma.certificate.findUniqueOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUniqueOrThrow<T extends CertificateFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CertificateFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CertificateClient<runtime.Types.Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first Certificate that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CertificateFindFirstArgs} args - Arguments to find a Certificate
   * @example
   * // Get one Certificate
   * const certificate = await prisma.certificate.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends CertificateFindFirstArgs>(args?: Prisma.SelectSubset<T, CertificateFindFirstArgs<ExtArgs>>): Prisma.Prisma__CertificateClient<runtime.Types.Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first Certificate that matches the filter or
   * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CertificateFindFirstOrThrowArgs} args - Arguments to find a Certificate
   * @example
   * // Get one Certificate
   * const certificate = await prisma.certificate.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends CertificateFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CertificateFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CertificateClient<runtime.Types.Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find zero or more Certificates that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CertificateFindManyArgs} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Certificates
   * const certificates = await prisma.certificate.findMany()
   * 
   * // Get first 10 Certificates
   * const certificates = await prisma.certificate.findMany({ take: 10 })
   * 
   * // Only select the `certificate_id`
   * const certificateWithCertificate_idOnly = await prisma.certificate.findMany({ select: { certificate_id: true } })
   * 
   */
  findMany<T extends CertificateFindManyArgs>(args?: Prisma.SelectSubset<T, CertificateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  /**
   * Create a Certificate.
   * @param {CertificateCreateArgs} args - Arguments to create a Certificate.
   * @example
   * // Create one Certificate
   * const Certificate = await prisma.certificate.create({
   *   data: {
   *     // ... data to create a Certificate
   *   }
   * })
   * 
   */
  create<T extends CertificateCreateArgs>(args: Prisma.SelectSubset<T, CertificateCreateArgs<ExtArgs>>): Prisma.Prisma__CertificateClient<runtime.Types.Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Create many Certificates.
   * @param {CertificateCreateManyArgs} args - Arguments to create many Certificates.
   * @example
   * // Create many Certificates
   * const certificate = await prisma.certificate.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   *     
   */
  createMany<T extends CertificateCreateManyArgs>(args?: Prisma.SelectSubset<T, CertificateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Delete a Certificate.
   * @param {CertificateDeleteArgs} args - Arguments to delete one Certificate.
   * @example
   * // Delete one Certificate
   * const Certificate = await prisma.certificate.delete({
   *   where: {
   *     // ... filter to delete one Certificate
   *   }
   * })
   * 
   */
  delete<T extends CertificateDeleteArgs>(args: Prisma.SelectSubset<T, CertificateDeleteArgs<ExtArgs>>): Prisma.Prisma__CertificateClient<runtime.Types.Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Update one Certificate.
   * @param {CertificateUpdateArgs} args - Arguments to update one Certificate.
   * @example
   * // Update one Certificate
   * const certificate = await prisma.certificate.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends CertificateUpdateArgs>(args: Prisma.SelectSubset<T, CertificateUpdateArgs<ExtArgs>>): Prisma.Prisma__CertificateClient<runtime.Types.Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Delete zero or more Certificates.
   * @param {CertificateDeleteManyArgs} args - Arguments to filter Certificates to delete.
   * @example
   * // Delete a few Certificates
   * const { count } = await prisma.certificate.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany<T extends CertificateDeleteManyArgs>(args?: Prisma.SelectSubset<T, CertificateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Update zero or more Certificates.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CertificateUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Certificates
   * const certificate = await prisma.certificate.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany<T extends CertificateUpdateManyArgs>(args: Prisma.SelectSubset<T, CertificateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Create or update one Certificate.
   * @param {CertificateUpsertArgs} args - Arguments to update or create a Certificate.
   * @example
   * // Update or create a Certificate
   * const certificate = await prisma.certificate.upsert({
   *   create: {
   *     // ... data to create a Certificate
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Certificate we want to update
   *   }
   * })
   */
  upsert<T extends CertificateUpsertArgs>(args: Prisma.SelectSubset<T, CertificateUpsertArgs<ExtArgs>>): Prisma.Prisma__CertificateClient<runtime.Types.Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


  /**
   * Count the number of Certificates.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CertificateCountArgs} args - Arguments to filter Certificates to count.
   * @example
   * // Count the number of Certificates
   * const count = await prisma.certificate.count({
   *   where: {
   *     // ... the filter for the Certificates we want to count
   *   }
   * })
  **/
  count<T extends CertificateCountArgs>(
    args?: Prisma.Subset<T, CertificateCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], CertificateCountAggregateOutputType>
      : number
  >

  /**
   * Allows you to perform aggregations operations on a Certificate.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CertificateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Ordered by age ascending
   * // Where email contains prisma.io
   * // Limited to the 10 users
   * const aggregations = await prisma.user.aggregate({
   *   _avg: {
   *     age: true,
   *   },
   *   where: {
   *     email: {
   *       contains: "prisma.io",
   *     },
   *   },
   *   orderBy: {
   *     age: "asc",
   *   },
   *   take: 10,
   * })
  **/
  aggregate<T extends CertificateAggregateArgs>(args: Prisma.Subset<T, CertificateAggregateArgs>): Prisma.PrismaPromise<GetCertificateAggregateType<T>>

  /**
   * Group by Certificate.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {CertificateGroupByArgs} args - Group by arguments.
   * @example
   * // Group by city, order by createdAt, get count
   * const result = await prisma.user.groupBy({
   *   by: ['city', 'createdAt'],
   *   orderBy: {
   *     createdAt: true
   *   },
   *   _count: {
   *     _all: true
   *   },
   * })
   * 
  **/
  groupBy<
    T extends CertificateGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: CertificateGroupByArgs['orderBy'] }
      : { orderBy?: CertificateGroupByArgs['orderBy'] },
    OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>,
    ByFields extends Prisma.MaybeTupleToUnion<T['by']>,
    ByValid extends Prisma.Has<ByFields, OrderFields>,
    HavingFields extends Prisma.GetHavingFields<T['having']>,
    HavingValid extends Prisma.Has<ByFields, HavingFields>,
    ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False,
    InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
          ? never
          : P extends string
          ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
          : [
              Error,
              'Field ',
              P,
              ` in "having" needs to be provided in "by"`,
            ]
      }[HavingFields]
    : 'take' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
          ? never
          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
      }[OrderFields]
  >(args: Prisma.SubsetIntersection<T, CertificateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCertificateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
/**
 * Fields of the Certificate model
 */
readonly fields: CertificateFieldRefs;
}

/**
 * The delegate class that acts as a "Promise-like" for Certificate.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__CertificateClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  roadmap<T extends Prisma.RoadmapDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RoadmapDefaultArgs<ExtArgs>>): Prisma.Prisma__RoadmapClient<runtime.Types.Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}




/**
 * Fields of the Certificate model
 */
export interface CertificateFieldRefs {
  readonly certificate_id: Prisma.FieldRef<"Certificate", 'String'>
  readonly user_id: Prisma.FieldRef<"Certificate", 'String'>
  readonly roadmap_id: Prisma.FieldRef<"Certificate", 'String'>
  readonly certificate_name: Prisma.FieldRef<"Certificate", 'String'>
  readonly issue_date: Prisma.FieldRef<"Certificate", 'DateTime'>
  readonly pdf_url: Prisma.FieldRef<"Certificate", 'String'>
}
    

// Custom InputTypes
/**
 * Certificate findUnique
 */
export type CertificateFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Certificate
   */
  select?: Prisma.CertificateSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Certificate
   */
  omit?: Prisma.CertificateOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CertificateInclude<ExtArgs> | null
  /**
   * Filter, which Certificate to fetch.
   */
  where: Prisma.CertificateWhereUniqueInput
}

/**
 * Certificate findUniqueOrThrow
 */
export type CertificateFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Certificate
   */
  select?: Prisma.CertificateSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Certificate
   */
  omit?: Prisma.CertificateOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CertificateInclude<ExtArgs> | null
  /**
   * Filter, which Certificate to fetch.
   */
  where: Prisma.CertificateWhereUniqueInput
}

/**
 * Certificate findFirst
 */
export type CertificateFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Certificate
   */
  select?: Prisma.CertificateSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Certificate
   */
  omit?: Prisma.CertificateOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CertificateInclude<ExtArgs> | null
  /**
   * Filter, which Certificate to fetch.
   */
  where?: Prisma.CertificateWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Certificates to fetch.
   */
  orderBy?: Prisma.CertificateOrderByWithRelationInput | Prisma.CertificateOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for Certificates.
   */
  cursor?: Prisma.CertificateWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Certificates from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Certificates.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of Certificates.
   */
  distinct?: Prisma.CertificateScalarFieldEnum | Prisma.CertificateScalarFieldEnum[]
}

/**
 * Certificate findFirstOrThrow
 */
export type CertificateFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Certificate
   */
  select?: Prisma.CertificateSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Certificate
   */
  omit?: Prisma.CertificateOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CertificateInclude<ExtArgs> | null
  /**
   * Filter, which Certificate to fetch.
   */
  where?: Prisma.CertificateWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Certificates to fetch.
   */
  orderBy?: Prisma.CertificateOrderByWithRelationInput | Prisma.CertificateOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for Certificates.
   */
  cursor?: Prisma.CertificateWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Certificates from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Certificates.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of Certificates.
   */
  distinct?: Prisma.CertificateScalarFieldEnum | Prisma.CertificateScalarFieldEnum[]
}

/**
 * Certificate findMany
 */
export type CertificateFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Certificate
   */
  select?: Prisma.CertificateSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Certificate
   */
  omit?: Prisma.CertificateOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CertificateInclude<ExtArgs> | null
  /**
   * Filter, which Certificates to fetch.
   */
  where?: Prisma.CertificateWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Certificates to fetch.
   */
  orderBy?: Prisma.CertificateOrderByWithRelationInput | Prisma.CertificateOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for listing Certificates.
   */
  cursor?: Prisma.CertificateWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Certificates from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Certificates.
   */
  skip?: number
  distinct?: Prisma.CertificateScalarFieldEnum | Prisma.CertificateScalarFieldEnum[]
}

/**
 * Certificate create
 */
export type CertificateCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Certificate
   */
  select?: Prisma.CertificateSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Certificate
   */
  omit?: Prisma.CertificateOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CertificateInclude<ExtArgs> | null
  /**
   * The data needed to create a Certificate.
   */
  data: Prisma.XOR<Prisma.CertificateCreateInput, Prisma.CertificateUncheckedCreateInput>
}

/**
 * Certificate createMany
 */
export type CertificateCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to create many Certificates.
   */
  data: Prisma.CertificateCreateManyInput | Prisma.CertificateCreateManyInput[]
  skipDuplicates?: boolean
}

/**
 * Certificate update
 */
export type CertificateUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Certificate
   */
  select?: Prisma.CertificateSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Certificate
   */
  omit?: Prisma.CertificateOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CertificateInclude<ExtArgs> | null
  /**
   * The data needed to update a Certificate.
   */
  data: Prisma.XOR<Prisma.CertificateUpdateInput, Prisma.CertificateUncheckedUpdateInput>
  /**
   * Choose, which Certificate to update.
   */
  where: Prisma.CertificateWhereUniqueInput
}

/**
 * Certificate updateMany
 */
export type CertificateUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to update Certificates.
   */
  data: Prisma.XOR<Prisma.CertificateUpdateManyMutationInput, Prisma.CertificateUncheckedUpdateManyInput>
  /**
   * Filter which Certificates to update
   */
  where?: Prisma.CertificateWhereInput
  /**
   * Limit how many Certificates to update.
   */
  limit?: number
}

/**
 * Certificate upsert
 */
export type CertificateUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Certificate
   */
  select?: Prisma.CertificateSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Certificate
   */
  omit?: Prisma.CertificateOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CertificateInclude<ExtArgs> | null
  /**
   * The filter to search for the Certificate to update in case it exists.
   */
  where: Prisma.CertificateWhereUniqueInput
  /**
   * In case the Certificate found by the `where` argument doesn't exist, create a new Certificate with this data.
   */
  create: Prisma.XOR<Prisma.CertificateCreateInput, Prisma.CertificateUncheckedCreateInput>
  /**
   * In case the Certificate was found with the provided `where` argument, update it with this data.
   */
  update: Prisma.XOR<Prisma.CertificateUpdateInput, Prisma.CertificateUncheckedUpdateInput>
}

/**
 * Certificate delete
 */
export type CertificateDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Certificate
   */
  select?: Prisma.CertificateSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Certificate
   */
  omit?: Prisma.CertificateOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CertificateInclude<ExtArgs> | null
  /**
   * Filter which Certificate to delete.
   */
  where: Prisma.CertificateWhereUniqueInput
}

/**
 * Certificate deleteMany
 */
export type CertificateDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which Certificates to delete
   */
  where?: Prisma.CertificateWhereInput
  /**
   * Limit how many Certificates to delete.
   */
  limit?: number
}

/**
 * Certificate without action
 */
export type CertificateDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Certificate
   */
  select?: Prisma.CertificateSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Certificate
   */
  omit?: Prisma.CertificateOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CertificateInclude<ExtArgs> | null
}

```

## File: src/generated/prisma/models/Exercise.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file exports the `Exercise` model and its related types.
 *
 * 🟢 You can import this file directly.
 */
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"

/**
 * Model Exercise
 * 
 */
export type ExerciseModel = runtime.Types.Result.DefaultSelection<Prisma.$ExercisePayload>

export type AggregateExercise = {
  _count: ExerciseCountAggregateOutputType | null
  _min: ExerciseMinAggregateOutputType | null
  _max: ExerciseMaxAggregateOutputType | null
}

export type ExerciseMinAggregateOutputType = {
  exercise_id: string | null
  module_id: string | null
  title: string | null
  description: string | null
  starter_code: string | null
  solution_code: string | null
  difficulty: $Enums.Difficulty | null
  created_at: Date | null
  updated_at: Date | null
}

export type ExerciseMaxAggregateOutputType = {
  exercise_id: string | null
  module_id: string | null
  title: string | null
  description: string | null
  starter_code: string | null
  solution_code: string | null
  difficulty: $Enums.Difficulty | null
  created_at: Date | null
  updated_at: Date | null
}

export type ExerciseCountAggregateOutputType = {
  exercise_id: number
  module_id: number
  title: number
  description: number
  examples: number
  starter_code: number
  solution_code: number
  difficulty: number
  created_at: number
  updated_at: number
  _all: number
}


export type ExerciseMinAggregateInputType = {
  exercise_id?: true
  module_id?: true
  title?: true
  description?: true
  starter_code?: true
  solution_code?: true
  difficulty?: true
  created_at?: true
  updated_at?: true
}

export type ExerciseMaxAggregateInputType = {
  exercise_id?: true
  module_id?: true
  title?: true
  description?: true
  starter_code?: true
  solution_code?: true
  difficulty?: true
  created_at?: true
  updated_at?: true
}

export type ExerciseCountAggregateInputType = {
  exercise_id?: true
  module_id?: true
  title?: true
  description?: true
  examples?: true
  starter_code?: true
  solution_code?: true
  difficulty?: true
  created_at?: true
  updated_at?: true
  _all?: true
}

export type ExerciseAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which Exercise to aggregate.
   */
  where?: Prisma.ExerciseWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Exercises to fetch.
   */
  orderBy?: Prisma.ExerciseOrderByWithRelationInput | Prisma.ExerciseOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the start position
   */
  cursor?: Prisma.ExerciseWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Exercises from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Exercises.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Count returned Exercises
  **/
  _count?: true | ExerciseCountAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the minimum value
  **/
  _min?: ExerciseMinAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the maximum value
  **/
  _max?: ExerciseMaxAggregateInputType
}

export type GetExerciseAggregateType<T extends ExerciseAggregateArgs> = {
      [P in keyof T & keyof AggregateExercise]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateExercise[P]>
    : Prisma.GetScalarType<T[P], AggregateExercise[P]>
}




export type ExerciseGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.ExerciseWhereInput
  orderBy?: Prisma.ExerciseOrderByWithAggregationInput | Prisma.ExerciseOrderByWithAggregationInput[]
  by: Prisma.ExerciseScalarFieldEnum[] | Prisma.ExerciseScalarFieldEnum
  having?: Prisma.ExerciseScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: ExerciseCountAggregateInputType | true
  _min?: ExerciseMinAggregateInputType
  _max?: ExerciseMaxAggregateInputType
}

export type ExerciseGroupByOutputType = {
  exercise_id: string
  module_id: string
  title: string
  description: string
  examples: runtime.JsonValue | null
  starter_code: string | null
  solution_code: string | null
  difficulty: $Enums.Difficulty
  created_at: Date
  updated_at: Date
  _count: ExerciseCountAggregateOutputType | null
  _min: ExerciseMinAggregateOutputType | null
  _max: ExerciseMaxAggregateOutputType | null
}

type GetExerciseGroupByPayload<T extends ExerciseGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<ExerciseGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof ExerciseGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], ExerciseGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], ExerciseGroupByOutputType[P]>
      }
    >
  >



export type ExerciseWhereInput = {
  AND?: Prisma.ExerciseWhereInput | Prisma.ExerciseWhereInput[]
  OR?: Prisma.ExerciseWhereInput[]
  NOT?: Prisma.ExerciseWhereInput | Prisma.ExerciseWhereInput[]
  exercise_id?: Prisma.StringFilter<"Exercise"> | string
  module_id?: Prisma.StringFilter<"Exercise"> | string
  title?: Prisma.StringFilter<"Exercise"> | string
  description?: Prisma.StringFilter<"Exercise"> | string
  examples?: Prisma.JsonNullableFilter<"Exercise">
  starter_code?: Prisma.StringNullableFilter<"Exercise"> | string | null
  solution_code?: Prisma.StringNullableFilter<"Exercise"> | string | null
  difficulty?: Prisma.EnumDifficultyFilter<"Exercise"> | $Enums.Difficulty
  created_at?: Prisma.DateTimeFilter<"Exercise"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"Exercise"> | Date | string
  module?: Prisma.XOR<Prisma.ModuleScalarRelationFilter, Prisma.ModuleWhereInput>
  submissions?: Prisma.ExerciseSubmissionListRelationFilter
}

export type ExerciseOrderByWithRelationInput = {
  exercise_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  examples?: Prisma.SortOrderInput | Prisma.SortOrder
  starter_code?: Prisma.SortOrderInput | Prisma.SortOrder
  solution_code?: Prisma.SortOrderInput | Prisma.SortOrder
  difficulty?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
  module?: Prisma.ModuleOrderByWithRelationInput
  submissions?: Prisma.ExerciseSubmissionOrderByRelationAggregateInput
  _relevance?: Prisma.ExerciseOrderByRelevanceInput
}

export type ExerciseWhereUniqueInput = Prisma.AtLeast<{
  exercise_id?: string
  AND?: Prisma.ExerciseWhereInput | Prisma.ExerciseWhereInput[]
  OR?: Prisma.ExerciseWhereInput[]
  NOT?: Prisma.ExerciseWhereInput | Prisma.ExerciseWhereInput[]
  module_id?: Prisma.StringFilter<"Exercise"> | string
  title?: Prisma.StringFilter<"Exercise"> | string
  description?: Prisma.StringFilter<"Exercise"> | string
  examples?: Prisma.JsonNullableFilter<"Exercise">
  starter_code?: Prisma.StringNullableFilter<"Exercise"> | string | null
  solution_code?: Prisma.StringNullableFilter<"Exercise"> | string | null
  difficulty?: Prisma.EnumDifficultyFilter<"Exercise"> | $Enums.Difficulty
  created_at?: Prisma.DateTimeFilter<"Exercise"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"Exercise"> | Date | string
  module?: Prisma.XOR<Prisma.ModuleScalarRelationFilter, Prisma.ModuleWhereInput>
  submissions?: Prisma.ExerciseSubmissionListRelationFilter
}, "exercise_id">

export type ExerciseOrderByWithAggregationInput = {
  exercise_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  examples?: Prisma.SortOrderInput | Prisma.SortOrder
  starter_code?: Prisma.SortOrderInput | Prisma.SortOrder
  solution_code?: Prisma.SortOrderInput | Prisma.SortOrder
  difficulty?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
  _count?: Prisma.ExerciseCountOrderByAggregateInput
  _max?: Prisma.ExerciseMaxOrderByAggregateInput
  _min?: Prisma.ExerciseMinOrderByAggregateInput
}

export type ExerciseScalarWhereWithAggregatesInput = {
  AND?: Prisma.ExerciseScalarWhereWithAggregatesInput | Prisma.ExerciseScalarWhereWithAggregatesInput[]
  OR?: Prisma.ExerciseScalarWhereWithAggregatesInput[]
  NOT?: Prisma.ExerciseScalarWhereWithAggregatesInput | Prisma.ExerciseScalarWhereWithAggregatesInput[]
  exercise_id?: Prisma.StringWithAggregatesFilter<"Exercise"> | string
  module_id?: Prisma.StringWithAggregatesFilter<"Exercise"> | string
  title?: Prisma.StringWithAggregatesFilter<"Exercise"> | string
  description?: Prisma.StringWithAggregatesFilter<"Exercise"> | string
  examples?: Prisma.JsonNullableWithAggregatesFilter<"Exercise">
  starter_code?: Prisma.StringNullableWithAggregatesFilter<"Exercise"> | string | null
  solution_code?: Prisma.StringNullableWithAggregatesFilter<"Exercise"> | string | null
  difficulty?: Prisma.EnumDifficultyWithAggregatesFilter<"Exercise"> | $Enums.Difficulty
  created_at?: Prisma.DateTimeWithAggregatesFilter<"Exercise"> | Date | string
  updated_at?: Prisma.DateTimeWithAggregatesFilter<"Exercise"> | Date | string
}

export type ExerciseCreateInput = {
  exercise_id?: string
  title: string
  description: string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: string | null
  solution_code?: string | null
  difficulty?: $Enums.Difficulty
  created_at?: Date | string
  updated_at?: Date | string
  module: Prisma.ModuleCreateNestedOneWithoutExercisesInput
  submissions?: Prisma.ExerciseSubmissionCreateNestedManyWithoutExerciseInput
}

export type ExerciseUncheckedCreateInput = {
  exercise_id?: string
  module_id: string
  title: string
  description: string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: string | null
  solution_code?: string | null
  difficulty?: $Enums.Difficulty
  created_at?: Date | string
  updated_at?: Date | string
  submissions?: Prisma.ExerciseSubmissionUncheckedCreateNestedManyWithoutExerciseInput
}

export type ExerciseUpdateInput = {
  exercise_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.StringFieldUpdateOperationsInput | string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  solution_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  difficulty?: Prisma.EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  module?: Prisma.ModuleUpdateOneRequiredWithoutExercisesNestedInput
  submissions?: Prisma.ExerciseSubmissionUpdateManyWithoutExerciseNestedInput
}

export type ExerciseUncheckedUpdateInput = {
  exercise_id?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.StringFieldUpdateOperationsInput | string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  solution_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  difficulty?: Prisma.EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  submissions?: Prisma.ExerciseSubmissionUncheckedUpdateManyWithoutExerciseNestedInput
}

export type ExerciseCreateManyInput = {
  exercise_id?: string
  module_id: string
  title: string
  description: string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: string | null
  solution_code?: string | null
  difficulty?: $Enums.Difficulty
  created_at?: Date | string
  updated_at?: Date | string
}

export type ExerciseUpdateManyMutationInput = {
  exercise_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.StringFieldUpdateOperationsInput | string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  solution_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  difficulty?: Prisma.EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type ExerciseUncheckedUpdateManyInput = {
  exercise_id?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.StringFieldUpdateOperationsInput | string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  solution_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  difficulty?: Prisma.EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type ExerciseListRelationFilter = {
  every?: Prisma.ExerciseWhereInput
  some?: Prisma.ExerciseWhereInput
  none?: Prisma.ExerciseWhereInput
}

export type ExerciseOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type ExerciseOrderByRelevanceInput = {
  fields: Prisma.ExerciseOrderByRelevanceFieldEnum | Prisma.ExerciseOrderByRelevanceFieldEnum[]
  sort: Prisma.SortOrder
  search: string
}

export type ExerciseCountOrderByAggregateInput = {
  exercise_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  examples?: Prisma.SortOrder
  starter_code?: Prisma.SortOrder
  solution_code?: Prisma.SortOrder
  difficulty?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type ExerciseMaxOrderByAggregateInput = {
  exercise_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  starter_code?: Prisma.SortOrder
  solution_code?: Prisma.SortOrder
  difficulty?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type ExerciseMinOrderByAggregateInput = {
  exercise_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  starter_code?: Prisma.SortOrder
  solution_code?: Prisma.SortOrder
  difficulty?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type ExerciseScalarRelationFilter = {
  is?: Prisma.ExerciseWhereInput
  isNot?: Prisma.ExerciseWhereInput
}

export type ExerciseCreateNestedManyWithoutModuleInput = {
  create?: Prisma.XOR<Prisma.ExerciseCreateWithoutModuleInput, Prisma.ExerciseUncheckedCreateWithoutModuleInput> | Prisma.ExerciseCreateWithoutModuleInput[] | Prisma.ExerciseUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.ExerciseCreateOrConnectWithoutModuleInput | Prisma.ExerciseCreateOrConnectWithoutModuleInput[]
  createMany?: Prisma.ExerciseCreateManyModuleInputEnvelope
  connect?: Prisma.ExerciseWhereUniqueInput | Prisma.ExerciseWhereUniqueInput[]
}

export type ExerciseUncheckedCreateNestedManyWithoutModuleInput = {
  create?: Prisma.XOR<Prisma.ExerciseCreateWithoutModuleInput, Prisma.ExerciseUncheckedCreateWithoutModuleInput> | Prisma.ExerciseCreateWithoutModuleInput[] | Prisma.ExerciseUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.ExerciseCreateOrConnectWithoutModuleInput | Prisma.ExerciseCreateOrConnectWithoutModuleInput[]
  createMany?: Prisma.ExerciseCreateManyModuleInputEnvelope
  connect?: Prisma.ExerciseWhereUniqueInput | Prisma.ExerciseWhereUniqueInput[]
}

export type ExerciseUpdateManyWithoutModuleNestedInput = {
  create?: Prisma.XOR<Prisma.ExerciseCreateWithoutModuleInput, Prisma.ExerciseUncheckedCreateWithoutModuleInput> | Prisma.ExerciseCreateWithoutModuleInput[] | Prisma.ExerciseUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.ExerciseCreateOrConnectWithoutModuleInput | Prisma.ExerciseCreateOrConnectWithoutModuleInput[]
  upsert?: Prisma.ExerciseUpsertWithWhereUniqueWithoutModuleInput | Prisma.ExerciseUpsertWithWhereUniqueWithoutModuleInput[]
  createMany?: Prisma.ExerciseCreateManyModuleInputEnvelope
  set?: Prisma.ExerciseWhereUniqueInput | Prisma.ExerciseWhereUniqueInput[]
  disconnect?: Prisma.ExerciseWhereUniqueInput | Prisma.ExerciseWhereUniqueInput[]
  delete?: Prisma.ExerciseWhereUniqueInput | Prisma.ExerciseWhereUniqueInput[]
  connect?: Prisma.ExerciseWhereUniqueInput | Prisma.ExerciseWhereUniqueInput[]
  update?: Prisma.ExerciseUpdateWithWhereUniqueWithoutModuleInput | Prisma.ExerciseUpdateWithWhereUniqueWithoutModuleInput[]
  updateMany?: Prisma.ExerciseUpdateManyWithWhereWithoutModuleInput | Prisma.ExerciseUpdateManyWithWhereWithoutModuleInput[]
  deleteMany?: Prisma.ExerciseScalarWhereInput | Prisma.ExerciseScalarWhereInput[]
}

export type ExerciseUncheckedUpdateManyWithoutModuleNestedInput = {
  create?: Prisma.XOR<Prisma.ExerciseCreateWithoutModuleInput, Prisma.ExerciseUncheckedCreateWithoutModuleInput> | Prisma.ExerciseCreateWithoutModuleInput[] | Prisma.ExerciseUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.ExerciseCreateOrConnectWithoutModuleInput | Prisma.ExerciseCreateOrConnectWithoutModuleInput[]
  upsert?: Prisma.ExerciseUpsertWithWhereUniqueWithoutModuleInput | Prisma.ExerciseUpsertWithWhereUniqueWithoutModuleInput[]
  createMany?: Prisma.ExerciseCreateManyModuleInputEnvelope
  set?: Prisma.ExerciseWhereUniqueInput | Prisma.ExerciseWhereUniqueInput[]
  disconnect?: Prisma.ExerciseWhereUniqueInput | Prisma.ExerciseWhereUniqueInput[]
  delete?: Prisma.ExerciseWhereUniqueInput | Prisma.ExerciseWhereUniqueInput[]
  connect?: Prisma.ExerciseWhereUniqueInput | Prisma.ExerciseWhereUniqueInput[]
  update?: Prisma.ExerciseUpdateWithWhereUniqueWithoutModuleInput | Prisma.ExerciseUpdateWithWhereUniqueWithoutModuleInput[]
  updateMany?: Prisma.ExerciseUpdateManyWithWhereWithoutModuleInput | Prisma.ExerciseUpdateManyWithWhereWithoutModuleInput[]
  deleteMany?: Prisma.ExerciseScalarWhereInput | Prisma.ExerciseScalarWhereInput[]
}

export type EnumDifficultyFieldUpdateOperationsInput = {
  set?: $Enums.Difficulty
}

export type ExerciseCreateNestedOneWithoutSubmissionsInput = {
  create?: Prisma.XOR<Prisma.ExerciseCreateWithoutSubmissionsInput, Prisma.ExerciseUncheckedCreateWithoutSubmissionsInput>
  connectOrCreate?: Prisma.ExerciseCreateOrConnectWithoutSubmissionsInput
  connect?: Prisma.ExerciseWhereUniqueInput
}

export type ExerciseUpdateOneRequiredWithoutSubmissionsNestedInput = {
  create?: Prisma.XOR<Prisma.ExerciseCreateWithoutSubmissionsInput, Prisma.ExerciseUncheckedCreateWithoutSubmissionsInput>
  connectOrCreate?: Prisma.ExerciseCreateOrConnectWithoutSubmissionsInput
  upsert?: Prisma.ExerciseUpsertWithoutSubmissionsInput
  connect?: Prisma.ExerciseWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.ExerciseUpdateToOneWithWhereWithoutSubmissionsInput, Prisma.ExerciseUpdateWithoutSubmissionsInput>, Prisma.ExerciseUncheckedUpdateWithoutSubmissionsInput>
}

export type ExerciseCreateWithoutModuleInput = {
  exercise_id?: string
  title: string
  description: string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: string | null
  solution_code?: string | null
  difficulty?: $Enums.Difficulty
  created_at?: Date | string
  updated_at?: Date | string
  submissions?: Prisma.ExerciseSubmissionCreateNestedManyWithoutExerciseInput
}

export type ExerciseUncheckedCreateWithoutModuleInput = {
  exercise_id?: string
  title: string
  description: string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: string | null
  solution_code?: string | null
  difficulty?: $Enums.Difficulty
  created_at?: Date | string
  updated_at?: Date | string
  submissions?: Prisma.ExerciseSubmissionUncheckedCreateNestedManyWithoutExerciseInput
}

export type ExerciseCreateOrConnectWithoutModuleInput = {
  where: Prisma.ExerciseWhereUniqueInput
  create: Prisma.XOR<Prisma.ExerciseCreateWithoutModuleInput, Prisma.ExerciseUncheckedCreateWithoutModuleInput>
}

export type ExerciseCreateManyModuleInputEnvelope = {
  data: Prisma.ExerciseCreateManyModuleInput | Prisma.ExerciseCreateManyModuleInput[]
  skipDuplicates?: boolean
}

export type ExerciseUpsertWithWhereUniqueWithoutModuleInput = {
  where: Prisma.ExerciseWhereUniqueInput
  update: Prisma.XOR<Prisma.ExerciseUpdateWithoutModuleInput, Prisma.ExerciseUncheckedUpdateWithoutModuleInput>
  create: Prisma.XOR<Prisma.ExerciseCreateWithoutModuleInput, Prisma.ExerciseUncheckedCreateWithoutModuleInput>
}

export type ExerciseUpdateWithWhereUniqueWithoutModuleInput = {
  where: Prisma.ExerciseWhereUniqueInput
  data: Prisma.XOR<Prisma.ExerciseUpdateWithoutModuleInput, Prisma.ExerciseUncheckedUpdateWithoutModuleInput>
}

export type ExerciseUpdateManyWithWhereWithoutModuleInput = {
  where: Prisma.ExerciseScalarWhereInput
  data: Prisma.XOR<Prisma.ExerciseUpdateManyMutationInput, Prisma.ExerciseUncheckedUpdateManyWithoutModuleInput>
}

export type ExerciseScalarWhereInput = {
  AND?: Prisma.ExerciseScalarWhereInput | Prisma.ExerciseScalarWhereInput[]
  OR?: Prisma.ExerciseScalarWhereInput[]
  NOT?: Prisma.ExerciseScalarWhereInput | Prisma.ExerciseScalarWhereInput[]
  exercise_id?: Prisma.StringFilter<"Exercise"> | string
  module_id?: Prisma.StringFilter<"Exercise"> | string
  title?: Prisma.StringFilter<"Exercise"> | string
  description?: Prisma.StringFilter<"Exercise"> | string
  examples?: Prisma.JsonNullableFilter<"Exercise">
  starter_code?: Prisma.StringNullableFilter<"Exercise"> | string | null
  solution_code?: Prisma.StringNullableFilter<"Exercise"> | string | null
  difficulty?: Prisma.EnumDifficultyFilter<"Exercise"> | $Enums.Difficulty
  created_at?: Prisma.DateTimeFilter<"Exercise"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"Exercise"> | Date | string
}

export type ExerciseCreateWithoutSubmissionsInput = {
  exercise_id?: string
  title: string
  description: string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: string | null
  solution_code?: string | null
  difficulty?: $Enums.Difficulty
  created_at?: Date | string
  updated_at?: Date | string
  module: Prisma.ModuleCreateNestedOneWithoutExercisesInput
}

export type ExerciseUncheckedCreateWithoutSubmissionsInput = {
  exercise_id?: string
  module_id: string
  title: string
  description: string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: string | null
  solution_code?: string | null
  difficulty?: $Enums.Difficulty
  created_at?: Date | string
  updated_at?: Date | string
}

export type ExerciseCreateOrConnectWithoutSubmissionsInput = {
  where: Prisma.ExerciseWhereUniqueInput
  create: Prisma.XOR<Prisma.ExerciseCreateWithoutSubmissionsInput, Prisma.ExerciseUncheckedCreateWithoutSubmissionsInput>
}

export type ExerciseUpsertWithoutSubmissionsInput = {
  update: Prisma.XOR<Prisma.ExerciseUpdateWithoutSubmissionsInput, Prisma.ExerciseUncheckedUpdateWithoutSubmissionsInput>
  create: Prisma.XOR<Prisma.ExerciseCreateWithoutSubmissionsInput, Prisma.ExerciseUncheckedCreateWithoutSubmissionsInput>
  where?: Prisma.ExerciseWhereInput
}

export type ExerciseUpdateToOneWithWhereWithoutSubmissionsInput = {
  where?: Prisma.ExerciseWhereInput
  data: Prisma.XOR<Prisma.ExerciseUpdateWithoutSubmissionsInput, Prisma.ExerciseUncheckedUpdateWithoutSubmissionsInput>
}

export type ExerciseUpdateWithoutSubmissionsInput = {
  exercise_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.StringFieldUpdateOperationsInput | string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  solution_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  difficulty?: Prisma.EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  module?: Prisma.ModuleUpdateOneRequiredWithoutExercisesNestedInput
}

export type ExerciseUncheckedUpdateWithoutSubmissionsInput = {
  exercise_id?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.StringFieldUpdateOperationsInput | string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  solution_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  difficulty?: Prisma.EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type ExerciseCreateManyModuleInput = {
  exercise_id?: string
  title: string
  description: string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: string | null
  solution_code?: string | null
  difficulty?: $Enums.Difficulty
  created_at?: Date | string
  updated_at?: Date | string
}

export type ExerciseUpdateWithoutModuleInput = {
  exercise_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.StringFieldUpdateOperationsInput | string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  solution_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  difficulty?: Prisma.EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  submissions?: Prisma.ExerciseSubmissionUpdateManyWithoutExerciseNestedInput
}

export type ExerciseUncheckedUpdateWithoutModuleInput = {
  exercise_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.StringFieldUpdateOperationsInput | string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  solution_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  difficulty?: Prisma.EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  submissions?: Prisma.ExerciseSubmissionUncheckedUpdateManyWithoutExerciseNestedInput
}

export type ExerciseUncheckedUpdateManyWithoutModuleInput = {
  exercise_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.StringFieldUpdateOperationsInput | string
  examples?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  starter_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  solution_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  difficulty?: Prisma.EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}


/**
 * Count Type ExerciseCountOutputType
 */

export type ExerciseCountOutputType = {
  submissions: number
}

export type ExerciseCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  submissions?: boolean | ExerciseCountOutputTypeCountSubmissionsArgs
}

/**
 * ExerciseCountOutputType without action
 */
export type ExerciseCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ExerciseCountOutputType
   */
  select?: Prisma.ExerciseCountOutputTypeSelect<ExtArgs> | null
}

/**
 * ExerciseCountOutputType without action
 */
export type ExerciseCountOutputTypeCountSubmissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.ExerciseSubmissionWhereInput
}


export type ExerciseSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  exercise_id?: boolean
  module_id?: boolean
  title?: boolean
  description?: boolean
  examples?: boolean
  starter_code?: boolean
  solution_code?: boolean
  difficulty?: boolean
  created_at?: boolean
  updated_at?: boolean
  module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>
  submissions?: boolean | Prisma.Exercise$submissionsArgs<ExtArgs>
  _count?: boolean | Prisma.ExerciseCountOutputTypeDefaultArgs<ExtArgs>
}, ExtArgs["result"]["exercise"]>



export type ExerciseSelectScalar = {
  exercise_id?: boolean
  module_id?: boolean
  title?: boolean
  description?: boolean
  examples?: boolean
  starter_code?: boolean
  solution_code?: boolean
  difficulty?: boolean
  created_at?: boolean
  updated_at?: boolean
}

export type ExerciseOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"exercise_id" | "module_id" | "title" | "description" | "examples" | "starter_code" | "solution_code" | "difficulty" | "created_at" | "updated_at", ExtArgs["result"]["exercise"]>
export type ExerciseInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>
  submissions?: boolean | Prisma.Exercise$submissionsArgs<ExtArgs>
  _count?: boolean | Prisma.ExerciseCountOutputTypeDefaultArgs<ExtArgs>
}

export type $ExercisePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "Exercise"
  objects: {
    module: Prisma.$ModulePayload<ExtArgs>
    submissions: Prisma.$ExerciseSubmissionPayload<ExtArgs>[]
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    exercise_id: string
    module_id: string
    title: string
    description: string
    examples: runtime.JsonValue | null
    starter_code: string | null
    solution_code: string | null
    difficulty: $Enums.Difficulty
    created_at: Date
    updated_at: Date
  }, ExtArgs["result"]["exercise"]>
  composites: {}
}

export type ExerciseGetPayload<S extends boolean | null | undefined | ExerciseDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ExercisePayload, S>

export type ExerciseCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<ExerciseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ExerciseCountAggregateInputType | true
  }

export interface ExerciseDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Exercise'], meta: { name: 'Exercise' } }
  /**
   * Find zero or one Exercise that matches the filter.
   * @param {ExerciseFindUniqueArgs} args - Arguments to find a Exercise
   * @example
   * // Get one Exercise
   * const exercise = await prisma.exercise.findUnique({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUnique<T extends ExerciseFindUniqueArgs>(args: Prisma.SelectSubset<T, ExerciseFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ExerciseClient<runtime.Types.Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find one Exercise that matches the filter or throw an error with `error.code='P2025'`
   * if no matches were found.
   * @param {ExerciseFindUniqueOrThrowArgs} args - Arguments to find a Exercise
   * @example
   * // Get one Exercise
   * const exercise = await prisma.exercise.findUniqueOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUniqueOrThrow<T extends ExerciseFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ExerciseFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ExerciseClient<runtime.Types.Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first Exercise that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseFindFirstArgs} args - Arguments to find a Exercise
   * @example
   * // Get one Exercise
   * const exercise = await prisma.exercise.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends ExerciseFindFirstArgs>(args?: Prisma.SelectSubset<T, ExerciseFindFirstArgs<ExtArgs>>): Prisma.Prisma__ExerciseClient<runtime.Types.Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first Exercise that matches the filter or
   * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseFindFirstOrThrowArgs} args - Arguments to find a Exercise
   * @example
   * // Get one Exercise
   * const exercise = await prisma.exercise.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends ExerciseFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ExerciseFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ExerciseClient<runtime.Types.Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find zero or more Exercises that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseFindManyArgs} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Exercises
   * const exercises = await prisma.exercise.findMany()
   * 
   * // Get first 10 Exercises
   * const exercises = await prisma.exercise.findMany({ take: 10 })
   * 
   * // Only select the `exercise_id`
   * const exerciseWithExercise_idOnly = await prisma.exercise.findMany({ select: { exercise_id: true } })
   * 
   */
  findMany<T extends ExerciseFindManyArgs>(args?: Prisma.SelectSubset<T, ExerciseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  /**
   * Create a Exercise.
   * @param {ExerciseCreateArgs} args - Arguments to create a Exercise.
   * @example
   * // Create one Exercise
   * const Exercise = await prisma.exercise.create({
   *   data: {
   *     // ... data to create a Exercise
   *   }
   * })
   * 
   */
  create<T extends ExerciseCreateArgs>(args: Prisma.SelectSubset<T, ExerciseCreateArgs<ExtArgs>>): Prisma.Prisma__ExerciseClient<runtime.Types.Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Create many Exercises.
   * @param {ExerciseCreateManyArgs} args - Arguments to create many Exercises.
   * @example
   * // Create many Exercises
   * const exercise = await prisma.exercise.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   *     
   */
  createMany<T extends ExerciseCreateManyArgs>(args?: Prisma.SelectSubset<T, ExerciseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Delete a Exercise.
   * @param {ExerciseDeleteArgs} args - Arguments to delete one Exercise.
   * @example
   * // Delete one Exercise
   * const Exercise = await prisma.exercise.delete({
   *   where: {
   *     // ... filter to delete one Exercise
   *   }
   * })
   * 
   */
  delete<T extends ExerciseDeleteArgs>(args: Prisma.SelectSubset<T, ExerciseDeleteArgs<ExtArgs>>): Prisma.Prisma__ExerciseClient<runtime.Types.Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Update one Exercise.
   * @param {ExerciseUpdateArgs} args - Arguments to update one Exercise.
   * @example
   * // Update one Exercise
   * const exercise = await prisma.exercise.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends ExerciseUpdateArgs>(args: Prisma.SelectSubset<T, ExerciseUpdateArgs<ExtArgs>>): Prisma.Prisma__ExerciseClient<runtime.Types.Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Delete zero or more Exercises.
   * @param {ExerciseDeleteManyArgs} args - Arguments to filter Exercises to delete.
   * @example
   * // Delete a few Exercises
   * const { count } = await prisma.exercise.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany<T extends ExerciseDeleteManyArgs>(args?: Prisma.SelectSubset<T, ExerciseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Update zero or more Exercises.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Exercises
   * const exercise = await prisma.exercise.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany<T extends ExerciseUpdateManyArgs>(args: Prisma.SelectSubset<T, ExerciseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Create or update one Exercise.
   * @param {ExerciseUpsertArgs} args - Arguments to update or create a Exercise.
   * @example
   * // Update or create a Exercise
   * const exercise = await prisma.exercise.upsert({
   *   create: {
   *     // ... data to create a Exercise
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Exercise we want to update
   *   }
   * })
   */
  upsert<T extends ExerciseUpsertArgs>(args: Prisma.SelectSubset<T, ExerciseUpsertArgs<ExtArgs>>): Prisma.Prisma__ExerciseClient<runtime.Types.Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


  /**
   * Count the number of Exercises.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseCountArgs} args - Arguments to filter Exercises to count.
   * @example
   * // Count the number of Exercises
   * const count = await prisma.exercise.count({
   *   where: {
   *     // ... the filter for the Exercises we want to count
   *   }
   * })
  **/
  count<T extends ExerciseCountArgs>(
    args?: Prisma.Subset<T, ExerciseCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], ExerciseCountAggregateOutputType>
      : number
  >

  /**
   * Allows you to perform aggregations operations on a Exercise.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Ordered by age ascending
   * // Where email contains prisma.io
   * // Limited to the 10 users
   * const aggregations = await prisma.user.aggregate({
   *   _avg: {
   *     age: true,
   *   },
   *   where: {
   *     email: {
   *       contains: "prisma.io",
   *     },
   *   },
   *   orderBy: {
   *     age: "asc",
   *   },
   *   take: 10,
   * })
  **/
  aggregate<T extends ExerciseAggregateArgs>(args: Prisma.Subset<T, ExerciseAggregateArgs>): Prisma.PrismaPromise<GetExerciseAggregateType<T>>

  /**
   * Group by Exercise.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseGroupByArgs} args - Group by arguments.
   * @example
   * // Group by city, order by createdAt, get count
   * const result = await prisma.user.groupBy({
   *   by: ['city', 'createdAt'],
   *   orderBy: {
   *     createdAt: true
   *   },
   *   _count: {
   *     _all: true
   *   },
   * })
   * 
  **/
  groupBy<
    T extends ExerciseGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: ExerciseGroupByArgs['orderBy'] }
      : { orderBy?: ExerciseGroupByArgs['orderBy'] },
    OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>,
    ByFields extends Prisma.MaybeTupleToUnion<T['by']>,
    ByValid extends Prisma.Has<ByFields, OrderFields>,
    HavingFields extends Prisma.GetHavingFields<T['having']>,
    HavingValid extends Prisma.Has<ByFields, HavingFields>,
    ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False,
    InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
          ? never
          : P extends string
          ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
          : [
              Error,
              'Field ',
              P,
              ` in "having" needs to be provided in "by"`,
            ]
      }[HavingFields]
    : 'take' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
          ? never
          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
      }[OrderFields]
  >(args: Prisma.SubsetIntersection<T, ExerciseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExerciseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
/**
 * Fields of the Exercise model
 */
readonly fields: ExerciseFieldRefs;
}

/**
 * The delegate class that acts as a "Promise-like" for Exercise.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ExerciseClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  module<T extends Prisma.ModuleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ModuleDefaultArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  submissions<T extends Prisma.Exercise$submissionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Exercise$submissionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExerciseSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}




/**
 * Fields of the Exercise model
 */
export interface ExerciseFieldRefs {
  readonly exercise_id: Prisma.FieldRef<"Exercise", 'String'>
  readonly module_id: Prisma.FieldRef<"Exercise", 'String'>
  readonly title: Prisma.FieldRef<"Exercise", 'String'>
  readonly description: Prisma.FieldRef<"Exercise", 'String'>
  readonly examples: Prisma.FieldRef<"Exercise", 'Json'>
  readonly starter_code: Prisma.FieldRef<"Exercise", 'String'>
  readonly solution_code: Prisma.FieldRef<"Exercise", 'String'>
  readonly difficulty: Prisma.FieldRef<"Exercise", 'Difficulty'>
  readonly created_at: Prisma.FieldRef<"Exercise", 'DateTime'>
  readonly updated_at: Prisma.FieldRef<"Exercise", 'DateTime'>
}
    

// Custom InputTypes
/**
 * Exercise findUnique
 */
export type ExerciseFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Exercise
   */
  select?: Prisma.ExerciseSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Exercise
   */
  omit?: Prisma.ExerciseOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseInclude<ExtArgs> | null
  /**
   * Filter, which Exercise to fetch.
   */
  where: Prisma.ExerciseWhereUniqueInput
}

/**
 * Exercise findUniqueOrThrow
 */
export type ExerciseFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Exercise
   */
  select?: Prisma.ExerciseSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Exercise
   */
  omit?: Prisma.ExerciseOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseInclude<ExtArgs> | null
  /**
   * Filter, which Exercise to fetch.
   */
  where: Prisma.ExerciseWhereUniqueInput
}

/**
 * Exercise findFirst
 */
export type ExerciseFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Exercise
   */
  select?: Prisma.ExerciseSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Exercise
   */
  omit?: Prisma.ExerciseOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseInclude<ExtArgs> | null
  /**
   * Filter, which Exercise to fetch.
   */
  where?: Prisma.ExerciseWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Exercises to fetch.
   */
  orderBy?: Prisma.ExerciseOrderByWithRelationInput | Prisma.ExerciseOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for Exercises.
   */
  cursor?: Prisma.ExerciseWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Exercises from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Exercises.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of Exercises.
   */
  distinct?: Prisma.ExerciseScalarFieldEnum | Prisma.ExerciseScalarFieldEnum[]
}

/**
 * Exercise findFirstOrThrow
 */
export type ExerciseFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Exercise
   */
  select?: Prisma.ExerciseSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Exercise
   */
  omit?: Prisma.ExerciseOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseInclude<ExtArgs> | null
  /**
   * Filter, which Exercise to fetch.
   */
  where?: Prisma.ExerciseWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Exercises to fetch.
   */
  orderBy?: Prisma.ExerciseOrderByWithRelationInput | Prisma.ExerciseOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for Exercises.
   */
  cursor?: Prisma.ExerciseWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Exercises from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Exercises.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of Exercises.
   */
  distinct?: Prisma.ExerciseScalarFieldEnum | Prisma.ExerciseScalarFieldEnum[]
}

/**
 * Exercise findMany
 */
export type ExerciseFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Exercise
   */
  select?: Prisma.ExerciseSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Exercise
   */
  omit?: Prisma.ExerciseOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseInclude<ExtArgs> | null
  /**
   * Filter, which Exercises to fetch.
   */
  where?: Prisma.ExerciseWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Exercises to fetch.
   */
  orderBy?: Prisma.ExerciseOrderByWithRelationInput | Prisma.ExerciseOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for listing Exercises.
   */
  cursor?: Prisma.ExerciseWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Exercises from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Exercises.
   */
  skip?: number
  distinct?: Prisma.ExerciseScalarFieldEnum | Prisma.ExerciseScalarFieldEnum[]
}

/**
 * Exercise create
 */
export type ExerciseCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Exercise
   */
  select?: Prisma.ExerciseSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Exercise
   */
  omit?: Prisma.ExerciseOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseInclude<ExtArgs> | null
  /**
   * The data needed to create a Exercise.
   */
  data: Prisma.XOR<Prisma.ExerciseCreateInput, Prisma.ExerciseUncheckedCreateInput>
}

/**
 * Exercise createMany
 */
export type ExerciseCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to create many Exercises.
   */
  data: Prisma.ExerciseCreateManyInput | Prisma.ExerciseCreateManyInput[]
  skipDuplicates?: boolean
}

/**
 * Exercise update
 */
export type ExerciseUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Exercise
   */
  select?: Prisma.ExerciseSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Exercise
   */
  omit?: Prisma.ExerciseOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseInclude<ExtArgs> | null
  /**
   * The data needed to update a Exercise.
   */
  data: Prisma.XOR<Prisma.ExerciseUpdateInput, Prisma.ExerciseUncheckedUpdateInput>
  /**
   * Choose, which Exercise to update.
   */
  where: Prisma.ExerciseWhereUniqueInput
}

/**
 * Exercise updateMany
 */
export type ExerciseUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to update Exercises.
   */
  data: Prisma.XOR<Prisma.ExerciseUpdateManyMutationInput, Prisma.ExerciseUncheckedUpdateManyInput>
  /**
   * Filter which Exercises to update
   */
  where?: Prisma.ExerciseWhereInput
  /**
   * Limit how many Exercises to update.
   */
  limit?: number
}

/**
 * Exercise upsert
 */
export type ExerciseUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Exercise
   */
  select?: Prisma.ExerciseSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Exercise
   */
  omit?: Prisma.ExerciseOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseInclude<ExtArgs> | null
  /**
   * The filter to search for the Exercise to update in case it exists.
   */
  where: Prisma.ExerciseWhereUniqueInput
  /**
   * In case the Exercise found by the `where` argument doesn't exist, create a new Exercise with this data.
   */
  create: Prisma.XOR<Prisma.ExerciseCreateInput, Prisma.ExerciseUncheckedCreateInput>
  /**
   * In case the Exercise was found with the provided `where` argument, update it with this data.
   */
  update: Prisma.XOR<Prisma.ExerciseUpdateInput, Prisma.ExerciseUncheckedUpdateInput>
}

/**
 * Exercise delete
 */
export type ExerciseDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Exercise
   */
  select?: Prisma.ExerciseSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Exercise
   */
  omit?: Prisma.ExerciseOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseInclude<ExtArgs> | null
  /**
   * Filter which Exercise to delete.
   */
  where: Prisma.ExerciseWhereUniqueInput
}

/**
 * Exercise deleteMany
 */
export type ExerciseDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which Exercises to delete
   */
  where?: Prisma.ExerciseWhereInput
  /**
   * Limit how many Exercises to delete.
   */
  limit?: number
}

/**
 * Exercise.submissions
 */
export type Exercise$submissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ExerciseSubmission
   */
  select?: Prisma.ExerciseSubmissionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the ExerciseSubmission
   */
  omit?: Prisma.ExerciseSubmissionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseSubmissionInclude<ExtArgs> | null
  where?: Prisma.ExerciseSubmissionWhereInput
  orderBy?: Prisma.ExerciseSubmissionOrderByWithRelationInput | Prisma.ExerciseSubmissionOrderByWithRelationInput[]
  cursor?: Prisma.ExerciseSubmissionWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.ExerciseSubmissionScalarFieldEnum | Prisma.ExerciseSubmissionScalarFieldEnum[]
}

/**
 * Exercise without action
 */
export type ExerciseDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Exercise
   */
  select?: Prisma.ExerciseSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Exercise
   */
  omit?: Prisma.ExerciseOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseInclude<ExtArgs> | null
}

```

## File: src/generated/prisma/models/ExerciseSubmission.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file exports the `ExerciseSubmission` model and its related types.
 *
 * 🟢 You can import this file directly.
 */
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"

/**
 * Model ExerciseSubmission
 * 
 */
export type ExerciseSubmissionModel = runtime.Types.Result.DefaultSelection<Prisma.$ExerciseSubmissionPayload>

export type AggregateExerciseSubmission = {
  _count: ExerciseSubmissionCountAggregateOutputType | null
  _min: ExerciseSubmissionMinAggregateOutputType | null
  _max: ExerciseSubmissionMaxAggregateOutputType | null
}

export type ExerciseSubmissionMinAggregateOutputType = {
  submission_id: string | null
  exercise_id: string | null
  user_id: string | null
  answer_text: string | null
  submitted_at: Date | null
}

export type ExerciseSubmissionMaxAggregateOutputType = {
  submission_id: string | null
  exercise_id: string | null
  user_id: string | null
  answer_text: string | null
  submitted_at: Date | null
}

export type ExerciseSubmissionCountAggregateOutputType = {
  submission_id: number
  exercise_id: number
  user_id: number
  answer_text: number
  submitted_at: number
  _all: number
}


export type ExerciseSubmissionMinAggregateInputType = {
  submission_id?: true
  exercise_id?: true
  user_id?: true
  answer_text?: true
  submitted_at?: true
}

export type ExerciseSubmissionMaxAggregateInputType = {
  submission_id?: true
  exercise_id?: true
  user_id?: true
  answer_text?: true
  submitted_at?: true
}

export type ExerciseSubmissionCountAggregateInputType = {
  submission_id?: true
  exercise_id?: true
  user_id?: true
  answer_text?: true
  submitted_at?: true
  _all?: true
}

export type ExerciseSubmissionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which ExerciseSubmission to aggregate.
   */
  where?: Prisma.ExerciseSubmissionWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of ExerciseSubmissions to fetch.
   */
  orderBy?: Prisma.ExerciseSubmissionOrderByWithRelationInput | Prisma.ExerciseSubmissionOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the start position
   */
  cursor?: Prisma.ExerciseSubmissionWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` ExerciseSubmissions from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` ExerciseSubmissions.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Count returned ExerciseSubmissions
  **/
  _count?: true | ExerciseSubmissionCountAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the minimum value
  **/
  _min?: ExerciseSubmissionMinAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the maximum value
  **/
  _max?: ExerciseSubmissionMaxAggregateInputType
}

export type GetExerciseSubmissionAggregateType<T extends ExerciseSubmissionAggregateArgs> = {
      [P in keyof T & keyof AggregateExerciseSubmission]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateExerciseSubmission[P]>
    : Prisma.GetScalarType<T[P], AggregateExerciseSubmission[P]>
}




export type ExerciseSubmissionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.ExerciseSubmissionWhereInput
  orderBy?: Prisma.ExerciseSubmissionOrderByWithAggregationInput | Prisma.ExerciseSubmissionOrderByWithAggregationInput[]
  by: Prisma.ExerciseSubmissionScalarFieldEnum[] | Prisma.ExerciseSubmissionScalarFieldEnum
  having?: Prisma.ExerciseSubmissionScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: ExerciseSubmissionCountAggregateInputType | true
  _min?: ExerciseSubmissionMinAggregateInputType
  _max?: ExerciseSubmissionMaxAggregateInputType
}

export type ExerciseSubmissionGroupByOutputType = {
  submission_id: string
  exercise_id: string
  user_id: string
  answer_text: string
  submitted_at: Date
  _count: ExerciseSubmissionCountAggregateOutputType | null
  _min: ExerciseSubmissionMinAggregateOutputType | null
  _max: ExerciseSubmissionMaxAggregateOutputType | null
}

type GetExerciseSubmissionGroupByPayload<T extends ExerciseSubmissionGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<ExerciseSubmissionGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof ExerciseSubmissionGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], ExerciseSubmissionGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], ExerciseSubmissionGroupByOutputType[P]>
      }
    >
  >



export type ExerciseSubmissionWhereInput = {
  AND?: Prisma.ExerciseSubmissionWhereInput | Prisma.ExerciseSubmissionWhereInput[]
  OR?: Prisma.ExerciseSubmissionWhereInput[]
  NOT?: Prisma.ExerciseSubmissionWhereInput | Prisma.ExerciseSubmissionWhereInput[]
  submission_id?: Prisma.StringFilter<"ExerciseSubmission"> | string
  exercise_id?: Prisma.StringFilter<"ExerciseSubmission"> | string
  user_id?: Prisma.StringFilter<"ExerciseSubmission"> | string
  answer_text?: Prisma.StringFilter<"ExerciseSubmission"> | string
  submitted_at?: Prisma.DateTimeFilter<"ExerciseSubmission"> | Date | string
  exercise?: Prisma.XOR<Prisma.ExerciseScalarRelationFilter, Prisma.ExerciseWhereInput>
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}

export type ExerciseSubmissionOrderByWithRelationInput = {
  submission_id?: Prisma.SortOrder
  exercise_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  answer_text?: Prisma.SortOrder
  submitted_at?: Prisma.SortOrder
  exercise?: Prisma.ExerciseOrderByWithRelationInput
  user?: Prisma.UserOrderByWithRelationInput
  _relevance?: Prisma.ExerciseSubmissionOrderByRelevanceInput
}

export type ExerciseSubmissionWhereUniqueInput = Prisma.AtLeast<{
  submission_id?: string
  AND?: Prisma.ExerciseSubmissionWhereInput | Prisma.ExerciseSubmissionWhereInput[]
  OR?: Prisma.ExerciseSubmissionWhereInput[]
  NOT?: Prisma.ExerciseSubmissionWhereInput | Prisma.ExerciseSubmissionWhereInput[]
  exercise_id?: Prisma.StringFilter<"ExerciseSubmission"> | string
  user_id?: Prisma.StringFilter<"ExerciseSubmission"> | string
  answer_text?: Prisma.StringFilter<"ExerciseSubmission"> | string
  submitted_at?: Prisma.DateTimeFilter<"ExerciseSubmission"> | Date | string
  exercise?: Prisma.XOR<Prisma.ExerciseScalarRelationFilter, Prisma.ExerciseWhereInput>
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}, "submission_id">

export type ExerciseSubmissionOrderByWithAggregationInput = {
  submission_id?: Prisma.SortOrder
  exercise_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  answer_text?: Prisma.SortOrder
  submitted_at?: Prisma.SortOrder
  _count?: Prisma.ExerciseSubmissionCountOrderByAggregateInput
  _max?: Prisma.ExerciseSubmissionMaxOrderByAggregateInput
  _min?: Prisma.ExerciseSubmissionMinOrderByAggregateInput
}

export type ExerciseSubmissionScalarWhereWithAggregatesInput = {
  AND?: Prisma.ExerciseSubmissionScalarWhereWithAggregatesInput | Prisma.ExerciseSubmissionScalarWhereWithAggregatesInput[]
  OR?: Prisma.ExerciseSubmissionScalarWhereWithAggregatesInput[]
  NOT?: Prisma.ExerciseSubmissionScalarWhereWithAggregatesInput | Prisma.ExerciseSubmissionScalarWhereWithAggregatesInput[]
  submission_id?: Prisma.StringWithAggregatesFilter<"ExerciseSubmission"> | string
  exercise_id?: Prisma.StringWithAggregatesFilter<"ExerciseSubmission"> | string
  user_id?: Prisma.StringWithAggregatesFilter<"ExerciseSubmission"> | string
  answer_text?: Prisma.StringWithAggregatesFilter<"ExerciseSubmission"> | string
  submitted_at?: Prisma.DateTimeWithAggregatesFilter<"ExerciseSubmission"> | Date | string
}

export type ExerciseSubmissionCreateInput = {
  submission_id?: string
  answer_text: string
  submitted_at?: Date | string
  exercise: Prisma.ExerciseCreateNestedOneWithoutSubmissionsInput
  user: Prisma.UserCreateNestedOneWithoutExerciseSubmissionsInput
}

export type ExerciseSubmissionUncheckedCreateInput = {
  submission_id?: string
  exercise_id: string
  user_id: string
  answer_text: string
  submitted_at?: Date | string
}

export type ExerciseSubmissionUpdateInput = {
  submission_id?: Prisma.StringFieldUpdateOperationsInput | string
  answer_text?: Prisma.StringFieldUpdateOperationsInput | string
  submitted_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  exercise?: Prisma.ExerciseUpdateOneRequiredWithoutSubmissionsNestedInput
  user?: Prisma.UserUpdateOneRequiredWithoutExerciseSubmissionsNestedInput
}

export type ExerciseSubmissionUncheckedUpdateInput = {
  submission_id?: Prisma.StringFieldUpdateOperationsInput | string
  exercise_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  answer_text?: Prisma.StringFieldUpdateOperationsInput | string
  submitted_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type ExerciseSubmissionCreateManyInput = {
  submission_id?: string
  exercise_id: string
  user_id: string
  answer_text: string
  submitted_at?: Date | string
}

export type ExerciseSubmissionUpdateManyMutationInput = {
  submission_id?: Prisma.StringFieldUpdateOperationsInput | string
  answer_text?: Prisma.StringFieldUpdateOperationsInput | string
  submitted_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type ExerciseSubmissionUncheckedUpdateManyInput = {
  submission_id?: Prisma.StringFieldUpdateOperationsInput | string
  exercise_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  answer_text?: Prisma.StringFieldUpdateOperationsInput | string
  submitted_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type ExerciseSubmissionListRelationFilter = {
  every?: Prisma.ExerciseSubmissionWhereInput
  some?: Prisma.ExerciseSubmissionWhereInput
  none?: Prisma.ExerciseSubmissionWhereInput
}

export type ExerciseSubmissionOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type ExerciseSubmissionOrderByRelevanceInput = {
  fields: Prisma.ExerciseSubmissionOrderByRelevanceFieldEnum | Prisma.ExerciseSubmissionOrderByRelevanceFieldEnum[]
  sort: Prisma.SortOrder
  search: string
}

export type ExerciseSubmissionCountOrderByAggregateInput = {
  submission_id?: Prisma.SortOrder
  exercise_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  answer_text?: Prisma.SortOrder
  submitted_at?: Prisma.SortOrder
}

export type ExerciseSubmissionMaxOrderByAggregateInput = {
  submission_id?: Prisma.SortOrder
  exercise_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  answer_text?: Prisma.SortOrder
  submitted_at?: Prisma.SortOrder
}

export type ExerciseSubmissionMinOrderByAggregateInput = {
  submission_id?: Prisma.SortOrder
  exercise_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  answer_text?: Prisma.SortOrder
  submitted_at?: Prisma.SortOrder
}

export type ExerciseSubmissionCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.ExerciseSubmissionCreateWithoutUserInput, Prisma.ExerciseSubmissionUncheckedCreateWithoutUserInput> | Prisma.ExerciseSubmissionCreateWithoutUserInput[] | Prisma.ExerciseSubmissionUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.ExerciseSubmissionCreateOrConnectWithoutUserInput | Prisma.ExerciseSubmissionCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.ExerciseSubmissionCreateManyUserInputEnvelope
  connect?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
}

export type ExerciseSubmissionUncheckedCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.ExerciseSubmissionCreateWithoutUserInput, Prisma.ExerciseSubmissionUncheckedCreateWithoutUserInput> | Prisma.ExerciseSubmissionCreateWithoutUserInput[] | Prisma.ExerciseSubmissionUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.ExerciseSubmissionCreateOrConnectWithoutUserInput | Prisma.ExerciseSubmissionCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.ExerciseSubmissionCreateManyUserInputEnvelope
  connect?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
}

export type ExerciseSubmissionUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.ExerciseSubmissionCreateWithoutUserInput, Prisma.ExerciseSubmissionUncheckedCreateWithoutUserInput> | Prisma.ExerciseSubmissionCreateWithoutUserInput[] | Prisma.ExerciseSubmissionUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.ExerciseSubmissionCreateOrConnectWithoutUserInput | Prisma.ExerciseSubmissionCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.ExerciseSubmissionUpsertWithWhereUniqueWithoutUserInput | Prisma.ExerciseSubmissionUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.ExerciseSubmissionCreateManyUserInputEnvelope
  set?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  disconnect?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  delete?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  connect?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  update?: Prisma.ExerciseSubmissionUpdateWithWhereUniqueWithoutUserInput | Prisma.ExerciseSubmissionUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.ExerciseSubmissionUpdateManyWithWhereWithoutUserInput | Prisma.ExerciseSubmissionUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.ExerciseSubmissionScalarWhereInput | Prisma.ExerciseSubmissionScalarWhereInput[]
}

export type ExerciseSubmissionUncheckedUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.ExerciseSubmissionCreateWithoutUserInput, Prisma.ExerciseSubmissionUncheckedCreateWithoutUserInput> | Prisma.ExerciseSubmissionCreateWithoutUserInput[] | Prisma.ExerciseSubmissionUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.ExerciseSubmissionCreateOrConnectWithoutUserInput | Prisma.ExerciseSubmissionCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.ExerciseSubmissionUpsertWithWhereUniqueWithoutUserInput | Prisma.ExerciseSubmissionUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.ExerciseSubmissionCreateManyUserInputEnvelope
  set?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  disconnect?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  delete?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  connect?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  update?: Prisma.ExerciseSubmissionUpdateWithWhereUniqueWithoutUserInput | Prisma.ExerciseSubmissionUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.ExerciseSubmissionUpdateManyWithWhereWithoutUserInput | Prisma.ExerciseSubmissionUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.ExerciseSubmissionScalarWhereInput | Prisma.ExerciseSubmissionScalarWhereInput[]
}

export type ExerciseSubmissionCreateNestedManyWithoutExerciseInput = {
  create?: Prisma.XOR<Prisma.ExerciseSubmissionCreateWithoutExerciseInput, Prisma.ExerciseSubmissionUncheckedCreateWithoutExerciseInput> | Prisma.ExerciseSubmissionCreateWithoutExerciseInput[] | Prisma.ExerciseSubmissionUncheckedCreateWithoutExerciseInput[]
  connectOrCreate?: Prisma.ExerciseSubmissionCreateOrConnectWithoutExerciseInput | Prisma.ExerciseSubmissionCreateOrConnectWithoutExerciseInput[]
  createMany?: Prisma.ExerciseSubmissionCreateManyExerciseInputEnvelope
  connect?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
}

export type ExerciseSubmissionUncheckedCreateNestedManyWithoutExerciseInput = {
  create?: Prisma.XOR<Prisma.ExerciseSubmissionCreateWithoutExerciseInput, Prisma.ExerciseSubmissionUncheckedCreateWithoutExerciseInput> | Prisma.ExerciseSubmissionCreateWithoutExerciseInput[] | Prisma.ExerciseSubmissionUncheckedCreateWithoutExerciseInput[]
  connectOrCreate?: Prisma.ExerciseSubmissionCreateOrConnectWithoutExerciseInput | Prisma.ExerciseSubmissionCreateOrConnectWithoutExerciseInput[]
  createMany?: Prisma.ExerciseSubmissionCreateManyExerciseInputEnvelope
  connect?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
}

export type ExerciseSubmissionUpdateManyWithoutExerciseNestedInput = {
  create?: Prisma.XOR<Prisma.ExerciseSubmissionCreateWithoutExerciseInput, Prisma.ExerciseSubmissionUncheckedCreateWithoutExerciseInput> | Prisma.ExerciseSubmissionCreateWithoutExerciseInput[] | Prisma.ExerciseSubmissionUncheckedCreateWithoutExerciseInput[]
  connectOrCreate?: Prisma.ExerciseSubmissionCreateOrConnectWithoutExerciseInput | Prisma.ExerciseSubmissionCreateOrConnectWithoutExerciseInput[]
  upsert?: Prisma.ExerciseSubmissionUpsertWithWhereUniqueWithoutExerciseInput | Prisma.ExerciseSubmissionUpsertWithWhereUniqueWithoutExerciseInput[]
  createMany?: Prisma.ExerciseSubmissionCreateManyExerciseInputEnvelope
  set?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  disconnect?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  delete?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  connect?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  update?: Prisma.ExerciseSubmissionUpdateWithWhereUniqueWithoutExerciseInput | Prisma.ExerciseSubmissionUpdateWithWhereUniqueWithoutExerciseInput[]
  updateMany?: Prisma.ExerciseSubmissionUpdateManyWithWhereWithoutExerciseInput | Prisma.ExerciseSubmissionUpdateManyWithWhereWithoutExerciseInput[]
  deleteMany?: Prisma.ExerciseSubmissionScalarWhereInput | Prisma.ExerciseSubmissionScalarWhereInput[]
}

export type ExerciseSubmissionUncheckedUpdateManyWithoutExerciseNestedInput = {
  create?: Prisma.XOR<Prisma.ExerciseSubmissionCreateWithoutExerciseInput, Prisma.ExerciseSubmissionUncheckedCreateWithoutExerciseInput> | Prisma.ExerciseSubmissionCreateWithoutExerciseInput[] | Prisma.ExerciseSubmissionUncheckedCreateWithoutExerciseInput[]
  connectOrCreate?: Prisma.ExerciseSubmissionCreateOrConnectWithoutExerciseInput | Prisma.ExerciseSubmissionCreateOrConnectWithoutExerciseInput[]
  upsert?: Prisma.ExerciseSubmissionUpsertWithWhereUniqueWithoutExerciseInput | Prisma.ExerciseSubmissionUpsertWithWhereUniqueWithoutExerciseInput[]
  createMany?: Prisma.ExerciseSubmissionCreateManyExerciseInputEnvelope
  set?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  disconnect?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  delete?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  connect?: Prisma.ExerciseSubmissionWhereUniqueInput | Prisma.ExerciseSubmissionWhereUniqueInput[]
  update?: Prisma.ExerciseSubmissionUpdateWithWhereUniqueWithoutExerciseInput | Prisma.ExerciseSubmissionUpdateWithWhereUniqueWithoutExerciseInput[]
  updateMany?: Prisma.ExerciseSubmissionUpdateManyWithWhereWithoutExerciseInput | Prisma.ExerciseSubmissionUpdateManyWithWhereWithoutExerciseInput[]
  deleteMany?: Prisma.ExerciseSubmissionScalarWhereInput | Prisma.ExerciseSubmissionScalarWhereInput[]
}

export type ExerciseSubmissionCreateWithoutUserInput = {
  submission_id?: string
  answer_text: string
  submitted_at?: Date | string
  exercise: Prisma.ExerciseCreateNestedOneWithoutSubmissionsInput
}

export type ExerciseSubmissionUncheckedCreateWithoutUserInput = {
  submission_id?: string
  exercise_id: string
  answer_text: string
  submitted_at?: Date | string
}

export type ExerciseSubmissionCreateOrConnectWithoutUserInput = {
  where: Prisma.ExerciseSubmissionWhereUniqueInput
  create: Prisma.XOR<Prisma.ExerciseSubmissionCreateWithoutUserInput, Prisma.ExerciseSubmissionUncheckedCreateWithoutUserInput>
}

export type ExerciseSubmissionCreateManyUserInputEnvelope = {
  data: Prisma.ExerciseSubmissionCreateManyUserInput | Prisma.ExerciseSubmissionCreateManyUserInput[]
  skipDuplicates?: boolean
}

export type ExerciseSubmissionUpsertWithWhereUniqueWithoutUserInput = {
  where: Prisma.ExerciseSubmissionWhereUniqueInput
  update: Prisma.XOR<Prisma.ExerciseSubmissionUpdateWithoutUserInput, Prisma.ExerciseSubmissionUncheckedUpdateWithoutUserInput>
  create: Prisma.XOR<Prisma.ExerciseSubmissionCreateWithoutUserInput, Prisma.ExerciseSubmissionUncheckedCreateWithoutUserInput>
}

export type ExerciseSubmissionUpdateWithWhereUniqueWithoutUserInput = {
  where: Prisma.ExerciseSubmissionWhereUniqueInput
  data: Prisma.XOR<Prisma.ExerciseSubmissionUpdateWithoutUserInput, Prisma.ExerciseSubmissionUncheckedUpdateWithoutUserInput>
}

export type ExerciseSubmissionUpdateManyWithWhereWithoutUserInput = {
  where: Prisma.ExerciseSubmissionScalarWhereInput
  data: Prisma.XOR<Prisma.ExerciseSubmissionUpdateManyMutationInput, Prisma.ExerciseSubmissionUncheckedUpdateManyWithoutUserInput>
}

export type ExerciseSubmissionScalarWhereInput = {
  AND?: Prisma.ExerciseSubmissionScalarWhereInput | Prisma.ExerciseSubmissionScalarWhereInput[]
  OR?: Prisma.ExerciseSubmissionScalarWhereInput[]
  NOT?: Prisma.ExerciseSubmissionScalarWhereInput | Prisma.ExerciseSubmissionScalarWhereInput[]
  submission_id?: Prisma.StringFilter<"ExerciseSubmission"> | string
  exercise_id?: Prisma.StringFilter<"ExerciseSubmission"> | string
  user_id?: Prisma.StringFilter<"ExerciseSubmission"> | string
  answer_text?: Prisma.StringFilter<"ExerciseSubmission"> | string
  submitted_at?: Prisma.DateTimeFilter<"ExerciseSubmission"> | Date | string
}

export type ExerciseSubmissionCreateWithoutExerciseInput = {
  submission_id?: string
  answer_text: string
  submitted_at?: Date | string
  user: Prisma.UserCreateNestedOneWithoutExerciseSubmissionsInput
}

export type ExerciseSubmissionUncheckedCreateWithoutExerciseInput = {
  submission_id?: string
  user_id: string
  answer_text: string
  submitted_at?: Date | string
}

export type ExerciseSubmissionCreateOrConnectWithoutExerciseInput = {
  where: Prisma.ExerciseSubmissionWhereUniqueInput
  create: Prisma.XOR<Prisma.ExerciseSubmissionCreateWithoutExerciseInput, Prisma.ExerciseSubmissionUncheckedCreateWithoutExerciseInput>
}

export type ExerciseSubmissionCreateManyExerciseInputEnvelope = {
  data: Prisma.ExerciseSubmissionCreateManyExerciseInput | Prisma.ExerciseSubmissionCreateManyExerciseInput[]
  skipDuplicates?: boolean
}

export type ExerciseSubmissionUpsertWithWhereUniqueWithoutExerciseInput = {
  where: Prisma.ExerciseSubmissionWhereUniqueInput
  update: Prisma.XOR<Prisma.ExerciseSubmissionUpdateWithoutExerciseInput, Prisma.ExerciseSubmissionUncheckedUpdateWithoutExerciseInput>
  create: Prisma.XOR<Prisma.ExerciseSubmissionCreateWithoutExerciseInput, Prisma.ExerciseSubmissionUncheckedCreateWithoutExerciseInput>
}

export type ExerciseSubmissionUpdateWithWhereUniqueWithoutExerciseInput = {
  where: Prisma.ExerciseSubmissionWhereUniqueInput
  data: Prisma.XOR<Prisma.ExerciseSubmissionUpdateWithoutExerciseInput, Prisma.ExerciseSubmissionUncheckedUpdateWithoutExerciseInput>
}

export type ExerciseSubmissionUpdateManyWithWhereWithoutExerciseInput = {
  where: Prisma.ExerciseSubmissionScalarWhereInput
  data: Prisma.XOR<Prisma.ExerciseSubmissionUpdateManyMutationInput, Prisma.ExerciseSubmissionUncheckedUpdateManyWithoutExerciseInput>
}

export type ExerciseSubmissionCreateManyUserInput = {
  submission_id?: string
  exercise_id: string
  answer_text: string
  submitted_at?: Date | string
}

export type ExerciseSubmissionUpdateWithoutUserInput = {
  submission_id?: Prisma.StringFieldUpdateOperationsInput | string
  answer_text?: Prisma.StringFieldUpdateOperationsInput | string
  submitted_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  exercise?: Prisma.ExerciseUpdateOneRequiredWithoutSubmissionsNestedInput
}

export type ExerciseSubmissionUncheckedUpdateWithoutUserInput = {
  submission_id?: Prisma.StringFieldUpdateOperationsInput | string
  exercise_id?: Prisma.StringFieldUpdateOperationsInput | string
  answer_text?: Prisma.StringFieldUpdateOperationsInput | string
  submitted_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type ExerciseSubmissionUncheckedUpdateManyWithoutUserInput = {
  submission_id?: Prisma.StringFieldUpdateOperationsInput | string
  exercise_id?: Prisma.StringFieldUpdateOperationsInput | string
  answer_text?: Prisma.StringFieldUpdateOperationsInput | string
  submitted_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type ExerciseSubmissionCreateManyExerciseInput = {
  submission_id?: string
  user_id: string
  answer_text: string
  submitted_at?: Date | string
}

export type ExerciseSubmissionUpdateWithoutExerciseInput = {
  submission_id?: Prisma.StringFieldUpdateOperationsInput | string
  answer_text?: Prisma.StringFieldUpdateOperationsInput | string
  submitted_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  user?: Prisma.UserUpdateOneRequiredWithoutExerciseSubmissionsNestedInput
}

export type ExerciseSubmissionUncheckedUpdateWithoutExerciseInput = {
  submission_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  answer_text?: Prisma.StringFieldUpdateOperationsInput | string
  submitted_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type ExerciseSubmissionUncheckedUpdateManyWithoutExerciseInput = {
  submission_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  answer_text?: Prisma.StringFieldUpdateOperationsInput | string
  submitted_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}



export type ExerciseSubmissionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  submission_id?: boolean
  exercise_id?: boolean
  user_id?: boolean
  answer_text?: boolean
  submitted_at?: boolean
  exercise?: boolean | Prisma.ExerciseDefaultArgs<ExtArgs>
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}, ExtArgs["result"]["exerciseSubmission"]>



export type ExerciseSubmissionSelectScalar = {
  submission_id?: boolean
  exercise_id?: boolean
  user_id?: boolean
  answer_text?: boolean
  submitted_at?: boolean
}

export type ExerciseSubmissionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"submission_id" | "exercise_id" | "user_id" | "answer_text" | "submitted_at", ExtArgs["result"]["exerciseSubmission"]>
export type ExerciseSubmissionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  exercise?: boolean | Prisma.ExerciseDefaultArgs<ExtArgs>
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}

export type $ExerciseSubmissionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "ExerciseSubmission"
  objects: {
    exercise: Prisma.$ExercisePayload<ExtArgs>
    user: Prisma.$UserPayload<ExtArgs>
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    submission_id: string
    exercise_id: string
    user_id: string
    answer_text: string
    submitted_at: Date
  }, ExtArgs["result"]["exerciseSubmission"]>
  composites: {}
}

export type ExerciseSubmissionGetPayload<S extends boolean | null | undefined | ExerciseSubmissionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ExerciseSubmissionPayload, S>

export type ExerciseSubmissionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<ExerciseSubmissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ExerciseSubmissionCountAggregateInputType | true
  }

export interface ExerciseSubmissionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExerciseSubmission'], meta: { name: 'ExerciseSubmission' } }
  /**
   * Find zero or one ExerciseSubmission that matches the filter.
   * @param {ExerciseSubmissionFindUniqueArgs} args - Arguments to find a ExerciseSubmission
   * @example
   * // Get one ExerciseSubmission
   * const exerciseSubmission = await prisma.exerciseSubmission.findUnique({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUnique<T extends ExerciseSubmissionFindUniqueArgs>(args: Prisma.SelectSubset<T, ExerciseSubmissionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ExerciseSubmissionClient<runtime.Types.Result.GetResult<Prisma.$ExerciseSubmissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find one ExerciseSubmission that matches the filter or throw an error with `error.code='P2025'`
   * if no matches were found.
   * @param {ExerciseSubmissionFindUniqueOrThrowArgs} args - Arguments to find a ExerciseSubmission
   * @example
   * // Get one ExerciseSubmission
   * const exerciseSubmission = await prisma.exerciseSubmission.findUniqueOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUniqueOrThrow<T extends ExerciseSubmissionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ExerciseSubmissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ExerciseSubmissionClient<runtime.Types.Result.GetResult<Prisma.$ExerciseSubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first ExerciseSubmission that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseSubmissionFindFirstArgs} args - Arguments to find a ExerciseSubmission
   * @example
   * // Get one ExerciseSubmission
   * const exerciseSubmission = await prisma.exerciseSubmission.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends ExerciseSubmissionFindFirstArgs>(args?: Prisma.SelectSubset<T, ExerciseSubmissionFindFirstArgs<ExtArgs>>): Prisma.Prisma__ExerciseSubmissionClient<runtime.Types.Result.GetResult<Prisma.$ExerciseSubmissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first ExerciseSubmission that matches the filter or
   * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseSubmissionFindFirstOrThrowArgs} args - Arguments to find a ExerciseSubmission
   * @example
   * // Get one ExerciseSubmission
   * const exerciseSubmission = await prisma.exerciseSubmission.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends ExerciseSubmissionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ExerciseSubmissionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ExerciseSubmissionClient<runtime.Types.Result.GetResult<Prisma.$ExerciseSubmissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find zero or more ExerciseSubmissions that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseSubmissionFindManyArgs} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all ExerciseSubmissions
   * const exerciseSubmissions = await prisma.exerciseSubmission.findMany()
   * 
   * // Get first 10 ExerciseSubmissions
   * const exerciseSubmissions = await prisma.exerciseSubmission.findMany({ take: 10 })
   * 
   * // Only select the `submission_id`
   * const exerciseSubmissionWithSubmission_idOnly = await prisma.exerciseSubmission.findMany({ select: { submission_id: true } })
   * 
   */
  findMany<T extends ExerciseSubmissionFindManyArgs>(args?: Prisma.SelectSubset<T, ExerciseSubmissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExerciseSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  /**
   * Create a ExerciseSubmission.
   * @param {ExerciseSubmissionCreateArgs} args - Arguments to create a ExerciseSubmission.
   * @example
   * // Create one ExerciseSubmission
   * const ExerciseSubmission = await prisma.exerciseSubmission.create({
   *   data: {
   *     // ... data to create a ExerciseSubmission
   *   }
   * })
   * 
   */
  create<T extends ExerciseSubmissionCreateArgs>(args: Prisma.SelectSubset<T, ExerciseSubmissionCreateArgs<ExtArgs>>): Prisma.Prisma__ExerciseSubmissionClient<runtime.Types.Result.GetResult<Prisma.$ExerciseSubmissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Create many ExerciseSubmissions.
   * @param {ExerciseSubmissionCreateManyArgs} args - Arguments to create many ExerciseSubmissions.
   * @example
   * // Create many ExerciseSubmissions
   * const exerciseSubmission = await prisma.exerciseSubmission.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   *     
   */
  createMany<T extends ExerciseSubmissionCreateManyArgs>(args?: Prisma.SelectSubset<T, ExerciseSubmissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Delete a ExerciseSubmission.
   * @param {ExerciseSubmissionDeleteArgs} args - Arguments to delete one ExerciseSubmission.
   * @example
   * // Delete one ExerciseSubmission
   * const ExerciseSubmission = await prisma.exerciseSubmission.delete({
   *   where: {
   *     // ... filter to delete one ExerciseSubmission
   *   }
   * })
   * 
   */
  delete<T extends ExerciseSubmissionDeleteArgs>(args: Prisma.SelectSubset<T, ExerciseSubmissionDeleteArgs<ExtArgs>>): Prisma.Prisma__ExerciseSubmissionClient<runtime.Types.Result.GetResult<Prisma.$ExerciseSubmissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Update one ExerciseSubmission.
   * @param {ExerciseSubmissionUpdateArgs} args - Arguments to update one ExerciseSubmission.
   * @example
   * // Update one ExerciseSubmission
   * const exerciseSubmission = await prisma.exerciseSubmission.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends ExerciseSubmissionUpdateArgs>(args: Prisma.SelectSubset<T, ExerciseSubmissionUpdateArgs<ExtArgs>>): Prisma.Prisma__ExerciseSubmissionClient<runtime.Types.Result.GetResult<Prisma.$ExerciseSubmissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Delete zero or more ExerciseSubmissions.
   * @param {ExerciseSubmissionDeleteManyArgs} args - Arguments to filter ExerciseSubmissions to delete.
   * @example
   * // Delete a few ExerciseSubmissions
   * const { count } = await prisma.exerciseSubmission.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany<T extends ExerciseSubmissionDeleteManyArgs>(args?: Prisma.SelectSubset<T, ExerciseSubmissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Update zero or more ExerciseSubmissions.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseSubmissionUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many ExerciseSubmissions
   * const exerciseSubmission = await prisma.exerciseSubmission.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany<T extends ExerciseSubmissionUpdateManyArgs>(args: Prisma.SelectSubset<T, ExerciseSubmissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Create or update one ExerciseSubmission.
   * @param {ExerciseSubmissionUpsertArgs} args - Arguments to update or create a ExerciseSubmission.
   * @example
   * // Update or create a ExerciseSubmission
   * const exerciseSubmission = await prisma.exerciseSubmission.upsert({
   *   create: {
   *     // ... data to create a ExerciseSubmission
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the ExerciseSubmission we want to update
   *   }
   * })
   */
  upsert<T extends ExerciseSubmissionUpsertArgs>(args: Prisma.SelectSubset<T, ExerciseSubmissionUpsertArgs<ExtArgs>>): Prisma.Prisma__ExerciseSubmissionClient<runtime.Types.Result.GetResult<Prisma.$ExerciseSubmissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


  /**
   * Count the number of ExerciseSubmissions.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseSubmissionCountArgs} args - Arguments to filter ExerciseSubmissions to count.
   * @example
   * // Count the number of ExerciseSubmissions
   * const count = await prisma.exerciseSubmission.count({
   *   where: {
   *     // ... the filter for the ExerciseSubmissions we want to count
   *   }
   * })
  **/
  count<T extends ExerciseSubmissionCountArgs>(
    args?: Prisma.Subset<T, ExerciseSubmissionCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], ExerciseSubmissionCountAggregateOutputType>
      : number
  >

  /**
   * Allows you to perform aggregations operations on a ExerciseSubmission.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseSubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Ordered by age ascending
   * // Where email contains prisma.io
   * // Limited to the 10 users
   * const aggregations = await prisma.user.aggregate({
   *   _avg: {
   *     age: true,
   *   },
   *   where: {
   *     email: {
   *       contains: "prisma.io",
   *     },
   *   },
   *   orderBy: {
   *     age: "asc",
   *   },
   *   take: 10,
   * })
  **/
  aggregate<T extends ExerciseSubmissionAggregateArgs>(args: Prisma.Subset<T, ExerciseSubmissionAggregateArgs>): Prisma.PrismaPromise<GetExerciseSubmissionAggregateType<T>>

  /**
   * Group by ExerciseSubmission.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ExerciseSubmissionGroupByArgs} args - Group by arguments.
   * @example
   * // Group by city, order by createdAt, get count
   * const result = await prisma.user.groupBy({
   *   by: ['city', 'createdAt'],
   *   orderBy: {
   *     createdAt: true
   *   },
   *   _count: {
   *     _all: true
   *   },
   * })
   * 
  **/
  groupBy<
    T extends ExerciseSubmissionGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: ExerciseSubmissionGroupByArgs['orderBy'] }
      : { orderBy?: ExerciseSubmissionGroupByArgs['orderBy'] },
    OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>,
    ByFields extends Prisma.MaybeTupleToUnion<T['by']>,
    ByValid extends Prisma.Has<ByFields, OrderFields>,
    HavingFields extends Prisma.GetHavingFields<T['having']>,
    HavingValid extends Prisma.Has<ByFields, HavingFields>,
    ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False,
    InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
          ? never
          : P extends string
          ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
          : [
              Error,
              'Field ',
              P,
              ` in "having" needs to be provided in "by"`,
            ]
      }[HavingFields]
    : 'take' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
          ? never
          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
      }[OrderFields]
  >(args: Prisma.SubsetIntersection<T, ExerciseSubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExerciseSubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
/**
 * Fields of the ExerciseSubmission model
 */
readonly fields: ExerciseSubmissionFieldRefs;
}

/**
 * The delegate class that acts as a "Promise-like" for ExerciseSubmission.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ExerciseSubmissionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  exercise<T extends Prisma.ExerciseDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ExerciseDefaultArgs<ExtArgs>>): Prisma.Prisma__ExerciseClient<runtime.Types.Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}




/**
 * Fields of the ExerciseSubmission model
 */
export interface ExerciseSubmissionFieldRefs {
  readonly submission_id: Prisma.FieldRef<"ExerciseSubmission", 'String'>
  readonly exercise_id: Prisma.FieldRef<"ExerciseSubmission", 'String'>
  readonly user_id: Prisma.FieldRef<"ExerciseSubmission", 'String'>
  readonly answer_text: Prisma.FieldRef<"ExerciseSubmission", 'String'>
  readonly submitted_at: Prisma.FieldRef<"ExerciseSubmission", 'DateTime'>
}
    

// Custom InputTypes
/**
 * ExerciseSubmission findUnique
 */
export type ExerciseSubmissionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ExerciseSubmission
   */
  select?: Prisma.ExerciseSubmissionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the ExerciseSubmission
   */
  omit?: Prisma.ExerciseSubmissionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseSubmissionInclude<ExtArgs> | null
  /**
   * Filter, which ExerciseSubmission to fetch.
   */
  where: Prisma.ExerciseSubmissionWhereUniqueInput
}

/**
 * ExerciseSubmission findUniqueOrThrow
 */
export type ExerciseSubmissionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ExerciseSubmission
   */
  select?: Prisma.ExerciseSubmissionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the ExerciseSubmission
   */
  omit?: Prisma.ExerciseSubmissionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseSubmissionInclude<ExtArgs> | null
  /**
   * Filter, which ExerciseSubmission to fetch.
   */
  where: Prisma.ExerciseSubmissionWhereUniqueInput
}

/**
 * ExerciseSubmission findFirst
 */
export type ExerciseSubmissionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ExerciseSubmission
   */
  select?: Prisma.ExerciseSubmissionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the ExerciseSubmission
   */
  omit?: Prisma.ExerciseSubmissionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseSubmissionInclude<ExtArgs> | null
  /**
   * Filter, which ExerciseSubmission to fetch.
   */
  where?: Prisma.ExerciseSubmissionWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of ExerciseSubmissions to fetch.
   */
  orderBy?: Prisma.ExerciseSubmissionOrderByWithRelationInput | Prisma.ExerciseSubmissionOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for ExerciseSubmissions.
   */
  cursor?: Prisma.ExerciseSubmissionWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` ExerciseSubmissions from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` ExerciseSubmissions.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of ExerciseSubmissions.
   */
  distinct?: Prisma.ExerciseSubmissionScalarFieldEnum | Prisma.ExerciseSubmissionScalarFieldEnum[]
}

/**
 * ExerciseSubmission findFirstOrThrow
 */
export type ExerciseSubmissionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ExerciseSubmission
   */
  select?: Prisma.ExerciseSubmissionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the ExerciseSubmission
   */
  omit?: Prisma.ExerciseSubmissionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseSubmissionInclude<ExtArgs> | null
  /**
   * Filter, which ExerciseSubmission to fetch.
   */
  where?: Prisma.ExerciseSubmissionWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of ExerciseSubmissions to fetch.
   */
  orderBy?: Prisma.ExerciseSubmissionOrderByWithRelationInput | Prisma.ExerciseSubmissionOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for ExerciseSubmissions.
   */
  cursor?: Prisma.ExerciseSubmissionWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` ExerciseSubmissions from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` ExerciseSubmissions.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of ExerciseSubmissions.
   */
  distinct?: Prisma.ExerciseSubmissionScalarFieldEnum | Prisma.ExerciseSubmissionScalarFieldEnum[]
}

/**
 * ExerciseSubmission findMany
 */
export type ExerciseSubmissionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ExerciseSubmission
   */
  select?: Prisma.ExerciseSubmissionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the ExerciseSubmission
   */
  omit?: Prisma.ExerciseSubmissionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseSubmissionInclude<ExtArgs> | null
  /**
   * Filter, which ExerciseSubmissions to fetch.
   */
  where?: Prisma.ExerciseSubmissionWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of ExerciseSubmissions to fetch.
   */
  orderBy?: Prisma.ExerciseSubmissionOrderByWithRelationInput | Prisma.ExerciseSubmissionOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for listing ExerciseSubmissions.
   */
  cursor?: Prisma.ExerciseSubmissionWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` ExerciseSubmissions from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` ExerciseSubmissions.
   */
  skip?: number
  distinct?: Prisma.ExerciseSubmissionScalarFieldEnum | Prisma.ExerciseSubmissionScalarFieldEnum[]
}

/**
 * ExerciseSubmission create
 */
export type ExerciseSubmissionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ExerciseSubmission
   */
  select?: Prisma.ExerciseSubmissionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the ExerciseSubmission
   */
  omit?: Prisma.ExerciseSubmissionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseSubmissionInclude<ExtArgs> | null
  /**
   * The data needed to create a ExerciseSubmission.
   */
  data: Prisma.XOR<Prisma.ExerciseSubmissionCreateInput, Prisma.ExerciseSubmissionUncheckedCreateInput>
}

/**
 * ExerciseSubmission createMany
 */
export type ExerciseSubmissionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to create many ExerciseSubmissions.
   */
  data: Prisma.ExerciseSubmissionCreateManyInput | Prisma.ExerciseSubmissionCreateManyInput[]
  skipDuplicates?: boolean
}

/**
 * ExerciseSubmission update
 */
export type ExerciseSubmissionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ExerciseSubmission
   */
  select?: Prisma.ExerciseSubmissionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the ExerciseSubmission
   */
  omit?: Prisma.ExerciseSubmissionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseSubmissionInclude<ExtArgs> | null
  /**
   * The data needed to update a ExerciseSubmission.
   */
  data: Prisma.XOR<Prisma.ExerciseSubmissionUpdateInput, Prisma.ExerciseSubmissionUncheckedUpdateInput>
  /**
   * Choose, which ExerciseSubmission to update.
   */
  where: Prisma.ExerciseSubmissionWhereUniqueInput
}

/**
 * ExerciseSubmission updateMany
 */
export type ExerciseSubmissionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to update ExerciseSubmissions.
   */
  data: Prisma.XOR<Prisma.ExerciseSubmissionUpdateManyMutationInput, Prisma.ExerciseSubmissionUncheckedUpdateManyInput>
  /**
   * Filter which ExerciseSubmissions to update
   */
  where?: Prisma.ExerciseSubmissionWhereInput
  /**
   * Limit how many ExerciseSubmissions to update.
   */
  limit?: number
}

/**
 * ExerciseSubmission upsert
 */
export type ExerciseSubmissionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ExerciseSubmission
   */
  select?: Prisma.ExerciseSubmissionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the ExerciseSubmission
   */
  omit?: Prisma.ExerciseSubmissionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseSubmissionInclude<ExtArgs> | null
  /**
   * The filter to search for the ExerciseSubmission to update in case it exists.
   */
  where: Prisma.ExerciseSubmissionWhereUniqueInput
  /**
   * In case the ExerciseSubmission found by the `where` argument doesn't exist, create a new ExerciseSubmission with this data.
   */
  create: Prisma.XOR<Prisma.ExerciseSubmissionCreateInput, Prisma.ExerciseSubmissionUncheckedCreateInput>
  /**
   * In case the ExerciseSubmission was found with the provided `where` argument, update it with this data.
   */
  update: Prisma.XOR<Prisma.ExerciseSubmissionUpdateInput, Prisma.ExerciseSubmissionUncheckedUpdateInput>
}

/**
 * ExerciseSubmission delete
 */
export type ExerciseSubmissionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ExerciseSubmission
   */
  select?: Prisma.ExerciseSubmissionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the ExerciseSubmission
   */
  omit?: Prisma.ExerciseSubmissionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseSubmissionInclude<ExtArgs> | null
  /**
   * Filter which ExerciseSubmission to delete.
   */
  where: Prisma.ExerciseSubmissionWhereUniqueInput
}

/**
 * ExerciseSubmission deleteMany
 */
export type ExerciseSubmissionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which ExerciseSubmissions to delete
   */
  where?: Prisma.ExerciseSubmissionWhereInput
  /**
   * Limit how many ExerciseSubmissions to delete.
   */
  limit?: number
}

/**
 * ExerciseSubmission without action
 */
export type ExerciseSubmissionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ExerciseSubmission
   */
  select?: Prisma.ExerciseSubmissionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the ExerciseSubmission
   */
  omit?: Prisma.ExerciseSubmissionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseSubmissionInclude<ExtArgs> | null
}

```

## File: src/generated/prisma/models/InterviewSession.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file exports the `InterviewSession` model and its related types.
 *
 * 🟢 You can import this file directly.
 */
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"

/**
 * Model InterviewSession
 * 
 */
export type InterviewSessionModel = runtime.Types.Result.DefaultSelection<Prisma.$InterviewSessionPayload>

export type AggregateInterviewSession = {
  _count: InterviewSessionCountAggregateOutputType | null
  _avg: InterviewSessionAvgAggregateOutputType | null
  _sum: InterviewSessionSumAggregateOutputType | null
  _min: InterviewSessionMinAggregateOutputType | null
  _max: InterviewSessionMaxAggregateOutputType | null
}

export type InterviewSessionAvgAggregateOutputType = {
  score: runtime.Decimal | null
}

export type InterviewSessionSumAggregateOutputType = {
  score: runtime.Decimal | null
}

export type InterviewSessionMinAggregateOutputType = {
  session_id: string | null
  user_id: string | null
  session_name: string | null
  interview_type: $Enums.InterviewType | null
  score: runtime.Decimal | null
  created_at: Date | null
}

export type InterviewSessionMaxAggregateOutputType = {
  session_id: string | null
  user_id: string | null
  session_name: string | null
  interview_type: $Enums.InterviewType | null
  score: runtime.Decimal | null
  created_at: Date | null
}

export type InterviewSessionCountAggregateOutputType = {
  session_id: number
  user_id: number
  session_name: number
  interview_type: number
  questions: number
  user_answers: number
  ai_feedback: number
  score: number
  created_at: number
  _all: number
}


export type InterviewSessionAvgAggregateInputType = {
  score?: true
}

export type InterviewSessionSumAggregateInputType = {
  score?: true
}

export type InterviewSessionMinAggregateInputType = {
  session_id?: true
  user_id?: true
  session_name?: true
  interview_type?: true
  score?: true
  created_at?: true
}

export type InterviewSessionMaxAggregateInputType = {
  session_id?: true
  user_id?: true
  session_name?: true
  interview_type?: true
  score?: true
  created_at?: true
}

export type InterviewSessionCountAggregateInputType = {
  session_id?: true
  user_id?: true
  session_name?: true
  interview_type?: true
  questions?: true
  user_answers?: true
  ai_feedback?: true
  score?: true
  created_at?: true
  _all?: true
}

export type InterviewSessionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which InterviewSession to aggregate.
   */
  where?: Prisma.InterviewSessionWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of InterviewSessions to fetch.
   */
  orderBy?: Prisma.InterviewSessionOrderByWithRelationInput | Prisma.InterviewSessionOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the start position
   */
  cursor?: Prisma.InterviewSessionWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` InterviewSessions from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` InterviewSessions.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Count returned InterviewSessions
  **/
  _count?: true | InterviewSessionCountAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to average
  **/
  _avg?: InterviewSessionAvgAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to sum
  **/
  _sum?: InterviewSessionSumAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the minimum value
  **/
  _min?: InterviewSessionMinAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the maximum value
  **/
  _max?: InterviewSessionMaxAggregateInputType
}

export type GetInterviewSessionAggregateType<T extends InterviewSessionAggregateArgs> = {
      [P in keyof T & keyof AggregateInterviewSession]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateInterviewSession[P]>
    : Prisma.GetScalarType<T[P], AggregateInterviewSession[P]>
}




export type InterviewSessionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.InterviewSessionWhereInput
  orderBy?: Prisma.InterviewSessionOrderByWithAggregationInput | Prisma.InterviewSessionOrderByWithAggregationInput[]
  by: Prisma.InterviewSessionScalarFieldEnum[] | Prisma.InterviewSessionScalarFieldEnum
  having?: Prisma.InterviewSessionScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: InterviewSessionCountAggregateInputType | true
  _avg?: InterviewSessionAvgAggregateInputType
  _sum?: InterviewSessionSumAggregateInputType
  _min?: InterviewSessionMinAggregateInputType
  _max?: InterviewSessionMaxAggregateInputType
}

export type InterviewSessionGroupByOutputType = {
  session_id: string
  user_id: string
  session_name: string
  interview_type: $Enums.InterviewType
  questions: runtime.JsonValue
  user_answers: runtime.JsonValue | null
  ai_feedback: runtime.JsonValue | null
  score: runtime.Decimal | null
  created_at: Date
  _count: InterviewSessionCountAggregateOutputType | null
  _avg: InterviewSessionAvgAggregateOutputType | null
  _sum: InterviewSessionSumAggregateOutputType | null
  _min: InterviewSessionMinAggregateOutputType | null
  _max: InterviewSessionMaxAggregateOutputType | null
}

type GetInterviewSessionGroupByPayload<T extends InterviewSessionGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<InterviewSessionGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof InterviewSessionGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], InterviewSessionGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], InterviewSessionGroupByOutputType[P]>
      }
    >
  >



export type InterviewSessionWhereInput = {
  AND?: Prisma.InterviewSessionWhereInput | Prisma.InterviewSessionWhereInput[]
  OR?: Prisma.InterviewSessionWhereInput[]
  NOT?: Prisma.InterviewSessionWhereInput | Prisma.InterviewSessionWhereInput[]
  session_id?: Prisma.StringFilter<"InterviewSession"> | string
  user_id?: Prisma.StringFilter<"InterviewSession"> | string
  session_name?: Prisma.StringFilter<"InterviewSession"> | string
  interview_type?: Prisma.EnumInterviewTypeFilter<"InterviewSession"> | $Enums.InterviewType
  questions?: Prisma.JsonFilter<"InterviewSession">
  user_answers?: Prisma.JsonNullableFilter<"InterviewSession">
  ai_feedback?: Prisma.JsonNullableFilter<"InterviewSession">
  score?: Prisma.DecimalNullableFilter<"InterviewSession"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFilter<"InterviewSession"> | Date | string
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}

export type InterviewSessionOrderByWithRelationInput = {
  session_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  session_name?: Prisma.SortOrder
  interview_type?: Prisma.SortOrder
  questions?: Prisma.SortOrder
  user_answers?: Prisma.SortOrderInput | Prisma.SortOrder
  ai_feedback?: Prisma.SortOrderInput | Prisma.SortOrder
  score?: Prisma.SortOrderInput | Prisma.SortOrder
  created_at?: Prisma.SortOrder
  user?: Prisma.UserOrderByWithRelationInput
  _relevance?: Prisma.InterviewSessionOrderByRelevanceInput
}

export type InterviewSessionWhereUniqueInput = Prisma.AtLeast<{
  session_id?: string
  AND?: Prisma.InterviewSessionWhereInput | Prisma.InterviewSessionWhereInput[]
  OR?: Prisma.InterviewSessionWhereInput[]
  NOT?: Prisma.InterviewSessionWhereInput | Prisma.InterviewSessionWhereInput[]
  user_id?: Prisma.StringFilter<"InterviewSession"> | string
  session_name?: Prisma.StringFilter<"InterviewSession"> | string
  interview_type?: Prisma.EnumInterviewTypeFilter<"InterviewSession"> | $Enums.InterviewType
  questions?: Prisma.JsonFilter<"InterviewSession">
  user_answers?: Prisma.JsonNullableFilter<"InterviewSession">
  ai_feedback?: Prisma.JsonNullableFilter<"InterviewSession">
  score?: Prisma.DecimalNullableFilter<"InterviewSession"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFilter<"InterviewSession"> | Date | string
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}, "session_id">

export type InterviewSessionOrderByWithAggregationInput = {
  session_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  session_name?: Prisma.SortOrder
  interview_type?: Prisma.SortOrder
  questions?: Prisma.SortOrder
  user_answers?: Prisma.SortOrderInput | Prisma.SortOrder
  ai_feedback?: Prisma.SortOrderInput | Prisma.SortOrder
  score?: Prisma.SortOrderInput | Prisma.SortOrder
  created_at?: Prisma.SortOrder
  _count?: Prisma.InterviewSessionCountOrderByAggregateInput
  _avg?: Prisma.InterviewSessionAvgOrderByAggregateInput
  _max?: Prisma.InterviewSessionMaxOrderByAggregateInput
  _min?: Prisma.InterviewSessionMinOrderByAggregateInput
  _sum?: Prisma.InterviewSessionSumOrderByAggregateInput
}

export type InterviewSessionScalarWhereWithAggregatesInput = {
  AND?: Prisma.InterviewSessionScalarWhereWithAggregatesInput | Prisma.InterviewSessionScalarWhereWithAggregatesInput[]
  OR?: Prisma.InterviewSessionScalarWhereWithAggregatesInput[]
  NOT?: Prisma.InterviewSessionScalarWhereWithAggregatesInput | Prisma.InterviewSessionScalarWhereWithAggregatesInput[]
  session_id?: Prisma.StringWithAggregatesFilter<"InterviewSession"> | string
  user_id?: Prisma.StringWithAggregatesFilter<"InterviewSession"> | string
  session_name?: Prisma.StringWithAggregatesFilter<"InterviewSession"> | string
  interview_type?: Prisma.EnumInterviewTypeWithAggregatesFilter<"InterviewSession"> | $Enums.InterviewType
  questions?: Prisma.JsonWithAggregatesFilter<"InterviewSession">
  user_answers?: Prisma.JsonNullableWithAggregatesFilter<"InterviewSession">
  ai_feedback?: Prisma.JsonNullableWithAggregatesFilter<"InterviewSession">
  score?: Prisma.DecimalNullableWithAggregatesFilter<"InterviewSession"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeWithAggregatesFilter<"InterviewSession"> | Date | string
}

export type InterviewSessionCreateInput = {
  session_id?: string
  session_name: string
  interview_type: $Enums.InterviewType
  questions: Prisma.JsonNullValueInput | runtime.InputJsonValue
  user_answers?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  ai_feedback?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  user: Prisma.UserCreateNestedOneWithoutInterviewSessionsInput
}

export type InterviewSessionUncheckedCreateInput = {
  session_id?: string
  user_id: string
  session_name: string
  interview_type: $Enums.InterviewType
  questions: Prisma.JsonNullValueInput | runtime.InputJsonValue
  user_answers?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  ai_feedback?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
}

export type InterviewSessionUpdateInput = {
  session_id?: Prisma.StringFieldUpdateOperationsInput | string
  session_name?: Prisma.StringFieldUpdateOperationsInput | string
  interview_type?: Prisma.EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
  questions?: Prisma.JsonNullValueInput | runtime.InputJsonValue
  user_answers?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  ai_feedback?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  user?: Prisma.UserUpdateOneRequiredWithoutInterviewSessionsNestedInput
}

export type InterviewSessionUncheckedUpdateInput = {
  session_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  session_name?: Prisma.StringFieldUpdateOperationsInput | string
  interview_type?: Prisma.EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
  questions?: Prisma.JsonNullValueInput | runtime.InputJsonValue
  user_answers?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  ai_feedback?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type InterviewSessionCreateManyInput = {
  session_id?: string
  user_id: string
  session_name: string
  interview_type: $Enums.InterviewType
  questions: Prisma.JsonNullValueInput | runtime.InputJsonValue
  user_answers?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  ai_feedback?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
}

export type InterviewSessionUpdateManyMutationInput = {
  session_id?: Prisma.StringFieldUpdateOperationsInput | string
  session_name?: Prisma.StringFieldUpdateOperationsInput | string
  interview_type?: Prisma.EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
  questions?: Prisma.JsonNullValueInput | runtime.InputJsonValue
  user_answers?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  ai_feedback?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type InterviewSessionUncheckedUpdateManyInput = {
  session_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  session_name?: Prisma.StringFieldUpdateOperationsInput | string
  interview_type?: Prisma.EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
  questions?: Prisma.JsonNullValueInput | runtime.InputJsonValue
  user_answers?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  ai_feedback?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type InterviewSessionListRelationFilter = {
  every?: Prisma.InterviewSessionWhereInput
  some?: Prisma.InterviewSessionWhereInput
  none?: Prisma.InterviewSessionWhereInput
}

export type InterviewSessionOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type InterviewSessionOrderByRelevanceInput = {
  fields: Prisma.InterviewSessionOrderByRelevanceFieldEnum | Prisma.InterviewSessionOrderByRelevanceFieldEnum[]
  sort: Prisma.SortOrder
  search: string
}

export type InterviewSessionCountOrderByAggregateInput = {
  session_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  session_name?: Prisma.SortOrder
  interview_type?: Prisma.SortOrder
  questions?: Prisma.SortOrder
  user_answers?: Prisma.SortOrder
  ai_feedback?: Prisma.SortOrder
  score?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
}

export type InterviewSessionAvgOrderByAggregateInput = {
  score?: Prisma.SortOrder
}

export type InterviewSessionMaxOrderByAggregateInput = {
  session_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  session_name?: Prisma.SortOrder
  interview_type?: Prisma.SortOrder
  score?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
}

export type InterviewSessionMinOrderByAggregateInput = {
  session_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  session_name?: Prisma.SortOrder
  interview_type?: Prisma.SortOrder
  score?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
}

export type InterviewSessionSumOrderByAggregateInput = {
  score?: Prisma.SortOrder
}

export type InterviewSessionCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.InterviewSessionCreateWithoutUserInput, Prisma.InterviewSessionUncheckedCreateWithoutUserInput> | Prisma.InterviewSessionCreateWithoutUserInput[] | Prisma.InterviewSessionUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.InterviewSessionCreateOrConnectWithoutUserInput | Prisma.InterviewSessionCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.InterviewSessionCreateManyUserInputEnvelope
  connect?: Prisma.InterviewSessionWhereUniqueInput | Prisma.InterviewSessionWhereUniqueInput[]
}

export type InterviewSessionUncheckedCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.InterviewSessionCreateWithoutUserInput, Prisma.InterviewSessionUncheckedCreateWithoutUserInput> | Prisma.InterviewSessionCreateWithoutUserInput[] | Prisma.InterviewSessionUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.InterviewSessionCreateOrConnectWithoutUserInput | Prisma.InterviewSessionCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.InterviewSessionCreateManyUserInputEnvelope
  connect?: Prisma.InterviewSessionWhereUniqueInput | Prisma.InterviewSessionWhereUniqueInput[]
}

export type InterviewSessionUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.InterviewSessionCreateWithoutUserInput, Prisma.InterviewSessionUncheckedCreateWithoutUserInput> | Prisma.InterviewSessionCreateWithoutUserInput[] | Prisma.InterviewSessionUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.InterviewSessionCreateOrConnectWithoutUserInput | Prisma.InterviewSessionCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.InterviewSessionUpsertWithWhereUniqueWithoutUserInput | Prisma.InterviewSessionUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.InterviewSessionCreateManyUserInputEnvelope
  set?: Prisma.InterviewSessionWhereUniqueInput | Prisma.InterviewSessionWhereUniqueInput[]
  disconnect?: Prisma.InterviewSessionWhereUniqueInput | Prisma.InterviewSessionWhereUniqueInput[]
  delete?: Prisma.InterviewSessionWhereUniqueInput | Prisma.InterviewSessionWhereUniqueInput[]
  connect?: Prisma.InterviewSessionWhereUniqueInput | Prisma.InterviewSessionWhereUniqueInput[]
  update?: Prisma.InterviewSessionUpdateWithWhereUniqueWithoutUserInput | Prisma.InterviewSessionUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.InterviewSessionUpdateManyWithWhereWithoutUserInput | Prisma.InterviewSessionUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.InterviewSessionScalarWhereInput | Prisma.InterviewSessionScalarWhereInput[]
}

export type InterviewSessionUncheckedUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.InterviewSessionCreateWithoutUserInput, Prisma.InterviewSessionUncheckedCreateWithoutUserInput> | Prisma.InterviewSessionCreateWithoutUserInput[] | Prisma.InterviewSessionUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.InterviewSessionCreateOrConnectWithoutUserInput | Prisma.InterviewSessionCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.InterviewSessionUpsertWithWhereUniqueWithoutUserInput | Prisma.InterviewSessionUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.InterviewSessionCreateManyUserInputEnvelope
  set?: Prisma.InterviewSessionWhereUniqueInput | Prisma.InterviewSessionWhereUniqueInput[]
  disconnect?: Prisma.InterviewSessionWhereUniqueInput | Prisma.InterviewSessionWhereUniqueInput[]
  delete?: Prisma.InterviewSessionWhereUniqueInput | Prisma.InterviewSessionWhereUniqueInput[]
  connect?: Prisma.InterviewSessionWhereUniqueInput | Prisma.InterviewSessionWhereUniqueInput[]
  update?: Prisma.InterviewSessionUpdateWithWhereUniqueWithoutUserInput | Prisma.InterviewSessionUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.InterviewSessionUpdateManyWithWhereWithoutUserInput | Prisma.InterviewSessionUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.InterviewSessionScalarWhereInput | Prisma.InterviewSessionScalarWhereInput[]
}

export type EnumInterviewTypeFieldUpdateOperationsInput = {
  set?: $Enums.InterviewType
}

export type InterviewSessionCreateWithoutUserInput = {
  session_id?: string
  session_name: string
  interview_type: $Enums.InterviewType
  questions: Prisma.JsonNullValueInput | runtime.InputJsonValue
  user_answers?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  ai_feedback?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
}

export type InterviewSessionUncheckedCreateWithoutUserInput = {
  session_id?: string
  session_name: string
  interview_type: $Enums.InterviewType
  questions: Prisma.JsonNullValueInput | runtime.InputJsonValue
  user_answers?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  ai_feedback?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
}

export type InterviewSessionCreateOrConnectWithoutUserInput = {
  where: Prisma.InterviewSessionWhereUniqueInput
  create: Prisma.XOR<Prisma.InterviewSessionCreateWithoutUserInput, Prisma.InterviewSessionUncheckedCreateWithoutUserInput>
}

export type InterviewSessionCreateManyUserInputEnvelope = {
  data: Prisma.InterviewSessionCreateManyUserInput | Prisma.InterviewSessionCreateManyUserInput[]
  skipDuplicates?: boolean
}

export type InterviewSessionUpsertWithWhereUniqueWithoutUserInput = {
  where: Prisma.InterviewSessionWhereUniqueInput
  update: Prisma.XOR<Prisma.InterviewSessionUpdateWithoutUserInput, Prisma.InterviewSessionUncheckedUpdateWithoutUserInput>
  create: Prisma.XOR<Prisma.InterviewSessionCreateWithoutUserInput, Prisma.InterviewSessionUncheckedCreateWithoutUserInput>
}

export type InterviewSessionUpdateWithWhereUniqueWithoutUserInput = {
  where: Prisma.InterviewSessionWhereUniqueInput
  data: Prisma.XOR<Prisma.InterviewSessionUpdateWithoutUserInput, Prisma.InterviewSessionUncheckedUpdateWithoutUserInput>
}

export type InterviewSessionUpdateManyWithWhereWithoutUserInput = {
  where: Prisma.InterviewSessionScalarWhereInput
  data: Prisma.XOR<Prisma.InterviewSessionUpdateManyMutationInput, Prisma.InterviewSessionUncheckedUpdateManyWithoutUserInput>
}

export type InterviewSessionScalarWhereInput = {
  AND?: Prisma.InterviewSessionScalarWhereInput | Prisma.InterviewSessionScalarWhereInput[]
  OR?: Prisma.InterviewSessionScalarWhereInput[]
  NOT?: Prisma.InterviewSessionScalarWhereInput | Prisma.InterviewSessionScalarWhereInput[]
  session_id?: Prisma.StringFilter<"InterviewSession"> | string
  user_id?: Prisma.StringFilter<"InterviewSession"> | string
  session_name?: Prisma.StringFilter<"InterviewSession"> | string
  interview_type?: Prisma.EnumInterviewTypeFilter<"InterviewSession"> | $Enums.InterviewType
  questions?: Prisma.JsonFilter<"InterviewSession">
  user_answers?: Prisma.JsonNullableFilter<"InterviewSession">
  ai_feedback?: Prisma.JsonNullableFilter<"InterviewSession">
  score?: Prisma.DecimalNullableFilter<"InterviewSession"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFilter<"InterviewSession"> | Date | string
}

export type InterviewSessionCreateManyUserInput = {
  session_id?: string
  session_name: string
  interview_type: $Enums.InterviewType
  questions: Prisma.JsonNullValueInput | runtime.InputJsonValue
  user_answers?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  ai_feedback?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  score?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
}

export type InterviewSessionUpdateWithoutUserInput = {
  session_id?: Prisma.StringFieldUpdateOperationsInput | string
  session_name?: Prisma.StringFieldUpdateOperationsInput | string
  interview_type?: Prisma.EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
  questions?: Prisma.JsonNullValueInput | runtime.InputJsonValue
  user_answers?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  ai_feedback?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type InterviewSessionUncheckedUpdateWithoutUserInput = {
  session_id?: Prisma.StringFieldUpdateOperationsInput | string
  session_name?: Prisma.StringFieldUpdateOperationsInput | string
  interview_type?: Prisma.EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
  questions?: Prisma.JsonNullValueInput | runtime.InputJsonValue
  user_answers?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  ai_feedback?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type InterviewSessionUncheckedUpdateManyWithoutUserInput = {
  session_id?: Prisma.StringFieldUpdateOperationsInput | string
  session_name?: Prisma.StringFieldUpdateOperationsInput | string
  interview_type?: Prisma.EnumInterviewTypeFieldUpdateOperationsInput | $Enums.InterviewType
  questions?: Prisma.JsonNullValueInput | runtime.InputJsonValue
  user_answers?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  ai_feedback?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue
  score?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}



export type InterviewSessionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  session_id?: boolean
  user_id?: boolean
  session_name?: boolean
  interview_type?: boolean
  questions?: boolean
  user_answers?: boolean
  ai_feedback?: boolean
  score?: boolean
  created_at?: boolean
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}, ExtArgs["result"]["interviewSession"]>



export type InterviewSessionSelectScalar = {
  session_id?: boolean
  user_id?: boolean
  session_name?: boolean
  interview_type?: boolean
  questions?: boolean
  user_answers?: boolean
  ai_feedback?: boolean
  score?: boolean
  created_at?: boolean
}

export type InterviewSessionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"session_id" | "user_id" | "session_name" | "interview_type" | "questions" | "user_answers" | "ai_feedback" | "score" | "created_at", ExtArgs["result"]["interviewSession"]>
export type InterviewSessionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}

export type $InterviewSessionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "InterviewSession"
  objects: {
    user: Prisma.$UserPayload<ExtArgs>
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    session_id: string
    user_id: string
    session_name: string
    interview_type: $Enums.InterviewType
    questions: runtime.JsonValue
    user_answers: runtime.JsonValue | null
    ai_feedback: runtime.JsonValue | null
    score: runtime.Decimal | null
    created_at: Date
  }, ExtArgs["result"]["interviewSession"]>
  composites: {}
}

export type InterviewSessionGetPayload<S extends boolean | null | undefined | InterviewSessionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$InterviewSessionPayload, S>

export type InterviewSessionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<InterviewSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: InterviewSessionCountAggregateInputType | true
  }

export interface InterviewSessionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InterviewSession'], meta: { name: 'InterviewSession' } }
  /**
   * Find zero or one InterviewSession that matches the filter.
   * @param {InterviewSessionFindUniqueArgs} args - Arguments to find a InterviewSession
   * @example
   * // Get one InterviewSession
   * const interviewSession = await prisma.interviewSession.findUnique({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUnique<T extends InterviewSessionFindUniqueArgs>(args: Prisma.SelectSubset<T, InterviewSessionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__InterviewSessionClient<runtime.Types.Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find one InterviewSession that matches the filter or throw an error with `error.code='P2025'`
   * if no matches were found.
   * @param {InterviewSessionFindUniqueOrThrowArgs} args - Arguments to find a InterviewSession
   * @example
   * // Get one InterviewSession
   * const interviewSession = await prisma.interviewSession.findUniqueOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUniqueOrThrow<T extends InterviewSessionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, InterviewSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__InterviewSessionClient<runtime.Types.Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first InterviewSession that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {InterviewSessionFindFirstArgs} args - Arguments to find a InterviewSession
   * @example
   * // Get one InterviewSession
   * const interviewSession = await prisma.interviewSession.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends InterviewSessionFindFirstArgs>(args?: Prisma.SelectSubset<T, InterviewSessionFindFirstArgs<ExtArgs>>): Prisma.Prisma__InterviewSessionClient<runtime.Types.Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first InterviewSession that matches the filter or
   * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {InterviewSessionFindFirstOrThrowArgs} args - Arguments to find a InterviewSession
   * @example
   * // Get one InterviewSession
   * const interviewSession = await prisma.interviewSession.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends InterviewSessionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, InterviewSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__InterviewSessionClient<runtime.Types.Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find zero or more InterviewSessions that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {InterviewSessionFindManyArgs} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all InterviewSessions
   * const interviewSessions = await prisma.interviewSession.findMany()
   * 
   * // Get first 10 InterviewSessions
   * const interviewSessions = await prisma.interviewSession.findMany({ take: 10 })
   * 
   * // Only select the `session_id`
   * const interviewSessionWithSession_idOnly = await prisma.interviewSession.findMany({ select: { session_id: true } })
   * 
   */
  findMany<T extends InterviewSessionFindManyArgs>(args?: Prisma.SelectSubset<T, InterviewSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  /**
   * Create a InterviewSession.
   * @param {InterviewSessionCreateArgs} args - Arguments to create a InterviewSession.
   * @example
   * // Create one InterviewSession
   * const InterviewSession = await prisma.interviewSession.create({
   *   data: {
   *     // ... data to create a InterviewSession
   *   }
   * })
   * 
   */
  create<T extends InterviewSessionCreateArgs>(args: Prisma.SelectSubset<T, InterviewSessionCreateArgs<ExtArgs>>): Prisma.Prisma__InterviewSessionClient<runtime.Types.Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Create many InterviewSessions.
   * @param {InterviewSessionCreateManyArgs} args - Arguments to create many InterviewSessions.
   * @example
   * // Create many InterviewSessions
   * const interviewSession = await prisma.interviewSession.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   *     
   */
  createMany<T extends InterviewSessionCreateManyArgs>(args?: Prisma.SelectSubset<T, InterviewSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Delete a InterviewSession.
   * @param {InterviewSessionDeleteArgs} args - Arguments to delete one InterviewSession.
   * @example
   * // Delete one InterviewSession
   * const InterviewSession = await prisma.interviewSession.delete({
   *   where: {
   *     // ... filter to delete one InterviewSession
   *   }
   * })
   * 
   */
  delete<T extends InterviewSessionDeleteArgs>(args: Prisma.SelectSubset<T, InterviewSessionDeleteArgs<ExtArgs>>): Prisma.Prisma__InterviewSessionClient<runtime.Types.Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Update one InterviewSession.
   * @param {InterviewSessionUpdateArgs} args - Arguments to update one InterviewSession.
   * @example
   * // Update one InterviewSession
   * const interviewSession = await prisma.interviewSession.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends InterviewSessionUpdateArgs>(args: Prisma.SelectSubset<T, InterviewSessionUpdateArgs<ExtArgs>>): Prisma.Prisma__InterviewSessionClient<runtime.Types.Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Delete zero or more InterviewSessions.
   * @param {InterviewSessionDeleteManyArgs} args - Arguments to filter InterviewSessions to delete.
   * @example
   * // Delete a few InterviewSessions
   * const { count } = await prisma.interviewSession.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany<T extends InterviewSessionDeleteManyArgs>(args?: Prisma.SelectSubset<T, InterviewSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Update zero or more InterviewSessions.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {InterviewSessionUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many InterviewSessions
   * const interviewSession = await prisma.interviewSession.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany<T extends InterviewSessionUpdateManyArgs>(args: Prisma.SelectSubset<T, InterviewSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Create or update one InterviewSession.
   * @param {InterviewSessionUpsertArgs} args - Arguments to update or create a InterviewSession.
   * @example
   * // Update or create a InterviewSession
   * const interviewSession = await prisma.interviewSession.upsert({
   *   create: {
   *     // ... data to create a InterviewSession
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the InterviewSession we want to update
   *   }
   * })
   */
  upsert<T extends InterviewSessionUpsertArgs>(args: Prisma.SelectSubset<T, InterviewSessionUpsertArgs<ExtArgs>>): Prisma.Prisma__InterviewSessionClient<runtime.Types.Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


  /**
   * Count the number of InterviewSessions.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {InterviewSessionCountArgs} args - Arguments to filter InterviewSessions to count.
   * @example
   * // Count the number of InterviewSessions
   * const count = await prisma.interviewSession.count({
   *   where: {
   *     // ... the filter for the InterviewSessions we want to count
   *   }
   * })
  **/
  count<T extends InterviewSessionCountArgs>(
    args?: Prisma.Subset<T, InterviewSessionCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], InterviewSessionCountAggregateOutputType>
      : number
  >

  /**
   * Allows you to perform aggregations operations on a InterviewSession.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {InterviewSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Ordered by age ascending
   * // Where email contains prisma.io
   * // Limited to the 10 users
   * const aggregations = await prisma.user.aggregate({
   *   _avg: {
   *     age: true,
   *   },
   *   where: {
   *     email: {
   *       contains: "prisma.io",
   *     },
   *   },
   *   orderBy: {
   *     age: "asc",
   *   },
   *   take: 10,
   * })
  **/
  aggregate<T extends InterviewSessionAggregateArgs>(args: Prisma.Subset<T, InterviewSessionAggregateArgs>): Prisma.PrismaPromise<GetInterviewSessionAggregateType<T>>

  /**
   * Group by InterviewSession.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {InterviewSessionGroupByArgs} args - Group by arguments.
   * @example
   * // Group by city, order by createdAt, get count
   * const result = await prisma.user.groupBy({
   *   by: ['city', 'createdAt'],
   *   orderBy: {
   *     createdAt: true
   *   },
   *   _count: {
   *     _all: true
   *   },
   * })
   * 
  **/
  groupBy<
    T extends InterviewSessionGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: InterviewSessionGroupByArgs['orderBy'] }
      : { orderBy?: InterviewSessionGroupByArgs['orderBy'] },
    OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>,
    ByFields extends Prisma.MaybeTupleToUnion<T['by']>,
    ByValid extends Prisma.Has<ByFields, OrderFields>,
    HavingFields extends Prisma.GetHavingFields<T['having']>,
    HavingValid extends Prisma.Has<ByFields, HavingFields>,
    ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False,
    InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
          ? never
          : P extends string
          ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
          : [
              Error,
              'Field ',
              P,
              ` in "having" needs to be provided in "by"`,
            ]
      }[HavingFields]
    : 'take' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
          ? never
          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
      }[OrderFields]
  >(args: Prisma.SubsetIntersection<T, InterviewSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInterviewSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
/**
 * Fields of the InterviewSession model
 */
readonly fields: InterviewSessionFieldRefs;
}

/**
 * The delegate class that acts as a "Promise-like" for InterviewSession.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__InterviewSessionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}




/**
 * Fields of the InterviewSession model
 */
export interface InterviewSessionFieldRefs {
  readonly session_id: Prisma.FieldRef<"InterviewSession", 'String'>
  readonly user_id: Prisma.FieldRef<"InterviewSession", 'String'>
  readonly session_name: Prisma.FieldRef<"InterviewSession", 'String'>
  readonly interview_type: Prisma.FieldRef<"InterviewSession", 'InterviewType'>
  readonly questions: Prisma.FieldRef<"InterviewSession", 'Json'>
  readonly user_answers: Prisma.FieldRef<"InterviewSession", 'Json'>
  readonly ai_feedback: Prisma.FieldRef<"InterviewSession", 'Json'>
  readonly score: Prisma.FieldRef<"InterviewSession", 'Decimal'>
  readonly created_at: Prisma.FieldRef<"InterviewSession", 'DateTime'>
}
    

// Custom InputTypes
/**
 * InterviewSession findUnique
 */
export type InterviewSessionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the InterviewSession
   */
  select?: Prisma.InterviewSessionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the InterviewSession
   */
  omit?: Prisma.InterviewSessionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.InterviewSessionInclude<ExtArgs> | null
  /**
   * Filter, which InterviewSession to fetch.
   */
  where: Prisma.InterviewSessionWhereUniqueInput
}

/**
 * InterviewSession findUniqueOrThrow
 */
export type InterviewSessionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the InterviewSession
   */
  select?: Prisma.InterviewSessionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the InterviewSession
   */
  omit?: Prisma.InterviewSessionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.InterviewSessionInclude<ExtArgs> | null
  /**
   * Filter, which InterviewSession to fetch.
   */
  where: Prisma.InterviewSessionWhereUniqueInput
}

/**
 * InterviewSession findFirst
 */
export type InterviewSessionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the InterviewSession
   */
  select?: Prisma.InterviewSessionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the InterviewSession
   */
  omit?: Prisma.InterviewSessionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.InterviewSessionInclude<ExtArgs> | null
  /**
   * Filter, which InterviewSession to fetch.
   */
  where?: Prisma.InterviewSessionWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of InterviewSessions to fetch.
   */
  orderBy?: Prisma.InterviewSessionOrderByWithRelationInput | Prisma.InterviewSessionOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for InterviewSessions.
   */
  cursor?: Prisma.InterviewSessionWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` InterviewSessions from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` InterviewSessions.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of InterviewSessions.
   */
  distinct?: Prisma.InterviewSessionScalarFieldEnum | Prisma.InterviewSessionScalarFieldEnum[]
}

/**
 * InterviewSession findFirstOrThrow
 */
export type InterviewSessionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the InterviewSession
   */
  select?: Prisma.InterviewSessionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the InterviewSession
   */
  omit?: Prisma.InterviewSessionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.InterviewSessionInclude<ExtArgs> | null
  /**
   * Filter, which InterviewSession to fetch.
   */
  where?: Prisma.InterviewSessionWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of InterviewSessions to fetch.
   */
  orderBy?: Prisma.InterviewSessionOrderByWithRelationInput | Prisma.InterviewSessionOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for InterviewSessions.
   */
  cursor?: Prisma.InterviewSessionWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` InterviewSessions from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` InterviewSessions.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of InterviewSessions.
   */
  distinct?: Prisma.InterviewSessionScalarFieldEnum | Prisma.InterviewSessionScalarFieldEnum[]
}

/**
 * InterviewSession findMany
 */
export type InterviewSessionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the InterviewSession
   */
  select?: Prisma.InterviewSessionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the InterviewSession
   */
  omit?: Prisma.InterviewSessionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.InterviewSessionInclude<ExtArgs> | null
  /**
   * Filter, which InterviewSessions to fetch.
   */
  where?: Prisma.InterviewSessionWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of InterviewSessions to fetch.
   */
  orderBy?: Prisma.InterviewSessionOrderByWithRelationInput | Prisma.InterviewSessionOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for listing InterviewSessions.
   */
  cursor?: Prisma.InterviewSessionWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` InterviewSessions from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` InterviewSessions.
   */
  skip?: number
  distinct?: Prisma.InterviewSessionScalarFieldEnum | Prisma.InterviewSessionScalarFieldEnum[]
}

/**
 * InterviewSession create
 */
export type InterviewSessionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the InterviewSession
   */
  select?: Prisma.InterviewSessionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the InterviewSession
   */
  omit?: Prisma.InterviewSessionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.InterviewSessionInclude<ExtArgs> | null
  /**
   * The data needed to create a InterviewSession.
   */
  data: Prisma.XOR<Prisma.InterviewSessionCreateInput, Prisma.InterviewSessionUncheckedCreateInput>
}

/**
 * InterviewSession createMany
 */
export type InterviewSessionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to create many InterviewSessions.
   */
  data: Prisma.InterviewSessionCreateManyInput | Prisma.InterviewSessionCreateManyInput[]
  skipDuplicates?: boolean
}

/**
 * InterviewSession update
 */
export type InterviewSessionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the InterviewSession
   */
  select?: Prisma.InterviewSessionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the InterviewSession
   */
  omit?: Prisma.InterviewSessionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.InterviewSessionInclude<ExtArgs> | null
  /**
   * The data needed to update a InterviewSession.
   */
  data: Prisma.XOR<Prisma.InterviewSessionUpdateInput, Prisma.InterviewSessionUncheckedUpdateInput>
  /**
   * Choose, which InterviewSession to update.
   */
  where: Prisma.InterviewSessionWhereUniqueInput
}

/**
 * InterviewSession updateMany
 */
export type InterviewSessionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to update InterviewSessions.
   */
  data: Prisma.XOR<Prisma.InterviewSessionUpdateManyMutationInput, Prisma.InterviewSessionUncheckedUpdateManyInput>
  /**
   * Filter which InterviewSessions to update
   */
  where?: Prisma.InterviewSessionWhereInput
  /**
   * Limit how many InterviewSessions to update.
   */
  limit?: number
}

/**
 * InterviewSession upsert
 */
export type InterviewSessionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the InterviewSession
   */
  select?: Prisma.InterviewSessionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the InterviewSession
   */
  omit?: Prisma.InterviewSessionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.InterviewSessionInclude<ExtArgs> | null
  /**
   * The filter to search for the InterviewSession to update in case it exists.
   */
  where: Prisma.InterviewSessionWhereUniqueInput
  /**
   * In case the InterviewSession found by the `where` argument doesn't exist, create a new InterviewSession with this data.
   */
  create: Prisma.XOR<Prisma.InterviewSessionCreateInput, Prisma.InterviewSessionUncheckedCreateInput>
  /**
   * In case the InterviewSession was found with the provided `where` argument, update it with this data.
   */
  update: Prisma.XOR<Prisma.InterviewSessionUpdateInput, Prisma.InterviewSessionUncheckedUpdateInput>
}

/**
 * InterviewSession delete
 */
export type InterviewSessionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the InterviewSession
   */
  select?: Prisma.InterviewSessionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the InterviewSession
   */
  omit?: Prisma.InterviewSessionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.InterviewSessionInclude<ExtArgs> | null
  /**
   * Filter which InterviewSession to delete.
   */
  where: Prisma.InterviewSessionWhereUniqueInput
}

/**
 * InterviewSession deleteMany
 */
export type InterviewSessionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which InterviewSessions to delete
   */
  where?: Prisma.InterviewSessionWhereInput
  /**
   * Limit how many InterviewSessions to delete.
   */
  limit?: number
}

/**
 * InterviewSession without action
 */
export type InterviewSessionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the InterviewSession
   */
  select?: Prisma.InterviewSessionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the InterviewSession
   */
  omit?: Prisma.InterviewSessionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.InterviewSessionInclude<ExtArgs> | null
}

```

## File: src/generated/prisma/models/LearningEvent.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file exports the `LearningEvent` model and its related types.
 *
 * 🟢 You can import this file directly.
 */
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"

/**
 * Model LearningEvent
 * 
 */
export type LearningEventModel = runtime.Types.Result.DefaultSelection<Prisma.$LearningEventPayload>

export type AggregateLearningEvent = {
  _count: LearningEventCountAggregateOutputType | null
  _avg: LearningEventAvgAggregateOutputType | null
  _sum: LearningEventSumAggregateOutputType | null
  _min: LearningEventMinAggregateOutputType | null
  _max: LearningEventMaxAggregateOutputType | null
}

export type LearningEventAvgAggregateOutputType = {
  reminder_minutes: number | null
}

export type LearningEventSumAggregateOutputType = {
  reminder_minutes: number | null
}

export type LearningEventMinAggregateOutputType = {
  event_id: string | null
  user_id: string | null
  title: string | null
  description: string | null
  status: $Enums.EventStatus | null
  start_utc: Date | null
  end_utc: Date | null
  all_day: boolean | null
  timezone: string | null
  module_id: string | null
  color: string | null
  is_ai_suggested: boolean | null
  reminder_minutes: number | null
  is_deleted: boolean | null
  created_at: Date | null
  updated_at: Date | null
}

export type LearningEventMaxAggregateOutputType = {
  event_id: string | null
  user_id: string | null
  title: string | null
  description: string | null
  status: $Enums.EventStatus | null
  start_utc: Date | null
  end_utc: Date | null
  all_day: boolean | null
  timezone: string | null
  module_id: string | null
  color: string | null
  is_ai_suggested: boolean | null
  reminder_minutes: number | null
  is_deleted: boolean | null
  created_at: Date | null
  updated_at: Date | null
}

export type LearningEventCountAggregateOutputType = {
  event_id: number
  user_id: number
  title: number
  description: number
  status: number
  start_utc: number
  end_utc: number
  all_day: number
  timezone: number
  module_id: number
  color: number
  is_ai_suggested: number
  reminder_minutes: number
  is_deleted: number
  created_at: number
  updated_at: number
  _all: number
}


export type LearningEventAvgAggregateInputType = {
  reminder_minutes?: true
}

export type LearningEventSumAggregateInputType = {
  reminder_minutes?: true
}

export type LearningEventMinAggregateInputType = {
  event_id?: true
  user_id?: true
  title?: true
  description?: true
  status?: true
  start_utc?: true
  end_utc?: true
  all_day?: true
  timezone?: true
  module_id?: true
  color?: true
  is_ai_suggested?: true
  reminder_minutes?: true
  is_deleted?: true
  created_at?: true
  updated_at?: true
}

export type LearningEventMaxAggregateInputType = {
  event_id?: true
  user_id?: true
  title?: true
  description?: true
  status?: true
  start_utc?: true
  end_utc?: true
  all_day?: true
  timezone?: true
  module_id?: true
  color?: true
  is_ai_suggested?: true
  reminder_minutes?: true
  is_deleted?: true
  created_at?: true
  updated_at?: true
}

export type LearningEventCountAggregateInputType = {
  event_id?: true
  user_id?: true
  title?: true
  description?: true
  status?: true
  start_utc?: true
  end_utc?: true
  all_day?: true
  timezone?: true
  module_id?: true
  color?: true
  is_ai_suggested?: true
  reminder_minutes?: true
  is_deleted?: true
  created_at?: true
  updated_at?: true
  _all?: true
}

export type LearningEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which LearningEvent to aggregate.
   */
  where?: Prisma.LearningEventWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of LearningEvents to fetch.
   */
  orderBy?: Prisma.LearningEventOrderByWithRelationInput | Prisma.LearningEventOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the start position
   */
  cursor?: Prisma.LearningEventWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` LearningEvents from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` LearningEvents.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Count returned LearningEvents
  **/
  _count?: true | LearningEventCountAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to average
  **/
  _avg?: LearningEventAvgAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to sum
  **/
  _sum?: LearningEventSumAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the minimum value
  **/
  _min?: LearningEventMinAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the maximum value
  **/
  _max?: LearningEventMaxAggregateInputType
}

export type GetLearningEventAggregateType<T extends LearningEventAggregateArgs> = {
      [P in keyof T & keyof AggregateLearningEvent]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateLearningEvent[P]>
    : Prisma.GetScalarType<T[P], AggregateLearningEvent[P]>
}




export type LearningEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.LearningEventWhereInput
  orderBy?: Prisma.LearningEventOrderByWithAggregationInput | Prisma.LearningEventOrderByWithAggregationInput[]
  by: Prisma.LearningEventScalarFieldEnum[] | Prisma.LearningEventScalarFieldEnum
  having?: Prisma.LearningEventScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: LearningEventCountAggregateInputType | true
  _avg?: LearningEventAvgAggregateInputType
  _sum?: LearningEventSumAggregateInputType
  _min?: LearningEventMinAggregateInputType
  _max?: LearningEventMaxAggregateInputType
}

export type LearningEventGroupByOutputType = {
  event_id: string
  user_id: string
  title: string
  description: string | null
  status: $Enums.EventStatus
  start_utc: Date
  end_utc: Date
  all_day: boolean
  timezone: string
  module_id: string | null
  color: string
  is_ai_suggested: boolean
  reminder_minutes: number | null
  is_deleted: boolean
  created_at: Date
  updated_at: Date
  _count: LearningEventCountAggregateOutputType | null
  _avg: LearningEventAvgAggregateOutputType | null
  _sum: LearningEventSumAggregateOutputType | null
  _min: LearningEventMinAggregateOutputType | null
  _max: LearningEventMaxAggregateOutputType | null
}

type GetLearningEventGroupByPayload<T extends LearningEventGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<LearningEventGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof LearningEventGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], LearningEventGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], LearningEventGroupByOutputType[P]>
      }
    >
  >



export type LearningEventWhereInput = {
  AND?: Prisma.LearningEventWhereInput | Prisma.LearningEventWhereInput[]
  OR?: Prisma.LearningEventWhereInput[]
  NOT?: Prisma.LearningEventWhereInput | Prisma.LearningEventWhereInput[]
  event_id?: Prisma.StringFilter<"LearningEvent"> | string
  user_id?: Prisma.StringFilter<"LearningEvent"> | string
  title?: Prisma.StringFilter<"LearningEvent"> | string
  description?: Prisma.StringNullableFilter<"LearningEvent"> | string | null
  status?: Prisma.EnumEventStatusFilter<"LearningEvent"> | $Enums.EventStatus
  start_utc?: Prisma.DateTimeFilter<"LearningEvent"> | Date | string
  end_utc?: Prisma.DateTimeFilter<"LearningEvent"> | Date | string
  all_day?: Prisma.BoolFilter<"LearningEvent"> | boolean
  timezone?: Prisma.StringFilter<"LearningEvent"> | string
  module_id?: Prisma.StringNullableFilter<"LearningEvent"> | string | null
  color?: Prisma.StringFilter<"LearningEvent"> | string
  is_ai_suggested?: Prisma.BoolFilter<"LearningEvent"> | boolean
  reminder_minutes?: Prisma.IntNullableFilter<"LearningEvent"> | number | null
  is_deleted?: Prisma.BoolFilter<"LearningEvent"> | boolean
  created_at?: Prisma.DateTimeFilter<"LearningEvent"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"LearningEvent"> | Date | string
  module?: Prisma.XOR<Prisma.ModuleNullableScalarRelationFilter, Prisma.ModuleWhereInput> | null
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}

export type LearningEventOrderByWithRelationInput = {
  event_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrderInput | Prisma.SortOrder
  status?: Prisma.SortOrder
  start_utc?: Prisma.SortOrder
  end_utc?: Prisma.SortOrder
  all_day?: Prisma.SortOrder
  timezone?: Prisma.SortOrder
  module_id?: Prisma.SortOrderInput | Prisma.SortOrder
  color?: Prisma.SortOrder
  is_ai_suggested?: Prisma.SortOrder
  reminder_minutes?: Prisma.SortOrderInput | Prisma.SortOrder
  is_deleted?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
  module?: Prisma.ModuleOrderByWithRelationInput
  user?: Prisma.UserOrderByWithRelationInput
  _relevance?: Prisma.LearningEventOrderByRelevanceInput
}

export type LearningEventWhereUniqueInput = Prisma.AtLeast<{
  event_id?: string
  AND?: Prisma.LearningEventWhereInput | Prisma.LearningEventWhereInput[]
  OR?: Prisma.LearningEventWhereInput[]
  NOT?: Prisma.LearningEventWhereInput | Prisma.LearningEventWhereInput[]
  user_id?: Prisma.StringFilter<"LearningEvent"> | string
  title?: Prisma.StringFilter<"LearningEvent"> | string
  description?: Prisma.StringNullableFilter<"LearningEvent"> | string | null
  status?: Prisma.EnumEventStatusFilter<"LearningEvent"> | $Enums.EventStatus
  start_utc?: Prisma.DateTimeFilter<"LearningEvent"> | Date | string
  end_utc?: Prisma.DateTimeFilter<"LearningEvent"> | Date | string
  all_day?: Prisma.BoolFilter<"LearningEvent"> | boolean
  timezone?: Prisma.StringFilter<"LearningEvent"> | string
  module_id?: Prisma.StringNullableFilter<"LearningEvent"> | string | null
  color?: Prisma.StringFilter<"LearningEvent"> | string
  is_ai_suggested?: Prisma.BoolFilter<"LearningEvent"> | boolean
  reminder_minutes?: Prisma.IntNullableFilter<"LearningEvent"> | number | null
  is_deleted?: Prisma.BoolFilter<"LearningEvent"> | boolean
  created_at?: Prisma.DateTimeFilter<"LearningEvent"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"LearningEvent"> | Date | string
  module?: Prisma.XOR<Prisma.ModuleNullableScalarRelationFilter, Prisma.ModuleWhereInput> | null
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}, "event_id">

export type LearningEventOrderByWithAggregationInput = {
  event_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrderInput | Prisma.SortOrder
  status?: Prisma.SortOrder
  start_utc?: Prisma.SortOrder
  end_utc?: Prisma.SortOrder
  all_day?: Prisma.SortOrder
  timezone?: Prisma.SortOrder
  module_id?: Prisma.SortOrderInput | Prisma.SortOrder
  color?: Prisma.SortOrder
  is_ai_suggested?: Prisma.SortOrder
  reminder_minutes?: Prisma.SortOrderInput | Prisma.SortOrder
  is_deleted?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
  _count?: Prisma.LearningEventCountOrderByAggregateInput
  _avg?: Prisma.LearningEventAvgOrderByAggregateInput
  _max?: Prisma.LearningEventMaxOrderByAggregateInput
  _min?: Prisma.LearningEventMinOrderByAggregateInput
  _sum?: Prisma.LearningEventSumOrderByAggregateInput
}

export type LearningEventScalarWhereWithAggregatesInput = {
  AND?: Prisma.LearningEventScalarWhereWithAggregatesInput | Prisma.LearningEventScalarWhereWithAggregatesInput[]
  OR?: Prisma.LearningEventScalarWhereWithAggregatesInput[]
  NOT?: Prisma.LearningEventScalarWhereWithAggregatesInput | Prisma.LearningEventScalarWhereWithAggregatesInput[]
  event_id?: Prisma.StringWithAggregatesFilter<"LearningEvent"> | string
  user_id?: Prisma.StringWithAggregatesFilter<"LearningEvent"> | string
  title?: Prisma.StringWithAggregatesFilter<"LearningEvent"> | string
  description?: Prisma.StringNullableWithAggregatesFilter<"LearningEvent"> | string | null
  status?: Prisma.EnumEventStatusWithAggregatesFilter<"LearningEvent"> | $Enums.EventStatus
  start_utc?: Prisma.DateTimeWithAggregatesFilter<"LearningEvent"> | Date | string
  end_utc?: Prisma.DateTimeWithAggregatesFilter<"LearningEvent"> | Date | string
  all_day?: Prisma.BoolWithAggregatesFilter<"LearningEvent"> | boolean
  timezone?: Prisma.StringWithAggregatesFilter<"LearningEvent"> | string
  module_id?: Prisma.StringNullableWithAggregatesFilter<"LearningEvent"> | string | null
  color?: Prisma.StringWithAggregatesFilter<"LearningEvent"> | string
  is_ai_suggested?: Prisma.BoolWithAggregatesFilter<"LearningEvent"> | boolean
  reminder_minutes?: Prisma.IntNullableWithAggregatesFilter<"LearningEvent"> | number | null
  is_deleted?: Prisma.BoolWithAggregatesFilter<"LearningEvent"> | boolean
  created_at?: Prisma.DateTimeWithAggregatesFilter<"LearningEvent"> | Date | string
  updated_at?: Prisma.DateTimeWithAggregatesFilter<"LearningEvent"> | Date | string
}

export type LearningEventCreateInput = {
  event_id?: string
  title?: string
  description?: string | null
  status?: $Enums.EventStatus
  start_utc: Date | string
  end_utc: Date | string
  all_day?: boolean
  timezone?: string
  color?: string
  is_ai_suggested?: boolean
  reminder_minutes?: number | null
  is_deleted?: boolean
  created_at?: Date | string
  updated_at?: Date | string
  module?: Prisma.ModuleCreateNestedOneWithoutLearningEventsInput
  user: Prisma.UserCreateNestedOneWithoutLearningEventsInput
}

export type LearningEventUncheckedCreateInput = {
  event_id?: string
  user_id: string
  title?: string
  description?: string | null
  status?: $Enums.EventStatus
  start_utc: Date | string
  end_utc: Date | string
  all_day?: boolean
  timezone?: string
  module_id?: string | null
  color?: string
  is_ai_suggested?: boolean
  reminder_minutes?: number | null
  is_deleted?: boolean
  created_at?: Date | string
  updated_at?: Date | string
}

export type LearningEventUpdateInput = {
  event_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
  start_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  end_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  all_day?: Prisma.BoolFieldUpdateOperationsInput | boolean
  timezone?: Prisma.StringFieldUpdateOperationsInput | string
  color?: Prisma.StringFieldUpdateOperationsInput | string
  is_ai_suggested?: Prisma.BoolFieldUpdateOperationsInput | boolean
  reminder_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null
  is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  module?: Prisma.ModuleUpdateOneWithoutLearningEventsNestedInput
  user?: Prisma.UserUpdateOneRequiredWithoutLearningEventsNestedInput
}

export type LearningEventUncheckedUpdateInput = {
  event_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
  start_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  end_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  all_day?: Prisma.BoolFieldUpdateOperationsInput | boolean
  timezone?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  color?: Prisma.StringFieldUpdateOperationsInput | string
  is_ai_suggested?: Prisma.BoolFieldUpdateOperationsInput | boolean
  reminder_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null
  is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type LearningEventCreateManyInput = {
  event_id?: string
  user_id: string
  title?: string
  description?: string | null
  status?: $Enums.EventStatus
  start_utc: Date | string
  end_utc: Date | string
  all_day?: boolean
  timezone?: string
  module_id?: string | null
  color?: string
  is_ai_suggested?: boolean
  reminder_minutes?: number | null
  is_deleted?: boolean
  created_at?: Date | string
  updated_at?: Date | string
}

export type LearningEventUpdateManyMutationInput = {
  event_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
  start_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  end_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  all_day?: Prisma.BoolFieldUpdateOperationsInput | boolean
  timezone?: Prisma.StringFieldUpdateOperationsInput | string
  color?: Prisma.StringFieldUpdateOperationsInput | string
  is_ai_suggested?: Prisma.BoolFieldUpdateOperationsInput | boolean
  reminder_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null
  is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type LearningEventUncheckedUpdateManyInput = {
  event_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
  start_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  end_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  all_day?: Prisma.BoolFieldUpdateOperationsInput | boolean
  timezone?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  color?: Prisma.StringFieldUpdateOperationsInput | string
  is_ai_suggested?: Prisma.BoolFieldUpdateOperationsInput | boolean
  reminder_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null
  is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type LearningEventListRelationFilter = {
  every?: Prisma.LearningEventWhereInput
  some?: Prisma.LearningEventWhereInput
  none?: Prisma.LearningEventWhereInput
}

export type LearningEventOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type LearningEventOrderByRelevanceInput = {
  fields: Prisma.LearningEventOrderByRelevanceFieldEnum | Prisma.LearningEventOrderByRelevanceFieldEnum[]
  sort: Prisma.SortOrder
  search: string
}

export type LearningEventCountOrderByAggregateInput = {
  event_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  status?: Prisma.SortOrder
  start_utc?: Prisma.SortOrder
  end_utc?: Prisma.SortOrder
  all_day?: Prisma.SortOrder
  timezone?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  color?: Prisma.SortOrder
  is_ai_suggested?: Prisma.SortOrder
  reminder_minutes?: Prisma.SortOrder
  is_deleted?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type LearningEventAvgOrderByAggregateInput = {
  reminder_minutes?: Prisma.SortOrder
}

export type LearningEventMaxOrderByAggregateInput = {
  event_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  status?: Prisma.SortOrder
  start_utc?: Prisma.SortOrder
  end_utc?: Prisma.SortOrder
  all_day?: Prisma.SortOrder
  timezone?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  color?: Prisma.SortOrder
  is_ai_suggested?: Prisma.SortOrder
  reminder_minutes?: Prisma.SortOrder
  is_deleted?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type LearningEventMinOrderByAggregateInput = {
  event_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  status?: Prisma.SortOrder
  start_utc?: Prisma.SortOrder
  end_utc?: Prisma.SortOrder
  all_day?: Prisma.SortOrder
  timezone?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  color?: Prisma.SortOrder
  is_ai_suggested?: Prisma.SortOrder
  reminder_minutes?: Prisma.SortOrder
  is_deleted?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type LearningEventSumOrderByAggregateInput = {
  reminder_minutes?: Prisma.SortOrder
}

export type LearningEventCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.LearningEventCreateWithoutUserInput, Prisma.LearningEventUncheckedCreateWithoutUserInput> | Prisma.LearningEventCreateWithoutUserInput[] | Prisma.LearningEventUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.LearningEventCreateOrConnectWithoutUserInput | Prisma.LearningEventCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.LearningEventCreateManyUserInputEnvelope
  connect?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
}

export type LearningEventUncheckedCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.LearningEventCreateWithoutUserInput, Prisma.LearningEventUncheckedCreateWithoutUserInput> | Prisma.LearningEventCreateWithoutUserInput[] | Prisma.LearningEventUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.LearningEventCreateOrConnectWithoutUserInput | Prisma.LearningEventCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.LearningEventCreateManyUserInputEnvelope
  connect?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
}

export type LearningEventUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.LearningEventCreateWithoutUserInput, Prisma.LearningEventUncheckedCreateWithoutUserInput> | Prisma.LearningEventCreateWithoutUserInput[] | Prisma.LearningEventUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.LearningEventCreateOrConnectWithoutUserInput | Prisma.LearningEventCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.LearningEventUpsertWithWhereUniqueWithoutUserInput | Prisma.LearningEventUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.LearningEventCreateManyUserInputEnvelope
  set?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  disconnect?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  delete?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  connect?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  update?: Prisma.LearningEventUpdateWithWhereUniqueWithoutUserInput | Prisma.LearningEventUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.LearningEventUpdateManyWithWhereWithoutUserInput | Prisma.LearningEventUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.LearningEventScalarWhereInput | Prisma.LearningEventScalarWhereInput[]
}

export type LearningEventUncheckedUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.LearningEventCreateWithoutUserInput, Prisma.LearningEventUncheckedCreateWithoutUserInput> | Prisma.LearningEventCreateWithoutUserInput[] | Prisma.LearningEventUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.LearningEventCreateOrConnectWithoutUserInput | Prisma.LearningEventCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.LearningEventUpsertWithWhereUniqueWithoutUserInput | Prisma.LearningEventUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.LearningEventCreateManyUserInputEnvelope
  set?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  disconnect?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  delete?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  connect?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  update?: Prisma.LearningEventUpdateWithWhereUniqueWithoutUserInput | Prisma.LearningEventUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.LearningEventUpdateManyWithWhereWithoutUserInput | Prisma.LearningEventUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.LearningEventScalarWhereInput | Prisma.LearningEventScalarWhereInput[]
}

export type LearningEventCreateNestedManyWithoutModuleInput = {
  create?: Prisma.XOR<Prisma.LearningEventCreateWithoutModuleInput, Prisma.LearningEventUncheckedCreateWithoutModuleInput> | Prisma.LearningEventCreateWithoutModuleInput[] | Prisma.LearningEventUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.LearningEventCreateOrConnectWithoutModuleInput | Prisma.LearningEventCreateOrConnectWithoutModuleInput[]
  createMany?: Prisma.LearningEventCreateManyModuleInputEnvelope
  connect?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
}

export type LearningEventUncheckedCreateNestedManyWithoutModuleInput = {
  create?: Prisma.XOR<Prisma.LearningEventCreateWithoutModuleInput, Prisma.LearningEventUncheckedCreateWithoutModuleInput> | Prisma.LearningEventCreateWithoutModuleInput[] | Prisma.LearningEventUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.LearningEventCreateOrConnectWithoutModuleInput | Prisma.LearningEventCreateOrConnectWithoutModuleInput[]
  createMany?: Prisma.LearningEventCreateManyModuleInputEnvelope
  connect?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
}

export type LearningEventUpdateManyWithoutModuleNestedInput = {
  create?: Prisma.XOR<Prisma.LearningEventCreateWithoutModuleInput, Prisma.LearningEventUncheckedCreateWithoutModuleInput> | Prisma.LearningEventCreateWithoutModuleInput[] | Prisma.LearningEventUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.LearningEventCreateOrConnectWithoutModuleInput | Prisma.LearningEventCreateOrConnectWithoutModuleInput[]
  upsert?: Prisma.LearningEventUpsertWithWhereUniqueWithoutModuleInput | Prisma.LearningEventUpsertWithWhereUniqueWithoutModuleInput[]
  createMany?: Prisma.LearningEventCreateManyModuleInputEnvelope
  set?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  disconnect?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  delete?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  connect?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  update?: Prisma.LearningEventUpdateWithWhereUniqueWithoutModuleInput | Prisma.LearningEventUpdateWithWhereUniqueWithoutModuleInput[]
  updateMany?: Prisma.LearningEventUpdateManyWithWhereWithoutModuleInput | Prisma.LearningEventUpdateManyWithWhereWithoutModuleInput[]
  deleteMany?: Prisma.LearningEventScalarWhereInput | Prisma.LearningEventScalarWhereInput[]
}

export type LearningEventUncheckedUpdateManyWithoutModuleNestedInput = {
  create?: Prisma.XOR<Prisma.LearningEventCreateWithoutModuleInput, Prisma.LearningEventUncheckedCreateWithoutModuleInput> | Prisma.LearningEventCreateWithoutModuleInput[] | Prisma.LearningEventUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.LearningEventCreateOrConnectWithoutModuleInput | Prisma.LearningEventCreateOrConnectWithoutModuleInput[]
  upsert?: Prisma.LearningEventUpsertWithWhereUniqueWithoutModuleInput | Prisma.LearningEventUpsertWithWhereUniqueWithoutModuleInput[]
  createMany?: Prisma.LearningEventCreateManyModuleInputEnvelope
  set?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  disconnect?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  delete?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  connect?: Prisma.LearningEventWhereUniqueInput | Prisma.LearningEventWhereUniqueInput[]
  update?: Prisma.LearningEventUpdateWithWhereUniqueWithoutModuleInput | Prisma.LearningEventUpdateWithWhereUniqueWithoutModuleInput[]
  updateMany?: Prisma.LearningEventUpdateManyWithWhereWithoutModuleInput | Prisma.LearningEventUpdateManyWithWhereWithoutModuleInput[]
  deleteMany?: Prisma.LearningEventScalarWhereInput | Prisma.LearningEventScalarWhereInput[]
}

export type EnumEventStatusFieldUpdateOperationsInput = {
  set?: $Enums.EventStatus
}

export type BoolFieldUpdateOperationsInput = {
  set?: boolean
}

export type NullableIntFieldUpdateOperationsInput = {
  set?: number | null
  increment?: number
  decrement?: number
  multiply?: number
  divide?: number
}

export type LearningEventCreateWithoutUserInput = {
  event_id?: string
  title?: string
  description?: string | null
  status?: $Enums.EventStatus
  start_utc: Date | string
  end_utc: Date | string
  all_day?: boolean
  timezone?: string
  color?: string
  is_ai_suggested?: boolean
  reminder_minutes?: number | null
  is_deleted?: boolean
  created_at?: Date | string
  updated_at?: Date | string
  module?: Prisma.ModuleCreateNestedOneWithoutLearningEventsInput
}

export type LearningEventUncheckedCreateWithoutUserInput = {
  event_id?: string
  title?: string
  description?: string | null
  status?: $Enums.EventStatus
  start_utc: Date | string
  end_utc: Date | string
  all_day?: boolean
  timezone?: string
  module_id?: string | null
  color?: string
  is_ai_suggested?: boolean
  reminder_minutes?: number | null
  is_deleted?: boolean
  created_at?: Date | string
  updated_at?: Date | string
}

export type LearningEventCreateOrConnectWithoutUserInput = {
  where: Prisma.LearningEventWhereUniqueInput
  create: Prisma.XOR<Prisma.LearningEventCreateWithoutUserInput, Prisma.LearningEventUncheckedCreateWithoutUserInput>
}

export type LearningEventCreateManyUserInputEnvelope = {
  data: Prisma.LearningEventCreateManyUserInput | Prisma.LearningEventCreateManyUserInput[]
  skipDuplicates?: boolean
}

export type LearningEventUpsertWithWhereUniqueWithoutUserInput = {
  where: Prisma.LearningEventWhereUniqueInput
  update: Prisma.XOR<Prisma.LearningEventUpdateWithoutUserInput, Prisma.LearningEventUncheckedUpdateWithoutUserInput>
  create: Prisma.XOR<Prisma.LearningEventCreateWithoutUserInput, Prisma.LearningEventUncheckedCreateWithoutUserInput>
}

export type LearningEventUpdateWithWhereUniqueWithoutUserInput = {
  where: Prisma.LearningEventWhereUniqueInput
  data: Prisma.XOR<Prisma.LearningEventUpdateWithoutUserInput, Prisma.LearningEventUncheckedUpdateWithoutUserInput>
}

export type LearningEventUpdateManyWithWhereWithoutUserInput = {
  where: Prisma.LearningEventScalarWhereInput
  data: Prisma.XOR<Prisma.LearningEventUpdateManyMutationInput, Prisma.LearningEventUncheckedUpdateManyWithoutUserInput>
}

export type LearningEventScalarWhereInput = {
  AND?: Prisma.LearningEventScalarWhereInput | Prisma.LearningEventScalarWhereInput[]
  OR?: Prisma.LearningEventScalarWhereInput[]
  NOT?: Prisma.LearningEventScalarWhereInput | Prisma.LearningEventScalarWhereInput[]
  event_id?: Prisma.StringFilter<"LearningEvent"> | string
  user_id?: Prisma.StringFilter<"LearningEvent"> | string
  title?: Prisma.StringFilter<"LearningEvent"> | string
  description?: Prisma.StringNullableFilter<"LearningEvent"> | string | null
  status?: Prisma.EnumEventStatusFilter<"LearningEvent"> | $Enums.EventStatus
  start_utc?: Prisma.DateTimeFilter<"LearningEvent"> | Date | string
  end_utc?: Prisma.DateTimeFilter<"LearningEvent"> | Date | string
  all_day?: Prisma.BoolFilter<"LearningEvent"> | boolean
  timezone?: Prisma.StringFilter<"LearningEvent"> | string
  module_id?: Prisma.StringNullableFilter<"LearningEvent"> | string | null
  color?: Prisma.StringFilter<"LearningEvent"> | string
  is_ai_suggested?: Prisma.BoolFilter<"LearningEvent"> | boolean
  reminder_minutes?: Prisma.IntNullableFilter<"LearningEvent"> | number | null
  is_deleted?: Prisma.BoolFilter<"LearningEvent"> | boolean
  created_at?: Prisma.DateTimeFilter<"LearningEvent"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"LearningEvent"> | Date | string
}

export type LearningEventCreateWithoutModuleInput = {
  event_id?: string
  title?: string
  description?: string | null
  status?: $Enums.EventStatus
  start_utc: Date | string
  end_utc: Date | string
  all_day?: boolean
  timezone?: string
  color?: string
  is_ai_suggested?: boolean
  reminder_minutes?: number | null
  is_deleted?: boolean
  created_at?: Date | string
  updated_at?: Date | string
  user: Prisma.UserCreateNestedOneWithoutLearningEventsInput
}

export type LearningEventUncheckedCreateWithoutModuleInput = {
  event_id?: string
  user_id: string
  title?: string
  description?: string | null
  status?: $Enums.EventStatus
  start_utc: Date | string
  end_utc: Date | string
  all_day?: boolean
  timezone?: string
  color?: string
  is_ai_suggested?: boolean
  reminder_minutes?: number | null
  is_deleted?: boolean
  created_at?: Date | string
  updated_at?: Date | string
}

export type LearningEventCreateOrConnectWithoutModuleInput = {
  where: Prisma.LearningEventWhereUniqueInput
  create: Prisma.XOR<Prisma.LearningEventCreateWithoutModuleInput, Prisma.LearningEventUncheckedCreateWithoutModuleInput>
}

export type LearningEventCreateManyModuleInputEnvelope = {
  data: Prisma.LearningEventCreateManyModuleInput | Prisma.LearningEventCreateManyModuleInput[]
  skipDuplicates?: boolean
}

export type LearningEventUpsertWithWhereUniqueWithoutModuleInput = {
  where: Prisma.LearningEventWhereUniqueInput
  update: Prisma.XOR<Prisma.LearningEventUpdateWithoutModuleInput, Prisma.LearningEventUncheckedUpdateWithoutModuleInput>
  create: Prisma.XOR<Prisma.LearningEventCreateWithoutModuleInput, Prisma.LearningEventUncheckedCreateWithoutModuleInput>
}

export type LearningEventUpdateWithWhereUniqueWithoutModuleInput = {
  where: Prisma.LearningEventWhereUniqueInput
  data: Prisma.XOR<Prisma.LearningEventUpdateWithoutModuleInput, Prisma.LearningEventUncheckedUpdateWithoutModuleInput>
}

export type LearningEventUpdateManyWithWhereWithoutModuleInput = {
  where: Prisma.LearningEventScalarWhereInput
  data: Prisma.XOR<Prisma.LearningEventUpdateManyMutationInput, Prisma.LearningEventUncheckedUpdateManyWithoutModuleInput>
}

export type LearningEventCreateManyUserInput = {
  event_id?: string
  title?: string
  description?: string | null
  status?: $Enums.EventStatus
  start_utc: Date | string
  end_utc: Date | string
  all_day?: boolean
  timezone?: string
  module_id?: string | null
  color?: string
  is_ai_suggested?: boolean
  reminder_minutes?: number | null
  is_deleted?: boolean
  created_at?: Date | string
  updated_at?: Date | string
}

export type LearningEventUpdateWithoutUserInput = {
  event_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
  start_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  end_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  all_day?: Prisma.BoolFieldUpdateOperationsInput | boolean
  timezone?: Prisma.StringFieldUpdateOperationsInput | string
  color?: Prisma.StringFieldUpdateOperationsInput | string
  is_ai_suggested?: Prisma.BoolFieldUpdateOperationsInput | boolean
  reminder_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null
  is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  module?: Prisma.ModuleUpdateOneWithoutLearningEventsNestedInput
}

export type LearningEventUncheckedUpdateWithoutUserInput = {
  event_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
  start_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  end_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  all_day?: Prisma.BoolFieldUpdateOperationsInput | boolean
  timezone?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  color?: Prisma.StringFieldUpdateOperationsInput | string
  is_ai_suggested?: Prisma.BoolFieldUpdateOperationsInput | boolean
  reminder_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null
  is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type LearningEventUncheckedUpdateManyWithoutUserInput = {
  event_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
  start_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  end_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  all_day?: Prisma.BoolFieldUpdateOperationsInput | boolean
  timezone?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  color?: Prisma.StringFieldUpdateOperationsInput | string
  is_ai_suggested?: Prisma.BoolFieldUpdateOperationsInput | boolean
  reminder_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null
  is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type LearningEventCreateManyModuleInput = {
  event_id?: string
  user_id: string
  title?: string
  description?: string | null
  status?: $Enums.EventStatus
  start_utc: Date | string
  end_utc: Date | string
  all_day?: boolean
  timezone?: string
  color?: string
  is_ai_suggested?: boolean
  reminder_minutes?: number | null
  is_deleted?: boolean
  created_at?: Date | string
  updated_at?: Date | string
}

export type LearningEventUpdateWithoutModuleInput = {
  event_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
  start_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  end_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  all_day?: Prisma.BoolFieldUpdateOperationsInput | boolean
  timezone?: Prisma.StringFieldUpdateOperationsInput | string
  color?: Prisma.StringFieldUpdateOperationsInput | string
  is_ai_suggested?: Prisma.BoolFieldUpdateOperationsInput | boolean
  reminder_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null
  is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  user?: Prisma.UserUpdateOneRequiredWithoutLearningEventsNestedInput
}

export type LearningEventUncheckedUpdateWithoutModuleInput = {
  event_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
  start_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  end_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  all_day?: Prisma.BoolFieldUpdateOperationsInput | boolean
  timezone?: Prisma.StringFieldUpdateOperationsInput | string
  color?: Prisma.StringFieldUpdateOperationsInput | string
  is_ai_suggested?: Prisma.BoolFieldUpdateOperationsInput | boolean
  reminder_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null
  is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type LearningEventUncheckedUpdateManyWithoutModuleInput = {
  event_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus
  start_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  end_utc?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  all_day?: Prisma.BoolFieldUpdateOperationsInput | boolean
  timezone?: Prisma.StringFieldUpdateOperationsInput | string
  color?: Prisma.StringFieldUpdateOperationsInput | string
  is_ai_suggested?: Prisma.BoolFieldUpdateOperationsInput | boolean
  reminder_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null
  is_deleted?: Prisma.BoolFieldUpdateOperationsInput | boolean
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}



export type LearningEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  event_id?: boolean
  user_id?: boolean
  title?: boolean
  description?: boolean
  status?: boolean
  start_utc?: boolean
  end_utc?: boolean
  all_day?: boolean
  timezone?: boolean
  module_id?: boolean
  color?: boolean
  is_ai_suggested?: boolean
  reminder_minutes?: boolean
  is_deleted?: boolean
  created_at?: boolean
  updated_at?: boolean
  module?: boolean | Prisma.LearningEvent$moduleArgs<ExtArgs>
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}, ExtArgs["result"]["learningEvent"]>



export type LearningEventSelectScalar = {
  event_id?: boolean
  user_id?: boolean
  title?: boolean
  description?: boolean
  status?: boolean
  start_utc?: boolean
  end_utc?: boolean
  all_day?: boolean
  timezone?: boolean
  module_id?: boolean
  color?: boolean
  is_ai_suggested?: boolean
  reminder_minutes?: boolean
  is_deleted?: boolean
  created_at?: boolean
  updated_at?: boolean
}

export type LearningEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"event_id" | "user_id" | "title" | "description" | "status" | "start_utc" | "end_utc" | "all_day" | "timezone" | "module_id" | "color" | "is_ai_suggested" | "reminder_minutes" | "is_deleted" | "created_at" | "updated_at", ExtArgs["result"]["learningEvent"]>
export type LearningEventInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  module?: boolean | Prisma.LearningEvent$moduleArgs<ExtArgs>
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}

export type $LearningEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "LearningEvent"
  objects: {
    module: Prisma.$ModulePayload<ExtArgs> | null
    user: Prisma.$UserPayload<ExtArgs>
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    event_id: string
    user_id: string
    title: string
    description: string | null
    status: $Enums.EventStatus
    start_utc: Date
    end_utc: Date
    all_day: boolean
    timezone: string
    module_id: string | null
    color: string
    is_ai_suggested: boolean
    reminder_minutes: number | null
    is_deleted: boolean
    created_at: Date
    updated_at: Date
  }, ExtArgs["result"]["learningEvent"]>
  composites: {}
}

export type LearningEventGetPayload<S extends boolean | null | undefined | LearningEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LearningEventPayload, S>

export type LearningEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<LearningEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LearningEventCountAggregateInputType | true
  }

export interface LearningEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LearningEvent'], meta: { name: 'LearningEvent' } }
  /**
   * Find zero or one LearningEvent that matches the filter.
   * @param {LearningEventFindUniqueArgs} args - Arguments to find a LearningEvent
   * @example
   * // Get one LearningEvent
   * const learningEvent = await prisma.learningEvent.findUnique({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUnique<T extends LearningEventFindUniqueArgs>(args: Prisma.SelectSubset<T, LearningEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LearningEventClient<runtime.Types.Result.GetResult<Prisma.$LearningEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find one LearningEvent that matches the filter or throw an error with `error.code='P2025'`
   * if no matches were found.
   * @param {LearningEventFindUniqueOrThrowArgs} args - Arguments to find a LearningEvent
   * @example
   * // Get one LearningEvent
   * const learningEvent = await prisma.learningEvent.findUniqueOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUniqueOrThrow<T extends LearningEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LearningEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LearningEventClient<runtime.Types.Result.GetResult<Prisma.$LearningEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first LearningEvent that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {LearningEventFindFirstArgs} args - Arguments to find a LearningEvent
   * @example
   * // Get one LearningEvent
   * const learningEvent = await prisma.learningEvent.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends LearningEventFindFirstArgs>(args?: Prisma.SelectSubset<T, LearningEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__LearningEventClient<runtime.Types.Result.GetResult<Prisma.$LearningEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first LearningEvent that matches the filter or
   * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {LearningEventFindFirstOrThrowArgs} args - Arguments to find a LearningEvent
   * @example
   * // Get one LearningEvent
   * const learningEvent = await prisma.learningEvent.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends LearningEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LearningEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LearningEventClient<runtime.Types.Result.GetResult<Prisma.$LearningEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find zero or more LearningEvents that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {LearningEventFindManyArgs} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all LearningEvents
   * const learningEvents = await prisma.learningEvent.findMany()
   * 
   * // Get first 10 LearningEvents
   * const learningEvents = await prisma.learningEvent.findMany({ take: 10 })
   * 
   * // Only select the `event_id`
   * const learningEventWithEvent_idOnly = await prisma.learningEvent.findMany({ select: { event_id: true } })
   * 
   */
  findMany<T extends LearningEventFindManyArgs>(args?: Prisma.SelectSubset<T, LearningEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LearningEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  /**
   * Create a LearningEvent.
   * @param {LearningEventCreateArgs} args - Arguments to create a LearningEvent.
   * @example
   * // Create one LearningEvent
   * const LearningEvent = await prisma.learningEvent.create({
   *   data: {
   *     // ... data to create a LearningEvent
   *   }
   * })
   * 
   */
  create<T extends LearningEventCreateArgs>(args: Prisma.SelectSubset<T, LearningEventCreateArgs<ExtArgs>>): Prisma.Prisma__LearningEventClient<runtime.Types.Result.GetResult<Prisma.$LearningEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Create many LearningEvents.
   * @param {LearningEventCreateManyArgs} args - Arguments to create many LearningEvents.
   * @example
   * // Create many LearningEvents
   * const learningEvent = await prisma.learningEvent.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   *     
   */
  createMany<T extends LearningEventCreateManyArgs>(args?: Prisma.SelectSubset<T, LearningEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Delete a LearningEvent.
   * @param {LearningEventDeleteArgs} args - Arguments to delete one LearningEvent.
   * @example
   * // Delete one LearningEvent
   * const LearningEvent = await prisma.learningEvent.delete({
   *   where: {
   *     // ... filter to delete one LearningEvent
   *   }
   * })
   * 
   */
  delete<T extends LearningEventDeleteArgs>(args: Prisma.SelectSubset<T, LearningEventDeleteArgs<ExtArgs>>): Prisma.Prisma__LearningEventClient<runtime.Types.Result.GetResult<Prisma.$LearningEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Update one LearningEvent.
   * @param {LearningEventUpdateArgs} args - Arguments to update one LearningEvent.
   * @example
   * // Update one LearningEvent
   * const learningEvent = await prisma.learningEvent.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends LearningEventUpdateArgs>(args: Prisma.SelectSubset<T, LearningEventUpdateArgs<ExtArgs>>): Prisma.Prisma__LearningEventClient<runtime.Types.Result.GetResult<Prisma.$LearningEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Delete zero or more LearningEvents.
   * @param {LearningEventDeleteManyArgs} args - Arguments to filter LearningEvents to delete.
   * @example
   * // Delete a few LearningEvents
   * const { count } = await prisma.learningEvent.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany<T extends LearningEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, LearningEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Update zero or more LearningEvents.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {LearningEventUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many LearningEvents
   * const learningEvent = await prisma.learningEvent.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany<T extends LearningEventUpdateManyArgs>(args: Prisma.SelectSubset<T, LearningEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Create or update one LearningEvent.
   * @param {LearningEventUpsertArgs} args - Arguments to update or create a LearningEvent.
   * @example
   * // Update or create a LearningEvent
   * const learningEvent = await prisma.learningEvent.upsert({
   *   create: {
   *     // ... data to create a LearningEvent
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the LearningEvent we want to update
   *   }
   * })
   */
  upsert<T extends LearningEventUpsertArgs>(args: Prisma.SelectSubset<T, LearningEventUpsertArgs<ExtArgs>>): Prisma.Prisma__LearningEventClient<runtime.Types.Result.GetResult<Prisma.$LearningEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


  /**
   * Count the number of LearningEvents.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {LearningEventCountArgs} args - Arguments to filter LearningEvents to count.
   * @example
   * // Count the number of LearningEvents
   * const count = await prisma.learningEvent.count({
   *   where: {
   *     // ... the filter for the LearningEvents we want to count
   *   }
   * })
  **/
  count<T extends LearningEventCountArgs>(
    args?: Prisma.Subset<T, LearningEventCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], LearningEventCountAggregateOutputType>
      : number
  >

  /**
   * Allows you to perform aggregations operations on a LearningEvent.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {LearningEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Ordered by age ascending
   * // Where email contains prisma.io
   * // Limited to the 10 users
   * const aggregations = await prisma.user.aggregate({
   *   _avg: {
   *     age: true,
   *   },
   *   where: {
   *     email: {
   *       contains: "prisma.io",
   *     },
   *   },
   *   orderBy: {
   *     age: "asc",
   *   },
   *   take: 10,
   * })
  **/
  aggregate<T extends LearningEventAggregateArgs>(args: Prisma.Subset<T, LearningEventAggregateArgs>): Prisma.PrismaPromise<GetLearningEventAggregateType<T>>

  /**
   * Group by LearningEvent.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {LearningEventGroupByArgs} args - Group by arguments.
   * @example
   * // Group by city, order by createdAt, get count
   * const result = await prisma.user.groupBy({
   *   by: ['city', 'createdAt'],
   *   orderBy: {
   *     createdAt: true
   *   },
   *   _count: {
   *     _all: true
   *   },
   * })
   * 
  **/
  groupBy<
    T extends LearningEventGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: LearningEventGroupByArgs['orderBy'] }
      : { orderBy?: LearningEventGroupByArgs['orderBy'] },
    OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>,
    ByFields extends Prisma.MaybeTupleToUnion<T['by']>,
    ByValid extends Prisma.Has<ByFields, OrderFields>,
    HavingFields extends Prisma.GetHavingFields<T['having']>,
    HavingValid extends Prisma.Has<ByFields, HavingFields>,
    ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False,
    InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
          ? never
          : P extends string
          ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
          : [
              Error,
              'Field ',
              P,
              ` in "having" needs to be provided in "by"`,
            ]
      }[HavingFields]
    : 'take' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
          ? never
          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
      }[OrderFields]
  >(args: Prisma.SubsetIntersection<T, LearningEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLearningEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
/**
 * Fields of the LearningEvent model
 */
readonly fields: LearningEventFieldRefs;
}

/**
 * The delegate class that acts as a "Promise-like" for LearningEvent.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__LearningEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  module<T extends Prisma.LearningEvent$moduleArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LearningEvent$moduleArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
  user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}




/**
 * Fields of the LearningEvent model
 */
export interface LearningEventFieldRefs {
  readonly event_id: Prisma.FieldRef<"LearningEvent", 'String'>
  readonly user_id: Prisma.FieldRef<"LearningEvent", 'String'>
  readonly title: Prisma.FieldRef<"LearningEvent", 'String'>
  readonly description: Prisma.FieldRef<"LearningEvent", 'String'>
  readonly status: Prisma.FieldRef<"LearningEvent", 'EventStatus'>
  readonly start_utc: Prisma.FieldRef<"LearningEvent", 'DateTime'>
  readonly end_utc: Prisma.FieldRef<"LearningEvent", 'DateTime'>
  readonly all_day: Prisma.FieldRef<"LearningEvent", 'Boolean'>
  readonly timezone: Prisma.FieldRef<"LearningEvent", 'String'>
  readonly module_id: Prisma.FieldRef<"LearningEvent", 'String'>
  readonly color: Prisma.FieldRef<"LearningEvent", 'String'>
  readonly is_ai_suggested: Prisma.FieldRef<"LearningEvent", 'Boolean'>
  readonly reminder_minutes: Prisma.FieldRef<"LearningEvent", 'Int'>
  readonly is_deleted: Prisma.FieldRef<"LearningEvent", 'Boolean'>
  readonly created_at: Prisma.FieldRef<"LearningEvent", 'DateTime'>
  readonly updated_at: Prisma.FieldRef<"LearningEvent", 'DateTime'>
}
    

// Custom InputTypes
/**
 * LearningEvent findUnique
 */
export type LearningEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the LearningEvent
   */
  select?: Prisma.LearningEventSelect<ExtArgs> | null
  /**
   * Omit specific fields from the LearningEvent
   */
  omit?: Prisma.LearningEventOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.LearningEventInclude<ExtArgs> | null
  /**
   * Filter, which LearningEvent to fetch.
   */
  where: Prisma.LearningEventWhereUniqueInput
}

/**
 * LearningEvent findUniqueOrThrow
 */
export type LearningEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the LearningEvent
   */
  select?: Prisma.LearningEventSelect<ExtArgs> | null
  /**
   * Omit specific fields from the LearningEvent
   */
  omit?: Prisma.LearningEventOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.LearningEventInclude<ExtArgs> | null
  /**
   * Filter, which LearningEvent to fetch.
   */
  where: Prisma.LearningEventWhereUniqueInput
}

/**
 * LearningEvent findFirst
 */
export type LearningEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the LearningEvent
   */
  select?: Prisma.LearningEventSelect<ExtArgs> | null
  /**
   * Omit specific fields from the LearningEvent
   */
  omit?: Prisma.LearningEventOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.LearningEventInclude<ExtArgs> | null
  /**
   * Filter, which LearningEvent to fetch.
   */
  where?: Prisma.LearningEventWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of LearningEvents to fetch.
   */
  orderBy?: Prisma.LearningEventOrderByWithRelationInput | Prisma.LearningEventOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for LearningEvents.
   */
  cursor?: Prisma.LearningEventWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` LearningEvents from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` LearningEvents.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of LearningEvents.
   */
  distinct?: Prisma.LearningEventScalarFieldEnum | Prisma.LearningEventScalarFieldEnum[]
}

/**
 * LearningEvent findFirstOrThrow
 */
export type LearningEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the LearningEvent
   */
  select?: Prisma.LearningEventSelect<ExtArgs> | null
  /**
   * Omit specific fields from the LearningEvent
   */
  omit?: Prisma.LearningEventOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.LearningEventInclude<ExtArgs> | null
  /**
   * Filter, which LearningEvent to fetch.
   */
  where?: Prisma.LearningEventWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of LearningEvents to fetch.
   */
  orderBy?: Prisma.LearningEventOrderByWithRelationInput | Prisma.LearningEventOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for LearningEvents.
   */
  cursor?: Prisma.LearningEventWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` LearningEvents from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` LearningEvents.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of LearningEvents.
   */
  distinct?: Prisma.LearningEventScalarFieldEnum | Prisma.LearningEventScalarFieldEnum[]
}

/**
 * LearningEvent findMany
 */
export type LearningEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the LearningEvent
   */
  select?: Prisma.LearningEventSelect<ExtArgs> | null
  /**
   * Omit specific fields from the LearningEvent
   */
  omit?: Prisma.LearningEventOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.LearningEventInclude<ExtArgs> | null
  /**
   * Filter, which LearningEvents to fetch.
   */
  where?: Prisma.LearningEventWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of LearningEvents to fetch.
   */
  orderBy?: Prisma.LearningEventOrderByWithRelationInput | Prisma.LearningEventOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for listing LearningEvents.
   */
  cursor?: Prisma.LearningEventWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` LearningEvents from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` LearningEvents.
   */
  skip?: number
  distinct?: Prisma.LearningEventScalarFieldEnum | Prisma.LearningEventScalarFieldEnum[]
}

/**
 * LearningEvent create
 */
export type LearningEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the LearningEvent
   */
  select?: Prisma.LearningEventSelect<ExtArgs> | null
  /**
   * Omit specific fields from the LearningEvent
   */
  omit?: Prisma.LearningEventOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.LearningEventInclude<ExtArgs> | null
  /**
   * The data needed to create a LearningEvent.
   */
  data: Prisma.XOR<Prisma.LearningEventCreateInput, Prisma.LearningEventUncheckedCreateInput>
}

/**
 * LearningEvent createMany
 */
export type LearningEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to create many LearningEvents.
   */
  data: Prisma.LearningEventCreateManyInput | Prisma.LearningEventCreateManyInput[]
  skipDuplicates?: boolean
}

/**
 * LearningEvent update
 */
export type LearningEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the LearningEvent
   */
  select?: Prisma.LearningEventSelect<ExtArgs> | null
  /**
   * Omit specific fields from the LearningEvent
   */
  omit?: Prisma.LearningEventOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.LearningEventInclude<ExtArgs> | null
  /**
   * The data needed to update a LearningEvent.
   */
  data: Prisma.XOR<Prisma.LearningEventUpdateInput, Prisma.LearningEventUncheckedUpdateInput>
  /**
   * Choose, which LearningEvent to update.
   */
  where: Prisma.LearningEventWhereUniqueInput
}

/**
 * LearningEvent updateMany
 */
export type LearningEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to update LearningEvents.
   */
  data: Prisma.XOR<Prisma.LearningEventUpdateManyMutationInput, Prisma.LearningEventUncheckedUpdateManyInput>
  /**
   * Filter which LearningEvents to update
   */
  where?: Prisma.LearningEventWhereInput
  /**
   * Limit how many LearningEvents to update.
   */
  limit?: number
}

/**
 * LearningEvent upsert
 */
export type LearningEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the LearningEvent
   */
  select?: Prisma.LearningEventSelect<ExtArgs> | null
  /**
   * Omit specific fields from the LearningEvent
   */
  omit?: Prisma.LearningEventOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.LearningEventInclude<ExtArgs> | null
  /**
   * The filter to search for the LearningEvent to update in case it exists.
   */
  where: Prisma.LearningEventWhereUniqueInput
  /**
   * In case the LearningEvent found by the `where` argument doesn't exist, create a new LearningEvent with this data.
   */
  create: Prisma.XOR<Prisma.LearningEventCreateInput, Prisma.LearningEventUncheckedCreateInput>
  /**
   * In case the LearningEvent was found with the provided `where` argument, update it with this data.
   */
  update: Prisma.XOR<Prisma.LearningEventUpdateInput, Prisma.LearningEventUncheckedUpdateInput>
}

/**
 * LearningEvent delete
 */
export type LearningEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the LearningEvent
   */
  select?: Prisma.LearningEventSelect<ExtArgs> | null
  /**
   * Omit specific fields from the LearningEvent
   */
  omit?: Prisma.LearningEventOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.LearningEventInclude<ExtArgs> | null
  /**
   * Filter which LearningEvent to delete.
   */
  where: Prisma.LearningEventWhereUniqueInput
}

/**
 * LearningEvent deleteMany
 */
export type LearningEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which LearningEvents to delete
   */
  where?: Prisma.LearningEventWhereInput
  /**
   * Limit how many LearningEvents to delete.
   */
  limit?: number
}

/**
 * LearningEvent.module
 */
export type LearningEvent$moduleArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Module
   */
  select?: Prisma.ModuleSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Module
   */
  omit?: Prisma.ModuleOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ModuleInclude<ExtArgs> | null
  where?: Prisma.ModuleWhereInput
}

/**
 * LearningEvent without action
 */
export type LearningEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the LearningEvent
   */
  select?: Prisma.LearningEventSelect<ExtArgs> | null
  /**
   * Omit specific fields from the LearningEvent
   */
  omit?: Prisma.LearningEventOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.LearningEventInclude<ExtArgs> | null
}

```

## File: src/generated/prisma/models/Module.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file exports the `Module` model and its related types.
 *
 * 🟢 You can import this file directly.
 */
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"

/**
 * Model Module
 * 
 */
export type ModuleModel = runtime.Types.Result.DefaultSelection<Prisma.$ModulePayload>

export type AggregateModule = {
  _count: ModuleCountAggregateOutputType | null
  _avg: ModuleAvgAggregateOutputType | null
  _sum: ModuleSumAggregateOutputType | null
  _min: ModuleMinAggregateOutputType | null
  _max: ModuleMaxAggregateOutputType | null
}

export type ModuleAvgAggregateOutputType = {
  order_index: number | null
  estimated_hours: runtime.Decimal | null
}

export type ModuleSumAggregateOutputType = {
  order_index: number | null
  estimated_hours: runtime.Decimal | null
}

export type ModuleMinAggregateOutputType = {
  module_id: string | null
  roadmap_id: string | null
  title: string | null
  description: string | null
  content: string | null
  order_index: number | null
  estimated_hours: runtime.Decimal | null
  created_at: Date | null
  updated_at: Date | null
}

export type ModuleMaxAggregateOutputType = {
  module_id: string | null
  roadmap_id: string | null
  title: string | null
  description: string | null
  content: string | null
  order_index: number | null
  estimated_hours: runtime.Decimal | null
  created_at: Date | null
  updated_at: Date | null
}

export type ModuleCountAggregateOutputType = {
  module_id: number
  roadmap_id: number
  title: number
  description: number
  content: number
  order_index: number
  estimated_hours: number
  created_at: number
  updated_at: number
  _all: number
}


export type ModuleAvgAggregateInputType = {
  order_index?: true
  estimated_hours?: true
}

export type ModuleSumAggregateInputType = {
  order_index?: true
  estimated_hours?: true
}

export type ModuleMinAggregateInputType = {
  module_id?: true
  roadmap_id?: true
  title?: true
  description?: true
  content?: true
  order_index?: true
  estimated_hours?: true
  created_at?: true
  updated_at?: true
}

export type ModuleMaxAggregateInputType = {
  module_id?: true
  roadmap_id?: true
  title?: true
  description?: true
  content?: true
  order_index?: true
  estimated_hours?: true
  created_at?: true
  updated_at?: true
}

export type ModuleCountAggregateInputType = {
  module_id?: true
  roadmap_id?: true
  title?: true
  description?: true
  content?: true
  order_index?: true
  estimated_hours?: true
  created_at?: true
  updated_at?: true
  _all?: true
}

export type ModuleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which Module to aggregate.
   */
  where?: Prisma.ModuleWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Modules to fetch.
   */
  orderBy?: Prisma.ModuleOrderByWithRelationInput | Prisma.ModuleOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the start position
   */
  cursor?: Prisma.ModuleWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Modules from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Modules.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Count returned Modules
  **/
  _count?: true | ModuleCountAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to average
  **/
  _avg?: ModuleAvgAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to sum
  **/
  _sum?: ModuleSumAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the minimum value
  **/
  _min?: ModuleMinAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the maximum value
  **/
  _max?: ModuleMaxAggregateInputType
}

export type GetModuleAggregateType<T extends ModuleAggregateArgs> = {
      [P in keyof T & keyof AggregateModule]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateModule[P]>
    : Prisma.GetScalarType<T[P], AggregateModule[P]>
}




export type ModuleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.ModuleWhereInput
  orderBy?: Prisma.ModuleOrderByWithAggregationInput | Prisma.ModuleOrderByWithAggregationInput[]
  by: Prisma.ModuleScalarFieldEnum[] | Prisma.ModuleScalarFieldEnum
  having?: Prisma.ModuleScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: ModuleCountAggregateInputType | true
  _avg?: ModuleAvgAggregateInputType
  _sum?: ModuleSumAggregateInputType
  _min?: ModuleMinAggregateInputType
  _max?: ModuleMaxAggregateInputType
}

export type ModuleGroupByOutputType = {
  module_id: string
  roadmap_id: string
  title: string
  description: string | null
  content: string | null
  order_index: number
  estimated_hours: runtime.Decimal | null
  created_at: Date
  updated_at: Date
  _count: ModuleCountAggregateOutputType | null
  _avg: ModuleAvgAggregateOutputType | null
  _sum: ModuleSumAggregateOutputType | null
  _min: ModuleMinAggregateOutputType | null
  _max: ModuleMaxAggregateOutputType | null
}

type GetModuleGroupByPayload<T extends ModuleGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<ModuleGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof ModuleGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], ModuleGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], ModuleGroupByOutputType[P]>
      }
    >
  >



export type ModuleWhereInput = {
  AND?: Prisma.ModuleWhereInput | Prisma.ModuleWhereInput[]
  OR?: Prisma.ModuleWhereInput[]
  NOT?: Prisma.ModuleWhereInput | Prisma.ModuleWhereInput[]
  module_id?: Prisma.StringFilter<"Module"> | string
  roadmap_id?: Prisma.StringFilter<"Module"> | string
  title?: Prisma.StringFilter<"Module"> | string
  description?: Prisma.StringNullableFilter<"Module"> | string | null
  content?: Prisma.StringNullableFilter<"Module"> | string | null
  order_index?: Prisma.IntFilter<"Module"> | number
  estimated_hours?: Prisma.DecimalNullableFilter<"Module"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFilter<"Module"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"Module"> | Date | string
  aiNotes?: Prisma.AINoteListRelationFilter
  exercises?: Prisma.ExerciseListRelationFilter
  learningEvents?: Prisma.LearningEventListRelationFilter
  roadmap?: Prisma.XOR<Prisma.RoadmapScalarRelationFilter, Prisma.RoadmapWhereInput>
  userProgress?: Prisma.UserProgressListRelationFilter
}

export type ModuleOrderByWithRelationInput = {
  module_id?: Prisma.SortOrder
  roadmap_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrderInput | Prisma.SortOrder
  content?: Prisma.SortOrderInput | Prisma.SortOrder
  order_index?: Prisma.SortOrder
  estimated_hours?: Prisma.SortOrderInput | Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
  aiNotes?: Prisma.AINoteOrderByRelationAggregateInput
  exercises?: Prisma.ExerciseOrderByRelationAggregateInput
  learningEvents?: Prisma.LearningEventOrderByRelationAggregateInput
  roadmap?: Prisma.RoadmapOrderByWithRelationInput
  userProgress?: Prisma.UserProgressOrderByRelationAggregateInput
  _relevance?: Prisma.ModuleOrderByRelevanceInput
}

export type ModuleWhereUniqueInput = Prisma.AtLeast<{
  module_id?: string
  roadmap_id_order_index?: Prisma.ModuleRoadmap_idOrder_indexCompoundUniqueInput
  AND?: Prisma.ModuleWhereInput | Prisma.ModuleWhereInput[]
  OR?: Prisma.ModuleWhereInput[]
  NOT?: Prisma.ModuleWhereInput | Prisma.ModuleWhereInput[]
  roadmap_id?: Prisma.StringFilter<"Module"> | string
  title?: Prisma.StringFilter<"Module"> | string
  description?: Prisma.StringNullableFilter<"Module"> | string | null
  content?: Prisma.StringNullableFilter<"Module"> | string | null
  order_index?: Prisma.IntFilter<"Module"> | number
  estimated_hours?: Prisma.DecimalNullableFilter<"Module"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFilter<"Module"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"Module"> | Date | string
  aiNotes?: Prisma.AINoteListRelationFilter
  exercises?: Prisma.ExerciseListRelationFilter
  learningEvents?: Prisma.LearningEventListRelationFilter
  roadmap?: Prisma.XOR<Prisma.RoadmapScalarRelationFilter, Prisma.RoadmapWhereInput>
  userProgress?: Prisma.UserProgressListRelationFilter
}, "module_id" | "roadmap_id_order_index">

export type ModuleOrderByWithAggregationInput = {
  module_id?: Prisma.SortOrder
  roadmap_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrderInput | Prisma.SortOrder
  content?: Prisma.SortOrderInput | Prisma.SortOrder
  order_index?: Prisma.SortOrder
  estimated_hours?: Prisma.SortOrderInput | Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
  _count?: Prisma.ModuleCountOrderByAggregateInput
  _avg?: Prisma.ModuleAvgOrderByAggregateInput
  _max?: Prisma.ModuleMaxOrderByAggregateInput
  _min?: Prisma.ModuleMinOrderByAggregateInput
  _sum?: Prisma.ModuleSumOrderByAggregateInput
}

export type ModuleScalarWhereWithAggregatesInput = {
  AND?: Prisma.ModuleScalarWhereWithAggregatesInput | Prisma.ModuleScalarWhereWithAggregatesInput[]
  OR?: Prisma.ModuleScalarWhereWithAggregatesInput[]
  NOT?: Prisma.ModuleScalarWhereWithAggregatesInput | Prisma.ModuleScalarWhereWithAggregatesInput[]
  module_id?: Prisma.StringWithAggregatesFilter<"Module"> | string
  roadmap_id?: Prisma.StringWithAggregatesFilter<"Module"> | string
  title?: Prisma.StringWithAggregatesFilter<"Module"> | string
  description?: Prisma.StringNullableWithAggregatesFilter<"Module"> | string | null
  content?: Prisma.StringNullableWithAggregatesFilter<"Module"> | string | null
  order_index?: Prisma.IntWithAggregatesFilter<"Module"> | number
  estimated_hours?: Prisma.DecimalNullableWithAggregatesFilter<"Module"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeWithAggregatesFilter<"Module"> | Date | string
  updated_at?: Prisma.DateTimeWithAggregatesFilter<"Module"> | Date | string
}

export type ModuleCreateInput = {
  module_id?: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteCreateNestedManyWithoutModuleInput
  exercises?: Prisma.ExerciseCreateNestedManyWithoutModuleInput
  learningEvents?: Prisma.LearningEventCreateNestedManyWithoutModuleInput
  roadmap: Prisma.RoadmapCreateNestedOneWithoutModulesInput
  userProgress?: Prisma.UserProgressCreateNestedManyWithoutModuleInput
}

export type ModuleUncheckedCreateInput = {
  module_id?: string
  roadmap_id: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteUncheckedCreateNestedManyWithoutModuleInput
  exercises?: Prisma.ExerciseUncheckedCreateNestedManyWithoutModuleInput
  learningEvents?: Prisma.LearningEventUncheckedCreateNestedManyWithoutModuleInput
  userProgress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutModuleInput
}

export type ModuleUpdateInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUpdateManyWithoutModuleNestedInput
  exercises?: Prisma.ExerciseUpdateManyWithoutModuleNestedInput
  learningEvents?: Prisma.LearningEventUpdateManyWithoutModuleNestedInput
  roadmap?: Prisma.RoadmapUpdateOneRequiredWithoutModulesNestedInput
  userProgress?: Prisma.UserProgressUpdateManyWithoutModuleNestedInput
}

export type ModuleUncheckedUpdateInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUncheckedUpdateManyWithoutModuleNestedInput
  exercises?: Prisma.ExerciseUncheckedUpdateManyWithoutModuleNestedInput
  learningEvents?: Prisma.LearningEventUncheckedUpdateManyWithoutModuleNestedInput
  userProgress?: Prisma.UserProgressUncheckedUpdateManyWithoutModuleNestedInput
}

export type ModuleCreateManyInput = {
  module_id?: string
  roadmap_id: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
}

export type ModuleUpdateManyMutationInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type ModuleUncheckedUpdateManyInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type ModuleListRelationFilter = {
  every?: Prisma.ModuleWhereInput
  some?: Prisma.ModuleWhereInput
  none?: Prisma.ModuleWhereInput
}

export type ModuleOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type ModuleOrderByRelevanceInput = {
  fields: Prisma.ModuleOrderByRelevanceFieldEnum | Prisma.ModuleOrderByRelevanceFieldEnum[]
  sort: Prisma.SortOrder
  search: string
}

export type ModuleRoadmap_idOrder_indexCompoundUniqueInput = {
  roadmap_id: string
  order_index: number
}

export type ModuleCountOrderByAggregateInput = {
  module_id?: Prisma.SortOrder
  roadmap_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  content?: Prisma.SortOrder
  order_index?: Prisma.SortOrder
  estimated_hours?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type ModuleAvgOrderByAggregateInput = {
  order_index?: Prisma.SortOrder
  estimated_hours?: Prisma.SortOrder
}

export type ModuleMaxOrderByAggregateInput = {
  module_id?: Prisma.SortOrder
  roadmap_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  content?: Prisma.SortOrder
  order_index?: Prisma.SortOrder
  estimated_hours?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type ModuleMinOrderByAggregateInput = {
  module_id?: Prisma.SortOrder
  roadmap_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  content?: Prisma.SortOrder
  order_index?: Prisma.SortOrder
  estimated_hours?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type ModuleSumOrderByAggregateInput = {
  order_index?: Prisma.SortOrder
  estimated_hours?: Prisma.SortOrder
}

export type ModuleScalarRelationFilter = {
  is?: Prisma.ModuleWhereInput
  isNot?: Prisma.ModuleWhereInput
}

export type ModuleNullableScalarRelationFilter = {
  is?: Prisma.ModuleWhereInput | null
  isNot?: Prisma.ModuleWhereInput | null
}

export type ModuleCreateNestedManyWithoutRoadmapInput = {
  create?: Prisma.XOR<Prisma.ModuleCreateWithoutRoadmapInput, Prisma.ModuleUncheckedCreateWithoutRoadmapInput> | Prisma.ModuleCreateWithoutRoadmapInput[] | Prisma.ModuleUncheckedCreateWithoutRoadmapInput[]
  connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutRoadmapInput | Prisma.ModuleCreateOrConnectWithoutRoadmapInput[]
  createMany?: Prisma.ModuleCreateManyRoadmapInputEnvelope
  connect?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[]
}

export type ModuleUncheckedCreateNestedManyWithoutRoadmapInput = {
  create?: Prisma.XOR<Prisma.ModuleCreateWithoutRoadmapInput, Prisma.ModuleUncheckedCreateWithoutRoadmapInput> | Prisma.ModuleCreateWithoutRoadmapInput[] | Prisma.ModuleUncheckedCreateWithoutRoadmapInput[]
  connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutRoadmapInput | Prisma.ModuleCreateOrConnectWithoutRoadmapInput[]
  createMany?: Prisma.ModuleCreateManyRoadmapInputEnvelope
  connect?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[]
}

export type ModuleUpdateManyWithoutRoadmapNestedInput = {
  create?: Prisma.XOR<Prisma.ModuleCreateWithoutRoadmapInput, Prisma.ModuleUncheckedCreateWithoutRoadmapInput> | Prisma.ModuleCreateWithoutRoadmapInput[] | Prisma.ModuleUncheckedCreateWithoutRoadmapInput[]
  connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutRoadmapInput | Prisma.ModuleCreateOrConnectWithoutRoadmapInput[]
  upsert?: Prisma.ModuleUpsertWithWhereUniqueWithoutRoadmapInput | Prisma.ModuleUpsertWithWhereUniqueWithoutRoadmapInput[]
  createMany?: Prisma.ModuleCreateManyRoadmapInputEnvelope
  set?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[]
  disconnect?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[]
  delete?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[]
  connect?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[]
  update?: Prisma.ModuleUpdateWithWhereUniqueWithoutRoadmapInput | Prisma.ModuleUpdateWithWhereUniqueWithoutRoadmapInput[]
  updateMany?: Prisma.ModuleUpdateManyWithWhereWithoutRoadmapInput | Prisma.ModuleUpdateManyWithWhereWithoutRoadmapInput[]
  deleteMany?: Prisma.ModuleScalarWhereInput | Prisma.ModuleScalarWhereInput[]
}

export type ModuleUncheckedUpdateManyWithoutRoadmapNestedInput = {
  create?: Prisma.XOR<Prisma.ModuleCreateWithoutRoadmapInput, Prisma.ModuleUncheckedCreateWithoutRoadmapInput> | Prisma.ModuleCreateWithoutRoadmapInput[] | Prisma.ModuleUncheckedCreateWithoutRoadmapInput[]
  connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutRoadmapInput | Prisma.ModuleCreateOrConnectWithoutRoadmapInput[]
  upsert?: Prisma.ModuleUpsertWithWhereUniqueWithoutRoadmapInput | Prisma.ModuleUpsertWithWhereUniqueWithoutRoadmapInput[]
  createMany?: Prisma.ModuleCreateManyRoadmapInputEnvelope
  set?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[]
  disconnect?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[]
  delete?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[]
  connect?: Prisma.ModuleWhereUniqueInput | Prisma.ModuleWhereUniqueInput[]
  update?: Prisma.ModuleUpdateWithWhereUniqueWithoutRoadmapInput | Prisma.ModuleUpdateWithWhereUniqueWithoutRoadmapInput[]
  updateMany?: Prisma.ModuleUpdateManyWithWhereWithoutRoadmapInput | Prisma.ModuleUpdateManyWithWhereWithoutRoadmapInput[]
  deleteMany?: Prisma.ModuleScalarWhereInput | Prisma.ModuleScalarWhereInput[]
}

export type IntFieldUpdateOperationsInput = {
  set?: number
  increment?: number
  decrement?: number
  multiply?: number
  divide?: number
}

export type NullableDecimalFieldUpdateOperationsInput = {
  set?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  increment?: runtime.Decimal | runtime.DecimalJsLike | number | string
  decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string
  multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string
  divide?: runtime.Decimal | runtime.DecimalJsLike | number | string
}

export type ModuleCreateNestedOneWithoutUserProgressInput = {
  create?: Prisma.XOR<Prisma.ModuleCreateWithoutUserProgressInput, Prisma.ModuleUncheckedCreateWithoutUserProgressInput>
  connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutUserProgressInput
  connect?: Prisma.ModuleWhereUniqueInput
}

export type ModuleUpdateOneRequiredWithoutUserProgressNestedInput = {
  create?: Prisma.XOR<Prisma.ModuleCreateWithoutUserProgressInput, Prisma.ModuleUncheckedCreateWithoutUserProgressInput>
  connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutUserProgressInput
  upsert?: Prisma.ModuleUpsertWithoutUserProgressInput
  connect?: Prisma.ModuleWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.ModuleUpdateToOneWithWhereWithoutUserProgressInput, Prisma.ModuleUpdateWithoutUserProgressInput>, Prisma.ModuleUncheckedUpdateWithoutUserProgressInput>
}

export type ModuleCreateNestedOneWithoutExercisesInput = {
  create?: Prisma.XOR<Prisma.ModuleCreateWithoutExercisesInput, Prisma.ModuleUncheckedCreateWithoutExercisesInput>
  connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutExercisesInput
  connect?: Prisma.ModuleWhereUniqueInput
}

export type ModuleUpdateOneRequiredWithoutExercisesNestedInput = {
  create?: Prisma.XOR<Prisma.ModuleCreateWithoutExercisesInput, Prisma.ModuleUncheckedCreateWithoutExercisesInput>
  connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutExercisesInput
  upsert?: Prisma.ModuleUpsertWithoutExercisesInput
  connect?: Prisma.ModuleWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.ModuleUpdateToOneWithWhereWithoutExercisesInput, Prisma.ModuleUpdateWithoutExercisesInput>, Prisma.ModuleUncheckedUpdateWithoutExercisesInput>
}

export type ModuleCreateNestedOneWithoutLearningEventsInput = {
  create?: Prisma.XOR<Prisma.ModuleCreateWithoutLearningEventsInput, Prisma.ModuleUncheckedCreateWithoutLearningEventsInput>
  connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutLearningEventsInput
  connect?: Prisma.ModuleWhereUniqueInput
}

export type ModuleUpdateOneWithoutLearningEventsNestedInput = {
  create?: Prisma.XOR<Prisma.ModuleCreateWithoutLearningEventsInput, Prisma.ModuleUncheckedCreateWithoutLearningEventsInput>
  connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutLearningEventsInput
  upsert?: Prisma.ModuleUpsertWithoutLearningEventsInput
  disconnect?: Prisma.ModuleWhereInput | boolean
  delete?: Prisma.ModuleWhereInput | boolean
  connect?: Prisma.ModuleWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.ModuleUpdateToOneWithWhereWithoutLearningEventsInput, Prisma.ModuleUpdateWithoutLearningEventsInput>, Prisma.ModuleUncheckedUpdateWithoutLearningEventsInput>
}

export type ModuleCreateNestedOneWithoutAiNotesInput = {
  create?: Prisma.XOR<Prisma.ModuleCreateWithoutAiNotesInput, Prisma.ModuleUncheckedCreateWithoutAiNotesInput>
  connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutAiNotesInput
  connect?: Prisma.ModuleWhereUniqueInput
}

export type ModuleUpdateOneRequiredWithoutAiNotesNestedInput = {
  create?: Prisma.XOR<Prisma.ModuleCreateWithoutAiNotesInput, Prisma.ModuleUncheckedCreateWithoutAiNotesInput>
  connectOrCreate?: Prisma.ModuleCreateOrConnectWithoutAiNotesInput
  upsert?: Prisma.ModuleUpsertWithoutAiNotesInput
  connect?: Prisma.ModuleWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.ModuleUpdateToOneWithWhereWithoutAiNotesInput, Prisma.ModuleUpdateWithoutAiNotesInput>, Prisma.ModuleUncheckedUpdateWithoutAiNotesInput>
}

export type ModuleCreateWithoutRoadmapInput = {
  module_id?: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteCreateNestedManyWithoutModuleInput
  exercises?: Prisma.ExerciseCreateNestedManyWithoutModuleInput
  learningEvents?: Prisma.LearningEventCreateNestedManyWithoutModuleInput
  userProgress?: Prisma.UserProgressCreateNestedManyWithoutModuleInput
}

export type ModuleUncheckedCreateWithoutRoadmapInput = {
  module_id?: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteUncheckedCreateNestedManyWithoutModuleInput
  exercises?: Prisma.ExerciseUncheckedCreateNestedManyWithoutModuleInput
  learningEvents?: Prisma.LearningEventUncheckedCreateNestedManyWithoutModuleInput
  userProgress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutModuleInput
}

export type ModuleCreateOrConnectWithoutRoadmapInput = {
  where: Prisma.ModuleWhereUniqueInput
  create: Prisma.XOR<Prisma.ModuleCreateWithoutRoadmapInput, Prisma.ModuleUncheckedCreateWithoutRoadmapInput>
}

export type ModuleCreateManyRoadmapInputEnvelope = {
  data: Prisma.ModuleCreateManyRoadmapInput | Prisma.ModuleCreateManyRoadmapInput[]
  skipDuplicates?: boolean
}

export type ModuleUpsertWithWhereUniqueWithoutRoadmapInput = {
  where: Prisma.ModuleWhereUniqueInput
  update: Prisma.XOR<Prisma.ModuleUpdateWithoutRoadmapInput, Prisma.ModuleUncheckedUpdateWithoutRoadmapInput>
  create: Prisma.XOR<Prisma.ModuleCreateWithoutRoadmapInput, Prisma.ModuleUncheckedCreateWithoutRoadmapInput>
}

export type ModuleUpdateWithWhereUniqueWithoutRoadmapInput = {
  where: Prisma.ModuleWhereUniqueInput
  data: Prisma.XOR<Prisma.ModuleUpdateWithoutRoadmapInput, Prisma.ModuleUncheckedUpdateWithoutRoadmapInput>
}

export type ModuleUpdateManyWithWhereWithoutRoadmapInput = {
  where: Prisma.ModuleScalarWhereInput
  data: Prisma.XOR<Prisma.ModuleUpdateManyMutationInput, Prisma.ModuleUncheckedUpdateManyWithoutRoadmapInput>
}

export type ModuleScalarWhereInput = {
  AND?: Prisma.ModuleScalarWhereInput | Prisma.ModuleScalarWhereInput[]
  OR?: Prisma.ModuleScalarWhereInput[]
  NOT?: Prisma.ModuleScalarWhereInput | Prisma.ModuleScalarWhereInput[]
  module_id?: Prisma.StringFilter<"Module"> | string
  roadmap_id?: Prisma.StringFilter<"Module"> | string
  title?: Prisma.StringFilter<"Module"> | string
  description?: Prisma.StringNullableFilter<"Module"> | string | null
  content?: Prisma.StringNullableFilter<"Module"> | string | null
  order_index?: Prisma.IntFilter<"Module"> | number
  estimated_hours?: Prisma.DecimalNullableFilter<"Module"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFilter<"Module"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"Module"> | Date | string
}

export type ModuleCreateWithoutUserProgressInput = {
  module_id?: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteCreateNestedManyWithoutModuleInput
  exercises?: Prisma.ExerciseCreateNestedManyWithoutModuleInput
  learningEvents?: Prisma.LearningEventCreateNestedManyWithoutModuleInput
  roadmap: Prisma.RoadmapCreateNestedOneWithoutModulesInput
}

export type ModuleUncheckedCreateWithoutUserProgressInput = {
  module_id?: string
  roadmap_id: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteUncheckedCreateNestedManyWithoutModuleInput
  exercises?: Prisma.ExerciseUncheckedCreateNestedManyWithoutModuleInput
  learningEvents?: Prisma.LearningEventUncheckedCreateNestedManyWithoutModuleInput
}

export type ModuleCreateOrConnectWithoutUserProgressInput = {
  where: Prisma.ModuleWhereUniqueInput
  create: Prisma.XOR<Prisma.ModuleCreateWithoutUserProgressInput, Prisma.ModuleUncheckedCreateWithoutUserProgressInput>
}

export type ModuleUpsertWithoutUserProgressInput = {
  update: Prisma.XOR<Prisma.ModuleUpdateWithoutUserProgressInput, Prisma.ModuleUncheckedUpdateWithoutUserProgressInput>
  create: Prisma.XOR<Prisma.ModuleCreateWithoutUserProgressInput, Prisma.ModuleUncheckedCreateWithoutUserProgressInput>
  where?: Prisma.ModuleWhereInput
}

export type ModuleUpdateToOneWithWhereWithoutUserProgressInput = {
  where?: Prisma.ModuleWhereInput
  data: Prisma.XOR<Prisma.ModuleUpdateWithoutUserProgressInput, Prisma.ModuleUncheckedUpdateWithoutUserProgressInput>
}

export type ModuleUpdateWithoutUserProgressInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUpdateManyWithoutModuleNestedInput
  exercises?: Prisma.ExerciseUpdateManyWithoutModuleNestedInput
  learningEvents?: Prisma.LearningEventUpdateManyWithoutModuleNestedInput
  roadmap?: Prisma.RoadmapUpdateOneRequiredWithoutModulesNestedInput
}

export type ModuleUncheckedUpdateWithoutUserProgressInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUncheckedUpdateManyWithoutModuleNestedInput
  exercises?: Prisma.ExerciseUncheckedUpdateManyWithoutModuleNestedInput
  learningEvents?: Prisma.LearningEventUncheckedUpdateManyWithoutModuleNestedInput
}

export type ModuleCreateWithoutExercisesInput = {
  module_id?: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteCreateNestedManyWithoutModuleInput
  learningEvents?: Prisma.LearningEventCreateNestedManyWithoutModuleInput
  roadmap: Prisma.RoadmapCreateNestedOneWithoutModulesInput
  userProgress?: Prisma.UserProgressCreateNestedManyWithoutModuleInput
}

export type ModuleUncheckedCreateWithoutExercisesInput = {
  module_id?: string
  roadmap_id: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteUncheckedCreateNestedManyWithoutModuleInput
  learningEvents?: Prisma.LearningEventUncheckedCreateNestedManyWithoutModuleInput
  userProgress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutModuleInput
}

export type ModuleCreateOrConnectWithoutExercisesInput = {
  where: Prisma.ModuleWhereUniqueInput
  create: Prisma.XOR<Prisma.ModuleCreateWithoutExercisesInput, Prisma.ModuleUncheckedCreateWithoutExercisesInput>
}

export type ModuleUpsertWithoutExercisesInput = {
  update: Prisma.XOR<Prisma.ModuleUpdateWithoutExercisesInput, Prisma.ModuleUncheckedUpdateWithoutExercisesInput>
  create: Prisma.XOR<Prisma.ModuleCreateWithoutExercisesInput, Prisma.ModuleUncheckedCreateWithoutExercisesInput>
  where?: Prisma.ModuleWhereInput
}

export type ModuleUpdateToOneWithWhereWithoutExercisesInput = {
  where?: Prisma.ModuleWhereInput
  data: Prisma.XOR<Prisma.ModuleUpdateWithoutExercisesInput, Prisma.ModuleUncheckedUpdateWithoutExercisesInput>
}

export type ModuleUpdateWithoutExercisesInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUpdateManyWithoutModuleNestedInput
  learningEvents?: Prisma.LearningEventUpdateManyWithoutModuleNestedInput
  roadmap?: Prisma.RoadmapUpdateOneRequiredWithoutModulesNestedInput
  userProgress?: Prisma.UserProgressUpdateManyWithoutModuleNestedInput
}

export type ModuleUncheckedUpdateWithoutExercisesInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUncheckedUpdateManyWithoutModuleNestedInput
  learningEvents?: Prisma.LearningEventUncheckedUpdateManyWithoutModuleNestedInput
  userProgress?: Prisma.UserProgressUncheckedUpdateManyWithoutModuleNestedInput
}

export type ModuleCreateWithoutLearningEventsInput = {
  module_id?: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteCreateNestedManyWithoutModuleInput
  exercises?: Prisma.ExerciseCreateNestedManyWithoutModuleInput
  roadmap: Prisma.RoadmapCreateNestedOneWithoutModulesInput
  userProgress?: Prisma.UserProgressCreateNestedManyWithoutModuleInput
}

export type ModuleUncheckedCreateWithoutLearningEventsInput = {
  module_id?: string
  roadmap_id: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteUncheckedCreateNestedManyWithoutModuleInput
  exercises?: Prisma.ExerciseUncheckedCreateNestedManyWithoutModuleInput
  userProgress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutModuleInput
}

export type ModuleCreateOrConnectWithoutLearningEventsInput = {
  where: Prisma.ModuleWhereUniqueInput
  create: Prisma.XOR<Prisma.ModuleCreateWithoutLearningEventsInput, Prisma.ModuleUncheckedCreateWithoutLearningEventsInput>
}

export type ModuleUpsertWithoutLearningEventsInput = {
  update: Prisma.XOR<Prisma.ModuleUpdateWithoutLearningEventsInput, Prisma.ModuleUncheckedUpdateWithoutLearningEventsInput>
  create: Prisma.XOR<Prisma.ModuleCreateWithoutLearningEventsInput, Prisma.ModuleUncheckedCreateWithoutLearningEventsInput>
  where?: Prisma.ModuleWhereInput
}

export type ModuleUpdateToOneWithWhereWithoutLearningEventsInput = {
  where?: Prisma.ModuleWhereInput
  data: Prisma.XOR<Prisma.ModuleUpdateWithoutLearningEventsInput, Prisma.ModuleUncheckedUpdateWithoutLearningEventsInput>
}

export type ModuleUpdateWithoutLearningEventsInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUpdateManyWithoutModuleNestedInput
  exercises?: Prisma.ExerciseUpdateManyWithoutModuleNestedInput
  roadmap?: Prisma.RoadmapUpdateOneRequiredWithoutModulesNestedInput
  userProgress?: Prisma.UserProgressUpdateManyWithoutModuleNestedInput
}

export type ModuleUncheckedUpdateWithoutLearningEventsInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUncheckedUpdateManyWithoutModuleNestedInput
  exercises?: Prisma.ExerciseUncheckedUpdateManyWithoutModuleNestedInput
  userProgress?: Prisma.UserProgressUncheckedUpdateManyWithoutModuleNestedInput
}

export type ModuleCreateWithoutAiNotesInput = {
  module_id?: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
  exercises?: Prisma.ExerciseCreateNestedManyWithoutModuleInput
  learningEvents?: Prisma.LearningEventCreateNestedManyWithoutModuleInput
  roadmap: Prisma.RoadmapCreateNestedOneWithoutModulesInput
  userProgress?: Prisma.UserProgressCreateNestedManyWithoutModuleInput
}

export type ModuleUncheckedCreateWithoutAiNotesInput = {
  module_id?: string
  roadmap_id: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
  exercises?: Prisma.ExerciseUncheckedCreateNestedManyWithoutModuleInput
  learningEvents?: Prisma.LearningEventUncheckedCreateNestedManyWithoutModuleInput
  userProgress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutModuleInput
}

export type ModuleCreateOrConnectWithoutAiNotesInput = {
  where: Prisma.ModuleWhereUniqueInput
  create: Prisma.XOR<Prisma.ModuleCreateWithoutAiNotesInput, Prisma.ModuleUncheckedCreateWithoutAiNotesInput>
}

export type ModuleUpsertWithoutAiNotesInput = {
  update: Prisma.XOR<Prisma.ModuleUpdateWithoutAiNotesInput, Prisma.ModuleUncheckedUpdateWithoutAiNotesInput>
  create: Prisma.XOR<Prisma.ModuleCreateWithoutAiNotesInput, Prisma.ModuleUncheckedCreateWithoutAiNotesInput>
  where?: Prisma.ModuleWhereInput
}

export type ModuleUpdateToOneWithWhereWithoutAiNotesInput = {
  where?: Prisma.ModuleWhereInput
  data: Prisma.XOR<Prisma.ModuleUpdateWithoutAiNotesInput, Prisma.ModuleUncheckedUpdateWithoutAiNotesInput>
}

export type ModuleUpdateWithoutAiNotesInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  exercises?: Prisma.ExerciseUpdateManyWithoutModuleNestedInput
  learningEvents?: Prisma.LearningEventUpdateManyWithoutModuleNestedInput
  roadmap?: Prisma.RoadmapUpdateOneRequiredWithoutModulesNestedInput
  userProgress?: Prisma.UserProgressUpdateManyWithoutModuleNestedInput
}

export type ModuleUncheckedUpdateWithoutAiNotesInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  exercises?: Prisma.ExerciseUncheckedUpdateManyWithoutModuleNestedInput
  learningEvents?: Prisma.LearningEventUncheckedUpdateManyWithoutModuleNestedInput
  userProgress?: Prisma.UserProgressUncheckedUpdateManyWithoutModuleNestedInput
}

export type ModuleCreateManyRoadmapInput = {
  module_id?: string
  title: string
  description?: string | null
  content?: string | null
  order_index: number
  estimated_hours?: runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Date | string
  updated_at?: Date | string
}

export type ModuleUpdateWithoutRoadmapInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUpdateManyWithoutModuleNestedInput
  exercises?: Prisma.ExerciseUpdateManyWithoutModuleNestedInput
  learningEvents?: Prisma.LearningEventUpdateManyWithoutModuleNestedInput
  userProgress?: Prisma.UserProgressUpdateManyWithoutModuleNestedInput
}

export type ModuleUncheckedUpdateWithoutRoadmapInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUncheckedUpdateManyWithoutModuleNestedInput
  exercises?: Prisma.ExerciseUncheckedUpdateManyWithoutModuleNestedInput
  learningEvents?: Prisma.LearningEventUncheckedUpdateManyWithoutModuleNestedInput
  userProgress?: Prisma.UserProgressUncheckedUpdateManyWithoutModuleNestedInput
}

export type ModuleUncheckedUpdateManyWithoutRoadmapInput = {
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  content?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  order_index?: Prisma.IntFieldUpdateOperationsInput | number
  estimated_hours?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}


/**
 * Count Type ModuleCountOutputType
 */

export type ModuleCountOutputType = {
  aiNotes: number
  exercises: number
  learningEvents: number
  userProgress: number
}

export type ModuleCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  aiNotes?: boolean | ModuleCountOutputTypeCountAiNotesArgs
  exercises?: boolean | ModuleCountOutputTypeCountExercisesArgs
  learningEvents?: boolean | ModuleCountOutputTypeCountLearningEventsArgs
  userProgress?: boolean | ModuleCountOutputTypeCountUserProgressArgs
}

/**
 * ModuleCountOutputType without action
 */
export type ModuleCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ModuleCountOutputType
   */
  select?: Prisma.ModuleCountOutputTypeSelect<ExtArgs> | null
}

/**
 * ModuleCountOutputType without action
 */
export type ModuleCountOutputTypeCountAiNotesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.AINoteWhereInput
}

/**
 * ModuleCountOutputType without action
 */
export type ModuleCountOutputTypeCountExercisesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.ExerciseWhereInput
}

/**
 * ModuleCountOutputType without action
 */
export type ModuleCountOutputTypeCountLearningEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.LearningEventWhereInput
}

/**
 * ModuleCountOutputType without action
 */
export type ModuleCountOutputTypeCountUserProgressArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.UserProgressWhereInput
}


export type ModuleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  module_id?: boolean
  roadmap_id?: boolean
  title?: boolean
  description?: boolean
  content?: boolean
  order_index?: boolean
  estimated_hours?: boolean
  created_at?: boolean
  updated_at?: boolean
  aiNotes?: boolean | Prisma.Module$aiNotesArgs<ExtArgs>
  exercises?: boolean | Prisma.Module$exercisesArgs<ExtArgs>
  learningEvents?: boolean | Prisma.Module$learningEventsArgs<ExtArgs>
  roadmap?: boolean | Prisma.RoadmapDefaultArgs<ExtArgs>
  userProgress?: boolean | Prisma.Module$userProgressArgs<ExtArgs>
  _count?: boolean | Prisma.ModuleCountOutputTypeDefaultArgs<ExtArgs>
}, ExtArgs["result"]["module"]>



export type ModuleSelectScalar = {
  module_id?: boolean
  roadmap_id?: boolean
  title?: boolean
  description?: boolean
  content?: boolean
  order_index?: boolean
  estimated_hours?: boolean
  created_at?: boolean
  updated_at?: boolean
}

export type ModuleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"module_id" | "roadmap_id" | "title" | "description" | "content" | "order_index" | "estimated_hours" | "created_at" | "updated_at", ExtArgs["result"]["module"]>
export type ModuleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  aiNotes?: boolean | Prisma.Module$aiNotesArgs<ExtArgs>
  exercises?: boolean | Prisma.Module$exercisesArgs<ExtArgs>
  learningEvents?: boolean | Prisma.Module$learningEventsArgs<ExtArgs>
  roadmap?: boolean | Prisma.RoadmapDefaultArgs<ExtArgs>
  userProgress?: boolean | Prisma.Module$userProgressArgs<ExtArgs>
  _count?: boolean | Prisma.ModuleCountOutputTypeDefaultArgs<ExtArgs>
}

export type $ModulePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "Module"
  objects: {
    aiNotes: Prisma.$AINotePayload<ExtArgs>[]
    exercises: Prisma.$ExercisePayload<ExtArgs>[]
    learningEvents: Prisma.$LearningEventPayload<ExtArgs>[]
    roadmap: Prisma.$RoadmapPayload<ExtArgs>
    userProgress: Prisma.$UserProgressPayload<ExtArgs>[]
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    module_id: string
    roadmap_id: string
    title: string
    description: string | null
    content: string | null
    order_index: number
    estimated_hours: runtime.Decimal | null
    created_at: Date
    updated_at: Date
  }, ExtArgs["result"]["module"]>
  composites: {}
}

export type ModuleGetPayload<S extends boolean | null | undefined | ModuleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ModulePayload, S>

export type ModuleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<ModuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ModuleCountAggregateInputType | true
  }

export interface ModuleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Module'], meta: { name: 'Module' } }
  /**
   * Find zero or one Module that matches the filter.
   * @param {ModuleFindUniqueArgs} args - Arguments to find a Module
   * @example
   * // Get one Module
   * const module = await prisma.module.findUnique({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUnique<T extends ModuleFindUniqueArgs>(args: Prisma.SelectSubset<T, ModuleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find one Module that matches the filter or throw an error with `error.code='P2025'`
   * if no matches were found.
   * @param {ModuleFindUniqueOrThrowArgs} args - Arguments to find a Module
   * @example
   * // Get one Module
   * const module = await prisma.module.findUniqueOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUniqueOrThrow<T extends ModuleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ModuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first Module that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ModuleFindFirstArgs} args - Arguments to find a Module
   * @example
   * // Get one Module
   * const module = await prisma.module.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends ModuleFindFirstArgs>(args?: Prisma.SelectSubset<T, ModuleFindFirstArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first Module that matches the filter or
   * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ModuleFindFirstOrThrowArgs} args - Arguments to find a Module
   * @example
   * // Get one Module
   * const module = await prisma.module.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends ModuleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ModuleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find zero or more Modules that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ModuleFindManyArgs} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Modules
   * const modules = await prisma.module.findMany()
   * 
   * // Get first 10 Modules
   * const modules = await prisma.module.findMany({ take: 10 })
   * 
   * // Only select the `module_id`
   * const moduleWithModule_idOnly = await prisma.module.findMany({ select: { module_id: true } })
   * 
   */
  findMany<T extends ModuleFindManyArgs>(args?: Prisma.SelectSubset<T, ModuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  /**
   * Create a Module.
   * @param {ModuleCreateArgs} args - Arguments to create a Module.
   * @example
   * // Create one Module
   * const Module = await prisma.module.create({
   *   data: {
   *     // ... data to create a Module
   *   }
   * })
   * 
   */
  create<T extends ModuleCreateArgs>(args: Prisma.SelectSubset<T, ModuleCreateArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Create many Modules.
   * @param {ModuleCreateManyArgs} args - Arguments to create many Modules.
   * @example
   * // Create many Modules
   * const module = await prisma.module.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   *     
   */
  createMany<T extends ModuleCreateManyArgs>(args?: Prisma.SelectSubset<T, ModuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Delete a Module.
   * @param {ModuleDeleteArgs} args - Arguments to delete one Module.
   * @example
   * // Delete one Module
   * const Module = await prisma.module.delete({
   *   where: {
   *     // ... filter to delete one Module
   *   }
   * })
   * 
   */
  delete<T extends ModuleDeleteArgs>(args: Prisma.SelectSubset<T, ModuleDeleteArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Update one Module.
   * @param {ModuleUpdateArgs} args - Arguments to update one Module.
   * @example
   * // Update one Module
   * const module = await prisma.module.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends ModuleUpdateArgs>(args: Prisma.SelectSubset<T, ModuleUpdateArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Delete zero or more Modules.
   * @param {ModuleDeleteManyArgs} args - Arguments to filter Modules to delete.
   * @example
   * // Delete a few Modules
   * const { count } = await prisma.module.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany<T extends ModuleDeleteManyArgs>(args?: Prisma.SelectSubset<T, ModuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Update zero or more Modules.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ModuleUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Modules
   * const module = await prisma.module.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany<T extends ModuleUpdateManyArgs>(args: Prisma.SelectSubset<T, ModuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Create or update one Module.
   * @param {ModuleUpsertArgs} args - Arguments to update or create a Module.
   * @example
   * // Update or create a Module
   * const module = await prisma.module.upsert({
   *   create: {
   *     // ... data to create a Module
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Module we want to update
   *   }
   * })
   */
  upsert<T extends ModuleUpsertArgs>(args: Prisma.SelectSubset<T, ModuleUpsertArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


  /**
   * Count the number of Modules.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ModuleCountArgs} args - Arguments to filter Modules to count.
   * @example
   * // Count the number of Modules
   * const count = await prisma.module.count({
   *   where: {
   *     // ... the filter for the Modules we want to count
   *   }
   * })
  **/
  count<T extends ModuleCountArgs>(
    args?: Prisma.Subset<T, ModuleCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], ModuleCountAggregateOutputType>
      : number
  >

  /**
   * Allows you to perform aggregations operations on a Module.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ModuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Ordered by age ascending
   * // Where email contains prisma.io
   * // Limited to the 10 users
   * const aggregations = await prisma.user.aggregate({
   *   _avg: {
   *     age: true,
   *   },
   *   where: {
   *     email: {
   *       contains: "prisma.io",
   *     },
   *   },
   *   orderBy: {
   *     age: "asc",
   *   },
   *   take: 10,
   * })
  **/
  aggregate<T extends ModuleAggregateArgs>(args: Prisma.Subset<T, ModuleAggregateArgs>): Prisma.PrismaPromise<GetModuleAggregateType<T>>

  /**
   * Group by Module.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {ModuleGroupByArgs} args - Group by arguments.
   * @example
   * // Group by city, order by createdAt, get count
   * const result = await prisma.user.groupBy({
   *   by: ['city', 'createdAt'],
   *   orderBy: {
   *     createdAt: true
   *   },
   *   _count: {
   *     _all: true
   *   },
   * })
   * 
  **/
  groupBy<
    T extends ModuleGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: ModuleGroupByArgs['orderBy'] }
      : { orderBy?: ModuleGroupByArgs['orderBy'] },
    OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>,
    ByFields extends Prisma.MaybeTupleToUnion<T['by']>,
    ByValid extends Prisma.Has<ByFields, OrderFields>,
    HavingFields extends Prisma.GetHavingFields<T['having']>,
    HavingValid extends Prisma.Has<ByFields, HavingFields>,
    ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False,
    InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
          ? never
          : P extends string
          ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
          : [
              Error,
              'Field ',
              P,
              ` in "having" needs to be provided in "by"`,
            ]
      }[HavingFields]
    : 'take' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
          ? never
          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
      }[OrderFields]
  >(args: Prisma.SubsetIntersection<T, ModuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
/**
 * Fields of the Module model
 */
readonly fields: ModuleFieldRefs;
}

/**
 * The delegate class that acts as a "Promise-like" for Module.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ModuleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  aiNotes<T extends Prisma.Module$aiNotesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Module$aiNotesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AINotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  exercises<T extends Prisma.Module$exercisesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Module$exercisesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  learningEvents<T extends Prisma.Module$learningEventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Module$learningEventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LearningEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  roadmap<T extends Prisma.RoadmapDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RoadmapDefaultArgs<ExtArgs>>): Prisma.Prisma__RoadmapClient<runtime.Types.Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  userProgress<T extends Prisma.Module$userProgressArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Module$userProgressArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}




/**
 * Fields of the Module model
 */
export interface ModuleFieldRefs {
  readonly module_id: Prisma.FieldRef<"Module", 'String'>
  readonly roadmap_id: Prisma.FieldRef<"Module", 'String'>
  readonly title: Prisma.FieldRef<"Module", 'String'>
  readonly description: Prisma.FieldRef<"Module", 'String'>
  readonly content: Prisma.FieldRef<"Module", 'String'>
  readonly order_index: Prisma.FieldRef<"Module", 'Int'>
  readonly estimated_hours: Prisma.FieldRef<"Module", 'Decimal'>
  readonly created_at: Prisma.FieldRef<"Module", 'DateTime'>
  readonly updated_at: Prisma.FieldRef<"Module", 'DateTime'>
}
    

// Custom InputTypes
/**
 * Module findUnique
 */
export type ModuleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Module
   */
  select?: Prisma.ModuleSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Module
   */
  omit?: Prisma.ModuleOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ModuleInclude<ExtArgs> | null
  /**
   * Filter, which Module to fetch.
   */
  where: Prisma.ModuleWhereUniqueInput
}

/**
 * Module findUniqueOrThrow
 */
export type ModuleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Module
   */
  select?: Prisma.ModuleSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Module
   */
  omit?: Prisma.ModuleOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ModuleInclude<ExtArgs> | null
  /**
   * Filter, which Module to fetch.
   */
  where: Prisma.ModuleWhereUniqueInput
}

/**
 * Module findFirst
 */
export type ModuleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Module
   */
  select?: Prisma.ModuleSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Module
   */
  omit?: Prisma.ModuleOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ModuleInclude<ExtArgs> | null
  /**
   * Filter, which Module to fetch.
   */
  where?: Prisma.ModuleWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Modules to fetch.
   */
  orderBy?: Prisma.ModuleOrderByWithRelationInput | Prisma.ModuleOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for Modules.
   */
  cursor?: Prisma.ModuleWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Modules from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Modules.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of Modules.
   */
  distinct?: Prisma.ModuleScalarFieldEnum | Prisma.ModuleScalarFieldEnum[]
}

/**
 * Module findFirstOrThrow
 */
export type ModuleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Module
   */
  select?: Prisma.ModuleSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Module
   */
  omit?: Prisma.ModuleOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ModuleInclude<ExtArgs> | null
  /**
   * Filter, which Module to fetch.
   */
  where?: Prisma.ModuleWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Modules to fetch.
   */
  orderBy?: Prisma.ModuleOrderByWithRelationInput | Prisma.ModuleOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for Modules.
   */
  cursor?: Prisma.ModuleWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Modules from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Modules.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of Modules.
   */
  distinct?: Prisma.ModuleScalarFieldEnum | Prisma.ModuleScalarFieldEnum[]
}

/**
 * Module findMany
 */
export type ModuleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Module
   */
  select?: Prisma.ModuleSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Module
   */
  omit?: Prisma.ModuleOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ModuleInclude<ExtArgs> | null
  /**
   * Filter, which Modules to fetch.
   */
  where?: Prisma.ModuleWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Modules to fetch.
   */
  orderBy?: Prisma.ModuleOrderByWithRelationInput | Prisma.ModuleOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for listing Modules.
   */
  cursor?: Prisma.ModuleWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Modules from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Modules.
   */
  skip?: number
  distinct?: Prisma.ModuleScalarFieldEnum | Prisma.ModuleScalarFieldEnum[]
}

/**
 * Module create
 */
export type ModuleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Module
   */
  select?: Prisma.ModuleSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Module
   */
  omit?: Prisma.ModuleOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ModuleInclude<ExtArgs> | null
  /**
   * The data needed to create a Module.
   */
  data: Prisma.XOR<Prisma.ModuleCreateInput, Prisma.ModuleUncheckedCreateInput>
}

/**
 * Module createMany
 */
export type ModuleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to create many Modules.
   */
  data: Prisma.ModuleCreateManyInput | Prisma.ModuleCreateManyInput[]
  skipDuplicates?: boolean
}

/**
 * Module update
 */
export type ModuleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Module
   */
  select?: Prisma.ModuleSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Module
   */
  omit?: Prisma.ModuleOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ModuleInclude<ExtArgs> | null
  /**
   * The data needed to update a Module.
   */
  data: Prisma.XOR<Prisma.ModuleUpdateInput, Prisma.ModuleUncheckedUpdateInput>
  /**
   * Choose, which Module to update.
   */
  where: Prisma.ModuleWhereUniqueInput
}

/**
 * Module updateMany
 */
export type ModuleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to update Modules.
   */
  data: Prisma.XOR<Prisma.ModuleUpdateManyMutationInput, Prisma.ModuleUncheckedUpdateManyInput>
  /**
   * Filter which Modules to update
   */
  where?: Prisma.ModuleWhereInput
  /**
   * Limit how many Modules to update.
   */
  limit?: number
}

/**
 * Module upsert
 */
export type ModuleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Module
   */
  select?: Prisma.ModuleSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Module
   */
  omit?: Prisma.ModuleOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ModuleInclude<ExtArgs> | null
  /**
   * The filter to search for the Module to update in case it exists.
   */
  where: Prisma.ModuleWhereUniqueInput
  /**
   * In case the Module found by the `where` argument doesn't exist, create a new Module with this data.
   */
  create: Prisma.XOR<Prisma.ModuleCreateInput, Prisma.ModuleUncheckedCreateInput>
  /**
   * In case the Module was found with the provided `where` argument, update it with this data.
   */
  update: Prisma.XOR<Prisma.ModuleUpdateInput, Prisma.ModuleUncheckedUpdateInput>
}

/**
 * Module delete
 */
export type ModuleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Module
   */
  select?: Prisma.ModuleSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Module
   */
  omit?: Prisma.ModuleOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ModuleInclude<ExtArgs> | null
  /**
   * Filter which Module to delete.
   */
  where: Prisma.ModuleWhereUniqueInput
}

/**
 * Module deleteMany
 */
export type ModuleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which Modules to delete
   */
  where?: Prisma.ModuleWhereInput
  /**
   * Limit how many Modules to delete.
   */
  limit?: number
}

/**
 * Module.aiNotes
 */
export type Module$aiNotesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the AINote
   */
  select?: Prisma.AINoteSelect<ExtArgs> | null
  /**
   * Omit specific fields from the AINote
   */
  omit?: Prisma.AINoteOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.AINoteInclude<ExtArgs> | null
  where?: Prisma.AINoteWhereInput
  orderBy?: Prisma.AINoteOrderByWithRelationInput | Prisma.AINoteOrderByWithRelationInput[]
  cursor?: Prisma.AINoteWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.AINoteScalarFieldEnum | Prisma.AINoteScalarFieldEnum[]
}

/**
 * Module.exercises
 */
export type Module$exercisesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Exercise
   */
  select?: Prisma.ExerciseSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Exercise
   */
  omit?: Prisma.ExerciseOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseInclude<ExtArgs> | null
  where?: Prisma.ExerciseWhereInput
  orderBy?: Prisma.ExerciseOrderByWithRelationInput | Prisma.ExerciseOrderByWithRelationInput[]
  cursor?: Prisma.ExerciseWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.ExerciseScalarFieldEnum | Prisma.ExerciseScalarFieldEnum[]
}

/**
 * Module.learningEvents
 */
export type Module$learningEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the LearningEvent
   */
  select?: Prisma.LearningEventSelect<ExtArgs> | null
  /**
   * Omit specific fields from the LearningEvent
   */
  omit?: Prisma.LearningEventOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.LearningEventInclude<ExtArgs> | null
  where?: Prisma.LearningEventWhereInput
  orderBy?: Prisma.LearningEventOrderByWithRelationInput | Prisma.LearningEventOrderByWithRelationInput[]
  cursor?: Prisma.LearningEventWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.LearningEventScalarFieldEnum | Prisma.LearningEventScalarFieldEnum[]
}

/**
 * Module.userProgress
 */
export type Module$userProgressArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the UserProgress
   */
  select?: Prisma.UserProgressSelect<ExtArgs> | null
  /**
   * Omit specific fields from the UserProgress
   */
  omit?: Prisma.UserProgressOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserProgressInclude<ExtArgs> | null
  where?: Prisma.UserProgressWhereInput
  orderBy?: Prisma.UserProgressOrderByWithRelationInput | Prisma.UserProgressOrderByWithRelationInput[]
  cursor?: Prisma.UserProgressWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.UserProgressScalarFieldEnum | Prisma.UserProgressScalarFieldEnum[]
}

/**
 * Module without action
 */
export type ModuleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Module
   */
  select?: Prisma.ModuleSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Module
   */
  omit?: Prisma.ModuleOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ModuleInclude<ExtArgs> | null
}

```

## File: src/generated/prisma/models/Roadmap.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file exports the `Roadmap` model and its related types.
 *
 * 🟢 You can import this file directly.
 */
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"

/**
 * Model Roadmap
 * 
 */
export type RoadmapModel = runtime.Types.Result.DefaultSelection<Prisma.$RoadmapPayload>

export type AggregateRoadmap = {
  _count: RoadmapCountAggregateOutputType | null
  _min: RoadmapMinAggregateOutputType | null
  _max: RoadmapMaxAggregateOutputType | null
}

export type RoadmapMinAggregateOutputType = {
  roadmap_id: string | null
  title: string | null
  description: string | null
  category: string | null
  image_url: string | null
  created_by: string | null
  status: $Enums.Status | null
  created_at: Date | null
  updated_at: Date | null
}

export type RoadmapMaxAggregateOutputType = {
  roadmap_id: string | null
  title: string | null
  description: string | null
  category: string | null
  image_url: string | null
  created_by: string | null
  status: $Enums.Status | null
  created_at: Date | null
  updated_at: Date | null
}

export type RoadmapCountAggregateOutputType = {
  roadmap_id: number
  title: number
  description: number
  category: number
  image_url: number
  created_by: number
  status: number
  created_at: number
  updated_at: number
  _all: number
}


export type RoadmapMinAggregateInputType = {
  roadmap_id?: true
  title?: true
  description?: true
  category?: true
  image_url?: true
  created_by?: true
  status?: true
  created_at?: true
  updated_at?: true
}

export type RoadmapMaxAggregateInputType = {
  roadmap_id?: true
  title?: true
  description?: true
  category?: true
  image_url?: true
  created_by?: true
  status?: true
  created_at?: true
  updated_at?: true
}

export type RoadmapCountAggregateInputType = {
  roadmap_id?: true
  title?: true
  description?: true
  category?: true
  image_url?: true
  created_by?: true
  status?: true
  created_at?: true
  updated_at?: true
  _all?: true
}

export type RoadmapAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which Roadmap to aggregate.
   */
  where?: Prisma.RoadmapWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Roadmaps to fetch.
   */
  orderBy?: Prisma.RoadmapOrderByWithRelationInput | Prisma.RoadmapOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the start position
   */
  cursor?: Prisma.RoadmapWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Roadmaps from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Roadmaps.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Count returned Roadmaps
  **/
  _count?: true | RoadmapCountAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the minimum value
  **/
  _min?: RoadmapMinAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the maximum value
  **/
  _max?: RoadmapMaxAggregateInputType
}

export type GetRoadmapAggregateType<T extends RoadmapAggregateArgs> = {
      [P in keyof T & keyof AggregateRoadmap]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateRoadmap[P]>
    : Prisma.GetScalarType<T[P], AggregateRoadmap[P]>
}




export type RoadmapGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.RoadmapWhereInput
  orderBy?: Prisma.RoadmapOrderByWithAggregationInput | Prisma.RoadmapOrderByWithAggregationInput[]
  by: Prisma.RoadmapScalarFieldEnum[] | Prisma.RoadmapScalarFieldEnum
  having?: Prisma.RoadmapScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: RoadmapCountAggregateInputType | true
  _min?: RoadmapMinAggregateInputType
  _max?: RoadmapMaxAggregateInputType
}

export type RoadmapGroupByOutputType = {
  roadmap_id: string
  title: string
  description: string | null
  category: string
  image_url: string | null
  created_by: string
  status: $Enums.Status
  created_at: Date
  updated_at: Date
  _count: RoadmapCountAggregateOutputType | null
  _min: RoadmapMinAggregateOutputType | null
  _max: RoadmapMaxAggregateOutputType | null
}

type GetRoadmapGroupByPayload<T extends RoadmapGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<RoadmapGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof RoadmapGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], RoadmapGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], RoadmapGroupByOutputType[P]>
      }
    >
  >



export type RoadmapWhereInput = {
  AND?: Prisma.RoadmapWhereInput | Prisma.RoadmapWhereInput[]
  OR?: Prisma.RoadmapWhereInput[]
  NOT?: Prisma.RoadmapWhereInput | Prisma.RoadmapWhereInput[]
  roadmap_id?: Prisma.StringFilter<"Roadmap"> | string
  title?: Prisma.StringFilter<"Roadmap"> | string
  description?: Prisma.StringNullableFilter<"Roadmap"> | string | null
  category?: Prisma.StringFilter<"Roadmap"> | string
  image_url?: Prisma.StringNullableFilter<"Roadmap"> | string | null
  created_by?: Prisma.StringFilter<"Roadmap"> | string
  status?: Prisma.EnumStatusFilter<"Roadmap"> | $Enums.Status
  created_at?: Prisma.DateTimeFilter<"Roadmap"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"Roadmap"> | Date | string
  certificates?: Prisma.CertificateListRelationFilter
  modules?: Prisma.ModuleListRelationFilter
  creator?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}

export type RoadmapOrderByWithRelationInput = {
  roadmap_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrderInput | Prisma.SortOrder
  category?: Prisma.SortOrder
  image_url?: Prisma.SortOrderInput | Prisma.SortOrder
  created_by?: Prisma.SortOrder
  status?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
  certificates?: Prisma.CertificateOrderByRelationAggregateInput
  modules?: Prisma.ModuleOrderByRelationAggregateInput
  creator?: Prisma.UserOrderByWithRelationInput
  _relevance?: Prisma.RoadmapOrderByRelevanceInput
}

export type RoadmapWhereUniqueInput = Prisma.AtLeast<{
  roadmap_id?: string
  AND?: Prisma.RoadmapWhereInput | Prisma.RoadmapWhereInput[]
  OR?: Prisma.RoadmapWhereInput[]
  NOT?: Prisma.RoadmapWhereInput | Prisma.RoadmapWhereInput[]
  title?: Prisma.StringFilter<"Roadmap"> | string
  description?: Prisma.StringNullableFilter<"Roadmap"> | string | null
  category?: Prisma.StringFilter<"Roadmap"> | string
  image_url?: Prisma.StringNullableFilter<"Roadmap"> | string | null
  created_by?: Prisma.StringFilter<"Roadmap"> | string
  status?: Prisma.EnumStatusFilter<"Roadmap"> | $Enums.Status
  created_at?: Prisma.DateTimeFilter<"Roadmap"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"Roadmap"> | Date | string
  certificates?: Prisma.CertificateListRelationFilter
  modules?: Prisma.ModuleListRelationFilter
  creator?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}, "roadmap_id">

export type RoadmapOrderByWithAggregationInput = {
  roadmap_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrderInput | Prisma.SortOrder
  category?: Prisma.SortOrder
  image_url?: Prisma.SortOrderInput | Prisma.SortOrder
  created_by?: Prisma.SortOrder
  status?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
  _count?: Prisma.RoadmapCountOrderByAggregateInput
  _max?: Prisma.RoadmapMaxOrderByAggregateInput
  _min?: Prisma.RoadmapMinOrderByAggregateInput
}

export type RoadmapScalarWhereWithAggregatesInput = {
  AND?: Prisma.RoadmapScalarWhereWithAggregatesInput | Prisma.RoadmapScalarWhereWithAggregatesInput[]
  OR?: Prisma.RoadmapScalarWhereWithAggregatesInput[]
  NOT?: Prisma.RoadmapScalarWhereWithAggregatesInput | Prisma.RoadmapScalarWhereWithAggregatesInput[]
  roadmap_id?: Prisma.StringWithAggregatesFilter<"Roadmap"> | string
  title?: Prisma.StringWithAggregatesFilter<"Roadmap"> | string
  description?: Prisma.StringNullableWithAggregatesFilter<"Roadmap"> | string | null
  category?: Prisma.StringWithAggregatesFilter<"Roadmap"> | string
  image_url?: Prisma.StringNullableWithAggregatesFilter<"Roadmap"> | string | null
  created_by?: Prisma.StringWithAggregatesFilter<"Roadmap"> | string
  status?: Prisma.EnumStatusWithAggregatesFilter<"Roadmap"> | $Enums.Status
  created_at?: Prisma.DateTimeWithAggregatesFilter<"Roadmap"> | Date | string
  updated_at?: Prisma.DateTimeWithAggregatesFilter<"Roadmap"> | Date | string
}

export type RoadmapCreateInput = {
  roadmap_id?: string
  title: string
  description?: string | null
  category: string
  image_url?: string | null
  status?: $Enums.Status
  created_at?: Date | string
  updated_at?: Date | string
  certificates?: Prisma.CertificateCreateNestedManyWithoutRoadmapInput
  modules?: Prisma.ModuleCreateNestedManyWithoutRoadmapInput
  creator: Prisma.UserCreateNestedOneWithoutRoadmapsInput
}

export type RoadmapUncheckedCreateInput = {
  roadmap_id?: string
  title: string
  description?: string | null
  category: string
  image_url?: string | null
  created_by: string
  status?: $Enums.Status
  created_at?: Date | string
  updated_at?: Date | string
  certificates?: Prisma.CertificateUncheckedCreateNestedManyWithoutRoadmapInput
  modules?: Prisma.ModuleUncheckedCreateNestedManyWithoutRoadmapInput
}

export type RoadmapUpdateInput = {
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  category?: Prisma.StringFieldUpdateOperationsInput | string
  image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  certificates?: Prisma.CertificateUpdateManyWithoutRoadmapNestedInput
  modules?: Prisma.ModuleUpdateManyWithoutRoadmapNestedInput
  creator?: Prisma.UserUpdateOneRequiredWithoutRoadmapsNestedInput
}

export type RoadmapUncheckedUpdateInput = {
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  category?: Prisma.StringFieldUpdateOperationsInput | string
  image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_by?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  certificates?: Prisma.CertificateUncheckedUpdateManyWithoutRoadmapNestedInput
  modules?: Prisma.ModuleUncheckedUpdateManyWithoutRoadmapNestedInput
}

export type RoadmapCreateManyInput = {
  roadmap_id?: string
  title: string
  description?: string | null
  category: string
  image_url?: string | null
  created_by: string
  status?: $Enums.Status
  created_at?: Date | string
  updated_at?: Date | string
}

export type RoadmapUpdateManyMutationInput = {
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  category?: Prisma.StringFieldUpdateOperationsInput | string
  image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type RoadmapUncheckedUpdateManyInput = {
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  category?: Prisma.StringFieldUpdateOperationsInput | string
  image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_by?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type RoadmapListRelationFilter = {
  every?: Prisma.RoadmapWhereInput
  some?: Prisma.RoadmapWhereInput
  none?: Prisma.RoadmapWhereInput
}

export type RoadmapOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type RoadmapOrderByRelevanceInput = {
  fields: Prisma.RoadmapOrderByRelevanceFieldEnum | Prisma.RoadmapOrderByRelevanceFieldEnum[]
  sort: Prisma.SortOrder
  search: string
}

export type RoadmapCountOrderByAggregateInput = {
  roadmap_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  category?: Prisma.SortOrder
  image_url?: Prisma.SortOrder
  created_by?: Prisma.SortOrder
  status?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type RoadmapMaxOrderByAggregateInput = {
  roadmap_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  category?: Prisma.SortOrder
  image_url?: Prisma.SortOrder
  created_by?: Prisma.SortOrder
  status?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type RoadmapMinOrderByAggregateInput = {
  roadmap_id?: Prisma.SortOrder
  title?: Prisma.SortOrder
  description?: Prisma.SortOrder
  category?: Prisma.SortOrder
  image_url?: Prisma.SortOrder
  created_by?: Prisma.SortOrder
  status?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type RoadmapScalarRelationFilter = {
  is?: Prisma.RoadmapWhereInput
  isNot?: Prisma.RoadmapWhereInput
}

export type RoadmapCreateNestedManyWithoutCreatorInput = {
  create?: Prisma.XOR<Prisma.RoadmapCreateWithoutCreatorInput, Prisma.RoadmapUncheckedCreateWithoutCreatorInput> | Prisma.RoadmapCreateWithoutCreatorInput[] | Prisma.RoadmapUncheckedCreateWithoutCreatorInput[]
  connectOrCreate?: Prisma.RoadmapCreateOrConnectWithoutCreatorInput | Prisma.RoadmapCreateOrConnectWithoutCreatorInput[]
  createMany?: Prisma.RoadmapCreateManyCreatorInputEnvelope
  connect?: Prisma.RoadmapWhereUniqueInput | Prisma.RoadmapWhereUniqueInput[]
}

export type RoadmapUncheckedCreateNestedManyWithoutCreatorInput = {
  create?: Prisma.XOR<Prisma.RoadmapCreateWithoutCreatorInput, Prisma.RoadmapUncheckedCreateWithoutCreatorInput> | Prisma.RoadmapCreateWithoutCreatorInput[] | Prisma.RoadmapUncheckedCreateWithoutCreatorInput[]
  connectOrCreate?: Prisma.RoadmapCreateOrConnectWithoutCreatorInput | Prisma.RoadmapCreateOrConnectWithoutCreatorInput[]
  createMany?: Prisma.RoadmapCreateManyCreatorInputEnvelope
  connect?: Prisma.RoadmapWhereUniqueInput | Prisma.RoadmapWhereUniqueInput[]
}

export type RoadmapUpdateManyWithoutCreatorNestedInput = {
  create?: Prisma.XOR<Prisma.RoadmapCreateWithoutCreatorInput, Prisma.RoadmapUncheckedCreateWithoutCreatorInput> | Prisma.RoadmapCreateWithoutCreatorInput[] | Prisma.RoadmapUncheckedCreateWithoutCreatorInput[]
  connectOrCreate?: Prisma.RoadmapCreateOrConnectWithoutCreatorInput | Prisma.RoadmapCreateOrConnectWithoutCreatorInput[]
  upsert?: Prisma.RoadmapUpsertWithWhereUniqueWithoutCreatorInput | Prisma.RoadmapUpsertWithWhereUniqueWithoutCreatorInput[]
  createMany?: Prisma.RoadmapCreateManyCreatorInputEnvelope
  set?: Prisma.RoadmapWhereUniqueInput | Prisma.RoadmapWhereUniqueInput[]
  disconnect?: Prisma.RoadmapWhereUniqueInput | Prisma.RoadmapWhereUniqueInput[]
  delete?: Prisma.RoadmapWhereUniqueInput | Prisma.RoadmapWhereUniqueInput[]
  connect?: Prisma.RoadmapWhereUniqueInput | Prisma.RoadmapWhereUniqueInput[]
  update?: Prisma.RoadmapUpdateWithWhereUniqueWithoutCreatorInput | Prisma.RoadmapUpdateWithWhereUniqueWithoutCreatorInput[]
  updateMany?: Prisma.RoadmapUpdateManyWithWhereWithoutCreatorInput | Prisma.RoadmapUpdateManyWithWhereWithoutCreatorInput[]
  deleteMany?: Prisma.RoadmapScalarWhereInput | Prisma.RoadmapScalarWhereInput[]
}

export type RoadmapUncheckedUpdateManyWithoutCreatorNestedInput = {
  create?: Prisma.XOR<Prisma.RoadmapCreateWithoutCreatorInput, Prisma.RoadmapUncheckedCreateWithoutCreatorInput> | Prisma.RoadmapCreateWithoutCreatorInput[] | Prisma.RoadmapUncheckedCreateWithoutCreatorInput[]
  connectOrCreate?: Prisma.RoadmapCreateOrConnectWithoutCreatorInput | Prisma.RoadmapCreateOrConnectWithoutCreatorInput[]
  upsert?: Prisma.RoadmapUpsertWithWhereUniqueWithoutCreatorInput | Prisma.RoadmapUpsertWithWhereUniqueWithoutCreatorInput[]
  createMany?: Prisma.RoadmapCreateManyCreatorInputEnvelope
  set?: Prisma.RoadmapWhereUniqueInput | Prisma.RoadmapWhereUniqueInput[]
  disconnect?: Prisma.RoadmapWhereUniqueInput | Prisma.RoadmapWhereUniqueInput[]
  delete?: Prisma.RoadmapWhereUniqueInput | Prisma.RoadmapWhereUniqueInput[]
  connect?: Prisma.RoadmapWhereUniqueInput | Prisma.RoadmapWhereUniqueInput[]
  update?: Prisma.RoadmapUpdateWithWhereUniqueWithoutCreatorInput | Prisma.RoadmapUpdateWithWhereUniqueWithoutCreatorInput[]
  updateMany?: Prisma.RoadmapUpdateManyWithWhereWithoutCreatorInput | Prisma.RoadmapUpdateManyWithWhereWithoutCreatorInput[]
  deleteMany?: Prisma.RoadmapScalarWhereInput | Prisma.RoadmapScalarWhereInput[]
}

export type EnumStatusFieldUpdateOperationsInput = {
  set?: $Enums.Status
}

export type RoadmapCreateNestedOneWithoutModulesInput = {
  create?: Prisma.XOR<Prisma.RoadmapCreateWithoutModulesInput, Prisma.RoadmapUncheckedCreateWithoutModulesInput>
  connectOrCreate?: Prisma.RoadmapCreateOrConnectWithoutModulesInput
  connect?: Prisma.RoadmapWhereUniqueInput
}

export type RoadmapUpdateOneRequiredWithoutModulesNestedInput = {
  create?: Prisma.XOR<Prisma.RoadmapCreateWithoutModulesInput, Prisma.RoadmapUncheckedCreateWithoutModulesInput>
  connectOrCreate?: Prisma.RoadmapCreateOrConnectWithoutModulesInput
  upsert?: Prisma.RoadmapUpsertWithoutModulesInput
  connect?: Prisma.RoadmapWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.RoadmapUpdateToOneWithWhereWithoutModulesInput, Prisma.RoadmapUpdateWithoutModulesInput>, Prisma.RoadmapUncheckedUpdateWithoutModulesInput>
}

export type RoadmapCreateNestedOneWithoutCertificatesInput = {
  create?: Prisma.XOR<Prisma.RoadmapCreateWithoutCertificatesInput, Prisma.RoadmapUncheckedCreateWithoutCertificatesInput>
  connectOrCreate?: Prisma.RoadmapCreateOrConnectWithoutCertificatesInput
  connect?: Prisma.RoadmapWhereUniqueInput
}

export type RoadmapUpdateOneRequiredWithoutCertificatesNestedInput = {
  create?: Prisma.XOR<Prisma.RoadmapCreateWithoutCertificatesInput, Prisma.RoadmapUncheckedCreateWithoutCertificatesInput>
  connectOrCreate?: Prisma.RoadmapCreateOrConnectWithoutCertificatesInput
  upsert?: Prisma.RoadmapUpsertWithoutCertificatesInput
  connect?: Prisma.RoadmapWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.RoadmapUpdateToOneWithWhereWithoutCertificatesInput, Prisma.RoadmapUpdateWithoutCertificatesInput>, Prisma.RoadmapUncheckedUpdateWithoutCertificatesInput>
}

export type RoadmapCreateWithoutCreatorInput = {
  roadmap_id?: string
  title: string
  description?: string | null
  category: string
  image_url?: string | null
  status?: $Enums.Status
  created_at?: Date | string
  updated_at?: Date | string
  certificates?: Prisma.CertificateCreateNestedManyWithoutRoadmapInput
  modules?: Prisma.ModuleCreateNestedManyWithoutRoadmapInput
}

export type RoadmapUncheckedCreateWithoutCreatorInput = {
  roadmap_id?: string
  title: string
  description?: string | null
  category: string
  image_url?: string | null
  status?: $Enums.Status
  created_at?: Date | string
  updated_at?: Date | string
  certificates?: Prisma.CertificateUncheckedCreateNestedManyWithoutRoadmapInput
  modules?: Prisma.ModuleUncheckedCreateNestedManyWithoutRoadmapInput
}

export type RoadmapCreateOrConnectWithoutCreatorInput = {
  where: Prisma.RoadmapWhereUniqueInput
  create: Prisma.XOR<Prisma.RoadmapCreateWithoutCreatorInput, Prisma.RoadmapUncheckedCreateWithoutCreatorInput>
}

export type RoadmapCreateManyCreatorInputEnvelope = {
  data: Prisma.RoadmapCreateManyCreatorInput | Prisma.RoadmapCreateManyCreatorInput[]
  skipDuplicates?: boolean
}

export type RoadmapUpsertWithWhereUniqueWithoutCreatorInput = {
  where: Prisma.RoadmapWhereUniqueInput
  update: Prisma.XOR<Prisma.RoadmapUpdateWithoutCreatorInput, Prisma.RoadmapUncheckedUpdateWithoutCreatorInput>
  create: Prisma.XOR<Prisma.RoadmapCreateWithoutCreatorInput, Prisma.RoadmapUncheckedCreateWithoutCreatorInput>
}

export type RoadmapUpdateWithWhereUniqueWithoutCreatorInput = {
  where: Prisma.RoadmapWhereUniqueInput
  data: Prisma.XOR<Prisma.RoadmapUpdateWithoutCreatorInput, Prisma.RoadmapUncheckedUpdateWithoutCreatorInput>
}

export type RoadmapUpdateManyWithWhereWithoutCreatorInput = {
  where: Prisma.RoadmapScalarWhereInput
  data: Prisma.XOR<Prisma.RoadmapUpdateManyMutationInput, Prisma.RoadmapUncheckedUpdateManyWithoutCreatorInput>
}

export type RoadmapScalarWhereInput = {
  AND?: Prisma.RoadmapScalarWhereInput | Prisma.RoadmapScalarWhereInput[]
  OR?: Prisma.RoadmapScalarWhereInput[]
  NOT?: Prisma.RoadmapScalarWhereInput | Prisma.RoadmapScalarWhereInput[]
  roadmap_id?: Prisma.StringFilter<"Roadmap"> | string
  title?: Prisma.StringFilter<"Roadmap"> | string
  description?: Prisma.StringNullableFilter<"Roadmap"> | string | null
  category?: Prisma.StringFilter<"Roadmap"> | string
  image_url?: Prisma.StringNullableFilter<"Roadmap"> | string | null
  created_by?: Prisma.StringFilter<"Roadmap"> | string
  status?: Prisma.EnumStatusFilter<"Roadmap"> | $Enums.Status
  created_at?: Prisma.DateTimeFilter<"Roadmap"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"Roadmap"> | Date | string
}

export type RoadmapCreateWithoutModulesInput = {
  roadmap_id?: string
  title: string
  description?: string | null
  category: string
  image_url?: string | null
  status?: $Enums.Status
  created_at?: Date | string
  updated_at?: Date | string
  certificates?: Prisma.CertificateCreateNestedManyWithoutRoadmapInput
  creator: Prisma.UserCreateNestedOneWithoutRoadmapsInput
}

export type RoadmapUncheckedCreateWithoutModulesInput = {
  roadmap_id?: string
  title: string
  description?: string | null
  category: string
  image_url?: string | null
  created_by: string
  status?: $Enums.Status
  created_at?: Date | string
  updated_at?: Date | string
  certificates?: Prisma.CertificateUncheckedCreateNestedManyWithoutRoadmapInput
}

export type RoadmapCreateOrConnectWithoutModulesInput = {
  where: Prisma.RoadmapWhereUniqueInput
  create: Prisma.XOR<Prisma.RoadmapCreateWithoutModulesInput, Prisma.RoadmapUncheckedCreateWithoutModulesInput>
}

export type RoadmapUpsertWithoutModulesInput = {
  update: Prisma.XOR<Prisma.RoadmapUpdateWithoutModulesInput, Prisma.RoadmapUncheckedUpdateWithoutModulesInput>
  create: Prisma.XOR<Prisma.RoadmapCreateWithoutModulesInput, Prisma.RoadmapUncheckedCreateWithoutModulesInput>
  where?: Prisma.RoadmapWhereInput
}

export type RoadmapUpdateToOneWithWhereWithoutModulesInput = {
  where?: Prisma.RoadmapWhereInput
  data: Prisma.XOR<Prisma.RoadmapUpdateWithoutModulesInput, Prisma.RoadmapUncheckedUpdateWithoutModulesInput>
}

export type RoadmapUpdateWithoutModulesInput = {
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  category?: Prisma.StringFieldUpdateOperationsInput | string
  image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  certificates?: Prisma.CertificateUpdateManyWithoutRoadmapNestedInput
  creator?: Prisma.UserUpdateOneRequiredWithoutRoadmapsNestedInput
}

export type RoadmapUncheckedUpdateWithoutModulesInput = {
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  category?: Prisma.StringFieldUpdateOperationsInput | string
  image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_by?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  certificates?: Prisma.CertificateUncheckedUpdateManyWithoutRoadmapNestedInput
}

export type RoadmapCreateWithoutCertificatesInput = {
  roadmap_id?: string
  title: string
  description?: string | null
  category: string
  image_url?: string | null
  status?: $Enums.Status
  created_at?: Date | string
  updated_at?: Date | string
  modules?: Prisma.ModuleCreateNestedManyWithoutRoadmapInput
  creator: Prisma.UserCreateNestedOneWithoutRoadmapsInput
}

export type RoadmapUncheckedCreateWithoutCertificatesInput = {
  roadmap_id?: string
  title: string
  description?: string | null
  category: string
  image_url?: string | null
  created_by: string
  status?: $Enums.Status
  created_at?: Date | string
  updated_at?: Date | string
  modules?: Prisma.ModuleUncheckedCreateNestedManyWithoutRoadmapInput
}

export type RoadmapCreateOrConnectWithoutCertificatesInput = {
  where: Prisma.RoadmapWhereUniqueInput
  create: Prisma.XOR<Prisma.RoadmapCreateWithoutCertificatesInput, Prisma.RoadmapUncheckedCreateWithoutCertificatesInput>
}

export type RoadmapUpsertWithoutCertificatesInput = {
  update: Prisma.XOR<Prisma.RoadmapUpdateWithoutCertificatesInput, Prisma.RoadmapUncheckedUpdateWithoutCertificatesInput>
  create: Prisma.XOR<Prisma.RoadmapCreateWithoutCertificatesInput, Prisma.RoadmapUncheckedCreateWithoutCertificatesInput>
  where?: Prisma.RoadmapWhereInput
}

export type RoadmapUpdateToOneWithWhereWithoutCertificatesInput = {
  where?: Prisma.RoadmapWhereInput
  data: Prisma.XOR<Prisma.RoadmapUpdateWithoutCertificatesInput, Prisma.RoadmapUncheckedUpdateWithoutCertificatesInput>
}

export type RoadmapUpdateWithoutCertificatesInput = {
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  category?: Prisma.StringFieldUpdateOperationsInput | string
  image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  modules?: Prisma.ModuleUpdateManyWithoutRoadmapNestedInput
  creator?: Prisma.UserUpdateOneRequiredWithoutRoadmapsNestedInput
}

export type RoadmapUncheckedUpdateWithoutCertificatesInput = {
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  category?: Prisma.StringFieldUpdateOperationsInput | string
  image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_by?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  modules?: Prisma.ModuleUncheckedUpdateManyWithoutRoadmapNestedInput
}

export type RoadmapCreateManyCreatorInput = {
  roadmap_id?: string
  title: string
  description?: string | null
  category: string
  image_url?: string | null
  status?: $Enums.Status
  created_at?: Date | string
  updated_at?: Date | string
}

export type RoadmapUpdateWithoutCreatorInput = {
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  category?: Prisma.StringFieldUpdateOperationsInput | string
  image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  certificates?: Prisma.CertificateUpdateManyWithoutRoadmapNestedInput
  modules?: Prisma.ModuleUpdateManyWithoutRoadmapNestedInput
}

export type RoadmapUncheckedUpdateWithoutCreatorInput = {
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  category?: Prisma.StringFieldUpdateOperationsInput | string
  image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  certificates?: Prisma.CertificateUncheckedUpdateManyWithoutRoadmapNestedInput
  modules?: Prisma.ModuleUncheckedUpdateManyWithoutRoadmapNestedInput
}

export type RoadmapUncheckedUpdateManyWithoutCreatorInput = {
  roadmap_id?: Prisma.StringFieldUpdateOperationsInput | string
  title?: Prisma.StringFieldUpdateOperationsInput | string
  description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  category?: Prisma.StringFieldUpdateOperationsInput | string
  image_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  status?: Prisma.EnumStatusFieldUpdateOperationsInput | $Enums.Status
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}


/**
 * Count Type RoadmapCountOutputType
 */

export type RoadmapCountOutputType = {
  certificates: number
  modules: number
}

export type RoadmapCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  certificates?: boolean | RoadmapCountOutputTypeCountCertificatesArgs
  modules?: boolean | RoadmapCountOutputTypeCountModulesArgs
}

/**
 * RoadmapCountOutputType without action
 */
export type RoadmapCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the RoadmapCountOutputType
   */
  select?: Prisma.RoadmapCountOutputTypeSelect<ExtArgs> | null
}

/**
 * RoadmapCountOutputType without action
 */
export type RoadmapCountOutputTypeCountCertificatesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.CertificateWhereInput
}

/**
 * RoadmapCountOutputType without action
 */
export type RoadmapCountOutputTypeCountModulesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.ModuleWhereInput
}


export type RoadmapSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  roadmap_id?: boolean
  title?: boolean
  description?: boolean
  category?: boolean
  image_url?: boolean
  created_by?: boolean
  status?: boolean
  created_at?: boolean
  updated_at?: boolean
  certificates?: boolean | Prisma.Roadmap$certificatesArgs<ExtArgs>
  modules?: boolean | Prisma.Roadmap$modulesArgs<ExtArgs>
  creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>
  _count?: boolean | Prisma.RoadmapCountOutputTypeDefaultArgs<ExtArgs>
}, ExtArgs["result"]["roadmap"]>



export type RoadmapSelectScalar = {
  roadmap_id?: boolean
  title?: boolean
  description?: boolean
  category?: boolean
  image_url?: boolean
  created_by?: boolean
  status?: boolean
  created_at?: boolean
  updated_at?: boolean
}

export type RoadmapOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"roadmap_id" | "title" | "description" | "category" | "image_url" | "created_by" | "status" | "created_at" | "updated_at", ExtArgs["result"]["roadmap"]>
export type RoadmapInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  certificates?: boolean | Prisma.Roadmap$certificatesArgs<ExtArgs>
  modules?: boolean | Prisma.Roadmap$modulesArgs<ExtArgs>
  creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>
  _count?: boolean | Prisma.RoadmapCountOutputTypeDefaultArgs<ExtArgs>
}

export type $RoadmapPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "Roadmap"
  objects: {
    certificates: Prisma.$CertificatePayload<ExtArgs>[]
    modules: Prisma.$ModulePayload<ExtArgs>[]
    creator: Prisma.$UserPayload<ExtArgs>
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    roadmap_id: string
    title: string
    description: string | null
    category: string
    image_url: string | null
    created_by: string
    status: $Enums.Status
    created_at: Date
    updated_at: Date
  }, ExtArgs["result"]["roadmap"]>
  composites: {}
}

export type RoadmapGetPayload<S extends boolean | null | undefined | RoadmapDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RoadmapPayload, S>

export type RoadmapCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<RoadmapFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RoadmapCountAggregateInputType | true
  }

export interface RoadmapDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Roadmap'], meta: { name: 'Roadmap' } }
  /**
   * Find zero or one Roadmap that matches the filter.
   * @param {RoadmapFindUniqueArgs} args - Arguments to find a Roadmap
   * @example
   * // Get one Roadmap
   * const roadmap = await prisma.roadmap.findUnique({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUnique<T extends RoadmapFindUniqueArgs>(args: Prisma.SelectSubset<T, RoadmapFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RoadmapClient<runtime.Types.Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find one Roadmap that matches the filter or throw an error with `error.code='P2025'`
   * if no matches were found.
   * @param {RoadmapFindUniqueOrThrowArgs} args - Arguments to find a Roadmap
   * @example
   * // Get one Roadmap
   * const roadmap = await prisma.roadmap.findUniqueOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUniqueOrThrow<T extends RoadmapFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RoadmapFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoadmapClient<runtime.Types.Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first Roadmap that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {RoadmapFindFirstArgs} args - Arguments to find a Roadmap
   * @example
   * // Get one Roadmap
   * const roadmap = await prisma.roadmap.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends RoadmapFindFirstArgs>(args?: Prisma.SelectSubset<T, RoadmapFindFirstArgs<ExtArgs>>): Prisma.Prisma__RoadmapClient<runtime.Types.Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first Roadmap that matches the filter or
   * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {RoadmapFindFirstOrThrowArgs} args - Arguments to find a Roadmap
   * @example
   * // Get one Roadmap
   * const roadmap = await prisma.roadmap.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends RoadmapFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RoadmapFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoadmapClient<runtime.Types.Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find zero or more Roadmaps that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {RoadmapFindManyArgs} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Roadmaps
   * const roadmaps = await prisma.roadmap.findMany()
   * 
   * // Get first 10 Roadmaps
   * const roadmaps = await prisma.roadmap.findMany({ take: 10 })
   * 
   * // Only select the `roadmap_id`
   * const roadmapWithRoadmap_idOnly = await prisma.roadmap.findMany({ select: { roadmap_id: true } })
   * 
   */
  findMany<T extends RoadmapFindManyArgs>(args?: Prisma.SelectSubset<T, RoadmapFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  /**
   * Create a Roadmap.
   * @param {RoadmapCreateArgs} args - Arguments to create a Roadmap.
   * @example
   * // Create one Roadmap
   * const Roadmap = await prisma.roadmap.create({
   *   data: {
   *     // ... data to create a Roadmap
   *   }
   * })
   * 
   */
  create<T extends RoadmapCreateArgs>(args: Prisma.SelectSubset<T, RoadmapCreateArgs<ExtArgs>>): Prisma.Prisma__RoadmapClient<runtime.Types.Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Create many Roadmaps.
   * @param {RoadmapCreateManyArgs} args - Arguments to create many Roadmaps.
   * @example
   * // Create many Roadmaps
   * const roadmap = await prisma.roadmap.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   *     
   */
  createMany<T extends RoadmapCreateManyArgs>(args?: Prisma.SelectSubset<T, RoadmapCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Delete a Roadmap.
   * @param {RoadmapDeleteArgs} args - Arguments to delete one Roadmap.
   * @example
   * // Delete one Roadmap
   * const Roadmap = await prisma.roadmap.delete({
   *   where: {
   *     // ... filter to delete one Roadmap
   *   }
   * })
   * 
   */
  delete<T extends RoadmapDeleteArgs>(args: Prisma.SelectSubset<T, RoadmapDeleteArgs<ExtArgs>>): Prisma.Prisma__RoadmapClient<runtime.Types.Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Update one Roadmap.
   * @param {RoadmapUpdateArgs} args - Arguments to update one Roadmap.
   * @example
   * // Update one Roadmap
   * const roadmap = await prisma.roadmap.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends RoadmapUpdateArgs>(args: Prisma.SelectSubset<T, RoadmapUpdateArgs<ExtArgs>>): Prisma.Prisma__RoadmapClient<runtime.Types.Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Delete zero or more Roadmaps.
   * @param {RoadmapDeleteManyArgs} args - Arguments to filter Roadmaps to delete.
   * @example
   * // Delete a few Roadmaps
   * const { count } = await prisma.roadmap.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany<T extends RoadmapDeleteManyArgs>(args?: Prisma.SelectSubset<T, RoadmapDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Update zero or more Roadmaps.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {RoadmapUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Roadmaps
   * const roadmap = await prisma.roadmap.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany<T extends RoadmapUpdateManyArgs>(args: Prisma.SelectSubset<T, RoadmapUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Create or update one Roadmap.
   * @param {RoadmapUpsertArgs} args - Arguments to update or create a Roadmap.
   * @example
   * // Update or create a Roadmap
   * const roadmap = await prisma.roadmap.upsert({
   *   create: {
   *     // ... data to create a Roadmap
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Roadmap we want to update
   *   }
   * })
   */
  upsert<T extends RoadmapUpsertArgs>(args: Prisma.SelectSubset<T, RoadmapUpsertArgs<ExtArgs>>): Prisma.Prisma__RoadmapClient<runtime.Types.Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


  /**
   * Count the number of Roadmaps.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {RoadmapCountArgs} args - Arguments to filter Roadmaps to count.
   * @example
   * // Count the number of Roadmaps
   * const count = await prisma.roadmap.count({
   *   where: {
   *     // ... the filter for the Roadmaps we want to count
   *   }
   * })
  **/
  count<T extends RoadmapCountArgs>(
    args?: Prisma.Subset<T, RoadmapCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], RoadmapCountAggregateOutputType>
      : number
  >

  /**
   * Allows you to perform aggregations operations on a Roadmap.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {RoadmapAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Ordered by age ascending
   * // Where email contains prisma.io
   * // Limited to the 10 users
   * const aggregations = await prisma.user.aggregate({
   *   _avg: {
   *     age: true,
   *   },
   *   where: {
   *     email: {
   *       contains: "prisma.io",
   *     },
   *   },
   *   orderBy: {
   *     age: "asc",
   *   },
   *   take: 10,
   * })
  **/
  aggregate<T extends RoadmapAggregateArgs>(args: Prisma.Subset<T, RoadmapAggregateArgs>): Prisma.PrismaPromise<GetRoadmapAggregateType<T>>

  /**
   * Group by Roadmap.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {RoadmapGroupByArgs} args - Group by arguments.
   * @example
   * // Group by city, order by createdAt, get count
   * const result = await prisma.user.groupBy({
   *   by: ['city', 'createdAt'],
   *   orderBy: {
   *     createdAt: true
   *   },
   *   _count: {
   *     _all: true
   *   },
   * })
   * 
  **/
  groupBy<
    T extends RoadmapGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: RoadmapGroupByArgs['orderBy'] }
      : { orderBy?: RoadmapGroupByArgs['orderBy'] },
    OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>,
    ByFields extends Prisma.MaybeTupleToUnion<T['by']>,
    ByValid extends Prisma.Has<ByFields, OrderFields>,
    HavingFields extends Prisma.GetHavingFields<T['having']>,
    HavingValid extends Prisma.Has<ByFields, HavingFields>,
    ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False,
    InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
          ? never
          : P extends string
          ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
          : [
              Error,
              'Field ',
              P,
              ` in "having" needs to be provided in "by"`,
            ]
      }[HavingFields]
    : 'take' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
          ? never
          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
      }[OrderFields]
  >(args: Prisma.SubsetIntersection<T, RoadmapGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadmapGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
/**
 * Fields of the Roadmap model
 */
readonly fields: RoadmapFieldRefs;
}

/**
 * The delegate class that acts as a "Promise-like" for Roadmap.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__RoadmapClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  certificates<T extends Prisma.Roadmap$certificatesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Roadmap$certificatesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  modules<T extends Prisma.Roadmap$modulesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Roadmap$modulesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  creator<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}




/**
 * Fields of the Roadmap model
 */
export interface RoadmapFieldRefs {
  readonly roadmap_id: Prisma.FieldRef<"Roadmap", 'String'>
  readonly title: Prisma.FieldRef<"Roadmap", 'String'>
  readonly description: Prisma.FieldRef<"Roadmap", 'String'>
  readonly category: Prisma.FieldRef<"Roadmap", 'String'>
  readonly image_url: Prisma.FieldRef<"Roadmap", 'String'>
  readonly created_by: Prisma.FieldRef<"Roadmap", 'String'>
  readonly status: Prisma.FieldRef<"Roadmap", 'Status'>
  readonly created_at: Prisma.FieldRef<"Roadmap", 'DateTime'>
  readonly updated_at: Prisma.FieldRef<"Roadmap", 'DateTime'>
}
    

// Custom InputTypes
/**
 * Roadmap findUnique
 */
export type RoadmapFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Roadmap
   */
  select?: Prisma.RoadmapSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Roadmap
   */
  omit?: Prisma.RoadmapOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.RoadmapInclude<ExtArgs> | null
  /**
   * Filter, which Roadmap to fetch.
   */
  where: Prisma.RoadmapWhereUniqueInput
}

/**
 * Roadmap findUniqueOrThrow
 */
export type RoadmapFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Roadmap
   */
  select?: Prisma.RoadmapSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Roadmap
   */
  omit?: Prisma.RoadmapOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.RoadmapInclude<ExtArgs> | null
  /**
   * Filter, which Roadmap to fetch.
   */
  where: Prisma.RoadmapWhereUniqueInput
}

/**
 * Roadmap findFirst
 */
export type RoadmapFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Roadmap
   */
  select?: Prisma.RoadmapSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Roadmap
   */
  omit?: Prisma.RoadmapOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.RoadmapInclude<ExtArgs> | null
  /**
   * Filter, which Roadmap to fetch.
   */
  where?: Prisma.RoadmapWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Roadmaps to fetch.
   */
  orderBy?: Prisma.RoadmapOrderByWithRelationInput | Prisma.RoadmapOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for Roadmaps.
   */
  cursor?: Prisma.RoadmapWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Roadmaps from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Roadmaps.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of Roadmaps.
   */
  distinct?: Prisma.RoadmapScalarFieldEnum | Prisma.RoadmapScalarFieldEnum[]
}

/**
 * Roadmap findFirstOrThrow
 */
export type RoadmapFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Roadmap
   */
  select?: Prisma.RoadmapSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Roadmap
   */
  omit?: Prisma.RoadmapOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.RoadmapInclude<ExtArgs> | null
  /**
   * Filter, which Roadmap to fetch.
   */
  where?: Prisma.RoadmapWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Roadmaps to fetch.
   */
  orderBy?: Prisma.RoadmapOrderByWithRelationInput | Prisma.RoadmapOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for Roadmaps.
   */
  cursor?: Prisma.RoadmapWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Roadmaps from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Roadmaps.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of Roadmaps.
   */
  distinct?: Prisma.RoadmapScalarFieldEnum | Prisma.RoadmapScalarFieldEnum[]
}

/**
 * Roadmap findMany
 */
export type RoadmapFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Roadmap
   */
  select?: Prisma.RoadmapSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Roadmap
   */
  omit?: Prisma.RoadmapOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.RoadmapInclude<ExtArgs> | null
  /**
   * Filter, which Roadmaps to fetch.
   */
  where?: Prisma.RoadmapWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Roadmaps to fetch.
   */
  orderBy?: Prisma.RoadmapOrderByWithRelationInput | Prisma.RoadmapOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for listing Roadmaps.
   */
  cursor?: Prisma.RoadmapWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Roadmaps from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Roadmaps.
   */
  skip?: number
  distinct?: Prisma.RoadmapScalarFieldEnum | Prisma.RoadmapScalarFieldEnum[]
}

/**
 * Roadmap create
 */
export type RoadmapCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Roadmap
   */
  select?: Prisma.RoadmapSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Roadmap
   */
  omit?: Prisma.RoadmapOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.RoadmapInclude<ExtArgs> | null
  /**
   * The data needed to create a Roadmap.
   */
  data: Prisma.XOR<Prisma.RoadmapCreateInput, Prisma.RoadmapUncheckedCreateInput>
}

/**
 * Roadmap createMany
 */
export type RoadmapCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to create many Roadmaps.
   */
  data: Prisma.RoadmapCreateManyInput | Prisma.RoadmapCreateManyInput[]
  skipDuplicates?: boolean
}

/**
 * Roadmap update
 */
export type RoadmapUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Roadmap
   */
  select?: Prisma.RoadmapSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Roadmap
   */
  omit?: Prisma.RoadmapOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.RoadmapInclude<ExtArgs> | null
  /**
   * The data needed to update a Roadmap.
   */
  data: Prisma.XOR<Prisma.RoadmapUpdateInput, Prisma.RoadmapUncheckedUpdateInput>
  /**
   * Choose, which Roadmap to update.
   */
  where: Prisma.RoadmapWhereUniqueInput
}

/**
 * Roadmap updateMany
 */
export type RoadmapUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to update Roadmaps.
   */
  data: Prisma.XOR<Prisma.RoadmapUpdateManyMutationInput, Prisma.RoadmapUncheckedUpdateManyInput>
  /**
   * Filter which Roadmaps to update
   */
  where?: Prisma.RoadmapWhereInput
  /**
   * Limit how many Roadmaps to update.
   */
  limit?: number
}

/**
 * Roadmap upsert
 */
export type RoadmapUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Roadmap
   */
  select?: Prisma.RoadmapSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Roadmap
   */
  omit?: Prisma.RoadmapOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.RoadmapInclude<ExtArgs> | null
  /**
   * The filter to search for the Roadmap to update in case it exists.
   */
  where: Prisma.RoadmapWhereUniqueInput
  /**
   * In case the Roadmap found by the `where` argument doesn't exist, create a new Roadmap with this data.
   */
  create: Prisma.XOR<Prisma.RoadmapCreateInput, Prisma.RoadmapUncheckedCreateInput>
  /**
   * In case the Roadmap was found with the provided `where` argument, update it with this data.
   */
  update: Prisma.XOR<Prisma.RoadmapUpdateInput, Prisma.RoadmapUncheckedUpdateInput>
}

/**
 * Roadmap delete
 */
export type RoadmapDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Roadmap
   */
  select?: Prisma.RoadmapSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Roadmap
   */
  omit?: Prisma.RoadmapOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.RoadmapInclude<ExtArgs> | null
  /**
   * Filter which Roadmap to delete.
   */
  where: Prisma.RoadmapWhereUniqueInput
}

/**
 * Roadmap deleteMany
 */
export type RoadmapDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which Roadmaps to delete
   */
  where?: Prisma.RoadmapWhereInput
  /**
   * Limit how many Roadmaps to delete.
   */
  limit?: number
}

/**
 * Roadmap.certificates
 */
export type Roadmap$certificatesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Certificate
   */
  select?: Prisma.CertificateSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Certificate
   */
  omit?: Prisma.CertificateOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CertificateInclude<ExtArgs> | null
  where?: Prisma.CertificateWhereInput
  orderBy?: Prisma.CertificateOrderByWithRelationInput | Prisma.CertificateOrderByWithRelationInput[]
  cursor?: Prisma.CertificateWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.CertificateScalarFieldEnum | Prisma.CertificateScalarFieldEnum[]
}

/**
 * Roadmap.modules
 */
export type Roadmap$modulesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Module
   */
  select?: Prisma.ModuleSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Module
   */
  omit?: Prisma.ModuleOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ModuleInclude<ExtArgs> | null
  where?: Prisma.ModuleWhereInput
  orderBy?: Prisma.ModuleOrderByWithRelationInput | Prisma.ModuleOrderByWithRelationInput[]
  cursor?: Prisma.ModuleWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.ModuleScalarFieldEnum | Prisma.ModuleScalarFieldEnum[]
}

/**
 * Roadmap without action
 */
export type RoadmapDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Roadmap
   */
  select?: Prisma.RoadmapSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Roadmap
   */
  omit?: Prisma.RoadmapOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.RoadmapInclude<ExtArgs> | null
}

```

## File: src/generated/prisma/models/User.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file exports the `User` model and its related types.
 *
 * 🟢 You can import this file directly.
 */
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"

/**
 * Model User
 * 
 */
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>

export type AggregateUser = {
  _count: UserCountAggregateOutputType | null
  _min: UserMinAggregateOutputType | null
  _max: UserMaxAggregateOutputType | null
}

export type UserMinAggregateOutputType = {
  user_id: string | null
  email: string | null
  password_hash: string | null
  full_name: string | null
  current_level: $Enums.Level | null
  role: $Enums.Role | null
  avatar_url: string | null
  created_at: Date | null
  updated_at: Date | null
}

export type UserMaxAggregateOutputType = {
  user_id: string | null
  email: string | null
  password_hash: string | null
  full_name: string | null
  current_level: $Enums.Level | null
  role: $Enums.Role | null
  avatar_url: string | null
  created_at: Date | null
  updated_at: Date | null
}

export type UserCountAggregateOutputType = {
  user_id: number
  email: number
  password_hash: number
  full_name: number
  current_level: number
  role: number
  avatar_url: number
  created_at: number
  updated_at: number
  _all: number
}


export type UserMinAggregateInputType = {
  user_id?: true
  email?: true
  password_hash?: true
  full_name?: true
  current_level?: true
  role?: true
  avatar_url?: true
  created_at?: true
  updated_at?: true
}

export type UserMaxAggregateInputType = {
  user_id?: true
  email?: true
  password_hash?: true
  full_name?: true
  current_level?: true
  role?: true
  avatar_url?: true
  created_at?: true
  updated_at?: true
}

export type UserCountAggregateInputType = {
  user_id?: true
  email?: true
  password_hash?: true
  full_name?: true
  current_level?: true
  role?: true
  avatar_url?: true
  created_at?: true
  updated_at?: true
  _all?: true
}

export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which User to aggregate.
   */
  where?: Prisma.UserWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Users to fetch.
   */
  orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the start position
   */
  cursor?: Prisma.UserWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Users from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Users.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Count returned Users
  **/
  _count?: true | UserCountAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the minimum value
  **/
  _min?: UserMinAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the maximum value
  **/
  _max?: UserMaxAggregateInputType
}

export type GetUserAggregateType<T extends UserAggregateArgs> = {
      [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateUser[P]>
    : Prisma.GetScalarType<T[P], AggregateUser[P]>
}




export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.UserWhereInput
  orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[]
  by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum
  having?: Prisma.UserScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: UserCountAggregateInputType | true
  _min?: UserMinAggregateInputType
  _max?: UserMaxAggregateInputType
}

export type UserGroupByOutputType = {
  user_id: string
  email: string
  password_hash: string
  full_name: string
  current_level: $Enums.Level
  role: $Enums.Role
  avatar_url: string | null
  created_at: Date
  updated_at: Date
  _count: UserCountAggregateOutputType | null
  _min: UserMinAggregateOutputType | null
  _max: UserMaxAggregateOutputType | null
}

type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<UserGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>
      }
    >
  >



export type UserWhereInput = {
  AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[]
  OR?: Prisma.UserWhereInput[]
  NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[]
  user_id?: Prisma.StringFilter<"User"> | string
  email?: Prisma.StringFilter<"User"> | string
  password_hash?: Prisma.StringFilter<"User"> | string
  full_name?: Prisma.StringFilter<"User"> | string
  current_level?: Prisma.EnumLevelFilter<"User"> | $Enums.Level
  role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role
  avatar_url?: Prisma.StringNullableFilter<"User"> | string | null
  created_at?: Prisma.DateTimeFilter<"User"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"User"> | Date | string
  aiNotes?: Prisma.AINoteListRelationFilter
  cvs?: Prisma.CVListRelationFilter
  certificates?: Prisma.CertificateListRelationFilter
  interviewSessions?: Prisma.InterviewSessionListRelationFilter
  learningEvents?: Prisma.LearningEventListRelationFilter
  roadmaps?: Prisma.RoadmapListRelationFilter
  progress?: Prisma.UserProgressListRelationFilter
  exerciseSubmissions?: Prisma.ExerciseSubmissionListRelationFilter
}

export type UserOrderByWithRelationInput = {
  user_id?: Prisma.SortOrder
  email?: Prisma.SortOrder
  password_hash?: Prisma.SortOrder
  full_name?: Prisma.SortOrder
  current_level?: Prisma.SortOrder
  role?: Prisma.SortOrder
  avatar_url?: Prisma.SortOrderInput | Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
  aiNotes?: Prisma.AINoteOrderByRelationAggregateInput
  cvs?: Prisma.CVOrderByRelationAggregateInput
  certificates?: Prisma.CertificateOrderByRelationAggregateInput
  interviewSessions?: Prisma.InterviewSessionOrderByRelationAggregateInput
  learningEvents?: Prisma.LearningEventOrderByRelationAggregateInput
  roadmaps?: Prisma.RoadmapOrderByRelationAggregateInput
  progress?: Prisma.UserProgressOrderByRelationAggregateInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionOrderByRelationAggregateInput
  _relevance?: Prisma.UserOrderByRelevanceInput
}

export type UserWhereUniqueInput = Prisma.AtLeast<{
  user_id?: string
  email?: string
  AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[]
  OR?: Prisma.UserWhereInput[]
  NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[]
  password_hash?: Prisma.StringFilter<"User"> | string
  full_name?: Prisma.StringFilter<"User"> | string
  current_level?: Prisma.EnumLevelFilter<"User"> | $Enums.Level
  role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role
  avatar_url?: Prisma.StringNullableFilter<"User"> | string | null
  created_at?: Prisma.DateTimeFilter<"User"> | Date | string
  updated_at?: Prisma.DateTimeFilter<"User"> | Date | string
  aiNotes?: Prisma.AINoteListRelationFilter
  cvs?: Prisma.CVListRelationFilter
  certificates?: Prisma.CertificateListRelationFilter
  interviewSessions?: Prisma.InterviewSessionListRelationFilter
  learningEvents?: Prisma.LearningEventListRelationFilter
  roadmaps?: Prisma.RoadmapListRelationFilter
  progress?: Prisma.UserProgressListRelationFilter
  exerciseSubmissions?: Prisma.ExerciseSubmissionListRelationFilter
}, "user_id" | "email">

export type UserOrderByWithAggregationInput = {
  user_id?: Prisma.SortOrder
  email?: Prisma.SortOrder
  password_hash?: Prisma.SortOrder
  full_name?: Prisma.SortOrder
  current_level?: Prisma.SortOrder
  role?: Prisma.SortOrder
  avatar_url?: Prisma.SortOrderInput | Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
  _count?: Prisma.UserCountOrderByAggregateInput
  _max?: Prisma.UserMaxOrderByAggregateInput
  _min?: Prisma.UserMinOrderByAggregateInput
}

export type UserScalarWhereWithAggregatesInput = {
  AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[]
  OR?: Prisma.UserScalarWhereWithAggregatesInput[]
  NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[]
  user_id?: Prisma.StringWithAggregatesFilter<"User"> | string
  email?: Prisma.StringWithAggregatesFilter<"User"> | string
  password_hash?: Prisma.StringWithAggregatesFilter<"User"> | string
  full_name?: Prisma.StringWithAggregatesFilter<"User"> | string
  current_level?: Prisma.EnumLevelWithAggregatesFilter<"User"> | $Enums.Level
  role?: Prisma.EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
  avatar_url?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null
  created_at?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string
  updated_at?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string
}

export type UserCreateInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionCreateNestedManyWithoutUserInput
}

export type UserUncheckedCreateInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteUncheckedCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVUncheckedCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateUncheckedCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionUncheckedCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventUncheckedCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapUncheckedCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedCreateNestedManyWithoutUserInput
}

export type UserUpdateInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUpdateManyWithoutUserNestedInput
}

export type UserUncheckedUpdateInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUncheckedUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUncheckedUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUncheckedUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUncheckedUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUncheckedUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUncheckedUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedUpdateManyWithoutUserNestedInput
}

export type UserCreateManyInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
}

export type UserUpdateManyMutationInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type UserUncheckedUpdateManyInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type UserOrderByRelevanceInput = {
  fields: Prisma.UserOrderByRelevanceFieldEnum | Prisma.UserOrderByRelevanceFieldEnum[]
  sort: Prisma.SortOrder
  search: string
}

export type UserCountOrderByAggregateInput = {
  user_id?: Prisma.SortOrder
  email?: Prisma.SortOrder
  password_hash?: Prisma.SortOrder
  full_name?: Prisma.SortOrder
  current_level?: Prisma.SortOrder
  role?: Prisma.SortOrder
  avatar_url?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type UserMaxOrderByAggregateInput = {
  user_id?: Prisma.SortOrder
  email?: Prisma.SortOrder
  password_hash?: Prisma.SortOrder
  full_name?: Prisma.SortOrder
  current_level?: Prisma.SortOrder
  role?: Prisma.SortOrder
  avatar_url?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type UserMinOrderByAggregateInput = {
  user_id?: Prisma.SortOrder
  email?: Prisma.SortOrder
  password_hash?: Prisma.SortOrder
  full_name?: Prisma.SortOrder
  current_level?: Prisma.SortOrder
  role?: Prisma.SortOrder
  avatar_url?: Prisma.SortOrder
  created_at?: Prisma.SortOrder
  updated_at?: Prisma.SortOrder
}

export type UserScalarRelationFilter = {
  is?: Prisma.UserWhereInput
  isNot?: Prisma.UserWhereInput
}

export type StringFieldUpdateOperationsInput = {
  set?: string
}

export type EnumLevelFieldUpdateOperationsInput = {
  set?: $Enums.Level
}

export type EnumRoleFieldUpdateOperationsInput = {
  set?: $Enums.Role
}

export type NullableStringFieldUpdateOperationsInput = {
  set?: string | null
}

export type DateTimeFieldUpdateOperationsInput = {
  set?: Date | string
}

export type UserCreateNestedOneWithoutRoadmapsInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutRoadmapsInput, Prisma.UserUncheckedCreateWithoutRoadmapsInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutRoadmapsInput
  connect?: Prisma.UserWhereUniqueInput
}

export type UserUpdateOneRequiredWithoutRoadmapsNestedInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutRoadmapsInput, Prisma.UserUncheckedCreateWithoutRoadmapsInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutRoadmapsInput
  upsert?: Prisma.UserUpsertWithoutRoadmapsInput
  connect?: Prisma.UserWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutRoadmapsInput, Prisma.UserUpdateWithoutRoadmapsInput>, Prisma.UserUncheckedUpdateWithoutRoadmapsInput>
}

export type UserCreateNestedOneWithoutProgressInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutProgressInput, Prisma.UserUncheckedCreateWithoutProgressInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutProgressInput
  connect?: Prisma.UserWhereUniqueInput
}

export type UserUpdateOneRequiredWithoutProgressNestedInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutProgressInput, Prisma.UserUncheckedCreateWithoutProgressInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutProgressInput
  upsert?: Prisma.UserUpsertWithoutProgressInput
  connect?: Prisma.UserWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutProgressInput, Prisma.UserUpdateWithoutProgressInput>, Prisma.UserUncheckedUpdateWithoutProgressInput>
}

export type UserCreateNestedOneWithoutExerciseSubmissionsInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutExerciseSubmissionsInput, Prisma.UserUncheckedCreateWithoutExerciseSubmissionsInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutExerciseSubmissionsInput
  connect?: Prisma.UserWhereUniqueInput
}

export type UserUpdateOneRequiredWithoutExerciseSubmissionsNestedInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutExerciseSubmissionsInput, Prisma.UserUncheckedCreateWithoutExerciseSubmissionsInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutExerciseSubmissionsInput
  upsert?: Prisma.UserUpsertWithoutExerciseSubmissionsInput
  connect?: Prisma.UserWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutExerciseSubmissionsInput, Prisma.UserUpdateWithoutExerciseSubmissionsInput>, Prisma.UserUncheckedUpdateWithoutExerciseSubmissionsInput>
}

export type UserCreateNestedOneWithoutInterviewSessionsInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutInterviewSessionsInput, Prisma.UserUncheckedCreateWithoutInterviewSessionsInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutInterviewSessionsInput
  connect?: Prisma.UserWhereUniqueInput
}

export type UserUpdateOneRequiredWithoutInterviewSessionsNestedInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutInterviewSessionsInput, Prisma.UserUncheckedCreateWithoutInterviewSessionsInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutInterviewSessionsInput
  upsert?: Prisma.UserUpsertWithoutInterviewSessionsInput
  connect?: Prisma.UserWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutInterviewSessionsInput, Prisma.UserUpdateWithoutInterviewSessionsInput>, Prisma.UserUncheckedUpdateWithoutInterviewSessionsInput>
}

export type UserCreateNestedOneWithoutCvsInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutCvsInput, Prisma.UserUncheckedCreateWithoutCvsInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutCvsInput
  connect?: Prisma.UserWhereUniqueInput
}

export type UserUpdateOneRequiredWithoutCvsNestedInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutCvsInput, Prisma.UserUncheckedCreateWithoutCvsInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutCvsInput
  upsert?: Prisma.UserUpsertWithoutCvsInput
  connect?: Prisma.UserWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutCvsInput, Prisma.UserUpdateWithoutCvsInput>, Prisma.UserUncheckedUpdateWithoutCvsInput>
}

export type UserCreateNestedOneWithoutCertificatesInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutCertificatesInput, Prisma.UserUncheckedCreateWithoutCertificatesInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutCertificatesInput
  connect?: Prisma.UserWhereUniqueInput
}

export type UserUpdateOneRequiredWithoutCertificatesNestedInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutCertificatesInput, Prisma.UserUncheckedCreateWithoutCertificatesInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutCertificatesInput
  upsert?: Prisma.UserUpsertWithoutCertificatesInput
  connect?: Prisma.UserWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutCertificatesInput, Prisma.UserUpdateWithoutCertificatesInput>, Prisma.UserUncheckedUpdateWithoutCertificatesInput>
}

export type UserCreateNestedOneWithoutLearningEventsInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutLearningEventsInput, Prisma.UserUncheckedCreateWithoutLearningEventsInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutLearningEventsInput
  connect?: Prisma.UserWhereUniqueInput
}

export type UserUpdateOneRequiredWithoutLearningEventsNestedInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutLearningEventsInput, Prisma.UserUncheckedCreateWithoutLearningEventsInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutLearningEventsInput
  upsert?: Prisma.UserUpsertWithoutLearningEventsInput
  connect?: Prisma.UserWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutLearningEventsInput, Prisma.UserUpdateWithoutLearningEventsInput>, Prisma.UserUncheckedUpdateWithoutLearningEventsInput>
}

export type UserCreateNestedOneWithoutAiNotesInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutAiNotesInput, Prisma.UserUncheckedCreateWithoutAiNotesInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutAiNotesInput
  connect?: Prisma.UserWhereUniqueInput
}

export type UserUpdateOneRequiredWithoutAiNotesNestedInput = {
  create?: Prisma.XOR<Prisma.UserCreateWithoutAiNotesInput, Prisma.UserUncheckedCreateWithoutAiNotesInput>
  connectOrCreate?: Prisma.UserCreateOrConnectWithoutAiNotesInput
  upsert?: Prisma.UserUpsertWithoutAiNotesInput
  connect?: Prisma.UserWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutAiNotesInput, Prisma.UserUpdateWithoutAiNotesInput>, Prisma.UserUncheckedUpdateWithoutAiNotesInput>
}

export type UserCreateWithoutRoadmapsInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventCreateNestedManyWithoutUserInput
  progress?: Prisma.UserProgressCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionCreateNestedManyWithoutUserInput
}

export type UserUncheckedCreateWithoutRoadmapsInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteUncheckedCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVUncheckedCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateUncheckedCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionUncheckedCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventUncheckedCreateNestedManyWithoutUserInput
  progress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedCreateNestedManyWithoutUserInput
}

export type UserCreateOrConnectWithoutRoadmapsInput = {
  where: Prisma.UserWhereUniqueInput
  create: Prisma.XOR<Prisma.UserCreateWithoutRoadmapsInput, Prisma.UserUncheckedCreateWithoutRoadmapsInput>
}

export type UserUpsertWithoutRoadmapsInput = {
  update: Prisma.XOR<Prisma.UserUpdateWithoutRoadmapsInput, Prisma.UserUncheckedUpdateWithoutRoadmapsInput>
  create: Prisma.XOR<Prisma.UserCreateWithoutRoadmapsInput, Prisma.UserUncheckedCreateWithoutRoadmapsInput>
  where?: Prisma.UserWhereInput
}

export type UserUpdateToOneWithWhereWithoutRoadmapsInput = {
  where?: Prisma.UserWhereInput
  data: Prisma.XOR<Prisma.UserUpdateWithoutRoadmapsInput, Prisma.UserUncheckedUpdateWithoutRoadmapsInput>
}

export type UserUpdateWithoutRoadmapsInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUpdateManyWithoutUserNestedInput
  progress?: Prisma.UserProgressUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUpdateManyWithoutUserNestedInput
}

export type UserUncheckedUpdateWithoutRoadmapsInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUncheckedUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUncheckedUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUncheckedUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUncheckedUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUncheckedUpdateManyWithoutUserNestedInput
  progress?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedUpdateManyWithoutUserNestedInput
}

export type UserCreateWithoutProgressInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapCreateNestedManyWithoutCreatorInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionCreateNestedManyWithoutUserInput
}

export type UserUncheckedCreateWithoutProgressInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteUncheckedCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVUncheckedCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateUncheckedCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionUncheckedCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventUncheckedCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapUncheckedCreateNestedManyWithoutCreatorInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedCreateNestedManyWithoutUserInput
}

export type UserCreateOrConnectWithoutProgressInput = {
  where: Prisma.UserWhereUniqueInput
  create: Prisma.XOR<Prisma.UserCreateWithoutProgressInput, Prisma.UserUncheckedCreateWithoutProgressInput>
}

export type UserUpsertWithoutProgressInput = {
  update: Prisma.XOR<Prisma.UserUpdateWithoutProgressInput, Prisma.UserUncheckedUpdateWithoutProgressInput>
  create: Prisma.XOR<Prisma.UserCreateWithoutProgressInput, Prisma.UserUncheckedCreateWithoutProgressInput>
  where?: Prisma.UserWhereInput
}

export type UserUpdateToOneWithWhereWithoutProgressInput = {
  where?: Prisma.UserWhereInput
  data: Prisma.XOR<Prisma.UserUpdateWithoutProgressInput, Prisma.UserUncheckedUpdateWithoutProgressInput>
}

export type UserUpdateWithoutProgressInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUpdateManyWithoutCreatorNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUpdateManyWithoutUserNestedInput
}

export type UserUncheckedUpdateWithoutProgressInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUncheckedUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUncheckedUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUncheckedUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUncheckedUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUncheckedUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUncheckedUpdateManyWithoutCreatorNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedUpdateManyWithoutUserNestedInput
}

export type UserCreateWithoutExerciseSubmissionsInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressCreateNestedManyWithoutUserInput
}

export type UserUncheckedCreateWithoutExerciseSubmissionsInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteUncheckedCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVUncheckedCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateUncheckedCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionUncheckedCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventUncheckedCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapUncheckedCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput
}

export type UserCreateOrConnectWithoutExerciseSubmissionsInput = {
  where: Prisma.UserWhereUniqueInput
  create: Prisma.XOR<Prisma.UserCreateWithoutExerciseSubmissionsInput, Prisma.UserUncheckedCreateWithoutExerciseSubmissionsInput>
}

export type UserUpsertWithoutExerciseSubmissionsInput = {
  update: Prisma.XOR<Prisma.UserUpdateWithoutExerciseSubmissionsInput, Prisma.UserUncheckedUpdateWithoutExerciseSubmissionsInput>
  create: Prisma.XOR<Prisma.UserCreateWithoutExerciseSubmissionsInput, Prisma.UserUncheckedCreateWithoutExerciseSubmissionsInput>
  where?: Prisma.UserWhereInput
}

export type UserUpdateToOneWithWhereWithoutExerciseSubmissionsInput = {
  where?: Prisma.UserWhereInput
  data: Prisma.XOR<Prisma.UserUpdateWithoutExerciseSubmissionsInput, Prisma.UserUncheckedUpdateWithoutExerciseSubmissionsInput>
}

export type UserUpdateWithoutExerciseSubmissionsInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUpdateManyWithoutUserNestedInput
}

export type UserUncheckedUpdateWithoutExerciseSubmissionsInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUncheckedUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUncheckedUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUncheckedUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUncheckedUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUncheckedUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUncheckedUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput
}

export type UserCreateWithoutInterviewSessionsInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionCreateNestedManyWithoutUserInput
}

export type UserUncheckedCreateWithoutInterviewSessionsInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteUncheckedCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVUncheckedCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateUncheckedCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventUncheckedCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapUncheckedCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedCreateNestedManyWithoutUserInput
}

export type UserCreateOrConnectWithoutInterviewSessionsInput = {
  where: Prisma.UserWhereUniqueInput
  create: Prisma.XOR<Prisma.UserCreateWithoutInterviewSessionsInput, Prisma.UserUncheckedCreateWithoutInterviewSessionsInput>
}

export type UserUpsertWithoutInterviewSessionsInput = {
  update: Prisma.XOR<Prisma.UserUpdateWithoutInterviewSessionsInput, Prisma.UserUncheckedUpdateWithoutInterviewSessionsInput>
  create: Prisma.XOR<Prisma.UserCreateWithoutInterviewSessionsInput, Prisma.UserUncheckedCreateWithoutInterviewSessionsInput>
  where?: Prisma.UserWhereInput
}

export type UserUpdateToOneWithWhereWithoutInterviewSessionsInput = {
  where?: Prisma.UserWhereInput
  data: Prisma.XOR<Prisma.UserUpdateWithoutInterviewSessionsInput, Prisma.UserUncheckedUpdateWithoutInterviewSessionsInput>
}

export type UserUpdateWithoutInterviewSessionsInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUpdateManyWithoutUserNestedInput
}

export type UserUncheckedUpdateWithoutInterviewSessionsInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUncheckedUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUncheckedUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUncheckedUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUncheckedUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUncheckedUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedUpdateManyWithoutUserNestedInput
}

export type UserCreateWithoutCvsInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionCreateNestedManyWithoutUserInput
}

export type UserUncheckedCreateWithoutCvsInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteUncheckedCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateUncheckedCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionUncheckedCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventUncheckedCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapUncheckedCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedCreateNestedManyWithoutUserInput
}

export type UserCreateOrConnectWithoutCvsInput = {
  where: Prisma.UserWhereUniqueInput
  create: Prisma.XOR<Prisma.UserCreateWithoutCvsInput, Prisma.UserUncheckedCreateWithoutCvsInput>
}

export type UserUpsertWithoutCvsInput = {
  update: Prisma.XOR<Prisma.UserUpdateWithoutCvsInput, Prisma.UserUncheckedUpdateWithoutCvsInput>
  create: Prisma.XOR<Prisma.UserCreateWithoutCvsInput, Prisma.UserUncheckedCreateWithoutCvsInput>
  where?: Prisma.UserWhereInput
}

export type UserUpdateToOneWithWhereWithoutCvsInput = {
  where?: Prisma.UserWhereInput
  data: Prisma.XOR<Prisma.UserUpdateWithoutCvsInput, Prisma.UserUncheckedUpdateWithoutCvsInput>
}

export type UserUpdateWithoutCvsInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUpdateManyWithoutUserNestedInput
}

export type UserUncheckedUpdateWithoutCvsInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUncheckedUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUncheckedUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUncheckedUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUncheckedUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUncheckedUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedUpdateManyWithoutUserNestedInput
}

export type UserCreateWithoutCertificatesInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionCreateNestedManyWithoutUserInput
}

export type UserUncheckedCreateWithoutCertificatesInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteUncheckedCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVUncheckedCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionUncheckedCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventUncheckedCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapUncheckedCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedCreateNestedManyWithoutUserInput
}

export type UserCreateOrConnectWithoutCertificatesInput = {
  where: Prisma.UserWhereUniqueInput
  create: Prisma.XOR<Prisma.UserCreateWithoutCertificatesInput, Prisma.UserUncheckedCreateWithoutCertificatesInput>
}

export type UserUpsertWithoutCertificatesInput = {
  update: Prisma.XOR<Prisma.UserUpdateWithoutCertificatesInput, Prisma.UserUncheckedUpdateWithoutCertificatesInput>
  create: Prisma.XOR<Prisma.UserCreateWithoutCertificatesInput, Prisma.UserUncheckedCreateWithoutCertificatesInput>
  where?: Prisma.UserWhereInput
}

export type UserUpdateToOneWithWhereWithoutCertificatesInput = {
  where?: Prisma.UserWhereInput
  data: Prisma.XOR<Prisma.UserUpdateWithoutCertificatesInput, Prisma.UserUncheckedUpdateWithoutCertificatesInput>
}

export type UserUpdateWithoutCertificatesInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUpdateManyWithoutUserNestedInput
}

export type UserUncheckedUpdateWithoutCertificatesInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUncheckedUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUncheckedUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUncheckedUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUncheckedUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUncheckedUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedUpdateManyWithoutUserNestedInput
}

export type UserCreateWithoutLearningEventsInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionCreateNestedManyWithoutUserInput
}

export type UserUncheckedCreateWithoutLearningEventsInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  aiNotes?: Prisma.AINoteUncheckedCreateNestedManyWithoutUserInput
  cvs?: Prisma.CVUncheckedCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateUncheckedCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionUncheckedCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapUncheckedCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedCreateNestedManyWithoutUserInput
}

export type UserCreateOrConnectWithoutLearningEventsInput = {
  where: Prisma.UserWhereUniqueInput
  create: Prisma.XOR<Prisma.UserCreateWithoutLearningEventsInput, Prisma.UserUncheckedCreateWithoutLearningEventsInput>
}

export type UserUpsertWithoutLearningEventsInput = {
  update: Prisma.XOR<Prisma.UserUpdateWithoutLearningEventsInput, Prisma.UserUncheckedUpdateWithoutLearningEventsInput>
  create: Prisma.XOR<Prisma.UserCreateWithoutLearningEventsInput, Prisma.UserUncheckedCreateWithoutLearningEventsInput>
  where?: Prisma.UserWhereInput
}

export type UserUpdateToOneWithWhereWithoutLearningEventsInput = {
  where?: Prisma.UserWhereInput
  data: Prisma.XOR<Prisma.UserUpdateWithoutLearningEventsInput, Prisma.UserUncheckedUpdateWithoutLearningEventsInput>
}

export type UserUpdateWithoutLearningEventsInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUpdateManyWithoutUserNestedInput
}

export type UserUncheckedUpdateWithoutLearningEventsInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  aiNotes?: Prisma.AINoteUncheckedUpdateManyWithoutUserNestedInput
  cvs?: Prisma.CVUncheckedUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUncheckedUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUncheckedUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUncheckedUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedUpdateManyWithoutUserNestedInput
}

export type UserCreateWithoutAiNotesInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  cvs?: Prisma.CVCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionCreateNestedManyWithoutUserInput
}

export type UserUncheckedCreateWithoutAiNotesInput = {
  user_id?: string
  email: string
  password_hash: string
  full_name: string
  current_level?: $Enums.Level
  role?: $Enums.Role
  avatar_url?: string | null
  created_at?: Date | string
  updated_at?: Date | string
  cvs?: Prisma.CVUncheckedCreateNestedManyWithoutUserInput
  certificates?: Prisma.CertificateUncheckedCreateNestedManyWithoutUserInput
  interviewSessions?: Prisma.InterviewSessionUncheckedCreateNestedManyWithoutUserInput
  learningEvents?: Prisma.LearningEventUncheckedCreateNestedManyWithoutUserInput
  roadmaps?: Prisma.RoadmapUncheckedCreateNestedManyWithoutCreatorInput
  progress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedCreateNestedManyWithoutUserInput
}

export type UserCreateOrConnectWithoutAiNotesInput = {
  where: Prisma.UserWhereUniqueInput
  create: Prisma.XOR<Prisma.UserCreateWithoutAiNotesInput, Prisma.UserUncheckedCreateWithoutAiNotesInput>
}

export type UserUpsertWithoutAiNotesInput = {
  update: Prisma.XOR<Prisma.UserUpdateWithoutAiNotesInput, Prisma.UserUncheckedUpdateWithoutAiNotesInput>
  create: Prisma.XOR<Prisma.UserCreateWithoutAiNotesInput, Prisma.UserUncheckedCreateWithoutAiNotesInput>
  where?: Prisma.UserWhereInput
}

export type UserUpdateToOneWithWhereWithoutAiNotesInput = {
  where?: Prisma.UserWhereInput
  data: Prisma.XOR<Prisma.UserUpdateWithoutAiNotesInput, Prisma.UserUncheckedUpdateWithoutAiNotesInput>
}

export type UserUpdateWithoutAiNotesInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  cvs?: Prisma.CVUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUpdateManyWithoutUserNestedInput
}

export type UserUncheckedUpdateWithoutAiNotesInput = {
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  email?: Prisma.StringFieldUpdateOperationsInput | string
  password_hash?: Prisma.StringFieldUpdateOperationsInput | string
  full_name?: Prisma.StringFieldUpdateOperationsInput | string
  current_level?: Prisma.EnumLevelFieldUpdateOperationsInput | $Enums.Level
  role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role
  avatar_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  cvs?: Prisma.CVUncheckedUpdateManyWithoutUserNestedInput
  certificates?: Prisma.CertificateUncheckedUpdateManyWithoutUserNestedInput
  interviewSessions?: Prisma.InterviewSessionUncheckedUpdateManyWithoutUserNestedInput
  learningEvents?: Prisma.LearningEventUncheckedUpdateManyWithoutUserNestedInput
  roadmaps?: Prisma.RoadmapUncheckedUpdateManyWithoutCreatorNestedInput
  progress?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput
  exerciseSubmissions?: Prisma.ExerciseSubmissionUncheckedUpdateManyWithoutUserNestedInput
}


/**
 * Count Type UserCountOutputType
 */

export type UserCountOutputType = {
  aiNotes: number
  cvs: number
  certificates: number
  interviewSessions: number
  learningEvents: number
  roadmaps: number
  progress: number
  exerciseSubmissions: number
}

export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  aiNotes?: boolean | UserCountOutputTypeCountAiNotesArgs
  cvs?: boolean | UserCountOutputTypeCountCvsArgs
  certificates?: boolean | UserCountOutputTypeCountCertificatesArgs
  interviewSessions?: boolean | UserCountOutputTypeCountInterviewSessionsArgs
  learningEvents?: boolean | UserCountOutputTypeCountLearningEventsArgs
  roadmaps?: boolean | UserCountOutputTypeCountRoadmapsArgs
  progress?: boolean | UserCountOutputTypeCountProgressArgs
  exerciseSubmissions?: boolean | UserCountOutputTypeCountExerciseSubmissionsArgs
}

/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the UserCountOutputType
   */
  select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null
}

/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountAiNotesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.AINoteWhereInput
}

/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountCvsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.CVWhereInput
}

/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountCertificatesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.CertificateWhereInput
}

/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountInterviewSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.InterviewSessionWhereInput
}

/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountLearningEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.LearningEventWhereInput
}

/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountRoadmapsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.RoadmapWhereInput
}

/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountProgressArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.UserProgressWhereInput
}

/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountExerciseSubmissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.ExerciseSubmissionWhereInput
}


export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  user_id?: boolean
  email?: boolean
  password_hash?: boolean
  full_name?: boolean
  current_level?: boolean
  role?: boolean
  avatar_url?: boolean
  created_at?: boolean
  updated_at?: boolean
  aiNotes?: boolean | Prisma.User$aiNotesArgs<ExtArgs>
  cvs?: boolean | Prisma.User$cvsArgs<ExtArgs>
  certificates?: boolean | Prisma.User$certificatesArgs<ExtArgs>
  interviewSessions?: boolean | Prisma.User$interviewSessionsArgs<ExtArgs>
  learningEvents?: boolean | Prisma.User$learningEventsArgs<ExtArgs>
  roadmaps?: boolean | Prisma.User$roadmapsArgs<ExtArgs>
  progress?: boolean | Prisma.User$progressArgs<ExtArgs>
  exerciseSubmissions?: boolean | Prisma.User$exerciseSubmissionsArgs<ExtArgs>
  _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>
}, ExtArgs["result"]["user"]>



export type UserSelectScalar = {
  user_id?: boolean
  email?: boolean
  password_hash?: boolean
  full_name?: boolean
  current_level?: boolean
  role?: boolean
  avatar_url?: boolean
  created_at?: boolean
  updated_at?: boolean
}

export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"user_id" | "email" | "password_hash" | "full_name" | "current_level" | "role" | "avatar_url" | "created_at" | "updated_at", ExtArgs["result"]["user"]>
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  aiNotes?: boolean | Prisma.User$aiNotesArgs<ExtArgs>
  cvs?: boolean | Prisma.User$cvsArgs<ExtArgs>
  certificates?: boolean | Prisma.User$certificatesArgs<ExtArgs>
  interviewSessions?: boolean | Prisma.User$interviewSessionsArgs<ExtArgs>
  learningEvents?: boolean | Prisma.User$learningEventsArgs<ExtArgs>
  roadmaps?: boolean | Prisma.User$roadmapsArgs<ExtArgs>
  progress?: boolean | Prisma.User$progressArgs<ExtArgs>
  exerciseSubmissions?: boolean | Prisma.User$exerciseSubmissionsArgs<ExtArgs>
  _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>
}

export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "User"
  objects: {
    aiNotes: Prisma.$AINotePayload<ExtArgs>[]
    cvs: Prisma.$CVPayload<ExtArgs>[]
    certificates: Prisma.$CertificatePayload<ExtArgs>[]
    interviewSessions: Prisma.$InterviewSessionPayload<ExtArgs>[]
    learningEvents: Prisma.$LearningEventPayload<ExtArgs>[]
    roadmaps: Prisma.$RoadmapPayload<ExtArgs>[]
    progress: Prisma.$UserProgressPayload<ExtArgs>[]
    exerciseSubmissions: Prisma.$ExerciseSubmissionPayload<ExtArgs>[]
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    user_id: string
    email: string
    password_hash: string
    full_name: string
    current_level: $Enums.Level
    role: $Enums.Role
    avatar_url: string | null
    created_at: Date
    updated_at: Date
  }, ExtArgs["result"]["user"]>
  composites: {}
}

export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>

export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true
  }

export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
  /**
   * Find zero or one User that matches the filter.
   * @param {UserFindUniqueArgs} args - Arguments to find a User
   * @example
   * // Get one User
   * const user = await prisma.user.findUnique({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find one User that matches the filter or throw an error with `error.code='P2025'`
   * if no matches were found.
   * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
   * @example
   * // Get one User
   * const user = await prisma.user.findUniqueOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first User that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserFindFirstArgs} args - Arguments to find a User
   * @example
   * // Get one User
   * const user = await prisma.user.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first User that matches the filter or
   * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
   * @example
   * // Get one User
   * const user = await prisma.user.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find zero or more Users that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Users
   * const users = await prisma.user.findMany()
   * 
   * // Get first 10 Users
   * const users = await prisma.user.findMany({ take: 10 })
   * 
   * // Only select the `user_id`
   * const userWithUser_idOnly = await prisma.user.findMany({ select: { user_id: true } })
   * 
   */
  findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  /**
   * Create a User.
   * @param {UserCreateArgs} args - Arguments to create a User.
   * @example
   * // Create one User
   * const User = await prisma.user.create({
   *   data: {
   *     // ... data to create a User
   *   }
   * })
   * 
   */
  create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Create many Users.
   * @param {UserCreateManyArgs} args - Arguments to create many Users.
   * @example
   * // Create many Users
   * const user = await prisma.user.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   *     
   */
  createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Delete a User.
   * @param {UserDeleteArgs} args - Arguments to delete one User.
   * @example
   * // Delete one User
   * const User = await prisma.user.delete({
   *   where: {
   *     // ... filter to delete one User
   *   }
   * })
   * 
   */
  delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Update one User.
   * @param {UserUpdateArgs} args - Arguments to update one User.
   * @example
   * // Update one User
   * const user = await prisma.user.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Delete zero or more Users.
   * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
   * @example
   * // Delete a few Users
   * const { count } = await prisma.user.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Update zero or more Users.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Users
   * const user = await prisma.user.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Create or update one User.
   * @param {UserUpsertArgs} args - Arguments to update or create a User.
   * @example
   * // Update or create a User
   * const user = await prisma.user.upsert({
   *   create: {
   *     // ... data to create a User
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the User we want to update
   *   }
   * })
   */
  upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


  /**
   * Count the number of Users.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserCountArgs} args - Arguments to filter Users to count.
   * @example
   * // Count the number of Users
   * const count = await prisma.user.count({
   *   where: {
   *     // ... the filter for the Users we want to count
   *   }
   * })
  **/
  count<T extends UserCountArgs>(
    args?: Prisma.Subset<T, UserCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType>
      : number
  >

  /**
   * Allows you to perform aggregations operations on a User.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Ordered by age ascending
   * // Where email contains prisma.io
   * // Limited to the 10 users
   * const aggregations = await prisma.user.aggregate({
   *   _avg: {
   *     age: true,
   *   },
   *   where: {
   *     email: {
   *       contains: "prisma.io",
   *     },
   *   },
   *   orderBy: {
   *     age: "asc",
   *   },
   *   take: 10,
   * })
  **/
  aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

  /**
   * Group by User.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserGroupByArgs} args - Group by arguments.
   * @example
   * // Group by city, order by createdAt, get count
   * const result = await prisma.user.groupBy({
   *   by: ['city', 'createdAt'],
   *   orderBy: {
   *     createdAt: true
   *   },
   *   _count: {
   *     _all: true
   *   },
   * })
   * 
  **/
  groupBy<
    T extends UserGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: UserGroupByArgs['orderBy'] }
      : { orderBy?: UserGroupByArgs['orderBy'] },
    OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>,
    ByFields extends Prisma.MaybeTupleToUnion<T['by']>,
    ByValid extends Prisma.Has<ByFields, OrderFields>,
    HavingFields extends Prisma.GetHavingFields<T['having']>,
    HavingValid extends Prisma.Has<ByFields, HavingFields>,
    ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False,
    InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
          ? never
          : P extends string
          ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
          : [
              Error,
              'Field ',
              P,
              ` in "having" needs to be provided in "by"`,
            ]
      }[HavingFields]
    : 'take' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
          ? never
          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
      }[OrderFields]
  >(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
/**
 * Fields of the User model
 */
readonly fields: UserFieldRefs;
}

/**
 * The delegate class that acts as a "Promise-like" for User.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  aiNotes<T extends Prisma.User$aiNotesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$aiNotesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AINotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  cvs<T extends Prisma.User$cvsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$cvsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CVPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  certificates<T extends Prisma.User$certificatesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$certificatesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  interviewSessions<T extends Prisma.User$interviewSessionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$interviewSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  learningEvents<T extends Prisma.User$learningEventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$learningEventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LearningEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  roadmaps<T extends Prisma.User$roadmapsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$roadmapsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  progress<T extends Prisma.User$progressArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$progressArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  exerciseSubmissions<T extends Prisma.User$exerciseSubmissionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$exerciseSubmissionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExerciseSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}




/**
 * Fields of the User model
 */
export interface UserFieldRefs {
  readonly user_id: Prisma.FieldRef<"User", 'String'>
  readonly email: Prisma.FieldRef<"User", 'String'>
  readonly password_hash: Prisma.FieldRef<"User", 'String'>
  readonly full_name: Prisma.FieldRef<"User", 'String'>
  readonly current_level: Prisma.FieldRef<"User", 'Level'>
  readonly role: Prisma.FieldRef<"User", 'Role'>
  readonly avatar_url: Prisma.FieldRef<"User", 'String'>
  readonly created_at: Prisma.FieldRef<"User", 'DateTime'>
  readonly updated_at: Prisma.FieldRef<"User", 'DateTime'>
}
    

// Custom InputTypes
/**
 * User findUnique
 */
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the User
   */
  select?: Prisma.UserSelect<ExtArgs> | null
  /**
   * Omit specific fields from the User
   */
  omit?: Prisma.UserOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserInclude<ExtArgs> | null
  /**
   * Filter, which User to fetch.
   */
  where: Prisma.UserWhereUniqueInput
}

/**
 * User findUniqueOrThrow
 */
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the User
   */
  select?: Prisma.UserSelect<ExtArgs> | null
  /**
   * Omit specific fields from the User
   */
  omit?: Prisma.UserOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserInclude<ExtArgs> | null
  /**
   * Filter, which User to fetch.
   */
  where: Prisma.UserWhereUniqueInput
}

/**
 * User findFirst
 */
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the User
   */
  select?: Prisma.UserSelect<ExtArgs> | null
  /**
   * Omit specific fields from the User
   */
  omit?: Prisma.UserOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserInclude<ExtArgs> | null
  /**
   * Filter, which User to fetch.
   */
  where?: Prisma.UserWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Users to fetch.
   */
  orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for Users.
   */
  cursor?: Prisma.UserWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Users from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Users.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of Users.
   */
  distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[]
}

/**
 * User findFirstOrThrow
 */
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the User
   */
  select?: Prisma.UserSelect<ExtArgs> | null
  /**
   * Omit specific fields from the User
   */
  omit?: Prisma.UserOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserInclude<ExtArgs> | null
  /**
   * Filter, which User to fetch.
   */
  where?: Prisma.UserWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Users to fetch.
   */
  orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for Users.
   */
  cursor?: Prisma.UserWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Users from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Users.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of Users.
   */
  distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[]
}

/**
 * User findMany
 */
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the User
   */
  select?: Prisma.UserSelect<ExtArgs> | null
  /**
   * Omit specific fields from the User
   */
  omit?: Prisma.UserOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserInclude<ExtArgs> | null
  /**
   * Filter, which Users to fetch.
   */
  where?: Prisma.UserWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of Users to fetch.
   */
  orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for listing Users.
   */
  cursor?: Prisma.UserWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` Users from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` Users.
   */
  skip?: number
  distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[]
}

/**
 * User create
 */
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the User
   */
  select?: Prisma.UserSelect<ExtArgs> | null
  /**
   * Omit specific fields from the User
   */
  omit?: Prisma.UserOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserInclude<ExtArgs> | null
  /**
   * The data needed to create a User.
   */
  data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>
}

/**
 * User createMany
 */
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to create many Users.
   */
  data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[]
  skipDuplicates?: boolean
}

/**
 * User update
 */
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the User
   */
  select?: Prisma.UserSelect<ExtArgs> | null
  /**
   * Omit specific fields from the User
   */
  omit?: Prisma.UserOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserInclude<ExtArgs> | null
  /**
   * The data needed to update a User.
   */
  data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>
  /**
   * Choose, which User to update.
   */
  where: Prisma.UserWhereUniqueInput
}

/**
 * User updateMany
 */
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to update Users.
   */
  data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>
  /**
   * Filter which Users to update
   */
  where?: Prisma.UserWhereInput
  /**
   * Limit how many Users to update.
   */
  limit?: number
}

/**
 * User upsert
 */
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the User
   */
  select?: Prisma.UserSelect<ExtArgs> | null
  /**
   * Omit specific fields from the User
   */
  omit?: Prisma.UserOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserInclude<ExtArgs> | null
  /**
   * The filter to search for the User to update in case it exists.
   */
  where: Prisma.UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
   */
  create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
   */
  update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>
}

/**
 * User delete
 */
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the User
   */
  select?: Prisma.UserSelect<ExtArgs> | null
  /**
   * Omit specific fields from the User
   */
  omit?: Prisma.UserOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserInclude<ExtArgs> | null
  /**
   * Filter which User to delete.
   */
  where: Prisma.UserWhereUniqueInput
}

/**
 * User deleteMany
 */
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which Users to delete
   */
  where?: Prisma.UserWhereInput
  /**
   * Limit how many Users to delete.
   */
  limit?: number
}

/**
 * User.aiNotes
 */
export type User$aiNotesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the AINote
   */
  select?: Prisma.AINoteSelect<ExtArgs> | null
  /**
   * Omit specific fields from the AINote
   */
  omit?: Prisma.AINoteOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.AINoteInclude<ExtArgs> | null
  where?: Prisma.AINoteWhereInput
  orderBy?: Prisma.AINoteOrderByWithRelationInput | Prisma.AINoteOrderByWithRelationInput[]
  cursor?: Prisma.AINoteWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.AINoteScalarFieldEnum | Prisma.AINoteScalarFieldEnum[]
}

/**
 * User.cvs
 */
export type User$cvsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the CV
   */
  select?: Prisma.CVSelect<ExtArgs> | null
  /**
   * Omit specific fields from the CV
   */
  omit?: Prisma.CVOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CVInclude<ExtArgs> | null
  where?: Prisma.CVWhereInput
  orderBy?: Prisma.CVOrderByWithRelationInput | Prisma.CVOrderByWithRelationInput[]
  cursor?: Prisma.CVWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.CVScalarFieldEnum | Prisma.CVScalarFieldEnum[]
}

/**
 * User.certificates
 */
export type User$certificatesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Certificate
   */
  select?: Prisma.CertificateSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Certificate
   */
  omit?: Prisma.CertificateOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.CertificateInclude<ExtArgs> | null
  where?: Prisma.CertificateWhereInput
  orderBy?: Prisma.CertificateOrderByWithRelationInput | Prisma.CertificateOrderByWithRelationInput[]
  cursor?: Prisma.CertificateWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.CertificateScalarFieldEnum | Prisma.CertificateScalarFieldEnum[]
}

/**
 * User.interviewSessions
 */
export type User$interviewSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the InterviewSession
   */
  select?: Prisma.InterviewSessionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the InterviewSession
   */
  omit?: Prisma.InterviewSessionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.InterviewSessionInclude<ExtArgs> | null
  where?: Prisma.InterviewSessionWhereInput
  orderBy?: Prisma.InterviewSessionOrderByWithRelationInput | Prisma.InterviewSessionOrderByWithRelationInput[]
  cursor?: Prisma.InterviewSessionWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.InterviewSessionScalarFieldEnum | Prisma.InterviewSessionScalarFieldEnum[]
}

/**
 * User.learningEvents
 */
export type User$learningEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the LearningEvent
   */
  select?: Prisma.LearningEventSelect<ExtArgs> | null
  /**
   * Omit specific fields from the LearningEvent
   */
  omit?: Prisma.LearningEventOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.LearningEventInclude<ExtArgs> | null
  where?: Prisma.LearningEventWhereInput
  orderBy?: Prisma.LearningEventOrderByWithRelationInput | Prisma.LearningEventOrderByWithRelationInput[]
  cursor?: Prisma.LearningEventWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.LearningEventScalarFieldEnum | Prisma.LearningEventScalarFieldEnum[]
}

/**
 * User.roadmaps
 */
export type User$roadmapsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the Roadmap
   */
  select?: Prisma.RoadmapSelect<ExtArgs> | null
  /**
   * Omit specific fields from the Roadmap
   */
  omit?: Prisma.RoadmapOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.RoadmapInclude<ExtArgs> | null
  where?: Prisma.RoadmapWhereInput
  orderBy?: Prisma.RoadmapOrderByWithRelationInput | Prisma.RoadmapOrderByWithRelationInput[]
  cursor?: Prisma.RoadmapWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.RoadmapScalarFieldEnum | Prisma.RoadmapScalarFieldEnum[]
}

/**
 * User.progress
 */
export type User$progressArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the UserProgress
   */
  select?: Prisma.UserProgressSelect<ExtArgs> | null
  /**
   * Omit specific fields from the UserProgress
   */
  omit?: Prisma.UserProgressOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserProgressInclude<ExtArgs> | null
  where?: Prisma.UserProgressWhereInput
  orderBy?: Prisma.UserProgressOrderByWithRelationInput | Prisma.UserProgressOrderByWithRelationInput[]
  cursor?: Prisma.UserProgressWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.UserProgressScalarFieldEnum | Prisma.UserProgressScalarFieldEnum[]
}

/**
 * User.exerciseSubmissions
 */
export type User$exerciseSubmissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the ExerciseSubmission
   */
  select?: Prisma.ExerciseSubmissionSelect<ExtArgs> | null
  /**
   * Omit specific fields from the ExerciseSubmission
   */
  omit?: Prisma.ExerciseSubmissionOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.ExerciseSubmissionInclude<ExtArgs> | null
  where?: Prisma.ExerciseSubmissionWhereInput
  orderBy?: Prisma.ExerciseSubmissionOrderByWithRelationInput | Prisma.ExerciseSubmissionOrderByWithRelationInput[]
  cursor?: Prisma.ExerciseSubmissionWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.ExerciseSubmissionScalarFieldEnum | Prisma.ExerciseSubmissionScalarFieldEnum[]
}

/**
 * User without action
 */
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the User
   */
  select?: Prisma.UserSelect<ExtArgs> | null
  /**
   * Omit specific fields from the User
   */
  omit?: Prisma.UserOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserInclude<ExtArgs> | null
}

```

## File: src/generated/prisma/models/UserProgress.ts

```typescript

/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
// biome-ignore-all lint: generated file
// @ts-nocheck 
/*
 * This file exports the `UserProgress` model and its related types.
 *
 * 🟢 You can import this file directly.
 */
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums"
import type * as Prisma from "../internal/prismaNamespace"

/**
 * Model UserProgress
 * 
 */
export type UserProgressModel = runtime.Types.Result.DefaultSelection<Prisma.$UserProgressPayload>

export type AggregateUserProgress = {
  _count: UserProgressCountAggregateOutputType | null
  _avg: UserProgressAvgAggregateOutputType | null
  _sum: UserProgressSumAggregateOutputType | null
  _min: UserProgressMinAggregateOutputType | null
  _max: UserProgressMaxAggregateOutputType | null
}

export type UserProgressAvgAggregateOutputType = {
  completion_percentage: runtime.Decimal | null
}

export type UserProgressSumAggregateOutputType = {
  completion_percentage: runtime.Decimal | null
}

export type UserProgressMinAggregateOutputType = {
  progress_id: string | null
  user_id: string | null
  module_id: string | null
  status: $Enums.ProgressStatus | null
  completion_percentage: runtime.Decimal | null
  started_at: Date | null
  completed_at: Date | null
  last_accessed_at: Date | null
}

export type UserProgressMaxAggregateOutputType = {
  progress_id: string | null
  user_id: string | null
  module_id: string | null
  status: $Enums.ProgressStatus | null
  completion_percentage: runtime.Decimal | null
  started_at: Date | null
  completed_at: Date | null
  last_accessed_at: Date | null
}

export type UserProgressCountAggregateOutputType = {
  progress_id: number
  user_id: number
  module_id: number
  status: number
  completion_percentage: number
  started_at: number
  completed_at: number
  last_accessed_at: number
  _all: number
}


export type UserProgressAvgAggregateInputType = {
  completion_percentage?: true
}

export type UserProgressSumAggregateInputType = {
  completion_percentage?: true
}

export type UserProgressMinAggregateInputType = {
  progress_id?: true
  user_id?: true
  module_id?: true
  status?: true
  completion_percentage?: true
  started_at?: true
  completed_at?: true
  last_accessed_at?: true
}

export type UserProgressMaxAggregateInputType = {
  progress_id?: true
  user_id?: true
  module_id?: true
  status?: true
  completion_percentage?: true
  started_at?: true
  completed_at?: true
  last_accessed_at?: true
}

export type UserProgressCountAggregateInputType = {
  progress_id?: true
  user_id?: true
  module_id?: true
  status?: true
  completion_percentage?: true
  started_at?: true
  completed_at?: true
  last_accessed_at?: true
  _all?: true
}

export type UserProgressAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which UserProgress to aggregate.
   */
  where?: Prisma.UserProgressWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of UserProgresses to fetch.
   */
  orderBy?: Prisma.UserProgressOrderByWithRelationInput | Prisma.UserProgressOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the start position
   */
  cursor?: Prisma.UserProgressWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` UserProgresses from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` UserProgresses.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Count returned UserProgresses
  **/
  _count?: true | UserProgressCountAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to average
  **/
  _avg?: UserProgressAvgAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to sum
  **/
  _sum?: UserProgressSumAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the minimum value
  **/
  _min?: UserProgressMinAggregateInputType
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
   * 
   * Select which fields to find the maximum value
  **/
  _max?: UserProgressMaxAggregateInputType
}

export type GetUserProgressAggregateType<T extends UserProgressAggregateArgs> = {
      [P in keyof T & keyof AggregateUserProgress]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateUserProgress[P]>
    : Prisma.GetScalarType<T[P], AggregateUserProgress[P]>
}




export type UserProgressGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.UserProgressWhereInput
  orderBy?: Prisma.UserProgressOrderByWithAggregationInput | Prisma.UserProgressOrderByWithAggregationInput[]
  by: Prisma.UserProgressScalarFieldEnum[] | Prisma.UserProgressScalarFieldEnum
  having?: Prisma.UserProgressScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: UserProgressCountAggregateInputType | true
  _avg?: UserProgressAvgAggregateInputType
  _sum?: UserProgressSumAggregateInputType
  _min?: UserProgressMinAggregateInputType
  _max?: UserProgressMaxAggregateInputType
}

export type UserProgressGroupByOutputType = {
  progress_id: string
  user_id: string
  module_id: string
  status: $Enums.ProgressStatus
  completion_percentage: runtime.Decimal
  started_at: Date | null
  completed_at: Date | null
  last_accessed_at: Date
  _count: UserProgressCountAggregateOutputType | null
  _avg: UserProgressAvgAggregateOutputType | null
  _sum: UserProgressSumAggregateOutputType | null
  _min: UserProgressMinAggregateOutputType | null
  _max: UserProgressMaxAggregateOutputType | null
}

type GetUserProgressGroupByPayload<T extends UserProgressGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<UserProgressGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof UserProgressGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], UserProgressGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], UserProgressGroupByOutputType[P]>
      }
    >
  >



export type UserProgressWhereInput = {
  AND?: Prisma.UserProgressWhereInput | Prisma.UserProgressWhereInput[]
  OR?: Prisma.UserProgressWhereInput[]
  NOT?: Prisma.UserProgressWhereInput | Prisma.UserProgressWhereInput[]
  progress_id?: Prisma.StringFilter<"UserProgress"> | string
  user_id?: Prisma.StringFilter<"UserProgress"> | string
  module_id?: Prisma.StringFilter<"UserProgress"> | string
  status?: Prisma.EnumProgressStatusFilter<"UserProgress"> | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalFilter<"UserProgress"> | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.DateTimeNullableFilter<"UserProgress"> | Date | string | null
  completed_at?: Prisma.DateTimeNullableFilter<"UserProgress"> | Date | string | null
  last_accessed_at?: Prisma.DateTimeFilter<"UserProgress"> | Date | string
  module?: Prisma.XOR<Prisma.ModuleScalarRelationFilter, Prisma.ModuleWhereInput>
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}

export type UserProgressOrderByWithRelationInput = {
  progress_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  status?: Prisma.SortOrder
  completion_percentage?: Prisma.SortOrder
  started_at?: Prisma.SortOrderInput | Prisma.SortOrder
  completed_at?: Prisma.SortOrderInput | Prisma.SortOrder
  last_accessed_at?: Prisma.SortOrder
  module?: Prisma.ModuleOrderByWithRelationInput
  user?: Prisma.UserOrderByWithRelationInput
  _relevance?: Prisma.UserProgressOrderByRelevanceInput
}

export type UserProgressWhereUniqueInput = Prisma.AtLeast<{
  progress_id?: string
  user_id_module_id?: Prisma.UserProgressUser_idModule_idCompoundUniqueInput
  AND?: Prisma.UserProgressWhereInput | Prisma.UserProgressWhereInput[]
  OR?: Prisma.UserProgressWhereInput[]
  NOT?: Prisma.UserProgressWhereInput | Prisma.UserProgressWhereInput[]
  user_id?: Prisma.StringFilter<"UserProgress"> | string
  module_id?: Prisma.StringFilter<"UserProgress"> | string
  status?: Prisma.EnumProgressStatusFilter<"UserProgress"> | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalFilter<"UserProgress"> | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.DateTimeNullableFilter<"UserProgress"> | Date | string | null
  completed_at?: Prisma.DateTimeNullableFilter<"UserProgress"> | Date | string | null
  last_accessed_at?: Prisma.DateTimeFilter<"UserProgress"> | Date | string
  module?: Prisma.XOR<Prisma.ModuleScalarRelationFilter, Prisma.ModuleWhereInput>
  user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>
}, "progress_id" | "user_id_module_id">

export type UserProgressOrderByWithAggregationInput = {
  progress_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  status?: Prisma.SortOrder
  completion_percentage?: Prisma.SortOrder
  started_at?: Prisma.SortOrderInput | Prisma.SortOrder
  completed_at?: Prisma.SortOrderInput | Prisma.SortOrder
  last_accessed_at?: Prisma.SortOrder
  _count?: Prisma.UserProgressCountOrderByAggregateInput
  _avg?: Prisma.UserProgressAvgOrderByAggregateInput
  _max?: Prisma.UserProgressMaxOrderByAggregateInput
  _min?: Prisma.UserProgressMinOrderByAggregateInput
  _sum?: Prisma.UserProgressSumOrderByAggregateInput
}

export type UserProgressScalarWhereWithAggregatesInput = {
  AND?: Prisma.UserProgressScalarWhereWithAggregatesInput | Prisma.UserProgressScalarWhereWithAggregatesInput[]
  OR?: Prisma.UserProgressScalarWhereWithAggregatesInput[]
  NOT?: Prisma.UserProgressScalarWhereWithAggregatesInput | Prisma.UserProgressScalarWhereWithAggregatesInput[]
  progress_id?: Prisma.StringWithAggregatesFilter<"UserProgress"> | string
  user_id?: Prisma.StringWithAggregatesFilter<"UserProgress"> | string
  module_id?: Prisma.StringWithAggregatesFilter<"UserProgress"> | string
  status?: Prisma.EnumProgressStatusWithAggregatesFilter<"UserProgress"> | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalWithAggregatesFilter<"UserProgress"> | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.DateTimeNullableWithAggregatesFilter<"UserProgress"> | Date | string | null
  completed_at?: Prisma.DateTimeNullableWithAggregatesFilter<"UserProgress"> | Date | string | null
  last_accessed_at?: Prisma.DateTimeWithAggregatesFilter<"UserProgress"> | Date | string
}

export type UserProgressCreateInput = {
  progress_id?: string
  status?: $Enums.ProgressStatus
  completion_percentage?: runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Date | string | null
  completed_at?: Date | string | null
  last_accessed_at?: Date | string
  module: Prisma.ModuleCreateNestedOneWithoutUserProgressInput
  user: Prisma.UserCreateNestedOneWithoutProgressInput
}

export type UserProgressUncheckedCreateInput = {
  progress_id?: string
  user_id: string
  module_id: string
  status?: $Enums.ProgressStatus
  completion_percentage?: runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Date | string | null
  completed_at?: Date | string | null
  last_accessed_at?: Date | string
}

export type UserProgressUpdateInput = {
  progress_id?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumProgressStatusFieldUpdateOperationsInput | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  last_accessed_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  module?: Prisma.ModuleUpdateOneRequiredWithoutUserProgressNestedInput
  user?: Prisma.UserUpdateOneRequiredWithoutProgressNestedInput
}

export type UserProgressUncheckedUpdateInput = {
  progress_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumProgressStatusFieldUpdateOperationsInput | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  last_accessed_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type UserProgressCreateManyInput = {
  progress_id?: string
  user_id: string
  module_id: string
  status?: $Enums.ProgressStatus
  completion_percentage?: runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Date | string | null
  completed_at?: Date | string | null
  last_accessed_at?: Date | string
}

export type UserProgressUpdateManyMutationInput = {
  progress_id?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumProgressStatusFieldUpdateOperationsInput | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  last_accessed_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type UserProgressUncheckedUpdateManyInput = {
  progress_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumProgressStatusFieldUpdateOperationsInput | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  last_accessed_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type UserProgressListRelationFilter = {
  every?: Prisma.UserProgressWhereInput
  some?: Prisma.UserProgressWhereInput
  none?: Prisma.UserProgressWhereInput
}

export type UserProgressOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type UserProgressOrderByRelevanceInput = {
  fields: Prisma.UserProgressOrderByRelevanceFieldEnum | Prisma.UserProgressOrderByRelevanceFieldEnum[]
  sort: Prisma.SortOrder
  search: string
}

export type UserProgressUser_idModule_idCompoundUniqueInput = {
  user_id: string
  module_id: string
}

export type UserProgressCountOrderByAggregateInput = {
  progress_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  status?: Prisma.SortOrder
  completion_percentage?: Prisma.SortOrder
  started_at?: Prisma.SortOrder
  completed_at?: Prisma.SortOrder
  last_accessed_at?: Prisma.SortOrder
}

export type UserProgressAvgOrderByAggregateInput = {
  completion_percentage?: Prisma.SortOrder
}

export type UserProgressMaxOrderByAggregateInput = {
  progress_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  status?: Prisma.SortOrder
  completion_percentage?: Prisma.SortOrder
  started_at?: Prisma.SortOrder
  completed_at?: Prisma.SortOrder
  last_accessed_at?: Prisma.SortOrder
}

export type UserProgressMinOrderByAggregateInput = {
  progress_id?: Prisma.SortOrder
  user_id?: Prisma.SortOrder
  module_id?: Prisma.SortOrder
  status?: Prisma.SortOrder
  completion_percentage?: Prisma.SortOrder
  started_at?: Prisma.SortOrder
  completed_at?: Prisma.SortOrder
  last_accessed_at?: Prisma.SortOrder
}

export type UserProgressSumOrderByAggregateInput = {
  completion_percentage?: Prisma.SortOrder
}

export type UserProgressCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.UserProgressCreateWithoutUserInput, Prisma.UserProgressUncheckedCreateWithoutUserInput> | Prisma.UserProgressCreateWithoutUserInput[] | Prisma.UserProgressUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.UserProgressCreateOrConnectWithoutUserInput | Prisma.UserProgressCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.UserProgressCreateManyUserInputEnvelope
  connect?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
}

export type UserProgressUncheckedCreateNestedManyWithoutUserInput = {
  create?: Prisma.XOR<Prisma.UserProgressCreateWithoutUserInput, Prisma.UserProgressUncheckedCreateWithoutUserInput> | Prisma.UserProgressCreateWithoutUserInput[] | Prisma.UserProgressUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.UserProgressCreateOrConnectWithoutUserInput | Prisma.UserProgressCreateOrConnectWithoutUserInput[]
  createMany?: Prisma.UserProgressCreateManyUserInputEnvelope
  connect?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
}

export type UserProgressUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.UserProgressCreateWithoutUserInput, Prisma.UserProgressUncheckedCreateWithoutUserInput> | Prisma.UserProgressCreateWithoutUserInput[] | Prisma.UserProgressUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.UserProgressCreateOrConnectWithoutUserInput | Prisma.UserProgressCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.UserProgressUpsertWithWhereUniqueWithoutUserInput | Prisma.UserProgressUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.UserProgressCreateManyUserInputEnvelope
  set?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  disconnect?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  delete?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  connect?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  update?: Prisma.UserProgressUpdateWithWhereUniqueWithoutUserInput | Prisma.UserProgressUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.UserProgressUpdateManyWithWhereWithoutUserInput | Prisma.UserProgressUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.UserProgressScalarWhereInput | Prisma.UserProgressScalarWhereInput[]
}

export type UserProgressUncheckedUpdateManyWithoutUserNestedInput = {
  create?: Prisma.XOR<Prisma.UserProgressCreateWithoutUserInput, Prisma.UserProgressUncheckedCreateWithoutUserInput> | Prisma.UserProgressCreateWithoutUserInput[] | Prisma.UserProgressUncheckedCreateWithoutUserInput[]
  connectOrCreate?: Prisma.UserProgressCreateOrConnectWithoutUserInput | Prisma.UserProgressCreateOrConnectWithoutUserInput[]
  upsert?: Prisma.UserProgressUpsertWithWhereUniqueWithoutUserInput | Prisma.UserProgressUpsertWithWhereUniqueWithoutUserInput[]
  createMany?: Prisma.UserProgressCreateManyUserInputEnvelope
  set?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  disconnect?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  delete?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  connect?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  update?: Prisma.UserProgressUpdateWithWhereUniqueWithoutUserInput | Prisma.UserProgressUpdateWithWhereUniqueWithoutUserInput[]
  updateMany?: Prisma.UserProgressUpdateManyWithWhereWithoutUserInput | Prisma.UserProgressUpdateManyWithWhereWithoutUserInput[]
  deleteMany?: Prisma.UserProgressScalarWhereInput | Prisma.UserProgressScalarWhereInput[]
}

export type UserProgressCreateNestedManyWithoutModuleInput = {
  create?: Prisma.XOR<Prisma.UserProgressCreateWithoutModuleInput, Prisma.UserProgressUncheckedCreateWithoutModuleInput> | Prisma.UserProgressCreateWithoutModuleInput[] | Prisma.UserProgressUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.UserProgressCreateOrConnectWithoutModuleInput | Prisma.UserProgressCreateOrConnectWithoutModuleInput[]
  createMany?: Prisma.UserProgressCreateManyModuleInputEnvelope
  connect?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
}

export type UserProgressUncheckedCreateNestedManyWithoutModuleInput = {
  create?: Prisma.XOR<Prisma.UserProgressCreateWithoutModuleInput, Prisma.UserProgressUncheckedCreateWithoutModuleInput> | Prisma.UserProgressCreateWithoutModuleInput[] | Prisma.UserProgressUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.UserProgressCreateOrConnectWithoutModuleInput | Prisma.UserProgressCreateOrConnectWithoutModuleInput[]
  createMany?: Prisma.UserProgressCreateManyModuleInputEnvelope
  connect?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
}

export type UserProgressUpdateManyWithoutModuleNestedInput = {
  create?: Prisma.XOR<Prisma.UserProgressCreateWithoutModuleInput, Prisma.UserProgressUncheckedCreateWithoutModuleInput> | Prisma.UserProgressCreateWithoutModuleInput[] | Prisma.UserProgressUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.UserProgressCreateOrConnectWithoutModuleInput | Prisma.UserProgressCreateOrConnectWithoutModuleInput[]
  upsert?: Prisma.UserProgressUpsertWithWhereUniqueWithoutModuleInput | Prisma.UserProgressUpsertWithWhereUniqueWithoutModuleInput[]
  createMany?: Prisma.UserProgressCreateManyModuleInputEnvelope
  set?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  disconnect?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  delete?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  connect?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  update?: Prisma.UserProgressUpdateWithWhereUniqueWithoutModuleInput | Prisma.UserProgressUpdateWithWhereUniqueWithoutModuleInput[]
  updateMany?: Prisma.UserProgressUpdateManyWithWhereWithoutModuleInput | Prisma.UserProgressUpdateManyWithWhereWithoutModuleInput[]
  deleteMany?: Prisma.UserProgressScalarWhereInput | Prisma.UserProgressScalarWhereInput[]
}

export type UserProgressUncheckedUpdateManyWithoutModuleNestedInput = {
  create?: Prisma.XOR<Prisma.UserProgressCreateWithoutModuleInput, Prisma.UserProgressUncheckedCreateWithoutModuleInput> | Prisma.UserProgressCreateWithoutModuleInput[] | Prisma.UserProgressUncheckedCreateWithoutModuleInput[]
  connectOrCreate?: Prisma.UserProgressCreateOrConnectWithoutModuleInput | Prisma.UserProgressCreateOrConnectWithoutModuleInput[]
  upsert?: Prisma.UserProgressUpsertWithWhereUniqueWithoutModuleInput | Prisma.UserProgressUpsertWithWhereUniqueWithoutModuleInput[]
  createMany?: Prisma.UserProgressCreateManyModuleInputEnvelope
  set?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  disconnect?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  delete?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  connect?: Prisma.UserProgressWhereUniqueInput | Prisma.UserProgressWhereUniqueInput[]
  update?: Prisma.UserProgressUpdateWithWhereUniqueWithoutModuleInput | Prisma.UserProgressUpdateWithWhereUniqueWithoutModuleInput[]
  updateMany?: Prisma.UserProgressUpdateManyWithWhereWithoutModuleInput | Prisma.UserProgressUpdateManyWithWhereWithoutModuleInput[]
  deleteMany?: Prisma.UserProgressScalarWhereInput | Prisma.UserProgressScalarWhereInput[]
}

export type EnumProgressStatusFieldUpdateOperationsInput = {
  set?: $Enums.ProgressStatus
}

export type DecimalFieldUpdateOperationsInput = {
  set?: runtime.Decimal | runtime.DecimalJsLike | number | string
  increment?: runtime.Decimal | runtime.DecimalJsLike | number | string
  decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string
  multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string
  divide?: runtime.Decimal | runtime.DecimalJsLike | number | string
}

export type NullableDateTimeFieldUpdateOperationsInput = {
  set?: Date | string | null
}

export type UserProgressCreateWithoutUserInput = {
  progress_id?: string
  status?: $Enums.ProgressStatus
  completion_percentage?: runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Date | string | null
  completed_at?: Date | string | null
  last_accessed_at?: Date | string
  module: Prisma.ModuleCreateNestedOneWithoutUserProgressInput
}

export type UserProgressUncheckedCreateWithoutUserInput = {
  progress_id?: string
  module_id: string
  status?: $Enums.ProgressStatus
  completion_percentage?: runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Date | string | null
  completed_at?: Date | string | null
  last_accessed_at?: Date | string
}

export type UserProgressCreateOrConnectWithoutUserInput = {
  where: Prisma.UserProgressWhereUniqueInput
  create: Prisma.XOR<Prisma.UserProgressCreateWithoutUserInput, Prisma.UserProgressUncheckedCreateWithoutUserInput>
}

export type UserProgressCreateManyUserInputEnvelope = {
  data: Prisma.UserProgressCreateManyUserInput | Prisma.UserProgressCreateManyUserInput[]
  skipDuplicates?: boolean
}

export type UserProgressUpsertWithWhereUniqueWithoutUserInput = {
  where: Prisma.UserProgressWhereUniqueInput
  update: Prisma.XOR<Prisma.UserProgressUpdateWithoutUserInput, Prisma.UserProgressUncheckedUpdateWithoutUserInput>
  create: Prisma.XOR<Prisma.UserProgressCreateWithoutUserInput, Prisma.UserProgressUncheckedCreateWithoutUserInput>
}

export type UserProgressUpdateWithWhereUniqueWithoutUserInput = {
  where: Prisma.UserProgressWhereUniqueInput
  data: Prisma.XOR<Prisma.UserProgressUpdateWithoutUserInput, Prisma.UserProgressUncheckedUpdateWithoutUserInput>
}

export type UserProgressUpdateManyWithWhereWithoutUserInput = {
  where: Prisma.UserProgressScalarWhereInput
  data: Prisma.XOR<Prisma.UserProgressUpdateManyMutationInput, Prisma.UserProgressUncheckedUpdateManyWithoutUserInput>
}

export type UserProgressScalarWhereInput = {
  AND?: Prisma.UserProgressScalarWhereInput | Prisma.UserProgressScalarWhereInput[]
  OR?: Prisma.UserProgressScalarWhereInput[]
  NOT?: Prisma.UserProgressScalarWhereInput | Prisma.UserProgressScalarWhereInput[]
  progress_id?: Prisma.StringFilter<"UserProgress"> | string
  user_id?: Prisma.StringFilter<"UserProgress"> | string
  module_id?: Prisma.StringFilter<"UserProgress"> | string
  status?: Prisma.EnumProgressStatusFilter<"UserProgress"> | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalFilter<"UserProgress"> | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.DateTimeNullableFilter<"UserProgress"> | Date | string | null
  completed_at?: Prisma.DateTimeNullableFilter<"UserProgress"> | Date | string | null
  last_accessed_at?: Prisma.DateTimeFilter<"UserProgress"> | Date | string
}

export type UserProgressCreateWithoutModuleInput = {
  progress_id?: string
  status?: $Enums.ProgressStatus
  completion_percentage?: runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Date | string | null
  completed_at?: Date | string | null
  last_accessed_at?: Date | string
  user: Prisma.UserCreateNestedOneWithoutProgressInput
}

export type UserProgressUncheckedCreateWithoutModuleInput = {
  progress_id?: string
  user_id: string
  status?: $Enums.ProgressStatus
  completion_percentage?: runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Date | string | null
  completed_at?: Date | string | null
  last_accessed_at?: Date | string
}

export type UserProgressCreateOrConnectWithoutModuleInput = {
  where: Prisma.UserProgressWhereUniqueInput
  create: Prisma.XOR<Prisma.UserProgressCreateWithoutModuleInput, Prisma.UserProgressUncheckedCreateWithoutModuleInput>
}

export type UserProgressCreateManyModuleInputEnvelope = {
  data: Prisma.UserProgressCreateManyModuleInput | Prisma.UserProgressCreateManyModuleInput[]
  skipDuplicates?: boolean
}

export type UserProgressUpsertWithWhereUniqueWithoutModuleInput = {
  where: Prisma.UserProgressWhereUniqueInput
  update: Prisma.XOR<Prisma.UserProgressUpdateWithoutModuleInput, Prisma.UserProgressUncheckedUpdateWithoutModuleInput>
  create: Prisma.XOR<Prisma.UserProgressCreateWithoutModuleInput, Prisma.UserProgressUncheckedCreateWithoutModuleInput>
}

export type UserProgressUpdateWithWhereUniqueWithoutModuleInput = {
  where: Prisma.UserProgressWhereUniqueInput
  data: Prisma.XOR<Prisma.UserProgressUpdateWithoutModuleInput, Prisma.UserProgressUncheckedUpdateWithoutModuleInput>
}

export type UserProgressUpdateManyWithWhereWithoutModuleInput = {
  where: Prisma.UserProgressScalarWhereInput
  data: Prisma.XOR<Prisma.UserProgressUpdateManyMutationInput, Prisma.UserProgressUncheckedUpdateManyWithoutModuleInput>
}

export type UserProgressCreateManyUserInput = {
  progress_id?: string
  module_id: string
  status?: $Enums.ProgressStatus
  completion_percentage?: runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Date | string | null
  completed_at?: Date | string | null
  last_accessed_at?: Date | string
}

export type UserProgressUpdateWithoutUserInput = {
  progress_id?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumProgressStatusFieldUpdateOperationsInput | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  last_accessed_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  module?: Prisma.ModuleUpdateOneRequiredWithoutUserProgressNestedInput
}

export type UserProgressUncheckedUpdateWithoutUserInput = {
  progress_id?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumProgressStatusFieldUpdateOperationsInput | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  last_accessed_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type UserProgressUncheckedUpdateManyWithoutUserInput = {
  progress_id?: Prisma.StringFieldUpdateOperationsInput | string
  module_id?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumProgressStatusFieldUpdateOperationsInput | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  last_accessed_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type UserProgressCreateManyModuleInput = {
  progress_id?: string
  user_id: string
  status?: $Enums.ProgressStatus
  completion_percentage?: runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Date | string | null
  completed_at?: Date | string | null
  last_accessed_at?: Date | string
}

export type UserProgressUpdateWithoutModuleInput = {
  progress_id?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumProgressStatusFieldUpdateOperationsInput | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  last_accessed_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  user?: Prisma.UserUpdateOneRequiredWithoutProgressNestedInput
}

export type UserProgressUncheckedUpdateWithoutModuleInput = {
  progress_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumProgressStatusFieldUpdateOperationsInput | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  last_accessed_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type UserProgressUncheckedUpdateManyWithoutModuleInput = {
  progress_id?: Prisma.StringFieldUpdateOperationsInput | string
  user_id?: Prisma.StringFieldUpdateOperationsInput | string
  status?: Prisma.EnumProgressStatusFieldUpdateOperationsInput | $Enums.ProgressStatus
  completion_percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string
  started_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  last_accessed_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}



export type UserProgressSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  progress_id?: boolean
  user_id?: boolean
  module_id?: boolean
  status?: boolean
  completion_percentage?: boolean
  started_at?: boolean
  completed_at?: boolean
  last_accessed_at?: boolean
  module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}, ExtArgs["result"]["userProgress"]>



export type UserProgressSelectScalar = {
  progress_id?: boolean
  user_id?: boolean
  module_id?: boolean
  status?: boolean
  completion_percentage?: boolean
  started_at?: boolean
  completed_at?: boolean
  last_accessed_at?: boolean
}

export type UserProgressOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"progress_id" | "user_id" | "module_id" | "status" | "completion_percentage" | "started_at" | "completed_at" | "last_accessed_at", ExtArgs["result"]["userProgress"]>
export type UserProgressInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  module?: boolean | Prisma.ModuleDefaultArgs<ExtArgs>
  user?: boolean | Prisma.UserDefaultArgs<ExtArgs>
}

export type $UserProgressPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "UserProgress"
  objects: {
    module: Prisma.$ModulePayload<ExtArgs>
    user: Prisma.$UserPayload<ExtArgs>
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    progress_id: string
    user_id: string
    module_id: string
    status: $Enums.ProgressStatus
    completion_percentage: runtime.Decimal
    started_at: Date | null
    completed_at: Date | null
    last_accessed_at: Date
  }, ExtArgs["result"]["userProgress"]>
  composites: {}
}

export type UserProgressGetPayload<S extends boolean | null | undefined | UserProgressDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserProgressPayload, S>

export type UserProgressCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<UserProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserProgressCountAggregateInputType | true
  }

export interface UserProgressDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProgress'], meta: { name: 'UserProgress' } }
  /**
   * Find zero or one UserProgress that matches the filter.
   * @param {UserProgressFindUniqueArgs} args - Arguments to find a UserProgress
   * @example
   * // Get one UserProgress
   * const userProgress = await prisma.userProgress.findUnique({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUnique<T extends UserProgressFindUniqueArgs>(args: Prisma.SelectSubset<T, UserProgressFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserProgressClient<runtime.Types.Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find one UserProgress that matches the filter or throw an error with `error.code='P2025'`
   * if no matches were found.
   * @param {UserProgressFindUniqueOrThrowArgs} args - Arguments to find a UserProgress
   * @example
   * // Get one UserProgress
   * const userProgress = await prisma.userProgress.findUniqueOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findUniqueOrThrow<T extends UserProgressFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserProgressClient<runtime.Types.Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first UserProgress that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserProgressFindFirstArgs} args - Arguments to find a UserProgress
   * @example
   * // Get one UserProgress
   * const userProgress = await prisma.userProgress.findFirst({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirst<T extends UserProgressFindFirstArgs>(args?: Prisma.SelectSubset<T, UserProgressFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserProgressClient<runtime.Types.Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  /**
   * Find the first UserProgress that matches the filter or
   * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserProgressFindFirstOrThrowArgs} args - Arguments to find a UserProgress
   * @example
   * // Get one UserProgress
   * const userProgress = await prisma.userProgress.findFirstOrThrow({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   */
  findFirstOrThrow<T extends UserProgressFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserProgressClient<runtime.Types.Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Find zero or more UserProgresses that matches the filter.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserProgressFindManyArgs} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all UserProgresses
   * const userProgresses = await prisma.userProgress.findMany()
   * 
   * // Get first 10 UserProgresses
   * const userProgresses = await prisma.userProgress.findMany({ take: 10 })
   * 
   * // Only select the `progress_id`
   * const userProgressWithProgress_idOnly = await prisma.userProgress.findMany({ select: { progress_id: true } })
   * 
   */
  findMany<T extends UserProgressFindManyArgs>(args?: Prisma.SelectSubset<T, UserProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  /**
   * Create a UserProgress.
   * @param {UserProgressCreateArgs} args - Arguments to create a UserProgress.
   * @example
   * // Create one UserProgress
   * const UserProgress = await prisma.userProgress.create({
   *   data: {
   *     // ... data to create a UserProgress
   *   }
   * })
   * 
   */
  create<T extends UserProgressCreateArgs>(args: Prisma.SelectSubset<T, UserProgressCreateArgs<ExtArgs>>): Prisma.Prisma__UserProgressClient<runtime.Types.Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Create many UserProgresses.
   * @param {UserProgressCreateManyArgs} args - Arguments to create many UserProgresses.
   * @example
   * // Create many UserProgresses
   * const userProgress = await prisma.userProgress.createMany({
   *   data: [
   *     // ... provide data here
   *   ]
   * })
   *     
   */
  createMany<T extends UserProgressCreateManyArgs>(args?: Prisma.SelectSubset<T, UserProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Delete a UserProgress.
   * @param {UserProgressDeleteArgs} args - Arguments to delete one UserProgress.
   * @example
   * // Delete one UserProgress
   * const UserProgress = await prisma.userProgress.delete({
   *   where: {
   *     // ... filter to delete one UserProgress
   *   }
   * })
   * 
   */
  delete<T extends UserProgressDeleteArgs>(args: Prisma.SelectSubset<T, UserProgressDeleteArgs<ExtArgs>>): Prisma.Prisma__UserProgressClient<runtime.Types.Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Update one UserProgress.
   * @param {UserProgressUpdateArgs} args - Arguments to update one UserProgress.
   * @example
   * // Update one UserProgress
   * const userProgress = await prisma.userProgress.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  update<T extends UserProgressUpdateArgs>(args: Prisma.SelectSubset<T, UserProgressUpdateArgs<ExtArgs>>): Prisma.Prisma__UserProgressClient<runtime.Types.Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  /**
   * Delete zero or more UserProgresses.
   * @param {UserProgressDeleteManyArgs} args - Arguments to filter UserProgresses to delete.
   * @example
   * // Delete a few UserProgresses
   * const { count } = await prisma.userProgress.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
   */
  deleteMany<T extends UserProgressDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Update zero or more UserProgresses.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserProgressUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many UserProgresses
   * const userProgress = await prisma.userProgress.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provide data here
   *   }
   * })
   * 
   */
  updateMany<T extends UserProgressUpdateManyArgs>(args: Prisma.SelectSubset<T, UserProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  /**
   * Create or update one UserProgress.
   * @param {UserProgressUpsertArgs} args - Arguments to update or create a UserProgress.
   * @example
   * // Update or create a UserProgress
   * const userProgress = await prisma.userProgress.upsert({
   *   create: {
   *     // ... data to create a UserProgress
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the UserProgress we want to update
   *   }
   * })
   */
  upsert<T extends UserProgressUpsertArgs>(args: Prisma.SelectSubset<T, UserProgressUpsertArgs<ExtArgs>>): Prisma.Prisma__UserProgressClient<runtime.Types.Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


  /**
   * Count the number of UserProgresses.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserProgressCountArgs} args - Arguments to filter UserProgresses to count.
   * @example
   * // Count the number of UserProgresses
   * const count = await prisma.userProgress.count({
   *   where: {
   *     // ... the filter for the UserProgresses we want to count
   *   }
   * })
  **/
  count<T extends UserProgressCountArgs>(
    args?: Prisma.Subset<T, UserProgressCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], UserProgressCountAggregateOutputType>
      : number
  >

  /**
   * Allows you to perform aggregations operations on a UserProgress.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
   * @example
   * // Ordered by age ascending
   * // Where email contains prisma.io
   * // Limited to the 10 users
   * const aggregations = await prisma.user.aggregate({
   *   _avg: {
   *     age: true,
   *   },
   *   where: {
   *     email: {
   *       contains: "prisma.io",
   *     },
   *   },
   *   orderBy: {
   *     age: "asc",
   *   },
   *   take: 10,
   * })
  **/
  aggregate<T extends UserProgressAggregateArgs>(args: Prisma.Subset<T, UserProgressAggregateArgs>): Prisma.PrismaPromise<GetUserProgressAggregateType<T>>

  /**
   * Group by UserProgress.
   * Note, that providing `undefined` is treated as the value not being there.
   * Read more here: https://pris.ly/d/null-undefined
   * @param {UserProgressGroupByArgs} args - Group by arguments.
   * @example
   * // Group by city, order by createdAt, get count
   * const result = await prisma.user.groupBy({
   *   by: ['city', 'createdAt'],
   *   orderBy: {
   *     createdAt: true
   *   },
   *   _count: {
   *     _all: true
   *   },
   * })
   * 
  **/
  groupBy<
    T extends UserProgressGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: UserProgressGroupByArgs['orderBy'] }
      : { orderBy?: UserProgressGroupByArgs['orderBy'] },
    OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>,
    ByFields extends Prisma.MaybeTupleToUnion<T['by']>,
    ByValid extends Prisma.Has<ByFields, OrderFields>,
    HavingFields extends Prisma.GetHavingFields<T['having']>,
    HavingValid extends Prisma.Has<ByFields, HavingFields>,
    ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False,
    InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
          ? never
          : P extends string
          ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
          : [
              Error,
              'Field ',
              P,
              ` in "having" needs to be provided in "by"`,
            ]
      }[HavingFields]
    : 'take' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
          ? never
          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
      }[OrderFields]
  >(args: Prisma.SubsetIntersection<T, UserProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
/**
 * Fields of the UserProgress model
 */
readonly fields: UserProgressFieldRefs;
}

/**
 * The delegate class that acts as a "Promise-like" for UserProgress.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__UserProgressClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  module<T extends Prisma.ModuleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ModuleDefaultArgs<ExtArgs>>): Prisma.Prisma__ModuleClient<runtime.Types.Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}




/**
 * Fields of the UserProgress model
 */
export interface UserProgressFieldRefs {
  readonly progress_id: Prisma.FieldRef<"UserProgress", 'String'>
  readonly user_id: Prisma.FieldRef<"UserProgress", 'String'>
  readonly module_id: Prisma.FieldRef<"UserProgress", 'String'>
  readonly status: Prisma.FieldRef<"UserProgress", 'ProgressStatus'>
  readonly completion_percentage: Prisma.FieldRef<"UserProgress", 'Decimal'>
  readonly started_at: Prisma.FieldRef<"UserProgress", 'DateTime'>
  readonly completed_at: Prisma.FieldRef<"UserProgress", 'DateTime'>
  readonly last_accessed_at: Prisma.FieldRef<"UserProgress", 'DateTime'>
}
    

// Custom InputTypes
/**
 * UserProgress findUnique
 */
export type UserProgressFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the UserProgress
   */
  select?: Prisma.UserProgressSelect<ExtArgs> | null
  /**
   * Omit specific fields from the UserProgress
   */
  omit?: Prisma.UserProgressOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserProgressInclude<ExtArgs> | null
  /**
   * Filter, which UserProgress to fetch.
   */
  where: Prisma.UserProgressWhereUniqueInput
}

/**
 * UserProgress findUniqueOrThrow
 */
export type UserProgressFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the UserProgress
   */
  select?: Prisma.UserProgressSelect<ExtArgs> | null
  /**
   * Omit specific fields from the UserProgress
   */
  omit?: Prisma.UserProgressOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserProgressInclude<ExtArgs> | null
  /**
   * Filter, which UserProgress to fetch.
   */
  where: Prisma.UserProgressWhereUniqueInput
}

/**
 * UserProgress findFirst
 */
export type UserProgressFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the UserProgress
   */
  select?: Prisma.UserProgressSelect<ExtArgs> | null
  /**
   * Omit specific fields from the UserProgress
   */
  omit?: Prisma.UserProgressOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserProgressInclude<ExtArgs> | null
  /**
   * Filter, which UserProgress to fetch.
   */
  where?: Prisma.UserProgressWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of UserProgresses to fetch.
   */
  orderBy?: Prisma.UserProgressOrderByWithRelationInput | Prisma.UserProgressOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for UserProgresses.
   */
  cursor?: Prisma.UserProgressWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` UserProgresses from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` UserProgresses.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of UserProgresses.
   */
  distinct?: Prisma.UserProgressScalarFieldEnum | Prisma.UserProgressScalarFieldEnum[]
}

/**
 * UserProgress findFirstOrThrow
 */
export type UserProgressFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the UserProgress
   */
  select?: Prisma.UserProgressSelect<ExtArgs> | null
  /**
   * Omit specific fields from the UserProgress
   */
  omit?: Prisma.UserProgressOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserProgressInclude<ExtArgs> | null
  /**
   * Filter, which UserProgress to fetch.
   */
  where?: Prisma.UserProgressWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of UserProgresses to fetch.
   */
  orderBy?: Prisma.UserProgressOrderByWithRelationInput | Prisma.UserProgressOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for searching for UserProgresses.
   */
  cursor?: Prisma.UserProgressWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` UserProgresses from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` UserProgresses.
   */
  skip?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
   * 
   * Filter by unique combinations of UserProgresses.
   */
  distinct?: Prisma.UserProgressScalarFieldEnum | Prisma.UserProgressScalarFieldEnum[]
}

/**
 * UserProgress findMany
 */
export type UserProgressFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the UserProgress
   */
  select?: Prisma.UserProgressSelect<ExtArgs> | null
  /**
   * Omit specific fields from the UserProgress
   */
  omit?: Prisma.UserProgressOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserProgressInclude<ExtArgs> | null
  /**
   * Filter, which UserProgresses to fetch.
   */
  where?: Prisma.UserProgressWhereInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   * 
   * Determine the order of UserProgresses to fetch.
   */
  orderBy?: Prisma.UserProgressOrderByWithRelationInput | Prisma.UserProgressOrderByWithRelationInput[]
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   * 
   * Sets the position for listing UserProgresses.
   */
  cursor?: Prisma.UserProgressWhereUniqueInput
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Take `±n` UserProgresses from the position of the cursor.
   */
  take?: number
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   * 
   * Skip the first `n` UserProgresses.
   */
  skip?: number
  distinct?: Prisma.UserProgressScalarFieldEnum | Prisma.UserProgressScalarFieldEnum[]
}

/**
 * UserProgress create
 */
export type UserProgressCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the UserProgress
   */
  select?: Prisma.UserProgressSelect<ExtArgs> | null
  /**
   * Omit specific fields from the UserProgress
   */
  omit?: Prisma.UserProgressOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserProgressInclude<ExtArgs> | null
  /**
   * The data needed to create a UserProgress.
   */
  data: Prisma.XOR<Prisma.UserProgressCreateInput, Prisma.UserProgressUncheckedCreateInput>
}

/**
 * UserProgress createMany
 */
export type UserProgressCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to create many UserProgresses.
   */
  data: Prisma.UserProgressCreateManyInput | Prisma.UserProgressCreateManyInput[]
  skipDuplicates?: boolean
}

/**
 * UserProgress update
 */
export type UserProgressUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the UserProgress
   */
  select?: Prisma.UserProgressSelect<ExtArgs> | null
  /**
   * Omit specific fields from the UserProgress
   */
  omit?: Prisma.UserProgressOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserProgressInclude<ExtArgs> | null
  /**
   * The data needed to update a UserProgress.
   */
  data: Prisma.XOR<Prisma.UserProgressUpdateInput, Prisma.UserProgressUncheckedUpdateInput>
  /**
   * Choose, which UserProgress to update.
   */
  where: Prisma.UserProgressWhereUniqueInput
}

/**
 * UserProgress updateMany
 */
export type UserProgressUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * The data used to update UserProgresses.
   */
  data: Prisma.XOR<Prisma.UserProgressUpdateManyMutationInput, Prisma.UserProgressUncheckedUpdateManyInput>
  /**
   * Filter which UserProgresses to update
   */
  where?: Prisma.UserProgressWhereInput
  /**
   * Limit how many UserProgresses to update.
   */
  limit?: number
}

/**
 * UserProgress upsert
 */
export type UserProgressUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the UserProgress
   */
  select?: Prisma.UserProgressSelect<ExtArgs> | null
  /**
   * Omit specific fields from the UserProgress
   */
  omit?: Prisma.UserProgressOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserProgressInclude<ExtArgs> | null
  /**
   * The filter to search for the UserProgress to update in case it exists.
   */
  where: Prisma.UserProgressWhereUniqueInput
  /**
   * In case the UserProgress found by the `where` argument doesn't exist, create a new UserProgress with this data.
   */
  create: Prisma.XOR<Prisma.UserProgressCreateInput, Prisma.UserProgressUncheckedCreateInput>
  /**
   * In case the UserProgress was found with the provided `where` argument, update it with this data.
   */
  update: Prisma.XOR<Prisma.UserProgressUpdateInput, Prisma.UserProgressUncheckedUpdateInput>
}

/**
 * UserProgress delete
 */
export type UserProgressDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the UserProgress
   */
  select?: Prisma.UserProgressSelect<ExtArgs> | null
  /**
   * Omit specific fields from the UserProgress
   */
  omit?: Prisma.UserProgressOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserProgressInclude<ExtArgs> | null
  /**
   * Filter which UserProgress to delete.
   */
  where: Prisma.UserProgressWhereUniqueInput
}

/**
 * UserProgress deleteMany
 */
export type UserProgressDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Filter which UserProgresses to delete
   */
  where?: Prisma.UserProgressWhereInput
  /**
   * Limit how many UserProgresses to delete.
   */
  limit?: number
}

/**
 * UserProgress without action
 */
export type UserProgressDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  /**
   * Select specific fields to fetch from the UserProgress
   */
  select?: Prisma.UserProgressSelect<ExtArgs> | null
  /**
   * Omit specific fields from the UserProgress
   */
  omit?: Prisma.UserProgressOmit<ExtArgs> | null
  /**
   * Choose, which related nodes to fetch as well
   */
  include?: Prisma.UserProgressInclude<ExtArgs> | null
}

```

## File: src/api/notes/notes.controller.ts

```typescript
import { Request, Response } from 'express';
import { NoteType } from '@/generated/prisma/client';
import { createChatCompletion, extractFirstMessageContent, ChatMessage } from '@/services/groq.service';
import { createModuleNote, getModuleById, getNextSequenceOrder, listModuleNotes, deleteNote } from './notes.services';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function aiChatHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;
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

    const moduleContentPreview = moduleMeta.content ? `${moduleMeta.content.substring(0, 1000)}...` : "No content available for this module.";
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are a tutor. Context: Module "${moduleMeta.title}". Content: "${moduleContentPreview}". Answer specific to this context.`,
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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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

export async function deleteNoteHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.user_id!;
    const { noteId } = req.params;
    await deleteNote(noteId, userId);
    return res.status(200).json({ success: true, data: { message: "Note deleted" }});
  } catch (e) {
    return res.status(500).json({ success: false });
  }
}
```

## File: src/api/notes/notes.routes.ts

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

## File: src/api/notes/notes.services.ts

```typescript
import { NoteType } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';

export async function getModuleById(moduleId: string) {
  return prisma.module.findUnique({
    where: { module_id: moduleId },
    select: { module_id: true, title: true, content: true },
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

export async function deleteNote(noteId: string, userId: string) {
  // Ensure user owns the note
  const note = await prisma.aINote.findUnique({ where: { note_id: noteId }});
  if (!note || note.user_id !== userId) throw new Error("Unauthorized");
  
  return prisma.aINote.delete({
    where: { note_id: noteId }
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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }

    const { exerciseId } = req.params;
    const { answer_text } = req.body;

    const submission = await submitExercise(exerciseId, userId, answer_text);
    
    if (!submission) {
      return res.status(404).json({ success: false, data: null, error: 'Exercise not found' });
    }

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

## File: src/api/exercises/exercises.services.ts

```typescript
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/services/prisma.service";

export async function listExercises(moduleId?: string) {
  const where = moduleId ? { module_id: moduleId } : undefined;
  return prisma.exercise.findMany({
    where,
    orderBy: { created_at: "desc" },
  });
}

type JsonPayload = Prisma.InputJsonValue;

export async function createExercise(payload: {
  module_id: string;
  title: string;
  description: string;
  difficulty?: "easy" | "medium" | "hard";
  examples?: JsonPayload;
}) {
  return prisma.exercise.create({
    data: {
      module_id: payload.module_id,
      title: payload.title,
      description: payload.description,
      difficulty: payload.difficulty ?? "medium",
      examples: payload.examples,
    },
  });
}

export async function updateExercise(
  exerciseId: string,
  payload: Partial<{
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    examples?: JsonPayload;
  }>,
) {
  const existing = await prisma.exercise.findUnique({
    where: { exercise_id: exerciseId },
  });
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
  const existing = await prisma.exercise.findUnique({
    where: { exercise_id: exerciseId },
  });
  if (!existing) {
    return null;
  }
  return prisma.exercise.delete({ where: { exercise_id: exerciseId } });
}

export async function submitExercise(
  exerciseId: string,
  userId: string,
  answerText: string,
) {
  // Verify exercise exists
  const exercise = await prisma.exercise.findUnique({
    where: { exercise_id: exerciseId },
  });

  if (!exercise) {
    return null;
  }

  // Create submission record
  return prisma.exerciseSubmission.create({
    data: {
      exercise_id: exerciseId,
      user_id: userId,
      answer_text: answerText,
    },
    include: {
      exercise: {
        select: {
          title: true,
          difficulty: true,
        },
      },
    },
  });
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

## File: src/api/progress/progress.controller.ts

```typescript
import { Request, Response } from 'express';
import { findModuleProgress, updateModuleProgress, getUserDashboardOverview, getRoadmapProgress } from './progress.services';


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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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

export async function getOverviewHandler(req: Request, res: Response) {
  const userId = req.user?.user_id!;
  const data = await getUserDashboardOverview(userId);
  return res.status(200).json({ success: true, data });
}

export async function getRoadmapProgressHandler(req: Request, res: Response) {
  const userId = req.user?.user_id!;
  const { roadmapId } = req.params;
  const data = await getRoadmapProgress(userId, roadmapId);
  if (!data) return res.status(404).json({ success: false, error: 'Roadmap not found' });
  return res.status(200).json({ success: true, data });
}
```

## File: src/api/progress/progress.routes.ts

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

## File: src/api/progress/progress.services.ts

```typescript
import { ProgressStatus } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';

export async function findModuleProgress(userId: string, moduleId: string) {
  return prisma.userProgress.findUnique({
    where: { user_id_module_id: { user_id: userId, module_id: moduleId } },
  });
}

export async function updateModuleProgress(userId: string, moduleId: string, status: ProgressStatus, completionPercentage: number) {
  const updatedProgress = await prisma.userProgress.upsert({
    where: { user_id_module_id: { user_id: userId, module_id: moduleId } },
    create: {
      user_id: userId,
      module_id: moduleId,
      status,
      completion_percentage: completionPercentage,
      started_at: status === 'in_progress' ? new Date() : undefined,
      completed_at: status === 'completed' ? new Date() : undefined,
    },
    update: {
      status,
      completion_percentage: completionPercentage,
      completed_at: status === 'completed' ? new Date() : undefined,
    },
  });

  if (status === 'completed') {
    await checkAndIssueCertificate(userId, moduleId);
  }

  return updatedProgress;
}

async function checkAndIssueCertificate(userId: string, moduleId: string) {
  const moduleData = await prisma.module.findUnique({
    where: { module_id: moduleId },
    select: { roadmap_id: true, roadmap: { select: { title: true } } }
  });

  if (!moduleData) return;

  const roadmapId = moduleData.roadmap_id;

  const totalModules = await prisma.module.count({
    where: { roadmap_id: roadmapId }
  });

  const completedModules = await prisma.userProgress.count({
    where: {
      user_id: userId,
      module: { roadmap_id: roadmapId },
      status: 'completed'
    }
  });

  if (totalModules > 0 && completedModules === totalModules) {
    const existingCert = await prisma.certificate.findUnique({
      where: { user_id_roadmap_id: { user_id: userId, roadmap_id: roadmapId } }
    });

    if (!existingCert) {
      await prisma.certificate.create({
        data: {
          user_id: userId,
          roadmap_id: roadmapId,
          certificate_name: `${moduleData.roadmap.title} Certificate of Completion`,
          pdf_url: `/api/certificates/${userId}/${roadmapId}.pdf`
        }
      });
      console.log(`Certificate issued to user ${userId} for roadmap ${roadmapId}`);
    }
  }
}

export async function getUserDashboardOverview(userId: string) {
  const distinctRoadmaps = await prisma.userProgress.findMany({
    where: { user_id: userId },
    select: { module: { select: { roadmap_id: true } } },
    distinct: ['module_id']
  });
  
  const roadmapIds = new Set(distinctRoadmaps.map(p => p.module.roadmap_id));
  
  const completedModules = await prisma.userProgress.count({
    where: { user_id: userId, status: 'completed' }
  });

  const allProgress = await prisma.userProgress.findMany({
    where: { user_id: userId },
    select: { completion_percentage: true }
  });
  
  const avgCompletion = allProgress.length > 0 
    ? allProgress.reduce((acc, curr) => acc + Number(curr.completion_percentage), 0) / allProgress.length
    : 0;

  return {
    enrolled_roadmaps: roadmapIds.size,
    completed_modules: completedModules,
    average_completion: avgCompletion.toFixed(2)
  };
}

export async function getRoadmapProgress(userId: string, roadmapId: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmap_id: roadmapId },
    select: { title: true }
  });

  if (!roadmap) return null;

  const modules = await prisma.module.findMany({
    where: { roadmap_id: roadmapId },
    include: {
      userProgress: {
        where: { user_id: userId }
      }
    },
    orderBy: { order_index: 'asc' }
  });

  const progressData = modules.map(m => ({
    module_id: m.module_id,
    title: m.title,
    status: m.userProgress[0]?.status ?? 'not_started',
    percentage: m.userProgress[0]?.completion_percentage ?? 0
  }));

  const total = progressData.length;
  const completed = progressData.filter(p => p.status === 'completed').length;
  const overall = total > 0 ? (completed / total) * 100 : 0;

  return {
    roadmap_title: roadmap.title,
    overall_progress: overall,
    modules: progressData
  };
}
```

## File: src/api/progress/progress.validation.ts

```typescript
import { ProgressStatus } from '@/generated/prisma/client';
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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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

## File: src/api/interviews/interviews.services.ts

```typescript
import { InterviewType, Prisma } from '@/generated/prisma/client';
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

  const completion = await createChatCompletion([systemMessage, userMessage], 'openai/gpt-oss-20b', 0.5);
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
import { InterviewType } from '@/generated/prisma/client';
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

## File: src/api/interviews/interviews.websocket.ts

```typescript
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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;
    
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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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

## File: src/api/calendar/calendar.services.ts

```typescript
import { Prisma, LearningEvent, EventStatus } from '@/generated/prisma/client';
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
  if (typeof value !== 'string') return false;
  
  const date = new Date(value);
  if (isNaN(date.getTime())) return false;
  
  // RFC 3339/ISO 8601 patterns
  const isoPatterns = [
    // YYYY-MM-DDTHH:mm:ss.sssZ (UTC)
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/,
    
    // YYYY-MM-DDTHH:mm:ss.sss±HH:mm (timezone offset)
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?[+-]\d{2}:\d{2}$/,
    
    // YYYY-MM-DDTHH:mm:ssZ (UTC, no milliseconds)
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,
    
    // YYYY-MM-DD (date only)
    /^\d{4}-\d{2}-\d{2}$/
  ];
  
  return isoPatterns.some(pattern => pattern.test(value));
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

## File: src/api/auth/auth.controller.ts

```typescript
import { Request, Response } from 'express';
import { createUser, validateUser } from './auth.services';
import { RegisterInput, LoginInput } from './auth.validation';
import { signToken, setAuthCookie, clearAuthCookie } from '@/services/jwt.service';
import { validateExerciseSubmission } from '../exercises/exercises.validation';


export async function registerUserHandler(req: Request, res: Response) {
    try {
        const userInput: RegisterInput = req.body;
        const user = await createUser(userInput);
        const { password_hash, ...userResponse} = user;

        const token = signToken({
            user_id: user.user_id,
            email: user.email,
            role: user.role
        });
        setAuthCookie(res, token);
        
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

export async function loginUserHandler(req: Request, res: Response) {
    try {
        const loginInput: LoginInput = req.body;
        const user = await validateUser(loginInput);

        if (!user) {
            return res.status(401).json({ success: false, data: null, error: 'Invalid email or password' });
        }

        const token = signToken({
            user_id: user.user_id,
            email: user.email,
            role: user.role
        });
        setAuthCookie(res, token);

        const {password_hash, ...userResponse} = user;
        return res.status(200).json({ success: true, data: userResponse, error: null });
    } catch (error) {
        return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
    }
}

export async function logoutUserHandler(req: Request, res: Response) {
    clearAuthCookie(res);
    return res.status(200).json({ success: true, data: { message: 'Logged out successfully' }, error: null });
}
```

## File: src/api/auth/auth.routes.ts

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

## File: src/api/auth/auth.services.ts

```typescript
import {User, PrismaClient} from '@/generated/prisma/client';
import bcrypt from 'bcryptjs';
import { RegisterInput, LoginInput } from './auth.validation';
import prisma from '@/services/prisma.service';

export async function createUser(input: RegisterInput): Promise<User> {
    const { email, password, full_name } = input;
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    return prisma.user.create({
        data: {
            email,
            password_hash,
            full_name
        },
    });
}

export async function validateUser(input: LoginInput): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { email: input.email }
    });

    if (!user) return null;

    const isValid = await bcrypt.compare(input.password, user.password_hash);
    if (!isValid) return null;

    return user;
}
```

## File: src/api/auth/auth.validation.ts

```typescript
// import { error } from "node:console";

export interface RegisterInput {
  full_name: string;
  email: string;
  password: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export function validateRegisterInput(input: RegisterInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Full name validation
  if (!input.full_name || input.full_name.trim().length < 3) {
    errors.push({
      field: 'full_name',
      message: 'Full name must be at least 3 characters long',
    });
  } else if (!/^[a-zA-Z\s'-]+$/.test(input.full_name)) {
    errors.push({
      field: 'full_name',
      message: 'Full name can only contain letters, spaces, hyphens, and apostrophes',
    });
  }

  // Email validation with more comprehensive regex
  if (!input.email) {
    errors.push({
      field: 'email',
      message: 'Email is required',
    });
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email address format',
    });
  }

  // Password validation with strength requirements
  if (!input.password) {
    errors.push({
      field: 'password',
      message: 'Password is required',
    });
  } else {
    if (input.password.length < 8) {
      errors.push({
        field: 'password',
        message: 'Password must be at least 8 characters long',
      });
    }
    
    if (!/[A-Z]/.test(input.password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one uppercase letter',
      });
    }
    
    if (!/[a-z]/.test(input.password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one lowercase letter',
      });
    }
    
    if (!/[0-9]/.test(input.password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one number',
      });
    }
    
    if (!/[^A-Za-z0-9]/.test(input.password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one special character',
      });
    }
    
    // Check for common weak passwords
    const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
    if (commonPasswords.some(common => input.password.toLowerCase().includes(common))) {
      errors.push({
        field: 'password',
        message: 'Password cannot contain common password patterns',
      });
    }
  }

  return errors;
}

export function validateLoginInput(input: LoginInput): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!input.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input.email)) {
    errors.push({ field: 'email', message: 'Invalid email address format' });
  }
  
  if (!input.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (input.password.length < 1) {
    errors.push({ field: 'password', message: 'Password cannot be empty' });
  }
  
  return errors;
}
```

## File: src/api/roadmaps/roadmaps.controller.ts

```typescript
import { Request, Response } from 'express';
import { listPublishedRoadmaps, getRoadmapWithModules, enrollUserInRoadmap } from './roadmaps.services';
import { isValidRoadmapId } from './roadmaps.validation';
import { Status } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';
import { updateRoadmap, deleteRoadmap, getModuleDetail, updateModule, deleteModule } from './roadmaps.services';


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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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


export async function createRoadmapHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.user_id;

    if (!req.body.title || !req.body.category) {
        return res.status(400).json({ success: false, error: "Title and Category are required" });
    }

    const roadmap = await prisma.roadmap.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        image_url: req.body.image_url,
        created_by: userId!, 
        status: Status.published // Defaulting to published for demo speed
      }
    });
    return res.status(201).json({ success: true, data: roadmap });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function createModuleHandler(req: Request, res: Response) {
  try {
    const {roadmapId} = req.params;

    const moduleData = await prisma.module.create({
      data: {
        roadmap_id: roadmapId,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content || "Placeholder content",
        order_index: req.body.order_index || 1,
        estimated_hours: req.body.estimated_hours || 1
    }
  });
    return res.status(201).json({ success: true, data: moduleData });
}
  catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function updateRoadmapHandler(req: Request, res: Response) {
  try {
    const { roadmapId } = req.params;
    const updated = await updateRoadmap(roadmapId, req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function deleteRoadmapHandler(req: Request, res: Response) {
  try {
    const { roadmapId } = req.params;
    await deleteRoadmap(roadmapId);
    return res.status(200).json({ success: true, data: { message: 'Roadmap deleted' } });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function getModuleHandler(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    const moduleData = await getModuleDetail(moduleId);
    if (!moduleData) return res.status(404).json({ success: false, error: 'Module not found' });
    return res.status(200).json({ success: true, data: moduleData });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function updateModuleHandler(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    const updated = await updateModule(moduleId, req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function deleteModuleHandler(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    await deleteModule(moduleId);
    return res.status(200).json({ success: true, data: { message: 'Module deleted' } });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
```

## File: src/api/roadmaps/roadmaps.routes.ts

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

## File: src/api/roadmaps/roadmaps.services.ts

```typescript
import { Status } from '@/generated/prisma/client';
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

export async function updateRoadmap(roadmapId: string, data: { title?: string; description?: string; category?: string; status?: Status; image_url?: string }) {
  return prisma.roadmap.update({
    where: { roadmap_id: roadmapId },
    data,
  });
}

export async function deleteRoadmap(roadmapId: string) {
  // Cascading delete handles modules/progress via schema
  return prisma.roadmap.delete({
    where: { roadmap_id: roadmapId },
  });
}

export async function getModuleDetail(moduleId: string) {
  return prisma.module.findUnique({
    where: { module_id: moduleId },
  });
}

export async function updateModule(moduleId: string, data: { title?: string; description?: string; content?: string; order_index?: number; estimated_hours?: number }) {
  return prisma.module.update({
    where: { module_id: moduleId },
    data,
  });
}

export async function deleteModule(moduleId: string) {
  return prisma.module.delete({
    where: { module_id: moduleId },
  });
}
```

## File: src/api/roadmaps/roadmaps.validation.ts

```typescript
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidRoadmapId(value: string) {
  return uuidRegex.test(value);
}

```

## File: src/api/cvs/cvs.controller.ts

```typescript
import { Request, Response } from 'express';
import { TemplateStyle } from '@/generated/prisma/client';
import { createCV, listUserCVs, optimizeCVSection, updateCV, getCVById } from './cvs.services';
import { generateCVPdf, streamPdf } from '@/services/pdf.service';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function listCVsHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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

export async function generatePDFHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.user_id;
    const { cvId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const cvData = await getCVById(cvId);

    if (!cvData || cvData.user_id !== userId) {
      return res.status(404).json({ success: false, error: 'CV not found' });
    }

    // Call the shared PDF service
    streamPdf(res, (doc) => {
      generateCVPdf(doc, cvData);
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
}
```

## File: src/api/cvs/cvs.routes.ts

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

## File: src/api/cvs/cvs.services.ts

```typescript
import { Prisma, TemplateStyle } from '@/generated/prisma/client';
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

export async function getCVById(cvId: string) {
  return prisma.cV.findUnique({
    where: { cv_id: cvId },
  });
}
```

## File: src/api/cvs/cvs.validation.ts

```typescript
import { TemplateStyle } from '@/generated/prisma/client';
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

## File: src/api/certificates/certificates.controller.ts

```typescript
import { Request, Response } from 'express';
import { listUserCertificates, issueCertificate } from './certificates.services';
import { generateCertificatePdf, streamPdf } from '@/services/pdf.service';
import prisma from "@/services/prisma.service";

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function listCertificatesHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

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

export async function downloadCertificatePdfHandler(req: Request, res: Response) {
  try {
    const { certificateId } = req.params;
    const userId = req.user?.user_id;

    const cert = await prisma.certificate.findUnique({
      where: { certificate_id: certificateId },
      include: { user: true, roadmap: true }
    });

    if (!cert || cert.user_id !== userId) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }

    streamPdf(res, (doc) => {
      generateCertificatePdf(doc, {
        userName: cert.user.full_name,
        courseName: cert.roadmap.title,
        date: new Date(cert.issue_date)
      });
    });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
```

## File: src/api/certificates/certificates.routes.ts

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

## File: src/config/index.ts

```typescript
import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key-change-me',
    jwtExpiresIn: '24h',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    cookieName: 'skillsync_token',
};

export default config;
```

## File: src/services/file.service.ts

```typescript
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

export async function createTempFile(buffer: Buffer, extension = '.webm'): Promise<string> {
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, `${uuidv4()}${extension}`);
  await fs.promises.writeFile(filePath, buffer);
  return filePath;
}

export async function deleteTempFile(filePath: string): Promise<void> {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete temp file ${filePath}:`, error);
  }
}
```

## File: src/services/groq.service.ts

```typescript
import Groq from 'groq-sdk';
import fs from 'fs';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groqClient = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

export async function createChatCompletion(messages: ChatMessage[], model = 'openai/gpt-oss-20b', temperature = 0.6) {
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

export async function createAudioTranscription(filePath: string, prompt?: string) {
  if (!groqClient) throw new Error('Missing GROQ_API_KEY');

  return groqClient.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-large-v3-turbo",
    prompt,
    response_format: "json",
    language: "en",
  });
}

export async function createSpeech(text: string): Promise<Buffer> {
  if (!groqClient) throw new Error('Missing GROQ_API_KEY');

  const response = await groqClient.audio.speech.create({
    model: "playai-tts",
    voice: "Fritz-PlayAI", 
    input: text,
    response_format: "wav"
  });

  return Buffer.from(await response.arrayBuffer());
}
```

## File: src/services/jwt.service.ts

```typescript
import jwt from 'jsonwebtoken';
import {Secret, SignOptions} from 'jsonwebtoken';
import { Response, CookieOptions } from 'express';
import config from '../config';
import { Role } from '@/generated/prisma/client';

interface TokenPayload {
  user_id: string;
  email: string;
  role: Role;
}

export const cookieOptions: CookieOptions = {
  httpOnly: true, 
  secure: config.env === 'production', 
  sameSite: config.env === 'production' ? 'strict' : 'lax', 
  maxAge: 24 * 60 * 60 * 1000,
};

export function signToken(payload: TokenPayload): string {
  const secret: Secret = config.jwtSecret;
  const options: SignOptions = { 
    expiresIn: config.jwtExpiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`
  };
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(config.cookieName, token, cookieOptions);
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(config.cookieName, { ...cookieOptions, maxAge: 0 });
}
```

## File: src/services/pdf.service.ts

```typescript
import PDFDocument from 'pdfkit';
import { Response } from 'express';

export function streamPdf(res: Response, buildFn: (doc: PDFKit.PDFDocument) => void) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');

  doc.pipe(res);
  buildFn(doc);
  doc.end();
}

export function generateCertificatePdf(doc: PDFKit.PDFDocument, data: { userName: string; courseName: string; date: Date }) {
  // Border
  doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

  // Header
  doc.fontSize(30).font('Helvetica-Bold').text('CERTIFICATE OF COMPLETION', { align: 'center' });
  doc.moveDown();
  
  // Body
  doc.fontSize(20).font('Helvetica').text('This is to certify that', { align: 'center' });
  doc.moveDown();
  
  doc.fontSize(25).font('Helvetica-Bold').text(data.userName, { align: 'center', underline: true });
  doc.moveDown();
  
  doc.fontSize(20).font('Helvetica').text('Has successfully completed the roadmap', { align: 'center' });
  doc.moveDown();
  
  doc.fontSize(25).font('Helvetica-Bold').text(data.courseName, { align: 'center' });
  doc.moveDown(2);
  
  // Footer
  doc.fontSize(15).text(`Date Issued: ${data.date.toLocaleDateString()}`, { align: 'center' });
  doc.text('SkillSync Platform', { align: 'center' });
}

export function generateCVPdf(doc: PDFKit.PDFDocument, data: any) {
  // Simple modern layout
  doc.fontSize(25).font('Helvetica-Bold').text(data.cv_name || 'Curriculum Vitae', { align: 'left' });
  doc.moveDown(0.5);
  
  if (data.personal_info) {
    const info = data.personal_info;
    doc.fontSize(12).font('Helvetica').text(`${info.name || ''} | ${info.email || ''} | ${info.phone || ''}`);
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
  }

  const sections = ['education', 'experience', 'skills', 'projects'];
  
  sections.forEach(section => {
    if (data[section] && Array.isArray(data[section]) && data[section].length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text(section.toUpperCase());
      doc.moveDown(0.5);
      
      data[section].forEach((item: any) => {
        const title = item.title || item.degree || item.name || '';
        const subtitle = item.company || item.school || '';
        const desc = item.description || '';
        
        doc.fontSize(12).font('Helvetica-Bold').text(title);
        if (subtitle) doc.fontSize(11).font('Helvetica-Oblique').text(subtitle);
        if (desc) doc.fontSize(10).font('Helvetica').text(desc);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }
  });
}
```

## File: src/services/prisma.service.ts

```typescript
import { PrismaClient } from '@/generated/prisma/client';
import * as dotenv from 'dotenv';
import {PrismaMariaDb} from '@prisma/adapter-mariadb';

dotenv.config();

const parsed_mysql = parseMySQLEnv();
const mysql_adapter = new PrismaMariaDb({
    host: parsed_mysql.host,
    port: parsed_mysql.port,
    user: parsed_mysql.user,
    password: parsed_mysql.password,
    database: parsed_mysql.database,
    connectionLimit: 10
});

export const prisma = new PrismaClient({
    adapter: mysql_adapter
});

dotenv.config();

export interface MySQLConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export function parseMySQLEnv(): MySQLConfig {
  const connectionString = process.env.MYSQL_CONNECTION_STRING;
  
  if (!connectionString) {
    throw new Error('MYSQL_CONNECTION_STRING environment variable is required');
  }
  
  const cleanString = connectionString.replace(/^mysql:\/\//, '');
  
  const [credentials, rest] = cleanString.split('@');
  const [hostPort, database] = rest.split('/');
  const [host, port] = hostPort.split(':');
  const [user, password] = credentials.split(':');
  
  return {
    user: decodeURIComponent(user),
    password: decodeURIComponent(password),
    host,
    port: parseInt(port, 10),
    database
  };
}

export default prisma;
```
