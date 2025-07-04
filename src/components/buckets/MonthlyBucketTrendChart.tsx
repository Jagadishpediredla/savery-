
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useFirebase } from "@/context/FirebaseContext";
import { useMemo } from "react";
import type { Transaction, BucketType } from "@/lib/types";
import { format, parseISO, startOfMonth } from 'date-fns';

interface MonthlyBucketTrendChartProps {
    bucketType: BucketType;
}

export function MonthlyBucketTrendChart({ bucketType }: MonthlyBucketTrendChartProps) {
    const { transactions, settings } = useFirebase();

    const chartConfig = useMemo(() => ({
        allocated: { label: "Allocated", color: "hsl(var(--muted-foreground))" },
        actual: { label: "Actual", color: `hsl(var(--chart-${bucketType === 'Needs' ? 3 : bucketType === 'Wants' ? 2 : bucketType === 'Investments' ? 5 : 4}))` },
    } satisfies ChartConfig), [bucketType]);
    
    const data = useMemo(() => {
        const monthlyData: { [key: string]: { actual: number, allocated: number } } = {};
        
        const allocationPercentage = (settings as any)[`${bucketType.toLowerCase()}Percentage`] || 0;
        const allocatedAmount = (settings.monthlySalary * allocationPercentage) / 100;

        transactions.filter(t => t.bucket === bucketType).forEach(t => {
            const month = format(startOfMonth(parseISO(t.date)), 'MMM yyyy');
            if (!monthlyData[month]) {
                monthlyData[month] = { actual: 0, allocated: allocatedAmount };
            }

            if (bucketType === 'Savings') {
                if (t.type === 'Credit') monthlyData[month].actual += t.amount;
                else monthlyData[month].actual -= t.amount;
            } else {
                 if (t.type === 'Debit') monthlyData[month].actual += t.amount;
            }
        });
        
        return Object.entries(monthlyData)
            .map(([month, values]) => ({ month: month.split(' ')[0], ...values }))
            .sort((a, b) => new Date(a.month + " 1, 2024").getTime() - new Date(b.month + " 1, 2024").getTime());

    }, [transactions, bucketType, settings]);

    return (
        <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer>
                <BarChart data={data}>
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
                        cursor={false}
                        content={<ChartTooltipContent 
                            formatter={(value, name) => [`₹${Number(value).toLocaleString()}`, name === 'actual' ? 'Actual' : 'Allocated']}
                            indicator="dot" 
                        />}
                    />
                    <Bar dataKey="allocated" fill="var(--color-allocated)" radius={4} />
                    <Bar dataKey="actual" fill="var(--color-actual)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
