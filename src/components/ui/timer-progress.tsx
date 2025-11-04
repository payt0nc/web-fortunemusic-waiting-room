import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { differenceInSeconds, isAfter, isBefore, subMinutes } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { getTimerColors } from '@/lib/timer-colors';

interface TimerProgressProps {
  targetTime: Date;
  startTime: Date;
  onRefreshClick?: () => void;
  variant?: 'event' | 'refresh';
  eventStartTime?: Date;
  eventEndTime?: Date;
}

interface ProgressState {
  remainingSeconds: number;
  progressPercentage: number;
  isExpired: boolean;
  showProgressBar: boolean;
}

export function TimerProgress({
  targetTime,
  startTime,
  onRefreshClick,
  variant = 'refresh',
  eventStartTime,
  eventEndTime
}: TimerProgressProps) {
  const [progressState, setProgressState] = useState<ProgressState>({
    remainingSeconds: 0,
    progressPercentage: 0,
    isExpired: false,
    showProgressBar: false,
  });

  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const target = targetTime;
      const start = startTime;

      // Determine if progress bar should be shown based on event times
      let shouldShowProgressBar = false;
      if (eventStartTime && eventEndTime) {
        const preEventStart = subMinutes(eventStartTime, 15);
        // Show progress bar if we're within 15 mins before event start OR during the event
        shouldShowProgressBar = !isBefore(now, preEventStart) && isBefore(now, eventEndTime);
      } else {
        // If no event times provided, always show
        shouldShowProgressBar = true;
      }

      // Check if target time has passed
      if (!isAfter(target, now)) {
        setProgressState({
          remainingSeconds: 0,
          progressPercentage: 100,
          isExpired: true,
          showProgressBar: shouldShowProgressBar,
        });
        return;
      }

      // Calculate progress (remaining time as percentage)
      const totalDuration = differenceInSeconds(target, start);
      const remaining = differenceInSeconds(target, now);

      // Calculate percentage (100 at start, 0 at end - countdown style)
      const percentage = Math.min(Math.max((remaining / totalDuration) * 100, 0), 100);

      setProgressState({
        remainingSeconds: Math.max(remaining, 0),
        progressPercentage: percentage,
        isExpired: false,
        showProgressBar: shouldShowProgressBar,
      });
    };

    calculateProgress();
    // Update every 100ms for smooth animation
    const interval = setInterval(calculateProgress, 100);

    return () => clearInterval(interval);
  }, [targetTime, startTime, eventStartTime, eventEndTime]);

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '0s';

    if (seconds < 60) {
      return `${seconds}s`;
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

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
        <CardTitle className="text-card-foreground flex items-center justify-between">
          <div className="flex items-center justify-between gap-2">
            <RefreshCw
              className={`h-5 w-5 ${colors.icon} ${onRefreshClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
              onClick={onRefreshClick}
            />
            Next Update
          </div>
          <span className={`text-2xl font-bold ${progressState.isExpired ? 'text-red-400' : getTextColor(progressState.progressPercentage)}`}>
            {formatTime(progressState.remainingSeconds)}
          </span>
        </CardTitle>
      </CardHeader>
      {progressState.showProgressBar && (
        <CardContent className="pt-0 pb-6 w-full">
          <div className="w-full">
            {/* Progress bar container */}
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-700/50">
              {/* Progress bar fill */}
              <div
                className={`h-full transition-all duration-100 ease-linear ${getProgressColor(progressState.progressPercentage)}`}
                style={{ width: `${progressState.progressPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
