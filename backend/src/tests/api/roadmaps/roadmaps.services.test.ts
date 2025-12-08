import { listPublishedRoadmaps, getRoadmapWithModules, enrollUserInRoadmap } from '@/api/roadmaps/roadmaps.services';
import prisma from '@/services/prisma.service';
import { Status } from '@/generated/prisma/client';

jest.mock('@/services/prisma.service', () => ({
  roadmap: {
    findMany: jest.fn(),
    findUnique: jest.fn()
  },
  userProgress: {
    findMany: jest.fn(),
    create: jest.fn()
  },
  $transaction: jest.fn()
}));

describe('Roadmaps Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listPublishedRoadmaps', () => {
    it('should return published roadmaps without category filter', async () => {
      const mockRoadmaps = [
        {
          roadmap_id: 'roadmap-1',
          title: 'Frontend',
          description: 'Learn frontend',
          category: 'development',
          image_url: null,
          status: Status.published,
          created_at: new Date(),
          updated_at: new Date(),
          modules: [{ module_id: 'mod-1' }, { module_id: 'mod-2' }]
        }
      ];
      (prisma.roadmap.findMany as jest.Mock).mockResolvedValue(mockRoadmaps);

      const result = await listPublishedRoadmaps();

      expect(prisma.roadmap.findMany).toHaveBeenCalledWith({
        where: { status: Status.published },
        select: expect.any(Object),
        orderBy: { updated_at: 'desc' }
      });
      expect(result[0].module_count).toBe(2);
      expect(result[0].roadmap_id).toBe('roadmap-1');
    });

    it('should filter by category when provided', async () => {
      (prisma.roadmap.findMany as jest.Mock).mockResolvedValue([]);
      await listPublishedRoadmaps('development');
      expect(prisma.roadmap.findMany).toHaveBeenCalledWith({
        where: { status: Status.published, category: 'development' },
        select: expect.any(Object),
        orderBy: { updated_at: 'desc' }
      });
    });
  });

  describe('getRoadmapWithModules', () => {
    it('should return roadmap with modules sorted by order_index', async () => {
      const mockRoadmap = {
        roadmap_id: 'roadmap-1',
        title: 'Frontend',
        description: 'Learn frontend',
        category: 'development',
        image_url: null,
        status: Status.published,
        created_at: new Date(),
        updated_at: new Date(),
        modules: [
          { module_id: 'mod-1', title: 'Module 1', order_index: 1 },
          { module_id: 'mod-2', title: 'Module 2', order_index: 2 }
        ]
      };
      (prisma.roadmap.findUnique as jest.Mock).mockResolvedValue(mockRoadmap);

      const result = await getRoadmapWithModules('roadmap-1');

      expect(result?.modules[0].order_index).toBe(1);
      expect(result?.module_count).toBe(2);
    });

    it('should return null for non-existent roadmap', async () => {
      (prisma.roadmap.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await getRoadmapWithModules('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('enrollUserInRoadmap', () => {
    const mockUserId = 'user-123';
    const mockRoadmapId = 'roadmap-1';

    it('should enroll user in all modules when no existing progress', async () => {
      const mockRoadmap = {
        roadmap_id: mockRoadmapId,
        modules: [
          { module_id: 'mod-1' },
          { module_id: 'mod-2' }
        ]
      };
      (prisma.roadmap.findUnique as jest.Mock).mockResolvedValue(mockRoadmap);
      (prisma.userProgress.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.$transaction as jest.Mock).mockResolvedValue([]);

      const result = await enrollUserInRoadmap(mockUserId, mockRoadmapId);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual({ roadmap_id: mockRoadmapId, enrolled: 2 });
    });

    it('should only enroll in new modules when some progress exists', async () => {
      const mockRoadmap = {
        roadmap_id: mockRoadmapId,
        modules: [
          { module_id: 'mod-1' },
          { module_id: 'mod-2' },
          { module_id: 'mod-3' }
        ]
      };
      (prisma.roadmap.findUnique as jest.Mock).mockResolvedValue(mockRoadmap);
      (prisma.userProgress.findMany as jest.Mock).mockResolvedValue([
        { module_id: 'mod-1' }
      ]);

      const result = await enrollUserInRoadmap(mockUserId, mockRoadmapId);

      expect(result).not.toBeNull();
      expect(result!.enrolled).toBe(2); // mod-2 and mod-3
    });

    it('should return null for non-existent roadmap', async () => {
      (prisma.roadmap.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await enrollUserInRoadmap(mockUserId, mockRoadmapId);
      expect(result).toBeNull();
    });

    it('should handle roadmaps with no modules', async () => {
      const mockRoadmap = {
        roadmap_id: mockRoadmapId,
        modules: []
      };
      (prisma.roadmap.findUnique as jest.Mock).mockResolvedValue(mockRoadmap);
      const result = await enrollUserInRoadmap(mockUserId, mockRoadmapId);
      expect(result).toEqual({ roadmap_id: mockRoadmapId, enrolled: 0 });
    });
  });
});