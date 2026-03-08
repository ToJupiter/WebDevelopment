import { listUserCertificates, issueCertificate } from '@/api/certificates/certificates.services';
import prisma from '@/services/prisma.service';

jest.mock('@/services/prisma.service', () => ({
  certificate: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn()
  }
}));

describe('Certificates Services', () => {
  const mockUserId = 'user-123';
  const mockRoadmapId = 'roadmap-456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listUserCertificates', () => {
    it('should call prisma with correct parameters', async () => {
      const mockCertificates = [
        {
          certificate_id: 'cert-1',
          roadmap_id: 'roadmap-456',
          certificate_name: 'Cert 1',
          issue_date: new Date(),
          pdf_url: null
        }
      ];
      (prisma.certificate.findMany as jest.Mock).mockResolvedValue(mockCertificates);

      const result = await listUserCertificates(mockUserId);

      expect(prisma.certificate.findMany).toHaveBeenCalledWith({
        where: { user_id: mockUserId },
        orderBy: { issue_date: 'desc' },
        select: {
          certificate_id: true,
          roadmap_id: true,
          certificate_name: true,
          issue_date: true,
          pdf_url: true
        }
      });
      expect(result).toEqual(mockCertificates);
    });
  });

  describe('issueCertificate', () => {
    it('should create certificate if it does not exist', async () => {
      const mockCertificate = {
        certificate_id: 'new-cert',
        user_id: mockUserId,
        roadmap_id: mockRoadmapId,
        certificate_name: 'Test Cert'
      };
      (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.certificate.create as jest.Mock).mockResolvedValue(mockCertificate);

      const result = await issueCertificate(mockUserId, mockRoadmapId, 'Test Cert');

      expect(prisma.certificate.findUnique).toHaveBeenCalledWith({
        where: { user_id_roadmap_id: { user_id: mockUserId, roadmap_id: mockRoadmapId } }
      });
      expect(prisma.certificate.create).toHaveBeenCalled();
      expect(result).toEqual(mockCertificate);
    });

    it('should return null if certificate already exists', async () => {
      const existingCertificate = { certificate_id: 'existing' };
      (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(existingCertificate);

      const result = await issueCertificate(mockUserId, mockRoadmapId, 'Test Cert');

      expect(result).toBeNull();
      expect(prisma.certificate.create).not.toHaveBeenCalled();
    });
  });
});