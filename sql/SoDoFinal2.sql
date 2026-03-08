-- Users table
CREATE TABLE Users (
    user_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    current_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    role ENUM('user', 'admin', 'creator') NOT NULL DEFAULT 'user',
    avatar_url VARCHAR(4096),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Roadmaps table
CREATE TABLE Roadmaps (
    roadmap_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(500),
    created_by VARCHAR(36) NOT NULL,
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(user_id),
    INDEX idx_category (category)
);

-- Modules table
CREATE TABLE Modules (
    module_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    roadmap_id VARCHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    content LONGTEXT,
    order_index INT NOT NULL,
    estimated_hours DECIMAL(4,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roadmap_id) REFERENCES Roadmaps(roadmap_id) ON DELETE CASCADE,
    INDEX idx_roadmap_order (roadmap_id, order_index),
    UNIQUE KEY uq_roadmap_order (roadmap_id, order_index)
);

-- UserProgress table (no column changes needed)
CREATE TABLE UserProgress (
    progress_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    module_id VARCHAR(36) NOT NULL,
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES Modules(module_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_module (user_id, module_id),
    INDEX idx_user_status (user_id, status)
);

-- Exercises table
CREATE TABLE Exercises (
    exercise_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    module_id VARCHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    examples JSON,
    starter_code MEDIUMTEXT,
    solution_code MEDIUMTEXT,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES Modules(module_id) ON DELETE CASCADE,
    INDEX idx_module_difficulty (module_id, difficulty)
);

-- InterviewSessions table
CREATE TABLE InterviewSessions (
    session_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    session_name VARCHAR(100) NOT NULL,
    interview_type ENUM('simulated', 'prep_feedback') NOT NULL,
    questions JSON NOT NULL,
    user_answers JSON,
    ai_feedback JSON,
    score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, created_at)
);

-- CVs table
CREATE TABLE CVs (
    cv_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    cv_name VARCHAR(100) NOT NULL,
    template_style ENUM('modern', 'classic', 'minimal') DEFAULT 'modern',
    personal_info JSON,
    education JSON,
    experience JSON,
    skills JSON,
    projects JSON,
    pdf_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, created_at)
);


-- Certificates table
CREATE TABLE Certificates (
    certificate_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    roadmap_id VARCHAR(36) NOT NULL,
    certificate_name VARCHAR(100) NOT NULL,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pdf_url VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (roadmap_id) REFERENCES Roadmaps(roadmap_id) ON DELETE CASCADE,
    INDEX idx_user_roadmap (user_id, roadmap_id),
    UNIQUE KEY uq_cert_user_roadmap (user_id, roadmap_id)
);


CREATE TABLE LearningEvents (
    event_id        VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         VARCHAR(36) NOT NULL,
    title           VARCHAR(150) NOT NULL DEFAULT 'Study Session',
    description     MEDIUMTEXT,
    status          ENUM('planned','done','missed','cancelled') DEFAULT 'planned',
    start_utc       DATETIME NOT NULL,
    end_utc         DATETIME NOT NULL,
    all_day         BOOLEAN DEFAULT FALSE,
    timezone        VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
    module_id       VARCHAR(36) NULL,
    color           VARCHAR(7) DEFAULT '#3B82F6',
    is_ai_suggested BOOLEAN DEFAULT FALSE,
    reminder_minutes SMALLINT NULL CHECK (reminder_minutes > 0),
    is_deleted      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)   REFERENCES Users(user_id)     ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES Modules(module_id) ON DELETE SET NULL,

    INDEX idx_user_start (user_id, start_utc),
    INDEX idx_module (module_id),
    INDEX idx_ai_suggested (user_id, is_ai_suggested)
);

CREATE TABLE AINotes (
    note_id         VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         VARCHAR(36) NOT NULL,
    module_id       VARCHAR(36) NOT NULL,
    note_type       ENUM('summary', 'hint', 'explanation', 'feedback', 'user_question', 'ai_response') NOT NULL,
    content         LONGTEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sequence_order  INT NOT NULL,

    FOREIGN KEY (user_id)      REFERENCES Users(user_id)      ON DELETE CASCADE,
    FOREIGN KEY (module_id)    REFERENCES Modules(module_id)  ON DELETE CASCADE,

    INDEX idx_user_module_order (user_id, module_id, sequence_order),
    INDEX idx_module_type (module_id, note_type)
);