
'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";

const chartData = [
    { month: 'Jan', created: 186, solved: 80 },
    { month: 'Feb', created: 305, solved: 200 },
    { month: 'Mar', created: 237, solved: 120 },
    { month: 'Apr', created: 273, solved: 190 },
    { month: 'May', created: 209, solved: 130 },
    { month: 'Jun', created: 214, solved: 140 },
];

const chartConfig = {
    created: {
        label: "Created",
        color: "hsl(var(--chart-2))",
    },
    solved: {
        label: "Solved",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export function TicketsCreatedChart() {
    return (
        <Card className="bg-card/60 backdrop-blur-lg">
            <CardHeader>
                <CardTitle>Tickets Created vs. Solved</CardTitle>
                <CardDescription>A monthly comparison of new and resolved tickets.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
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
                                cursor={true}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Line
                                dataKey="created"
                                type="monotone"
                                stroke="var(--color-created)"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                dataKey="solved"
                                type="monotone"
                                stroke="var(--color-solved)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
