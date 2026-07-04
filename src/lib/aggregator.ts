import type { Event, Session } from "@/api/fortunemusic/events";

const artistPriority: Record<string, number> = {
    "乃木坂46": 0,
    "櫻坂46": 1,
    "日向坂46": 2,
};

interface SessionRelevance {
    tier: number;
    distance: number;
}

function sessionRelevance(session: Session, targetTime: Date): SessionRelevance {
    const now = targetTime.getTime();
    const start = session.startTime.getTime();
    const end = session.endTime.getTime();

    if (start <= now && now <= end) return { tier: 0, distance: 0 };
    if (now < start) return { tier: 1, distance: start - now };
    return { tier: 2, distance: now - end };
}

function compareRelevance(a: SessionRelevance, b: SessionRelevance): number {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return a.distance - b.distance;
}

export function findCurrentSession(
    sessions: Map<number, Session>,
    targetTime: Date,
): Session | null {
    const sessionList = Array.from(sessions.values());
    if (sessionList.length === 0) return null;

    const now = targetTime.getTime();

    const active = sessionList.filter(
        (session) => session.startTime.getTime() <= now && now <= session.endTime.getTime(),
    );
    if (active.length > 0) {
        return active.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0]!;
    }

    const upcoming = sessionList.filter((session) => session.startTime.getTime() > now);
    if (upcoming.length > 0) {
        return upcoming.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0]!;
    }

    return sessionList.sort((a, b) => b.endTime.getTime() - a.endTime.getTime())[0]!;
}

export function findNearestEvent(eventMap: Map<number, Event[]>, targetTime: Date): Event | null {
    let nearestEvent: Event | null = null;
    let nearestSession: Session | null = null;
    let bestRelevance: SessionRelevance | null = null;
    let bestArtistPriority = Number.MAX_SAFE_INTEGER;

    eventMap.forEach((events) => {
        events.forEach((event) => {
            const session = findCurrentSession(event.sessions, targetTime);
            if (!session) return;

            const relevance = sessionRelevance(session, targetTime);
            const artistPri = artistPriority[event.artistName] ?? Number.MAX_SAFE_INTEGER;
            const relevanceCmp = bestRelevance === null
                ? -1
                : compareRelevance(relevance, bestRelevance);

            const sameStartTime = nearestSession !== null
                && session.startTime.getTime() === nearestSession.startTime.getTime();

            if (
                relevanceCmp < 0 ||
                (relevanceCmp === 0 && sameStartTime && artistPri < bestArtistPriority)
            ) {
                bestRelevance = relevance;
                bestArtistPriority = artistPri;
                nearestEvent = event;
                nearestSession = session;
            }
        });
    });

    return nearestEvent;
}
