This is a comprehensive technical presentation of the **SkillSync Backend API**, built with **Node.js, Express, TypeScript, Prisma ORM**, and integrated with external services such as **Groq/GPT for AI assistance**.

---

## 🔧 **System Architecture Overview**

### 🏗️ High-Level Design
| Layer | Technologies | Responsibilities |
|-------|--------------|------------------|
| **HTTP Server** | Express + TypeScript | Routing, middleware, request/response handling |
| **Authentication/Authorization** | Custom header `x-user-id`, no full JWT yet (config stub present) | Stateless identity propagation for now |
| **Data Layer** | Prisma ORM + PostgreSQL (assumed) | Strictly typed data access, migrations, relationships |
| **Validation Layer** | Custom request validators, middleware (`validateRequest`) | Input sanitization and early error feedback |
| **AI Layer** | Groq SDK + LLM (`gpt-oss-20b`) | Interview feedback, AI tutoring, CV optimization (stubbed) |
| **Business Logic** | Dedicated `*.services.ts` files | Pure functions orchestrating DB + external calls |
| **Config & Secrets** | `dotenv`, `config/index.ts` | Port, JWT secret, API keys |

> ✅ Clean **MVC-inspired separation**: routes → controllers → services  
> ✅ **Prisma Client** is instantiated *per module* (**not globally**), except in `prisma.service.ts`. There's inconsistency—see analysis below.

---

## 📁 **File-by-File Structural Breakdown**

### 📄 `app.ts`
- **Role**: Main Express application factory.
- **Key Actions**:
  - Initializes Express app.
  - Enables `cors()`, `express.json()`, `express.urlencoded()`.
  - Mounts all API subrouters:
    ```ts
    /api/auth
    /api/calendar
    /api/certificates
    /api/cvs
    /api/exercises
    /api/interviews
    /api/notes     // nested under /api/modules/:moduleId
    /api/progress
    /api/roadmaps
    ```
  - Root endpoint `'/'` returns welcome JSON.

> ✅ Centralized routing. No business logic here.

---

### 📄 `server.ts`
- Boots the app on `config.port`.
- Uses config from `config/index.ts`.
- Logs runtime port.

> Minimal runtime entrypoint.

---

### 📄 `config/index.ts`
- Loads `.env`.
- Exports:
  ```ts
  {
    port: number,
    jwtSecret: string
  }
  ```
