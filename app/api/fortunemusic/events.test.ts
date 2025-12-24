import { test, expect, mock, describe } from "bun:test";
import axios from "axios";
import {
    fetchEvents,
    concatEventTime,
    flatternMemberArray,
    flatternDateArrayAsSession,
} from "./events";

describe("fetchEvents", () => {
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
                                        dateDate: "2025-11-05",
                                        dateDayOfWeek: "Friday",
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
                                                        mbPhotoUpdate: "2025-11-01",
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

        // Mock axios.get
        const mockAxiosGet = mock(() => {
            return Promise.resolve({
                data: mockResponse,
                status: 200,
                statusText: 'OK'
            });
        });

        axios.get = mockAxiosGet as any;

        // Execute the function
        const result = await fetchEvents();

        // Verify axios.get was called with correct parameters
        expect(mockAxiosGet).toHaveBeenCalledTimes(1);
        expect(mockAxiosGet).toHaveBeenCalledWith("/api/events");

        // Verify the result structure
        expect(result).toBeInstanceOf(Map);
        expect(result.size).toBe(2); // Only target artists should be included

        // Verify event 1001 (乃木坂46)
        const event1001 = result.get(1001);
        expect(event1001).toBeDefined();
        expect(event1001?.id).toBe(1001);
        expect(event1001?.artist).toBe("乃木坂46");
        expect(event1001?.name).toBe("Meet & Greet Event");
        expect(event1001?.photoUrl).toBe("https://example.com/photo1.jpg");
        expect(event1001?.sessions).toBeInstanceOf(Map);
        expect(event1001?.sessions.size).toBe(1);

        // Verify session 101
        const session101 = event1001?.sessions.get(101);
        expect(session101).toBeDefined();
        expect(session101?.id).toBe(101);
        expect(session101?.name).toBe("Morning Session");
        expect(session101?.startTime).toEqual(new Date("2025-11-05T10:00:00"));
        expect(session101?.endTime).toEqual(new Date("2025-11-05T12:00:00"));
        expect(session101?.members).toBeInstanceOf(Map);
        expect(session101?.members.size).toBe(1);

        // Verify member
        const memberA = session101?.members.get("MA001");
        expect(memberA).toBeDefined();
        expect(memberA?.name).toBe("Member A");
        expect(memberA?.order).toBe(1);
        expect(memberA?.thumbnailUrl).toBe("https://example.com/member-a.jpg");
        expect(memberA?.ticketCode).toBe("MA001");

        // Verify event 1002 (櫻坂46) exists
        const event1002 = result.get(1002);
        expect(event1002).toBeDefined();
        expect(event1002?.artist).toBe("櫻坂46");

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

        const mockAxiosGet = mock(() => {
            return Promise.resolve({
                data: mockResponse,
                status: 200,
                statusText: 'OK'
            });
        });

        axios.get = mockAxiosGet as any;

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
                                dateArray: []
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

        const mockAxiosGet = mock(() => {
            return Promise.resolve({
                data: mockResponse,
                status: 200,
                statusText: 'OK'
            });
        });

        axios.get = mockAxiosGet as any;

        const result = await fetchEvents();

        expect(result.size).toBe(1);
        expect(result.has(2001)).toBe(true);
        expect(result.has(3001)).toBe(false);
    });
});

describe("concatEventTime", () => {
    test("should correctly concatenate date and time", () => {
        const result = concatEventTime("2025-11-05", "14:30:45");
        expect(result.toISOString()).toBe(new Date("2025-11-05T14:30:45").toISOString());
    });

    test("should handle midnight time", () => {
        const result = concatEventTime("2025-11-05", "00:00:00");
        expect(result.toISOString()).toBe(new Date("2025-11-05T00:00:00").toISOString());
    });

    test("should handle end of day time", () => {
        const result = concatEventTime("2025-11-05", "23:59:59");
        expect(result.toISOString()).toBe(new Date("2025-11-05T23:59:59").toISOString());
    });

    test("should throw error for invalid date string", () => {
        expect(() => concatEventTime("invalid-date", "10:00:00")).toThrow("Invalid date string");
    });

    test("should throw error for invalid time format", () => {
        expect(() => concatEventTime("2025-11-05", "10:00")).toThrow("Invalid time string format");
    });

    test("should throw error for invalid hours", () => {
        expect(() => concatEventTime("2025-11-05", "25:00:00")).toThrow("Invalid time values");
    });

    test("should throw error for invalid minutes", () => {
        expect(() => concatEventTime("2025-11-05", "10:60:00")).toThrow("Invalid time values");
    });

    test("should throw error for invalid seconds", () => {
        expect(() => concatEventTime("2025-11-05", "10:00:60")).toThrow("Invalid time values");
    });
});

