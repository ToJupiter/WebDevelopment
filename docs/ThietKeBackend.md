### **Thiết kế Backend Chi tiết cho Nền tảng SkillSync**

Đây là một thiết kế kiến trúc backend có khả năng mở rộng, dễ bảo trì cho nền tảng SkillSync của bạn, sử dụng ngăn xếp công nghệ đã đề xuất và phù hợp với lược đồ cơ sở dữ liệu MySQL đã cung cấp.

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

#### **3. Cấu trúc Dự án (Đã tinh chỉnh)**

Cấu trúc bạn đề xuất rất tốt. Tôi chỉ thêm một vài ghi chú để làm rõ hơn vai trò của từng thư mục trong bối cảnh các tính năng mới.

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
*Ghi chú: Cấu trúc `api/` được chia theo từng feature giúp dự án dễ quản lý hơn khi mở rộng.*

---

#### **4. Thiết kế API (Đã cập nhật theo Usecase mới)**

Dưới đây là **bản thiết kế API đầy đủ, chi tiết và mở rộng** cho toàn bộ 8 module của **SkillSync 2.0**, được viết bằng **tiếng Việt** (kết hợp thuật ngữ kỹ thuật tiếng Anh), tuân thủ chặt chẽ **usecase**, **schema SQL**, và hỗ trợ **nâng cao** (WebSocket, upload đa phương tiện, JSON schema rõ ràng).  

---

## 📌 **Module 1: Xác thực & Người dùng (Authentication & Users)**

### `POST /api/auth/register`
**Mục đích**: Đăng ký tài khoản mới  
**Request** (`application/json`):
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "Nguyen Van A"
}
```
**Response** (`201 Created`):
```json
{
  "message": "User registered successfully",
  "user_id": "uuid-1234"
}
```

### `POST /api/auth/login`
**Mục đích**: Đăng nhập → trả về JWT trong `httpOnly` cookie  
**Request** (`application/json`):
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```
**Response** (`200 OK`): Cookie được set, body:
```json
{ "message": "Login successful" }
```

### `POST /api/auth/logout`
**Mục đích**: Xóa refresh token + xóa cookie  
**Response**: `204 No Content`

### `GET /api/users/me`
**Mục đích**: Lấy profile người dùng hiện tại  
**Response** (`200 OK`):
```json
{
  "user_id": "uuid-1234",
  "email": "user@example.com",
  "full_name": "Nguyen Van A",
  "current_level": "beginner",
  "role": "user",
  "avatar_url": "https://...",
  "created_at": "2025-10-25T00:00:00Z"
}
```

### `PUT /api/users/me`
**Mục đích**: Cập nhật profile  
**Request** (`application/json` – chỉ gửi field muốn thay đổi):
```json
{
  "full_name": "Nguyen Van B",
  "current_level": "intermediate"
}
```
**Response**: `200 OK` + body giống `GET /me`

---

## 📌 **Module 2: Lộ trình học & Module (Roadmaps & Modules)**

### `GET /api/roadmaps`
**Query**: `?status=published` (mặc định)  
**Response**:
```json
{
  "roadmaps": [
    {
      "roadmap_id": "uuid-r1",
      "title": "React Masterclass",
      "category": "Frontend",
      "image_url": "...",
      "status": "published"
    }
  ]
}
```

### `GET /api/roadmaps/:roadmapId`
**Response**:
```json
{
  "roadmap_id": "uuid-r1",
  "title": "...",
  "modules": [
    {
      "module_id": "uuid-m1",
      "title": "JSX Basics",
      "order_index": 1,
      "estimated_hours": 2.5
    }
  ]
}
```

### `(Admin) POST /api/roadmaps`
**Request**:
```json
{
  "title": "New Roadmap",
  "description": "...",
  "category": "Backend",
  "image_url": "..."
}
```

### `(Admin) PUT /api/roadmaps/:roadmapId`
→ Tương tự POST

