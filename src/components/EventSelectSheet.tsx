import { Button } from "@/components/ui/button"
import type { Event } from "@/api/fortunemusic/events"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Calendar } from "lucide-react"

interface EventSelectSheetProps {
    events: Map<number, Event>;
}

function groupEventsByDate(events: Map<number, Event>): Map<string, Event[]> {
    const grouped = new Map<string, Event[]>();

    // Convert to array and sort by date
    const sortedEvents = Array.from(events.values()).sort((a, b) =>
        a.date.getTime() - b.date.getTime()
    );

    // Group sorted events by date
    sortedEvents.forEach((event) => {
        const date = event.date.toDateString();
        if (!grouped.has(date)) {
            grouped.set(date, []);
        }
        grouped.get(date)!.push(event);
    });

    return grouped;
}

export default function EventSelectSheet({ events }: EventSelectSheetProps) {
    const groupedEvents = groupEventsByDate(events);
    return (
        <div className="flex justify-start w-full mb-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="lg" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Select Event
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-md">
                    <SheetHeader className="space-y-2">
                        <SheetTitle className="text-2xl">Select an Event</SheetTitle>
                        <SheetDescription>
                            Choose from upcoming events to view waiting room information
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-8 space-y-6">
                        {Array.from(groupedEvents.entries()).map(([date, events]) => (
                            <div key={date} className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground border-b pb-2">
                                    <Calendar className="h-4 w-4" />
                                    {date}
                                </div>
                                <div className="space-y-2 pl-2">
                                    {events.map((event) => (
                                        <button
                                            key={event.id}
                                            className="w-full flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all text-left group"
                                        >
                                            <div className="mt-1 flex-shrink-0">
                                                <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-125 transition-transform"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                    {event.name}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                    {event.artistName}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}