'use client';

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { useMemo } from "react";
import type { Transaction } from "@/lib/types";
import { subDays, isWithinInterval, parseISO } from 'date-fns';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

interface SpendingByCategoryChartProps {
    transactions: Transaction[];
}

export function SpendingByCategoryChart({ transactions }: SpendingByCategoryChartProps) {
    const { chartData, chartConfig } = useMemo(() => {
        const categoryMap = new Map<string, number>();
        const thirtyDaysAgo = subDays(new Date(), 30);
        const now = new Date();

        transactions.forEach(t => {
            const txDate = parseISO(t.date);
            if (t.type === 'Debit' && isWithinInterval(txDate, { start: thirtyDaysAgo, end: now })) {
                const currentAmount = categoryMap.get(t.category) || 0;
                categoryMap.set(t.category, currentAmount + t.amount);
            }
        });

        const sortedCategories = Array.from(categoryMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // top 5 categories

        const chartConfig: ChartConfig = {};
        const chartData = sortedCategories.map(([name, value], index) => {
            const sanitizedName = name.replace(/\s/g, '').toLowerCase();
            chartConfig[sanitizedName] = { label: name, color: COLORS[index % COLORS.length] };
            return {
                category: name,
                amount: value,
                fill: `var(--color-${sanitizedName})`,
            }
        });

        return { chartData, chartConfig };
    }, [transactions]);
    
    if (chartData.length === 0) {
        return <div className="flex h-80 w-full items-center justify-center text-muted-foreground">No spending data for last 30 days.</div>;
    }

    return (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <ChartTooltip
                        cursor={true}
                        content={<ChartTooltipContent formatter={(value) => `₹${Number(value).toLocaleString()}`} nameKey="category" />}
                    />
                    <Pie
                        data={chartData}
                        dataKey="amount"
                        nameKey="category"
                        innerRadius={60}
                        strokeWidth={5}
                        paddingAngle={5}
                    >
                         {chartData.map((entry) => (
                            <Cell key={entry.category} fill={entry.fill} />
                        ))}
                    </Pie>
                    <ChartLegend
                        content={<ChartLegendContent nameKey="category" />}
                        className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/2 [&>*]:justify-center"
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
