#!/bin/bash

# SkillSync Quick Start Script
# Chạy: bash quick-start.sh

set -e  # Exit on error

echo "🚀 SkillSync Backend - Quick Start"
echo "=================================="

# Step 1: Check MySQL
echo ""
echo "📍 Checking MySQL..."
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL not found. Install with: brew install mysql"
    exit 1
fi
echo "✅ MySQL found"

# Step 2: Start MySQL
echo ""
echo "📍 Starting MySQL service..."
brew services start mysql 2>/dev/null || echo "⚠️  MySQL already running"
sleep 2

# Step 3: Create database
echo ""
echo "📍 Creating database..."
mysql -u root 2>/dev/null << EOF || echo "⚠️  Using existing database"
CREATE DATABASE IF NOT EXISTS skillsync_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

# Step 4: Install backend dependencies
echo ""
echo "📍 Installing backend dependencies..."
cd backend
npm install --silent
echo "✅ Dependencies installed"

# Step 5: Generate Prisma Client
echo ""
echo "📍 Generating Prisma Client..."
export $(cat .env | xargs)
npx prisma generate --skip-engine-check 2>/dev/null || npx prisma generate
echo "✅ Prisma Client generated"

# Step 6: Run migrations
echo ""
echo "📍 Running database migrations..."
npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init --skip-generate
echo "✅ Migrations completed"

# Step 7: Seed database (optional)
echo ""
read -p "Seed sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📍 Seeding database..."
    npm run seed
    echo "✅ Sample data inserted"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "  1. cd backend"
echo "  2. npm run dev  (Start backend on port 4000)"
echo "  3. Open new terminal: cd frontend && npm start"
echo ""
echo "Test: curl http://localhost:4000/health"
echo ""
