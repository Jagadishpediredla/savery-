
'use client';

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";

const chartData = [
    { type: "New", count: 1850, fill: "var(--color-new)" },
    { type: "Returned", count: 890, fill: "var(--color-returned)" },
];

const chartConfig = {
    count: {
        label: "Customers",
    },
    new: {
        label: "New",
        color: "hsl(var(--chart-1))",
    },
    returned: {
        label: "Returned",
        color: "hsl(var(--chart-2))",
    }
} satisfies ChartConfig;

export function NewVsReturnedChart() {
    return (
        <Card className="bg-card/60 backdrop-blur-lg flex flex-col h-full">
            <CardHeader>
                <CardTitle>New vs. Returned</CardTitle>
                <CardDescription>Customer ticket submission status.</CardDescription>
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
