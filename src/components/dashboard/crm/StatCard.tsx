
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string;
    unit: string;
    value2?: string;
    unit2?: string;
    variant: 'purple' | 'cyan';
}

export function StatCard({ title, value, unit, value2, unit2, variant }: StatCardProps) {
    return (
        <Card className={cn("text-white p-1", variant === 'purple' ? 'bg-gradient-to-br from-primary to-chart-3' : 'bg-gradient-to-br from-chart-2 to-blue-400')}>
            <CardContent className="p-4">
                <p className="text-sm text-white/80">{title}</p>
                <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-4xl font-bold">{value}</p>
                    <p className="text-xl font-semibold">{unit}</p>
                    {value2 && <p className="text-4xl font-bold">{value2}</p>}
                    {unit2 && <p className="text-xl font-semibold">{unit2}</p>}
                </div>
            </CardContent>
        </Card>
    )
}
