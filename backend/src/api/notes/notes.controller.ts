import { Request, Response } from 'express';
import { NoteType } from '@/generated/prisma/client';
import { createChatCompletion, extractFirstMessageContent, ChatMessage } from '@/services/groq.service';
import { createModuleNote, getModuleById, getNextSequenceOrder, listModuleNotes } from './notes.services';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function aiChatHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { moduleId } = req.params;
    const moduleMeta = await getModuleById(moduleId);
    if (!moduleMeta) {
      return res.status(404).json({ success: false, data: null, error: 'Module not found' });
    }
    const question = req.body.question.trim();
    const sequenceOrder = await getNextSequenceOrder(userId, moduleId);
    await createModuleNote(userId, moduleId, question, NoteType.user_question, sequenceOrder);

    const systemMessage: ChatMessage = {
      role: 'system',
      content: 'You are a friendly learning assistant for SkillSync. Answer clearly and keep the tone helpful.',
    };
    const userMessage: ChatMessage = {
      role: 'user',
      content: `Module: ${moduleMeta.title ?? 'the current module'}\nQuestion: ${question}\nAnswer in a concise bullet-style explanation with a key takeaway.`,
    };
    const completion = await createChatCompletion([systemMessage, userMessage], 'openai/gpt-oss-20b', 0.5);
    const answer = extractFirstMessageContent(completion) ?? 'Unable to generate a response at this time.';
    const aiNote = await createModuleNote(userId, moduleId, answer, NoteType.ai_response, sequenceOrder + 1);
    return res.status(200).json({ success: true, data: { answer, note_id: aiNote.note_id }, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function listNotesHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { moduleId } = req.params;
    const moduleMeta = await getModuleById(moduleId);
    if (!moduleMeta) {
      return res.status(404).json({ success: false, data: null, error: 'Module not found' });
    }
    const notes = await listModuleNotes(userId, moduleId);
    return res.status(200).json({ success: true, data: notes, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}