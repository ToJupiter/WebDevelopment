import { TemplateStyle } from '@/generated/prisma/client';
import { ValidationError } from '@/api/auth/auth.validation';
import { templateStyles } from './cvs.services';

const optimizationSections = ['personal_info', 'education', 'experience', 'skills', 'projects'];

export function validateCVCreation(body: { cv_name?: string; template_style?: string }) {
  const errors: ValidationError[] = [];
  if (!body.cv_name || body.cv_name.trim().length < 3) {
    errors.push({ field: 'cv_name', message: 'cv_name is required and must be at least 3 characters' });
  }
  if (!body.template_style || !templateStyles.includes(body.template_style as TemplateStyle)) {
    errors.push({ field: 'template_style', message: 'template_style must be modern, classic, or minimal' });
  }
  return errors;
}

export function validateCVUpdate(body: { template_style?: string }) {
  const errors: ValidationError[] = [];
  if (body.template_style && !templateStyles.includes(body.template_style as TemplateStyle)) {
    errors.push({ field: 'template_style', message: 'template_style must be modern, classic, or minimal' });
  }
  return errors;
}

export function validateCVOptimization(body: { section?: string; text?: string }) {
  const errors: ValidationError[] = [];
  if (!body.section || !optimizationSections.includes(body.section)) {
    errors.push({ field: 'section', message: 'section must be one of personal_info, education, experience, skills, projects' });
  }
  if (!body.text || body.text.trim().length === 0) {
    errors.push({ field: 'text', message: 'text is required for optimization' });
  }
  return errors;
}
