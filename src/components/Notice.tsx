import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function Notice({ message }: { message: string }) {
    return (
        <Card className="mb-4">
            <CardHeader className="pb-3">
                <CardTitle className="text-card-foreground flex items-center gap-2">
                    Notice
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-blue-500">
                    {message}
                </div>
            </CardContent>
        </Card>
    );
}
