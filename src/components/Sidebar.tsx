import { useState } from 'react';
import { Monitor, ChevronDown, ChevronRight, Calendar } from 'lucide-react';
import type { Event } from '@/api/fortunemusic/events';
import { format } from 'date-fns';

interface DateGroup {
  dateKey: string;
  dateLabel: string;
  events: Event[];
}

interface ArtistGroup {
  artistName: string;
  dateGroups: DateGroup[];
  totalEvents: number;
  colorClass: string;
  colorVar: string;
}

const artistOrder = ['乃木坂46', '櫻坂46', '日向坂46', '=LOVE'];

const artistStyleMap: Record<string, { colorClass: string; colorVar: string }> = {
  '乃木坂46': { colorClass: 'text-artist-nogi', colorVar: 'var(--artist-nogi)' },
  '櫻坂46':   { colorClass: 'text-artist-sakura', colorVar: 'var(--artist-sakura)' },
  '日向坂46': { colorClass: 'text-artist-hinata', colorVar: 'var(--artist-hinata)' },
};

const defaultArtistStyle = { colorClass: 'text-text-muted', colorVar: 'var(--text-muted)' };

function groupEventsByArtistAndDate(events: Map<number, Event[]>): ArtistGroup[] {
  const artistMap = new Map<string, Event[]>();

  events.forEach((eventList) => {
    eventList.forEach((event) => {
      const existing = artistMap.get(event.artistName) || [];
      existing.push(event);
      artistMap.set(event.artistName, existing);
    });
  });

  const result: ArtistGroup[] = [];

  artistMap.forEach((eventList, artistName) => {
    eventList.sort((a, b) => a.date.getTime() - b.date.getTime());

    const dateMap = new Map<string, Event[]>();
    eventList.forEach((event) => {
      const dateKey = format(event.date, 'yyyy-MM-dd');
      const existing = dateMap.get(dateKey) || [];
      existing.push(event);
      dateMap.set(dateKey, existing);
    });

    const dateGroups: DateGroup[] = [];
    dateMap.forEach((evts, dateKey) => {
      dateGroups.push({
        dateKey,
        dateLabel: format(evts[0].date, 'MM-dd (EEE)'),
        events: evts,
      });
    });

    const styles = artistStyleMap[artistName] || defaultArtistStyle;

    result.push({
      artistName,
      dateGroups,
      totalEvents: eventList.length,
      colorClass: styles.colorClass,
      colorVar: styles.colorVar,
    });
  });

  result.sort((a, b) => {
    return artistOrder.indexOf(a.artistName) - artistOrder.indexOf(b.artistName);
  });

  return result;
}

interface SidebarProps {
  events: Map<number, Event[]>;
  activeEventId: string | undefined;
  onEventSelect: (uniqueId: string) => void;
  width: number;
}

export function Sidebar({ events, activeEventId, onEventSelect, width }: SidebarProps) {
  const artistGroups = groupEventsByArtistAndDate(events);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleGroup = (artistName: string) => {
    setExpanded((prev) => ({ ...prev, [artistName]: !prev[artistName] }));
  };

  return (
    <aside
      className="flex flex-col h-full shrink-0 bg-bg-secondary"
      style={{ width }}
    >
      {/* Header */}
      <div className="flex flex-col gap-1 px-4 py-4 pb-3">
        <div className="flex items-center gap-2">
          <Monitor size={20} className="text-accent" />
          <span className="text-text-primary text-sm font-bold">
            46◢ Online Meet
          </span>
        </div>
        <span className="text-sm text-text-subtitle">
          Waiting Room Dashboard
        </span>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-border" />

      {/* Scrollable event list */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden">
        {artistGroups.map((group, groupIndex) => {
          const isExpanded = !!expanded[group.artistName];

          return (
            <div key={group.artistName} className="flex flex-col">
              {/* Artist group header */}
              <button
                onClick={() => toggleGroup(group.artistName)}
                className={`flex items-center gap-2 h-11 lg:h-9 px-3 cursor-pointer transition-colors hover:opacity-80 ${group.colorClass}`}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="text-sm font-semibold">
                  {group.artistName}
                </span>
                {group.totalEvents > 0 && (
                  <span
                    className="text-sm font-medium rounded-full px-1.5 py-0.5"
                    style={{ backgroundColor: `color-mix(in srgb, ${group.colorVar} 12%, transparent)` }}
                  >
                    {group.totalEvents}
                  </span>
                )}
              </button>

              {/* Date groups (collapsible) */}
              {isExpanded && (
                <div className="flex flex-col pb-1 pl-4">
                  {group.dateGroups.map((dateGroup) => (
                    <div key={dateGroup.dateKey} className="flex flex-col">
                      {/* Date sub-header */}
                      <div className="flex items-center gap-1.5 h-9 lg:h-7 px-3">
                        <Calendar size={10} className="text-text-subtitle" />
                        <span className="text-sm font-medium font-mono text-text-subtitle">
                          {dateGroup.dateLabel}
                        </span>
                      </div>

                      {/* Events for this date */}
                      {dateGroup.events.map((event) => {
                        const isActive = event.uniqueId === activeEventId;
                        return (
                          <button
                            key={event.uniqueId}
                            onClick={() => onEventSelect(event.uniqueId)}
                            className={`flex items-center gap-2 h-11 lg:h-9 px-3 text-left transition-colors cursor-pointer overflow-hidden border-l-2 ${
                              isActive
                                ? 'bg-active-bg border-l-active-border text-accent'
                                : 'border-l-transparent text-text-muted'
                            }`}
                          >
                            <div
                              className={`w-1 h-1 rounded-full shrink-0 ${
                                isActive ? 'bg-accent' : 'bg-text-muted'
                              }`}
                            />
                            <span className="text-sm truncate">
                              {event.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* Divider between groups */}
              {groupIndex < artistGroups.length - 1 && (
                <div className="h-px w-full bg-border" />
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
