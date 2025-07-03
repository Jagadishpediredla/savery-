
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
    const isPositive = change.startsWith('+');

    return (
        <Card className="bg-card/60 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className={cn("text-xs", isPositive ? "text-green-400" : "text-red-400")}>
                    {change} from last month
                </p>
            </CardContent>
        </Card>
    );
}
