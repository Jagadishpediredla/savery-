
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useFirebase } from "@/context/FirebaseContext";
import { useMemo } from "react";
import type { Transaction, BucketType } from "@/lib/types";
import { parseISO, isSameMonth } from 'date-fns';

interface CategoryBarChartProps {
    bucketType: BucketType;
    displayMonth: Date;
}

const chartConfig = {
    spending: {
        label: "Spending",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function CategoryBarChart({ bucketType, displayMonth }: CategoryBarChartProps) {
    const { transactions } = useFirebase();

    const data = useMemo(() => {
        const categorySpending = new Map<string, number>();
        
        const monthTransactions = transactions.filter(t => 
            t.bucket === bucketType && 
            t.type === 'Debit' &&
            isSameMonth(parseISO(t.date), displayMonth)
        );

        monthTransactions.forEach(t => {
            const category = t.category || 'Other';
            const currentAmount = categorySpending.get(category) || 0;
            categorySpending.set(category, currentAmount + t.amount);
        });
        
        if (categorySpending.size === 0) return [];
        
        return Array.from(categorySpending.entries())
            .map(([name, spending]) => ({ name, spending }))
            .sort((a,b) => b.spending - a.spending); // Sort by highest spending

    }, [transactions, bucketType, displayMonth]);
    
    if (data.length === 0) {
        return <div className="flex h-64 w-full items-center justify-center text-muted-foreground">No spending data for this month.</div>;
    }
    
    // Create a dynamic config for the chart based on the data
    const dynamicChartConfig: ChartConfig = {
        ...chartConfig,
        ...Object.fromEntries(data.map(item => [item.name, { label: item.name, color: "hsl(var(--chart-1))" }]))
    };

    return (
        <ChartContainer config={dynamicChartConfig} className="h-64 w-full">
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        stroke="hsl(var(--muted-foreground))"
                        tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                        domain={[0, 'dataMax + 1000']}
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        stroke="hsl(var(--muted-foreground))"
                        width={80}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent 
                            formatter={(value) => `₹${Number(value).toLocaleString()}`}
                            indicator="dot" 
                        />}
                    />
                    <Bar dataKey="spending" layout="vertical" fill="var(--color-spending)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
