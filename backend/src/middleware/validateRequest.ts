import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@/api/auth/auth.validation';

export const validateRequest =
  (validator: (body: any) => ValidationError[] | Promise<ValidationError[]>) =>
    async (req: Request, res: Response, next: NextFunction) => {

      try {
        const errors = await validator(req.body);
        if (errors.length > 0) {
          return res.status(400).json({
            success: false,
            data: null,
            error: 'Validation failed',
            details: errors
          });
        }
        return next();
      } catch (error){
        return res.status(500).json({
          success: false,
          data: null,
          error: 'Internal Server Error'
        });
      }
    };
    