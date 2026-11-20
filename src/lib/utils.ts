import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateIndo(dateStr?: string | null): string {
  if (!dateStr) return '-';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(date, 'd MMMM yyyy, HH:mm', { locale: id });
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr?: string | null): string {
  if (!dateStr) return '-';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(date, 'd MMM, HH:mm', { locale: id });
  } catch {
    return dateStr;
  }
}

export function formatTimeAgo(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return formatDistanceToNow(date, { addSuffix: true, locale: id });
  } catch {
    return '';
  }
}

/**
 * Menghitung perkiraan kata dan durasi bicara normal dalam detik.
 * Rata-rata orang Indonesia berbicara sekitar 130 kata per menit (~2.16 kata per detik).
 */
export function calculateScriptStats(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return { wordCount: 0, charCount: 0, readingSeconds: 0 };
  }
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = trimmed.length;
  // ~130 WPM
  const readingSeconds = Math.round((wordCount / 130) * 60);

  return {
    wordCount,
    charCount,
    readingSeconds,
  };
}

export function formatSecondsToTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} dtk`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}d`;
}

