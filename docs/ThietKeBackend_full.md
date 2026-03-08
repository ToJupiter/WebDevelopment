#### **1. Tổng quan Kiến trúc và Công nghệ**

Ngăn xếp công nghệ bạn đã chọn là rất phù hợp: hiện đại, hiệu quả và có sự hỗ trợ mạnh mẽ từ cộng đồng.

*   **Framework**: Express.js với TypeScript
*   **Database & ORM**: MySQL với Prisma
*   **Xác thực**: JWT (JSON Web Tokens) được lưu trong `httpOnly` cookies để tăng cường bảo mật.
*   **Validation**: Zod (Rất tuyệt vời khi kết hợp với TypeScript để đảm bảo dữ liệu đầu vào luôn đúng định dạng).
*   **Logging**: Winston (Để ghi log một cách có cấu trúc).
*   **Tài liệu API**: Swagger/OpenAPI (Tự động tạo tài liệu từ code comments).

#### **2. Lựa chọn ORM: Prisma vs. Raw SQL**

Bạn đã đề cập đến việc cân nhắc giữa ORM và không dùng ORM. Dưới đây là phân tích nhanh để khẳng định lựa chọn của bạn:

*   **Sử dụng ORM (Prisma - Lựa chọn được đề xuất)**
    *   **Ưu điểm:**
        *   **Type Safety:** Đây là ưu điểm lớn nhất. Prisma tự động tạo ra các type TypeScript từ schema CSDL của bạn. Điều này có nghĩa là bạn sẽ nhận được gợi ý code (autocomplete) và kiểm tra lỗi ngay tại thời điểm viết code, giảm thiểu đáng kể lỗi runtime.
        *   **Tăng tốc độ phát triển:** Bạn viết ít code hơn, các câu lệnh query trực quan và dễ đọc hơn nhiều so với SQL thuần.
        *   **Quản lý Migration:** Prisma cung cấp một hệ thống migration mạnh mẽ để quản lý các thay đổi về schema CSDL một cách an toàn và nhất quán.
        *   **Dễ sử dụng:** So với các ORM khác như TypeORM, Prisma thường được đánh giá là có cú pháp đơn giản và dễ học hơn.
    *   **Nhược điểm:**
        *   Có thể không tối ưu bằng SQL thuần cho các truy vấn cực kỳ phức tạp. Tuy nhiên, với dự án này, Prisma hoàn toàn đủ khả năng xử lý.

*   **Không sử dụng ORM (Raw SQL)**
    *   **Ưu điểm:**
        *   Toàn quyền kiểm soát và tối ưu hóa hiệu năng cho từng câu lệnh SQL.
    *   **Nhược điểm:**
        *   **Rất nhiều code lặp lại (boilerplate).**
        *   **Dễ xảy ra lỗi:** Lỗi cú pháp trong chuỗi SQL chỉ được phát hiện khi chạy.
        *   **Không có Type Safety:** Bạn phải tự định nghĩa kiểu dữ liệu trả về, rất dễ sai sót.
        *   **Bảo mật:** Phải tự xử lý việc chống SQL Injection một cách cẩn thận.

**Kết luận:** Với mục tiêu "đơn giản, nhanh chóng thực thi và linh hoạt", **Prisma là lựa chọn vượt trội**. Nó giúp bạn tập trung vào logic nghiệp vụ thay vì viết các câu lệnh CSDL lặp đi lặp lại.

## 🧱 1. Core Web Fundamentals → Applied

| Concept | Application in SkillSync |
|--------|--------------------------|
| **HTTP/HTTPS** | All REST APIs use **HTTPS** in production. Local dev may use HTTP. |
| **URL/URI** | RESTful resource naming: `/api/roadmaps/:id`, `/api/users/me` |
| **Web Server** | **Express.js** (Node.js) acts as the application server. In production, it will sit behind **Nginx** (reverse proxy, static file serving, SSL termination). |
| **Client-Server Model** | Strict separation: React frontend (client) ↔ Express backend (server). |

---

## 🎨 2. Front-End Technologies → Applied

