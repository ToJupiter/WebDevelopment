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