⚠️ `jwtSecret` is defined but **not used anywhere yet** — suggesting future plans for JWT auth (right now it's bare `x-user-id` header).

---

### 📄 `middleware/validateRequest.ts`
- High-order middleware.
- Accepts a **validator function** `(body) → ValidationError[]`.
- If validation fails → `400 Bad Request` + `details: ValidationError[]`.
- If exception → `500`.

> 🔁 Reusable validation layer. Used extensively.

---

### 📄 `services/prisma.service.ts`
- **Global singleton** Prisma client.
- ✅ Recommended pattern: avoids hot-reload issues and connection leaks.
- Imported as `prisma` alias via `@/services/prisma.service`.

⚠️ **Inconsistency**: Some services (e.g., `auth.services.ts`) use `new PrismaClient()` locally instead of importing this. **This is a bug** — will cause connection pool exhaustion and memory leaks.

✅ Fix: Replace *all* `new PrismaClient()` with `import prisma from '@/services/prisma.service'`.

---

### 📄 `services/groq.service.ts`
- Wraps Groq API (inference API).
- Requires `GROQ_API_KEY` in env.
- Exports:
  - `createChatCompletion(messages[], model?, temp?)`
  - `extractFirstMessageContent(completion)`
- Used in:
  - `interviews.services.ts` → feedback generation
  - `notes.controller.ts` → AI tutoring replies

> ✅ Clean abstraction. Model hardcoded to `gpt-oss-20b` — could be config-driven.

---

## 📦 **API Module Deep Dive**

Each API module follows:
```
api/<module>/
├── <module>.controller.ts   ← HTTP interface (req/res handling, auth extraction)
├── <module>.routes.ts       ← Express Router, middleware binding
├── <module>.services.ts     ← Business logic, DB/external calls
├── <module>.validation.ts   ← Input validation rules
```

Let’s now analyze **every endpoint** in full detail.

---

## 🔐 `/api/auth` — User Registration

### 🗂️ Files:
- `auth.routes.ts`
- `auth.controller.ts`
- `auth.services.ts`
- `auth.validation.ts`

### 📡 Endpoints:

#### `POST /api/auth/register`
- **Purpose**: Create new user account (no login yet).
- **Request Body** (`RegisterInput`):
  ```ts
  {
    full_name: string (≥3 chars),
    email: string (valid email regex),
    password: string (≥8 chars)
  }
  ```
- **Validation**: `validateRegisterInput()` → runs before controller.
- **Flow**:
  1. `registerUserHandler` receives validated `req.body`.
  2. Calls `createUser(input)`:
     - Hashes password via `bcrypt.genSalt(10)` + `bcrypt.hash()`.
     - Inserts into `User` table via Prisma (`prisma.user.create`).
  3. On success:
     - Strips `password_hash` from response (security).
     - Returns `201 Created` + user data (without hash).
  4. On Prisma error code `P2002` (unique constraint violation on email):
     - Returns `409 Conflict`: `"An user with this email already exists."`
  5. Otherwise `500`.

✅ **Security-aware**: password never leaves service layer; hash excluded from response.  
⚠️ **Missing**: email uniqueness not enforced at DB level? Actually, `P2002` implies there *is* a unique constraint on `email` in schema.

---

## 🗓️ `/api/calendar` — Learning Event Management

### 🗂️ Files:
- `calendar.routes.ts`
- `calendar.controller.ts`
- `calendar.services.ts`
- `calendar.validation.ts`

### 🔑 Auth Mechanism:
```ts
function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  return typeof header === 'string' && header.trim().length > 0 ? header : undefined;
}
```
- **No JWT parsing** — identity assumed from `x-user-id` (likely set by frontend/mock for now).

### 📡 Endpoints:

#### `GET /api/calendar/events`
- **Query Params (optional)**:
  - `start`: ISO 8601 string → filters `start_utc ≥ start`
  - `end`: ISO 8601 string → filters `end_utc ≤ end`
- **Validation**:
  - `validateCalendarQuery()` checks ISO validity.
- **Logic**:
  - `listLearningEvents(userId, {start, end})`:
    - Builds Prisma `where`:
      ```ts
      {
        user_id: userId,
        is_deleted: false,
        start_utc: { gte: Date },
        end_utc: { lte: Date }
      }
      ```
    - Orders by `start_utc ASC`.
- **Response**: `200` + array of `LearningEvent`.

#### `POST /api/calendar/events`
- **Body Schema**:
  ```ts
  {
    title: string (≥3 chars),
    start_utc: ISO string,
    end_utc: ISO string (≥ start_utc),
    description?: string,
    timezone?: string,
    module_id?: string,
    color?: string,
    all_day?: boolean,
    reminder_minutes?: number
  }
  ```
- **Validation**:
  - `validateCalendarCreation()` ensures required fields + date logic.
- **Logic**:
  - `createLearningEvent(userId, payload)`:
    - Maps to Prisma create with defaults:
      - `all_day: false`
      - `status: 'planned'`
    - Converts `start_utc`/`end_utc` to `Date`.
- **Response**: `201` + created event.

#### `PUT /api/calendar/events/:eventId`
- Updates existing event.
- **Validation**: `validateCalendarUpdate()` (same as creation but optional title).
- **Logic**:
  - Checks event exists, belongs to user, and not soft-deleted.
  - Builds dynamic `data` object only for provided fields (avoids nulling existing data).
- **Response**: `200` + updated event; `404` if not found.

#### `DELETE /api/calendar/events/:eventId`
- Soft-delete only.
- Sets `is_deleted: true`.
- Same existence+ownership check.
- **Response**: `200` + updated event; `404` if invalid.

✅ **Robust**: soft-delete, validation, ownership guard, partial updates.

---

## 🎓 `/api/certificates` — Issue & List Certificates

### 📡 Endpoints:

#### `GET /api/certificates`
- Lists user’s certificates.
- Sorts by `issue_date DESC`.
- Returns:
  ```ts
  {
    certificate_id, roadmap_id, certificate_name, issue_date, pdf_url
  }
  ```

#### `POST /api/certificates`
- **Body**:
  ```ts
  {
    roadmap_id: string (required),
    certificate_name: string (≥3 chars)
  }
  ```
  > Accepts `road_map` (alias) for legacy compatibility.
- **Logic**:
  - Checks uniqueness via composite key `user_id_roadmap_id`.
  - If exists → `null` → controller returns `409 Conflict`.
  - Else → `prisma.certificate.create`.
- **Response**:
  - `201` on success.
  - `409` if already issued.

✅ Prevents duplicate certificates per user/roadmap.

---

## 📄 `/api/cvs` — CV (Resume) Management

### 📡 Endpoints:

#### `GET /api/cvs`
- Lists user’s CVs (metadata only: name, style, created/updated, `pdf_url`).
- Sorted `created_at DESC`.

#### `POST /api/cvs`
- **Body**:
  ```ts
  {
    cv_name: string (≥3 chars),
    template_style: 'modern' | 'classic' | 'minimal',
    personal_info?: JSON,
    education?: JSON,
    experience?: JSON,
    skills?: JSON,
    projects?: JSON
  }
  ```
- Stored as Prisma Json fields.

#### `PUT /api/cvs/:cvId`
- Updates CV.
- Same payload, all fields optional.
- Validates user ownership.
- Returns `404` if CV not found or not owned.

#### `POST /api/cvs/:cvId/optimize`
- **Body**:
  ```ts
  {
    section: 'personal_info' | 'education' | ..., // one of 5
    text: string (required),
    index?: number // for array items like skills[2]
  }
  ```
- **Current Behavior**:
  ```ts
  return { cv_id, section, optimized_text: `Optimized: ${text}`, index }
  ```
  → **Stub**. Real implementation would call LLM.

✅ Structure ready for AI-powered CV rewriting.

---

## 💪 `/api/exercises` — Exercise CRUD + Submission

### 📡 Endpoints:

#### `GET /api/exercises`
- Optional `?module_id=...` filter.
- Returns exercises sorted `created_at DESC`.

#### `POST /api/exercises`
- **Body**:
  ```ts
  {
    module_id: string (required),
    title: string,
    description: string,
    difficulty?: 'easy'|'medium'|'hard' (defaults to 'medium'),
    examples?: JSON
  }
  ```

#### `PUT /api/exercises/:exerciseId`
- Partial update (same fields).
- Fails `404` if not exists.

#### `DELETE /api/exercises/:exerciseId`
- Deletes permanently.

#### `POST /api/exercises/:exerciseId/submit`
- **Body**:
  ```ts
  { answer_text: string (non-empty) }
  ```
- **Logic**:
  - `submitExercise()` returns a **stub object**:
    ```ts
    {
      exercise_id,
      submitted_at: ISO string,
      user_id: string | null,
      status: 'received',
      answer_text
    }
    ```
  → No DB write, no grading.

✅ Supports content creation (e.g., admin), but submission + eval is not yet persisted.

---

## 🎤 `/api/interviews` — AI-Powered Mock Interviews

### 📡 Endpoints:

#### `POST /api/interviews/sessions`
- Starts new interview.
- **Body**:
  ```ts
  {
    session_name: string (≥3 chars),
    interview_type: 'simulated' | 'prep_feedback'
  }
  ```
- **Logic**:
  1. Selects `4` questions from `questionBank`:
     - Prioritizes topics aligned with user’s recent progress (via `userProgress`).
     - Falls back to any if <4 match.
  2. Saves session with selected `questions: JSON[]`.
- **Response**:
  ```json
  {
    session_id,
    questions: [ { question_id, text, topic? } ]
  }
  ```

#### `POST /api/interviews/sessions/:sessionId/submit`
- Submits answers.
- **Body**:
  ```ts
  {
    user_answers: [
      { question_id: string, answer: string (non-empty) }
    ]
  }
  ```
- **Logic**:
  1. Fetches session + questions.
  2. Calls `buildInterviewFeedback()`:
     - Formats prompt with Q&A.
     - Uses Groq to generate JSON feedback:
       ```ts
       {
         summary: string,
         score: 0–100,
         highlights?: string,
         areas_for_growth?: string
       }
       ```
     - Parses and sanitizes score.
  3. Updates `interviewSession` with:
     - `user_answers: JSON[]`
     - `ai_feedback: JSON`
     - `score: number`
- **Response**:
  ```json
  {
    session_id,
    ai_feedback: { summary, score, ... },
    score
  }
  ```
- ❗ **No validation** that submitted `question_id`s match session questions — vulnerability.

#### `GET /api/interviews/sessions`
- Lists user sessions (metadata + AI score/feedback).
- Normalizes `score` to `number`.

✅ Rich AI integration.  
⚠️ Missing: retry limit, session expiration, question validation.

---

## 💬 `/api/modules/:moduleId/notes` — AI Tutoring Chat

> Note: Mounted at `app.use('/api/modules/:moduleId', notesRouter)`.

### 📡 Endpoints:

#### `POST /api/modules/:moduleId/ai-chat`
- **Body**:
  ```ts
  { question: string (≥5 chars) }
  ```
- **Flow**:
  1. Validates module exists.
  2. Inserts user question as `NoteType.user_question`.
  3. Fetches next `sequence_order`.
  4. Calls Groq:
     - System: *"friendly learning assistant"*
     - User: `Module: {title}\nQuestion: {q}\nAnswer in concise bullet-style...`  
  5. Inserts AI reply as `NoteType.ai_response`.
- **Response**:
  ```json
  {
    answer: string,
    note_id: string
  }
  ```

#### `GET /api/modules/:moduleId/ai-notes`
- Lists all notes (Q&A pairs) for this module/user.
- Ordered by `sequence_order ASC`.

✅ Persistent tutoring history.  
✅ Sequential context (though not yet used in prompts).

---

## 📈 `/api/progress` — Module Progress Tracking

### 📡 Endpoints:

#### `GET /api/progress/modules/:moduleId/progress`
- Returns user’s progress for module:
  ```ts
  {
    user_id, module_id, status, completion_percentage, ...
  }
  ```

#### `PATCH /api/progress/modules/:moduleId/progress`
- **Body**:
  ```ts
  {
    status: 'not_started' | 'in_progress' | 'completed',
    completion_percentage: number (0–100)
  }
  ```
- Uses **upsert**:
  - Creates if new.
  - Updates if exists.
- Ensures data consistency.

✅ Atomic progress state.

---

## 🛣️ `/api/roadmaps` — Learning Roadmap Discovery & Enrollment

### 📡 Endpoints:

#### `GET /api/roadmaps`
- Optional `?category=...`.
- Returns published roadmaps + `module_count`.

#### `GET /api/roadmaps/:roadmapId`
- Returns full roadmap + nested modules (ordered by `order_index`).
- Validates `roadmapId` is UUID (via `uuidRegex`).

#### `POST /api/roadmaps/:roadmapId/enroll`
- **Logic**:
  1. Fetches roadmap + all `module_id`s.
  2. Finds user’s existing progress entries for those modules.
  3. Bulk-creates `UserProgress` for missing modules:
     ```ts
     {
       user_id,
       module_id,
       status: 'not_started',
       completion_percentage: 0
     }
     ```
  4. Uses `prisma.$transaction()` for atomicity.
- **Response**:
  ```json
  { roadmap_id, enrolled: number }
  ```

✅ Efficient batch enrollment.  
✅ Avoids duplicates.

---

## 🔍 Cross-Cutting Observations & Technical Debt

| Issue | Location | Severity | Suggestion |
|------|----------|----------|------------|
| **Multiple Prisma Clients** | `auth.services.ts`, `calendar.services.ts`, etc. | ⚠️ Critical | Use *only* `prisma.service.ts` singleton. |
| **No JWT Auth** | Everywhere | ⚠️ Medium | `x-user-id` is insecure for production. Add middleware with JWT + `req.user`. |
| **LLM Stubbing** | `cvs.services.ts::optimizeCVSection` | ⚠️ Low | Implement with same Groq pattern. |
| **No Rate Limiting** | All routes | ⚠️ Medium | Add `express-rate-limit`. |
| **No Logging** | — | ⚠️ Medium | Add structured logging (e.g., `pino`). |
| **No Error Codes** | Responses use free-text `error` | ⚠️ Low | Add machine-readable `code` field (e.g., `USER_EMAIL_CONFLICT`). |
| **No API Docs** | — | ⚠️ Medium | Add Swagger/OpenAPI. |
| **Hardcoded Model** | `groq.service.ts`, `notes.controller.ts`, `interviews.services.ts` | ⚠️ Low | Parameterize `model` via config/env. |

---

## 🧩 Data Model Highlights (Inferred from Prisma Usage)

| Entity | Relations | Notes |
|--------|-----------|-------|
| `User` | 1:N `LearningEvent`, `Certificate`, `CV`, `InterviewSession`, `AINote`, `UserProgress` | Core identity |
| `Roadmap` | 1:N `Module` | Published only shown |
| `Module` | 1:N `LearningEvent`, `Exercise`, `AINote`; M:1 `Roadmap` | Learning unit |
| `LearningEvent` | M:1 `User`, ? `Module` | Calendar item |
| `UserProgress` | Composite PK `(user_id, module_id)` | Tracks per-module status |
| `InterviewSession` | M:1 `User`; stores Q&A as JSON | AI-evaluated |
| `AINote` | M:1 `User`, M:1 `Module`; sequence-ordered | Chat transcript |
| `CV` | M:1 `User`; content as JSON fields | Template-based |

---

## ✅ Summary: What This Backend Does

SkillSync is a **personalized learning platform** with:
- ✅ **User onboarding** (registration)
- ✅ **Roadmap-driven curriculum** (modules, progress tracking)
- ✅ **Calendar integration** (schedule learning events)
- ✅ **Interactive exercises** (create + submit answers)
- ✅ **AI-powered features**:
  - Mock interviews with feedback & scoring
  - In-module tutoring chat
  - (Planned) CV optimization
- ✅ **Artifact generation**:
  - CVs (structured + templated)
  - Certificates (upon roadmap completion)

It’s **feature-complete for MVP**, with clean code structure — but needs production hardening (auth, logging, error codes, connection hygiene).

Let me know if you’d like:
- UML diagrams (DB, sequence)
- Postman collection auto-generation
- Prisma schema reconstruction
- DevOps deployment plan (Docker, env setup)  
— and I’ll generate it.