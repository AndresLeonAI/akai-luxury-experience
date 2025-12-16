import { createApp } from './app.js';
import { env } from './lib/env.js';
import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';
import { startScheduler } from './jobs/scheduler.js';

const app = createApp();

const server = app.listen(env.PORT, env.HOST, () => {
  logger.info(
    { port: env.PORT, host: env.HOST, nodeEnv: env.NODE_ENV },
    'server_listening'
  );
});

const stopScheduler = startScheduler();

async function shutdown(signal: string) {
  logger.info({ signal }, 'shutdown_started');
  stopScheduler();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await prisma.$disconnect();
  logger.info({ signal }, 'shutdown_completed');
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
