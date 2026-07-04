import type { Session } from '@/api/fortunemusic/events';

interface SessionSelectorProps {
  id: number | null;
  sessions: Map<number, Session>;
  onSessionSelect: (sessionId: number) => void;
}

export function SessionSelector({ id, sessions, onSessionSelect }: SessionSelectorProps) {
  if (sessions.size === 0) return null;

  return (
    <div
      className="flex items-center gap-1.5 flex-wrap rounded-xl lg:rounded-full px-2.5 py-1.5 lg:py-1 bg-badge-accent"
      role="group"
      aria-label="Session selector"
    >
      {Array.from(sessions.entries()).map(([sessionId, session]) => {
        const isActive = id === sessionId;
        return (
          <button
            key={sessionId}
            onClick={() => onSessionSelect(sessionId)}
            aria-pressed={isActive}
            className={`inline-flex items-center justify-center min-h-11 lg:min-h-9 rounded-full px-3 py-1.5 lg:px-3.5 lg:py-1 text-sm font-semibold transition-colors cursor-pointer ${
              isActive
                ? 'bg-accent text-bg-primary'
                : 'bg-badge-accent text-accent'
            }`}
          >
            {session.sessionName}
          </button>
        );
      })}
    </div>
  );
}
