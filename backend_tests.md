## File: src/tests/middleware/validateRequest.test.ts

```typescript
import { validateRequest } from '@/middleware/validateRequest';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@/api/auth/auth.validation';

describe('validateRequest Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = { body: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should call next() when no validation errors', async () => {
    const validator = jest.fn().mockReturnValue([]);
    const middleware = validateRequest(validator);

    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(validator).toHaveBeenCalledWith(mockRequest.body);
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 400 when validation errors exist', async () => {
    const errors: ValidationError[] = [
      { field: 'email', message: 'Invalid email' }
    ];
    const validator = jest.fn().mockReturnValue(errors);
    const middleware = validateRequest(validator);

    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: 'Validation failed',
      details: errors
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle multiple validation errors',  async () => {
    const errors: ValidationError[] = [
      { field: 'email', message: 'Invalid email' },
      { field: 'password', message: 'Too short' }
    ];
    const validator = jest.fn().mockReturnValue(errors);
    const middleware = validateRequest(validator);

    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        details: errors
      })
    );
  });

  it('should handle validator throwing an error', async () => {
    const validator = jest.fn().mockImplementation(() => {
      throw new Error('Validator error');
    });
    const middleware = validateRequest(validator);

    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: 'Internal Server Error'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should catch async validator errors', async () => {
    const validator = jest.fn().mockRejectedValue(new Error('Async error'));
    const middleware = validateRequest(validator);

    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: 'Internal Server Error'
    });
  });
});
```

## File: src/tests/api/exercises/exercises.validation.test.ts

```typescript
import { validateExerciseCreation, validateExerciseUpdate, validateExerciseSubmission } from '@/api/exercises/exercises.validation';

describe('Exercises Validation', () => {
  describe('validateExerciseCreation', () => {
    it('should return no errors for valid input', () => {
      const body = {
        module_id: 'mod-123',
        title: 'Introduction to Arrays',
        description: 'Create an array and access elements'
      };
      const errors = validateExerciseCreation(body);
      expect(errors).toHaveLength(0);
    });

    it('should validate module_id is required', () => {
      const body = {
        title: 'Introduction to Arrays',
        description: 'Create an array and access elements'
      } as any;
      const errors = validateExerciseCreation(body);
      expect(errors).toContainEqual({
        field: 'module_id',
        message: 'module_id is required'
      });
    });

    it('should reject empty module_id', () => {
      const body = {
        module_id: '',
        title: 'Introduction to Arrays',
        description: 'Create an array and access elements'
      };
      const errors = validateExerciseCreation(body);
      expect(errors.some(e => e.field === 'module_id')).toBe(true);
    });

    it('should validate title is required', () => {
      const body = {
        module_id: 'mod-123',
        description: 'Create an array and access elements'
      } as any;
      const errors = validateExerciseCreation(body);
      expect(errors).toContainEqual({
        field: 'title',
        message: 'title is required'
      });
    });

    it('should reject empty title', () => {
      const body = {
        module_id: 'mod-123',
        title: '',
        description: 'Create an array and access elements'
      };
      const errors = validateExerciseCreation(body);
      expect(errors.some(e => e.field === 'title')).toBe(true);
    });

    it('should validate description is required', () => {
      const body = {
        module_id: 'mod-123',
        title: 'Introduction to Arrays'
      } as any;
      const errors = validateExerciseCreation(body);
      expect(errors).toContainEqual({
        field: 'description',
        message: 'description is required'
      });
    });

    it('should validate difficulty values', () => {
      const body = {
        module_id: 'mod-123',
        title: 'Introduction to Arrays',
        description: 'Create an array',
        difficulty: 'impossible'
      };
      const errors = validateExerciseCreation(body);
      expect(errors).toContainEqual({
        field: 'difficulty',
        message: 'difficulty must be easy, medium, or hard'
      });
    });

    it('should accept valid difficulty values', () => {
      const validDifficulties = ['easy', 'medium', 'hard'];
      validDifficulties.forEach(difficulty => {
        const body = {
          module_id: 'mod-123',
          title: 'Introduction to Arrays',
          description: 'Create an array',
          difficulty
        };
        const errors = validateExerciseCreation(body);
        expect(errors.filter(e => e.field === 'difficulty')).toHaveLength(0);
      });
    });

    it('should allow optional difficulty', () => {
      const body = {
        module_id: 'mod-123',
        title: 'Introduction to Arrays',
        description: 'Create an array'
      } as any;
      const errors = validateExerciseCreation(body);
      expect(errors.filter(e => e.field === 'difficulty')).toHaveLength(0);
    });
  });

  describe('validateExerciseUpdate', () => {
    it('should return no errors for empty update', () => {
      const errors = validateExerciseUpdate({});
      expect(errors).toHaveLength(0);
    });

    it('should validate difficulty if provided', () => {
      const body = { difficulty: 'super-hard' };
      const errors = validateExerciseUpdate(body);
      expect(errors).toContainEqual({
        field: 'difficulty',
        message: 'difficulty must be easy, medium, or hard'
      });
    });

    it('should accept valid difficulty in update', () => {
      const body = { difficulty: 'easy' };
      const errors = validateExerciseUpdate(body);
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateExerciseSubmission', () => {
    it('should return no errors for valid submission', () => {
      const body = {
        answer_text: 'function solution() { return true; }'
      };
      const errors = validateExerciseSubmission(body);
      expect(errors).toHaveLength(0);
    });

    it('should validate answer_text is required', () => {
      const body = {} as any;
      const errors = validateExerciseSubmission(body);
      expect(errors).toContainEqual({
        field: 'answer_text',
        message: 'answer_text is required'
      });
    });

    it('should reject empty answer_text', () => {
      const body = {
        answer_text: ''
      };
      const errors = validateExerciseSubmission(body);
      expect(errors.some(e => e.field === 'answer_text')).toBe(true);
    });

    it('should reject whitespace-only answer_text', () => {
      const body = {
        answer_text: '   '
      };
      const errors = validateExerciseSubmission(body);
      expect(errors.some(e => e.field === 'answer_text')).toBe(true);
    });
  });
});
```

