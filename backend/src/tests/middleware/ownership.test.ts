// File: src/tests/middleware/ownership.test.ts
import { Request, Response, NextFunction } from 'express';
import {
  checkOwnership,
  verifyRoadmapOwnership,
  verifyModuleOwnership,
  verifyExerciseOwnership,
  checkEnrollment
} from '@/middleware/ownership';
import prisma from '@/services/prisma.service';
import { Role } from '@/generated/prisma/client';

// Create a complete mock of the prisma service
jest.mock('@/services/prisma.service', () => ({
  roadmap: {
    findUnique: jest.fn()
  },
  module: {
    findUnique: jest.fn()
  },
  exercise: {
    findUnique: jest.fn()
  },
  userProgress: {
    findUnique: jest.fn()
  }
}));

describe('Ownership Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      params: {},
      query: {},
      body: {},
      user: {
        user_id: 'user-123',
        role: Role.user,
        email: 'user@example.com'
      }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('checkOwnership', () => {
    it('should call next() for admin users', async () => {
      mockRequest.user = { user_id: 'admin-123', role: Role.admin, email: 'admin@example.com' };
      const middleware = checkOwnership('roadmap', 'roadmapId', 'created_by');

      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(prisma.roadmap?.findUnique).not.toHaveBeenCalled();
    });

    it('should call next() when user owns the resource', async () => {
      mockRequest.params = { roadmapId: 'roadmap-123' };
      (prisma.roadmap as any).findUnique = jest.fn().mockResolvedValue({
        created_by: 'user-123'
      });
      const middleware = checkOwnership('roadmap', 'roadmapId', 'created_by');

      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(prisma.roadmap.findUnique).toHaveBeenCalledWith({
        where: { roadmap_id: 'roadmap-123' },
        select: { created_by: true }
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 when user does not own the resource', async () => {
      mockRequest.params = { roadmapId: 'roadmap-123' };
      (prisma.roadmap as any).findUnique = jest.fn().mockResolvedValue({
        created_by: 'other-user-456'
      });
      const middleware = checkOwnership('roadmap', 'roadmapId', 'created_by');

      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(prisma.roadmap.findUnique).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Forbidden: You do not own this resource'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 404 when resource does not exist', async () => {
      mockRequest.params = { roadmapId: 'nonexistent-roadmap' };
      (prisma.roadmap as any).findUnique = jest.fn().mockResolvedValue(null);
      const middleware = checkOwnership('roadmap', 'roadmapId', 'created_by');

      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(prisma.roadmap.findUnique).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Resource not found'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 500 when an error occurs', async () => {
      mockRequest.params = { roadmapId: 'roadmap-123' };
      (prisma.roadmap as any).findUnique = jest.fn().mockRejectedValue(new Error('Database error'));
      const middleware = checkOwnership('roadmap', 'roadmapId', 'created_by');

      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(prisma.roadmap.findUnique).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal Server Error'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  // Similar updates for other test cases in verifyRoadmapOwnership, verifyModuleOwnership, etc.
  // Ensure all prisma.model references are properly mocked
});