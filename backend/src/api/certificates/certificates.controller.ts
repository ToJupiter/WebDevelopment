import { Request, Response } from 'express';
import { listUserCertificates, issueCertificate } from './certificates.services';
import { generateCertificatePdf, streamPdf } from '@/services/pdf.service';
import prisma from "@/services/prisma.service";

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function listCertificatesHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const certificates = await listUserCertificates(userId);
    return res.status(200).json({ success: true, data: certificates, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function issueCertificateHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { roadmap_id } = req.body;
    const certificateName = req.body.certificate_name;
    const created = await issueCertificate(userId, roadmap_id, certificateName);
    if (!created) {
      return res.status(409).json({ success: false, data: null, error: 'Certificate already issued' });
    }
    return res.status(201).json({ success: true, data: created, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function downloadCertificatePdfHandler(req: Request, res: Response) {
  try {
    const { certificateId } = req.params;
    const userId = req.user?.user_id;

    const cert = await prisma.certificate.findUnique({
      where: { certificate_id: certificateId },
      include: { user: true, roadmap: true }
    });

    if (!cert || cert.user_id !== userId) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }

    streamPdf(res, (doc) => {
      generateCertificatePdf(doc, {
        userName: cert.user.full_name,
        courseName: cert.roadmap.title,
        date: new Date(cert.issue_date)
      });
    });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}