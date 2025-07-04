'use client';

import dynamic from 'next/dynamic';
import { PageWrapper } from "@/components/PageWrapper";
import { useFirebase } from "@/context/FirebaseContext";
import { useMemo } from "react";
import { subDays, isWithinInterval, parseISO } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { FinancialStatCard } from "@/components/analytics/FinancialStatCard";
import { IncomeExpenseChart } from "@/components/analytics/IncomeExpenseChart";
import { SpendingByCategoryChart } from "@/components/analytics/SpendingByCategoryChart";
import { TrendingUp, TrendingDown, PiggyBank, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NetWorthTrendChart } from "@/components/analytics/NetWorthTrendChart";

const MapView = dynamic(
  () => import('@/components/analytics/MapView').then(mod => mod.MapView),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />
  }
);


const AnalyticsLoadingSkeleton = () => (
    <div className="space-y-8">
        <header>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-80 mt-2" />
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Skeleton className="h-[400px] lg:col-span-3" />
            <Skeleton className="h-[400px] lg:col-span-2" />
        </div>
         <Skeleton className="h-[400px] w-full" />
    </div>
);


export default function AnalyticsPage() {
    const { transactions, loading } = useFirebase();

    const analyticsData = useMemo(() => {
        if (transactions.length === 0) {
            return {
                incomeLast30Days: 0,
                expensesLast30Days: 0,
                netSavingsLast30Days: 0,
                savingsRateLast30Days: 0,
            };
        }

        const thirtyDaysAgo = subDays(new Date(), 30);
        const now = new Date();

        let incomeLast30Days = 0;
        let expensesLast30Days = 0;

        transactions.forEach(t => {
            const txDate = parseISO(t.date);
            if (isWithinInterval(txDate, { start: thirtyDaysAgo, end: now })) {
                if (t.type === 'Credit') {
                    incomeLast30Days += t.amount;
                } else {
                    expensesLast30Days += t.amount;
                }
            }
        });
        
        const netSavingsLast30Days = incomeLast30Days - expensesLast30Days;
        const savingsRateLast30Days = incomeLast30Days > 0 ? (netSavingsLast30Days / incomeLast30Days) * 100 : 0;

        return {
            incomeLast30Days,
            expensesLast30Days,
            netSavingsLast30Days,
            savingsRateLast30Days
        };

    }, [transactions]);
    
    if (loading) {
        return (
            <PageWrapper>
                <AnalyticsLoadingSkeleton />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Financial Analytics</h1>
                    <p className="text-muted-foreground">
                        A detailed overview of your financial performance and trends.
                    </p>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <FinancialStatCard 
                        title="Income (30 Days)" 
                        value={analyticsData.incomeLast30Days} 
                        icon={<TrendingUp className="w-6 h-6 text-green-500" />}
                        formatAsCurrency 
                    />
                    <FinancialStatCard 
                        title="Expenses (30 Days)" 
                        value={analyticsData.expensesLast30Days} 
                        icon={<TrendingDown className="w-6 h-6 text-red-500" />}
                        formatAsCurrency 
                    />
                    <FinancialStatCard 
                        title="Net Savings (30 Days)" 
                        value={analyticsData.netSavingsLast30Days} 
                        icon={<Scale className="w-6 h-6 text-blue-500" />}
                        formatAsCurrency 
                    />
                    <FinancialStatCard 
                        title="Savings Rate (30 Days)" 
                        value={analyticsData.savingsRateLast30Days} 
                        icon={<PiggyBank className="w-6 h-6 text-pink-500" />}
                        suffix="%"
                    />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <Card className="lg:col-span-3 bg-card/60 backdrop-blur-lg">
                        <CardHeader>
                            <CardTitle>Income vs. Expenses</CardTitle>
                            <CardDescription>Monthly comparison of your cash flow.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <IncomeExpenseChart transactions={transactions} />
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2 bg-card/60 backdrop-blur-lg">
                        <CardHeader>
                            <CardTitle>Spending by Category</CardTitle>
                            <CardDescription>Breakdown of your expenses in the last 30 days.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SpendingByCategoryChart transactions={transactions} displayMonth={new Date()} />
                        </CardContent>
                    </Card>
                </div>
                
                 <Card className="bg-card/60 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle>Net Worth Growth</CardTitle>
                        <CardDescription>Your estimated total balance over time.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <NetWorthTrendChart transactions={transactions} />
                    </CardContent>
                </Card>
                
                <Card className="bg-card/60 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle>Transaction Map</CardTitle>
                        <CardDescription>Visualize where your transactions occur.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MapView transactions={transactions} />
                    </CardContent>
                </Card>

            </div>
        </PageWrapper>
    );
}
