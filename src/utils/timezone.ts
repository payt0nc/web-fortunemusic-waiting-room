/**
 * Utility functions for handling Japanese timezone conversion
 * All data from the API is in Japanese Standard Time (JST, UTC+9)
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
  const jstDate = new Date(`${dateTimeString}+09:00`);

  return jstDate;
}

/**
 * Converts a JST timestamp string to local time
 * @param jstTimestamp - ISO string or timestamp from JST
 * @returns Date object in local timezone
 */
export function convertJSTTimestampToLocal(jstTimestamp: string): Date {
  // If the timestamp doesn't have timezone info, assume it's JST
  if (!jstTimestamp.includes('+') && !jstTimestamp.includes('Z')) {
    return new Date(`${jstTimestamp}+09:00`);
  }

  return new Date(jstTimestamp);
}

/**
 * Formats a JST date/time for display in the user's local timezone
 * @param jstDateString - Date string in JST
 * @param jstTimeString - Time string in JST (optional)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted string in user's local timezone
 */
export function formatJSTToLocal(
  jstDateString: string,
  jstTimeString?: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const localDate = convertJSTToLocal(jstDateString, jstTimeString);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    ...options
  };

  return localDate.toLocaleTimeString('en-US', defaultOptions);
}