| Concept | Application in SkillSync |
|--------|--------------------------|
| **HTML5** | Used by React under the hood for semantic structure (`<main>`, `<section>`). |
| **CSS / Tailwind CSS** | **Tailwind CSS** is the official styling framework (per `ThietKeChung.md`). Enables rapid, responsive UI development. |
| **JavaScript (ES6+)** | Core language for both frontend (React) and backend (Node.js). Uses `let`/`const`, arrow functions, promises, async/await. |
| **DOM / BOM** | Handled implicitly by React. Direct DOM manipulation is avoided. |
| **Fetch API** | Primary method for frontend to call backend REST endpoints (`fetch('/api/auth/login', ...)`). |
| **SPA Model** | The frontend is a **Single-Page Application** built with React. Navigation is client-side (React Router). |

---

## ⚙️ 3. Back-End Technologies → Applied

| Concept | Application in SkillSync |
|--------|--------------------------|
| **Node.js** | Runtime for the entire backend. Chosen for JavaScript unification and non-blocking I/O (ideal for AI API calls). |
| **Express.js** | Web framework for routing, middleware, and request/response handling. Lightweight and flexible. |
| **Middleware** | Custom middleware for: JWT auth, role-based access control (`admin`/`creator`), input validation, error handling. |

---

## 🔌 4. Protocols & APIs → Applied

| Concept | Application in SkillSync |
|--------|--------------------------|
| **WebSockets** | Used **exclusively** for the **real-time interview practice** feature (`wss://.../interviews/:id`). Enables live chat-like interaction and future audio streaming. |
| **Web Storage API** | **Local Storage** stores JWT token and UI preferences (e.g., theme). **Session Storage** is not used. |
| **REST API** | The **primary communication protocol** between frontend and backend for all non-real-time features. |

> **Note**: **WebRTC** and **SSE** are **not used**. WebRTC is overkill (no P2P video), and SSE is unnecessary (WebSocket covers real-time bidirectional needs).

---

## 🗄️ 5. Data & Databases → Applied

| Concept | Application in SkillSync |
|--------|--------------------------|
| **SQL Databases** | **MySQL** is the chosen RDBMS (per `ThietKeChung.md`). Selected for its robustness, JSON support, and reliability. |
| **JSON Columns** | Heavily used in `CVs` (personal_info, experience, etc.), `InterviewSessions` (questions, answers), and `Exercises` (examples). MySQL’s **JSONB** type is ideal for this . |
| **Indexing JSON** | To maintain performance on large JSON columns, **GIN indexes** will be added on frequently queried JSON paths . |

> **Note**: **NoSQL (MongoDB)** is **not used**, despite being in `web_concepts.md`. Your schema and use cases are inherently relational.

---

## 🛠️ 6. Development & Operations (DevOps) → Applied

| Concept | Application in SkillSync |
|--------|--------------------------|
| **Git / GitHub** | Source code version control and CI/CD pipeline trigger. |
| **Docker** | The entire application (Node.js backend, MySQL, Nginx) will be containerized for consistent development and deployment. |
| **CI/CD** | Automated testing (Mocha/Chai) and deployment pipeline (e.g., GitHub Actions to a cloud provider like DigitalOcean). |
| **Cloud Computing** | **DigitalOcean** is the target deployment platform (per `web_concepts.md`), for its simplicity and cost-effectiveness for startups. |

---

## 🔒 7. Web Security → Applied

| Concept | Application in SkillSync |
|--------|--------------------------|
| **HTTPS & SSL/TLS** | Mandatory in production. Enforced by Nginx. |
| **CORS** | Backend will configure CORS to allow requests **only** from the official frontend domain. |
| **SQL Injection** | **Prevented** by using **parameterized queries** via an ORM (e.g., Prisma or Sequelize). |
| **XSS** | **Mitigated** by sanitizing user-generated content (e.g., `module.content`) on the backend before storage and using React’s built-in escaping on the frontend. |
| **Authentication** | **Stateless JWT** for session management. Passwords are **hashed** with **bcrypt**. |

---

## 📁 8. State Management → Applied

| Concept | Application in SkillSync |
|--------|--------------------------|
| **Cookies** | **Not used** for authentication (JWT is stored in Local Storage). May be used for non-sensitive tracking (e.g., analytics). |
| **Hidden Form Fields** | **Not used**. All data is transferred via JSON payloads in REST/WS. |

