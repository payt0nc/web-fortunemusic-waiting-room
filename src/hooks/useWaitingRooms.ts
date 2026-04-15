import { useState, useEffect, useCallback } from 'react';
import { fetchWaitingRooms, type WaitingRoom } from '@/api/fortunemusic/waitingRooms';
import type { Session } from '@/api/fortunemusic/events';

const REFRESH_INTERVAL = 10; // seconds

export function useWaitingRooms(selectedSession: Session | null, loading: boolean) {
  const [waitingRooms, setWaitingRooms] = useState<Map<number, WaitingRoom[]>>(new Map());
  const [participant, setParticipant] = useState<number>(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [nextRefreshTime, setNextRefreshTime] = useState<Date>(new Date(Date.now() + REFRESH_INTERVAL * 1000));
  const [refreshCountdown, setRefreshCountdown] = useState<number>(REFRESH_INTERVAL);

  const refreshWaitingRooms = useCallback(async (sessionId?: number) => {
    const targetSessionId = sessionId || selectedSession?.id;
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
  }, [selectedSession?.id]);

  // Fetch when session changes
  useEffect(() => {
    if (selectedSession && !loading) {
      refreshWaitingRooms(selectedSession.id);
    }
  }, [selectedSession?.id, loading]);

  // Auto-refresh countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now >= nextRefreshTime && !loading) {
        refreshWaitingRooms();
      } else {
        const remaining = Math.max(0, Math.ceil((nextRefreshTime.getTime() - now.getTime()) / 1000));
        setRefreshCountdown(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextRefreshTime, loading, refreshWaitingRooms]);

  return {
    waitingRooms,
    participant,
    notice,
    lastUpdate,
    refreshCountdown,
    refreshWaitingRooms,
  };
}
