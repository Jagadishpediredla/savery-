
'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useFirebase } from "@/context/FirebaseContext";
import { useMemo } from "react";
import type { BucketType } from "@/lib/types";
import { format, parseISO, startOfMonth } from 'date-fns';

interface NetBalanceTrendChartProps {
    bucketType: BucketType;
}

export function NetBalanceTrendChart({ bucketType }: NetBalanceTrendChartProps) {
    const { transactions } = useFirebase();

    const chartConfig = useMemo(() => ({
        netAmount: {
            label: bucketType === 'Savings' ? "Net Savings vs Goal" : "Net Balance (Budget - Spent)",
            color: `hsl(var(--chart-${bucketType === 'Needs' ? 3 : bucketType === 'Wants' ? 2 : bucketType === 'Investments' ? 5 : 4}))`
        },
    } satisfies ChartConfig), [bucketType]);

    const data = useMemo(() => {
        const bucketTransactions = transactions.filter(t => t.bucket === bucketType);

        if (bucketTransactions.length === 0) return [];

        const monthlyData = new Map<string, { allocated: number; spent: number }>();

        // Sort transactions by date to ensure settings from the last transaction of the month are used
        bucketTransactions.sort((a,b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

        bucketTransactions.forEach(t => {
            const monthStr = format(startOfMonth(parseISO(t.date)), 'MMM yyyy');
            
            const allocationPercentage = t.allocationPercentage || 0;
            const allocatedAmount = (t.monthlySalary * allocationPercentage) / 100;
            
            if (!monthlyData.has(monthStr)) {
                monthlyData.set(monthStr, { allocated: allocatedAmount, spent: 0 });
            } else {
                // Update allocated amount for the month with the current transaction's info
                monthlyData.get(monthStr)!.allocated = allocatedAmount;
            }

            const data = monthlyData.get(monthStr)!;
             if (bucketType === 'Savings') {
                 // Net savings. Credits increase it, debits decrease it.
                 if (t.type === 'Credit') data.spent += t.amount;
                 else data.spent -= t.amount;
            } else {
                 if (t.type === 'Debit') data.spent += t.amount;
            }
        });
        
        const chartData = Array.from(monthlyData.entries())
            .map(([month, values]) => ({
              fullDate: new Date(month),
              month: month.split(' ')[0],
              netAmount: values.allocated - values.spent,
            }))
            .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
        
        return chartData;

    }, [transactions, bucketType]);

    if (data.length === 0) {
        return <div className="flex h-64 w-full items-center justify-center text-muted-foreground">No historical data to display trend.</div>;
    }

    return (
        <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer>
                <LineChart data={data}>
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
                        content={<ChartTooltipContent
                            formatter={(value) => `₹${Number(value).toLocaleString()}`}
                            indicator="dot"
                        />}
                    />
                    <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                    <Line
                        dataKey="netAmount"
                        type="monotone"
                        stroke="var(--color-netAmount)"
                        strokeWidth={2}
                        dot={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
