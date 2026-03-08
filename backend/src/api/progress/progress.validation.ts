import { ProgressStatus } from '@/generated/prisma/client';
import { ValidationError } from '@/api/auth/auth.validation';

const allowedStatuses: ProgressStatus[] = ['not_started', 'in_progress', 'completed'];

export function validateProgressUpdate(body: { status?: string; completion_percentage?: number }): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!body.status || !allowedStatuses.includes(body.status as ProgressStatus)) {
    errors.push({ field: 'status', message: 'Status is required and must be not_started, in_progress, or completed' });
  }
  const completion = body.completion_percentage;
  if (typeof completion !== 'number' || completion < 0 || completion > 100) {
    errors.push({ field: 'completion_percentage', message: 'Completion percentage must be a number between 0 and 100' });
  }
  return errors;
}
