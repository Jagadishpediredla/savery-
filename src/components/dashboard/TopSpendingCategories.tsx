
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { useFirebase } from "@/context/FirebaseContext";
import { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
    amount: {
      label: "Amount",
      color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function TopSpendingCategories() {
    const { transactions, loading } = useFirebase();

    const topCategoriesData = useMemo(() => {
        const categoryMap = new Map<string, number>();

        transactions.forEach(t => {
            if (t.type === 'Debit') {
                const currentAmount = categoryMap.get(t.category) || 0;
                categoryMap.set(t.category, currentAmount + t.amount);
            }
        });

        return Array.from(categoryMap.entries())
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5); // top 5
    }, [transactions]);

    if (loading) {
        return (
            <Card className="bg-card/60 backdrop-blur-lg">
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-80 w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-card/60 backdrop-blur-lg">
            <CardHeader>
                <CardTitle>Top 5 Spending Categories</CardTitle>
                <CardDescription>Your biggest expense areas.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <ResponsiveContainer>
                        <BarChart data={topCategoriesData} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
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
            </CardContent>
        </Card>
    );
}
