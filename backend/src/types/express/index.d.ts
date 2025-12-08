import { User } from '@/generated/prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        role: string;
        email: string;
      };
    }
  }
}