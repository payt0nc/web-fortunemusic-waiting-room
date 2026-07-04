import { isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import type { Member } from '@/api/fortunemusic/events';
import { historyKey, type HistoryPoint } from '@/lib/history';

const ASSETS_BASE = 'https://assets.meet.oshi-katsu.app';

function normalizeName(name: string): string {
  return name.replace(/[\s\u3000]+/g, '');
}

export interface SessionHistoryPoint {
  unix_timestamp: number;
  avg_seconds: number;
  max_seconds: number;
  avg_count: number;
  max_count: number;
}

export interface SessionHistoryMember {
  member_id: number;
  member_names: string[];
  points: SessionHistoryPoint[];
}

export interface SessionHistory {
  group: string;
  event_id: number;
  session_id: number;
  date: string;
  members: SessionHistoryMember[];
}

export function sessionHistoryUrl(eventId: number, sessionId: number, date: Date | string): string {
  const dateStr =
    typeof date === 'string'
      ? date
      : isValid(date)
        ? formatInTimeZone(date, 'Asia/Tokyo', 'yyyy-MM-dd')
        : '';
  return `${ASSETS_BASE}/${dateStr}/${eventId}/${sessionId}.json`;
}

function matchMember(
  entry: SessionHistoryMember,
  sorted: Member[],
  byName: Map<string, Member>,
  byOrder: Map<number, Member>,
): Member | undefined {
  return (
    byName.get(normalizeName(entry.member_names[0] ?? '')) ??
    byOrder.get(entry.member_id) ??
    sorted[entry.member_id - 1]
  );
}

export async function fetchSessionHistory(
  eventId: number,
  sessionId: number,
  date: Date | string,
  signal?: AbortSignal,
): Promise<SessionHistory | null> {
  const response = await fetch(sessionHistoryUrl(eventId, sessionId, date), { signal });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to fetch session history: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<SessionHistory>;
}

export function historyFromSessionData(
  data: SessionHistory,
  sessionId: number,
  members: Map<string, Member>,
): Map<string, HistoryPoint[]> {
  if (!members || members.size === 0) return new Map();

  const sorted = [...members.values()].sort((a, b) => a.order - b.order);
  const byName = new Map(sorted.map((member) => [normalizeName(member.name), member]));
  const byOrder = new Map(sorted.map((member) => [member.order, member]));

  const result = new Map<string, HistoryPoint[]>();
  for (const entry of data.members) {
    const member = matchMember(entry, sorted, byName, byOrder);
    if (!member) continue;
    result.set(
      historyKey(sessionId, member.ticketCode),
      entry.points.map((point) => ({
        timestamp: point.unix_timestamp,
        count: point.max_count,
      })),
    );
  }
  return result;
}
