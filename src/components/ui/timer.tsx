import { useEffect, useState } from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { differenceInSeconds, isAfter } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { getTimerColors } from '@/lib/timer-colors';

interface TimerProps {
  targetTime: Date | string;
  label: string;
  icon?: 'clock' | 'refresh';
  variant?: 'event' | 'refresh';
  onRefreshClick?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function Timer({ targetTime, label, icon = 'clock', variant = 'refresh', onRefreshClick }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const target = new Date(targetTime);

      // Check if target time has passed
      if (!isAfter(target, now)) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      // Calculate total seconds difference
      const totalSeconds = differenceInSeconds(target, now);

      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const formatTime = (time: TimeRemaining) => {
    if (time.isExpired) {
      return 'Expired';
    }

    const parts = [];
    if (time.days > 0) parts.push(`${time.days}d`);
    if (time.hours > 0) parts.push(`${time.hours}h`);
    if (time.minutes > 0) parts.push(`${time.minutes}m`);
    parts.push(`${time.seconds}s`);

    return parts.join(' ');
  };

  const colors = getTimerColors(variant);
  const IconComponent = icon === 'clock' ? Clock : RefreshCw;

  const handleIconClick = () => {
    if (onRefreshClick && icon === 'refresh') {
      onRefreshClick();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <IconComponent
            className={`h-5 w-5 ${colors.icon} ${onRefreshClick && icon === 'refresh' ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={handleIconClick}
          />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${timeRemaining.isExpired ? 'text-red-400' : colors.time}`}>
          {formatTime(timeRemaining)}
        </div>
      </CardContent>
    </Card>
  );
}