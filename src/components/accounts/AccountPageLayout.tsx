'use client';

import { PageWrapper } from "@/components/PageWrapper";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { Transaction } from "@/lib/types";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format, startOfMonth } from 'date-fns';

interface AccountPageLayoutProps {
    title: string;
    description: string;
    transactions: Transaction[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const chartConfig = {} satisfies ChartConfig;

export function AccountPageLayout({ title, description, transactions }: AccountPageLayoutProps) {
    const { pieData, lineData } = useMemo(() => {
        const pieDataMap = new Map<string, number>();
        const lineDataMap = new Map<string, number>();

        transactions.forEach(t => {
            if (t.type === 'Debit') {
                // Pie chart data (by category)
                const currentCategoryAmount = pieDataMap.get(t.category) || 0;
                pieDataMap.set(t.category, currentCategoryAmount + t.amount);

                // Line chart data (by month)
                const month = format(startOfMonth(new Date(t.date)), 'MMM yyyy');
                const currentMonthAmount = lineDataMap.get(month) || 0;
                lineDataMap.set(month, currentMonthAmount + t.amount);
            }
        });

        const pieData = Array.from(pieDataMap.entries()).map(([name, value]) => ({ name, value }));
        
        const lineData = Array.from(lineDataMap.entries())
            .map(([month, value]) => ({ month, total: value }))
            .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

        return { pieData, lineData };
    }, [transactions]);


    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Category Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent 
                                                formatter={(value) => `₹${Number(value).toLocaleString()}`}
                                                indicator="dot"
                                            />}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                     <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Spending Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineData}>
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                         <XAxis
                                            dataKey="month"
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => format(new Date(value), 'MMM')}
                                        />
                                        <YAxis 
                                            stroke="hsl(var(--muted-foreground))" 
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `₹${value/1000}k`}
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent 
                                                formatter={(value) => `₹${Number(value).toLocaleString()}`}
                                                indicator="dot"
                                            />}
                                        />
                                        <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <RecentTransactions transactions={transactions} />
            </div>
        </PageWrapper>
    );
}
