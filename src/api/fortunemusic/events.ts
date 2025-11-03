import axios from "axios";

export interface Event {
    id: number;
    name: string;
    artistName: string;
    photoUrl: string;
    date: Date;
    sessions: Map<number, Session>;
}

export interface Session {
    id: number;
    name: string;
    sessionName: string;
    startTime: Date;
    endTime: Date;
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

export async function fetchEvents(): Promise<Map<number, Event[]>> {
    // Use local proxy in development, CORS proxy for GitHub Pages deployment
    const isProduction = process.env.NODE_ENV === 'production';
    const link = isProduction 
        ? "https://corsproxy.io/?https://api.fortunemusic.app/v1/appGetEventData/"
        : "/api/events"

    try {
        const response = await axios.get(link);
        const data = response.data;
        let results: Map<number, Event[]> = new Map<number, Event[]>();

        for (const artist of data.appGetEventResponse.artistArray) {
            if (targetArtistNames.includes(artist.artName)) {
                let events = flatternEventArray(artist.artName, artist.eventArray);
                events.forEach((event, id) => {
                    results.set(id, event);
                });
            };
        }
        return results;

    } catch (error) {
        console.error("Error fetching events:", error);
        if (axios.isAxiosError(error)) {
            if (error.code === 'ERR_NETWORK') {
                throw new Error('Network error: Unable to connect to FortuneMusic API. This may be due to CORS restrictions.');
            }
            throw new Error(`API error: ${error.response?.status || 'Unknown'} - ${error.message}`);
        }
        throw new Error(`Failed to fetch sessions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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

export function flatternTimezoneArray(dateDate: string, timezoneArray: TimeZoneArray[]): Map<number, Session> {
    let sessions: Map<number, Session> = new Map<number, Session>();
    timezoneArray.forEach((timezone) => {
        let startAt = concatEventTime(dateDate, timezone.tzStart);
        let endAt = concatEventTime(dateDate, timezone.tzEnd);
        let session: Session = {
            id: timezone.tzId,
            name: timezone.tzName,
            sessionName: timezone.tzName,
            startTime: startAt,
            endTime: endAt,
            members: flatternMemberArray(timezone.memberArray),
        }
        sessions.set(timezone.tzId, session);
    });
    return sessions;
}

export function flatternEventArray(artistName: string, eventArray: EventArray[]): Map<number, Event[]> {
    let eventMap: Map<number, Event[]> = new Map<number, Event[]>();

    eventArray.forEach((event) => {
        let events: Event[] = [];
        let eventName = event.evtName;
        let eventPhotoUrl = event.evtPhotUrl;
        event.dateArray.forEach((date) => {
            let sessions = flatternTimezoneArray(date.dateDate, date.timeZoneArray);
            let currentEvent: Event = {
                id: event.evtId,
                name: eventName,
                artistName: artistName,
                photoUrl: eventPhotoUrl,
                date: new Date(date.dateDate),
                sessions: sessions,
            };
            events.push(currentEvent);
        });
        eventMap.set(event.evtId, events);
    });
    return eventMap;
}