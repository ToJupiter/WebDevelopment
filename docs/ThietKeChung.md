### **BÁO CÁO KỸ THUẬT DỰ ÁN: SkillSync - phiên bản 2.0**

**Ngày:** 25/10/2025

**Đối tượng:** Đội ngũ phát triển dự án, các bên liên quan.

**Nội dung:** Tài liệu này mô tả chi tiết các chức năng, kiến trúc hệ thống, và các trường hợp sử dụng (usecase) của nền tảng SkillSync. Mục tiêu là cung cấp một cái nhìn rõ ràng, sâu sắc để đội ngũ phát triển có thể triển khai dự án một cách chính xác và hiệu quả.

---

### **Phần 1: Tổng quan dự án (Cập nhật)**

#### **1. Tên dự án**
SkillSync - Nền tảng Học tập và Phát triển Sự nghiệp được Hỗ trợ bởi AI.

#### **2. Tầm nhìn (Vision) - Điều chỉnh**
Xây dựng một ứng dụng web hiện đại, có cấu trúc, đóng vai trò là một **trợ lý AI đồng hành** cùng người dùng trong quá trình học tập và chuẩn bị sự nghiệp trong lĩnh vực công nghệ. Thay vì tự động cá nhân hóa lộ trình, hệ thống tập trung vào việc cung cấp các lộ trình học tập chất lượng cao do chuyên gia tạo ra. AI sẽ đóng vai trò là một công cụ hỗ trợ thông minh, giúp người dùng **hiểu sâu hơn về kiến thức** trong từng module, giải đáp thắc mắc, và luyện tập các kỹ năng mềm cần thiết cho công việc.

#### **3. Mục tiêu (Objectives) - Cập nhật**
*   **Mục tiêu chính:** Cung cấp một môi trường học tập có cấu trúc, nơi người dùng có thể chủ động theo đuổi các lộ trình đã được định sẵn. Tích hợp một Trợ lý AI thông minh để **tương tác hỏi-đáp, tóm tắt nội dung, và giải thích các khái niệm phức tạp** ngay trong từng bài học, giúp củng cố kiến thức một cách vững chắc.
*   **Đối tượng người dùng:** Các lập trình viên, nhà phân tích dữ liệu, sinh viên CNTT, hoặc những người muốn chuyển ngành. Hệ thống hướng đến việc cung cấp một con đường học tập rõ ràng và các công cụ thực tiễn để họ tự tin ứng tuyển.
*   **Giải pháp (Solution) - Tái cấu trúc:** SkillSync cung cấp một hệ sinh thái học tập và sự nghiệp khép kín, tập trung vào các trụ cột sau:
    *   **Lộ trình học tập có cấu trúc:** Các lộ trình học (roadmaps) được tạo và quản lý bởi Admin/Creator, đảm bảo chất lượng và tính logic. Người dùng sẽ đi theo một con đường đã được vạch sẵn, rõ ràng.
    *   **Trợ lý học tập AI (AI Learning Assistant):** Đây là tính năng AI cốt lõi mới. Trong mỗi module học, người dùng có thể:
        *   **Hỏi-đáp trực tiếp:** Đặt câu hỏi về nội dung bài học và nhận câu trả lời từ AI trong ngữ cảnh cụ thể.
        *   **Yêu cầu tóm tắt/giải thích:** AI có thể tóm tắt các phần kiến thức dài hoặc giải thích các thuật ngữ khó hiểu.
        *   **Lưu trữ tương tác:** Toàn bộ cuộc hội thoại, ghi chú, tóm tắt của AI sẽ được lưu lại trong bảng `AINotes`, giúp người dùng dễ dàng ôn tập.
    *   **Bộ công cụ phát triển sự nghiệp:**
        *   **Luyện phỏng vấn với AI:** Mô phỏng các buổi phỏng vấn qua giao diện chat, cho phép người dùng trả lời bằng văn bản hoặc tin nhắn thoại. AI sẽ đưa ra phản hồi chi tiết sau buổi phỏng vấn.
        *   **Xây dựng CV thông minh:** Người dùng nhập thông tin, AI hỗ trợ viết lại các phần mô tả cho chuyên nghiệp hơn và đề xuất các kỹ năng cần thêm vào dựa trên mục tiêu công việc.
    *   **Quản lý kế hoạch cá nhân:** Cung cấp công cụ lịch biểu (Calendar) để người dùng tự lên kế hoạch học tập, đặt lịch cho các buổi học, tương tự như Google Calendar hay Notion Calendar.

---

### **Phần 2: Mô tả Tác nhân và Phân tích Usecase (Chi tiết)**

