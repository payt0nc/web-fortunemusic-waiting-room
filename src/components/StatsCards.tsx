import { Card, CardHeader, CardTitle } from './ui/card';
import { Users, Clock } from 'lucide-react';
import type { Session } from '@/api/fortunemusic/events';
import { EventTimer } from './ui/timer-event';
import { TimerProgress } from './ui/timer-progress';

interface StatsCardsProps {
  session: Session;
  lastUpdate: Date;
  nextRefreshTime: Date;
  loading: boolean;
  onManualRefresh: () => void;
  totalWaitingPeople: number;
}

export function StatsCards({ session, lastUpdate, nextRefreshTime, loading, onManualRefresh, totalWaitingPeople }: StatsCardsProps) {

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
      {/* Event Timer */}
      {!loading && session && (
        <EventTimer
          startAt={session.startTime}
          endAt={session.endTime}
          variant="event"
        />
      )}

      {/* Total Waiting People */}
      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground flex flex-auto items-center justify-between">
            <div className="flex items-center justify-between gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Participants
            </div>
            <span className="text-2xl font-bold text-blue-500">
              {totalWaitingPeople.toLocaleString()}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>
      {/* Next Update Timer */}
      {!loading && session && (
        <TimerProgress
          targetTime={nextRefreshTime}
          startTime={lastUpdate}
          variant="refresh"
          onRefreshClick={onManualRefresh}
          eventStartTime={session.startTime}
          eventEndTime={session.endTime}
        />
      )}
    </div>
  );
}