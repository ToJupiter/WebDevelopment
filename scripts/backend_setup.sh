# cd backend
# pnpm init

pnpm install express cors helmet morgan cookie-parser bcryptjs jsonwebtoken dotenv winston
pnpm install prisma @prisma/client
pnpm install zod swagger-jsdoc swagger-ui-express multer

# Install dev dependencies
pnpm install -D typescript @types/node @types/express @types/cors @types/jsonwebtoken @types/cookie-parser @types/morgan @types/swagger-jsdoc @types/swagger-ui-express @types/multer nodemon ts-node jest @types/jest supertest @types/supertest

# MySQL related
mysql -u root -p -e "CREATE DATABASE ai_app;"
# --- Enter the password: SafePass ---

# Prisma-related
pnpm install prisma --save-dev
pnpx prisma init
pnpx prisma generate
pnpx prisma migrate dev --name init # 
pnpx prisma db push # Push schema.prisma to the database
pnpx prisma db pull
pnpx prisma studio


