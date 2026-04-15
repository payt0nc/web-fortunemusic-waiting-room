import { Card, CardTitle } from './ui/card';
import { Clock, Users } from 'lucide-react';
import { getPeopleCountColors, getWaitingTimeColors } from '@/lib/status-colors';
import { formatMS } from '@/utils/date';
import { type WaitingRoom } from '@/api/fortunemusic/waitingRooms';
import { type Member } from '@/api/fortunemusic/events';

interface WaitingRoomGridProps {
  currentSessionID: number,
  waitingRooms: Map<number, WaitingRoom[]>,
  members: Map<string, Member>
}

interface room {
  id: string;
  order: number;
  name: string;
  thumbnailUrl: string;
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
        thumbnailUrl: member.thumbnailUrl,
        waitingCount: room.peopleCount,
        waitingTime: room.waitingTime,
      });
    }
  }
  return result;
}


export function WaitingRoomGrid({ currentSessionID, waitingRooms, members }: WaitingRoomGridProps) {
  const rooms: room[] = joinMemberWaitingRoom(currentSessionID, waitingRooms, members);

  return (
    <div className="w-full grid gap-[5px] p-[5px] grid-cols-[repeat(auto-fill,minmax(140px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
      {rooms.map((room) => (
        <Card
          key={room.id}
          className="aspect-square hover:shadow-md transition-all flex flex-col items-center justify-between p-2 lg:p-3"
        >
          <CardTitle className="text-sm truncate text-center w-full text-text-muted">{room.name}</CardTitle>
          <div className={`flex items-center justify-center gap-1 ${getPeopleCountColors(room.waitingCount).text}`}>
            <Users className="h-5 w-5" />
            <span className="text-2xl lg:text-3xl font-bold">
              {room.waitingCount}
            </span>
          </div>
          <div className={`flex items-center justify-center gap-1 ${getWaitingTimeColors(room.waitingTime).text}`}>
            <Clock className="h-4 w-4" />
            <span className="text-base lg:text-lg font-semibold font-mono">
              {formatMS(room.waitingTime)}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
