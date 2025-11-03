import React from "react"
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
    events: Map<number, Event[]>;
    onEventSelect?: (event: Event) => void;
}


export default function EventSelectSheet({ events, onEventSelect }: EventSelectSheetProps) {
    const groupedEvents = events.entries().reduce((acc, [_, eventMap]) => {
        eventMap.forEach((event) => {
            const eventDate = new Date(event.date);
            const dateString = eventDate.toDateString();
            if (!acc.has(dateString)) {
                acc.set(dateString, { date: eventDate, events: [] });
            }
            acc.get(dateString)!.events.push(event);
        });
        return acc;
    }, new Map<string, { date: Date; events: Event[] }>());

    // Sort dates chronologically
    const sortedDateEntries = Array.from(groupedEvents.entries()).sort(([_a, groupA], [_b, groupB]) => {
        return groupA.date.getTime() - groupB.date.getTime();
    });

    const [open, setOpen] = React.useState(false);

    const handleEventClick = (event: Event) => {
        onEventSelect?.(event);
        setOpen(false);
    };

    return (
        <div className="flex justify-start w-full mb-6">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="lg" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Select Event
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-md flex flex-col">
                    <SheetHeader className="space-y-2 flex-shrink-0">
                        <SheetTitle className="text-2xl">Select an Event</SheetTitle>
                        <SheetDescription>
                            Choose from upcoming events to view waiting room information
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-8 space-y-6 overflow-y-auto flex-1 pr-2">
                        {sortedDateEntries.map(([dateString, { events }]) => (
                            <div key={dateString} className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground border-b pb-2">
                                    <Calendar className="h-4 w-4" />
                                    {dateString}
                                </div>
                                <div className="space-y-2 pl-2">
                                    {events.map((event) => (
                                        <button
                                            key={event.id}
                                            onClick={() => handleEventClick(event)}
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