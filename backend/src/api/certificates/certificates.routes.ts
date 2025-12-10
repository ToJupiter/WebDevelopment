import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { issueCertificateHandler, listCertificatesHandler } from './certificates.controller';
import { validateCertificatePayload } from './certificates.validation';
import { requireAuth, requireRole } from '@/middleware/authenticate';
import { Role } from '@/generated/prisma/client';

const router: Router = Router();

router.use(requireAuth);

router.get('/', listCertificatesHandler);

// Admin: Certificates (Create manually)
router.post('/', requireRole([Role.admin]),validateRequest(validateCertificatePayload), issueCertificateHandler);

export default router;
