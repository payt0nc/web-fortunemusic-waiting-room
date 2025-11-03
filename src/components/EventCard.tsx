import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event } from '@/api/fortunemusic/events';


interface EventCardProps {
    name: string;
    date: string;
}

export function EventCard({ name, date }: EventCardProps) {
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardContent>
                    <p>{date}</p>
                </CardContent>
            </CardHeader>
        </Card>
    );
}