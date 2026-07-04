import { test, expect, describe } from "bun:test";
import { findCurrentSession, findNearestEvent } from "./aggregator";
import type { Event, Session } from "@/api/fortunemusic/events";

function makeSession(
    id: number,
    start: string,
    end: string,
): Session {
    return {
        id,
        name: `Session ${id}`,
        sessionName: `Session ${id}`,
        startTime: new Date(start),
        endTime: new Date(end),
        members: new Map(),
    };
}

describe("findCurrentSession", () => {
    test("returns null for empty sessions", () => {
        expect(findCurrentSession(new Map(), new Date())).toBeNull();
    });

    test("returns the active session when one is in progress", () => {
        const sessions = new Map([
            [1, makeSession(1, "2024-01-15T10:00:00", "2024-01-15T12:00:00")],
            [2, makeSession(2, "2024-01-15T14:00:00", "2024-01-15T16:00:00")],
        ]);

        const result = findCurrentSession(sessions, new Date("2024-01-15T14:30:00"));
        expect(result?.id).toBe(2);
    });

    test("returns the next upcoming session when between sessions", () => {
        const sessions = new Map([
            [1, makeSession(1, "2024-01-15T10:00:00", "2024-01-15T12:00:00")],
            [2, makeSession(2, "2024-01-15T14:00:00", "2024-01-15T16:00:00")],
        ]);

        const result = findCurrentSession(sessions, new Date("2024-01-15T13:00:00"));
        expect(result?.id).toBe(2);
    });

    test("returns the most recent session when all sessions are past", () => {
        const sessions = new Map([
            [1, makeSession(1, "2024-01-15T10:00:00", "2024-01-15T12:00:00")],
            [2, makeSession(2, "2024-01-15T14:00:00", "2024-01-15T16:00:00")],
        ]);

        const result = findCurrentSession(sessions, new Date("2024-01-15T18:00:00"));
        expect(result?.id).toBe(2);
    });
});

