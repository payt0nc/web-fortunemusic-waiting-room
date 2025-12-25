import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { useEffect, useState } from "react";
import { SessionSelector } from "@/components/SessionSelector";
import { EventCard } from "@/components/EventCard";
import { StatsCards } from "@/components/StatsCards";
import { WaitingRoomGrid } from "@/components/WaitingRoomGrid";
import { formatDate } from "@/utils/date";
import {
  Banner,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from '@/components/ui/shadcn-io/banner';
import { CircleAlert } from 'lucide-react';
import {
  deserializeEvent,
  deserializeSessions,
  deserializeWaitingRooms,
  deserializeMembers
} from "@/lib/serialization";

import nogizaka46Logo from "../images/nogizaka46_logo.svg";
import sakurazaka46Logo from "../images/sakurazaka46_logo.svg";
import hinatazaka46Logo from "../images/hinatazaka46_logo.svg";

// Map artist name to logo URL
function getArtistLogo(artistName: string): string | null {
  const logoMap: Record<string, string> = {
    '乃木坂46': nogizaka46Logo,
    '櫻坂46': sakurazaka46Logo,
    '日向坂46': hinatazaka46Logo,
  };
  return logoMap[artistName] || null;
}

// Update background image
function updateBackgroundImage(logoUrl: string | null) {
  if (typeof window === 'undefined') return; // Skip on server

  if (logoUrl) {
    document.documentElement.style.setProperty('--background-logo', `url("${logoUrl}")`);
  } else {
    document.documentElement.style.setProperty('--background-logo', 'none');
  }
}

/**
 * WaitingRoomPage component
 * Displays the event details, session selector, stats, and waiting room grid
 */
export function WaitingRoomPage() {
  const data = useLoaderData() as any;
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  // Deserialize the data from SSR
  const event = data.nearestEvent
    ? deserializeEvent(data.nearestEvent)
    : data.event
      ? deserializeEvent(data.event)
      : null;

  const sessions = data.sessions
    ? deserializeSessions(data.sessions)
    : event?.sessions || new Map();

  const session = data.session
    ? {
        ...data.session,
        startTime: new Date(data.session.startTime),
        endTime: new Date(data.session.endTime),
        members: deserializeMembers(data.session.members),
      }
    : sessions
      ? Array.from(sessions.values())[0]
      : null;

  const waitingRooms = data.waitingRooms
    ? deserializeWaitingRooms(data.waitingRooms)
    : new Map();

  const members = data.members
    ? deserializeMembers(data.members)
    : new Map();

  const participant = data.participant || 0;
  const notice = data.notice || null;

  // Local state for auto-refresh timing
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [nextRefreshTime, setNextRefreshTime] = useState<Date>(
    new Date(Date.now() + 20 * 1000)
  );

  // Update background when event changes
  useEffect(() => {
    if (event && typeof window !== 'undefined') {
      const logoFileName = getArtistLogo(event.artistName);
      updateBackgroundImage(logoFileName);
    }
  }, [event?.id]);

  // Auto-refresh timer (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip on server

    const checkRefresh = () => {
      const now = new Date();
      if (now >= nextRefreshTime && revalidator.state === 'idle') {
        console.log("Auto-refreshing waiting rooms at:", new Date());
        revalidator.revalidate();
        setLastUpdate(new Date());
        setNextRefreshTime(new Date(Date.now() + 20 * 1000));
      }
    };

    const interval = setInterval(checkRefresh, 1000);
    return () => clearInterval(interval);
  }, [nextRefreshTime, revalidator]);

  // Handle session selection
  const handleSessionSelect = (sessionId: number) => {
    const selectedSession = sessions.get(sessionId);
    if (selectedSession && event) {
      navigate(`/events/${event.uniqueId}/sessions/${sessionId}`);
    }
  };

  // Handle manual refresh
  const handleManualRefresh = () => {
    console.log("Manual refresh triggered");
    revalidator.revalidate();
    setLastUpdate(new Date());
    setNextRefreshTime(new Date(Date.now() + 20 * 1000));
  };

  if (!event || !session) {
    return (
      <div className="mt-6 p-4">
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  return (
    <>
      {/* Notice Banner */}
      {notice && (
        <div className="mt-6">
          <Banner>
            <BannerIcon icon={CircleAlert} />
            <BannerTitle>{notice}</BannerTitle>
            <BannerClose />
          </Banner>
        </div>
      )}

      {/* Event Info Card */}
      <div className="mt-6">
        <EventCard
          name={event.name}
          date={event.date ? formatDate(event.date) : ''}
        />
      </div>

      {/* Session Selector */}
      <div className="mt-6">
        <SessionSelector
          id={session.id}
          sessions={sessions}
          onEventSelect={handleSessionSelect}
        />
      </div>

      {/* Stats Cards */}
      <div className="mt-6">
        <StatsCards
          session={session}
          lastUpdate={lastUpdate}
          nextRefreshTime={nextRefreshTime}
          loading={revalidator.state === 'loading'}
          onManualRefresh={handleManualRefresh}
          participant={participant}
        />
      </div>

      {/* Waiting Room Grid */}
      <div className="mt-6 mb-8">
        <WaitingRoomGrid
          currentSessionID={session.id}
          waitingRooms={waitingRooms}
          members={members}
        />
      </div>
    </>
  );
}
