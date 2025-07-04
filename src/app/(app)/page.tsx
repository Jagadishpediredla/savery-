
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
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
            </CardContent>
        </Card>
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
                
                <Card className="bg-card/60 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Your last 5 transactions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TransactionList transactions={recentTransactions} />
                    </CardContent>
                </Card>

            </div>
        </PageWrapper>
    );
}
