export function historyKey(sessionId: number, ticketCode: string): string {
  return `${sessionId}:${ticketCode}`;
}

export interface HistoryPoint {
  timestamp: number;
  count: number;
}

export const POST_SESSION_GRACE_MS = 15 * 60 * 1000;

export function countAtTime(ms: number, points: HistoryPoint[]): number {
  if (points.length === 0) return 0;

  const ts = ms / 1000;
  if (ts <= points[0].timestamp) return points[0].count;
  if (ts >= points[points.length - 1].timestamp) return points[points.length - 1].count;

  for (let i = 1; i < points.length; i++) {
    const curr = points[i];
    const prev = points[i - 1];
    if (ts <= curr.timestamp) {
      const ratio = (ts - prev.timestamp) / (curr.timestamp - prev.timestamp);
      return prev.count + ratio * (curr.count - prev.count);
    }
  }

  return points[points.length - 1].count;
}

interface RoomQueueState {
  points: HistoryPoint[];
  liveCount: number;
}

/** When a room's queue drained; null if it never had queue after the grace mark. */
function roomQueueEndMs(
  points: HistoryPoint[],
  liveCount: number,
  nowMs: number,
  graceEndMs: number,
): number | null {
  if (liveCount > 0) return nowMs;

  let lastNonZeroIdx = -1;
  for (let i = points.length - 1; i >= 0; i--) {
    if (points[i].count > 0) {
      lastNonZeroIdx = i;
      break;
    }
  }

  if (lastNonZeroIdx === -1) return null;

  const lastNonZeroMs = points[lastNonZeroIdx].timestamp * 1000;
  if (lastNonZeroMs < graceEndMs && countAtTime(graceEndMs, points) === 0) {
    return null;
  }

  if (
    lastNonZeroIdx + 1 < points.length &&
    points[lastNonZeroIdx + 1].count === 0
  ) {
    return points[lastNonZeroIdx + 1].timestamp * 1000;
  }

  return lastNonZeroMs;
}

/**
 * Default x-axis ends at session end + 15 minutes.
 * If any room still has queue at that mark, extend until every room has cleared.
 */
export function computeSparklineViewEnd(
  sessionEnd: Date,
  roomStates: RoomQueueState[],
  nowMs: number = Date.now(),
): number {
  const sessionEndMs = sessionEnd.getTime();
  const graceEndMs = sessionEndMs + POST_SESSION_GRACE_MS;

  if (roomStates.length === 0) return graceEndMs;

  const anyAboveZeroAtGrace = roomStates.some(
    ({ points, liveCount }) => liveCount > 0 || countAtTime(graceEndMs, points) > 0,
  );

  if (!anyAboveZeroAtGrace) {
    return graceEndMs;
  }

  let viewEndMs = graceEndMs;

  for (const { points, liveCount } of roomStates) {
    const roomEndMs = roomQueueEndMs(points, liveCount, nowMs, graceEndMs);
    if (roomEndMs !== null) {
      viewEndMs = Math.max(viewEndMs, roomEndMs);
    }
  }

  return viewEndMs;
}

export function roomStatesFromWaitingRooms(
  sessionId: number,
  rooms: { ticketCode: string; peopleCount: number }[],
  history: Map<string, HistoryPoint[]>,
): RoomQueueState[] {
  return rooms.map((room) => ({
    points: history.get(historyKey(sessionId, room.ticketCode)) ?? [],
    liveCount: room.peopleCount,
  }));
}