### `(Admin) POST /api/modules`
**Request**:
```json
{
  "roadmap_id": "uuid-r1",
  "title": "State Management",
  "description": "...",
  "content": "<h1>...</h1>",
  "order_index": 3,
  "estimated_hours": 4.0
}
```

### `(Admin) PUT /api/modules/:moduleId`
→ Cập nhật module

### `(Admin) DELETE /api/modules/:moduleId`
→ Xóa module

---

## 📌 **Module 3: Tiến độ học tập (User Progress)**

### `GET /api/progress/roadmaps/:roadmapId`
**Response**:
```json
{
  "roadmap_id": "uuid-r1",
  "progress": [
    {
      "module_id": "uuid-m1",
      "status": "completed",
      "completion_percentage": 100.00
    }
  ]
}
```

### `POST /api/progress/modules/:moduleId/update`
**Request**:
```json
{ "status": "completed" }
```
→ Hệ thống tự cập nhật `started_at` / `completed_at`

---

## 📌 **Module 4: Trợ lý AI & Ghi chú (AI Assistant & Notes)**

### `GET /api/modules/:moduleId/notes`
**Response**:
```json
{
  "notes": [
    {
      "note_id": "uuid-n1",
      "note_type": "user_question",
      "content": "Virtual DOM là gì?",
      "created_at": "2025-10-25T10:00:00Z"
    },
    {
      "note_id": "uuid-n2",
      "note_type": "ai_response",
      "content": "Virtual DOM là...",
      "created_at": "2025-10-25T10:00:05Z"
    }
  ]
}
```

### `POST /api/modules/:moduleId/ask`
**Request** (`application/json`):
```json
{ "question": "Giải thích React Hooks?" }
```
**Response**:
```json
{ "answer": "React Hooks cho phép bạn sử dụng state..." }
```

### `POST /api/modules/:moduleId/generate-summary` *(mở rộng)*
**Request**:
```json
{ "format": "bullet_points", "max_points": 3 }
```
→ Lưu vào `AINotes` với `note_type: 'summary'`

---

## 📌 **Module 5: Lịch học cá nhân (Learning Calendar)**

### `GET /api/calendar/events?startDate=2025-10-25&endDate=2025-10-31`
**Response**:
```json
{
  "events": [
    {
      "event_id": "uuid-e1",
      "title": "Học React",
      "start_utc": "2025-10-26T09:00:00Z",
      "end_utc": "2025-10-26T11:00:00Z",
      "module_id": "uuid-m1",
      "is_ai_suggested": false
    }
  ]
}
```

### `POST /api/calendar/events`
**Request**:
```json
{
  "title": "Học Redux",
  "start_utc": "2025-10-27T14:00:00Z",
  "end_utc": "2025-10-27T16:00:00Z",
  "module_id": "uuid-m2",
  "all_day": false,
  "timezone": "Asia/Ho_Chi_Minh"
}
```

### `PUT /api/calendar/events/:eventId`  
### `DELETE /api/calendar/events/:eventId`

---

## 📌 **Module 6: Luyện phỏng vấn với AI (AI Interview Practice)**

### `GET /api/interviews`
→ **MỚI THÊM**: Liệt kê toàn bộ phiên phỏng vấn  
**Response**:
```json
{
  "sessions": [
    {
      "session_id": "uuid-s1",
      "session_name": "Frontend Interview",
      "interview_type": "simulated",
      "created_at": "2025-10-24T00:00:00Z",
      "score": 85.50
    }
  ]
}
```

### `POST /api/interviews/start`
**Request**:
```json
{ "roadmap_id": "uuid-r1" }
```
**Response**:
```json
{
  "sessionId": "uuid-s1",
  "firstQuestion": "Giới thiệu về bản thân?"
}
```

### `POST /api/interviews/:sessionId/answer`
**Hỗ trợ 2 kiểu**:
- **Text**: `application/json` → `{ "answerText": "Tôi là..." }`
- **Audio**: `multipart/form-data` → field `answerAudio` (file `.wav`, `.mp3`)  
→ Backend dùng **Whisper API** để chuyển thành text 