## File: src/tests/api/progress/progress.services.test.ts

```typescript
import { findModuleProgress, updateModuleProgress } from '@/api/progress/progress.services';
import { PrismaClient } from '@/generated/prisma/client';
import { ProgressStatus } from '@/generated/prisma/client';
import prisma from '@/services/prisma.service';

jest.mock('@/services/prisma.service', () => ({
  userProgress: {
    findUnique: jest.fn(),
    upsert: jest.fn()
  }
}));

describe('Progress Services', () => {
  const mockUserId = 'user-123';
  const mockModuleId = 'module-456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findModuleProgress', () => {
    it('should call prisma with correct composite key', async () => {
      const mockProgress = {
        user_id: mockUserId,
        module_id: mockModuleId,
        status: 'in_progress' as ProgressStatus,
        completion_percentage: 50,
        last_accessed_at: new Date()
      };
      (prisma.userProgress.findUnique as jest.Mock).mockResolvedValue(mockProgress);

      const result = await findModuleProgress(mockUserId, mockModuleId);

      expect(prisma.userProgress.findUnique).toHaveBeenCalledWith({
        where: { user_id_module_id: { user_id: mockUserId, module_id: mockModuleId } }
      });
      expect(result).toEqual(mockProgress);
    });
  });

  describe('updateModuleProgress', () => {
    it('should upsert progress with correct data', async () => {
      const mockProgress = {
        user_id: mockUserId,
        module_id: mockModuleId,
        status: 'completed' as ProgressStatus,
        completion_percentage: 100,
        last_accessed_at: new Date()
      };
      (prisma.userProgress.upsert as jest.Mock).mockResolvedValue(mockProgress);

      const result = await updateModuleProgress(mockUserId, mockModuleId, 'completed', 100);

      expect(prisma.userProgress.upsert).toHaveBeenCalledWith({
        where: { user_id_module_id: { user_id: mockUserId, module_id: mockModuleId } },
        create: {
          user_id: mockUserId,
          module_id: mockModuleId,
          status: 'completed',
          completion_percentage: 100
        },
        update: {
          status: 'completed',
          completion_percentage: 100
        }
      });
      expect(result).toEqual(mockProgress);
    });
  });
});
```

## File: src/tests/api/progress/progress.validation.test.ts

```typescript
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
```

## File: src/tests/api/interviews/interviews.validation.test.ts

