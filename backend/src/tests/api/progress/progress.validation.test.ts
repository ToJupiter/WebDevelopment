import { validateProgressUpdate } from '@/api/progress/progress.validation';
import { ProgressStatus } from '@/generated/prisma/client';

describe('validateProgressUpdate', () => {
  it('should return no errors for valid input', () => {
    const body = {
      status: 'in_progress' as ProgressStatus,
      completion_percentage: 50
    };
    const errors = validateProgressUpdate(body);
    expect(errors).toHaveLength(0);
  });

  it('should validate status is required', () => {
    const body = {
      completion_percentage: 50
    } as any;
    const errors = validateProgressUpdate(body);
    expect(errors).toContainEqual({
      field: 'status',
      message: 'Status is required and must be not_started, in_progress, or completed'
    });
  });

  it('should validate status values', () => {
    const body = {
      status: 'invalid_status' as any,
      completion_percentage: 50
    };
    const errors = validateProgressUpdate(body);
    expect(errors).toContainEqual({
      field: 'status',
      message: 'Status is required and must be not_started, in_progress, or completed'
    });
  });

  it('should accept all valid status values', () => {
    const validStatuses: ProgressStatus[] = ['not_started', 'in_progress', 'completed'];
    validStatuses.forEach(status => {
      const body = { status, completion_percentage: 50 };
      const errors = validateProgressUpdate(body);
      expect(errors.filter(e => e.field === 'status')).toHaveLength(0);
    });
  });

  it('should validate completion_percentage is a number', () => {
    const body = {
      status: 'in_progress',
      completion_percentage: 'fifty' as any
    };
    const errors = validateProgressUpdate(body);
    expect(errors).toContainEqual({
      field: 'completion_percentage',
      message: 'Completion percentage must be a number between 0 and 100'
    });
  });

  it('should validate completion_percentage minimum value', () => {
    const body = {
      status: 'in_progress',
      completion_percentage: -10
    };
    const errors = validateProgressUpdate(body);
    expect(errors).toContainEqual({
      field: 'completion_percentage',
      message: 'Completion percentage must be a number between 0 and 100'
    });
  });

  it('should validate completion_percentage maximum value', () => {
    const body = {
      status: 'in_progress',
      completion_percentage: 150
    };
    const errors = validateProgressUpdate(body);
    expect(errors).toContainEqual({
      field: 'completion_percentage',
      message: 'Completion percentage must be a number between 0 and 100'
    });
  });

  it('should accept boundary values', () => {
    const boundaryValues = [0, 100];
    boundaryValues.forEach(value => {
      const body = {
        status: 'in_progress',
        completion_percentage: value
      };
      const errors = validateProgressUpdate(body);
      expect(errors.filter(e => e.field === 'completion_percentage')).toHaveLength(0);
    });
  });

  it('should return multiple errors for invalid input', () => {
    const body = {
      status: 'invalid' as any,
      completion_percentage: -50
    };
    const errors = validateProgressUpdate(body);
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });
});