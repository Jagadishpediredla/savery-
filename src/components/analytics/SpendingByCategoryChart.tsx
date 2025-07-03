'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useMemo } from "react";
import type { Transaction } from "@/lib/types";
import { subDays, isWithinInterval, parseISO } from 'date-fns';

const chartConfig = {
    amount: {
      label: "Amount",
      color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;


interface SpendingByCategoryChartProps {
    transactions: Transaction[];
}

export function SpendingByCategoryChart({ transactions }: SpendingByCategoryChartProps) {
    const chartData = useMemo(() => {
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

        return Array.from(categoryMap.entries())
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5) // top 5
            .reverse(); // Bar chart renders from bottom up, so reverse to show highest at top
    }, [transactions]);
    
    if (chartData.length === 0) {
        return <div className="flex h-80 w-full items-center justify-center text-muted-foreground">No spending data for last 30 days.</div>;
    }

    return (
        <ChartContainer config={chartConfig} className="h-80 w-full">
            <ResponsiveContainer>
                <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="amount" hide />
                    <YAxis 
                        dataKey="category" 
                        type="category" 
                        tickLine={false} 
                        axisLine={false}
                        tickMargin={10}
                        width={80}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                    />
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent 
                            formatter={(value) => `₹${Number(value).toLocaleString()}`}
                            indicator="dot"
                            nameKey="category"
                        />}
                    />
                    <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