```typescript
import { validateInterviewCreation, validateInterviewSubmission } from '@/api/interviews/interviews.validation';
import { InterviewType } from '@/generated/prisma/client';

describe('Interviews Validation', () => {
  describe('validateInterviewCreation', () => {
    it('should return no errors for valid input', () => {
      const body = {
        session_name: 'Frontend Practice',
        interview_type: 'simulated' as InterviewType
      };
      const errors = validateInterviewCreation(body);
      expect(errors).toHaveLength(0);
    });

    it('should validate session_name minimum length', () => {
      const body = {
        session_name: 'Hi',
        interview_type: 'simulated' as InterviewType
      };
      const errors = validateInterviewCreation(body);
      expect(errors).toContainEqual({
        field: 'session_name',
        message: 'Session name must be at least 3 characters long'
      });
    });

    it('should reject empty session_name', () => {
      const body = {
        session_name: '',
        interview_type: 'simulated' as InterviewType
      };
      const errors = validateInterviewCreation(body);
      expect(errors.some(e => e.field === 'session_name')).toBe(true);
    });

    it('should validate interview_type is required', () => {
      const body = {
        session_name: 'Frontend Practice'
      } as any;
      const errors = validateInterviewCreation(body);
      expect(errors).toContainEqual({
        field: 'interview_type',
        message: 'Interview type must be one of simulated, prep_feedback'
      });
    });

    it('should validate interview_type values', () => {
      const body = {
        session_name: 'Frontend Practice',
        interview_type: 'invalid_type' as any
      };
      const errors = validateInterviewCreation(body);
      expect(errors).toContainEqual({
        field: 'interview_type',
        message: 'Interview type must be one of simulated, prep_feedback'
      });
    });

    it('should accept all valid interview types', () => {
      const validTypes: InterviewType[] = ['simulated', 'prep_feedback'];
      validTypes.forEach(type => {
        const body = {
          session_name: 'Frontend Practice',
          interview_type: type
        };
        const errors = validateInterviewCreation(body);
        expect(errors.filter(e => e.field === 'interview_type')).toHaveLength(0);
      });
    });
  });

  describe('validateInterviewSubmission', () => {
    const validAnswers = [
      { question_id: 'q1', answer: 'My answer' },
      { question_id: 'q2', answer: 'Another answer' }
    ];

    it('should return no errors for valid submission', () => {
      const body = { user_answers: validAnswers };
      const errors = validateInterviewSubmission(body);
      expect(errors).toHaveLength(0);
    });

    it('should validate user_answers is an array', () => {
      const body = { user_answers: 'not-an-array' as any };
      const errors = validateInterviewSubmission(body);
      expect(errors).toContainEqual({
        field: 'user_answers',
        message: 'At least one answer is required'
      });
    });

    it('should validate array is not empty', () => {
      const body = { user_answers: [] };
      const errors = validateInterviewSubmission(body);
      expect(errors).toContainEqual({
        field: 'user_answers',
        message: 'At least one answer is required'
      });
    });

    it('should validate each answer has question_id', () => {
      const body = {
        user_answers: [
          { answer: 'No ID here' }
        ] as any
      };
      const errors = validateInterviewSubmission(body);
      expect(errors).toContainEqual({
        field: 'user_answers[0].question_id',
        message: 'Question identifier is required'
      });
    });

    it('should validate each answer has answer text', () => {
      const body = {
        user_answers: [
          { question_id: 'q1' }
        ] as any
      };
      const errors = validateInterviewSubmission(body);
      expect(errors).toContainEqual({
        field: 'user_answers[0].answer',
        message: 'Answer text is required'
      });
    });

    it('should validate all answers in array', () => {
      const body = {
        user_answers: [
          { question_id: 'q1' },
          { answer: 'No ID' },
          { question_id: 'q3', answer: '' }
        ] as any
      };
      const errors = validateInterviewSubmission(body);
      expect(errors.length).toBe(3);
      expect(errors.some(e => e.field.includes('question_id'))).toBe(true);
      expect(errors.some(e => e.field.includes('answer'))).toBe(true);
    });

    it('should reject whitespace-only answers', () => {
      const body = {
        user_answers: [
          { question_id: 'q1', answer: '   ' }
        ]
      };
      const errors = validateInterviewSubmission(body);
      expect(errors).toContainEqual({
        field: 'user_answers[0].answer',
        message: 'Answer text is required'
      });
    });
  });
});
```

## File: src/tests/api/calendar/calendar.validation.test.ts

