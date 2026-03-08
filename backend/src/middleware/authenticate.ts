import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/services/jwt.service';
import config from '../config';
import { Role } from '@/generated/prisma/client';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies[config.cookieName];

  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, data: null, error: 'Unauthorized: No token provided' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, data: null, error: 'Unauthorized: Invalid or expired token' });
  }

  req.user = decoded;

  return next();
};

export const requireRole = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, data: null, error: 'Forbidden: Insufficient permissions' });
  }
  return next();
};