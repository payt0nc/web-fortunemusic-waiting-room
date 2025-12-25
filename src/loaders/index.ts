import type { LoaderFunctionArgs } from "react-router";
import { fetchEvents, type Event, type Session } from "@/api/fortunemusic/events";
import { fetchWaitingRooms } from "@/api/fortunemusic/waitingRooms";
import { findNearestEvent } from "@/lib/aggregator";
import {
  serializeEvents,
  serializeEvent,
  serializeSessions,
  serializeWaitingRooms,
  serializeMembers
} from "@/lib/serialization";

/**
 * Root loader - fetches all events and selects the nearest one
 */
export async function rootLoader() {
  const events = await fetchEvents();
  const nearestEvent = findNearestEvent(events, new Date());

  if (!nearestEvent) {
    throw new Response("No events found", { status: 404 });
  }

  return {
    events: serializeEvents(events),
    nearestEvent: serializeEvent(nearestEvent)
  };
}

/**
 * Event details loader - fetches a specific event by ID
 */
export async function eventDetailsLoader({ params }: LoaderFunctionArgs) {
  const { eventId, sessionId } = params;
  const events = await fetchEvents();

  // Find the event with matching uniqueId
  let foundEvent: Event | null = null;
  events.forEach((eventList: Event[]) => {
    const event = eventList.find((e: Event) => e.uniqueId === eventId);
    if (event) {
      foundEvent = event;
    }
  });

  if (!foundEvent) {
    throw new Response("Event not found", { status: 404 });
  }

  // Get the first session for this event
  const firstSessionKey = foundEvent.sessions.keys().next().value;
  const selectedSession = firstSessionKey !== undefined
    ? foundEvent.sessions.get(firstSessionKey)
    : null;

  return {
    event: foundEvent,
    session: selectedSession,
    sessions: foundEvent.sessions,
  };
}

/**
 * Session waiting room loader - fetches event, session, and waiting rooms
 */
export async function sessionWaitingRoomLoader({ params }: LoaderFunctionArgs) {
  const { eventId, sessionId } = params;

  if (!sessionId) {
    throw new Response("Session ID is required", { status: 400 });
  }

  const events = await fetchEvents();

  // Find the event with matching uniqueId
  let foundEvent: Event | null = null;
  events.forEach((eventList: Event[]) => {
    const event = eventList.find((e: Event) => e.uniqueId === eventId);
    if (event) {
      foundEvent = event;
    }
  });

  if (!foundEvent) {
    throw new Response("Event not found", { status: 404 });
  }

  const session = foundEvent.sessions.get(parseInt(sessionId));

  if (!session) {
    throw new Response("Session not found", { status: 404 });
  }

  // Fetch waiting rooms for this session
  const waitingRoomsData = await fetchWaitingRooms(parseInt(sessionId));

  // Extract all members from all sessions
  const members = new Map();
  foundEvent.sessions.forEach((session) => {
    session.members.forEach((member, memberId) => {
      members.set(memberId, member);
    });
  });

  // Calculate total participants
  const thisRoom = waitingRoomsData.waitingRooms.get(parseInt(sessionId)) || [];
  const participant = thisRoom.reduce((sum, room) => sum + room.peopleCount, 0);

  return {
    event: serializeEvent(foundEvent),
    session: {
      ...session,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      members: serializeMembers(session.members),
    },
    sessions: serializeSessions(foundEvent.sessions),
    waitingRooms: serializeWaitingRooms(waitingRoomsData.waitingRooms),
    members: serializeMembers(members),
    participant,
    notice: waitingRoomsData.message,
    events: serializeEvents(events), // Include all events for navbar
  };
}
