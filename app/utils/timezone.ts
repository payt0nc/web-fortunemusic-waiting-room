import { parseISO } from 'date-fns';

/**
 * Utility functions for handling Japanese timezone conversion
 * All data from the API is in Japanese Standard Time (JST, UTC+9)
 * Uses date-fns for robust timezone handling.
 */

/**
 * Converts a JST datetime string to a proper Date object
 * @param jstDateString - Date string in JST (e.g., "2023-12-25", "14:30")
 * @param jstTimeString - Time string in JST (optional, if date and time are separate)
 * @returns Date object in the user's local timezone
 */
export function convertJSTToLocal(jstDateString: string, jstTimeString?: string): Date {
  // If time string is provided separately, combine them
  const dateTimeString = jstTimeString
    ? `${jstDateString} ${jstTimeString}`
    : jstDateString;

  // Create the date in JST (UTC+9)
  // We explicitly specify the timezone to avoid local interpretation
  const jstDate = parseISO(`${dateTimeString}+09:00`);

  return jstDate;
}

