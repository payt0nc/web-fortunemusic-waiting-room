import { useState, useEffect, useCallback, useRef } from 'react';
import { isValid } from 'date-fns';
import { fetchWaitingRooms, type WaitingRoom } from '@/api/fortunemusic/waitingRooms';
import { fetchSessionHistory, historyFromSessionData } from '@/api/sessionHistory';
import type { Event, Session } from '@/api/fortunemusic/events';
import { historyKey, type HistoryPoint } from '@/lib/history';

const REFRESH_INTERVAL = 10; // seconds

export { historyKey } from '@/lib/history';

export function useWaitingRooms(
  selectedSession: Session | null,
  selectedEvent: Pick<Event, 'id' | 'date'> | null,
  loading: boolean,
) {
  const [waitingRooms, setWaitingRooms] = useState<Map<number, WaitingRoom[]>>(new Map());
  const [history, setHistory] = useState<Map<string, HistoryPoint[]>>(new Map());
  const [historyAvailable, setHistoryAvailable] = useState<boolean | null>(null);
  const [participant, setParticipant] = useState<number>(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [nextRefreshTime, setNextRefreshTime] = useState<Date>(new Date(Date.now() + REFRESH_INTERVAL * 1000));
  const [refreshCountdown, setRefreshCountdown] = useState<number>(REFRESH_INTERVAL);

  const contextRef = useRef({ selectedSession, selectedEvent });
  contextRef.current = { selectedSession, selectedEvent };

  const loadSessionHistory = useCallback(async (sessionId: number) => {
    const { selectedSession: session, selectedEvent: event } = contextRef.current;
    if (!session || !event) return;

    try {
      const sessionHistory = await fetchSessionHistory(event.id, sessionId, event.date);
      if (sessionHistory) {
        setHistory(historyFromSessionData(sessionHistory, sessionId, session.members));
        setHistoryAvailable(true);
      } else {
        setHistory(new Map());
        setHistoryAvailable(false);
      }
    } catch (err) {
      console.error('Failed to load session history:', err);
      setHistory(new Map());
      setHistoryAvailable(false);
    }
  }, []);

  const refreshWaitingRooms = useCallback(async (sessionId?: number) => {
    const { selectedSession: session } = contextRef.current;
    const targetSessionId = sessionId ?? session?.id;
    if (!targetSessionId) return;

    try {
      const wr = await fetchWaitingRooms(targetSessionId);

      if (wr.message) {
        setNotice(wr.message);
      } else {
        setNotice(null);
      }

      setWaitingRooms(wr.waitingRooms);

      const thisRoom = wr.waitingRooms.get(targetSessionId) || [];
      const total = thisRoom.reduce((sum, room) => sum + room.peopleCount, 0);
      setParticipant(total);

      setLastUpdate(new Date());
      setNextRefreshTime(new Date(Date.now() + REFRESH_INTERVAL * 1000));
      setRefreshCountdown(REFRESH_INTERVAL);
    } catch (err) {
      console.error('Failed to refresh waiting rooms:', err);
    }
  }, []);

  const refreshAll = useCallback(async (sessionId?: number) => {
    const targetSessionId = sessionId ?? contextRef.current.selectedSession?.id;
    if (!targetSessionId) return;
    await Promise.all([
      refreshWaitingRooms(targetSessionId),
      loadSessionHistory(targetSessionId),
    ]);
  }, [refreshWaitingRooms, loadSessionHistory]);

  const sessionId = selectedSession?.id;
  const eventId = selectedEvent?.id;
  const eventDateKey =
    selectedEvent?.date && isValid(selectedEvent.date)
      ? selectedEvent.date.toISOString()
      : null;

  // Live waiting rooms from FortuneMusic API when session changes
  useEffect(() => {
    if (!sessionId || loading) return;
    refreshWaitingRooms(sessionId);
  }, [sessionId, loading, refreshWaitingRooms]);

  // Sparkline history from assets when session or event date changes
  useEffect(() => {
    if (!sessionId || !eventId || !eventDateKey || loading) return;
    setHistory(new Map());
    setHistoryAvailable(null);
    loadSessionHistory(sessionId);
  }, [sessionId, eventId, eventDateKey, loading, loadSessionHistory]);

  // Auto-refresh: live counts from API, curves from assets
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now >= nextRefreshTime && !loading) {
        refreshAll();
      } else {
        const remaining = Math.max(0, Math.ceil((nextRefreshTime.getTime() - now.getTime()) / 1000));
        setRefreshCountdown(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextRefreshTime, loading, refreshAll]);

  return {
    waitingRooms,
    history,
    historyAvailable,
    participant,
    notice,
    lastUpdate,
    refreshCountdown,
    refreshWaitingRooms: refreshAll,
  };
}
