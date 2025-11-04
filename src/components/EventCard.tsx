import { Card } from '@/components/ui/card';
import { ShimmeringText } from "@/components/ui/shadcn-io/shimmering-text";

interface EventCardProps {
    name: string;
    date: string;
}

export function EventCard({ name, date }: EventCardProps) {
    return (
        <Card>
            <div className="flex flex-col items-start justify-center gap-2 p-6 text-left">
                <div className="text-left">
                    <ShimmeringText
                        text={name}
                        duration={2}
                        wave={true}
                        shimmeringColor="hsl(var(--primary))"
                    />
                </div>
                <div className="text-left text-muted-foreground">
                    <ShimmeringText
                        text={date}
                        duration={2}
                        wave={false}
                        shimmeringColor="hsl(var(--primary))"
                    />
                </div>
            </div>
        </Card>
    );
}