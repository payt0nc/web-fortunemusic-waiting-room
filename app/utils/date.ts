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

