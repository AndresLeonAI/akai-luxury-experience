import { env } from './env.js';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseIsoDateParts(value: string): { year: number; month: number; day: number } {
  if (!ISO_DATE_RE.test(value)) throw new Error('Invalid ISO date format.');

  const parts = value.split('-');
  const yearRaw = parts[0];
  const monthRaw = parts[1];
  const dayRaw = parts[2];
  if (!yearRaw || !monthRaw || !dayRaw) throw new Error('Invalid ISO date format.');

  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error('Invalid ISO date value.');
  }

  return { year, month, day };
}

export function assertIsoDate(value: string): void {
  void parseIsoDateParts(value);
}

export function isIsoDateBefore(a: string, b: string): boolean {
  // Works for YYYY-MM-DD.
  return a < b;
}

export function getTodayIsoDateInTimezone(now = new Date()): string {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone: env.TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = dtf.formatToParts(now);
  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;
  if (!year || !month || !day) {
    throw new Error('Failed to format date in timezone.');
  }
  return `${year}-${month}-${day}`;
}

export function getWeekdayFromIsoDate(isoDate: string): number {
  const { year, month, day } = parseIsoDateParts(isoDate);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function listIsoDatesInclusive(from: string, to: string): string[] {
  const fromParts = parseIsoDateParts(from);
  const toParts = parseIsoDateParts(to);
  if (to < from) return [];

  const cursor = new Date(Date.UTC(fromParts.year, fromParts.month - 1, fromParts.day));
  const end = new Date(Date.UTC(toParts.year, toParts.month - 1, toParts.day));

  const result: string[] = [];
  while (cursor.getTime() <= end.getTime()) {
    const y = cursor.getUTCFullYear();
    const m = String(cursor.getUTCMonth() + 1).padStart(2, '0');
    const d = String(cursor.getUTCDate()).padStart(2, '0');
    result.push(`${y}-${m}-${d}`);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return result;
}
