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