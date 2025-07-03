
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CountUp from 'react-countup';

interface DashboardStatCardProps {
    title: string;
    amount: number;
    icon: React.ReactNode;
    color: string;
}

export function DashboardStatCard({ title, amount, icon, color }: DashboardStatCardProps) {
    return (
        <Card className="bg-card/60 backdrop-blur-lg">
            <CardContent className="p-4 flex items-center gap-4">
                <div className={cn("p-3 rounded-lg", color)}>
                    {icon}
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">{title}</p>
                    <p className="font-bold text-xl">
                        <CountUp
                            start={0}
                            end={amount}
                            duration={1.5}
                            separator=","
                            prefix="₹"
                        />
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
