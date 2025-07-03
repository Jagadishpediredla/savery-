
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltipContent } from '@/components/ui/chart';

const data = [
  { name: 'Jan', created: 35, solved: 28 },
  { name: 'Feb', created: 42, solved: 33 },
  { name: 'Mar', created: 55, solved: 40 },
  { name: 'Apr', created: 68, solved: 51 },
  { name: 'May', created: 60, solved: 55 },
  { name: 'Jun', created: 72, solved: 60 },
  { name: 'Jul', created: 65, solved: 58 },
];

export function TicketsCreatedChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tickets Created vs Tickets Solved</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                             content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Legend iconType="circle" iconSize={8} />
                        <Line type="monotone" dataKey="solved" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Tickets Solved" dot={false} />
                        <Line type="monotone" dataKey="created" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" name="Tickets Created" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
