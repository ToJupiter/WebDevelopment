import { Request, Response } from 'express';
import { listUserCertificates, issueCertificate } from './certificates.services';

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
