-- USE learning_app;

-- ================== USERS ==================
INSERT INTO Users (user_id, email, password_hash, full_name, current_level, role, avatar_url) VALUES
(UUID(),'alice@example.com','pw','Alice Nguyen','beginner','user','https://i.pravatar.cc/100?img=1'),
(UUID(),'bob@example.com','pw','Bob Tran','intermediate','user','https://i.pravatar.cc/100?img=2'),
(UUID(),'charlie@example.com','pw','Charlie Pham','beginner','admin','https://i.pravatar.cc/100?img=3'),
(UUID(),'daisy@example.com','pw','Daisy Le','advanced','user','https://i.pravatar.cc/100?img=4'),
(UUID(),'ethan@example.com','pw','Ethan Vo','beginner','user','https://i.pravatar.cc/100?img=5'),
(UUID(),'fiona@example.com','pw','Fiona Tran','beginner','user','https://i.pravatar.cc/100?img=6'),
(UUID(),'george@example.com','pw','George Bui','intermediate','creator','https://i.pravatar.cc/100?img=7'),
(UUID(),'hannah@example.com','pw','Hannah Hoang','advanced','user','https://i.pravatar.cc/100?img=8'),
(UUID(),'ivan@example.com','pw','Ivan Dang','beginner','user','https://i.pravatar.cc/100?img=9'),
(UUID(),'julia@example.com','pw','Julia Do','advanced','user','https://i.pravatar.cc/100?img=10');

-- ================== ROADMAPS ==================
INSERT INTO Roadmaps (roadmap_id, title, description, category, image_url, created_by, status)
SELECT UUID(), t.title, 'Lộ trình mô phỏng', t.category, 'https://placehold.co/600x400', u.user_id, 'published'
FROM (SELECT 'Frontend' AS title,'Web' AS category UNION SELECT 'Backend','Web' UNION SELECT 'Data Analyst','Data'
      UNION SELECT 'AI Engineer','AI' UNION SELECT 'Mobile Developer','Mobile' UNION SELECT 'DevOps','Cloud'
      UNION SELECT 'Game Developer','Game' UNION SELECT 'UI/UX Designer','Design' UNION SELECT 'Fullstack','Web'
      UNION SELECT 'Cybersecurity','Security') t
JOIN (SELECT user_id FROM Users LIMIT 1) u;

-- ================== MODULES ==================
INSERT INTO Modules (module_id, roadmap_id, title, description, content, order_index, estimated_hours)
SELECT UUID(), r.roadmap_id, CONCAT('Module ', n), 'Mô tả module', 'Nội dung mô phỏng', n, FLOOR(1+RAND()*5)
FROM Roadmaps r
JOIN (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) x;

-- ================== USER PROGRESS ==================
INSERT INTO UserProgress (progress_id, user_id, module_id, status, completion_percentage, started_at, completed_at)
SELECT UUID(), u.user_id, m.module_id, ELT(FLOOR(1+RAND()*3),'not_started','in_progress','completed'),
ROUND(RAND()*100,2), NOW(), NULL
FROM Users u JOIN Modules m ON RAND()<0.05 LIMIT 10;

-- ================== EXERCISES ==================
INSERT INTO Exercises (exercise_id, module_id, title, description, examples, starter_code, solution_code, difficulty)
SELECT UUID(), m.module_id, CONCAT('Bài tập ', n), 'Mô tả bài tập', JSON_OBJECT('input','a b','output','c'),
'print("Hello")','print("Done")', ELT(FLOOR(1+RAND()*3),'easy','medium','hard')
FROM Modules m
JOIN (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) num
LIMIT 10;

-- ================== INTERVIEW SESSIONS ==================
INSERT INTO InterviewSessions (session_id, user_id, session_name, interview_type, questions, user_answers, ai_feedback, score)
SELECT UUID(), u.user_id, CONCAT('Phỏng vấn ', n), ELT(FLOOR(1+RAND()*2),'simulated','prep_feedback'),
JSON_ARRAY('Câu hỏi 1','Câu hỏi 2'), JSON_ARRAY('Trả lời 1','Trả lời 2'), JSON_ARRAY('Góp ý 1','Góp ý 2'),
ROUND(RAND()*100,2)
FROM Users u
JOIN (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) num
LIMIT 10;

-- ================== CVS ==================
INSERT INTO CVs (cv_id, user_id, cv_name, template_style, personal_info, education, experience, skills, projects, pdf_url)
SELECT UUID(), u.user_id, CONCAT('CV ', n), ELT(FLOOR(1+RAND()*3),'modern','classic','minimal'),
JSON_OBJECT('name',u.full_name), JSON_ARRAY('ĐH CNTT'), JSON_ARRAY('Intern Dev'),
JSON_ARRAY('JavaScript','React'), JSON_ARRAY('Project 1','Project 2'),'https://example.com/cv.pdf'
FROM Users u
JOIN (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) num
LIMIT 10;

-- ================== CERTIFICATES ==================
INSERT INTO Certificates (certificate_id, user_id, roadmap_id, certificate_name, pdf_url)
SELECT UUID(), u.user_id, r.roadmap_id, CONCAT('Chứng chỉ ', r.title), 'https://example.com/cert.pdf'
FROM Users u JOIN Roadmaps r ON RAND()<0.05 LIMIT 10;

-- ================== LEARNING EVENTS ==================
INSERT INTO LearningEvents (event_id, user_id, title, description, status, start_utc, end_utc, timezone, module_id, color, is_ai_suggested, reminder_minutes)
SELECT UUID(), u.user_id, CONCAT('Buổi học ', n), 'Buổi học mô phỏng',
ELT(FLOOR(1+RAND()*4),'planned','done','missed','cancelled'),
DATE_ADD(NOW(), INTERVAL n DAY), DATE_ADD(NOW(), INTERVAL (n*2) HOUR), 'Asia/Ho_Chi_Minh',
m.module_id, '#3B82F6', RAND()<0.5, 30
FROM Users u JOIN Modules m ON RAND()<0.05
JOIN (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) num
LIMIT 10;

-- ================== AI NOTES ==================
INSERT INTO AINotes (note_id, user_id, module_id, note_type, content, sequence_order)
SELECT UUID(), u.user_id, m.module_id,
ELT(FLOOR(1+RAND()*6),'summary','hint','explanation','feedback','user_question','ai_response'),
'Ghi chú AI mô phỏng', n
FROM Users u JOIN Modules m ON RAND()<0.05
JOIN (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) num
LIMIT 10;
