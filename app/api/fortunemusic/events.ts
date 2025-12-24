import { concatUniqueEventID } from "@/utils/id";
import { parseISO, isAfter, startOfDay } from 'date-fns';
import { toZonedTime } from "date-fns-tz";
import type { 
    Event, Session, Member, 
    EventArray, DateArray, TimeZoneArray, MemberArray 
} from "./types";

const TARGET_ARTISTS = new Set(["乃木坂46", "櫻坂46", "日向坂46", "=LOVE"]);
const API_URL = "https://api.fortunemusic.app/v1/appGetEventData/";

export async function fetchEvents(): Promise<Map<number, Event[]>> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    const results = new Map<number, Event[]>();

    data.appGetEventResponse.artistArray
        .filter((artist: any) => TARGET_ARTISTS.has(artist.artName))
        .forEach((artist: any) => {
            const events = transformEvents(artist.artName, artist.eventArray);
            events.forEach((evList, id) => results.set(id, evList));
        });

    return results;
}

function transformEvents(artistName: string, eventArray: EventArray[]): Map<number, Event[]> {
    const eventMap = new Map<number, Event[]>();
    const now = startOfDay(new Date());

    eventArray.forEach(evt => {
        const events: Event[] = evt.dateArray
            .filter(d => {
                const date = parseISO(d.dateDate);
                return isAfter(date, now) || date.getTime() === now.getTime();
            })
            .map(d => createEventFromDate(artistName, evt, d))
            .filter((e): e is Event => e !== null);

        if (events.length > 0) {
            eventMap.set(evt.evtId, events);
        }
    });

    return eventMap;
}

function createEventFromDate(artistName: string, evt: EventArray, dateData: DateArray): Event | null {
    const sessions = transformSessions(dateData.dateDate, dateData.timeZoneArray);
    if (sessions.size === 0) return null;

    const firstSessionId = sessions.keys().next().value;
    return {
        id: evt.evtId,
        uniqueId: concatUniqueEventID(evt.evtId, firstSessionId!),
        name: evt.evtName,
        artistName,
        photoUrl: evt.evtPhotUrl,
        date: parseISO(dateData.dateDate),
        sessions
    };
}

function transformSessions(dateStr: string, timezones: TimeZoneArray[]): Map<number, Session> {
    const sessions = new Map<number, Session>();
    
    timezones.forEach(tz => {
        sessions.set(tz.tzId, {
            id: tz.tzId,
            name: tz.tzName,
            sessionName: tz.tzName,
            startTime: concatEventTime(dateStr, tz.tzStart),
            endTime: concatEventTime(dateStr, tz.tzEnd),
            members: transformMembers(tz.memberArray)
        });
    });

    return sessions;
}

function transformMembers(members: MemberArray[]): Map<string, Member> {
    const memberMap = new Map<string, Member>();
    members.forEach(m => {
        memberMap.set(m.shCode, {
            order: m.mbSortNo,
            name: m.mbName,
            thumbnailUrl: m.mbPhotoUrl,
            ticketCode: m.shCode
        });
    });
    return memberMap;
}

function concatEventTime(dt: string, t: string): Date {
    const dateTimeString = dt ? `${dt} ${t}` : dt;
    const jstDate = parseISO(`${dateTimeString}+09:00`);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return toZonedTime(jstDate, tz);
}
