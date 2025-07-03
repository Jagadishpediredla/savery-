
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

const chartData = [
  { day: "Mon", tickets: 120 },
  { day: "Tue", tickets: 180 },
  { day: "Wed", tickets: 220 },
  { day: "Thu", tickets: 250 },
  { day: "Fri", tickets: 300 },
  { day: "Sat", tickets: 150 },
  { day: "Sun", tickets: 90 },
];

const chartConfig = {
  tickets: {
    label: "Tickets",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function TicketsByDayChart() {
    return (
        <Card className="bg-card/60 backdrop-blur-lg">
            <CardHeader>
                <CardTitle>Tickets by Weekday</CardTitle>
                <CardDescription>Volume of new tickets on each day of the week.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                stroke="hsl(var(--muted-foreground))"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                stroke="hsl(var(--muted-foreground))"
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar dataKey="tickets" fill="var(--color-tickets)" radius={8} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
