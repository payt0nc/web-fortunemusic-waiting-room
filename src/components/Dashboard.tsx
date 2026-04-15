import { useState, useCallback, useRef, useEffect } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { useWaitingRooms } from '@/hooks/useWaitingRooms';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Sidebar } from './Sidebar';
import { EventCard } from './EventCard';
import { SessionSelector } from './SessionSelector';
import { StatsBar } from './StatsBar';
import { WaitingRoomGrid } from './WaitingRoomGrid';
import { Menu, X } from 'lucide-react';

const MIN_SIDEBAR_WIDTH = 240;
const MAX_SIDEBAR_WIDTH = 600;
const DEFAULT_SIDEBAR_WIDTH = 300;

export function Dashboard() {
  const isMobile = useIsMobile();
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDragging = useRef(false);

  const handleDragStart = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMove = (clientX: number) => {
      if (!isDragging.current) return;
      const newWidth = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, clientX));
      setSidebarWidth(newWidth);
    };

    const handleEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', handleEnd);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isMobile]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, sidebarOpen]);

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

  const handleEventSelectMobile = useCallback((uniqueId: string) => {
    handleEventSelect(uniqueId);
    if (isMobile) setSidebarOpen(false);
  }, [handleEventSelect, isMobile]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile: overlay sidebar + backdrop */}
      {isMobile && (
        <>
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            <Sidebar
              events={events}
              activeEventId={selectedEvent?.uniqueId}
              onEventSelect={handleEventSelectMobile}
              width={280}
            />
          </div>
        </>
      )}

      {/* Desktop: original sidebar + resize handle */}
      {!isMobile && (
        <>
          <Sidebar
            events={events}
            activeEventId={selectedEvent?.uniqueId}
            onEventSelect={handleEventSelect}
            width={sidebarWidth}
          />
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="shrink-0 w-1 cursor-col-resize bg-border hover:bg-accent/25 active:bg-accent/40 transition-colors"
          />
        </>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center overflow-y-auto bg-bg-primary">
        {/* Mobile top bar */}
        {isMobile && (
          <div className="sticky top-0 z-30 flex items-center w-full px-4 py-3 bg-bg-secondary border-b border-border">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="flex items-center justify-center w-11 h-11 rounded-lg bg-bg-card border border-border"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} className="text-text-primary" /> : <Menu size={20} className="text-text-primary" />}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-4 lg:mx-8 mt-4 lg:mt-8 p-4 rounded-lg bg-error-bg border border-error text-error">
            <p className="font-semibold">Error loading events:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mx-4 lg:mx-8 mt-4 lg:mt-8 p-4">
            <p className="text-text-muted">Loading events...</p>
          </div>
        )}

        {/* Notice */}
        {notice && (
          <div className="mx-4 lg:mx-8 mt-4 lg:mt-6 p-3 rounded-lg text-sm bg-active-bg border border-accent/25 text-accent">
            {notice}
          </div>
        )}

        {/* Event Card */}
        <div className="px-4 lg:px-12 pt-4 lg:pt-8 w-full max-w-[1100px]">
          <EventCard
            name={selectedEvent?.name || ''}
            date={selectedEvent?.date}
          />
        </div>

        {/* Grid Section */}
        <div className="flex-1 flex flex-col items-center gap-3 lg:gap-4 px-3 lg:px-8 py-4 lg:py-6 mt-3 lg:mt-6 w-full max-w-[1100px]">
          {/* Session + Stats row */}
          <div className="flex flex-col-reverse lg:flex-row items-center lg:justify-between gap-2 w-full max-w-[1030px]">
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
