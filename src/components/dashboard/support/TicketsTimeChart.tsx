
'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";

const chartData = [
  { month: "January", replyTime: 186, resolveTime: 80 },
  { month: "February", replyTime: 305, resolveTime: 200 },
  { month: "March", replyTime: 237, resolveTime: 120 },
  { month: "April", replyTime: 73, resolveTime: 190 },
  { month: "May", replyTime: 209, resolveTime: 130 },
  { month: "June", replyTime: 214, resolveTime: 140 },
]

const chartConfig = {
  replyTime: {
    label: "First Reply Time (min)",
    color: "hsl(var(--primary))",
  },
  resolveTime: {
    label: "Full Resolve Time (min)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function TicketsTimeChart() {
    return (
        <Card className="bg-card/60 backdrop-blur-lg">
            <CardHeader>
                <CardTitle>First Reply and Full Resolve Time</CardTitle>
                <CardDescription>Average time in minutes for ticket responses and resolutions.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                                stroke="hsl(var(--muted-foreground))"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                stroke="hsl(var(--muted-foreground))"
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                             <ChartLegend content={<ChartLegendContent />} />
                            <defs>
                                <linearGradient id="fillReplyTime" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-replyTime)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-replyTime)" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillResolveTime" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-resolveTime)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-resolveTime)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <Area
                                dataKey="resolveTime"
                                type="natural"
                                fill="url(#fillResolveTime)"
                                stroke="var(--color-resolveTime)"
                                stackId="1"
                            />
                            <Area
                                dataKey="replyTime"
                                type="natural"
                                fill="url(#fillReplyTime)"
                                stroke="var(--color-replyTime)"
                                stackId="1"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
