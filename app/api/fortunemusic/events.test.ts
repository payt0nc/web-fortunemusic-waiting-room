import { test, expect, describe, beforeEach, afterEach } from "bun:test";
import { fetchEvents } from "./events";

// Mock global fetch
const originalFetch = global.fetch;

describe("fetchEvents", () => {
    afterEach(() => {
        global.fetch = originalFetch;
    });

    test("should fetch and parse events for target artists", async () => {
        // Mock API response
        const mockResponse = {
            appGetEventResponse: {
                artistArray: [
                    {
                        artName: "乃木坂46",
                        eventArray: [
                            {
                                evtId: 1001,
                                evtCode: "EVT001",
                                evtName: "Meet & Greet Event",
                                evtIsOnline: false,
                                evtDisplayFrom: "2025-11-01",
                                evtDisplayTo: "2025-11-10",
                                evtSortNo: 1,
                                evtPhotUrl: "https://example.com/photo1.jpg",
                                evtPhotoUpdate: "2025-11-01",
                                evtWebUrl: "https://example.com/event1",
                                dateArray: [
                                    {
                                        datePlace: "Tokyo",
                                        dateDate: "2026-11-05",
                                        dateDayOfWeek: "Thursday",
                                        timeZoneArray: [
                                            {
                                                tzId: 101,
                                                tzName: "Morning Session",
                                                tzStart: "10:00:00",
                                                tzEnd: "12:00:00",
                                                tzDisplay: "10:00-12:00",
                                                tzUpdate: "2025-11-01",
                                                memberArray: [
                                                    {
                                                        mbName: "Member A",
                                                        mbSortNo: 1,
                                                        mbPhotoUrl: "https://example.com/member-a.jpg",
                                                        mbPhotoUpdate: "2026-11-01",
                                                        shCode: "MA001",
                                                        shName: "Member A Slot",
                                                        isShowApp: true,
                                                        ticketNumberLimit: 10,
                                                        showSerial: true
                                                    }
                                                ],
                                                hideWaitingInfo: false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        artName: "櫻坂46",
                        eventArray: [
                            {
                                evtId: 1002,
                                evtCode: "EVT002",
                                evtName: "Handshake Event",
                                evtIsOnline: false,
                                evtDisplayFrom: "2025-11-15",
                                evtDisplayTo: "2025-11-20",
                                evtSortNo: 2,
                                evtPhotUrl: "https://example.com/photo2.jpg",
                                evtPhotoUpdate: "2025-11-15",
                                evtWebUrl: "https://example.com/event2",
                                dateArray: []
                            }
                        ]
                    },
                    {
                        artName: "Other Artist",
                        eventArray: [
                            {
                                evtId: 9999,
                                evtCode: "EVT999",
                                evtName: "Should be filtered out",
                                evtIsOnline: false,
                                evtDisplayFrom: "2025-11-01",
                                evtDisplayTo: "2025-11-10",
                                evtSortNo: 3,
                                evtPhotUrl: "https://example.com/photo999.jpg",
                                evtPhotoUpdate: "2025-11-01",
                                evtWebUrl: "https://example.com/event999",
                                dateArray: []
                            }
                        ]
                    }
                ]
            }
        };

        // Mock fetch
        global.fetch = async () => {
            return {
                ok: true,
                status: 200,
                json: async () => mockResponse,
            } as Response;
        };

        // Execute the function
        const result = await fetchEvents();

        // Verify the result structure
        expect(result).toBeInstanceOf(Map);
        expect(result.size).toBe(1); // Only events with future dates are included

        // Verify event 1001 (乃木坂46)
        const event1001List = result.get(1001);
        expect(event1001List).toBeDefined();
        expect(Array.isArray(event1001List)).toBe(true);
        expect(event1001List!.length).toBe(1);

        const event1001 = event1001List![0];
        expect(event1001.id).toBe(1001);
        expect(event1001.artistName).toBe("乃木坂46");
        expect(event1001.name).toBe("Meet & Greet Event");
        expect(event1001.photoUrl).toBe("https://example.com/photo1.jpg");
        expect(event1001.sessions).toBeInstanceOf(Map);
        expect(event1001.sessions.size).toBe(1);

        // Verify session 101
        const session101 = event1001.sessions.get(101);
        expect(session101).toBeDefined();
        expect(session101?.id).toBe(101);
        expect(session101?.name).toBe("Morning Session");
        expect(session101?.members).toBeInstanceOf(Map);
        expect(session101?.members.size).toBe(1);

        // Verify member
        const memberA = session101?.members.get("MA001");
        expect(memberA).toBeDefined();
        expect(memberA?.name).toBe("Member A");
        expect(memberA?.order).toBe(1);
        expect(memberA?.thumbnailUrl).toBe("https://example.com/member-a.jpg");
        expect(memberA?.ticketCode).toBe("MA001");

        // Verify event 1002 (櫻坂46) exists but has no dates
        const event1002List = result.get(1002);
        expect(event1002List).toBeUndefined(); // Empty dateArray means no events created

        // Verify that event 9999 (Other Artist) is NOT included
        const event9999 = result.get(9999);
        expect(event9999).toBeUndefined();
    });

    test("should handle empty artistArray", async () => {
        const mockResponse = {
            appGetEventResponse: {
                artistArray: []
            }
        };

        global.fetch = async () => {
            return {
                ok: true,
                status: 200,
                json: async () => mockResponse,
            } as Response;
        };

        const result = await fetchEvents();

        expect(result).toBeInstanceOf(Map);
        expect(result.size).toBe(0);
    });

    test("should only include events from target artists", async () => {
        const mockResponse = {
            appGetEventResponse: {
                artistArray: [
                    {
                        artName: "日向坂46",
                        eventArray: [
                            {
                                evtId: 2001,
                                evtCode: "EVT2001",
                                evtName: "Hinata Event",
                                evtIsOnline: false,
                                evtDisplayFrom: "2025-11-01",
                                evtDisplayTo: "2025-11-10",
                                evtSortNo: 1,
                                evtPhotUrl: "https://example.com/photo.jpg",
                                evtPhotoUpdate: "2025-11-01",
                                evtWebUrl: "https://example.com/event",
                                dateArray: [
                                    {
                                        datePlace: "Tokyo",
                                        dateDate: "2025-12-30",
                                        dateDayOfWeek: "Monday",
                                        timeZoneArray: [
                                            {
                                                tzId: 201,
                                                tzName: "Session",
                                                tzStart: "10:00:00",
                                                tzEnd: "12:00:00",
                                                tzDisplay: "10:00-12:00",
                                                tzUpdate: "2025-11-01",
                                                memberArray: [],
                                                hideWaitingInfo: false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        artName: "Unknown Artist",
                        eventArray: [
                            {
                                evtId: 3001,
                                evtCode: "EVT3001",
                                evtName: "Unknown Event",
                                evtIsOnline: false,
                                evtDisplayFrom: "2025-11-01",
                                evtDisplayTo: "2025-11-10",
                                evtSortNo: 1,
                                evtPhotUrl: "https://example.com/photo.jpg",
                                evtPhotoUpdate: "2025-11-01",
                                evtWebUrl: "https://example.com/event",
                                dateArray: []
                            }
                        ]
                    }
                ]
            }
        };

        global.fetch = async () => {
            return {
                ok: true,
                status: 200,
                json: async () => mockResponse,
            } as Response;
        };

        const result = await fetchEvents();

        expect(result.size).toBe(1);
        expect(result.has(2001)).toBe(true);
        expect(result.has(3001)).toBe(false);
    });

    test("should throw error when API request fails", async () => {
        global.fetch = async () => {
            return {
                ok: false,
                status: 500,
                json: async () => ({}),
            } as Response;
        };

        await expect(fetchEvents()).rejects.toThrow("API Error: 500");
    });

    test("should filter out past events", async () => {
        const mockResponse = {
            appGetEventResponse: {
                artistArray: [
                    {
                        artName: "乃木坂46",
                        eventArray: [
                            {
                                evtId: 1001,
                                evtCode: "EVT001",
                                evtName: "Past Event",
                                evtIsOnline: false,
                                evtDisplayFrom: "2020-01-01",
                                evtDisplayTo: "2020-01-10",
                                evtSortNo: 1,
                                evtPhotUrl: "https://example.com/photo.jpg",
                                evtPhotoUpdate: "2020-01-01",
                                evtWebUrl: "https://example.com/event",
                                dateArray: [
                                    {
                                        datePlace: "Tokyo",
                                        dateDate: "2020-01-05",
                                        dateDayOfWeek: "Sunday",
                                        timeZoneArray: [
                                            {
                                                tzId: 101,
                                                tzName: "Session",
                                                tzStart: "10:00:00",
                                                tzEnd: "12:00:00",
                                                tzDisplay: "10:00-12:00",
                                                tzUpdate: "2020-01-01",
                                                memberArray: [],
                                                hideWaitingInfo: false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        };

        global.fetch = async () => {
            return {
                ok: true,
                status: 200,
                json: async () => mockResponse,
            } as Response;
        };

        const result = await fetchEvents();

        // Past events should be filtered out
        expect(result.size).toBe(0);
    });
});
