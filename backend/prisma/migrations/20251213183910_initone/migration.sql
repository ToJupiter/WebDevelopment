-- CreateTable
CREATE TABLE `ExerciseSubmissions` (
    `submission_id` VARCHAR(36) NOT NULL,
    `exercise_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `answer_text` LONGTEXT NOT NULL,
    `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ExerciseSubmissions_exercise_id_user_id_idx`(`exercise_id`, `user_id`),
    INDEX `ExerciseSubmissions_user_id_submitted_at_idx`(`user_id`, `submitted_at`),
    PRIMARY KEY (`submission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExerciseSubmissions` ADD CONSTRAINT `ExerciseSubmissions_exercise_id_fkey` FOREIGN KEY (`exercise_id`) REFERENCES `Exercises`(`exercise_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExerciseSubmissions` ADD CONSTRAINT `ExerciseSubmissions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
