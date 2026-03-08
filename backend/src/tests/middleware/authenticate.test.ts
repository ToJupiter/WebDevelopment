// File: src/tests/middleware/authenticate.test.ts
import { Request, Response, NextFunction } from 'express';
import { requireAuth, requireRole } from '@/middleware/authenticate';
import { verifyToken } from '@/services/jwt.service';
import { Role } from '@/generated/prisma/client';

// Mock the jwt service
jest.mock('@/services/jwt.service', () => ({
  verifyToken: jest.fn()
}));

// Mock the config
jest.mock('../config', () => ({
  cookieName: 'auth_token'
}));

describe('Authentication Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      cookies: {},
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('requireAuth', () => {
    it('should call next() when valid token is in cookie', () => {
      const mockDecoded = { user_id: 'user-123', role: Role.user, email: 'user@example.com' };
      mockRequest.cookies = { auth_token: 'valid-token' };
      (verifyToken as jest.Mock).mockReturnValue(mockDecoded);

      requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(verifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockRequest.user).toEqual(mockDecoded);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should call next() when valid token is in authorization header', () => {
      const mockDecoded = { user_id: 'user-123', role: Role.user, email: 'user@example.com' };
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      (verifyToken as jest.Mock).mockReturnValue(mockDecoded);

      requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(verifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockRequest.user).toEqual(mockDecoded);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 401 when no token is provided', () => {
      requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        data: null,
        error: 'Unauthorized: No token provided'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', () => {
      mockRequest.cookies = { auth_token: 'invalid-token' };
      (verifyToken as jest.Mock).mockReturnValue(null);

      requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(verifyToken).toHaveBeenCalledWith('invalid-token');
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        data: null,
        error: 'Unauthorized: Invalid or expired token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('should call next() when user has required role', () => {
      const middleware = requireRole([Role.admin, Role.creator]);
      mockRequest.user = { user_id: 'user-123', role: Role.admin, email: 'admin@example.com' };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 403 when user does not have required role', () => {
      const middleware = requireRole([Role.admin, Role.creator]);
      mockRequest.user = { user_id: 'user-123', role: Role.user, email: 'user@example.com' };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        data: null,
        error: 'Forbidden: Insufficient permissions'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user is not authenticated', () => {
      const middleware = requireRole([Role.admin, Role.creator]);

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        data: null,
        error: 'Forbidden: Insufficient permissions'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});