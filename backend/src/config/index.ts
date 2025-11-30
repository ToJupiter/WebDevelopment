import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key-change-me',
    jwtExpiresIn: '24h',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    cookieName: 'skillsync_token',
};

export default config;