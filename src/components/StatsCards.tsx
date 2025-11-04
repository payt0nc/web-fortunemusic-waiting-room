import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Clock } from 'lucide-react';
import type { Session } from '@/api/fortunemusic/events';
import { EventTimer } from './ui/timer-event';
import { Timer } from './ui/timer';
import { formatDateTime } from '@/utils/date';

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
        <CardHeader className="pb-3">
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Total Waiting People
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-500">
            {totalWaitingPeople.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      {/* Next Update Timer */}
      {!loading && (
        <Timer
          targetTime={nextRefreshTime}
          label="Next Update"
          icon="refresh"
          variant="refresh"
          onRefreshClick={onManualRefresh}
        />
      )}
    </div>
  );
}