import { useState, useEffect } from 'react';
import { differenceInSeconds, isBefore } from 'date-fns';
import { formatHMS } from '@/utils/date';

export type CountdownPhase = 'before' | 'during' | 'ended';

interface CountdownState {
  label: string;
  timeText: string;
  phase: CountdownPhase;
  remainingSeconds: number;
  progress: number;
}

export function useCountdown(startAt: Date | undefined, endAt: Date | undefined): CountdownState {
  const [state, setState] = useState<CountdownState>({
    label: 'Event Timer',
    timeText: '--:--:--',
    phase: 'before',
    remainingSeconds: 0,
    progress: 0,
  });

  useEffect(() => {
    if (!startAt || !endAt) return;

    const totalDuration = differenceInSeconds(endAt, startAt);

    let interval: ReturnType<typeof setInterval> | null = null;

    const calculate = () => {
      const current = new Date();

      if (isBefore(current, startAt)) {
        const totalSeconds = differenceInSeconds(startAt, current);
        setState({
          label: 'Start',
          timeText: formatHMS(totalSeconds),
          phase: 'before',
          remainingSeconds: totalSeconds,
          progress: 0,
        });
      } else if (isBefore(current, endAt)) {
        const totalSeconds = differenceInSeconds(endAt, current);
        setState({
          label: 'End',
          timeText: formatHMS(totalSeconds),
          phase: 'during',
          remainingSeconds: totalSeconds,
          progress: totalDuration > 0 ? totalSeconds / totalDuration : 0,
        });
      } else {
        setState({
          label: 'Ended',
          timeText: '00:00:00',
          phase: 'ended',
          remainingSeconds: 0,
          progress: 0,
        });
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };

    calculate();
    interval = setInterval(calculate, 1000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startAt, endAt]);

  return state;
}

