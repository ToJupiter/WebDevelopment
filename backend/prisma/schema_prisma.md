``` prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "mysql"
}


model User {
  user_id       String   @id @default(uuid()) @db.VarChar(36)
  email         String   @unique @db.VarChar(255)
  password_hash String   @db.VarChar(255)
  full_name     String   @db.VarChar(100)
  current_level Level    @default(beginner)
  role          Role     @default(user)
  avatar_url    String?  @db.VarChar(4096)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt

  roadmaps          Roadmap[]
  progress          UserProgress[]
  interviewSessions InterviewSession[]
  cvs               CV[]
  certificates      Certificate[]
  learningEvents    LearningEvent[]
  aiNotes           AINote[]

  @@map("Users")
  @@index([email])
}

model Roadmap {
  roadmap_id  String   @id @default(uuid()) @db.VarChar(36)
  title       String   @db.VarChar(100)
  description String?  @db.Text
  category    String   @db.VarChar(50)
  image_url   String?  @db.VarChar(500)
  created_by  String   @db.VarChar(36)
  status      Status   @default(draft)
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  creator      User          @relation(fields: [created_by], references: [user_id])
  modules      Module[]
  certificates Certificate[]

  @@map("Roadmaps")
  @@index([category])
}

model Module {
  module_id       String   @id @default(uuid()) @db.VarChar(36)
  roadmap_id      String   @db.VarChar(36)
  title           String   @db.VarChar(100)
  description     String?  @db.Text
  content         String?  @db.LongText
  order_index     Int
  estimated_hours Decimal? @db.Decimal(4, 1)
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt

  roadmap        Roadmap         @relation(fields: [roadmap_id], references: [roadmap_id], onDelete: Cascade)
  userProgress   UserProgress[]
  exercises      Exercise[]
  learningEvents LearningEvent[]
  aiNotes        AINote[]

  @@unique([roadmap_id, order_index])
  @@index([roadmap_id, order_index])
  @@map("Modules")
}

model UserProgress {
  progress_id           String            @id @default(uuid()) @db.VarChar(36)
  user_id               String            @db.VarChar(36)
  module_id             String            @db.VarChar(36)
  status                ProgressStatus    @default(not_started)
  completion_percentage Decimal           @default(0.00) @db.Decimal(5, 2)
  started_at            DateTime?
  completed_at          DateTime?
  last_accessed_at      DateTime          @default(now()) @updatedAt

  user   User   @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
  module Module @relation(fields: [module_id], references: [module_id], onDelete: Cascade)

  @@unique([user_id, module_id])
  @@index([user_id, status])
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

  module Module @relation(fields: [module_id], references: [module_id], onDelete: Cascade)

  @@index([module_id, difficulty])
  @@map("Exercises")
}

model InterviewSession {
  session_id     String         @id @default(uuid()) @db.VarChar(36)
  user_id        String         @db.VarChar(36)
  session_name   String         @db.VarChar(100)
  interview_type InterviewType
  questions      Json
  user_answers   Json?
  ai_feedback    Json?
  score          Decimal?       @db.Decimal(5, 2)
  created_at     DateTime       @default(now())

  user User @relation(fields: [user_id], references: [user_id], onDelete: Cascade)

  @@index([user_id, created_at])
  @@map("InterviewSessions")
}

model CV {
  cv_id          String       @id @default(uuid()) @db.VarChar(36)
  user_id        String       @db.VarChar(36)
  cv_name        String       @db.VarChar(100)
  template_style TemplateStyle @default(modern)
  personal_info  Json?
  education      Json?
  experience     Json?
  skills         Json?
  projects       Json?
  pdf_url        String?      @db.VarChar(500)
  created_at     DateTime     @default(now())
  updated_at     DateTime     @updatedAt

  user User @relation(fields: [user_id], references: [user_id], onDelete: Cascade)

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

  user    User    @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
  roadmap Roadmap @relation(fields: [roadmap_id], references: [roadmap_id], onDelete: Cascade)

  @@unique([user_id, roadmap_id])
  @@index([user_id, roadmap_id])
  @@map("Certificates")
}

model LearningEvent {
  event_id         String          @id @default(uuid()) @db.VarChar(36)
  user_id          String          @db.VarChar(36)
  title            String          @default("Study Session") @db.VarChar(150)
  description      String?         @db.MediumText
  status           EventStatus     @default(planned)
  start_utc        DateTime        @db.DateTime
  end_utc          DateTime        @db.DateTime
  all_day          Boolean         @default(false)
  timezone         String          @default("Asia/Ho_Chi_Minh") @db.VarChar(50)
  module_id        String?         @db.VarChar(36)
  color            String          @default("#3B82F6") @db.VarChar(7)
  is_ai_suggested  Boolean         @default(false)
  reminder_minutes Int?            @db.SmallInt
  is_deleted       Boolean         @default(false)
  created_at       DateTime        @default(now())
  updated_at       DateTime        @updatedAt

  user   User    @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
  module Module? @relation(fields: [module_id], references: [module_id], onDelete: SetNull)

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

  user   User   @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
  module Module @relation(fields: [module_id], references: [module_id], onDelete: Cascade)

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