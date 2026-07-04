import { test, expect } from 'bun:test';
import {
  computeSparklineViewEnd,
  countAtTime,
  POST_SESSION_GRACE_MS,
  type HistoryPoint,
} from './history';

const sessionEnd = new Date('2026-07-04T02:45:00.000Z');
const graceEndMs = sessionEnd.getTime() + POST_SESSION_GRACE_MS;

function points(entries: [number, number][]): HistoryPoint[] {
  return entries.map(([timestamp, count]) => ({ timestamp, count }));
}

test('countAtTime interpolates between samples', () => {
  const series = points([
    [100, 0],
    [200, 10],
  ]);
  expect(countAtTime(150 * 1000, series)).toBe(5);
});

test('computeSparklineViewEnd uses session end + 15 minutes by default', () => {
  const viewEnd = computeSparklineViewEnd(
    sessionEnd,
    [{ points: points([[graceEndMs / 1000 - 60, 0]]), liveCount: 0 }],
    graceEndMs + 60_000,
  );
  expect(viewEnd).toBe(graceEndMs);
});

test('computeSparklineViewEnd extends when queue remains at the grace mark', () => {
  const viewEnd = computeSparklineViewEnd(
    sessionEnd,
    [
      {
        points: points([
          [graceEndMs / 1000 - 120, 5],
          [graceEndMs / 1000, 3],
          [graceEndMs / 1000 + 600, 0],
        ]),
        liveCount: 0,
      },
    ],
    graceEndMs + 900_000,
  );
  expect(viewEnd).toBe(graceEndMs + 600_000);
});

test('computeSparklineViewEnd extends to now while any room is still live', () => {
  const nowMs = graceEndMs + 120_000;
  const viewEnd = computeSparklineViewEnd(
    sessionEnd,
    [
      { points: points([[graceEndMs / 1000, 2]]), liveCount: 2 },
      { points: points([[graceEndMs / 1000, 0]]), liveCount: 0 },
    ],
    nowMs,
  );
  expect(viewEnd).toBe(nowMs);
});

test('computeSparklineViewEnd stops at clear time, not trailing zero polls', () => {
  const clearedMs = graceEndMs + 600_000;
  const viewEnd = computeSparklineViewEnd(
    sessionEnd,
    [
      {
        points: points([
          [graceEndMs / 1000 - 120, 5],
          [graceEndMs / 1000, 3],
          [clearedMs / 1000, 0],
          [clearedMs / 1000 + 3600, 0],
        ]),
        liveCount: 0,
      },
    ],
    clearedMs + 3_600_000,
  );
  expect(viewEnd).toBe(clearedMs);
});

test('computeSparklineViewEnd uses grace end when all queues cleared before grace mark', () => {
  const viewEnd = computeSparklineViewEnd(
    sessionEnd,
    [
      {
        points: points([
          [graceEndMs / 1000 - 600, 8],
          [graceEndMs / 1000 - 120, 0],
          [graceEndMs / 1000 + 3600, 0],
        ]),
        liveCount: 0,
      },
    ],
    graceEndMs + 3_600_000,
  );
  expect(viewEnd).toBe(graceEndMs);
});
