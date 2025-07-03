
'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const data = [
  { name: 'Mon', tickets: 32 },
  { name: 'Tue', tickets: 12 },
  { name: 'Wed', tickets: 45 },
  { name: 'Thu', tickets: 28 },
  { name: 'Fri', tickets: 51 },
  { name: 'Sat', tickets: 35 },
];

const chartConfig = {
    tickets: {
        label: "Tickets",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function TicketsByDayChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Number of Tickets / Week Day</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                             <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-tickets)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-tickets)" stopOpacity={0.2}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                         <ChartTooltip
                            cursor={{fill: 'hsl(var(--muted) / 0.3)'}}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="tickets" fill="url(#colorTickets)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
