import jwt from 'jsonwebtoken';
import {Secret, SignOptions} from 'jsonwebtoken';
import { Response, CookieOptions } from 'express';
import config from '../config';

interface TokenPayload {
  user_id: string;
  email: string;
  role: string;
}

export const cookieOptions: CookieOptions = {
  httpOnly: true, 
  secure: config.env === 'production', 
  sameSite: config.env === 'production' ? 'strict' : 'lax', 
  maxAge: 24 * 60 * 60 * 1000,
};

export function signToken(payload: TokenPayload): string {
  const secret: Secret = config.jwtSecret;
  const options: SignOptions = { 
    expiresIn: config.jwtExpiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`
  };
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(config.cookieName, token, cookieOptions);
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(config.cookieName, { ...cookieOptions, maxAge: 0 });
}