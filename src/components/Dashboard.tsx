import { useState, useCallback, useRef, useEffect } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useWaitingRooms } from '@/hooks/useWaitingRooms';
import { Sidebar } from './Sidebar';
import { EventCard } from './EventCard';
import { SessionSelector } from './SessionSelector';
import { StatsBar } from './StatsBar';
import { WaitingRoomGrid } from './WaitingRoomGrid';

const MIN_SIDEBAR_WIDTH = 240;
const MAX_SIDEBAR_WIDTH = 600;
const DEFAULT_SIDEBAR_WIDTH = 400;

export function Dashboard() {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newWidth = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const {
    loading,
    error,
    events,
    selectedEvent,
    sessions,
    selectedSession,
    members,
    handleEventSelect,
    handleSessionSelect,
  } = useEvents();

  const {
    waitingRooms,
    participant,
    notice,
    refreshCountdown,
  } = useWaitingRooms(selectedSession, loading);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        events={events}
        activeEventId={selectedEvent?.uniqueId}
        onEventSelect={handleEventSelect}
        width={sidebarWidth}
      />

      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className="shrink-0 w-1 cursor-col-resize bg-border hover:bg-accent/25 active:bg-accent/40 transition-colors"
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center overflow-y-auto bg-bg-primary">
        {/* Error */}
        {error && (
          <div className="mx-8 mt-8 p-4 rounded-lg bg-error-bg border border-error text-error">
            <p className="font-semibold">Error loading events:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mx-8 mt-8 p-4">
            <p className="text-text-muted">Loading events...</p>
          </div>
        )}

        {/* Notice */}
        {notice && (
          <div className="mx-8 mt-6 p-3 rounded-lg text-sm bg-active-bg border border-accent/25 text-accent">
            {notice}
          </div>
        )}

        {/* Event Card */}
        <div className="px-12 pt-8 w-full max-w-[1100px]">
          <EventCard
            name={selectedEvent?.name || ''}
            date={selectedEvent?.date}
          />
        </div>

        {/* Grid Section */}
        <div className="flex-1 flex flex-col items-center gap-4 px-8 py-6 mt-6 w-full max-w-[1100px]">
          {/* Session + Stats row */}
          <div className="flex items-center justify-between gap-2 flex-wrap w-full max-w-[1030px]">
            <SessionSelector
              id={selectedSession?.id || null}
              sessions={sessions}
              onSessionSelect={handleSessionSelect}
            />
            <StatsBar
              session={selectedSession}
              participant={participant}
              refreshCountdown={refreshCountdown}
            />
          </div>

          {/* Waiting Room Grid */}
          <WaitingRoomGrid
            currentSessionID={selectedSession?.id || 0}
            waitingRooms={waitingRooms}
            members={members}
          />
        </div>
      </main>
    </div>
  );
}
