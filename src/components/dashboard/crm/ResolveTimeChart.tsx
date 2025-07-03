
'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { ChartTooltipContent } from '@/components/ui/chart';

const data = [
  { name: 'Jan', time: 2.5 },
  { name: 'Feb', time: 3.1 },
  { name: 'Mar', time: 2.8 },
  { name: 'Apr', time: 3.5 },
  { name: 'May', time: 2.9 },
  { name: 'Jun', time: 3.2 },
  { name: 'Jul', time: 2.7 },
];

export function ResolveTimeChart() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>First Reply and Full Resolve Time</CardTitle>
                </div>
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.6}/>
                                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip
                            content={<ChartTooltipContent indicator="dot" formatter={(value) => `${value} hours`} />}
                        />
                        <Area type="monotone" dataKey="time" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorTime)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
                 <div className="text-center text-sm text-muted-foreground mt-4">
                    <Button variant="link" className="text-muted-foreground">View full statement</Button>
                </div>
            </CardContent>
        </Card>
    )
}