```typescript
import { validateCalendarQuery, validateCalendarCreation, validateCalendarUpdate} from '@/api/calendar/calendar.validation';

describe('Calendar Validation', () => {
  describe('validateCalendarQuery', () => {
    it('should return no errors for valid date strings', () => {
      const query = {
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-12-31T23:59:59.999Z'
      };
      const errors = validateCalendarQuery(query);
      expect(errors).toHaveLength(0);
    });

    it('should return no errors for empty query', () => {
      const errors = validateCalendarQuery({});
      expect(errors).toHaveLength(0);
    });

    it('should validate ISO date format', () => {
      const query = {
        start: 'invalid-date',
        end: 'not-a-date-at-all'
      };
      const errors = validateCalendarQuery(query);
      expect(errors).toContainEqual({
        field: 'start',
        message: 'start must be a valid ISO date string'
      });
      expect(errors).toContainEqual({
        field: 'end',
        message: 'end must be a valid ISO date string'
      });
    });

    it('should reject non-string values', () => {
      const query = {
        start: 12345 as any,
        end: null as any
      };
      const errors = validateCalendarQuery(query);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateCalendarCreation', () => {
    const validInput = {
      title: 'Study Session',
      start_utc: '2024-01-15T10:00:00.000Z',
      end_utc: '2024-01-15T11:00:00.000Z'
    };

    it('should return no errors for valid input', () => {
      const errors = validateCalendarCreation(validInput);
      expect(errors).toHaveLength(0);
    });

    it('should validate title minimum length', () => {
      const input = { ...validInput, title: 'Hi' };
      const errors = validateCalendarCreation(input);
      expect(errors).toContainEqual({
        field: 'title',
        message: 'title is required and must be at least 3 characters'
      });
    });

    it('should reject empty title', () => {
      const input = { ...validInput, title: '' };
      const errors = validateCalendarCreation(input);
      expect(errors.some(e => e.field === 'title')).toBe(true);
    });

    it('should validate start_utc is required', () => {
      const input = { ...validInput, start_utc: undefined };
      const errors = validateCalendarCreation(input);
      expect(errors).toContainEqual({
        field: 'start_utc',
        message: 'start_utc must be a valid ISO date string'
      });
    });

    it('should validate end_utc is after start_utc', () => {
      const input = {
        ...validInput,
        start_utc: '2024-01-15T11:00:00.000Z',
        end_utc: '2024-01-15T10:00:00.000Z'
      };
      const errors = validateCalendarCreation(input);
      expect(errors).toContainEqual({
        field: 'end_utc',
        message: 'end_utc must be after start_utc'
      });
    });

    it('should allow equal dates if logic permits', () => {
      const timestamp = '2024-01-15T10:00:00.000Z';
      const input = { ...validInput, start_utc: timestamp, end_utc: timestamp };
      const errors = validateCalendarCreation(input);
      // This should pass or fail based on the implementation
      // The current implementation only checks start > end, so equal is allowed
      expect(errors.some(e => e.field === 'end_utc')).toBe(false);
    });
  });

  describe('validateCalendarUpdate', () => {
    const validUpdate = {
      title: 'Updated Session',
      start_utc: '2024-01-15T12:00:00.000Z',
      end_utc: '2024-01-15T13:00:00.000Z'
    };

    it('should return no errors for valid update', () => {
      const errors = validateCalendarUpdate(validUpdate);
      expect(errors).toHaveLength(0);
    });

    it('should allow partial updates', () => {
      const errors = validateCalendarUpdate({});
      expect(errors).toHaveLength(0);
    });

    it('should validate title if provided', () => {
      const input = { title: 'Hi' };
      const errors = validateCalendarUpdate(input);
      expect(errors).toContainEqual({
        field: 'title',
        message: 'title must be at least 3 characters if provided'
      });
    });

    it('should validate date logic for updates', () => {
      const input = {
        start_utc: '2024-01-15T13:00:00.000Z',
        end_utc: '2024-01-15T12:00:00.000Z'
      };
      const errors = validateCalendarUpdate(input);
      expect(errors).toContainEqual({
        field: 'end_utc',
        message: 'end_utc must be after start_utc'
      });
    });
  });
});
```

## File: src/tests/api/auth/auth.validation.test.ts

```typescript
import { validateRegisterInput, ValidationError } from '@/api/auth/auth.validation';

describe('validateRegisterInput', () => {
  it('should return no errors for valid input', () => {
    const input = {
      full_name: 'johndoe',
      email: 'john@example.com',
      password: 'Secure123@'
    };
    const errors = validateRegisterInput(input);
    expect(errors).toHaveLength(0);
  });

  it('should validate full_name minimum length', () => {
    const input = {
      full_name: 'Jo',
      email: 'john@example.com',
      password: 'Secure123@'
    };
    const errors = validateRegisterInput(input);
    expect(errors).toContainEqual({
      field: 'full_name',
      message: 'Full name must be at least 3 characters long'
    });
  });

  it('should reject empty full_name', () => {
    const input = {
      full_name: '',
      email: 'john@example.com',
      password: 'Secure123@'
    };
    const errors = validateRegisterInput(input);
    expect(errors.some(e => e.field === 'full_name')).toBe(true);
  });

  it('should reject whitespace-only full_name', () => {
    const input = {
      full_name: '   ',
      email: 'john@example.com',
      password: 'Secure123@'
    };
    const errors = validateRegisterInput(input);
    expect(errors.some(e => e.field === 'full_name')).toBe(true);
  });

  it('should validate email format', () => {
    const invalidEmails = ['invalid', 'invalid@', 'invalid@domain', '@domain.com'];
    invalidEmails.forEach(email => {
      const input = { full_name: 'John Doe', email, password: 'Secure123@' };
      const errors = validateRegisterInput(input);
      expect(errors).toContainEqual({
        field: 'email',
        message: 'Invalid email address format'
      });
    });
  });

  it('should accept valid email formats', () => {
    const validEmails = ['test@example.com', 'user.name@domain.co.uk', 'user+tag@domain.com'];
    validEmails.forEach(email => {
      const input = { full_name: 'John_Doe', email, password: 'Secure123@' };
      const errors = validateRegisterInput(input);
      expect(errors.filter(e => e.field === 'email')).toHaveLength(0);
    });
  });

  it('should validate password minimum length', () => {
    const input = {
      full_name: 'JohnDoe123',
      email: 'john@example.com',
      password: 'short'
    };
    const errors = validateRegisterInput(input);
    expect(errors).toContainEqual({
      field: 'password',
      message: 'Password must be at least 8 characters long'
    });
  });

  it('should return multiple errors for invalid input', () => {
    const input = {
      full_name: 'JoMama',
      email: 'invalid-email',
      password: 'short'
    };
    const errors = validateRegisterInput(input);
    expect(errors).toHaveLength(3);
    expect(errors.map(e => e.field).sort()).toEqual(['email', 'full_name', 'password']);
  });

  it('should handle missing fields gracefully', () => {
    const input = {} as any;
    const errors = validateRegisterInput(input);
    expect(errors.length).toBeGreaterThan(0);
  });
});
```