---

# ✅ PART 3: GAP & RISK ANALYSIS

This section identifies technical, architectural, and operational risks and gaps in the current specifications.

---

## 🔴 Critical Gaps

### 2. **File Upload Infrastructure Undefined**
- **Problem**: Avatar upload (`POST /api/users/me/avatar`) and CV/PDF storage are specified, but the **storage backend** (local disk, S3, DO Spaces) is not defined.
- **Risk**: Insecure or non-scalable file storage.
- **Solution**: Use **cloud object storage** (e.g., **DigitalOcean Spaces**, S3-compatible). Never store user uploads in the application’s code directory .
- **Implementation**: Use `multer` for parsing uploads in Express, then stream to cloud storage .

### 3. **Real-time Audio Handling is Vague**
- **Problem**: The use case mentions "audio messages" for interviews, but the technical path is unclear.
- **Risk**: Complex, buggy audio implementation.
- **Solution**: 
  - **Frontend**: Record audio as **WebM** or **MP3** using the MediaRecorder API.
  - **Backend**: Receive file via WebSocket or a dedicated REST upload endpoint, then send to **OpenAI Whisper API** for transcription .
  - **Storage**: Store the **transcribed text** in `InterviewSessions.user_answers`, not the raw audio (to save cost and space).

---

## 🟠 High Risks

### 4. **JSON Column Query Performance**
- **Problem**: Tables like `CVs` and `InterviewSessions` rely heavily on JSON columns. Complex queries on nested JSON can be slow without proper indexing.
- **Risk**: Slow dashboard loads or CV list views as data scales.
- **Mitigation**: Use **MySQL’s GIN indexes** on JSONB columns for any field that will be filtered or searched [[11], [13]]. For example:
  ```sql
  CREATE INDEX idx_cvs_experience ON CVs USING GIN ((experience -> 'company'));
  ```

### 5. **Certificate Issuance Race Condition**
- **Problem**: The auto-issuance of certificates is described as a "trigger or cron job". A naive implementation could issue duplicate certificates.
- **Risk**: Data inconsistency (`Certificates` table has a `UNIQUE` constraint, so it would fail, but cause errors).
- **Mitigation**: Use a **transactional check-and-insert** pattern in the backend service that handles completion checks.

### 6. **AI Cost and Latency**
- **Problem**: Every AI interaction (chat, CV optimize, interview feedback) calls the **OpenAI API**, which has **cost and latency**.
- **Risk**: High operational costs and poor user experience if not managed.
- **Mitigation**:
  - Implement **caching** for common AI responses.
  - Set **usage quotas** for free-tier users.
  - Use **streaming responses** for chat to improve perceived latency.

---

## 🟡 Medium Risks / Gaps

### 7. **Admin Panel is Not Specified**
- **Problem**: Admin CRUD endpoints exist, but there’s **no design** for the admin frontend.
- **Risk**: Content creators cannot manage roadmaps/modules.
- **Solution**: Build a **separate admin dashboard** (e.g., using React Admin or a custom solution) that consumes the admin API endpoints.

### 8. **Error Handling & Logging Strategy Missing**
- **Problem**: No specification for structured logging, error tracking (e.g., Sentry), or monitoring.
- **Risk**: Difficult to debug production issues.
- **Solution**: Implement a centralized logging system (e.g., Winston + a cloud log service) and integrate an error-tracking tool.

### 9. **Testing Strategy is Absent**
- **Problem**: No mention of unit, integration, or E2E tests.
- **Risk**: Regression bugs and unstable releases.
- **Solution**: Adopt a testing pyramid:
  - **Unit**: Mocha/Chai for business logic.
  - **Integration**: Test API endpoints with a test DB.
  - **E2E**: Cypress for critical user flows (login, enroll, AI chat).

## Project Structure:

