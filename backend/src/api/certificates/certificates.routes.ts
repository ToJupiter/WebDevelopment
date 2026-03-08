import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { issueCertificateHandler, listCertificatesHandler, downloadCertificatePdfHandler } from './certificates.controller';
import { validateCertificatePayload } from './certificates.validation';
import { requireAuth, requireRole } from '@/middleware/authenticate';
import { Role } from '@/generated/prisma/client';
import { checkOwnership } from '@/middleware/ownership';

const router: Router = Router();

router.use(requireAuth);

router.get('/', listCertificatesHandler);
router.get('/:certificateId/download', checkOwnership('certificate', 'certificateId', 'user_id', 'certificate_id'), downloadCertificatePdfHandler);

// Admin: Certificates (Create manually)
router.post('/', requireRole([Role.admin]),validateRequest(validateCertificatePayload), issueCertificateHandler);

export default router;
