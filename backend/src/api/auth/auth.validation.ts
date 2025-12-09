// import { error } from "node:console";

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

  // Full name validation
  if (!input.full_name || input.full_name.trim().length < 3) {
    errors.push({
      field: 'full_name',
      message: 'Full name must be at least 3 characters long',
    });
  } else if (!/^[a-zA-Z\s'-]+$/.test(input.full_name)) {
    errors.push({
      field: 'full_name',
      message: 'Full name can only contain letters, spaces, hyphens, and apostrophes',
    });
  }

  // Email validation with more comprehensive regex
  if (!input.email) {
    errors.push({
      field: 'email',
      message: 'Email is required',
    });
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email address format',
    });
  }

  // Password validation with strength requirements
  if (!input.password) {
    errors.push({
      field: 'password',
      message: 'Password is required',
    });
  } else {
    if (input.password.length < 8) {
      errors.push({
        field: 'password',
        message: 'Password must be at least 8 characters long',
      });
    }
    
    if (!/[A-Z]/.test(input.password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one uppercase letter',
      });
    }
    
    if (!/[a-z]/.test(input.password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one lowercase letter',
      });
    }
    
    if (!/[0-9]/.test(input.password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one number',
      });
    }
    
    if (!/[^A-Za-z0-9]/.test(input.password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one special character',
      });
    }
    
    // Check for common weak passwords
    const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
    if (commonPasswords.some(common => input.password.toLowerCase().includes(common))) {
      errors.push({
        field: 'password',
        message: 'Password cannot contain common password patterns',
      });
    }
  }

  return errors;
}

export function validateLoginInput(input: LoginInput): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!input.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input.email)) {
    errors.push({ field: 'email', message: 'Invalid email address format' });
  }
  
  if (!input.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (input.password.length < 1) {
    errors.push({ field: 'password', message: 'Password cannot be empty' });
  }
  
  return errors;
}