import { randomInt } from 'crypto';

export function generateReferenceCode(): string {
  const digits = String(randomInt(1000, 10000));
  return `JP-${digits}`;
}