```
skillsync-backend/
├── src/
│   ├── api/
│   │   ├── auth/         # Routes, Controllers, Services cho Xác thực
│   │   ├── roadmaps/     # Routes, Controllers, Services cho Lộ trình & Module
│   │   ├── progress/     # ... cho Tiến độ học tập
│   │   ├── calendar/     # ... cho Lịch học (LearningEvents)
│   │   ├── notes/        # ... cho Ghi chú AI (AINotes)
│   │   ├── interviews/   # ... cho Luyện phỏng vấn
│   │   ├── cvs/          # ... cho Xây dựng CV
│   │   └── certificates/ # ... cho Chứng chỉ
|   |   |__ exercises/    
│   ├── middleware/       # Middleware chung (xác thực, xử lý lỗi, logging)
│   ├── services/         # Các service dùng chung (vd: OpenAI, PDF generation)
│   ├── utils/            # Các hàm tiện ích (vd: error handling, response format)
│   ├── types/            # Các định nghĩa type TypeScript chung
│   ├── config/           # Cấu hình (database, env variables)
│   ├── app.ts            # Khởi tạo và cấu hình Express app
│   └── server.ts         # Điểm bắt đầu của server
├── prisma/               # Prisma schema và migrations
├── .env.example
├── package.json
├── tsconfig.json
└── Dockerfile
```

- **WebSocket for Interviews**: You can place WebSocket logic inside `src/api/interviews/` as `interviews.websocket.ts` or handle it in `server.ts` with route-based upgrade. Both are valid.
- **File Uploads (Avatar)**: Can be handled in `auth/` or a new `users/` folder. Since avatar is part of user profile, consider:
  ```diff
  src/api/
  ├── users/          # For /me, avatar upload, profile update
  └── auth/           # Only for login/register
  ```
  But if you keep profile + auth together, it’s acceptable for MVP.

- **PDF Generation**: Belongs in `src/services/pdf.service.ts` → used by both `cvs/` and `certificates/`.

## API Endpoints

This API spec assumes:
- **REST over HTTP/1.1**
- **JWT-based authentication** (stateless)
- **Express.js** routing structure
- All endpoints return JSON with consistent structure:  
  ```json
  { "success": true, "data": {...}, "error": null }
  ```
  or on error:
  ```json
  { "success": false, "data": null, "error": "Descriptive message" }
  ```

---

# ✅ PART 1: FULL REST API SPECIFICATION

## 🔐 AUTHENTICATION

### `POST /api/auth/register`
**Description**: Register a new user  
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "strongpassword123",
  "full_name": "Nguyen Van A"
}
```
**Response (201)**:
```json
{
  "success": true,
  "data": {
    "user_id": "uuid...",
    "email": "user@example.com",
    "full_name": "Nguyen Van A",
    "role": "user",
    "current_level": "beginner"
  }
}
```

### `POST /api/auth/login`
**Description**: Login and receive JWT  
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "strongpassword123"
}
```
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": "uuid...",
      "email": "user@example.com",
      "full_name": "Nguyen Van A",
      "role": "user"
    }
  }
}
```

---

## 🧭 ROADMAPS

### `GET /api/roadmaps`
**Description**: List all **published** roadmaps  
**Query Params**: `?category=web-dev` (optional)  
**Auth**: Optional (public view)  
**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "roadmap_id": "uuid...",
      "title": "Full-Stack Web Development",
      "description": "...",
      "category": "web-dev",
      "image_url": "https://...",
      "created_by": "uuid...",
      "status": "published",
      "created_at": "2025-10-01T00:00:00Z"
    }
  ]
}
```

### `GET /api/roadmaps/:roadmap_id`
**Description**: Get roadmap details + modules  
**Auth**: Optional  
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "roadmap_id": "uuid...",
    "title": "...",
    "modules": [
      {
        "module_id": "uuid...",
        "title": "React Fundamentals",
        "description": "...",
        "order_index": 1,
        "estimated_hours": 5.5
      }
    ]
  }
}
```

### `POST /api/roadmaps/:roadmap_id/enroll`
**Description**: Enroll user in roadmap → creates `UserProgress` for all modules  
**Auth**: Required (user)  
**Response (201)**:
```json
{
  "success": true,
  "data": {
    "message": "Enrolled successfully",
    "progress_count": 12
  }
}
```

---

## 📘 MODULES & LEARNING

### `GET /api/modules/:module_id`
**Description**: Get full module content  
**Auth**: Required (enrolled or public)  
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "module_id": "uuid...",
    "title": "React Hooks",
    "content": "<h1>...</h1>",
    "estimated_hours": 4.0
  }
}
```