#### **1. Các Tác nhân Chính (Agents)**
1.  **User (Người dùng):** Người học, đối tượng chính của hệ thống.
2.  **Admin / Creator:** Người quản lý nội dung, tạo và xuất bản các lộ trình học gốc (`Roadmaps`), các module (`Modules`) và các câu hỏi phỏng vấn.
3.  **AI Agent (Trợ lý AI):** Hệ thống trí tuệ nhân tạo (sử dụng OpenAI API) thực hiện các tác vụ hỗ trợ thông minh một cách thụ động khi được người dùng kích hoạt (hỏi-đáp, tóm tắt, phản hồi phỏng vấn, tối ưu CV).

#### **2. Công nghệ sử dụng (Tech Stack)**
*   **Backend:** Express.js
*   **Frontend:** React.js
*   **Styling:** Tailwind CSS
*   **AI Integration:** OpenAI API
*   **Database:** PostgreSQL (Dựa trên schema đã cung cấp)
*   **Real-time Communication (Đề xuất):** WebSocket (cho tính năng phỏng vấn qua tin nhắn thoại trong tương lai).

#### **3. Bảng phân tích chi tiết các Usecase (Phiên bản mới)**

**Usecase 1: Khám phá và Bắt đầu Lộ trình học tập**
*   *Mô tả:* Người dùng tìm kiếm, xem chi tiết và chọn một lộ trình học tập để bắt đầu.
*   **Tác nhân & Hành động:**
    *   **Admin/Creator:**
        *   Thiết kế và tải lên các lộ trình học tập gốc (base roadmaps) lên hệ thống thông qua một giao diện quản trị. (Tương tác với bảng `Roadmaps`).
        *   Định nghĩa các module, chủ đề con, và nội dung học tập cho mỗi lộ trình. (Tương tác với bảng `Modules`).
    *   **User:**
        *   Truy cập trang danh sách các lộ trình học.
        *   Xem thông tin chi tiết (mô tả, các module chính) của một lộ trình.
        *   Nhấn nút "Bắt đầu học" để đăng ký lộ trình đó. Hệ thống sẽ tạo các bản ghi `UserProgress` ban đầu cho tất cả các module trong lộ trình với trạng thái `not_started`.

**Usecase 2: Tương tác Học tập với Trợ lý AI trong Module (Tính năng mới, thay thế Coding)**
*   *Mô tả:* Trong khi học một module cụ thể, người dùng sử dụng Trợ lý AI để làm rõ kiến thức và ghi chú tự động.
*   **Tác nhân & Hành động:**
    *   **User:**
        *   Click vào một node trên roadmap để xem chi tiết module (đọc nội dung, xem video...).
        *   Mở cửa sổ chat của Trợ lý AI được nhúng trong giao diện module.
        *   Gõ câu hỏi (ví dụ: "Giải thích cho tôi về 'virtual DOM' trong React?") hoặc yêu cầu ("Tóm tắt lại phần này trong 3 gạch đầu dòng").
        *   Xem lại lịch sử trò chuyện với AI để ôn tập.
    *   **AI Agent:**
        *   Tiếp nhận câu hỏi từ User cùng với ngữ cảnh là `module_id` hiện tại.
        *   Sử dụng OpenAI API để tạo ra câu trả lời, tóm tắt, hoặc giải thích dựa trên câu hỏi và nội dung của module.
        *   Hiển thị câu trả lời cho User.
        *   **Hệ thống Backend:** Tự động lưu lại câu hỏi của người dùng và câu trả lời của AI vào bảng `AINotes`, gắn với `user_id` và `module_id` tương ứng. `note_type` có thể là `user_question` và `ai_response`.

**Usecase 3: Quản lý Kế hoạch học tập cá nhân**
*   *Mô tả:* Người dùng tự quản lý thời gian biểu học tập của mình bằng công cụ lịch tích hợp.
*   **Tác nhân & Hành động:**
    *   **User:**
        *   Truy cập trang "Lịch học tập".
        *   Tạo một sự kiện học tập mới (ví dụ: "Học React Hooks") bằng cách click và kéo trên lịch.
        *   Điền thông tin chi tiết: tiêu đề, thời gian bắt đầu/kết thúc, mô tả, và có thể tùy chọn liên kết sự kiện đó với một `module_id` cụ thể.
        *   Chỉnh sửa, xóa hoặc đánh dấu các sự kiện là "đã hoàn thành".
    *   **Hệ thống Backend:**
        *   Xử lý các thao tác CRUD (Create, Read, Update, Delete) trên bảng `LearningEvents`.
        *   Không có sự can thiệp của AI trong việc tự động tạo lịch.

