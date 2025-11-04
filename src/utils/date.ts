/**
 * Date formatting utilities for consistent date display across the application.
 * All dates are formatted in YYYY-MM-DD format for consistency.
 */

/**
 * Format a Date object to YYYY-MM-DD string
 * @param date - The date to format
 * @returns Formatted date string in YYYY-MM-DD format
 * @example
 * formatDate(new Date('2024-11-04')) // '2024-11-04'
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Format a Date object to YYYY-MM-DD HH:mm:ss string
 * @param date - The date to format
 * @returns Formatted datetime string in YYYY-MM-DD HH:mm:ss format
 * @example
 * formatDateTime(new Date('2024-11-04T15:30:00')) // '2024-11-04 15:30:00'
 */
export function formatDateTime(date: Date): string {
  const datePart = formatDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${datePart} ${hours}:${minutes}:${seconds}`;
}

/**
 * Format a Date object to YYYY-MM-DD HH:mm string (without seconds)
 * @param date - The date to format
 * @returns Formatted datetime string in YYYY-MM-DD HH:mm format
 * @example
 * formatDateTimeShort(new Date('2024-11-04T15:30:00')) // '2024-11-04 15:30'
 */
export function formatDateTimeShort(date: Date): string {
  const datePart = formatDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${datePart} ${hours}:${minutes}`;
}
