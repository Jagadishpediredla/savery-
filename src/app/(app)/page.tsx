'use client';

import { PageWrapper } from '@/components/PageWrapper';
import { useFirebase } from '@/context/FirebaseContext';
import { useMemo } from 'react';
import type { Transaction } from '@/lib/types';
import { TotalBalanceCard } from '@/components/dashboard/TotalBalanceCard';
import { DashboardStatCard } from '@/components/dashboard/DashboardStatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionList } from '@/components/dashboard/RecentTransactions';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { BalanceOverview } from '@/components/dashboard/BalanceOverview';
import { ArrowDown, ArrowUp, PiggyBank, Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Skeleton className="h-40 lg:col-span-4" />
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Skeleton className="h-96 lg:col-span-3" />
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
        </div>
    </div>
);


export default function DashboardPage() {
    const { transactions, accounts, loading } = useFirebase();

    const { income, expenses, savings, investments } = useMemo(() => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        let income = 0, expenses = 0, savings = 0, investments = 0;

        transactions.forEach((t: Transaction) => {
            const txDate = new Date(t.date);
            if (txDate > lastMonth) {
                if (t.type === 'Credit') {
                    income += t.amount;
                } else {
                    if (t.account.includes('Saving')) {
                        savings += t.amount;
                    } else if (t.account.includes('Invest')) {
                        investments += t.amount;
                    } else {
                        expenses += t.amount;
                    }
                }
            }
        });

        return { income, expenses, savings, investments };
    }, [transactions]);
    
    if (loading) {
        return (
            <PageWrapper>
                <LoadingSkeleton />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <TotalBalanceCard />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardStatCard 
                        title="Income"
                        amount={income}
                        progress={(income / 80000) * 100} // Assuming 80k monthly salary goal
                        icon={<ArrowUp className="w-5 h-5 text-green-400" />}
                        color="bg-green-500/10"
                    />
                     <DashboardStatCard 
                        title="Expenses"
                        amount={expenses}
                        progress={(expenses / 40000) * 100} // Assuming 40k monthly expense budget
                        icon={<ArrowDown className="w-5 h-5 text-red-400" />}
                        color="bg-red-500/10"
                    />
                     <DashboardStatCard 
                        title="Savings"
                        amount={savings}
                        progress={(savings / 20000) * 100} // Assuming 20k monthly savings goal
                        icon={<PiggyBank className="w-5 h-5 text-blue-400" />}
                        color="bg-blue-500/10"
                    />
                     <DashboardStatCard 
                        title="Investments"
                        amount={investments}
                        progress={(investments / 15000) * 100} // Assuming 15k monthly investment goal
                        icon={<Briefcase className="w-5 h-5 text-purple-400" />}
                        color="bg-purple-500/10"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Your latest financial movements.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TransactionList transactions={transactions.slice(0, 10)} />
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 space-y-6">
                        <SpendingChart />
                        <BalanceOverview />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
