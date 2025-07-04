
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useFirebase } from "@/context/FirebaseContext";
import { useMemo } from "react";
import type { BucketType } from "@/lib/types";
import { parseISO, isSameMonth } from 'date-fns';

interface BudgetVsSpendingChartProps {
    bucketType: BucketType;
    displayMonth: Date;
}

const chartConfig = {
    allocated: { label: "Budget", color: "hsl(var(--chart-2))" },
    spent: { label: "Spent", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;


export function BudgetVsSpendingChart({ bucketType, displayMonth }: BudgetVsSpendingChartProps) {
    const { transactions, settings } = useFirebase();

    const data = useMemo(() => {
        const monthTransactions = transactions.filter(t =>
            t.bucket === bucketType &&
            isSameMonth(parseISO(t.date), displayMonth)
        );

        const percentageKey = `${bucketType.toLowerCase()}Percentage` as keyof typeof settings;
        const bucketPercentage = (settings as any)[percentageKey] || 0;
        const allocated = (settings.monthlySalary * bucketPercentage) / 100;

        let spent = 0;
        if (bucketType === 'Savings') {
            const credits = monthTransactions
                .filter(t => t.type === 'Credit')
                .reduce((sum, t) => sum + t.amount, 0);
            const debits = monthTransactions
                .filter(t => t.type === 'Debit')
                .reduce((sum, t) => sum + t.amount, 0);
            spent = credits - debits;
        } else {
            spent = monthTransactions
                .filter(t => t.type === 'Debit')
                .reduce((sum, t) => sum + t.amount, 0);
        }

        return [{
            name: bucketType,
            allocated: allocated,
            spent: spent,
        }];

    }, [transactions, bucketType, displayMonth, settings]);

    if (data[0].allocated === 0 && data[0].spent === 0) {
        return <div className="flex h-64 w-full items-center justify-center text-muted-foreground">No data for this month.</div>;
    }

    return (
        <ChartContainer config={chartConfig} className="h-80 w-full">
            <ResponsiveContainer>
                <BarChart data={data} >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        type="category"
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
                            formatter={(value) => `₹${Number(value).toLocaleString()}`}
                            indicator="dot"
                        />}
                    />
                    <Legend />
                    <Bar dataKey="allocated" fill="var(--color-allocated)" radius={4} />
                    <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
