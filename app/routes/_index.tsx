import { useEffect, useState } from "react";
import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { fetchEvents } from "@/api/fortunemusic/events";
import { fetchWaitingRooms } from "@/api/fortunemusic/waitingRooms";
import type { Event, Session, Member, WaitingRoom, WaitingRooms } from "@/api/fortunemusic/types";
import { SessionSelector } from "@/components/SessionSelector";
import { findNearestEvent } from "@/lib/aggregator";
import { EventCard } from "@/components/EventCard";
import { StatsCards } from "@/components/StatsCards";
import { WaitingRoomGrid } from "@/components/WaitingRoomGrid";
import { formatDate } from "@/utils/date";
import { Navbar02 } from "@/components/ui/shadcn-io/navbar-02";
import { Banner, BannerClose, BannerIcon, BannerTitle } from '@/components/ui/shadcn-io/banner';
import { CircleAlert } from 'lucide-react';
import { serializeEvents, deserializeEvents, serializeWaitingRooms, deserializeWaitingRooms } from "@/utils/transformers";

export const meta: MetaFunction = () => {
  return [
    { title: "46◢ Online Meet Waiting Room" },
  ];
};

export async function loader() {
  try {
    const eventsMap = await fetchEvents();
    const current = new Date();
    const defaultEvent = findNearestEvent(eventsMap, current);
    
    let defaultWaitingRooms = null;
    let initialError = null;

    if (defaultEvent) {
      const k = defaultEvent.sessions.keys().next().value;
      if (k !== undefined) {
        const defaultSession = defaultEvent.sessions.get(k);
        if (defaultSession) {
          try {
            const wr = await fetchWaitingRooms(defaultSession.id);
            defaultWaitingRooms = serializeWaitingRooms(wr);
          } catch (e) {
            console.error("Failed to fetch initial waiting rooms", e);
            initialError = "Failed to fetch initial waiting rooms";
          }
        }
      }
    }

    return json({
      events: serializeEvents(eventsMap),
      defaultWaitingRooms,
      initialError
    });
  } catch (error) {
    console.error("Failed to load events", error);
    throw new Response("Failed to load events", { status: 500 });
  }
}

function extractMembers(sessions: Map<number, Session>): Map<string, Member> {
  let members = new Map<string, Member>();
  sessions.forEach((session) => {
    session.members.forEach((member, memberId) => {
      members.set(memberId, member);
    });
  });
  return members;
}

function getArtistLogo(artistName: string): string | null {
  const logoMap: Record<string, string> = {
    '乃木坂46': "/assets/nogizaka46_logo.svg",
    '櫻坂46': "/assets/sakurazaka46_logo.svg",
    '日向坂46': "/assets/hinatazaka46_logo.svg",
  };
  return logoMap[artistName] || null;
}

