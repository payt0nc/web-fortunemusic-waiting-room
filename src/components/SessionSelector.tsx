import type { Session } from '@/api/fortunemusic/events';

interface SessionSelectorProps {
  id: number | null;
  sessions: Map<number, Session>;
  onSessionSelect: (sessionId: number) => void;
}

export function SessionSelector({ id, sessions, onSessionSelect }: SessionSelectorProps) {
  if (sessions.size === 0) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap rounded-full px-2.5 py-1 bg-badge-accent">
      {Array.from(sessions.entries()).map(([sessionId, session]) => {
        const isActive = id === sessionId;
        return (
          <button
            key={sessionId}
            onClick={() => onSessionSelect(sessionId)}
            className={`rounded-full px-2.5 py-0.5 text-sm font-semibold transition-colors cursor-pointer ${
              isActive
                ? 'bg-accent text-text-primary'
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
