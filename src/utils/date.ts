import { format } from 'date-fns';

/**
 * Date formatting utilities for consistent date display across the application.
 * All dates are formatted in YYYY-MM-DD format for consistency.
 * Uses date-fns for robust date handling.
 */

/**
 * Format a Date object to YYYY-MM-DD string
 * @param date - The date to format
 * @returns Formatted date string in YYYY-MM-DD format
 * @example
 * formatDate(new Date('2024-11-04')) // '2024-11-04'
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

/** Format total seconds as "HH:MM:SS" */
export function formatHMS(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
}

/** Format total seconds as "MM:SS" */
export function formatMS(totalSeconds: number): string {
  const minutes = Math.floor(Math.floor(totalSeconds) / 60);
  const seconds = Math.floor(totalSeconds) % 60;
  return `${pad2(minutes)}:${pad2(seconds)}`;
}

