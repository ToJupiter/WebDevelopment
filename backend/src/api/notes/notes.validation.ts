import { ValidationError } from '@/api/auth/auth.validation';

export function validateAiChatPayload(body: { question?: string }) {
  const errors: ValidationError[] = [];
  if (!body.question || body.question.trim().length < 5) {
    errors.push({ field: 'question', message: 'Question must be at least 5 characters long' });
  }
  return errors;
}