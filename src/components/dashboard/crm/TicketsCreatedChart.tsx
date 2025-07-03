
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const data = [
  { name: 'Jan', created: 35, solved: 28 },
  { name: 'Feb', created: 42, solved: 33 },
  { name: 'Mar', created: 55, solved: 40 },
  { name: 'Apr', created: 68, solved: 51 },
  { name: 'May', created: 60, solved: 55 },
  { name: 'Jun', created: 72, solved: 60 },
  { name: 'Jul', created: 65, solved: 58 },
];

const chartConfig = {
    created: {
        label: "Tickets Created",
        color: "hsl(var(--muted-foreground))",
    },
    solved: {
        label: "Tickets Solved",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function TicketsCreatedChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tickets Created vs Tickets Solved</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <ChartTooltip
                             content={<ChartTooltipContent indicator="dot" />}
                        />
                        <ChartLegend content={<ChartLegendContent iconType="circle" />} />
                        <Line type="monotone" dataKey="solved" stroke="var(--color-solved)" strokeWidth={2} name="Tickets Solved" dot={false} />
                        <Line type="monotone" dataKey="created" stroke="var(--color-created)" strokeWidth={2} strokeDasharray="5 5" name="Tickets Created" dot={false} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
