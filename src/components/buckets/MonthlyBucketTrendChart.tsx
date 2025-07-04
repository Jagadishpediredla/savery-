
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useFirebase } from "@/context/FirebaseContext";
import { useMemo } from "react";
import type { Transaction, BucketType } from "@/lib/types";
import { parseISO, isSameMonth } from 'date-fns';

interface MonthlyBucketChartProps {
    bucketType: BucketType;
    displayMonth: Date;
}

export function MonthlyBucketTrendChart({ bucketType, displayMonth }: MonthlyBucketChartProps) {
    const { transactions, settings } = useFirebase();

    const chartConfig = useMemo(() => ({
        allocated: { label: "Allocated", color: "hsl(var(--muted-foreground))" },
        actual: { label: "Actual", color: `hsl(var(--chart-${bucketType === 'Needs' ? 3 : bucketType === 'Wants' ? 2 : bucketType === 'Investments' ? 5 : 4}))` },
    } satisfies ChartConfig), [bucketType]);
    
    const data = useMemo(() => {
        const allocationPercentage = (settings as any)[`${bucketType.toLowerCase()}Percentage`] || 0;
        const allocatedAmount = (settings.monthlySalary * allocationPercentage) / 100;
        
        const monthTransactions = transactions.filter(t => 
            t.bucket === bucketType && isSameMonth(parseISO(t.date), displayMonth)
        );

        let actualAmount = 0;
        if (bucketType === 'Savings') {
            const credits = monthTransactions
                .filter(t => t.type === 'Credit')
                .reduce((sum, t) => sum + t.amount, 0);
            const debits = monthTransactions
                .filter(t => t.type === 'Debit')
                .reduce((sum, t) => sum + t.amount, 0);
            actualAmount = credits - debits;
        } else {
             actualAmount = monthTransactions
                .filter(t => t.type === 'Debit')
                .reduce((sum, t) => sum + t.amount, 0);
        }
        
        return [
            { name: bucketType, allocated: allocatedAmount, actual: actualAmount }
        ];

    }, [transactions, bucketType, settings, displayMonth]);

    return (
        <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical">
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        stroke="hsl(var(--muted-foreground))"
                        tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        stroke="hsl(var(--muted-foreground))"
                        tick={false}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent 
                            formatter={(value) => `₹${Number(value).toLocaleString()}`}
                            indicator="dot" 
                        />}
                    />
                    <Bar dataKey="allocated" fill="var(--color-allocated)" radius={4} barSize={32} name="Allocated" />
                    <Bar dataKey="actual" fill="var(--color-actual)" radius={4} barSize={32} name="Actual Spending" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
