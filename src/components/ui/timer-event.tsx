import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { differenceInSeconds, isBefore, subMinutes } from 'date-fns';
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
  remainingSeconds: number;
  progressPercentage: number;
  startTime: Date;
  showProgressBar: boolean;
}

export function EventTimer({ startAt, endAt, variant = 'event' }: EventTimerProps) {
  const [timerState, setTimerState] = useState<EventTimerState>({
    label: 'Event Timer',
    timeText: '--:--:--',
    isActive: false,
    remainingSeconds: 0,
    progressPercentage: 0,
    startTime: new Date(),
    showProgressBar: false,
  });

  useEffect(() => {
    const calculateTimer = () => {
      const current = new Date();
      // Define pre-event window (15 minutes before start)
      const preEventStart = subMinutes(startAt, 15);

      let targetTime: Date;
      let label: string;
      let startTime: Date;

      if (isBefore(current, preEventStart)) {
        // Before pre-event window - show timer but hide progress bar
        const totalSeconds = differenceInSeconds(startAt, current);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const timeText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        setTimerState({
          label: 'Time to Start',
          timeText,
          isActive: true,
          remainingSeconds: totalSeconds,
          progressPercentage: 0,
          startTime: preEventStart,
          showProgressBar: false,
        });
        return;
      } else if (isBefore(current, startAt)) {
        // Within pre-event window (15 mins before start to start time)
        targetTime = startAt;
        // Use pre-event window as start time (15 mins before event)
        startTime = preEventStart;
        label = 'Time to Start';
      } else if (!isBefore(current, startAt) && isBefore(current, endAt)) {
        // Between start and end time
        targetTime = endAt;
        startTime = startAt; // Progress from start to end
        label = 'Time to End';
      } else {
        // After end time
        setTimerState({
          label: 'Event Ended',
          timeText: '00:00:00',
          isActive: false,
          remainingSeconds: 0,
          progressPercentage: 0,
          startTime: endAt,
          showProgressBar: false,
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
          remainingSeconds: 0,
          progressPercentage: 0,
          startTime: endAt,
          showProgressBar: false,
        });
        return;
      }

      // Calculate progress percentage (countdown style - 100% to 0%)
      const totalDuration = differenceInSeconds(targetTime, startTime);
      const progressPercentage = Math.min(Math.max((totalSeconds / totalDuration) * 100, 0), 100);

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
        remainingSeconds: totalSeconds,
        progressPercentage,
        startTime,
        showProgressBar: true,
      });
    };

    calculateTimer();
    const interval = setInterval(calculateTimer, 100);

    return () => clearInterval(interval);
  }, [startAt, endAt]);

  // Determine color based on progress percentage (100% = full, 0% = empty)
  const getProgressColor = (percentage: number): string => {
    if (percentage > 50) {
      return 'bg-green-500';
    } else if (percentage > 20) {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  };

  const getTextColor = (percentage: number): string => {
    if (percentage > 50) {
      return 'text-green-500';
    } else if (percentage > 20) {
      return 'text-yellow-500';
    } else {
      return 'text-red-500';
    }
  };

  const colors = getTimerColors(variant);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-card-foreground flex flex-auto items-center justify-between">
          <div className="flex items-center justify-between gap-2">
            <Clock className={`h-5 w-5 ${colors.icon}`} />
            {timerState.label}
          </div>
          <span className={`text-2xl font-bold ${!timerState.isActive ? 'text-red-400' : getTextColor(timerState.progressPercentage)}`}>
            {timerState.timeText}
          </span>
        </CardTitle>
      </CardHeader>
      {timerState.showProgressBar && (
        <CardContent className="pt-0 pb-6 w-full">
          <div className="w-full">
            {/* Progress bar container */}
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-700/50">
              {/* Progress bar fill */}
              <div
                className={`h-full transition-all duration-100 ease-linear ${getProgressColor(timerState.progressPercentage)}`}
                style={{ width: `${timerState.progressPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}