
'use client';

import { PageWrapper } from '@/components/PageWrapper';
import { useFirebase } from '@/context/FirebaseContext';
import { Skeleton } from '@/components/ui/skeleton';
import { TotalBalanceCard } from '@/components/dashboard/TotalBalanceCard';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { BalanceOverview } from '@/components/dashboard/BalanceOverview';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TransactionList } from '@/components/dashboard/RecentTransactions';
import { GoalsOverview } from '@/components/dashboard/GoalsOverview';
import { MagicCalendar } from '@/components/dashboard/MagicCalendar';

const LoadingSkeleton = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Skeleton className="h-40 lg:col-span-1 md:col-span-2" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
        </div>
        <Skeleton className="h-80 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
        </div>
    </div>
);


export default function DashboardPage() {
    const { loading, transactions } = useFirebase();
    
    if (loading) {
        return (
            <PageWrapper>
                <LoadingSkeleton />
            </PageWrapper>
        );
    }

    const recentTransactions = transactions.slice(0, 5);

    return (
        <PageWrapper>
            <div className="space-y-6">
                 <TotalBalanceCard />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                       <SpendingChart />
                    </div>
                    <BalanceOverview />
                </div>

                <Card className="bg-card/60 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Your last 5 transactions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TransactionList transactions={recentTransactions} />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <GoalsOverview />
                    </div>
                    <MagicCalendar />
                </div>
            </div>
        </PageWrapper>
    );
}
