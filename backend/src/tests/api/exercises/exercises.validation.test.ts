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