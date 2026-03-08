import { Request, Response } from 'express';
import {
  createInterviewSession,
  listSessions,
  submitInterviewSession,
  InterviewAnswer,
} from './interviews.services';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function startInterviewHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const session = await createInterviewSession(userId, {
      session_name: req.body.session_name,
      interview_type: req.body.interview_type,
    });
    return res.status(201).json({
      success: true,
      data: {
        session_id: session.session_id,
        questions: session.questions,
      },
      error: null,
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function submitInterviewHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { sessionId } = req.params;
    const answers: InterviewAnswer[] = req.body.user_answers;
    const updated = await submitInterviewSession(userId, sessionId, answers);
    if (!updated) {
      return res.status(404).json({ success: false, data: null, error: 'Session not found' });
    }
    return res.status(200).json({
      success: true,
      data: {
        session_id: updated.session_id,
        ai_feedback: updated.ai_feedback,
        score: updated.score,
      },
      error: null,
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function listInterviewsHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const sessions = await listSessions(userId);
    return res.status(200).json({ success: true, data: sessions, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}