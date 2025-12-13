import { Request, Response } from 'express';
import { createExercise, deleteExercise, listExercises, submitExercise, updateExercise } from './exercises.services';

function extractUserId(req: Request) {
  const header = req.headers['x-user-id'];
  if (typeof header === 'string' && header.trim().length > 0) {
    return header;
  }
  return undefined;
}

export async function listExercisesHandler(req: Request, res: Response) {
  try {
    const moduleId = typeof req.query.module_id === 'string' ? req.query.module_id : undefined;
    const exercises = await listExercises(moduleId);
    return res.status(200).json({ success: true, data: exercises, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function createExerciseHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const exercise = await createExercise({
      module_id: req.body.module_id,
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      examples: req.body.examples,
    });
    return res.status(201).json({ success: true, data: exercise, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function updateExerciseHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { exerciseId } = req.params;
    const updated = await updateExercise(exerciseId, {
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      examples: req.body.examples,
    });
    if (!updated) {
      return res.status(404).json({ success: false, data: null, error: 'Exercise not found' });
    }
    return res.status(200).json({ success: true, data: updated, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function deleteExerciseHandler(req: Request, res: Response) {
  try {
    // const userId = extractUserId(req);
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }
    const { exerciseId } = req.params;
    const deleted = await deleteExercise(exerciseId);
    if (!deleted) {
      return res.status(404).json({ success: false, data: null, error: 'Exercise not found' });
    }
    return res.status(200).json({ success: true, data: deleted, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}

export async function submitExerciseHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
    }

    const { exerciseId } = req.params;
    const { answer_text } = req.body;

    const submission = await submitExercise(exerciseId, userId, answer_text);
    
    if (!submission) {
      return res.status(404).json({ success: false, data: null, error: 'Exercise not found' });
    }

    return res.status(201).json({ success: true, data: submission, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: 'Internal Server Error' });
  }
}