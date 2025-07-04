
'use client';

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { useMemo } from "react";
import type { Transaction, BucketType } from "@/lib/types";
import { isSameMonth, parseISO } from 'date-fns';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

interface SpendingByCategoryChartProps {
    transactions: Transaction[];
    displayMonth: Date;
    bucketType?: BucketType; // Optional bucketType
}

export function SpendingByCategoryChart({ transactions, displayMonth, bucketType }: SpendingByCategoryChartProps) {
    const { chartData, chartConfig } = useMemo(() => {
        const categoryMap = new Map<string, number>();

        const monthTransactions = transactions.filter(t => 
            isSameMonth(parseISO(t.date), displayMonth) &&
            (!bucketType || t.bucket === bucketType)
        );

        // For Savings, we want to see income sources (Credits), not expenses (Debits)
        const transactionsToChart = bucketType === 'Savings'
            ? monthTransactions.filter(t => t.type === 'Credit')
            : monthTransactions.filter(t => t.type === 'Debit');

        transactionsToChart.forEach(t => {
            const category = t.category || 'Other';
            const currentAmount = categoryMap.get(category) || 0;
            categoryMap.set(category, currentAmount + t.amount);
        });
        
        const data = Array.from(categoryMap.entries())
            .map(([name, value], index) => ({ 
                name, 
                value,
                fill: COLORS[index % COLORS.length] 
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // top 5

        const config: ChartConfig = {};
        data.forEach(item => {
            config[item.name] = {
                label: item.name,
                color: item.fill,
            }
        });
        
        return { chartData: data, chartConfig: config };
    }, [transactions, displayMonth, bucketType]);
    
    if (chartData.length === 0) {
        return <div className="flex h-80 w-full items-center justify-center text-muted-foreground">No spending data for this period.</div>;
    }

    return (
        <ChartContainer config={chartConfig} className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent
                            formatter={(value) => `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                            indicator="dot"
                        />}
                    />
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        paddingAngle={2}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.fill} stroke={"hsl(var(--card))"} />
                        ))}
                    </Pie>
                    <ChartLegend
                        content={<ChartLegendContent nameKey="name" />}
                        className="flex-wrap gap-2 [&>*]:justify-center"
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
