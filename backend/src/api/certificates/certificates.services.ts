import prisma from '@/services/prisma.service';

export type CertificateRecord = {
  certificate_id: string;
  roadmap_id: string;
  certificate_name: string;
  issue_date: Date;
  pdf_url: string | null;
};

export async function listUserCertificates(userId: string) {
  return prisma.certificate.findMany({
    where: { user_id: userId },
    orderBy: { issue_date: 'desc' },
    select: {
      certificate_id: true,
      roadmap_id: true,
      certificate_name: true,
      issue_date: true,
      pdf_url: true,
    },
  });
}

export async function issueCertificate(userId: string, roadmapId: string, certificateName: string) {
  const existing = await prisma.certificate.findUnique({
    where: { user_id_roadmap_id: { user_id: userId, roadmap_id: roadmapId } },
  });
  if (existing) {
    return null;
  }
  return prisma.certificate.create({
    data: {
      user_id: userId,
      roadmap_id: roadmapId,
      certificate_name: certificateName,
    },
  });
}
