export interface WaitingRooms {
    message: string;
    waitingRooms: Map<string, WaitingRoom>;
}

export interface WaitingRoom {
    ticketCode: string;
    peopleCount: number;
    waitingTime: number;
}

export async function fetchWaitingRooms(eventID: number): Promise<WaitingRooms> {
    const link = "https://meets.fortunemusic.app/lapi/v5/app/dateTimezoneMessages"
    const response = await fetch(link, {
        method: "POST",
        headers: {
            'Host': 'meets.fortunemusic.app',
        },
        body: JSON.stringify({ "eventId": "e" + eventID })
    });

    let resp: any = await response.json();
    let waitingRooms: WaitingRooms = flatternWaitingRooms(resp);
    return waitingRooms;
}

function flatternWaitingRooms(data: any): WaitingRooms {
    let waitingRooms: Map<string, WaitingRoom> = new Map<string, WaitingRoom>();
    data.timezones.forEach((timezone: any) => {
        Object.keys(timezone.members).forEach((key) => {
            const memberInfo = timezone.members[key];
            waitingRooms.set(key, {
                ticketCode: key,
                peopleCount: memberInfo.totalCount,
                waitingTime: memberInfo.totalWait,
            });
        });
    });

    let wr: WaitingRooms = { message: data.dateMessage, waitingRooms: waitingRooms };
    return wr;
};