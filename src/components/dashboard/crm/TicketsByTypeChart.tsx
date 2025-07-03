
'use client';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const data = [
  { name: 'Sales', value: 400, fill: 'var(--color-Sales)' },
  { name: 'Setup', value: 300, fill: 'var(--color-Setup)' },
  { name: 'Bug', value: 200, fill: 'var(--color-Bug)' },
  { name: 'Features', value: 278, fill: 'var(--color-Features)' },
];

const chartConfig = {
  Sales: { label: 'Sales', color: 'hsl(var(--chart-1))' },
  Setup: { label: 'Setup', color: 'hsl(var(--chart-2))' },
  Bug: { label: 'Bug', color: 'hsl(var(--chart-3))' },
  Features: { label: 'Features', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

export function TicketsByTypeChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tickets By Type</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent indicator="dot" nameKey="name" />}
                        />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            strokeWidth={2}
                        >
                            {data.map((entry) => (
                                <Cell key={entry.name} fill={entry.fill} stroke={entry.fill} />
                            ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent iconType="circle" />} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