## File: src/tests/api/roadmaps/roadmaps.services.test.ts

```typescript
import { listPublishedRoadmaps, getRoadmapWithModules, enrollUserInRoadmap } from '@/api/roadmaps/roadmaps.services';
import prisma from '@/services/prisma.service';
import { Status } from '@/generated/prisma/client';

jest.mock('@/services/prisma.service', () => ({
  roadmap: {
    findMany: jest.fn(),
    findUnique: jest.fn()
  },
  userProgress: {
    findMany: jest.fn(),
    create: jest.fn()
  },
  $transaction: jest.fn()
}));

describe('Roadmaps Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listPublishedRoadmaps', () => {
    it('should return published roadmaps without category filter', async () => {
      const mockRoadmaps = [
        {
          roadmap_id: 'roadmap-1',
          title: 'Frontend',
          description: 'Learn frontend',
          category: 'development',
          image_url: null,
          status: Status.published,
          created_at: new Date(),
          updated_at: new Date(),
          modules: [{ module_id: 'mod-1' }, { module_id: 'mod-2' }]
        }
      ];
      (prisma.roadmap.findMany as jest.Mock).mockResolvedValue(mockRoadmaps);

      const result = await listPublishedRoadmaps();

      expect(prisma.roadmap.findMany).toHaveBeenCalledWith({
        where: { status: Status.published },
        select: expect.any(Object),
        orderBy: { updated_at: 'desc' }
      });
      expect(result[0].module_count).toBe(2);
      expect(result[0].roadmap_id).toBe('roadmap-1');
    });

    it('should filter by category when provided', async () => {
      (prisma.roadmap.findMany as jest.Mock).mockResolvedValue([]);
      await listPublishedRoadmaps('development');
      expect(prisma.roadmap.findMany).toHaveBeenCalledWith({
        where: { status: Status.published, category: 'development' },
        select: expect.any(Object),
        orderBy: { updated_at: 'desc' }
      });
    });
  });

  describe('getRoadmapWithModules', () => {
    it('should return roadmap with modules sorted by order_index', async () => {
      const mockRoadmap = {
        roadmap_id: 'roadmap-1',
        title: 'Frontend',
        description: 'Learn frontend',
        category: 'development',
        image_url: null,
        status: Status.published,
        created_at: new Date(),
        updated_at: new Date(),
        modules: [
          { module_id: 'mod-1', title: 'Module 1', order_index: 1 },
          { module_id: 'mod-2', title: 'Module 2', order_index: 2 }
        ]
      };
      (prisma.roadmap.findUnique as jest.Mock).mockResolvedValue(mockRoadmap);

      const result = await getRoadmapWithModules('roadmap-1');

      expect(result?.modules[0].order_index).toBe(1);
      expect(result?.module_count).toBe(2);
    });

    it('should return null for non-existent roadmap', async () => {
      (prisma.roadmap.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await getRoadmapWithModules('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('enrollUserInRoadmap', () => {
    const mockUserId = 'user-123';
    const mockRoadmapId = 'roadmap-1';

    it('should enroll user in all modules when no existing progress', async () => {
      const mockRoadmap = {
        roadmap_id: mockRoadmapId,
        modules: [
          { module_id: 'mod-1' },
          { module_id: 'mod-2' }
        ]
      };
      (prisma.roadmap.findUnique as jest.Mock).mockResolvedValue(mockRoadmap);
      (prisma.userProgress.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.$transaction as jest.Mock).mockResolvedValue([]);

      const result = await enrollUserInRoadmap(mockUserId, mockRoadmapId);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual({ roadmap_id: mockRoadmapId, enrolled: 2 });
    });

    it('should only enroll in new modules when some progress exists', async () => {
      const mockRoadmap = {
        roadmap_id: mockRoadmapId,
        modules: [
          { module_id: 'mod-1' },
          { module_id: 'mod-2' },
          { module_id: 'mod-3' }
        ]
      };
      (prisma.roadmap.findUnique as jest.Mock).mockResolvedValue(mockRoadmap);
      (prisma.userProgress.findMany as jest.Mock).mockResolvedValue([
        { module_id: 'mod-1' }
      ]);

      const result = await enrollUserInRoadmap(mockUserId, mockRoadmapId);

      expect(result).not.toBeNull();
      expect(result!.enrolled).toBe(2); // mod-2 and mod-3
    });

    it('should return null for non-existent roadmap', async () => {
      (prisma.roadmap.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await enrollUserInRoadmap(mockUserId, mockRoadmapId);
      expect(result).toBeNull();
    });

    it('should handle roadmaps with no modules', async () => {
      const mockRoadmap = {
        roadmap_id: mockRoadmapId,
        modules: []
      };
      (prisma.roadmap.findUnique as jest.Mock).mockResolvedValue(mockRoadmap);
      const result = await enrollUserInRoadmap(mockUserId, mockRoadmapId);
      expect(result).toEqual({ roadmap_id: mockRoadmapId, enrolled: 0 });
    });
  });
});
```

