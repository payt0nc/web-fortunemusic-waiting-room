import { useEffect, useId, useMemo, useState } from 'react';
import { countAtTime, type HistoryPoint } from '@/lib/history';

interface SparklineProps {
  points: HistoryPoint[];
  sessionStart: Date;
  sessionEnd: Date;
  viewEndMs: number;
  /** Live queue count — drives the flash point height */
  currentCount: number;
  className?: string;
}

const W = 100;
const H = 32;
const PAD = 3;

// One shared 1s ticker for every sparkline on the page, so a grid of dozens of
// cards drives a single timer instead of one interval + re-render loop per card.
const nowSubscribers = new Set<(now: number) => void>();
let tickerId: ReturnType<typeof setInterval> | null = null;

function useSharedNow(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    nowSubscribers.add(setNow);
    if (tickerId === null) {
      tickerId = setInterval(() => {
        const n = Date.now();
        nowSubscribers.forEach((fn) => fn(n));
      }, 1000);
    }
    return () => {
      nowSubscribers.delete(setNow);
      if (nowSubscribers.size === 0 && tickerId !== null) {
        clearInterval(tickerId);
        tickerId = null;
      }
    };
  }, []);
  return now;
}

interface Coord {
  x: number;
  y: number;
}

function timeToX(ms: number, startMs: number, viewEndMs: number): number {
  const span = viewEndMs - startMs;
  if (span <= 0) return 0;
  return Math.max(0, Math.min(W, ((ms - startMs) / span) * W));
}

function toPolyline(coords: Coord[]): string {
  return coords.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
}

function toArea(coords: Coord[]): string {
  if (coords.length === 0) return '';
  if (coords.length === 1) {
    return `${coords[0].x.toFixed(2)},${coords[0].y.toFixed(2)} ${coords[0].x.toFixed(2)},${H}`;
  }
  const line = toPolyline(coords);
  const last = coords[coords.length - 1];
  const first = coords[0];
  return `${line} ${last.x.toFixed(2)},${H} ${first.x.toFixed(2)},${H}`;
}

function buildSeries(
  points: HistoryPoint[],
  startMs: number,
  viewEndMs: number,
  toY: (count: number) => number,
  rangeEndMs: number,
  appendMs?: number,
  appendCount?: number,
): Coord[] {
  const sorted = [...points]
    .filter((point) => point.timestamp * 1000 <= rangeEndMs)
    .sort((a, b) => a.timestamp - b.timestamp);

  const coords: Coord[] = [];
  const push = (ms: number, count: number) => {
    const x = timeToX(ms, startMs, viewEndMs);
    const y = toY(count);
    const prev = coords[coords.length - 1];
    if (prev && Math.abs(prev.x - x) < 0.01 && Math.abs(prev.y - y) < 0.01) return;
    coords.push({ x, y });
  };

  if (sorted.length > 0 && sorted[0].timestamp * 1000 > startMs) {
    push(startMs, countAtTime(startMs, points));
  }

  for (const point of sorted) {
    push(point.timestamp * 1000, point.count);
  }

  if (appendMs !== undefined && appendCount !== undefined) {
    push(appendMs, appendCount);
  }

  return coords;
}

export function Sparkline({
  points,
  sessionStart,
  sessionEnd,
  viewEndMs,
  currentCount,
  className = '',
}: SparklineProps) {
  const now = useSharedNow();
  const fillClipId = useId();

  const geometry = useMemo(() => {
    const startMs = sessionStart.getTime();
    const sessionEndMs = sessionEnd.getTime();
    const roomClosed = now > sessionEndMs && currentCount === 0;
    const effectiveViewEndMs = roomClosed ? viewEndMs : Math.max(viewEndMs, now);

    const counts = [...points.map((point) => point.count), currentCount];
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    const range = max - min;
    const toY = (value: number) =>
      range === 0 ? H / 2 : H - PAD - ((value - min) / range) * (H - PAD * 2);

    const sessionEndCount = countAtTime(sessionEndMs, points);

    const fillCoords = buildSeries(
      points,
      startMs,
      effectiveViewEndMs,
      toY,
      sessionEndMs,
      sessionEndMs,
      sessionEndCount,
    );

    const appendNowMs = roomClosed ? undefined : Math.min(now, effectiveViewEndMs);

    const lineCoords = buildSeries(
      points,
      startMs,
      effectiveViewEndMs,
      toY,
      effectiveViewEndMs,
      appendNowMs,
      appendNowMs !== undefined ? currentCount : undefined,
    );

    return {
      fillCoords,
      lineCoords,
      sessionEndX: timeToX(sessionEndMs, startMs, effectiveViewEndMs),
      nowCoord: {
        x: timeToX(Math.min(now, effectiveViewEndMs), startMs, effectiveViewEndMs),
        y: toY(currentCount),
      },
      showNow: now >= startMs && !roomClosed,
    };
  }, [points, sessionStart, sessionEnd, viewEndMs, currentCount, now]);

  const { fillCoords, lineCoords, sessionEndX, nowCoord, showNow } = geometry;
  const line = lineCoords.length > 0 ? toPolyline(lineCoords) : '';
  const area = toArea(fillCoords);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`w-full h-full overflow-visible ${className}`}
    >
      <defs>
        <clipPath id={fillClipId}>
          <rect x={0} y={0} width={sessionEndX} height={H} />
        </clipPath>
      </defs>

      {area && (
        <polygon
          points={area}
          fill="currentColor"
          opacity={0.12}
          clipPath={`url(#${fillClipId})`}
        />
      )}

      {line && (
        <polyline
          points={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      <line
        x1={sessionEndX}
        y1={0}
        x2={sessionEndX}
        y2={H}
        stroke="currentColor"
        strokeWidth={1}
        strokeDasharray="2 2"
        opacity={0.45}
        vectorEffect="non-scaling-stroke"
      />

      {showNow && lineCoords.length > 0 && (
        <>
          <circle
            cx={nowCoord.x}
            cy={nowCoord.y}
            r={5}
            className="sparkline-flash-halo"
            fill="currentColor"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx={nowCoord.x}
            cy={nowCoord.y}
            r={2.5}
            fill="currentColor"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
    </svg>
  );
}
