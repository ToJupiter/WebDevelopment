import { Role, User } from '@/generated/prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        role: Role;
        email: string;
      };
    }
  }
}

export {};