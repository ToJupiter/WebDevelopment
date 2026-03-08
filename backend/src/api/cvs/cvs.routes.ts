import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { createCVHandler, listCVsHandler, optimizeCVHandler, updateCVHandler, generatePDFHandler, deleteCVHandler } from './cvs.controller';
import { validateCVCreation, validateCVOptimization, validateCVUpdate } from './cvs.validation';
import { requireAuth } from '@/middleware/authenticate';
import { checkOwnership } from '@/middleware/ownership';

const router: Router = Router();

router.use(requireAuth);

router.get('/', listCVsHandler);
router.post('/', validateRequest(validateCVCreation), createCVHandler);


router.put('/:cvId', 
    checkOwnership('cV', 'cvId'),
    validateRequest(validateCVUpdate), 
    updateCVHandler
);

router.post('/:cvId/optimize', 
    checkOwnership('cV', 'cvId'),
    validateRequest(validateCVOptimization), 
    optimizeCVHandler
);

router.post('/:cvId/generate-pdf',
    checkOwnership('cV', 'cvId'),
    generatePDFHandler
);


router.delete('/:cvId', checkOwnership('cV', 'cvId'), deleteCVHandler); 

export default router;
