import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Clock } from 'lucide-react';
import type { Session } from '@/api/fortunemusic/events';
import { EventTimer } from './ui/timer-event';
import { Timer } from './ui/timer';

interface StatsCardsProps {
  session: Session;
  lastUpdate: Date;
  nextRefreshTime: Date;
  loading: boolean;
  onManualRefresh: () => void;
}

export function StatsCards({ session, lastUpdate, nextRefreshTime, loading, onManualRefresh }: StatsCardsProps) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Event Timer */}
      {!loading && session && (
        <EventTimer
          startAt={session.startTime}
          endAt={session.endTime}
          variant="event"
        />
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-500" />
            Last Update
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">
            {lastUpdate.toLocaleString('ja-JP', { hour12: false })}
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