**Response**:
```json
{ "nextQuestion": "Bạn dùng React bao lâu rồi?" }
```

### `POST /api/interviews/:sessionId/end`
→ Trả về `202 Accepted` + message

### `GET /api/interviews/:sessionId`
→ Trả về toàn bộ lịch sử + `ai_feedback`

---

## 📌 **Module 7: Xây dựng CV (CV Builder)**

### `GET /api/cvs`  
### `POST /api/cvs`  
→ Tạo CV mới

### `PUT /api/cvs/:cvId`
**Request**:
```json
{
  "cv_name": "My CV",
  "personal_info": { "name": "A", "email": "..." },
  "experience": [ { "company": "X", "role": "Dev" } ]
}
```

### `POST /api/cvs/:cvId/enhance` → **SỬA LẠI CHO ĐÚNG**
**Request**:
```json
{
  "section": "experience",
  "item_index": 0,
  "content": "Tôi làm việc tại công ty X..."
}
```
**Response**:
```json
{ "enhancedContent": "Phát triển ứng dụng web tại công ty X..." }
```

### `GET /api/cvs/:cvId/download`
→ Trả về file PDF (stream hoặc redirect URL)

---

## 📌 **Module 8: Chứng chỉ (Certificates)**

### `GET /api/certificates`
**Response**:
```json
{
  "certificates": [
    {
      "certificate_id": "uuid-c1",
      "certificate_name": "React Master",
      "issue_date": "2025-10-25T00:00:00Z",
      "roadmap_id": "uuid-r1"
    }
  ]
}
```

### `GET /api/certificates/:certificateId/download`
→ Trả về PDF

### `GET /api/roadmaps/:roadmapId/completion` → **MỚI THÊM**
**Response**:
```json
{
  "roadmap_id": "uuid-r1",
  "completion_percentage": 100.00,
  "is_eligible_for_certificate": true
}
```

---

## 🔮 **Phần Mở Rộng: Hỗ trợ Real-time & Đa phương tiện (Future-Ready)**

> **Mục tiêu**: Chuẩn bị hạ tầng cho tính năng **phỏng vấn bằng thoại trực tiếp**, **chia sẻ hình ảnh khi hỏi AI**, v.v.

### WebSocket: `/ws/interview/:sessionId`
- **Kết nối**: Khi user vào phòng phỏng vấn
- **Giao thức**:
  - Client gửi: `{ "type": "audio_chunk", "data": <base64 or binary> }`
  - Server phản hồi: `{ "type": "transcript", "text": "..." }` hoặc `{ "type": "question", "content": "..." }`
- Dùng **binary WebSocket frames** để truyền audio hiệu quả 

### `POST /api/modules/:moduleId/ask` – **Hỗ trợ file đính kèm**
**Request**: `multipart/form-data`
- `question`: text (required)
- `attachment`: file (optional, image/png, image/jpeg)
→ AI có thể phân tích hình ảnh (dùng Vision API) nếu cần

### `POST /api/users/me/avatar`
**Upload avatar** → dùng `multipart/form-data` [[1], [8]]
- Accept: `image/jpeg`, `image/png`
- Max size: 5MB


Dưới đây là **bổ sung đầy đủ các endpoint còn thiếu** theo yêu cầu, được viết bằng **tiếng Việt**, chi tiết, có **JSON schema rõ ràng**, hỗ trợ **nâng cao** (WebSocket, upload đa phương tiện), và **loại bỏ hoàn toàn các yếu tố liên quan đến coding exercises** (vì nền tảng tập trung vào **học lý thuyết + phát triển sự nghiệp**, không phải coding).

---

## 📌 **Bổ sung: Module Quản trị (Admin / Creator)**

