import type { Event, Session, Member } from "@/api/fortunemusic/events";
import type { WaitingRooms, WaitingRoom } from "@/api/fortunemusic/waitingRooms";

export function serializeEvents(events: Map<number, Event[]>) {
  return Array.from(events.entries()).map(([k, v]) => [k, v.map(e => ({
    ...e,
    sessions: Array.from(e.sessions.entries()).map(([sk, sv]) => [sk, {
      ...sv,
      members: Array.from(sv.members.entries())
    }])
  }))]);
}

export function deserializeEvents(data: any): Map<number, Event[]> {
  if (!data) return new Map();
  return new Map(data.map(([k, v]: any) => [k, v.map((e: any) => ({
    ...e,
    date: new Date(e.date),
    sessions: new Map(e.sessions.map(([sk, sv]: any) => [sk, {
      ...sv,
      startTime: new Date(sv.startTime),
      endTime: new Date(sv.endTime),
      members: new Map(sv.members)
    }]))
  }))]));
}

export function serializeWaitingRooms(wr: WaitingRooms) {
  return {
    message: wr.message,
    waitingRooms: Array.from(wr.waitingRooms.entries())
  };
}

export function deserializeWaitingRooms(data: any): WaitingRooms {
  if (!data) return { message: "", waitingRooms: new Map() };
  return {
    message: data.message,
    waitingRooms: new Map(data.waitingRooms)
  };
}