function updateBackgroundImage(logoUrl: string | null) {
  if (logoUrl) {
    document.documentElement.style.setProperty('--background-logo', `url("${logoUrl}")`);
  } else {
    document.documentElement.style.setProperty('--background-logo', 'none');
  }
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  // Initial State Setup
  const [events] = useState(() => deserializeEvents(loaderData.events));
  
  // Calculate default selected event/session derived from initial events
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(() => {
    const current = new Date();
    return findNearestEvent(events, current) || null;
  });

  const [sessions, setSessions] = useState<Map<number, Session>>(() => {
    return selectedEvent ? selectedEvent.sessions : new Map();
  });

  const [selectedSession, setSelectedSession] = useState<Session | null>(() => {
    if (selectedEvent) {
        const k = selectedEvent.sessions.keys().next().value;
        return k !== undefined ? selectedEvent.sessions.get(k) || null : null;
    }
    return null;
  });

  const [members, setMembers] = useState<Map<string, Member>>(() => {
    return selectedEvent ? extractMembers(selectedEvent.sessions) : new Map();
  });

  const [waitingRooms, setWaitingRooms] = useState<Map<number, WaitingRoom[]>>(() => {
    return loaderData.defaultWaitingRooms 
        ? deserializeWaitingRooms(loaderData.defaultWaitingRooms).waitingRooms 
        : new Map();
  });

  const [notice, setNotice] = useState<string | null>(() => {
    return loaderData.defaultWaitingRooms 
        ? deserializeWaitingRooms(loaderData.defaultWaitingRooms).message 
        : null;
  });

  const [participant, setParticipant] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [nextRefreshTime, setNextRefreshTime] = useState<Date>(new Date(Date.now() + 20 * 1000));
  const [error, setError] = useState<string | null>(loaderData.initialError || null);

  // Calculate initial participant count
  useEffect(() => {
    if (selectedSession) {
        const thisRoom = waitingRooms.get(selectedSession.id) || [];
        const count = thisRoom.reduce((sum, room) => sum + room.peopleCount, 0);
        setParticipant(count);
    }
  }, [waitingRooms, selectedSession]);

  // Handle Event Selection
  const handleEventSelect = (uniqueId: string) => {
    let foundEvent: Event | null = null;
    events.forEach((eventList: Event[]) => {
      const event = eventList.find((e: Event) => e.uniqueId === uniqueId);
      if (event) foundEvent = event;
    });

    if (foundEvent) {
      const selectedEventData: Event = foundEvent;
      setSelectedEvent(selectedEventData);
      setSessions(selectedEventData.sessions);
      setMembers(extractMembers(selectedEventData.sessions));

      const firstSessionKey = selectedEventData.sessions.keys().next().value;
      if (firstSessionKey !== undefined) {
        const firstSession = selectedEventData.sessions.get(firstSessionKey);
        if (firstSession) {
          setSelectedSession(firstSession);
          // Trigger immediate fetch for new session
          fetcher.load(`/api/waiting-rooms?eventId=${firstSession.id}`);
        }
      }
    }
  };

  // Update Background
  useEffect(() => {
    if (selectedEvent) {
      const logoFileName = getArtistLogo(selectedEvent.artistName);
      updateBackgroundImage(logoFileName);
    }
  }, [selectedEvent?.id]);

  // Polling Logic
  useEffect(() => {
    const checkRefresh = () => {
      const now = new Date();
      if (now >= nextRefreshTime && selectedSession && fetcher.state === "idle") {
         fetcher.load(`/api/waiting-rooms?eventId=${selectedSession.id}`);
         setNextRefreshTime(new Date(Date.now() + 20 * 1000));
      }
    };

    const interval = setInterval(checkRefresh, 1000);
    return () => clearInterval(interval);
  }, [nextRefreshTime, selectedSession, fetcher.state]);

  // Handle Polling/Fetcher Results
  useEffect(() => {
    if (fetcher.data) {
        const data: any = fetcher.data;
        if (data.error) {
            console.error(data.error);
        } else {
            // Deserialize fetcher data (waitingRooms array entries)
            const wrMap = new Map<number, WaitingRoom[]>(data.waitingRooms);
            setWaitingRooms(wrMap);
            if (data.message) setNotice(data.message);
            else setNotice(null);
            
            setLastUpdate(new Date());
        }
    }
  }, [fetcher.data]);

  // Manual Refresh
  const manualRefresh = () => {
    if (selectedSession) {
        fetcher.load(`/api/waiting-rooms?eventId=${selectedSession.id}`);
        setNextRefreshTime(new Date(Date.now() + 20 * 1000));
    }
  };

  return (
    <div className="min-h-screen relative">
      <Navbar02 events={events} onEventSelect={handleEventSelect} />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">Error loading events:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {notice && (
          <div className="mt-6">
            <Banner>
              <BannerIcon icon={CircleAlert} />
              <BannerTitle>{notice}</BannerTitle>
              <BannerClose />
            </Banner>
          </div>
        )}

        <div className="mt-6">
          <EventCard
            name={selectedEvent?.name!}
            date={selectedEvent?.date ? formatDate(selectedEvent.date) : ''}
          />
        </div>

        <div className="mt-6">
          <SessionSelector
            id={selectedSession?.id || null}
            sessions={sessions}
            onEventSelect={(eventId: number) => {
              const session = sessions.get(eventId);
              setSelectedSession(session || null);
              if (session) {
                 fetcher.load(`/api/waiting-rooms?eventId=${session.id}`);
              }
            }}
          />
        </div>

        <div className="mt-6">
          <StatsCards
            session={selectedSession!}
            lastUpdate={lastUpdate}
            nextRefreshTime={nextRefreshTime}
            loading={fetcher.state !== "idle"}
            onManualRefresh={manualRefresh}
            participant={participant}
          />
        </div>

        <div className="mt-6 mb-8">
          <WaitingRoomGrid
            currentSessionID={selectedSession?.id || 0}
            waitingRooms={waitingRooms}
            members={members}
          />
        </div>
      </div>
    </div>
  );
}
