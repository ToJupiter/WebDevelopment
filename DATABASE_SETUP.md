# 🗄️ Database Setup Guide - SkillSync

## Yêu cầu
- MySQL 8.0+ 
- Node.js 18+

---

## 📋 Cách 1: Setup MySQL trên macOS

### Sử dụng Homebrew
```bash
# Cài MySQL
brew install mysql

# Khởi động MySQL
brew services start mysql

# Đăng nhập (không cần password mặc định)
mysql -u root
```

### Hoặc dùng Docker (nếu có)
```bash
docker run --name skillsync-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=skillsync_db \
  -p 3306:3306 \
  -d mysql:8.0
```

---

## 🔧 Setup Database

### 1. Tạo database
```bash
mysql -u root -p << EOF
CREATE DATABASE skillsync_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skillsync_db;
SHOW TABLES;
EOF
```

### 2. Cấu hình kết nối (.env)
```bash
cd backend
# Sửa file .env (nếu cần)
# DATABASE_URL="mysql://root:password@localhost:3306/skillsync_db"
```

### 3. Chạy Prisma Migrations
```bash
cd backend
npx prisma migrate dev --name init
```

### 4. Seed dữ liệu test (tùy chọn)
```bash
cd backend
npm run seed
```

---

## ✅ Test Kết Nối

### 1. Khởi động backend
```bash
cd backend
npm run dev
```

### 2. Test /health endpoint
```bash
curl http://localhost:4000/health
```

### 3. Test API endpoints
```bash
# Register user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "full_name": "Test User"
  }'

# Get user (nếu có cookie/token)
curl http://localhost:4000/api/users/me \
  -H "x-user-id: <user_id_từ_register>"
```

---

## 🛠️ Quản lý Database

### Xem schema
```bash
cd backend
npx prisma studio  # Mở GUI tại http://localhost:5555
```

### Reset database (XÓA TẤT CẢ DỮ LIỆU)
```bash
cd backend
npx prisma migrate reset
```

### Tạo migration mới
```bash
cd backend
npx prisma migrate dev --name <migration_name>
```

---

## 📊 Schema Bao Gồm:
- ✅ Users (người dùng)
- ✅ Roadmaps (lộ trình học)
- ✅ Modules (bài học)
- ✅ Progress (tiến độ)
- ✅ CalendarEvents (sự kiện)
- ✅ Notes (ghi chú)
- ✅ InterviewSessions (phỏng vấn)
- ✅ CVs (CV)
- ✅ Certificates (chứng chỉ)
- ✅ Exercises (bài tập)

---

## ❌ Troubleshooting

### Lỗi: "Can't connect to MySQL server"
```bash
# Kiểm tra MySQL running
brew services list | grep mysql

# Khởi động lại
brew services restart mysql
```

### Lỗi: "Unknown database"
```bash
# Tạo lại database
mysql -u root -p
CREATE DATABASE skillsync_db;
```

### Lỗi: "Prisma Client not found"
```bash
cd backend
npx prisma generate
```

---

Happy coding! 🚀