### `GET /api/modules/:module_id/progress`
**Description**: Get user’s progress for this module  
**Auth**: Required  
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "status": "in_progress",
    "completion_percentage": 65.0,
    "last_accessed_at": "2025-11-01T10:00:00Z"
  }
}
```

### `PATCH /api/modules/:module_id/progress`
**Description**: Update module progress  
**Auth**: Required  
**Request Body**:
```json
{
  "status": "completed",
  "completion_percentage": 100.0
}
```
**Response (200)**:
```json
{ "success": true, "data": { "message": "Progress updated" } }
```

---

## 🤖 AI LEARNING ASSISTANT (`AINotes`)

### `POST /api/modules/:module_id/ai-chat`
**Description**: Ask AI a question about the module  
**Auth**: Required  
**Request Body**:
```json
{
  "question": "Explain virtual DOM in React."
}
```
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "answer": "The virtual DOM is a lightweight copy...",
    "note_id": "uuid..."
  }
}
```

### `GET /api/modules/:module_id/ai-notes`
**Description**: Get all AI interaction history for this module  
**Auth**: Required  
**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "note_id": "uuid...",
      "note_type": "user_question",
      "content": "Explain virtual DOM...",
      "created_at": "2025-11-01T09:00:00Z",
      "sequence_order": 1
    },
    {
      "note_id": "uuid...",
      "note_type": "ai_response",
      "content": "The virtual DOM...",
      "created_at": "2025-11-01T09:00:02Z",
      "sequence_order": 2
    }
  ]
}
```

---

## 📅 LEARNING EVENTS (`LearningEvents`)

### `GET /api/calendar/events`
**Description**: Get user’s learning events  
**Query**: `?start=2025-11-01&end=2025-11-30`  
**Auth**: Required  
**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "event_id": "uuid...",
      "title": "Study React",
      "start_utc": "2025-11-02T14:00:00Z",
      "end_utc": "2025-11-02T15:30:00Z",
      "module_id": "uuid...",
      "status": "planned"
    }
  ]
}
```

### `POST /api/calendar/events`
**Description**: Create new learning event  
**Auth**: Required  
**Request Body**:
```json
{
  "title": "Practice Hooks",
  "start_utc": "2025-11-03T10:00:00Z",
  "end_utc": "2025-11-03T11:00:00Z",
  "module_id": "uuid...", // optional
  "description": "..."
}
```
**Response (201)**: `{ "success": true, "data": { "event_id": "uuid..." } }`

### `PUT /api/calendar/events/:event_id`
**Description**: Update event  
**Auth**: Required  
**Request Body**: (partial update allowed)  
**Response (200)**: `{ "success": true, "data": { "message": "Updated" } }`

### `DELETE /api/calendar/events/:event_id`
**Description**: Soft-delete event (`is_deleted = true`)  
**Auth**: Required  
**Response (200)**: `{ "success": true, "data": { "message": "Deleted" } }`

---

## 💬 INTERVIEW PRACTICE (`InterviewSessions`)

### `POST /api/interviews/sessions`
**Description**: Start new interview session  
**Auth**: Required  
**Request Body**:
```json
{
  "session_name": "Frontend Mock Interview",
  "interview_type": "simulated"
}
```
**Logic**: System selects questions based on `UserProgress`  
**Response (201)**:
```json
{
  "success": true,
  "data": {
    "session_id": "uuid...",
    "questions": [
      { "id": 1, "text": "Explain React lifecycle." },
      { "id": 2, "text": "What is closure?" }
    ]
  }
}
```

### `POST /api/interviews/sessions/:session_id/submit`
**Description**: Submit answers and finalize session  
**Auth**: Required  
**Request Body**:
```json
{
  "user_answers": [
    { "question_id": 1, "answer": "React has mount, update..." },
    { "question_id": 2, "answer": "Closure is..." }
  ]
}
```
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "ai_feedback": { "summary": "...", "score": 85.5 },
    "session_id": "uuid..."
  }
}
```

### `GET /api/interviews/sessions`
**Description**: List all user’s interview sessions  
**Auth**: Required  
**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "session_id": "uuid...",
      "session_name": "...",
      "score": 85.5,
      "created_at": "2025-11-01T08:00:00Z"
    }
  ]
}
```

