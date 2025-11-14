import type { Event } from "@/api/fortunemusic/events";

export function findNearestEvent(eventMap: Map<number, Event[]>, targetTime: Date): Event | null {
    let nearestEvent: Event | null = null;
    let smallestTimeDiff = Number.MAX_SAFE_INTEGER;

    eventMap.forEach((events) => {
        events.forEach((event) => {
            // Find the earliest session start time for this event
            const sessionTimes = Array.from(event.sessions.values()).map(session => session.startTime);

            if (sessionTimes.length > 0) {
                // Use the earliest session time to compare
                const earliestSessionTime = new Date(Math.min(...sessionTimes.map(t => t.getTime())));
                const timeDiff = Math.abs(earliestSessionTime.getTime() - targetTime.getTime());

                if (timeDiff < smallestTimeDiff) {
                    smallestTimeDiff = timeDiff;
                    nearestEvent = event;
                }
            }
        });
    });

    return nearestEvent;
}
