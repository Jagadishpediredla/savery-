
'use client';

import { PageWrapper } from "@/components/PageWrapper";
import { useFirebase } from "@/context/FirebaseContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionList } from "@/components/dashboard/RecentTransactions";
import { GoalsOverview } from "@/components/dashboard/GoalsOverview";
import { BucketSummaryCard } from "@/components/dashboard/BucketSummaryCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";


const LoadingSkeleton = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-80" />
            <Skeleton className="h-80" />
        </div>
    </div>
);


export default function DashboardPage() {
    const { loading, transactions, buckets } = useFirebase();
    
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {buckets.map(bucket => <BucketSummaryCard key={bucket.name} bucket={bucket} />)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                       <SpendingChart />
                    </div>
                     <GoalsOverview />
                </div>
                
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 bg-card/60 backdrop-blur-lg">
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Your last 5 transactions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TransactionList transactions={recentTransactions} />
                        </CardContent>
                    </Card>
                    <GoalsOverview />
                </div>

            </div>
        </PageWrapper>
    );
}
