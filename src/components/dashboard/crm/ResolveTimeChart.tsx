
'use client';
import { AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const data = [
  { name: 'Jan', time: 2.5 },
  { name: 'Feb', time: 3.1 },
  { name: 'Mar', time: 2.8 },
  { name: 'Apr', time: 3.5 },
  { name: 'May', time: 2.9 },
  { name: 'Jun', time: 3.2 },
  { name: 'Jul', time: 2.7 },
];

const chartConfig = {
    time: {
        label: "Time (hours)",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function ResolveTimeChart() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>First Reply and Full Resolve Time</CardTitle>
                </div>
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="h-48 pb-0">
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-time)" stopOpacity={0.6}/>
                                <stop offset="95%" stopColor="var(--color-time)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <ChartTooltip
                            content={<ChartTooltipContent indicator="dot" formatter={(value) => `${value} hours`} />}
                        />
                        <Area type="monotone" dataKey="time" stroke="var(--color-time)" fillOpacity={1} fill="url(#colorTime)" strokeWidth={2} />
                    </AreaChart>
                </ChartContainer>
                 <div className="text-center text-sm text-muted-foreground mt-4">
                    <Button variant="link" className="text-muted-foreground">View full statement</Button>
                </div>
            </CardContent>
        </Card>
    )
}
