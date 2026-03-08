import { ValidationError } from '@/api/auth/auth.validation';

const difficultyValues = ['easy', 'medium', 'hard'];

export function validateExerciseCreation(body: { module_id?: string; title?: string; description?: string; difficulty?: string }) {
  const errors: ValidationError[] = [];
  if (!body.module_id || body.module_id.trim().length === 0) {
    errors.push({ field: 'module_id', message: 'module_id is required' });
  }
  if (!body.title || body.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'title is required' });
  }
  if (!body.description || body.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'description is required' });
  }
  if (body.difficulty && !difficultyValues.includes(body.difficulty)) {
    errors.push({ field: 'difficulty', message: 'difficulty must be easy, medium, or hard' });
  }
  return errors;
}

export function validateExerciseUpdate(body: { difficulty?: string }) {
  const errors: ValidationError[] = [];
  if (body.difficulty && !difficultyValues.includes(body.difficulty)) {
    errors.push({ field: 'difficulty', message: 'difficulty must be easy, medium, or hard' });
  }
  return errors;
}

export function validateExerciseSubmission(body: { answer_text?: string }) {
  const errors: ValidationError[] = [];
  if (!body.answer_text || body.answer_text.trim().length === 0) {
    errors.push({ field: 'answer_text', message: 'answer_text is required' });
  }
  return errors;
}