---

## 📄 CV BUILDER (`CVs`)

### `GET /api/cvs`
**Description**: List user’s CVs  
**Auth**: Required  
**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "cv_id": "uuid...",
      "cv_name": "Frontend Dev CV",
      "template_style": "modern",
      "created_at": "2025-10-20T00:00:00Z"
    }
  ]
}
```

### `POST /api/cvs`
**Description**: Create new CV  
**Auth**: Required  
**Request Body**:
```json
{
  "cv_name": "My CV",
  "template_style": "modern",
  "personal_info": { "name": "A", "email": "a@example.com" },
  "experience": [ { "title": "Dev", "company": "X", "description": "Built apps..." } ]
}
```
**Response (201)**: `{ "success": true, "data": { "cv_id": "uuid..." } }`

### `PUT /api/cvs/:cv_id`
**Description**: Update CV data  
**Auth**: Required  
**Response (200)**: `{ "success": true, "data": { "message": "Updated" } }`

### `POST /api/cvs/:cv_id/optimize`
**Description**: Optimize a section with AI  
**Auth**: Required  
**Request Body**:
```json
{
  "section": "experience",
  "index": 0, // which item in the array
  "text": "Built apps using React"
}
```
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "optimized_text": "Spearheaded development of scalable React applications..."
  }
}
```

### `POST /api/cvs/:cv_id/generate-pdf`
**Description**: Generate and store PDF  
**Auth**: Required  
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "pdf_url": "https://.../cv-uuid.pdf"
  }
}
```

---

## 🏆 CERTIFICATES

### `GET /api/certificates`
**Description**: List user’s certificates  
**Auth**: Required  
**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "certificate_id": "uuid...",
      "certificate_name": "Full-Stack Developer",
      "issue_date": "2025-11-01T00:00:00Z",
      "pdf_url": "https://.../cert-uuid.pdf"
    }
  ]
}
```

> ✅ **Auto-issuance is backend-triggered** — no manual `POST /certificates`.

---

## 👤 USER PROFILE