describe("findNearestEvent", () => {
    test("should return null for empty event map", () => {
        const eventMap = new Map<number, Event[]>();
        const targetTime = new Date("2024-01-15T10:00:00");
        const result = findNearestEvent(eventMap, targetTime);
        expect(result).toBeNull();
    });

    test("should return the only event when there's one event", () => {
        const event: Event = {
            id: 1,
            uniqueId: "1-1",
            name: "Test Event",
            artistName: "乃木坂46",
            photoUrl: "https://example.com/photo.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map([
                [1, {
                    id: 1,
                    name: "Session 1",
                    sessionName: "Session 1",
                    startTime: new Date("2024-01-15T14:00:00"),
                    endTime: new Date("2024-01-15T16:00:00"),
                    members: new Map(),
                }]
            ]),
        };

        const eventMap = new Map([[1, [event]]]);
        const targetTime = new Date("2024-01-15T10:00:00");
        const result = findNearestEvent(eventMap, targetTime);
        expect(result).toBe(event);
    });

    test("should return the nearest event by session start time", () => {
        const event1: Event = {
            id: 1,
            uniqueId: "1-1",
            name: "Event 1",
            artistName: "乃木坂46",
            photoUrl: "https://example.com/photo.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map([
                [1, {
                    id: 1,
                    name: "Session 1",
                    sessionName: "Session 1",
                    startTime: new Date("2024-01-15T18:00:00"),
                    endTime: new Date("2024-01-15T20:00:00"),
                    members: new Map(),
                }]
            ]),
        };

        const event2: Event = {
            id: 2,
            uniqueId: "2-1",
            name: "Event 2",
            artistName: "櫻坂46",
            photoUrl: "https://example.com/photo2.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map([
                [1, {
                    id: 1,
                    name: "Session 1",
                    sessionName: "Session 1",
                    startTime: new Date("2024-01-15T14:00:00"),
                    endTime: new Date("2024-01-15T16:00:00"),
                    members: new Map(),
                }]
            ]),
        };

        const eventMap = new Map([
            [1, [event1]],
            [2, [event2]]
        ]);

        // Target time is 13:00, should return event2 (14:00) as it's closer than event1 (18:00)
        const targetTime = new Date("2024-01-15T13:00:00");
        const result = findNearestEvent(eventMap, targetTime);
        expect(result).toBe(event2);
    });

    test("should use the earliest session when an event has multiple sessions", () => {
        const event1: Event = {
            id: 1,
            uniqueId: "1-1",
            name: "Event 1",
            artistName: "乃木坂46",
            photoUrl: "https://example.com/photo.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map([
                [1, {
                    id: 1,
                    name: "Session 1",
                    sessionName: "Session 1",
                    startTime: new Date("2024-01-15T14:00:00"),
                    endTime: new Date("2024-01-15T16:00:00"),
                    members: new Map(),
                }],
                [2, {
                    id: 2,
                    name: "Session 2",
                    sessionName: "Session 2",
                    startTime: new Date("2024-01-15T18:00:00"),
                    endTime: new Date("2024-01-15T20:00:00"),
                    members: new Map(),
                }]
            ]),
        };

        const event2: Event = {
            id: 2,
            uniqueId: "2-1",
            name: "Event 2",
            artistName: "櫻坂46",
            photoUrl: "https://example.com/photo2.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map([
                [1, {
                    id: 1,
                    name: "Session 1",
                    sessionName: "Session 1",
                    startTime: new Date("2024-01-15T15:00:00"),
                    endTime: new Date("2024-01-15T17:00:00"),
                    members: new Map(),
                }]
            ]),
        };

        const eventMap = new Map([
            [1, [event1]],
            [2, [event2]]
        ]);

        // Target time is 13:00
        // event1's earliest session is 14:00 (1 hour diff)
        // event2's session is 15:00 (2 hours diff)
        // Should return event1
        const targetTime = new Date("2024-01-15T13:00:00");
        const result = findNearestEvent(eventMap, targetTime);
        expect(result).toBe(event1);
    });

    test("should handle multiple events in the same event array", () => {
        const event1: Event = {
            id: 1,
            uniqueId: "1-1",
            name: "Event 1 - Day 1",
            artistName: "乃木坂46",
            photoUrl: "https://example.com/photo.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map([
                [1, {
                    id: 1,
                    name: "Session 1",
                    sessionName: "Session 1",
                    startTime: new Date("2024-01-15T14:00:00"),
                    endTime: new Date("2024-01-15T16:00:00"),
                    members: new Map(),
                }]
            ]),
        };

        const event2: Event = {
            id: 1,
            uniqueId: "1-2",
            name: "Event 1 - Day 2",
            artistName: "乃木坂46",
            photoUrl: "https://example.com/photo.jpg",
            date: new Date("2024-01-16"),
            sessions: new Map([
                [1, {
                    id: 1,
                    name: "Session 1",
                    sessionName: "Session 1",
                    startTime: new Date("2024-01-16T14:00:00"),
                    endTime: new Date("2024-01-16T16:00:00"),
                    members: new Map(),
                }]
            ]),
        };

        const eventMap = new Map([
            [1, [event1, event2]]
        ]);

        // Target time is on Jan 15 at 13:00
        // event1 is 1 hour away, event2 is 25 hours away
        const targetTime = new Date("2024-01-15T13:00:00");
        const result = findNearestEvent(eventMap, targetTime);
        expect(result).toBe(event1);
    });

    test("should handle past events (using absolute time difference)", () => {
        const event1: Event = {
            id: 1,
            uniqueId: "1-1",
            name: "Past Event",
            artistName: "乃木坂46",
            photoUrl: "https://example.com/photo.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map([
                [1, {
                    id: 1,
                    name: "Session 1",
                    sessionName: "Session 1",
                    startTime: new Date("2024-01-15T10:00:00"),
                    endTime: new Date("2024-01-15T12:00:00"),
                    members: new Map(),
                }]
            ]),
        };

        const event2: Event = {
            id: 2,
            uniqueId: "2-1",
            name: "Future Event",
            artistName: "櫻坂46",
            photoUrl: "https://example.com/photo2.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map([
                [1, {
                    id: 1,
                    name: "Session 1",
                    sessionName: "Session 1",
                    startTime: new Date("2024-01-15T16:00:00"),
                    endTime: new Date("2024-01-15T18:00:00"),
                    members: new Map(),
                }]
            ]),
        };

        const eventMap = new Map([
            [1, [event1]],
            [2, [event2]]
        ]);

        // Target time is 14:00
        // event1 (10:00) is 4 hours in the past
        // event2 (16:00) is 2 hours in the future
        // Should return event2 as it's closer
        const targetTime = new Date("2024-01-15T14:00:00");
        const result = findNearestEvent(eventMap, targetTime);
        expect(result).toBe(event2);
    });

    test("should skip events with no sessions", () => {
        const eventWithNoSessions: Event = {
            id: 1,
            uniqueId: "1-1",
            name: "Event with no sessions",
            artistName: "乃木坂46",
            photoUrl: "https://example.com/photo.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map(),
        };

        const eventWithSessions: Event = {
            id: 2,
            uniqueId: "2-1",
            name: "Event with sessions",
            artistName: "櫻坂46",
            photoUrl: "https://example.com/photo2.jpg",
            date: new Date("2024-01-16"),
            sessions: new Map([
                [1, {
                    id: 1,
                    name: "Session 1",
                    sessionName: "Session 1",
                    startTime: new Date("2024-01-16T14:00:00"),
                    endTime: new Date("2024-01-16T16:00:00"),
                    members: new Map(),
                }]
            ]),
        };

        const eventMap = new Map([
            [1, [eventWithNoSessions]],
            [2, [eventWithSessions]]
        ]);

        const targetTime = new Date("2024-01-15T13:00:00");
        const result = findNearestEvent(eventMap, targetTime);
        expect(result).toBe(eventWithSessions);
    });

    test("prefers n46 over s46 and h46 when sessions start at the same time", () => {
        const sameStart = new Date("2024-01-15T14:00:00");
        const sameEnd = new Date("2024-01-15T16:00:00");

        const nogiEvent: Event = {
            id: 1,
            uniqueId: "1-1",
            name: "Nogi Event",
            artistName: "乃木坂46",
            photoUrl: "https://example.com/nogi.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map([[1, makeSession(1, sameStart.toISOString(), sameEnd.toISOString())]]),
        };

        const sakuraEvent: Event = {
            id: 2,
            uniqueId: "2-1",
            name: "Sakura Event",
            artistName: "櫻坂46",
            photoUrl: "https://example.com/sakura.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map([[1, makeSession(1, sameStart.toISOString(), sameEnd.toISOString())]]),
        };

        const hinataEvent: Event = {
            id: 3,
            uniqueId: "3-1",
            name: "Hinata Event",
            artistName: "日向坂46",
            photoUrl: "https://example.com/hinata.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map([[1, makeSession(1, sameStart.toISOString(), sameEnd.toISOString())]]),
        };

        const eventMap = new Map([
            [2, [sakuraEvent]],
            [3, [hinataEvent]],
            [1, [nogiEvent]],
        ]);

        const result = findNearestEvent(eventMap, new Date("2024-01-15T13:00:00"));
        expect(result).toBe(nogiEvent);
    });

    test("prefers the event with an active session over an upcoming one", () => {
        const activeEvent: Event = {
            id: 1,
            uniqueId: "1-1",
            name: "Active Event",
            artistName: "櫻坂46",
            photoUrl: "https://example.com/active.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map([
                [1, makeSession(1, "2024-01-15T13:00:00", "2024-01-15T15:00:00")],
            ]),
        };

        const upcomingEvent: Event = {
            id: 2,
            uniqueId: "2-1",
            name: "Upcoming Event",
            artistName: "乃木坂46",
            photoUrl: "https://example.com/upcoming.jpg",
            date: new Date("2024-01-15"),
            sessions: new Map([
                [1, makeSession(1, "2024-01-15T13:30:00", "2024-01-15T15:30:00")],
            ]),
        };

        const eventMap = new Map([
            [1, [activeEvent]],
            [2, [upcomingEvent]],
        ]);

        const result = findNearestEvent(eventMap, new Date("2024-01-15T14:00:00"));
        expect(result).toBe(activeEvent);
    });
});