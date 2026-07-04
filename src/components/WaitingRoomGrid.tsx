import { useMemo } from 'react';
import { Card, CardTitle } from './ui/card';
import { Clock, Users, Inbox, TriangleAlert } from 'lucide-react';
import {
  getPeopleCountColors,
  getPeopleCountStatus,
  getWaitingTimeColors,
  getWaitingTimeStatus,
} from '@/lib/status-colors';
import { formatMS } from '@/utils/date';
import { type WaitingRoom } from '@/api/fortunemusic/waitingRooms';
import { type Member, type Session } from '@/api/fortunemusic/events';
import { historyKey, type HistoryPoint, computeSparklineViewEnd, roomStatesFromWaitingRooms } from '@/lib/history';
import { Sparkline } from './Sparkline';

interface WaitingRoomGridProps {
  currentSessionID: number,
  session: Session | null,
  waitingRooms: Map<number, WaitingRoom[]>,
  members: Map<string, Member>,
  history: Map<string, HistoryPoint[]>,
  historyAvailable: boolean,
}

interface room {
  id: string;
  order: number;
  name: string;
  waitingCount: number;
  waitingTime: number;
}

function joinMemberWaitingRoom(
  currentSessionID: number,
  waitingRooms: Map<number, WaitingRoom[]>,
  members: Map<string, Member>
): room[] {
  const rooms = waitingRooms.get(currentSessionID);
  if (!rooms) return [];

  const result: room[] = [];
  for (const room of rooms) {
    const member = members.get(room.ticketCode);
    if (member) {
      result.push({
        id: room.ticketCode,
        order: member.order,
        name: member.name,
        waitingCount: room.peopleCount,
        waitingTime: room.waitingTime,
      });
    }
  }
  return result;
}


export function WaitingRoomGrid({ currentSessionID, session, waitingRooms, members, history, historyAvailable }: WaitingRoomGridProps) {
  const rooms: room[] = useMemo(
    () => joinMemberWaitingRoom(currentSessionID, waitingRooms, members),
    [currentSessionID, waitingRooms, members],
  );

  const viewEndMs = useMemo(() => {
    if (!session) return Date.now();
    const waitingRoomList = waitingRooms.get(currentSessionID) ?? [];
    return computeSparklineViewEnd(
      session.endTime,
      roomStatesFromWaitingRooms(currentSessionID, waitingRoomList, history),
    );
  }, [session, currentSessionID, waitingRooms, history]);

  if (rooms.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-3 py-16 text-center text-text-muted">
        <Inbox className="h-10 w-10" aria-hidden="true" />
        <p className="text-sm">No waiting rooms for this session yet.</p>
      </div>
    );
  }

  return (
    <ul
      role="list"
      aria-label="Member waiting rooms"
      className="w-full grid gap-[5px] p-[5px] grid-cols-[repeat(auto-fill,minmax(190px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]"
    >
      {rooms.map((room) => {
        const peopleStatus = getPeopleCountStatus(room.waitingCount);
        const timeStatus = getWaitingTimeStatus(room.waitingTime);
        const peopleColor = getPeopleCountColors(room.waitingCount).text;
        const timeColor = getWaitingTimeColors(room.waitingTime).text;
        const samples = history.get(historyKey(currentSessionID, room.id)) ?? [];
        const showCurve = historyAvailable && samples.length > 0 && session;
        return (
          <li key={room.id} role="listitem" className="contents">
            <Card
              aria-label={`${room.name}: ${room.waitingCount} waiting, ${formatMS(room.waitingTime)} wait time`}
              className="transition-shadow grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 items-center p-2.5 lg:p-3"
            >
              <div className="flex items-center min-w-0">
                <CardTitle className="text-sm truncate text-text-muted" title={room.name} lang="ja">
                  {room.name}
                </CardTitle>
              </div>
              <div className={`flex items-center justify-end gap-1 ${peopleColor}`}>
                <Users className="h-4 w-4" aria-hidden="true" />
                <span className="text-xl lg:text-2xl leading-none font-bold tabular-nums">
                  {room.waitingCount}
                </span>
                {peopleStatus === 'high' && <TriangleAlert className="h-4 w-4" aria-hidden="true" />}
              </div>
              <div className={`h-8 min-w-0 ${peopleColor}`}>
                {showCurve && (
                  <Sparkline
                    points={samples}
                    sessionStart={session.startTime}
                    sessionEnd={session.endTime}
                    viewEndMs={viewEndMs}
                    currentCount={room.waitingCount}
                  />
                )}
              </div>
              <div className={`flex items-center justify-end gap-1 ${timeColor}`}>
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="text-sm lg:text-base font-semibold font-mono tabular-nums">
                  {formatMS(room.waitingTime)}
                </span>
                {timeStatus === 'high' && <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />}
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
