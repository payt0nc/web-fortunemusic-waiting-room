import { Calendar, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  name: string;
  date: Date | undefined;
}

function formatEventDate(date: Date): string {
  return format(date, "yyyy.MM.dd '('EEE')'");
}

export function EventCard({ name, date }: EventCardProps) {
  return (
    <div className="rounded-2xl p-4 lg:p-6 bg-bg-card border border-border">
      <div className="flex flex-col gap-1.5">
        {/* Date row */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-text-muted" />
          <span className="text-sm font-medium font-mono text-text-muted">
            {date ? formatEventDate(date) : '---'}
          </span>
        </div>

        {/* Event name row */}
        <div className="flex items-center gap-3">
          <span
            className="text-lg lg:text-heading font-bold font-mono bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent"
          >
            {name || '---'}
          </span>
        </div>
      </div>
    </div>
  );
}
