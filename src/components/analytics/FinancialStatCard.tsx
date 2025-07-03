'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CountUp from 'react-countup';

interface FinancialStatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    formatAsCurrency?: boolean;
    suffix?: string;
    description?: string;
}

export function FinancialStatCard({ title, value, icon, formatAsCurrency = false, suffix, description }: FinancialStatCardProps) {
    return (
        <Card className="bg-card/60 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    <CountUp
                        start={0}
                        end={value}
                        duration={1.5}
                        separator=","
                        prefix={formatAsCurrency ? '₹' : ''}
                        suffix={suffix}
                        decimals={2}
                    />
                </div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    );
}
