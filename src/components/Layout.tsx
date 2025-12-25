import { Outlet, useNavigate, useMatches } from "react-router";
import { Navbar02 } from "./ui/shadcn-io/navbar-02";
import type { Event } from "@/api/fortunemusic/events";
import { deserializeEvents } from "@/lib/serialization";

/**
 * Layout component
 * Provides the navigation structure for all pages
 */
export function Layout() {
  const navigate = useNavigate();
  const matches = useMatches();

  // Get events data from any matching route's loader data
  // This works because child routes include events in their loader data
  const eventsData = matches.reduce((acc, match: any) => {
    if (match.data?.events) {
      return match.data.events;
    }
    return acc;
  }, null);

  // Deserialize events from SSR data
  const events = eventsData ? deserializeEvents(eventsData) : new Map<number, Event[]>();

  // Handle event selection from navbar
  const handleEventSelect = (uniqueId: string) => {
    // Find the event with matching uniqueId
    let foundEvent: Event | null = null;
    let sessionId: number | null = null;

    events.forEach((eventList: Event[]) => {
      const event = eventList.find((e: Event) => e.uniqueId === uniqueId);
      if (event) {
        foundEvent = event;
        // Get first session ID
        const firstSessionKey = event.sessions.keys().next().value;
        if (firstSessionKey !== undefined) {
          const firstSession = event.sessions.get(firstSessionKey);
          if (firstSession) {
            sessionId = firstSession.id;
          }
        }
      }
    });

    // Navigate to the selected event's session
    if (foundEvent && sessionId) {
      navigate(`/events/${foundEvent.uniqueId}/sessions/${sessionId}`);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Navigation Bar */}
      <Navbar02 events={events} onEventSelect={handleEventSelect} />

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <Outlet />
      </div>
    </div>
  );
}
