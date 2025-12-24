import { test, expect, describe } from "bun:test";
import { findNearestEvent } from "./aggregator";
import type { Event } from "@/api/fortunemusic/events";

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
});