## File: src/tests/api/roadmaps/roadmaps.validation.test.ts

```typescript
import { isValidRoadmapId } from '@/api/roadmaps/roadmaps.validation';

describe('isValidRoadmapId', () => {
  it('should return true for valid UUID v4', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';
    expect(isValidRoadmapId(validUuid)).toBe(true);
  });

  it('should return true for valid UUID with uppercase letters', () => {
    const validUuid = '123E4567-E89B-12D3-A456-426614174ABC';
    expect(isValidRoadmapId(validUuid)).toBe(true);
  });

  it('should return false for invalid UUID format', () => {
    const invalidUuids = [
      'invalid-uuid',
      '123e4567-e89b-12d3-a456', // incomplete
      '123e4567e89b12d3a456426614174000', // no hyphens
      '123e4567-e89b-12d3-a456-426614174000-extra', // too long
      '', // empty string
      '   ', // whitespace
    ];
    invalidUuids.forEach(uuid => {
      expect(isValidRoadmapId(uuid)).toBe(false);
    });
  });

  it('should return false for non-string values', () => {
    const nonStrings = [null, undefined, 123, {}, []];
    nonStrings.forEach(value => {
      expect(isValidRoadmapId(value as any)).toBe(false);
    });
  });
});
```

## File: src/tests/api/cvs/cvs.controller.test.ts

```typescript
import { listCVsHandler, createCVHandler, updateCVHandler, optimizeCVHandler } from '@/api/cvs/cvs.controller';
import { listUserCVs, createCV, updateCV, optimizeCVSection } from '@/api/cvs/cvs.services';
import { Request, Response } from 'express';
import { TemplateStyle } from '@/generated/prisma/client';

jest.mock('@/api/cvs/cvs.services');

describe('CVs Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  const mockUserId = 'user-123';
  const mockCVId = 'cv-456';

  describe('listCVsHandler', () => {
    it('should return 401 when user ID is missing', async () => {
      mockRequest = { headers: {} };

      await listCVsHandler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        data: null,
        error: 'Unauthorized'
      });
    });

    it('should return 200 with CVs for valid user', async () => {
      const mockCVs = [
        {
          cv_id: 'cv-1',
          cv_name: 'My CV',
          template_style: 'modern' as TemplateStyle,
          created_at: new Date(),
          updated_at: new Date(),
          pdf_url: null
        }
      ];
      mockRequest = { headers: { 'x-user-id': mockUserId } };
      (listUserCVs as jest.Mock).mockResolvedValue(mockCVs);

      await listCVsHandler(mockRequest as Request, mockResponse as Response);

      expect(listUserCVs).toHaveBeenCalledWith(mockUserId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCVs,
        error: null
      });
    });

    it('should handle service errors and return 500', async () => {
      mockRequest = { headers: { 'x-user-id': mockUserId } };
      (listUserCVs as jest.Mock).mockRejectedValue(new Error('Database error'));

      await listCVsHandler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        data: null,
        error: 'Internal Server Error'
      });
    });
  });

  describe('createCVHandler', () => {
    const validPayload = {
      cv_name: 'My CV',
      template_style: 'modern',
      personal_info: { name: 'John' }
    };

    it('should return 401 when user ID is missing', async () => {
      mockRequest = { headers: {}, body: validPayload };

      await createCVHandler(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should create CV and return 201 for valid input', async () => {
      const mockCreatedCV = {
        cv_id: 'cv-new',
        user_id: mockUserId,
        ...validPayload
      };
      mockRequest = { 
        headers: { 'x-user-id': mockUserId }, 
        body: validPayload 
      };
      (createCV as jest.Mock).mockResolvedValue(mockCreatedCV);

      await createCVHandler(mockRequest as Request, mockResponse as Response);

      expect(createCV).toHaveBeenCalledWith(mockUserId, {
        cv_name: 'My CV',
        template_style: 'modern',
        personal_info: { name: 'John' },
        education: undefined,
        experience: undefined,
        skills: undefined,
        projects: undefined
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedCV,
        error: null
      });
    });
  });

  describe('optimizeCVHandler', () => {
    it('should optimize CV section and return result', async () => {
      const mockResult = {
        cv_id: mockCVId,
        section: 'experience',
        optimized_text: 'Optimized: Led team...',
        index: 0
      };
      mockRequest = {
        params: { cvId: mockCVId },
        body: { section: 'experience', index: 0, text: 'Led team...' }
      };
      (optimizeCVSection as jest.Mock).mockResolvedValue(mockResult);

      await optimizeCVHandler(mockRequest as Request, mockResponse as Response);

      expect(optimizeCVSection).toHaveBeenCalledWith(mockCVId, 'experience', 0, 'Led team...');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
        error: null
      });
    });
  });
});
```

