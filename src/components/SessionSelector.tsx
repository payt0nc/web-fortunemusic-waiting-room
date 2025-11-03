import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Session } from '@/api/fortunemusic/events';

interface SessionSelectorProps {
  id: number | null;
  sessions: Map<number, Session>;
  onEventSelect: (eventId: number) => void;
}

export function SessionSelector({
  id,
  sessions,
  onEventSelect,
}: SessionSelectorProps) {
  const getDisplayName = (sessionID: number) => {
    return sessions.get(sessionID)?.sessionName || "Unknown Session";
  };

  if (sessions.size === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Select Session</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {Array.from(sessions.entries()).map(([sessionID]) => (
            <label
              key={sessionID}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all min-w-[180px] ${id === sessionID
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-border hover:bg-accent hover:text-accent-foreground'
                }`}
            >
              <input
                type="radio"
                name="selectedSession"
                value={sessionID}
                checked={id === sessionID}
                onChange={() => onEventSelect(sessionID)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${id === sessionID
                ? 'bg-primary border-primary'
                : 'border-border'
                }`}>
                {id === sessionID && (
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{getDisplayName(sessionID)}</div>
              </div>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}