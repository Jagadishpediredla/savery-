'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useMemo } from "react";
import type { Transaction } from "@/lib/types";
import { format, parseISO, startOfMonth } from 'date-fns';

const chartConfig = {
    netWorth: {
        label: "Net Worth",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

interface NetWorthTrendChartProps {
    transactions: Transaction[];
}

export function NetWorthTrendChart({ transactions }: NetWorthTrendChartProps) {
    const data = useMemo(() => {
        if (transactions.length === 0) return [];
        
        const sortedTransactions = [...transactions].sort((a,b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
        
        let cumulativeBalance = 0;
        const monthlySnapshots = new Map<string, number>();

        sortedTransactions.forEach(t => {
            if (t.type === 'Credit') {
                cumulativeBalance += t.amount;
            } else {
                cumulativeBalance -= t.amount;
            }
            const month = format(startOfMonth(parseISO(t.date)), 'MMM yyyy');
            monthlySnapshots.set(month, cumulativeBalance);
        });
        
        return Array.from(monthlySnapshots.entries())
            .map(([month, netWorth]) => ({ month: month.split(' ')[0], netWorth }))
            .sort((a, b) => new Date(a.month + " 1, 2024").getTime() - new Date(b.month + " 1, 2024").getTime());

    }, [transactions]);
    
    return (
        <ChartContainer config={chartConfig} className="h-96 w-full">
            <ResponsiveContainer>
                <AreaChart data={data}>
                     <defs>
                        <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-netWorth)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="var(--color-netWorth)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
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
                        tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                    />
                    <ChartTooltip
                        cursor={true}
                        content={<ChartTooltipContent formatter={(value) => `₹${Number(value).toLocaleString()}`} />}
                    />
                    <Area 
                        dataKey="netWorth" 
                        type="monotone" 
                        fill="url(#colorNetWorth)" 
                        stroke="var(--color-netWorth)" 
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
