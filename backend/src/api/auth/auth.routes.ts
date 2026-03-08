import { Router } from 'express';
import { registerUserHandler, loginUserHandler, logoutUserHandler } from './auth.controller';
import { validateRequest } from '@/middleware/validateRequest';
import { validateRegisterInput, validateLoginInput } from './auth.validation';

const router: Router = Router();

router.post('/register', validateRequest(validateRegisterInput), registerUserHandler);
router.post('/login', validateRequest(validateLoginInput), loginUserHandler);
router.post('/logout', logoutUserHandler);

export default router;