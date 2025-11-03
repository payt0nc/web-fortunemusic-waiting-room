/**
 * Unified color utility functions for status-based coloring
 * Supports both people count and waiting time thresholds
 */

export interface StatusColors {
  text: string;
  background?: string;
}

export type StatusLevel = 'low' | 'medium' | 'high';

/**
 * Generic function to get colors based on thresholds
 */
function getThresholdColors(value: number, lowThreshold: number, highThreshold: number): StatusColors {
  if (value < lowThreshold) {
    return { text: 'text-emerald-400' };
  } else if (value >= lowThreshold && value < highThreshold) {
    return { text: 'text-yellow-400' };
  } else {
    return { text: 'text-red-400' };
  }
}

/**
 * Generic function to get status level based on thresholds
 */
function getThresholdStatus(value: number, lowThreshold: number, highThreshold: number): StatusLevel {
  if (value < lowThreshold) {
    return 'low';
  } else if (value >= lowThreshold && value < highThreshold) {
    return 'medium';
  } else {
    return 'high';
  }
}

/**
 * Gets the appropriate color classes for people count display
 * Rules: <10 people = green, 10-29 people = yellow, 30+ people = red
 */
export function getPeopleCountColors(peopleCount: number): StatusColors {
  return getThresholdColors(peopleCount, 10, 30);
}

/**
 * Gets a status indicator for people count
 */
export function getPeopleCountStatus(peopleCount: number): StatusLevel {
  return getThresholdStatus(peopleCount, 10, 30);
}

/**
 * Gets the appropriate color classes for waiting time display
 * Rules: <10 minutes = green, 10-30 minutes = yellow, 30+ minutes = red
 */
export function getWaitingTimeColors(waitingDuration: number): StatusColors {
  return getThresholdColors(waitingDuration, 600, 1800); // 600s = 10min, 1800s = 30min
}

/**
 * Gets a status indicator for waiting time
 */
export function getWaitingTimeStatus(waitingDuration: number): StatusLevel {
  return getThresholdStatus(waitingDuration, 600, 1800);
}