
'use client';

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";

const chartData = [
    { type: "Bug", count: 250, fill: "var(--color-bug)" },
    { type: "Feature", count: 100, fill: "var(--color-feature)" },
    { type: "Question", count: 150, fill: "var(--color-question)" },
    { type: "Other", count: 50, fill: "var(--color-other)" },
];

const chartConfig = {
    count: {
        label: "Tickets",
    },
    bug: {
        label: "Bug",
        color: "hsl(var(--chart-1))",
    },
    feature: {
        label: "Feature Request",
        color: "hsl(var(--chart-2))",
    },
    question: {
        label: "Question",
        color: "hsl(var(--chart-3))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig;

export function TicketsByTypeChart() {
    return (
        <Card className="bg-card/60 backdrop-blur-lg flex flex-col h-full">
            <CardHeader>
                <CardTitle>Tickets by Type</CardTitle>
                <CardDescription>Distribution of ticket categories.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <ChartTooltip
                                cursor={true}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="count"
                                nameKey="type"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                 {chartData.map((entry) => (
                                    <Cell key={entry.type} fill={entry.fill} />
                                ))}
                            </Pie>
                            <ChartLegend
                                content={<ChartLegendContent nameKey="type" />}
                                className="-translate-y-2 flex-wrap gap-2 [&>*]:justify-center"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
