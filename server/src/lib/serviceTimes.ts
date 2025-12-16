import { env } from './env.js';

export type ServiceTime = { time: string; label: string };

const DEFAULT_LABELS: Record<string, string> = {
  '18:30': 'Early Evening',
  '19:00': 'Sunset',
  '20:00': 'Prime Time',
  '21:30': 'Late Night',
};

export function getServiceTimes(): ServiceTime[] {
  return env.SERVICE_TIMES.map((time) => ({
    time,
    label: DEFAULT_LABELS[time] ?? time,
  }));
}

