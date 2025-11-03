export interface Event {
    id: number;
    artist: string;
    name: string;
    photoUrl: string;
    sessions: Map<number, Session>;
}

export interface Session {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    members: Map<string, Member>;
}

export interface Member {
    order: number;
    name: string;
    thumbnailUrl: string;
    ticketCode: string;
}

interface EventArray {
    evtId: number
    evtCode: string
    evtName: string
    evtIsOnline: boolean
    evtDisplayFrom: string
    evtDisplayTo: string
    evtSortNo: number
    evtPhotUrl: string
    evtPhotoUpdate: string
    evtWebUrl: string
    dateArray: DateArray[]
}

interface DateArray {
    datePrefecture?: string
    datePlace: string
    dateDate: string
    dateDayOfWeek: string
    timeZoneArray: TimeZoneArray[]
}

interface TimeZoneArray {
    tzId: number
    tzName: string
    tzStart: string
    tzEnd: string
    tzDisplay: string
    tzUpdate: string
    memberArray: MemberArray[]
    hideWaitingInfo: boolean
}

interface MemberArray {
    mbName: string
    mbSortNo: number
    mbPhotoUrl: string
    mbPhotoUpdate: string
    shCode: string
    shName: string
    shUseMulti?: number
    showControlNo?: boolean
    ticketArray?: TicketArray[]
    isShowApp: boolean
    ticketNumberLimit: number
    showSerial: boolean
    nextLane?: string
    nicknameInputLimit?: number
    nicknameInputText?: string
    nicknameLabel?: string
}

interface TicketArray {
    tkCode: string
    tkName: string
}

const targetArtistNames = ["乃木坂46", "櫻坂46", "日向坂46"];

export async function fetchEvents(): Promise<Map<number, Event>> {
    const link = "https://api.fortunemusic.app/v1/appGetEventData"
    const response = await fetch(link, {
        method: "GET",
    });

    const data = await response.json();
    let events: Map<number, Event> = new Map<number, Event>();
    for (const artist of data.appGetEventResponse.artistArray) {
        // if artist name in targetArtistNames
        if (targetArtistNames.includes(artist.artName)) {
            artist.eventArray.forEach((event: EventArray) => {
                events.set(event.evtId, {
                    id: event.evtId,
                    artist: artist.artName,
                    name: event.evtName,
                    photoUrl: event.evtPhotUrl,
                    sessions: flatternDateArrayAsSession(event.dateArray),
                });
            });
        }
    }

    return events;
}

export function concatEventTime(dt: string, t: string): Date {
    let datetime = new Date(dt);
    if (isNaN(datetime.getTime())) {
        throw new Error(`Invalid date string: ${dt}`);
    }

    const parts = t.split(':');
    if (parts.length !== 3) {
        throw new Error("Invalid time string format. Expected HH:MM:SS.");
    }

    const hours = parseInt(parts[0]!, 10);
    const minutes = parseInt(parts[1]!, 10);
    const seconds = parseInt(parts[2]!, 10);

    // Validate the parsed values
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
        hours < 0 || hours > 23 ||
        minutes < 0 || minutes > 59 ||
        seconds < 0 || seconds > 59) {
        throw new Error("Invalid time values in the string.");
    }

    datetime.setHours(hours, minutes, seconds);
    return datetime;
}

export function flatternMemberArray(memberArray: MemberArray[]): Map<string, Member> {
    let membersMap: Map<string, Member> = new Map<string, Member>();
    memberArray.forEach((member) => {
        membersMap.set(member.shCode, {
            order: member.mbSortNo,
            name: member.mbName,
            thumbnailUrl: member.mbPhotoUrl,
            ticketCode: member.shCode,
        });
    });

    return membersMap;
}

export function flatternDateArrayAsSession(dateArray: DateArray[]): Map<number, Session> {
    let sessionsMap: Map<number, Session> = new Map<number, Session>();
    dateArray.forEach((date) => {
        date.timeZoneArray.forEach((timezone) => {
            let startAt = concatEventTime(date.dateDate, timezone.tzStart);
            let endAt = concatEventTime(date.dateDate, timezone.tzEnd);
            sessionsMap.set(timezone.tzId, {
                id: timezone.tzId,
                name: timezone.tzName,
                startTime: startAt.toISOString(),
                endTime: endAt.toISOString(),
                members: flatternMemberArray(timezone.memberArray),
            })
        });
    });
    return sessionsMap;
}
