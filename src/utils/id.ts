export function concatUniqueEventID(eventId: number, sessionId: number): string {
    return `${eventId}-${sessionId}`;
}