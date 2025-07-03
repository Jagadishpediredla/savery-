
'use client';

import { PageWrapper } from "@/components/PageWrapper";
import { GoalProgress } from "@/components/investments/GoalProgress";
import { PortfolioAllocation } from "@/components/investments/PortfolioAllocation";
import { TransactionList } from "@/components/dashboard/RecentTransactions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirebase } from "@/context/FirebaseContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountPageLayout } from "@/components/accounts/AccountPageLayout";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { parseISO, format, startOfMonth, addDays } from 'date-fns';
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const investmentGrowthChartConfig = {
    cumulativeAmount: {
      label: "Cumulative Investment",
      color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;


export default function InvestmentsPage() {
    const { transactions, goals, accounts } = useFirebase();

    const [investmentFilters, setInvestmentFilters] = useState({
        dateRange: undefined as DateRange | undefined,
        searchTerm: '',
        category: 'All',
        transactionType: 'All' as 'All' | 'Credit' | 'Debit',
    });

    const investmentAccountNames = accounts.filter(acc => acc.type === 'Investments').map(acc => acc.name);
    const investmentTransactions = transactions.filter(t => investmentAccountNames.includes(t.account));
    
    const savingsAccountNames = accounts.filter(acc => acc.type === 'Savings').map(acc => acc.name);
    const savingsTransactions = transactions.filter(t => savingsAccountNames.includes(t.account));

    const investmentCategories = useMemo(() => ['All', ...Array.from(new Set(investmentTransactions.map(t => t.category)))], [investmentTransactions]);

    const handleInvestmentFilterChange = (key: keyof typeof investmentFilters, value: any) => {
        setInvestmentFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearInvestmentFilters = () => {
        setInvestmentFilters({
            dateRange: undefined,
            searchTerm: '',
            category: 'All',
            transactionType: 'All',
        });
    };

     const filteredInvestmentTransactions = useMemo(() => {
        const { dateRange, searchTerm, category, transactionType } = investmentFilters;
        return investmentTransactions.filter(t => {
            const transactionDate = parseISO(t.date);
            if (dateRange?.from && transactionDate < dateRange.from) return false;
            if (dateRange?.to && transactionDate > addDays(dateRange.to, 1)) return false;
            if (transactionType !== 'All' && t.type !== transactionType) return false;
            if (category !== 'All' && t.category !== category) return false;
            if (searchTerm && !t.note.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        });
    }, [investmentTransactions, investmentFilters]);

     const investmentGrowthData = useMemo(() => {
        const sortedTransactions = [...investmentTransactions]
            .filter(t => t.type === 'Debit') // Assuming investments are debits to this account
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        let cumulativeAmount = 0;
        const dataMap = new Map<string, number>();

        sortedTransactions.forEach(t => {
            cumulativeAmount += t.amount;
            const month = format(startOfMonth(parseISO(t.date)), 'MMM yyyy');
            dataMap.set(month, cumulativeAmount);
        });

        return Array.from(dataMap.entries()).map(([month, amount]) => ({
            month,
            cumulativeAmount: amount,
        }));
    }, [investmentTransactions]);

    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Savings & Investments</h1>
                    <p className="text-muted-foreground">
                        Track your goals, savings, and grow your wealth.
                    </p>
                </header>

                <Tabs defaultValue="investments" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="investments">Investments</TabsTrigger>
                        <TabsTrigger value="savings">Savings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="investments" className="mt-6">
                        <div className="space-y-8">
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <PortfolioAllocation />
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Investment Growth</CardTitle>
                                            <CardDescription>Cumulative contributions over time.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {investmentGrowthData.length > 0 ? (
                                                <ChartContainer config={investmentGrowthChartConfig} className="h-[250px] w-full">
                                                    <LineChart data={investmentGrowthData}>
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
                                                        <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value) => `₹${Number(value).toLocaleString()}`} indicator="dot" />} />
                                                        <Line type="monotone" dataKey="cumulativeAmount" stroke="var(--color-cumulativeAmount)" strokeWidth={2} />
                                                    </LineChart>
                                                </ChartContainer>
                                            ) : <p className="text-muted-foreground text-center h-[250px] flex items-center justify-center">No investment data to display.</p>}
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold">Your Goals</h2>
                                    {goals.length > 0 ? goals.map(goal => (
                                        <GoalProgress key={goal.id} goal={goal} />
                                    )) : (
                                        <Card>
                                            <CardContent className="pt-6">
                                                <p className="text-muted-foreground text-center">No investment goals set up yet.</p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Investment History</CardTitle>
                                    <CardDescription>Review and filter your investment transactions.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <TransactionFilters 
                                        filters={investmentFilters} 
                                        onFilterChange={handleInvestmentFilterChange} 
                                        categories={investmentCategories}
                                        clearFilters={clearInvestmentFilters}
                                    />
                                    <TransactionList transactions={filteredInvestmentTransactions} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="savings" className="mt-6">
                        <AccountPageLayout
                            title="Savings Overview"
                            description="Transactions and analysis related to your savings."
                            transactions={savingsTransactions}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </PageWrapper>
    );
}
