import { test, expect, mock, afterEach } from 'bun:test';
import {
  sessionHistoryUrl,
  fetchSessionHistory,
  historyFromSessionData,
  type SessionHistory,
} from './sessionHistory';

const sampleHistory: SessionHistory = {
  group: 's46',
  event_id: 52994,
  session_id: 28523,
  date: '2026-07-04',
  members: [
    {
      member_id: 1,
      member_names: ['遠藤光莉'],
      points: [
        { unix_timestamp: 1783130220, avg_seconds: 61, max_seconds: 61, avg_count: 1, max_count: 1 },
        { unix_timestamp: 1783130280, avg_seconds: 74, max_seconds: 94, avg_count: 1, max_count: 2 },
      ],
    },
    {
      member_id: 99,
      member_names: ['Unknown Member'],
      points: [
        { unix_timestamp: 1783130220, avg_seconds: 0, max_seconds: 0, avg_count: 5, max_count: 5 },
      ],
    },
  ],
};

test('sessionHistoryUrl builds the assets URL from event, session, and date', () => {
  expect(sessionHistoryUrl(52994, 28523, '2026-07-04')).toBe(
    'https://assets.meet.oshi-katsu.app/2026-07-04/52994/28523.json',
  );
  expect(sessionHistoryUrl(52994, 28523, new Date('2026-07-04T00:00:00'))).toBe(
    'https://assets.meet.oshi-katsu.app/2026-07-04/52994/28523.json',
  );
});

test('fetchSessionHistory returns null on 404', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mock(() =>
    Promise.resolve({ status: 404, ok: false } as Response),
  );

  const result = await fetchSessionHistory(52994, 28523, '2026-07-04');
  expect(result).toBeNull();

  globalThis.fetch = originalFetch;
});

test('fetchSessionHistory parses successful responses', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mock(() =>
    Promise.resolve({
      status: 200,
      ok: true,
      json: async () => sampleHistory,
    } as Response),
  );

  const result = await fetchSessionHistory(52994, 28523, '2026-07-04');
  expect(result).toEqual(sampleHistory);

  globalThis.fetch = originalFetch;
});

test('historyFromSessionData maps members by normalized name and keeps every point', () => {
  const members = new Map([
    ['T001', { order: 1, name: '遠藤　光莉', thumbnailUrl: '', ticketCode: 'T001' }],
  ]);

  const history = historyFromSessionData(sampleHistory, 28523, members);

  expect(history.get('28523:T001')).toEqual([
    { timestamp: 1783130220, count: 1 },
    { timestamp: 1783130280, count: 2 },
  ]);
  expect(history.has('28523:T999')).toBe(false);
});

test('historyFromSessionData falls back to session member index when order differs', () => {
  const members = new Map([
    ['T010', { order: 10, name: '遠藤光莉', thumbnailUrl: '', ticketCode: 'T010' }],
    ['T020', { order: 20, name: '大園玲', thumbnailUrl: '', ticketCode: 'T020' }],
  ]);

  const history = historyFromSessionData(
    {
      ...sampleHistory,
      members: [
        {
          member_id: 2,
          member_names: ['大園玲'],
          points: [
            { unix_timestamp: 1, avg_seconds: 0, max_seconds: 0, avg_count: 3, max_count: 4 },
            { unix_timestamp: 2, avg_seconds: 0, max_seconds: 0, avg_count: 5, max_count: 6 },
          ],
        },
      ],
    },
    28523,
    members,
  );

  expect(history.get('28523:T020')).toEqual([
    { timestamp: 1, count: 4 },
    { timestamp: 2, count: 6 },
  ]);
});

afterEach(() => {
  mock.restore();
});
