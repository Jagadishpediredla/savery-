
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useFirebase } from "@/context/FirebaseContext";
import { useMemo } from "react";
import type { Transaction, BucketType } from "@/lib/types";
import { parseISO, isSameMonth } from 'date-fns';

interface CategoryBarChartProps {
    bucketType: BucketType;
    displayMonth: Date;
}

export function CategoryBarChart({ bucketType, displayMonth }: CategoryBarChartProps) {
    const { transactions, settings } = useFirebase();

    const { data, chartConfig } = useMemo(() => {
        const categoryData = new Map<string, { spent: number; allocated: number }>();
        
        const monthTransactions = transactions.filter(t => 
            t.bucket === bucketType && 
            isSameMonth(parseISO(t.date), displayMonth)
        );

        const bucketAllocation = (settings.monthlySalary * (settings as any)[`${bucketType.toLowerCase()}Percentage`]) / 100;

        const totalSpending = monthTransactions
          .filter(t => t.type === 'Debit')
          .reduce((sum, t) => sum + t.amount, 0);

        // For this viz, let's assume allocation is proportional to spending, as we don't have per-category budgets
        monthTransactions.forEach(t => {
            if (t.type === 'Debit') {
                const category = t.category || 'Other';
                const categoryInfo = categoryData.get(category) || { spent: 0, allocated: 0 };
                
                categoryInfo.spent += t.amount;
                // Pro-rate allocation based on this category's share of total spending
                if(totalSpending > 0) {
                    categoryInfo.allocated = (categoryInfo.spent / totalSpending) * bucketAllocation;
                }

                categoryData.set(category, categoryInfo);
            }
        });
        
        if (categoryData.size === 0) return { data: [], chartConfig: {} };
        
        const chartData = Array.from(categoryData.entries())
            .map(([name, values]) => ({ name, ...values }))
            .sort((a,b) => b.spent - a.spent);

        const config: ChartConfig = {
            allocated: { label: "Budget", color: "hsl(var(--chart-2))" },
            spent: { label: "Spent", color: "hsl(var(--chart-1))" },
        };

        return { data: chartData, chartConfig: config };

    }, [transactions, bucketType, displayMonth, settings]);
    
    if (data.length === 0) {
        return <div className="flex h-64 w-full items-center justify-center text-muted-foreground">No spending data for this month.</div>;
    }
    
    return (
        <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
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
                    <Tooltip
                        cursor={{fill: 'hsl(var(--muted)/0.3)'}}
                        content={<ChartTooltipContent 
                            formatter={(value) => `₹${Number(value).toLocaleString()}`}
                            indicator="dot" 
                        />}
                    />
                    <Legend />
                    <Bar dataKey="allocated" layout="vertical" fill="var(--color-allocated)" radius={4} />
                    <Bar dataKey="spent" layout="vertical" fill="var(--color-spent)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