### `GET /api/users/me`
**Description**: Get current user profile  
**Auth**: Required  
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "user_id": "uuid...",
    "email": "...",
    "full_name": "...",
    "current_level": "intermediate",
    "role": "user"
  }
}
```

### `PUT /api/users/me`
**Description**: Update profile (e.g., level, avatar)  
**Auth**: Required  
**Request Body**: (partial)  
**Response (200)**: `{ "success": true, "data": { "message": "Profile updated" } }`

# ✅ FULL REST API SPECIFICATION (REVISED & EXPANDED)

> **Auth Policy Legend**:
> - 🔐 `user`: Authenticated user
> - 👮 `admin/creator`: Role must be `admin` or `creator`
> - 🌐 `public`: No auth required

---

## 🔐 AUTHENTICATION (Enhanced)

### `POST /api/auth/register`  
**Auth**: 🌐  
*(as before)*

### `POST /api/auth/login`  
**Auth**: 🌐  
*(as before)*

### `PUT /api/auth/password`  
**Description**: Change password (must provide old password)  
**Auth**: 🔐 `user`  
**Request Body**:
```json
{
  "old_password": "old123",
  "new_password": "newStrongPass!456"
}
```
**Response (200)**: `{ "success": true, "data": { "message": "Password updated" } }`

---

## 👤 USER PROFILE & AVATAR

### `GET /api/users/me`  
**Auth**: 🔐 `user`  
*(as before)*

### `PUT /api/users/me`  
**Auth**: 🔐 `user`  
*(as before)*

### `POST /api/users/me/avatar`  
**Description**: Upload avatar (multipart/form-data)  
**Auth**: 🔐 `user`  
**Request**: `file` (image/jpeg, image/png)  
**Response (200)**:
```json
{ "success": true, "data": { "avatar_url": "https://.../avatars/user123.png" } }
```

---

## 🧭 ROADMAPS (Admin CRUD + Public Read)

### `GET /api/roadmaps`  
**Auth**: 🌐  
*(as before)*

### `GET /api/roadmaps/:roadmap_id`  
**Auth**: 🌐  
*(as before)*

### `POST /api/roadmaps`  
**Description**: Create new roadmap  
**Auth**: 👮 `admin/creator`  
**Request Body**:
```json
{
  "title": "Advanced React Patterns",
  "description": "...",
  "category": "frontend",
  "image_url": "https://...",
  "status": "draft"
}
```
**Response (201)**: `{ "success": true, "data": { "roadmap_id": "uuid..." } }`

### `PUT /api/roadmaps/:roadmap_id`  
**Description**: Update roadmap  
**Auth**: 👮 `admin/creator` AND owner  
**Request Body**: (partial update)  
**Response (200)**: `{ "success": true, "data": { "message": "Updated" } }`

### `DELETE /api/roadmaps/:roadmap_id`  
**Description**: Soft-delete or hard-delete (set `status = 'archived'`)  
**Auth**: 👮 `admin/creator` AND owner  
**Response (200)**: `{ "success": true, "data": { "message": "Archived" } }`

---

## 📘 MODULES (Admin CRUD)

### `GET /api/modules/:module_id`  
**Auth**: 🔐 `user` (enrolled or public roadmap)  
*(as before)*

### `POST /api/modules`  
**Description**: Create module under a roadmap  
**Auth**: 👮 `admin/creator`  
**Request Body**:
```json
{
  "roadmap_id": "uuid...",
  "title": "Context API Deep Dive",
  "description": "...",
  "content": "<h1>...</h1>",
  "order_index": 3,
  "estimated_hours": 4.5
}
```
**Response (201)**: `{ "success": true, "data": { "module_id": "uuid..." } }`

### `PUT /api/modules/:module_id`  
**Auth**: 👮 `admin/creator`  
**Request Body**: (partial)  
**Response (200)**: `{ "success": true, "data": { "message": "Updated" } }`

### `DELETE /api/modules/:module_id`  
**Auth**: 👮 `admin/creator`  
**Response (200)**: `{ "success": true, "data": { "message": "Deleted" } }`

---

## 📝 EXERCISES (Theory-Based, No Coding)

### `GET /api/exercises`  
**Description**: Get exercises for a module  
**Query**: `?module_id=uuid...`  
**Auth**: 🔐 `user`  
**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "exercise_id": "uuid...",
      "title": "Explain React reconciliation",
      "description": "Answer in 3-5 sentences.",
      "examples": null,
      "difficulty": "medium"
    }
  ]
}
```

### `POST /api/exercises`  
**Auth**: 👮 `admin/creator`  
**Request Body**:
```json
{
  "module_id": "uuid...",
  "title": "Virtual DOM vs Real DOM",
  "description": "Compare and contrast.",
  "examples": null,
  "difficulty": "medium"
}
```

### `PUT /api/exercises/:exercise_id`  
**Auth**: 👮 `admin/creator`  
### `DELETE /api/exercises/:exercise_id`  
**Auth**: 👮 `admin/creator`

### `POST /api/exercises/:exercise_id/submit`  
**Description**: Submit open-ended answer  
**Auth**: 🔐 `user`  
**Request Body**:
```json
{
  "answer_text": "The virtual DOM is a lightweight copy..."
}
```
**Response (201)**: `{ "success": true, "data": { "submission_id": "uuid..." } }`  
> ⚠️ **Note**: Submission storage not in current schema → **add table `ExerciseSubmissions` if needed**. For MVP, log to console or skip persistence.

---

## 🤖 AI NOTES (User Edit/Delete)

### `POST /api/modules/:module_id/ai-chat`  
*(as before)*

### `GET /api/modules/:module_id/ai-notes`  
*(as before)*

### `PUT /api/modules/:module_id/notes/:note_id`  
**Description**: Edit user’s own question (only `user_question` type)  
**Auth**: 🔐 `user` AND owner of note  
**Request Body**:
```json
{ "content": "Updated question text..." }
```
**Response (200)**: `{ "success": true, "data": { "message": "Note updated" } }`

