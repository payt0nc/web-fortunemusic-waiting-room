import type { Event } from "@/api/fortunemusic/events";

export function findNearestEvent(eventMap: Map<number, Event[]>, targetTime: Date): Event | null {
    let nearestEvent: Event | null = null;
    let smallestTimeDiff = Number.MAX_SAFE_INTEGER;
    eventMap.forEach((events) => {
        events.forEach((event) => {
            const timeDiff = Math.abs(event.date.getTime() - targetTime.getTime());
            if (timeDiff < smallestTimeDiff) {
                smallestTimeDiff = timeDiff;
                nearestEvent = event;
            }
        });
    });
    return nearestEvent;
}
