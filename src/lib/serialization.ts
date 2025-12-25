/**
 * Serialization helpers for SSR
 * Maps don't serialize properly through JSON, so we convert them to arrays
 */

import type { Event, Session, Member } from "@/api/fortunemusic/events";
import type { WaitingRoom } from "@/api/fortunemusic/waitingRooms";

/**
 * Convert Map to array of [key, value] pairs for serialization
 */
export function mapToArray<K, V>(map: Map<K, V>): [K, V][] {
  return Array.from(map.entries());
}

/**
 * Convert array of [key, value] pairs back to Map
 */
export function arrayToMap<K, V>(arr: [K, V][]): Map<K, V> {
  return new Map(arr);
}

/**
 * Serialize events data for SSR
 */
export function serializeEvents(events: Map<number, Event[]>): any {
  const eventsArray = mapToArray(events);

  return eventsArray.map(([id, eventList]) => [
    id,
    eventList.map(event => ({
      ...event,
      date: event.date.toISOString(),
      sessions: mapToArray(event.sessions).map(([sessionId, session]) => [
        sessionId,
        {
          ...session,
          startTime: session.startTime.toISOString(),
          endTime: session.endTime.toISOString(),
          members: mapToArray(session.members),
        }
      ])
    }))
  ]);
}

/**
 * Deserialize events data from SSR
 */
export function deserializeEvents(data: any): Map<number, Event[]> {
  if (data instanceof Map) return data; // Already a Map

  const entries = data.map(([id, eventList]: [number, any[]]) => [
    id,
    eventList.map((event: any) => ({
      ...event,
      date: new Date(event.date),
      sessions: new Map(
        event.sessions.map(([sessionId, session]: [number, any]) => [
          sessionId,
          {
            ...session,
            startTime: new Date(session.startTime),
            endTime: new Date(session.endTime),
            members: new Map(session.members),
          }
        ])
      )
    }))
  ]);

  return new Map(entries);
}

/**
 * Serialize an Event object
 */
export function serializeEvent(event: Event): any {
  return {
    ...event,
    date: event.date.toISOString(),
    sessions: mapToArray(event.sessions).map(([sessionId, session]) => [
      sessionId,
      {
        ...session,
        startTime: session.startTime.toISOString(),
        endTime: session.endTime.toISOString(),
        members: mapToArray(session.members),
      }
    ])
  };
}

/**
 * Deserialize an Event object
 */
export function deserializeEvent(data: any): Event {
  return {
    ...data,
    date: new Date(data.date),
    sessions: new Map(
      data.sessions.map(([sessionId, session]: [number, any]) => [
        sessionId,
        {
          ...session,
          startTime: new Date(session.startTime),
          endTime: new Date(session.endTime),
          members: new Map(session.members),
        }
      ])
    )
  };
}

/**
 * Serialize sessions Map
 */
export function serializeSessions(sessions: Map<number, Session>): any {
  return mapToArray(sessions).map(([sessionId, session]) => [
    sessionId,
    {
      ...session,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      members: mapToArray(session.members),
    }
  ]);
}

/**
 * Deserialize sessions Map
 */
export function deserializeSessions(data: any): Map<number, Session> {
  if (data instanceof Map) return data; // Already a Map

  return new Map(
    data.map(([sessionId, session]: [number, any]) => [
      sessionId,
      {
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
        members: new Map(session.members),
      }
    ])
  );
}

/**
 * Serialize waiting rooms Map
 */
export function serializeWaitingRooms(waitingRooms: Map<number, WaitingRoom[]>): any {
  return mapToArray(waitingRooms);
}

/**
 * Deserialize waiting rooms Map
 */
export function deserializeWaitingRooms(data: any): Map<number, WaitingRoom[]> {
  if (data instanceof Map) return data; // Already a Map
  return new Map(data);
}

/**
 * Serialize members Map
 */
export function serializeMembers(members: Map<string, Member>): any {
  return mapToArray(members);
}

/**
 * Deserialize members Map
 */
export function deserializeMembers(data: any): Map<string, Member> {
  if (data instanceof Map) return data; // Already a Map
  return new Map(data);
}
