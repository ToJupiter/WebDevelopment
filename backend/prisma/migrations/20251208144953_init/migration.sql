-- CreateTable
CREATE TABLE `Users` (
    `user_id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `current_level` ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
    `role` ENUM('user', 'admin', 'creator') NOT NULL DEFAULT 'user',
    `avatar_url` VARCHAR(4096) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    INDEX `Users_email_idx`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roadmaps` (
    `roadmap_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(50) NOT NULL,
    `image_url` VARCHAR(500) NULL,
    `created_by` VARCHAR(36) NOT NULL,
    `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Roadmaps_category_idx`(`category`),
    INDEX `Roadmaps_created_by_fkey`(`created_by`),
    PRIMARY KEY (`roadmap_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Modules` (
    `module_id` VARCHAR(36) NOT NULL,
    `roadmap_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `content` LONGTEXT NULL,
    `order_index` INTEGER NOT NULL,
    `estimated_hours` DECIMAL(4, 1) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Modules_roadmap_id_order_index_idx`(`roadmap_id`, `order_index`),
    UNIQUE INDEX `Modules_roadmap_id_order_index_key`(`roadmap_id`, `order_index`),
    PRIMARY KEY (`module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserProgress` (
    `progress_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `module_id` VARCHAR(36) NOT NULL,
    `status` ENUM('not_started', 'in_progress', 'completed') NOT NULL DEFAULT 'not_started',
    `completion_percentage` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `started_at` DATETIME(3) NULL,
    `completed_at` DATETIME(3) NULL,
    `last_accessed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserProgress_user_id_status_idx`(`user_id`, `status`),
    INDEX `UserProgress_module_id_fkey`(`module_id`),
    UNIQUE INDEX `UserProgress_user_id_module_id_key`(`user_id`, `module_id`),
    PRIMARY KEY (`progress_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exercises` (
    `exercise_id` VARCHAR(36) NOT NULL,
    `module_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `examples` JSON NULL,
    `starter_code` MEDIUMTEXT NULL,
    `solution_code` MEDIUMTEXT NULL,
    `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Exercises_module_id_difficulty_idx`(`module_id`, `difficulty`),
    PRIMARY KEY (`exercise_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InterviewSessions` (
    `session_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `session_name` VARCHAR(100) NOT NULL,
    `interview_type` ENUM('simulated', 'prep_feedback') NOT NULL,
    `questions` JSON NOT NULL,
    `user_answers` JSON NULL,
    `ai_feedback` JSON NULL,
    `score` DECIMAL(5, 2) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `InterviewSessions_user_id_created_at_idx`(`user_id`, `created_at`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CVs` (
    `cv_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `cv_name` VARCHAR(100) NOT NULL,
    `template_style` ENUM('modern', 'classic', 'minimal') NOT NULL DEFAULT 'modern',
    `personal_info` JSON NULL,
    `education` JSON NULL,
    `experience` JSON NULL,
    `skills` JSON NULL,
    `projects` JSON NULL,
    `pdf_url` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `CVs_user_id_created_at_idx`(`user_id`, `created_at`),
    PRIMARY KEY (`cv_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificates` (
    `certificate_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `roadmap_id` VARCHAR(36) NOT NULL,
    `certificate_name` VARCHAR(100) NOT NULL,
    `issue_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pdf_url` VARCHAR(500) NULL,

    INDEX `Certificates_user_id_roadmap_id_idx`(`user_id`, `roadmap_id`),
    INDEX `Certificates_roadmap_id_fkey`(`roadmap_id`),
    UNIQUE INDEX `Certificates_user_id_roadmap_id_key`(`user_id`, `roadmap_id`),
    PRIMARY KEY (`certificate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LearningEvents` (
    `event_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(150) NOT NULL DEFAULT 'Study Session',
    `description` MEDIUMTEXT NULL,
    `status` ENUM('planned', 'done', 'missed', 'cancelled') NOT NULL DEFAULT 'planned',
    `start_utc` DATETIME(0) NOT NULL,
    `end_utc` DATETIME(0) NOT NULL,
    `all_day` BOOLEAN NOT NULL DEFAULT false,
    `timezone` VARCHAR(50) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    `module_id` VARCHAR(36) NULL,
    `color` VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    `is_ai_suggested` BOOLEAN NOT NULL DEFAULT false,
    `reminder_minutes` SMALLINT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `LearningEvents_user_id_start_utc_idx`(`user_id`, `start_utc`),
    INDEX `LearningEvents_module_id_idx`(`module_id`),
    INDEX `LearningEvents_user_id_is_ai_suggested_idx`(`user_id`, `is_ai_suggested`),
    PRIMARY KEY (`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AINotes` (
    `note_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `module_id` VARCHAR(36) NOT NULL,
    `note_type` ENUM('summary', 'hint', 'explanation', 'feedback', 'user_question', 'ai_response') NOT NULL,
    `content` LONGTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sequence_order` INTEGER NOT NULL,

    INDEX `AINotes_user_id_module_id_sequence_order_idx`(`user_id`, `module_id`, `sequence_order`),
    INDEX `AINotes_module_id_note_type_idx`(`module_id`, `note_type`),
    PRIMARY KEY (`note_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Roadmaps` ADD CONSTRAINT `Roadmaps_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Modules` ADD CONSTRAINT `Modules_roadmap_id_fkey` FOREIGN KEY (`roadmap_id`) REFERENCES `Roadmaps`(`roadmap_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserProgress` ADD CONSTRAINT `UserProgress_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `Modules`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserProgress` ADD CONSTRAINT `UserProgress_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercises` ADD CONSTRAINT `Exercises_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `Modules`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InterviewSessions` ADD CONSTRAINT `InterviewSessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CVs` ADD CONSTRAINT `CVs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificates` ADD CONSTRAINT `Certificates_roadmap_id_fkey` FOREIGN KEY (`roadmap_id`) REFERENCES `Roadmaps`(`roadmap_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificates` ADD CONSTRAINT `Certificates_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LearningEvents` ADD CONSTRAINT `LearningEvents_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `Modules`(`module_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LearningEvents` ADD CONSTRAINT `LearningEvents_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AINotes` ADD CONSTRAINT `AINotes_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `Modules`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AINotes` ADD CONSTRAINT `AINotes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