## File: src/tests/api/cvs/cvs.validation.test.ts

```typescript
import { validateCVCreation, validateCVUpdate, validateCVOptimization} from '@/api/cvs/cvs.validation';
import { TemplateStyle } from '@/generated/prisma/client';

describe('CV Validation', () => {
  describe('validateCVCreation', () => {
    it('should return no errors for valid input', () => {
      const body = {
        cv_name: 'My Resume',
        template_style: 'modern'
      };
      const errors = validateCVCreation(body);
      expect(errors).toHaveLength(0);
    });

    it('should validate cv_name minimum length', () => {
      const body = {
        cv_name: 'CV',
        template_style: 'modern'
      };
      const errors = validateCVCreation(body);
      expect(errors).toContainEqual({
        field: 'cv_name',
        message: 'cv_name is required and must be at least 3 characters'
      });
    });

    it('should reject empty cv_name', () => {
      const body = {
        cv_name: '',
        template_style: 'modern'
      };
      const errors = validateCVCreation(body);
      expect(errors.some(e => e.field === 'cv_name')).toBe(true);
    });

    it('should validate template_style is required', () => {
      const body = {
        cv_name: 'My Resume'
      } as any;
      const errors = validateCVCreation(body);
      expect(errors).toContainEqual({
        field: 'template_style',
        message: 'template_style must be modern, classic, or minimal'
      });
    });

    it('should validate template_style values', () => {
      const invalidStyles = ['fancy', 'corporate', '123'];
      invalidStyles.forEach(style => {
        const body = {
          cv_name: 'My Resume',
          template_style: style
        };
        const errors = validateCVCreation(body);
        expect(errors).toContainEqual({
          field: 'template_style',
          message: 'template_style must be modern, classic, or minimal'
        });
      });
    });

    it('should accept all valid template styles', () => {
      const validStyles: TemplateStyle[] = ['modern', 'classic', 'minimal'];
      validStyles.forEach(style => {
        const body = {
          cv_name: 'My Resume',
          template_style: style
        };
        const errors = validateCVCreation(body);
        expect(errors).toHaveLength(0);
      });
    });
  });

  describe('validateCVUpdate', () => {
    it('should return no errors for empty update', () => {
      const errors = validateCVUpdate({});
      expect(errors).toHaveLength(0);
    });

    it('should validate template_style if provided', () => {
      const body = { template_style: 'invalid' };
      const errors = validateCVUpdate(body);
      expect(errors).toContainEqual({
        field: 'template_style',
        message: 'template_style must be modern, classic, or minimal'
      });
    });

    it('should accept valid template_style in update', () => {
      const body = { template_style: 'classic' };
      const errors = validateCVUpdate(body);
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateCVOptimization', () => {
    it('should return no errors for valid input', () => {
      const body = {
        section: 'experience',
        text: 'Led a team of developers...'
      };
      const errors = validateCVOptimization(body);
      expect(errors).toHaveLength(0);
    });

    it('should validate section is required', () => {
      const body = {
        text: 'Led a team of developers...'
      } as any;
      const errors = validateCVOptimization(body);
      expect(errors).toContainEqual({
        field: 'section',
        message: 'section must be one of personal_info, education, experience, skills, projects'
      });
    });

    it('should validate section values', () => {
      const body = {
        section: 'invalid_section',
        text: 'Led a team of developers...'
      };
      const errors = validateCVOptimization(body);
      expect(errors).toContainEqual({
        field: 'section',
        message: 'section must be one of personal_info, education, experience, skills, projects'
      });
    });

    it('should accept all valid sections', () => {
      const validSections = ['personal_info', 'education', 'experience', 'skills', 'projects'];
      validSections.forEach(section => {
        const body = { section, text: 'Sample text' };
        const errors = validateCVOptimization(body);
        expect(errors).toHaveLength(0);
      });
    });

    it('should validate text is required', () => {
      const body = {
        section: 'experience'
      } as any;
      const errors = validateCVOptimization(body);
      expect(errors).toContainEqual({
        field: 'text',
        message: 'text is required for optimization'
      });
    });

    it('should reject empty text', () => {
      const body = {
        section: 'experience',
        text: ''
      };
      const errors = validateCVOptimization(body);
      expect(errors.some(e => e.field === 'text')).toBe(true);
    });

    it('should reject whitespace-only text', () => {
      const body = {
        section: 'experience',
        text: '   '
      };
      const errors = validateCVOptimization(body);
      expect(errors.some(e => e.field === 'text')).toBe(true);
    });
  });
});
```

## File: src/tests/api/certificates/certificates.services.test.ts

