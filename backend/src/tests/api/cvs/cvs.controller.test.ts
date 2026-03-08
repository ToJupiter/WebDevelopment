// File: src/tests/api/cvs/cvs.controller.test.ts
import { listCVsHandler, createCVHandler, updateCVHandler, optimizeCVHandler } from '@/api/cvs/cvs.controller';
import { listUserCVs, createCV, updateCV, optimizeCVSection } from '@/api/cvs/cvs.services';
import { Request, Response } from 'express';
import { TemplateStyle } from '@/generated/prisma/client';
import { Role } from '@/generated/prisma/client';

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
      mockRequest = { user: undefined };

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
      mockRequest = { user: { user_id: mockUserId, role: Role.admin, email: "hihe@gmail.com" } };
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
      // mockRequest = { user: { user_id: mockUserId, role: } };
      mockRequest = { user: { user_id: mockUserId, role: Role.admin, email: "hihe@gmail.com" } };
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
      mockRequest = { user: undefined, body: validPayload };

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
        user: { user_id: mockUserId, role: Role.admin, email: "hihe@gmail.com" }, 
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
        user: { user_id: mockUserId, role: Role.admin, email: "hihe@gmail.com" },
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