### `DELETE /api/modules/:module_id/notes/:note_id`  
**Auth**: 🔐 `user` AND owner  
**Response (200)**: `{ "success": true, "data": { "message": "Note deleted" } }`

> ❌ Cannot edit/delete `ai_response` — only user-generated notes.

---

## 📊 PROGRESS TRACKING (Advanced)

### `GET /api/progress/overview`  
**Description**: Dashboard summary  
**Auth**: 🔐 `user`  
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "total_roadmaps_enrolled": 2,
    "completed_modules": 12,
    "in_progress_roadmaps": [
      { "roadmap_id": "...", "completion": 65.0 }
    ]
  }
}
```

### `GET /api/progress/roadmaps/:roadmap_id`  
**Description**: Full progress per roadmap  
**Auth**: 🔐 `user`  
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "roadmap_title": "...",
    "modules": [
      { "module_id": "...", "title": "...", "status": "completed", "completion_percentage": 100 }
    ],
    "overall_completion": 82.5
  }
}
```

### `GET /api/roadmaps/:roadmap_id/completion`  
**Description**: Check if eligible for certificate  
**Auth**: 🔐 `user`  
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "is_eligible": true,
    "completed_modules": 10,
    "total_modules": 10
  }
}
```

---

## 📅 CALENDAR (Reminders)

### `PUT /api/calendar/events/:event_id/reminder`  
**Description**: Set or update reminder  
**Auth**: 🔐 `user`  
**Request Body**:
```json
{ "reminder_minutes": 30 } // 30 mins before
```
**Response (200)**: `{ "success": true, "data": { "message": "Reminder set" } }`

> Stored in `LearningEvents.reminder_minutes`.

---

## 💬 INTERVIEW SESSIONS (Real-Time via WebSocket)

### WebSocket: `wss://api.skillsync.dev/interviews/:sessionId`
**Auth**: JWT in query param (`?token=...`)  
**Flow**:
- Client connects → server validates session ownership
- Server sends `{"type": "question", "payload": {...}}`
- Client sends `{"type": "answer", "payload": "text or base64 audio"}`
- On `{"type": "finish"}`, server processes → saves to DB

> ✅ **Replaces** the REST-only flow for real-time feel.  
> ✅ Audio handled via base64 or temporary upload + Whisper.

---

## 📄 CV MANAGEMENT

### `DELETE /api/cvs/:cv_id`  
**Auth**: 🔐 `user` AND owner  
**Response (200)**: `{ "success": true, "data": { "message": "CV deleted" } }`

> PDF file should be deleted from storage (S3/FS) as well.

---

## 🏆 CERTIFICATES

### `POST /api/certificates`  
**Description**: Manual certificate issuance (e.g., for offline achievements)  
**Auth**: 👮 `admin`  
**Request Body**:
```json
{
  "user_id": "uuid...",
  "roadmap_id": "uuid...",
  "certificate_name": "Special Recognition"
}
```
**Response (201)**: `{ "success": true, "data": { "certificate_id": "uuid..." } }`

> Auto-issuance remains **trigger-based** (no endpoint).

---

## ✅ FINAL VALIDATION: All Tables Covered?

| Table | Covered? | Endpoints |
|------|--------|----------|
| `Users` | ✅ | Auth, profile, avatar |
| `Roadmaps` | ✅ | CRUD (admin), read (public) |
| `Modules` | ✅ | CRUD (admin), read (user) |
| `UserProgress` | ✅ | Enroll, update, overview |
| `Exercises` | ✅ | CRUD (admin), GET, submit |
| `InterviewSessions` | ✅ | WebSocket + REST list |
| `CVs` | ✅ | CRUD, optimize, PDF, delete |
| `Certificates` | ✅ | Auto + manual create, list |
| `LearningEvents` | ✅ | CRUD, reminder |
| `AINotes` | ✅ | Chat, history, edit/delete |

✅ **All tables fully covered**.  
✅ **All 6 use cases implemented**.  
✅ **Admin capabilities added**.  
✅ **Security, real-time, and UX gaps closed**.
