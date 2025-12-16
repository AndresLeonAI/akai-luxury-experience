import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((value) =>
      value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    ),
  TIMEZONE: z.string().default('UTC'),
  DATABASE_URL: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:3000'),
  HOLD_TTL_MINUTES: z.coerce.number().int().min(5).max(60).default(15),
  CAPACITY_TOTAL: z.coerce.number().int().min(0).default(8),
  MIN_GUESTS: z.coerce.number().int().min(1).default(1),
  MAX_GUESTS: z.coerce.number().int().min(1).default(8),
  CURRENCY: z.string().default('usd'),
  PRICE_PER_PERSON_AMOUNT: z.coerce.number().int().min(0).default(18000),
  DEPOSIT_BPS: z.coerce.number().int().min(0).max(10000).default(5000),
  SERVICE_TIMES: z
    .string()
    .default('18:30,19:00,20:00,21:30')
    .transform((value) =>
      value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    ),
  CLOSED_WEEKDAYS: z
    .string()
    .default('0')
    .transform((value) =>
      value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => Number(v))
        .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6)
    ),
  LIMITED_THRESHOLD: z.coerce.number().int().min(0).default(2),
  AVAILABILITY_RANGE_MAX_DAYS: z.coerce.number().int().min(1).max(366).default(93),
  HOLD_EXPIRY_SWEEP_INTERVAL_SECONDS: z.coerce.number().int().min(5).max(300).default(30),
});

export const env = envSchema.parse(process.env);
