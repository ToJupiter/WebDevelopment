// File: src/tests/api/roadmaps/roadmaps.routes.test.ts
import request from 'supertest';
import app from '@/app';
import prisma from '@/services/prisma.service';

// Create a complete mock of the prisma service
jest.mock('@/services/prisma.service', () => ({
  roadmap: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn()
  },
  module: {
    create: jest.fn()
  }
}));

// Mock the JWT verification
jest.mock('@/services/jwt.service', () => ({
  verifyToken: jest.fn()
}));

describe('Roadmaps Routes', () => {
  const userToken = 'valid-user-token';
  const adminToken = 'valid-admin-token';
  const creatorToken = 'valid-creator-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/roadmaps', () => {
    it('should return published roadmaps without authentication', async () => {
      const mockRoadmaps = [
        { roadmap_id: 'roadmap-1', title: 'Frontend', status: 'published' },
        { roadmap_id: 'roadmap-2', title: 'Backend', status: 'published' }
      ];
      (prisma.roadmap as any).findMany = jest.fn().mockResolvedValue(mockRoadmaps);

      const response = await request(app)
        .get('/api/roadmaps')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockRoadmaps);
    });
  });

  describe('POST /api/roadmaps', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/roadmaps')
        .send({ title: 'New Roadmap' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should return 403 when user does not have required role', async () => {
      // Mock the JWT verification to return a user role
      const { verifyToken } = require('@/services/jwt.service');
      (verifyToken as jest.Mock).mockReturnValue({ 
        user_id: 'user-123', 
        role: 'user', 
        email: 'user@example.com' 
      });

      const response = await request(app)
        .post('/api/roadmaps')
        .set('Cookie', `auth_token=${userToken}`)
        .send({ title: 'New Roadmap' })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Forbidden');
    });

    it('should create roadmap when user is admin', async () => {
      // Mock the JWT verification to return an admin role
      const { verifyToken } = require('@/services/jwt.service');
      (verifyToken as jest.Mock).mockReturnValue({ 
        user_id: 'admin-123', 
        role: 'admin', 
        email: 'admin@example.com' 
      });

      const newRoadmap = { roadmap_id: 'roadmap-new', title: 'New Roadmap' };
      (prisma.roadmap as any).create = jest.fn().mockResolvedValue(newRoadmap);

      const response = await request(app)
        .post('/api/roadmaps')
        .set('Cookie', `auth_token=${adminToken}`)
        .send({ title: 'New Roadmap' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(newRoadmap);
    });

    it('should create roadmap when user is creator', async () => {
      // Mock the JWT verification to return a creator role
      const { verifyToken } = require('@/services/jwt.service');
      (verifyToken as jest.Mock).mockReturnValue({ 
        user_id: 'creator-123', 
        role: 'creator', 
        email: 'creator@example.com' 
      });

      const newRoadmap = { roadmap_id: 'roadmap-new', title: 'New Roadmap' };
      (prisma.roadmap as any).create = jest.fn().mockResolvedValue(newRoadmap);

      const response = await request(app)
        .post('/api/roadmaps')
        .set('Cookie', `auth_token=${creatorToken}`)
        .send({ title: 'New Roadmap' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(newRoadmap);
    });
  });

  describe('POST /api/roadmaps/:roadmapId/modules', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/roadmaps/roadmap-123/modules')
        .send({ title: 'New Module' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should return 403 when user does not have required role', async () => {
      // Mock the JWT verification to return a user role
      const { verifyToken } = require('@/services/jwt.service');
      (verifyToken as jest.Mock).mockReturnValue({ 
        user_id: 'user-123', 
        role: 'user', 
        email: 'user@example.com' 
      });

      const response = await request(app)
        .post('/api/roadmaps/roadmap-123/modules')
        .set('Cookie', `auth_token=${userToken}`)
        .send({ title: 'New Module' })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Forbidden');
    });

    it('should return 403 when user is creator but does not own the roadmap', async () => {
      // Mock the JWT verification to return a creator role
      const { verifyToken } = require('@/services/jwt.service');
      (verifyToken as jest.Mock).mockReturnValue({ 
        user_id: 'creator-123', 
        role: 'creator', 
        email: 'creator@example.com' 
      });

      (prisma.roadmap as any).findUnique = jest.fn().mockResolvedValue({
        roadmap_id: 'roadmap-123',
        created_by: 'other-creator-456'
      });

      const response = await request(app)
        .post('/api/roadmaps/roadmap-123/modules')
        .set('Cookie', `auth_token=${creatorToken}`)
        .send({ title: 'New Module' })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Forbidden: You are not the creator of this roadmap');
    });

    it('should create module when user is admin', async () => {
      // Mock the JWT verification to return an admin role
      const { verifyToken } = require('@/services/jwt.service');
      (verifyToken as jest.Mock).mockReturnValue({ 
        user_id: 'admin-123', 
        role: 'admin', 
        email: 'admin@example.com' 
      });

      (prisma.roadmap as any).findUnique = jest.fn().mockResolvedValue({
        roadmap_id: 'roadmap-123',
        created_by: 'some-creator-456'
      });
      const newModule = { module_id: 'module-new', title: 'New Module' };
      (prisma.module as any).create = jest.fn().mockResolvedValue(newModule);

      const response = await request(app)
        .post('/api/roadmaps/roadmap-123/modules')
        .set('Cookie', `auth_token=${adminToken}`)
        .send({ title: 'New Module' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(newModule);
    });

    it('should create module when user is creator and owns the roadmap', async () => {
      // Mock the JWT verification to return a creator role
      const { verifyToken } = require('@/services/jwt.service');
      (verifyToken as jest.Mock).mockReturnValue({ 
        user_id: 'creator-123', 
        role: 'creator', 
        email: 'creator@example.com' 
      });

      (prisma.roadmap as any).findUnique = jest.fn().mockResolvedValue({
        roadmap_id: 'roadmap-123',
        created_by: 'creator-123'
      });
      const newModule = { module_id: 'module-new', title: 'New Module' };
      (prisma.module as any).create = jest.fn().mockResolvedValue(newModule);

      const response = await request(app)
        .post('/api/roadmaps/roadmap-123/modules')
        .set('Cookie', `auth_token=${creatorToken}`)
        .send({ title: 'New Module' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(newModule);
    });
  });
});