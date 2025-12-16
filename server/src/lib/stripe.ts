import Stripe from 'stripe';
import { env } from './env.js';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // Keep Stripe API version pinned via dashboard or explicit value if needed.
  typescript: true,
});

