import { test, expect, mock } from "bun:test";
import { fetchWaitingRooms } from "./waitingRooms";

test("fetchWaitingRooms - should fetch and parse waiting rooms successfully", async () => {
    // Mock response data
    const mockResponse = {
        message: "Success",
        timezones: [
            {
                e_id: "e12345",
                members: {
                    "TICKET001": {
                        totalCount: 5,
                        totalWait: 120
                    },
                    "TICKET002": {
                        totalCount: 3,
                        totalWait: 60
                    }
                }
            },
            {
                e_id: "e12345",
                members: {
                    "TICKET003": {
                        totalCount: 10,
                        totalWait: 180
                    }
                }
            }
        ],
        dateMessage: "2025-11-03"
    };

    // Mock the global fetch function
    const mockFetch = mock(() => {
        return Promise.resolve({
            ok: true,
            json: async () => mockResponse
        } as Response);
    });

    globalThis.fetch = mockFetch as any;

    // Execute the function
    const result = await fetchWaitingRooms(12345);

    // Verify fetch was called with correct parameters
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
        "https://meets.fortunemusic.app/lapi/v5/app/dateTimezoneMessages",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "eventId": "e12345" })
        }
    );

    // Verify the result structure
    expect(result.message).toBe("2025-11-03");
    expect(result.waitingRooms).toBeInstanceOf(Map);
    expect(result.waitingRooms.size).toBe(1); // One event ID (12345)

    // Get the rooms for event 12345
    const rooms = result.waitingRooms.get(12345);
    expect(rooms).toBeDefined();
    expect(rooms?.length).toBe(3); // 3 total rooms across both timezones

    // Verify individual waiting room entries
    const ticket001 = rooms?.find(r => r.ticketCode === "TICKET001");
    expect(ticket001).toBeDefined();
    expect(ticket001?.ticketCode).toBe("TICKET001");
    expect(ticket001?.peopleCount).toBe(5);
    expect(ticket001?.waitingTime).toBe(120);

    const ticket002 = rooms?.find(r => r.ticketCode === "TICKET002");
    expect(ticket002).toBeDefined();
    expect(ticket002?.ticketCode).toBe("TICKET002");
    expect(ticket002?.peopleCount).toBe(3);
    expect(ticket002?.waitingTime).toBe(60);

    const ticket003 = rooms?.find(r => r.ticketCode === "TICKET003");
    expect(ticket003).toBeDefined();
    expect(ticket003?.ticketCode).toBe("TICKET003");
    expect(ticket003?.peopleCount).toBe(10);
    expect(ticket003?.waitingTime).toBe(180);
});

test("fetchWaitingRooms - should handle empty timezones", async () => {
    const mockResponse = {
        message: "Success",
        timezones: [],
        dateMessage: "2025-11-03"
    };

    const mockFetch = mock(() => {
        return Promise.resolve({
            ok: true,
            json: async () => mockResponse
        } as Response);
    });

    globalThis.fetch = mockFetch as any;

    const result = await fetchWaitingRooms(12345);

    expect(result.message).toBe("2025-11-03");
    expect(result.waitingRooms.size).toBe(0);
});

test("fetchWaitingRooms - should handle timezones with empty members", async () => {
    const mockResponse = {
        message: "Success",
        timezones: [
            {
                e_id: "e12345",
                members: {}
            }
        ],
        dateMessage: "2025-11-03"
    };

    const mockFetch = mock(() => {
        return Promise.resolve({
            ok: true,
            json: async () => mockResponse
        } as Response);
    });

    globalThis.fetch = mockFetch as any;

    const result = await fetchWaitingRooms(12345);

    expect(result.message).toBe("2025-11-03");
    expect(result.waitingRooms.size).toBe(1);

    // Should have event 12345 with an empty array
    const rooms = result.waitingRooms.get(12345);
    expect(rooms).toBeDefined();
    expect(rooms?.length).toBe(0);
});
