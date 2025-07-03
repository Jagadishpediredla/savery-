'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
    title: string;
    amount: number;
    progress: number;
    icon: React.ReactNode;
    color: string;
}

export function DashboardStatCard({ title, amount, progress, icon, color }: DashboardStatCardProps) {
    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className={cn("p-2 rounded-lg", color)}>
                        {icon}
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">{title}</p>
                    <p className="font-bold text-xl">₹{amount.toLocaleString()}</p>
                </div>
                <Progress value={progress} className="h-2" />
            </CardContent>
        </Card>
    );
}
