import { Router } from 'express';
import { availabilityRouter } from './availability.js';
import { waitlistRouter } from './waitlist.js';
import { checkoutSessionsRouter } from './checkoutSessions.js';
import { reservationsRouter } from './reservations.js';

export const apiRouter = Router();

apiRouter.use('/availability', availabilityRouter);
apiRouter.use('/waitlist', waitlistRouter);
apiRouter.use('/checkout-sessions', checkoutSessionsRouter);
apiRouter.use('/reservations', reservationsRouter);
