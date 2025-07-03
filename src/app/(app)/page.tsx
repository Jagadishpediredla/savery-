'use client';

import { PageWrapper } from '@/components/PageWrapper';
import { useFirebase } from '@/context/FirebaseContext';
import { Skeleton } from '@/components/ui/skeleton';
import { WelcomeHeader } from '@/components/dashboard/new/WelcomeHeader';
import { StatCard } from '@/components/dashboard/new/StatCard';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { EarningsChart } from '@/components/dashboard/new/EarningsChart';
import { SpendingBreakdown } from '@/components/dashboard/new/SpendingBreakdown';
import { CashflowCard } from '@/components/dashboard/new/CashflowCard';
import { UpcomingBills } from '@/components/dashboard/new/UpcomingBills';
import { FinancialHabits } from '@/components/dashboard/new/FinancialHabits';
import { GoalStorageCard } from '@/components/dashboard/new/GoalStorageCard';

const LoadingSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
        </div>
    </div>
);


export default function DashboardPage() {
    const { loading } = useFirebase();
    
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
                <WelcomeHeader />

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total Balance"
                        value="$12,345"
                        footerText="+15% from last month"
                        icon={<ArrowUp className="text-green-500" />}
                    />
                    <StatCard 
                        title="Income"
                        value="$5,678"
                        footerText="vs. $4,321 last month"
                        icon={<ArrowUp className="text-green-500" />}
                    />
                    <StatCard 
                        title="Expenses"
                        value="$3,456"
                        footerText="vs. $3,123 last month"
                        icon={<ArrowDown className="text-red-500" />}
                    />
                    <StatCard 
                        title="Savings"
                        value="$2,222"
                        footerText="Goal: $4,000"
                        icon={<ArrowUp className="text-green-500" />}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                       <EarningsChart />
                       <FinancialHabits />
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <SpendingBreakdown />
                        <CashflowCard />
                    </div>
                </div>

                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <UpcomingBills />
                    </div>
                     <div className="lg:col-span-2 space-y-6">
                        <GoalStorageCard />
                    </div>
                </div>

            </div>
        </PageWrapper>
    );
}