### `DELETE /api/roadmaps/:roadmapId`
**Mục đích**: Xóa toàn bộ lộ trình (chỉ Admin/Creator – người tạo lộ trình đó)  
**Response**: `204 No Content`  
→ Hệ thống tự động xóa cascade các `Modules`, `UserProgress`, `Certificates` liên quan (theo foreign key constraint).

---

## 📌 **Bổ sung: Quản lý Chứng chỉ (Certificates)**

### `POST /api/certificates`
**Mục đích**: **Admin** cấp chứng chỉ thủ công (trong trường hợp đặc biệt, ví dụ: user học offline)  
**Request** (`application/json`):
```json
{
  "user_id": "uuid-user123",
  "roadmap_id": "uuid-roadmap456",
  "certificate_name": "React Advanced Certification"
}
```
**Response** (`201 Created`):
```json
{
  "certificate_id": "uuid-cert789",
  "pdf_url": "https://...",
  "issue_date": "2025-10-25T00:00:00Z"
}
```

---

## 📌 **Bổ sung: Quản lý Tài nguyên Cá nhân**

### `DELETE /api/cvs/:cvId`
**Mục đích**: Xóa CV  
**Response**: `204 No Content`

### `DELETE /api/modules/:moduleId/notes/:noteId`
**Mục đích**: Xóa một ghi chú AI cụ thể (do người dùng tạo)  
**Response**: `204 No Content`

### `PUT /api/modules/:moduleId/notes/:noteId`
**Mục đích**: Chỉnh sửa ghi chú (chỉ áp dụng cho `note_type = 'user_question'`)  
**Request**:
```json
{ "content": "Cập nhật câu hỏi: Virtual DOM hoạt động như thế nào?" }
```
**Response**: `200 OK` + ghi chú đã cập nhật

---

## 📌 **Bổ sung: Tiến độ học tập (User Progress – Nâng cao)**

### `GET /api/progress/overview`
**Mục đích**: Tổng quan tiến độ toàn bộ  
**Response**:
```json
{
  "total_roadmaps_started": 3,
  "total_modules_completed": 12,
  "current_active_roadmap": {
    "roadmap_id": "uuid-r1",
    "title": "React Masterclass",
    "completion_percentage": 65.50
  },
  "streak_days": 7
}
```

### `GET /api/progress/modules/:moduleId`
**Mục đích**: Xem chi tiết tiến độ của một module  
**Response**:
```json
{
  "module_id": "uuid-m1",
  "status": "in_progress",
  "completion_percentage": 40.00,
  "started_at": "2025-10-20T00:00:00Z",
  "last_accessed_at": "2025-10-25T08:00:00Z"
}
```

---

## 📌 **Bổ sung: Bài tập (Exercises – Phiên bản không coding)**

> 💡 **Lưu ý**: Vì nền tảng **không tập trung vào coding**, nên `Exercises` ở đây là **câu hỏi tự luận / trắc nghiệm lý thuyết**, không có `starter_code` hay `solution_code`.

### `GET /api/exercises?module_id=uuid-m1`
**Response**:
```json
{
  "exercises": [
    {
      "exercise_id": "uuid-e1",
      "title": "Giải thích Virtual DOM",
      "description": "Trình bày ngắn gọn cách Virtual DOM giúp tối ưu hiệu năng trong React.",
      "difficulty": "medium",
      "examples": [
        { "question": "Virtual DOM là gì?", "answer_hint": "Là bản sao nhẹ..." }
      ]
    }
  ]
}
```

### `POST /api/exercises`
**(Admin)** Tạo bài tập mới  
**Request**:
```json
{
  "module_id": "uuid-m1",
  "title": "So sánh useState và useReducer",
  "description": "Khi nào nên dùng useReducer thay vì useState?",
  "difficulty": "hard",
  "examples": []
}
```

### `PUT /api/exercises/:exerciseId`  
### `DELETE /api/exercises/:exerciseId`

