import { fetchEvents, type Session, type Event, type Member } from "@/api/fortunemusic/events";

import { use, useEffect, useState } from "react";

import { SessionSelector } from "@/components/SessionSelector";
import { findNearestEvent } from "@/lib/aggregator";
import { EventCard } from "@/components/EventCard";
import { StatsCards } from "@/components/StatsCards";
import { WaitingRoomGrid } from "@/components/WaitingRoomGrid";

import "./index.css";



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

  let [members, setMembers] = useState<Map<string, Member>>(new Map());

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

      } catch (err) {
        console.error("Failed to load events:", err);
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
        lastUpdate={new Date()}
        nextRefreshTime={new Date(Date.now() + 20 * 1000)}
        loading={loading}
        onManualRefresh={() => {
          console.log("Manual refresh triggered");
        }}
      />

      <WaitingRoomGrid
        sessionID={selectedSession?.id!}
        members={members}
        loading={loading}
      />
    </div >
  );
}

export default App;