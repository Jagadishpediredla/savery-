
'use client';

import { PageWrapper } from "@/components/PageWrapper";
import { TransactionList } from "@/components/dashboard/RecentTransactions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { Transaction } from "@/lib/types";
import { useMemo, useState } from "react";
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";
import { format, startOfMonth, parseISO, addDays } from 'date-fns';
import { TransactionFilters } from "../transactions/TransactionFilters";
import type { DateRange } from "react-day-picker";

interface AccountPageLayoutProps {
    title: string;
    description: string;
    transactions: Transaction[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const chartConfig = {
    value: {
        label: "Spending",
    },
} satisfies ChartConfig;

export function AccountPageLayout({ title, description, transactions }: AccountPageLayoutProps) {
    const [filters, setFilters] = useState({
        dateRange: undefined as DateRange | undefined,
        searchTerm: '',
        category: 'All',
        transactionType: 'All' as 'All' | 'Credit' | 'Debit',
    });

    const handleFilterChange = (key: keyof typeof filters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            dateRange: undefined,
            searchTerm: '',
            category: 'All',
            transactionType: 'All',
        });
    };

    const categories = useMemo(() => ['All', ...Array.from(new Set(transactions.map(t => t.category)))], [transactions]);

    const filteredTransactions = useMemo(() => {
        const { dateRange, searchTerm, category, transactionType } = filters;
        return transactions.filter(t => {
            const transactionDate = parseISO(t.date);
            if (dateRange?.from && transactionDate < dateRange.from) return false;
            if (dateRange?.to && transactionDate > addDays(dateRange.to, 1)) return false; // include the 'to' day
            if (transactionType !== 'All' && t.type !== transactionType) return false;
            if (category !== 'All' && t.category !== category) return false;
            if (searchTerm && !t.note.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        });
    }, [transactions, filters]);
    
    const { pieData, lineData } = useMemo(() => {
        const categoryMap = new Map<string, number>();
        const lineDataMap = new Map<string, number>();

        filteredTransactions.forEach(t => {
            if (t.type === 'Debit') {
                const currentCategoryAmount = categoryMap.get(t.category) || 0;
                categoryMap.set(t.category, currentCategoryAmount + t.amount);

                const month = format(startOfMonth(new Date(t.date)), 'MMM yyyy');
                const currentMonthAmount = lineDataMap.get(month) || 0;
                lineDataMap.set(month, currentMonthAmount + t.amount);
            }
        });

        const pieData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
        
        const lineData = Array.from(lineDataMap.entries())
            .map(([month, value]) => ({ month, total: value }))
            .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

        return { pieData, lineData };
    }, [filteredTransactions]);


    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </header>

                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                    <Card className="lg:col-span-2 bg-card/60 backdrop-blur-lg">
                        <CardHeader>
                            <CardTitle>Category Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pieData.length > 0 ? (
                                <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full max-h-[250px]">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent 
                                                formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                                                indicator="dot"
                                            />}
                                        />
                                    </PieChart>
                                </ChartContainer>
                            ) : <p className="text-muted-foreground text-center h-[250px] flex items-center justify-center">No data for this period.</p>}
                        </CardContent>
                    </Card>
                     <Card className="lg:col-span-3 bg-card/60 backdrop-blur-lg">
                        <CardHeader>
                            <CardTitle>Spending Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {lineData.length > 0 ? (
                                <ChartContainer config={chartConfig} className="h-[250px] w-full">
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
                                            tickFormatter={(value) => `₹${Number(value)/1000}k`}
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent 
                                                formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                                                indicator="dot"
                                            />}
                                        />
                                        <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} />
                                    </LineChart>
                                </ChartContainer>
                            ) : <p className="text-muted-foreground text-center h-[250px] flex items-center justify-center">No data for this period.</p>}
                        </CardContent>
                    </Card>
                </div>
                
                <Card className="bg-card/60 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>
                            Review and filter your transactions below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <TransactionFilters 
                            filters={filters} 
                            onFilterChange={handleFilterChange} 
                            categories={categories}
                            clearFilters={clearFilters}
                        />
                        <TransactionList transactions={filteredTransactions} />
                    </CardContent>
                </Card>
            </div>
        </PageWrapper>
    );
}
