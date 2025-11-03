export interface TimerColors {
  icon: string;
  time: string;
}

export type TimerVariant = 'event' | 'refresh';

export function getTimerColors(variant: TimerVariant): TimerColors {
  switch (variant) {
    case 'event':
      return {
        icon: 'text-red-500',
        time: 'text-red-500',
      };
    case 'refresh':
      return {
        icon: 'text-orange-500',
        time: 'text-orange-500',
      };
    default:
      return {
        icon: 'text-gray-500',
        time: 'text-gray-500',
      };
  }
}