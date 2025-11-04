import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { differenceInSeconds, isBefore } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { getTimerColors } from '@/lib/timer-colors';

interface EventTimerProps {
  startAt: Date;
  endAt: Date;
  variant?: 'event' | 'refresh';
}

interface EventTimerState {
  label: string;
  timeText: string;
  isActive: boolean;
}

export function EventTimer({ startAt, endAt, variant = 'event' }: EventTimerProps) {
  const [timerState, setTimerState] = useState<EventTimerState>({
    label: 'Event Timer',
    timeText: '--:--:--',
    isActive: false,
  });

  useEffect(() => {
    const calculateTimer = () => {
      const current = new Date();

      let targetTime: Date;
      let label: string;

      if (isBefore(current, startAt)) {
        // Before start time
        targetTime = startAt;
        label = 'Time to Start';
      } else if (!isBefore(current, startAt) && isBefore(current, endAt)) {
        // Between start and end time
        targetTime = endAt;
        label = 'Time to End';
      } else {
        // After end time
        setTimerState({
          label: 'Event Ended',
          timeText: '00:00:00',
          isActive: false,
        });
        return;
      }

      // Calculate total seconds difference
      const totalSeconds = differenceInSeconds(targetTime, current);

      if (totalSeconds <= 0) {
        setTimerState({
          label: 'Event Ended',
          timeText: '00:00:00',
          isActive: false,
        });
        return;
      }

      // Calculate hours, minutes and seconds
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // Format as HH:MM:SS
      const timeText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      setTimerState({
        label,
        timeText,
        isActive: true,
      });
    };

    calculateTimer();
    const interval = setInterval(calculateTimer, 1000);

    return () => clearInterval(interval);
  }, [startAt, endAt]);

  const colors = getTimerColors(variant);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Clock className={`h-5 w-5 ${colors.icon}`} />
          {timerState.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${!timerState.isActive ? 'text-red-400' : colors.time}`}>
          {timerState.timeText}
        </div>
      </CardContent>
    </Card>
  );
}