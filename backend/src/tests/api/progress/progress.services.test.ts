import { findModuleProgress, updateModuleProgress } from '@/api/progress/progress.services';
import { PrismaClient } from '@/generated/prisma/client';
import { ProgressStatus } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';

jest.mock('@/services/prisma.service', () => ({
  userProgress: {
    findUnique: jest.fn(),
    upsert: jest.fn()
  }
}));

describe('Progress Services', () => {
  const mockUserId = 'user-123';
  const mockModuleId = 'module-456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findModuleProgress', () => {
    it('should call prisma with correct composite key', async () => {
      const mockProgress = {
        user_id: mockUserId,
        module_id: mockModuleId,
        status: 'in_progress' as ProgressStatus,
        completion_percentage: 50,
        last_accessed_at: new Date()
      };
      (prisma.userProgress.findUnique as jest.Mock).mockResolvedValue(mockProgress);

      const result = await findModuleProgress(mockUserId, mockModuleId);

      expect(prisma.userProgress.findUnique).toHaveBeenCalledWith({
        where: { user_id_module_id: { user_id: mockUserId, module_id: mockModuleId } }
      });
      expect(result).toEqual(mockProgress);
    });
  });

  describe('updateModuleProgress', () => {
    it('should upsert progress with correct data', async () => {
      const mockProgress = {
        user_id: mockUserId,
        module_id: mockModuleId,
        status: 'completed' as ProgressStatus,
        completion_percentage: 100,
        last_accessed_at: new Date()
      };
      (prisma.userProgress.upsert as jest.Mock).mockResolvedValue(mockProgress);

      const result = await updateModuleProgress(mockUserId, mockModuleId, 'completed', 100);

      expect(prisma.userProgress.upsert).toHaveBeenCalledWith({
        where: { user_id_module_id: { user_id: mockUserId, module_id: mockModuleId } },
        create: {
          user_id: mockUserId,
          module_id: mockModuleId,
          status: 'completed',
          completion_percentage: 100
        },
        update: {
          status: 'completed',
          completion_percentage: 100
        }
      });
      expect(result).toEqual(mockProgress);
    });
  });
});