describe("flatternMemberArray", () => {
    test("should convert member array to map", () => {
        const memberArray = [
            {
                mbName: "Member 1",
                mbSortNo: 1,
                mbPhotoUrl: "https://example.com/member1.jpg",
                mbPhotoUpdate: "2025-11-01",
                shCode: "M001",
                shName: "Member 1 Slot",
                isShowApp: true,
                ticketNumberLimit: 10,
                showSerial: true
            },
            {
                mbName: "Member 2",
                mbSortNo: 2,
                mbPhotoUrl: "https://example.com/member2.jpg",
                mbPhotoUpdate: "2025-11-01",
                shCode: "M002",
                shName: "Member 2 Slot",
                isShowApp: true,
                ticketNumberLimit: 5,
                showSerial: false
            }
        ];

        const result = flatternMemberArray(memberArray);

        expect(result).toBeInstanceOf(Map);
        expect(result.size).toBe(2);

        const member1 = result.get("M001");
        expect(member1).toBeDefined();
        expect(member1?.name).toBe("Member 1");
        expect(member1?.order).toBe(1);
        expect(member1?.thumbnailUrl).toBe("https://example.com/member1.jpg");
        expect(member1?.ticketCode).toBe("M001");

        const member2 = result.get("M002");
        expect(member2).toBeDefined();
        expect(member2?.name).toBe("Member 2");
        expect(member2?.order).toBe(2);
    });

    test("should handle empty member array", () => {
        const result = flatternMemberArray([]);
        expect(result).toBeInstanceOf(Map);
        expect(result.size).toBe(0);
    });
});

describe("flatternDateArrayAsSession", () => {
    test("should convert date array to sessions map", () => {
        const dateArray = [
            {
                datePlace: "Tokyo",
                dateDate: "2025-11-05",
                dateDayOfWeek: "Friday",
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
                                mbPhotoUpdate: "2025-11-01",
                                shCode: "MA001",
                                shName: "Member A Slot",
                                isShowApp: true,
                                ticketNumberLimit: 10,
                                showSerial: true
                            }
                        ],
                        hideWaitingInfo: false
                    },
                    {
                        tzId: 102,
                        tzName: "Afternoon Session",
                        tzStart: "14:00:00",
                        tzEnd: "16:00:00",
                        tzDisplay: "14:00-16:00",
                        tzUpdate: "2025-11-01",
                        memberArray: [],
                        hideWaitingInfo: false
                    }
                ]
            }
        ];

        const result = flatternDateArrayAsSession(dateArray);

        expect(result).toBeInstanceOf(Map);
        expect(result.size).toBe(2);

        const session101 = result.get(101);
        expect(session101).toBeDefined();
        expect(session101?.id).toBe(101);
        expect(session101?.name).toBe("Morning Session");
        expect(session101?.startTime).toEqual(new Date("2025-11-05T10:00:00"));
        expect(session101?.endTime).toEqual(new Date("2025-11-05T12:00:00"));
        expect(session101?.members.size).toBe(1);

        const session102 = result.get(102);
        expect(session102).toBeDefined();
        expect(session102?.members.size).toBe(0);
    });

    test("should handle multiple dates with multiple timezones", () => {
        const dateArray = [
            {
                datePlace: "Tokyo",
                dateDate: "2025-11-05",
                dateDayOfWeek: "Friday",
                timeZoneArray: [
                    {
                        tzId: 101,
                        tzName: "Session 1",
                        tzStart: "10:00:00",
                        tzEnd: "12:00:00",
                        tzDisplay: "10:00-12:00",
                        tzUpdate: "2025-11-01",
                        memberArray: [],
                        hideWaitingInfo: false
                    }
                ]
            },
            {
                datePlace: "Osaka",
                dateDate: "2025-11-06",
                dateDayOfWeek: "Saturday",
                timeZoneArray: [
                    {
                        tzId: 201,
                        tzName: "Session 2",
                        tzStart: "14:00:00",
                        tzEnd: "16:00:00",
                        tzDisplay: "14:00-16:00",
                        tzUpdate: "2025-11-01",
                        memberArray: [],
                        hideWaitingInfo: false
                    }
                ]
            }
        ];

        const result = flatternDateArrayAsSession(dateArray);

        expect(result.size).toBe(2);
        expect(result.has(101)).toBe(true);
        expect(result.has(201)).toBe(true);
    });

    test("should handle empty date array", () => {
        const result = flatternDateArrayAsSession([]);
        expect(result).toBeInstanceOf(Map);
        expect(result.size).toBe(0);
    });
});
