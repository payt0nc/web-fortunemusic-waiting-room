import { fetchEvents, type Session, type Event, type Member } from "@/api/fortunemusic/events";
import { fetchWaitingRooms, type WaitingRoom, type WaitingRooms } from "@/api/fortunemusic/waitingRooms";
import { use, useEffect, useState } from "react";
import { SessionSelector } from "@/components/SessionSelector";
import { findNearestEvent } from "@/lib/aggregator";
import { EventCard } from "@/components/EventCard";
import { StatsCards } from "@/components/StatsCards";
import { WaitingRoomGrid } from "@/components/WaitingRoomGrid";
import {
  Banner,
  BannerAction,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from '@/components/ui/shadcn-io/banner';
import { CircleAlert } from 'lucide-react';

import "./index.css";
import type { WaitingRooms } from "./api/fortunemusic/waitingRooms";



function extractMembers(sessions: Map<number, Session>): Map<string, Member> {
  let members = new Map<string, Member>();
  sessions.forEach((session) => {
    session.members.forEach((member, memberId) => {
      members.set(memberId, member);
    });
  });
  return members;
}



export function App() {
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState<string | null>(null);

  let [events, setEvents] = useState<Map<number, Event>>(new Map());
  let [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  let [sessions, setSessions] = useState<Map<number, Session>>(new Map());
  let [selectedSession, setSelectedSession] = useState<Session | null>(null);

  let [waitingRooms, setWaitingRooms] = useState<Map<number, WaitingRoom[]>>(new Map());

  let [members, setMembers] = useState<Map<string, Member>>(new Map());

  let [notice, setNotice] = useState<string | null>(null);

  let [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  let [nextRefreshTime, setNextRefreshTime] = useState<Date>(new Date(Date.now() + 20 * 1000));
  let [refreshTrigger, setRefreshTrigger] = useState(0);

  // Init Events Data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        let current = new Date();
        let events = await fetchEvents();
        setEvents(events);
        console.log("Fetched Events:", events);

        let defaultEvent = findNearestEvent(events, current)!
        setSelectedEvent(defaultEvent);
        setSessions(defaultEvent.sessions);

        let k = defaultEvent.sessions.keys().next().value!;
        let defaultSessions = defaultEvent.sessions.get(k)!;
        setSelectedSession(defaultSessions);
        console.log("Selected Default Event:", defaultEvent);

        let existedMembers = extractMembers(defaultEvent.sessions);
        setMembers(existedMembers);
        console.log("Extracted Members:", existedMembers);

        let wr = await fetchWaitingRooms(defaultSessions.id);
        if (wr.message) {
          setNotice(wr.message)
        } else {
          setNotice(null);
        };

        setWaitingRooms(wr.waitingRooms);
        console.log("Fetched Waiting Rooms:", wr);


        // Update refresh times
        setLastUpdate(new Date());
        setNextRefreshTime(new Date(Date.now() + 20 * 1000));

      } catch (err) {
        console.error("Failed to load events:", err);
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [refreshTrigger]);

  // Auto-refresh timer
  useEffect(() => {
    const checkRefresh = () => {
      const now = new Date();
      if (now >= nextRefreshTime && !loading) {
        setRefreshTrigger(prev => prev + 1);
      }
    };

    const interval = setInterval(checkRefresh, 1000);
    return () => clearInterval(interval);
  }, [nextRefreshTime, loading]);

  return (
    <div className="container mx-auto p-8 text-center relative z-10">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-semibold">Error loading events:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="mb-4 p-4">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      )}

      {
        notice && (
          <Banner>
            <BannerIcon icon={CircleAlert} />
            <BannerTitle>{notice}</BannerTitle>
            <BannerClose />
          </Banner>
        )
      }

      <EventCard
        name={selectedEvent?.name!}
        date={selectedEvent?.date?.toDateString() || ''}
      />

      <SessionSelector
        id={selectedSession?.id || null}
        sessions={events.get(selectedEvent?.id || 0)?.sessions || new Map()}
        onEventSelect={(eventId: number) => {
          setSelectedSession(sessions.get(eventId) || null);
          console.log("Selected Event ID:", eventId);
        }}
      ></SessionSelector>

      <StatsCards
        session={selectedSession!}
        lastUpdate={lastUpdate}
        nextRefreshTime={nextRefreshTime}
        loading={loading}
        onManualRefresh={() => {
          console.log("Manual refresh triggered");
          setRefreshTrigger(prev => prev + 1);
        }}
      />

      <WaitingRoomGrid
        currentSessionID={selectedSession?.id || 0}
        waitingRooms={waitingRooms}
        members={members}
      />
    </div >
  );
}

export default App;