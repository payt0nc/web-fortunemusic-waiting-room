import type { WaitingRooms, WaitingRoom } from "./types";

const API_URL = "https://meets.fortunemusic.app/lapi/v5/app/dateTimezoneMessages";

export async function fetchWaitingRooms(eventID: number): Promise<WaitingRooms> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "eventId": `e${eventID}` })
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch waiting rooms: ${response.status}`);
    }

    const data = await response.json();
    return transformWaitingRooms(data);
}

function transformWaitingRooms(data: any): WaitingRooms {
    const waitingRooms = new Map<number, WaitingRoom[]>();

    if (data.timezones) {
        data.timezones.forEach((timezone: any) => {
            const eventID = parseInt(timezone.e_id.slice(1), 10);
            const rooms: WaitingRoom[] = [];

            if (timezone.members) {
                Object.entries(timezone.members).forEach(([key, memberInfo]: [string, any]) => {
                    rooms.push({
                        ticketCode: key,
                        peopleCount: memberInfo.totalCount,
                        waitingTime: memberInfo.totalWait,
                    });
                });
            }
            
            // Append to existing rooms if any (though usually one timezone per event in this context?)
            // The original logic was `waitingRooms.get(eventID) || []` then push.
            // Since we iterate timezones, we might see the same eventID multiple times?
            // Safer to accumulate.
            const existing = waitingRooms.get(eventID) || [];
            waitingRooms.set(eventID, [...existing, ...rooms]);
        });
    }

    return { 
        message: data.dateMessage || "", 
        waitingRooms 
    };
}