**Usecase 4: Luyện phỏng vấn qua Chat với AI (Cập nhật)**
*   *Mô tả:* Người dùng tham gia một buổi phỏng vấn mô phỏng qua giao diện chat với AI để cải thiện kỹ năng trả lời.
*   **Tác nhân & Hành động:**
    *   **User:**
        *   Truy cập tính năng "Luyện phỏng vấn" và bắt đầu một phiên mới.
        *   Nhận câu hỏi từ AI hiển thị dưới dạng tin nhắn chat.
        *   Trả lời câu hỏi bằng cách gõ văn bản hoặc **ghi âm và gửi một tin nhắn thoại** (audio message).
        *   Sau khi kết thúc phiên, xem lại toàn bộ "chat log" của buổi phỏng vấn và đọc phần nhận xét chi tiết, tổng quan từ AI.
    *   **AI Agent & Backend:**
        *   **Bắt đầu phiên:** Dựa trên các kỹ năng người dùng đã học (từ `UserProgress`), chọn ra một bộ câu hỏi phù hợp.
        *   **Trong phiên:** Gửi từng câu hỏi cho User. Nếu nhận được tin nhắn thoại, sử dụng API Speech-to-Text (ví dụ: OpenAI Whisper) để chuyển thành văn bản.
        *   **Kết thúc phiên:**
            *   Lưu toàn bộ buổi phỏng vấn (câu hỏi, câu trả lời của người dùng, phản hồi của AI) dưới dạng cấu trúc JSON vào các cột `questions`, `user_answers`, `ai_feedback` của bảng `InterviewSessions`.
            *   Tổng hợp toàn bộ câu trả lời của người dùng và gửi một prompt lớn đến LLM để yêu cầu phân tích tổng thể và đưa ra nhận xét mang tính xây dựng.

**Usecase 5: Xây dựng và Tối ưu hóa CV**
*   *Mô tả:* Người dùng tạo CV chuyên nghiệp, với sự hỗ trợ của AI trong việc tối ưu hóa nội dung.
*   **Tác nhân & Hành động:**
    *   **Admin:**
        *   **Lưu trữ template (Ngoài CSDL):** Các mẫu template CV (Modern, Classic, Minimal) sẽ được thiết kế dưới dạng các component React. Cấu trúc và layout của chúng được định nghĩa trong code frontend, không lưu trong CSDL quan hệ. Điều này giúp dễ dàng tùy chỉnh và bảo trì.
    *   **User:**
        *   Chọn một mẫu template từ danh sách có sẵn.
        *   Điền thông tin vào các mục (cá nhân, kinh nghiệm, học vấn...).
        *   Với mỗi mục mô tả (ví dụ: mô tả công việc cũ), nhấn nút "Tối ưu với AI".
        *   Tải CV đã hoàn thiện dưới dạng file PDF.
    *   **AI Agent & Backend:**
        *   Khi người dùng điền thông tin, dữ liệu được lưu vào các cột JSON của bảng `CVs`.
        *   Khi người dùng yêu cầu tối ưu, backend gửi đoạn văn bản gốc đến LLM với prompt yêu cầu viết lại một cách chuyên nghiệp, sử dụng các động từ mạnh và từ khóa ngành.
        *   **Render PDF:** Backend sử dụng một thư viện (ví dụ: `Puppeteer` hoặc `PDFKit`) để render component React của CV (với dữ liệu của người dùng) thành một file PDF và trả về URL để lưu vào cột `pdf_url`.

**Usecase 6: Quản lý tiến độ và Nhận Chứng chỉ**
*   *Mô tả:* Người dùng theo dõi tiến độ học tập và nhận chứng chỉ điện tử khi hoàn thành một lộ trình.
*   **Tác nhân & Hành động:**
    *   **Admin:**
        *   Thiết kế mẫu chứng chỉ chung (dưới dạng file ảnh hoặc template HTML/CSS). Tương tự template CV, mẫu này có thể được lưu ở phía frontend hoặc backend dưới dạng tài nguyên tĩnh.
    *   **User:**
        *   Theo dõi tiến độ tổng quan trên Dashboard.
        *   Khi hoàn thành 100% các module trong một roadmap (hệ thống kiểm tra tất cả các bản ghi `UserProgress` liên quan có status `completed`), người dùng sẽ nhận được thông báo.
        *   Xem và tải chứng chỉ từ Dashboard.
    *   **Hệ thống Backend:**
        *   Chạy một tác vụ (trigger hoặc cron job) để kiểm tra điều kiện hoàn thành roadmap của người dùng.
        *   Khi đủ điều kiện, tự động tạo một bản ghi mới trong bảng `Certificates`.
        *   Tạo file PDF của chứng chỉ bằng cách điền thông tin (tên người dùng, tên roadmap, ngày cấp) vào template đã thiết kế sẵn và lưu URL vào cột `pdf_url`.