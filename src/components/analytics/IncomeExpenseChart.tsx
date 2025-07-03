'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { useMemo } from "react";
import type { Transaction } from "@/lib/types";
import { format, parseISO, startOfMonth } from 'date-fns';

const chartConfig = {
    income: {
        label: "Income",
        color: "hsl(var(--chart-2))",
    },
    expenses: {
        label: "Expenses",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

interface IncomeExpenseChartProps {
    transactions: Transaction[];
}

export function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
    const data = useMemo(() => {
        const monthlyData: { [key: string]: { income: number; expenses: number } } = {};

        transactions.forEach(t => {
            const month = format(startOfMonth(parseISO(t.date)), 'MMM yyyy');
            if (!monthlyData[month]) {
                monthlyData[month] = { income: 0, expenses: 0 };
            }

            if (t.type === 'Credit') {
                monthlyData[month].income += t.amount;
            } else {
                monthlyData[month].expenses += t.amount;
            }
        });
        
        return Object.entries(monthlyData)
            .map(([month, values]) => ({ month: month.split(' ')[0], ...values }))
            .sort((a, b) => new Date(a.month + " 1, 2024").getTime() - new Date(b.month + " 1, 2024").getTime());

    }, [transactions]);
    
    return (
        <ChartContainer config={chartConfig} className="h-80 w-full">
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
                        cursor={true}
                        content={<ChartTooltipContent formatter={(value) => `₹${Number(value).toLocaleString()}`} />}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                    <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
