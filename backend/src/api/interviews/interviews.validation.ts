import { InterviewType } from '@/generated/prisma/client';
import { ValidationError } from '../auth/auth.validation';

const ALLOWED_TYPES: InterviewType[] = ['simulated', 'prep_feedback'];

export function validateInterviewCreation(body: { session_name?: string; interview_type?: string }) {
  const errors: ValidationError[] = [];
  if (!body.session_name || body.session_name.trim().length < 3) {
    errors.push({ field: 'session_name', message: 'Session name must be at least 3 characters long' });
  }
  if (!body.interview_type || !ALLOWED_TYPES.includes(body.interview_type as InterviewType)) {
    errors.push({ field: 'interview_type', message: `Interview type must be one of ${ALLOWED_TYPES.join(', ')}` });
  }
  return errors;
}

export function validateInterviewSubmission(body: { user_answers?: Array<{ question_id?: string; answer?: string }> }) {
  const errors: ValidationError[] = [];
  if (!Array.isArray(body.user_answers) || body.user_answers.length === 0) {
    errors.push({ field: 'user_answers', message: 'At least one answer is required' });
    return errors;
  }
  body.user_answers.forEach((answer, index) => {
    if (!answer.question_id || typeof answer.question_id !== 'string') {
      errors.push({ field: `user_answers[${index}].question_id`, message: 'Question identifier is required' });
    }
    if (!answer.answer || answer.answer.trim().length === 0) {
      errors.push({ field: `user_answers[${index}].answer`, message: 'Answer text is required' });
    }
  });
  return errors;
}