```typescript
import { listUserCertificates, issueCertificate } from '@/api/certificates/certificates.services';
import prisma from '@/services/prisma.service';

jest.mock('@/services/prisma.service', () => ({
  certificate: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn()
  }
}));

describe('Certificates Services', () => {
  const mockUserId = 'user-123';
  const mockRoadmapId = 'roadmap-456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listUserCertificates', () => {
    it('should call prisma with correct parameters', async () => {
      const mockCertificates = [
        {
          certificate_id: 'cert-1',
          roadmap_id: 'roadmap-456',
          certificate_name: 'Cert 1',
          issue_date: new Date(),
          pdf_url: null
        }
      ];
      (prisma.certificate.findMany as jest.Mock).mockResolvedValue(mockCertificates);

      const result = await listUserCertificates(mockUserId);

      expect(prisma.certificate.findMany).toHaveBeenCalledWith({
        where: { user_id: mockUserId },
        orderBy: { issue_date: 'desc' },
        select: {
          certificate_id: true,
          roadmap_id: true,
          certificate_name: true,
          issue_date: true,
          pdf_url: true
        }
      });
      expect(result).toEqual(mockCertificates);
    });
  });

  describe('issueCertificate', () => {
    it('should create certificate if it does not exist', async () => {
      const mockCertificate = {
        certificate_id: 'new-cert',
        user_id: mockUserId,
        roadmap_id: mockRoadmapId,
        certificate_name: 'Test Cert'
      };
      (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.certificate.create as jest.Mock).mockResolvedValue(mockCertificate);

      const result = await issueCertificate(mockUserId, mockRoadmapId, 'Test Cert');

      expect(prisma.certificate.findUnique).toHaveBeenCalledWith({
        where: { user_id_roadmap_id: { user_id: mockUserId, roadmap_id: mockRoadmapId } }
      });
      expect(prisma.certificate.create).toHaveBeenCalled();
      expect(result).toEqual(mockCertificate);
    });

    it('should return null if certificate already exists', async () => {
      const existingCertificate = { certificate_id: 'existing' };
      (prisma.certificate.findUnique as jest.Mock).mockResolvedValue(existingCertificate);

      const result = await issueCertificate(mockUserId, mockRoadmapId, 'Test Cert');

      expect(result).toBeNull();
      expect(prisma.certificate.create).not.toHaveBeenCalled();
    });
  });
});
```

## File: src/tests/api/certificates/certificates.validation.test.ts

```typescript
import { validateCertificatePayload} from '@/api/certificates/certificates.validation';

describe('validateCertificatePayload', () => {
  it('should return no errors for valid input', () => {
    const body = {
      roadmap_id: '123e4567-e89b-12d3-a456-426614174000',
      certificate_name: 'Full Stack Development'
    };
    const errors = validateCertificatePayload(body);
    expect(errors).toHaveLength(0);
  });

  it('should accept road_map as alias for roadmap_id', () => {
    const body = {
      road_map: '123e4567-e89b-12d3-a456-426614174000',
      certificate_name: 'Full Stack Development'
    };
    const errors = validateCertificatePayload(body);
    expect(errors).toHaveLength(0);
  });

  it('should validate roadmap_id is required', () => {
    const body = {
      certificate_name: 'Full Stack Development'
    };
    const errors = validateCertificatePayload(body);
    expect(errors).toContainEqual({
      field: 'roadmap_id',
      message: 'roadmap_id is required'
    });
  });

  it('should reject empty roadmap_id', () => {
    const body = {
      roadmap_id: '',
      certificate_name: 'Full Stack Development'
    };
    const errors = validateCertificatePayload(body);
    expect(errors.some(e => e.field === 'roadmap_id')).toBe(true);
  });

  it('should reject whitespace-only roadmap_id', () => {
    const body = {
      roadmap_id: '   ',
      certificate_name: 'Full Stack Development'
    };
    const errors = validateCertificatePayload(body);
    expect(errors.some(e => e.field === 'roadmap_id')).toBe(true);
  });

  it('should validate certificate_name minimum length', () => {
    const body = {
      roadmap_id: '123e4567-e89b-12d3-a456-426614174000',
      certificate_name: 'AB'
    };
    const errors = validateCertificatePayload(body);
    expect(errors).toContainEqual({
      field: 'certificate_name',
      message: 'certificate_name must be at least 3 characters'
    });
  });

  it('should reject empty certificate_name', () => {
    const body = {
      roadmap_id: '123e4567-e89b-12d3-a456-426614174000',
      certificate_name: ''
    };
    const errors = validateCertificatePayload(body);
    expect(errors.some(e => e.field === 'certificate_name')).toBe(true);
  });

  it('should return multiple errors for missing fields', () => {
    const body = {};
    const errors = validateCertificatePayload(body);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.map(e => e.field)).toContain('roadmap_id');
    expect(errors.map(e => e.field)).toContain('certificate_name');
  });
});
```

## File: src/tests/config/index.test.ts

```typescript

```