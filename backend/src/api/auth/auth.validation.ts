import { error } from "node:console";

export interface RegisterInput {
  full_name: string;
  email: string;
  password: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export function validateRegisterInput(input: RegisterInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.full_name || input.full_name.trim().length < 3) {
    errors.push({
      field: 'full_name',
      message: 'Full name must be at least 3 characters long',
    });
  }

  if (!input.email || !/^\S+@\S+\.\S+$/.test(input.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email address',
    });
  }

  if (!input.password || input.password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters long',
    });
  }

  return errors;
}

export function validateLoginInput(input: LoginInput): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!input.email) errors.push({ field: 'email', message: 'Email is required' });
  if (!input.password) errors.push({ field: 'password', message: 'Password is required' });
  return errors;
}