export interface StatusColors {
  text: string;
}

export type StatusLevel = 'low' | 'medium' | 'high';

function getThresholdColors(value: number, lowThreshold: number, highThreshold: number): StatusColors {
  if (value < lowThreshold) {
    return { text: 'text-status-green' };
  } else if (value < highThreshold) {
    return { text: 'text-status-yellow' };
  } else {
    return { text: 'text-status-red' };
  }
}

function getThresholdStatus(value: number, lowThreshold: number, highThreshold: number): StatusLevel {
  if (value < lowThreshold) {
    return 'low';
  } else if (value < highThreshold) {
    return 'medium';
  } else {
    return 'high';
  }
}

/** <10 people = green, 10-29 = yellow, 30+ = red */
export function getPeopleCountColors(peopleCount: number): StatusColors {
  return getThresholdColors(peopleCount, 10, 30);
}

export function getPeopleCountStatus(peopleCount: number): StatusLevel {
  return getThresholdStatus(peopleCount, 10, 30);
}

/** <10 min = green, 10-30 min = yellow, 30+ min = red */
export function getWaitingTimeColors(waitingDuration: number): StatusColors {
  return getThresholdColors(waitingDuration, 600, 1800);
}

export function getWaitingTimeStatus(waitingDuration: number): StatusLevel {
  return getThresholdStatus(waitingDuration, 600, 1800);
}
