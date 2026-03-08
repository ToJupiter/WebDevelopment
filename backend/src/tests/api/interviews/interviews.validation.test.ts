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