import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { createEventHandler, deleteEventHandler, listEventsHandler, updateEventHandler } from './calendar.controller';
import { validateCalendarCreation, validateCalendarUpdate } from './calendar.validation';
import { requireAuth } from '@/middleware/authenticate';
import { checkOwnership } from '@/middleware/ownership';

const router: Router = Router();
router.use(requireAuth);

router.get('/events', listEventsHandler);
router.post('/events', validateRequest(validateCalendarCreation), createEventHandler);

// User (Update/ Delete Calendar Events)
router.put('/events/:eventId', 
    checkOwnership('learningEvent', 'eventId', 'user_id', 'event_id'),
    validateRequest(validateCalendarUpdate), 
    updateEventHandler
);

router.delete('/events/:eventId', 
    checkOwnership('learningEvent', 'eventId', 'user_id', 'event_id'),
    deleteEventHandler
);

export default router;
