import { useState, useEffect } from 'react';
import { fetchEvents, type Event, type Session, type Member } from '@/api/fortunemusic/events';
import { findNearestEvent } from '@/lib/aggregator';

function extractMembers(sessions: Map<number, Session>): Map<string, Member> {
  const members = new Map<string, Member>();
  sessions.forEach((session) => {
    session.members.forEach((member, memberId) => {
      members.set(memberId, member);
    });
  });
  return members;
}

export function useEvents() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Map<number, Event[]>>(new Map());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [sessions, setSessions] = useState<Map<number, Session>>(new Map());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [members, setMembers] = useState<Map<string, Member>>(new Map());

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const current = new Date();
        const eventsData = await fetchEvents();
        setEvents(eventsData);

        const defaultEvent = findNearestEvent(eventsData, current)!;
        setSelectedEvent(defaultEvent);
        setSessions(defaultEvent.sessions);

        const k = defaultEvent.sessions.keys().next().value!;
        const defaultSession = defaultEvent.sessions.get(k)!;
        setSelectedSession(defaultSession);

        const existedMembers = extractMembers(defaultEvent.sessions);
        setMembers(existedMembers);
      } catch (err) {
        console.error('Failed to load events:', err);
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEventSelect = (uniqueId: string) => {
    let foundEvent: Event | null = null;
    events.forEach((eventList: Event[]) => {
      const event = eventList.find((e: Event) => e.uniqueId === uniqueId);
      if (event) {
        foundEvent = event;
      }
    });

    if (foundEvent) {
      const selectedEventData: Event = foundEvent;
      setSelectedEvent(selectedEventData);
      setSessions(selectedEventData.sessions);

      const updatedMembers = extractMembers(selectedEventData.sessions);
      setMembers(updatedMembers);

      const firstSessionKey = selectedEventData.sessions.keys().next().value;
      if (firstSessionKey !== undefined) {
        const firstSession = selectedEventData.sessions.get(firstSessionKey);
        if (firstSession) {
          setSelectedSession(firstSession);
        }
      }
    }
  };

  const handleSessionSelect = (sessionId: number) => {
    setSelectedSession(sessions.get(sessionId) || null);
  };

  return {
    loading,
    error,
    events,
    selectedEvent,
    sessions,
    selectedSession,
    members,
    handleEventSelect,
    handleSessionSelect,
  };
}
