
'use client';

import { useMemo } from 'react';
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { useFirebase } from '@/context/FirebaseContext';
import { Transaction } from '@/lib/types';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function TopSpendingCategories() {
    const { transactions } = useFirebase();

    const { chartData, chartConfig } = useMemo(() => {
        const categoryMap = new Map<string, number>();

        const spendingTransactions = transactions.filter(t => 
            t.type === 'Debit' && (t.bucket === 'Needs' || t.bucket === 'Wants')
        );

        spendingTransactions.forEach(t => {
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
        
        return { chartData, chartConfig };
    }, [transactions]);

    if (chartData.length === 0) {
        return (
             <Card className="h-full bg-card/60 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle>Top Spending Categories</CardTitle>
                    <CardDescription>Your main expense categories from Needs & Wants.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-full min-h-80 w-full items-center justify-center text-muted-foreground">
                        No spending data to display.
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="h-full bg-card/60 backdrop-blur-lg">
            <CardHeader>
                <CardTitle>Top Spending Categories</CardTitle>
                <CardDescription>Your main expense categories from Needs & Wants.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <ChartTooltip
                                cursor={true}
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
            </CardContent>
        </Card>
    );
}
