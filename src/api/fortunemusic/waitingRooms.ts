export interface WaitingRooms {
    message: string;
    waitingRooms: Map<number, WaitingRoom[]>;
}

export interface WaitingRoom {
    ticketCode: string;
    peopleCount: number;
    waitingTime: number;
}

export async function fetchWaitingRooms(eventID: number): Promise<WaitingRooms> {
    const link = "https://proxy.n46.io/meets/events/rooms";
    try {
        const response = await fetch(link, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "eventId": "e" + eventID })
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch waiting rooms: ${response.status} ${response.statusText}`);
        }

        let resp: any = await response.json();
        let waitingRooms: WaitingRooms = flattenWaitingRooms(resp);
        return waitingRooms;
    } catch (error) {
        console.error("Error fetching waiting rooms:", error);
        throw new Error(`Failed to fetch waiting rooms: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

function flattenWaitingRooms(data: any): WaitingRooms {
    let waitingRooms: Map<number, WaitingRoom[]> = new Map<number, WaitingRoom[]>();
    data.timezones.forEach((timezone: any) => {
        let eventIDStr = timezone.e_id as string;
        let eventID = +(eventIDStr.slice(1)) as number;

        // Get existing rooms for this event ID or create a new array
        let rooms: WaitingRoom[] = waitingRooms.get(eventID) || [];

        Object.keys(timezone.members).forEach((key) => {
            const memberInfo = timezone.members[key];
            rooms.push({
                ticketCode: key,
                peopleCount: memberInfo.totalCount,
                waitingTime: memberInfo.totalWait,
            });
        });
        waitingRooms.set(eventID, rooms);
    });

    let wr: WaitingRooms = { message: data.dateMessage, waitingRooms: waitingRooms };
    return wr;
};