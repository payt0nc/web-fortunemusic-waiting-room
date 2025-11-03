import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock } from 'lucide-react';
import { getPeopleCountColors, getWaitingTimeColors } from '@/lib/status-colors';
import type { Member } from '@/api/fortunemusic/events';
import { useEffect, useState } from 'react';
import { fetchWaitingRooms, type WaitingRooms, type WaitingRoom } from "@/api/fortunemusic/waitingRooms";
import { Notice } from './Notice';

interface WaitingRoomGridProps {
  sessionID: number;
  members: Map<string, Member>;
  loading: boolean;
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

export function WaitingRoomGrid({ sessionID, members }: WaitingRoomGridProps) {

  let [loading, setLoading] = useState(true);
  let [error, setError] = useState<string | null>(null);
  let [message, setMessage] = useState<string>("");
  let [waitingRooms, setWaitingRooms] = useState<room[]>([]);

  useEffect(() => {
    const loadWaitingRooms = async (sessionID: number) => {
      try {
        setLoading(true);
        setError(null);

        const waitingRooms: WaitingRooms = await fetchWaitingRooms(sessionID);
        setMessage(waitingRooms.message);

        let memberWaitingRooms = joinMemberWaitingRoom(sessionID, waitingRooms.waitingRooms, members);
        setWaitingRooms(memberWaitingRooms);
        console.log("Fetched Waiting Rooms:", memberWaitingRooms);

      }
      catch (err) {
        console.error("Failed to load waiting rooms:", err);
        setError(err instanceof Error ? err.message : "Failed to load waiting rooms");
      } finally {
        setLoading(false);
      }
    };
    loadWaitingRooms(sessionID);
  }, [sessionID]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="min-w-[200px] p-[5px]">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <Notice message={message} />
      {waitingRooms.map((room) => (
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