### `POST /api/exercises/:exerciseId/submit`
**Mục đích**: Gửi câu trả lời cho bài tập (text)  
**Request**:
```json
{ "answer_text": "Tôi nghĩ useReducer phù hợp khi state phức tạp..." }
```
→ Hệ thống **lưu vào bảng `UserProgress` hoặc một bảng riêng nếu cần**, nhưng **không chấm điểm tự động** (vì là tự luận). Có thể dùng AI để đưa gợi ý phản hồi sau.

---

## 📌 **Bổ sung: Quản lý Hồ sơ & Bảo mật**

### `POST /api/users/me/avatar`
**Mục đích**: Upload avatar  
**Request**: `multipart/form-data`  
- Field: `avatar` (file)  
- Định dạng: `image/jpeg`, `image/png`  
- Max size: 5MB  
**Response** (`200 OK`):
```json
{ "avatar_url": "https://cdn.skillsync/avatar-123.jpg" }
```

### `PUT /api/auth/password`
**Mục đích**: Đổi mật khẩu  
**Request**:
```json
{
  "current_password": "OldPass123!",
  "new_password": "NewSecurePass456!"
}
```
**Response**: `200 OK` + message

---

## 📌 **Bổ sung: WebSocket – Phỏng vấn Trực tiếp (Real-time Audio)**

### `WebSocket: /ws/interview/:sessionId`
**Mục đích**: Hỗ trợ **phỏng vấn thoại trực tiếp** với độ trễ thấp.

#### Giao thức tin nhắn (JSON format):

- **Client → Server**:
  ```json
  {
    "type": "audio_start"
  }
  ```
  → Bắt đầu gửi audio (dưới dạng **binary frame**)

  ```json
  {
    "type": "audio_end"
  }
  ```
  → Kết thúc gửi audio

  > 📌 **Lưu ý**: Audio được gửi liên tục dưới dạng **binary WebSocket frames** (không phải JSON). Chỉ các lệnh điều khiển dùng JSON.

- **Server → Client**:
  ```json
  {
    "type": "transcript",
    "text": "Tôi đã làm việc tại công ty X..."
  }
  ```
  ```json
  {
    "type": "ai_question",
    "content": "Bạn xử lý xung đột trong team như thế nào?"
  }
  ```
  ```json
  {
    "type": "session_end",
    "feedback_summary": "Bạn trả lời tốt về kỹ thuật..."
  }
  ```

#### Hỗ trợ định dạng audio:
- Client gửi: **WebM/Opus** (từ `MediaRecorder` trên trình duyệt)  
- Server dùng **OpenAI Whisper** hoặc **Google Speech-to-Text** để chuyển thành text  
- Không lưu audio gốc – chỉ lưu **transcript** vào `InterviewSessions.user_answers`

---

## 📌 **Bổ sung: Quản lý Nhắc nhở (Calendar Reminders)**

### `PUT /api/calendar/events/:eventId/reminder`
**Mục đích**: Cập nhật thời gian nhắc nhở trước sự kiện  
**Request**:
```json
{
  "reminder_minutes": 30
}
```
→ Giá trị hợp lệ: `5`, `15`, `30`, `60`, `1440` (1 ngày)  
→ Lưu vào cột `reminder_minutes` của `LearningEvents`  
**Response**: `200 OK`

---

✅ **Tổng kết bổ sung**:
- **Quản trị**: Đã có đủ CRUD cho `Roadmaps`, `Modules`, `Exercises`.
- **Người dùng**: Có thể quản lý CV, ghi chú AI, avatar, mật khẩu.
- **Tiến độ**: Có overview + chi tiết module.
- **Phỏng vấn**: Hỗ trợ cả REST (text/audio file) và **WebSocket (real-time audio)**.
- **Bài tập**: Tập trung vào **lý thuyết**, không coding.
- **Nhắc nhở**: Tùy chỉnh linh hoạt.

Toàn bộ API tuân thủ **usecase trong `ThietKeChung.md`**, không dư thừa, không thiếu sót, và sẵn sàng cho triển khai.  
