
'use client';

import { PageWrapper } from "@/components/PageWrapper";
import { useFirebase } from "@/context/FirebaseContext";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionList } from "@/components/dashboard/RecentTransactions";
import { GoalsOverview } from "@/components/dashboard/GoalsOverview";
import { BucketSummaryCard } from "@/components/dashboard/BucketSummaryCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import type { BucketType } from "@/lib/types";
import { isWithinInterval, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";

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
    const { loading, transactions, buckets, allCategories } = useFirebase();
    
    const [filters, setFilters] = useState<{
        searchTerm: string;
        category: string;
        transactionType: 'All' | 'Credit' | 'Debit';
        bucketType: BucketType | 'All';
        dateRange?: DateRange;
    }>({
        searchTerm: '',
        category: 'All',
        transactionType: 'All',
        bucketType: 'All',
        dateRange: undefined,
    });

    const handleFilterChange = (key: keyof typeof filters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            category: 'All',
            transactionType: 'All',
            bucketType: 'All',
            dateRange: undefined
        });
    };
    
    const allUniqueCategories = useMemo(() => {
        const all = new Set<string>();
        Object.values(allCategories).forEach(catList => {
            catList.forEach(cat => all.add(cat));
        });
        return ['All', ...Array.from(all)];
    }, [allCategories]);


    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const { dateRange, searchTerm, category, transactionType, bucketType } = filters;
            
            if (dateRange?.from && dateRange.to) {
                const txDate = parseISO(t.date);
                 // Add one day to the end date to make it inclusive
                const inclusiveTo = new Date(dateRange.to.getTime() + 86400000); 
                if (!isWithinInterval(txDate, { start: dateRange.from, end: inclusiveTo })) {
                    return false;
                }
            }

            const searchTermMatch = !searchTerm || t.note?.toLowerCase().includes(searchTerm.toLowerCase());
            const categoryMatch = category === 'All' || t.category === category;
            const typeMatch = transactionType === 'All' || t.type === transactionType;
            const bucketMatch = bucketType === 'All' || t.bucket === bucketType;
            
            return searchTermMatch && categoryMatch && typeMatch && bucketMatch;
        });
    }, [transactions, filters]);
    
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {buckets.map(bucket => <BucketSummaryCard key={bucket.name} bucket={bucket} />)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                       <SpendingChart />
                    </div>
                     <GoalsOverview />
                </div>
                
                <Card className="col-span-1 lg:col-span-3 bg-card/60 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>View and filter all your transactions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <TransactionFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            categories={allUniqueCategories}
                            clearFilters={clearFilters}
                            bucketTypes={['All', 'Needs', 'Wants', 'Savings', 'Investments']}
                         />
                        <TransactionList transactions={filteredTransactions} />
                    </CardContent>
                </Card>
            </div>
        </PageWrapper>
    );
}
