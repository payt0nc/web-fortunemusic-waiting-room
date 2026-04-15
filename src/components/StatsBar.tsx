import { useCountdown, type CountdownPhase } from '@/hooks/useCountdown';
import type { Session } from '@/api/fortunemusic/events';
import { UsersRound, TimerReset, Hourglass } from 'lucide-react';

interface StatsBarProps {
  session: Session | null;
  participant: number;
  refreshCountdown: number;
}

function getTimerColors(phase: CountdownPhase, remainingSeconds: number): { bg: string; text: string } {
  if (phase === 'before') {
    return { bg: 'bg-badge-green', text: 'text-status-green' };
  }

  if (phase === 'ended') {
    return { bg: 'bg-status-red/15', text: 'text-status-red' };
  }

  const minutes = remainingSeconds / 60;
  if (minutes > 30) {
    return { bg: 'bg-badge-green', text: 'text-status-green' };
  } else if (minutes > 10) {
    return { bg: 'bg-status-yellow/15', text: 'text-status-yellow' };
  } else {
    return { bg: 'bg-status-red/15', text: 'text-status-red' };
  }
}

export function StatsBar({ session, participant, refreshCountdown }: StatsBarProps) {
  const countdown = useCountdown(session?.startTime, session?.endTime);
  const timerColors = getTimerColors(countdown.phase, countdown.remainingSeconds);

  return (
    <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-badge-dark">
      {/* Timer badge */}
      <div className={`relative flex items-center justify-center gap-1 rounded-full px-2.5 py-0.5 min-w-[180px] whitespace-nowrap tabular-nums overflow-hidden ${timerColors.text} text-sm font-semibold`}>
        {countdown.phase === 'during' && (
          <div
            className={`absolute inset-0 ${timerColors.bg} transition-[width] duration-1000 ease-linear`}
            style={{ width: `${countdown.progress * 100}%` }}
          />
        )}
        <Hourglass className="relative h-4 w-4" />
        <span className="relative">{countdown.timeText}</span>
      </div>

      {/* Refresh badge */}
      <div className="flex items-center justify-center gap-1 rounded-full px-2.5 py-0.5 min-w-[130px] whitespace-nowrap tabular-nums text-status-yellow text-sm font-semibold">
        <TimerReset className="h-4 w-4" />
        <span>{String(refreshCountdown).padStart(2, '0')}s</span>
      </div>

      {/* Participant badge */}
      <div className="flex items-center justify-center gap-1 rounded-full px-2.5 py-0.5 min-w-[100px] whitespace-nowrap tabular-nums text-status-blue text-sm font-semibold">
        <UsersRound className="h-4 w-4" />
        <span>{participant.toLocaleString()}</span>
      </div>
    </div>
  );
}
