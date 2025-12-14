import { Request, Response } from 'express';
import { TemplateStyle } from '@/generated/prisma/client';
import { createCV, listUserCVs, optimizeCVSection, updateCV, getCVById } from './cvs.services';
import { generateCVPdf, streamPdf } from '@/services/pdf.service';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function listCVsHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const cvs = await listUserCVs(userId);
    return res.status(200).json({ success: true, data: cvs, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function createCVHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const created = await createCV(userId, {
      cv_name: req.body.cv_name,
      template_style: req.body.template_style as TemplateStyle,
      personal_info: req.body.personal_info,
      education: req.body.education,
      experience: req.body.experience,
      skills: req.body.skills,
      projects: req.body.projects,
    });
    return res.status(201).json({ success: true, data: created, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function updateCVHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { cvId } = req.params;
    const updated = await updateCV(userId, cvId, {
      cv_name: req.body.cv_name,
      template_style: req.body.template_style as TemplateStyle,
      personal_info: req.body.personal_info,
      education: req.body.education,
      experience: req.body.experience,
      skills: req.body.skills,
      projects: req.body.projects,
    });
    if (!updated) {
      return res.status(404).json({ success: false, data: null, error: 'CV not found' });
    }
    return res.status(200).json({ success: true, data: updated, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function optimizeCVHandler(req: Request, res: Response) {
  try {
    const { cvId } = req.params;
    const { section, index, text } = req.body;
    const result = await optimizeCVSection(cvId, section, typeof index === 'number' ? index : null, text);
    return res.status(200).json({ success: true, data: result, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function generatePDFHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.user_id;
    const { cvId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const cvData = await getCVById(cvId);

    if (!cvData || cvData.user_id !== userId) {
      return res.status(404).json({ success: false, error: 'CV not found' });
    }

    // Call the shared PDF service
    streamPdf(res, (doc) => {
      generateCVPdf(doc, cvData);
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
}