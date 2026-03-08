// File: src/tests/api/auth/auth.validation.test.ts
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

  it('should validate password complexity requirements', () => {
    const input = {
      full_name: 'JohnDoe123',
      email: 'john@example.com',
      password: 'simplepassword'
    };
    const errors = validateRegisterInput(input);
    expect(errors).toContainEqual({
      field: 'password',
      message: 'Password must contain at least one uppercase letter'
    });
    expect(errors).toContainEqual({
      field: 'password',
      message: 'Password must contain at least one number'
    });
    expect(errors).toContainEqual({
      field: 'password',
      message: 'Password must contain at least one special character'
    });
  });

  it('should return multiple errors for invalid input', () => {
    const input = {
      full_name: 'Jo',
      email: 'invalid-email',
      password: 'simple'
    };
    const errors = validateRegisterInput(input);
    // Updated to expect at least 5 errors due to enhanced password validation
    expect(errors.length).toBeGreaterThanOrEqual(5);
    expect(errors.map(e => e.field)).toContain('email');
    expect(errors.map(e => e.field)).toContain('full_name');
    expect(errors.map(e => e.field)).toContain('password');
  });

  it('should handle missing fields gracefully', () => {
    const input = {} as any;
    const errors = validateRegisterInput(input);
    expect(errors.length).toBeGreaterThan(0);
  });
});