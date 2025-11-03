import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Clock } from 'lucide-react';
import { getPeopleCountColors, getWaitingTimeColors } from '@/lib/status-colors';
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
  let result: room[] = [];
  for (let [sessionID, rooms] of waitingRooms) {
    if (currentSessionID === sessionID) {
      for (let room of rooms) {
        let roomId = room.ticketCode;
        if (members.has(roomId)) {
          let member = members.get(roomId)!;
          result.push({
            id: roomId,
            order: member.order,
            name: member.name,
            thumbnailUrl: member.thumbnailUrl,
            waitingCount: room.peopleCount,
            waitingTime: room.waitingTime,
          });
        }
      }
    }
  }
  return result;
}


export function WaitingRoomGrid({ currentSessionID, waitingRooms, members }: WaitingRoomGridProps) {
  console.log("WaitingRoomGrid Props:", { currentSessionID, waitingRooms, members });
  const rooms: room[] = joinMemberWaitingRoom(currentSessionID, waitingRooms, members);

  return (
    <div>
      {rooms.map((room) => (
        <div key={room.id} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
            {
              <Card
                key={room.id}
                className="hover:shadow-md transition-all min-w-[200px] p-[5px]"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-card-foreground text-sm truncate">{room.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center mb-3">
                    <div className={`text-3xl font-bold ${getPeopleCountColors(room.waitingCount).text}`}>
                      {room.waitingCount}
                    </div>
                    <div className="text-sm text-muted-foreground">people</div>
                  </div>
                  <div className="text-center">
                    <div className={`flex items-center justify-center gap-1 ${getWaitingTimeColors(room.waitingTime).text}`}>
                      <Clock className="h-4 w-4" />
                      <span className="text-lg font-semibold font-mono">
                        {(() => {
                          const totalSeconds = Math.floor(room.waitingTime);
                          const minutes = Math.floor(totalSeconds / 60);
                          const seconds = totalSeconds % 60;
                          return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                        })()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">wait time</div>
                  </div>
                </CardContent>
              </Card>
            }
          </div>
        </div>
      ))}
    </div>
  );
}