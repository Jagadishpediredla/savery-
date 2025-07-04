
'use client';

import { useState, useMemo } from 'react';
import { PageWrapper } from "@/components/PageWrapper";
import { useFirebase } from "@/context/FirebaseContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import type { BucketType, Transaction, LocationData } from "@/lib/types";
import { isWithinInterval, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";
import dynamic from "next/dynamic";
import { cn } from '@/lib/utils';

const MapView = dynamic(() => import('@/components/maps/MapView'), {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />
});

const MapLoadingSkeleton = () => (
    <div className="space-y-8">
        <header>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
        </header>
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <Card className="bg-card/60 backdrop-blur-lg">
            <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-full" />
                <div className="mt-4 space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </CardContent>
        </Card>
    </div>
);

export default function MapsPage() {
    const { loading, transactions, allCategories } = useFirebase();
    const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
    const [mapZoom, setMapZoom] = useState<number | undefined>(undefined);
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);

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
    
    const handleTransactionClick = (location: LocationData) => {
        setMapCenter([location.longitude, location.latitude]);
        setMapZoom(15);
        if (!isMapFullscreen) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <PageWrapper>
                <MapLoadingSkeleton />
            </PageWrapper>
        );
    }
    
    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Transaction Map</h1>
                    <p className="text-muted-foreground">
                        Visualize where your transactions occur. Use the filters below to refine your view.
                    </p>
                </header>
                
                <Card className={cn(
                    "bg-card/60 backdrop-blur-lg h-[400px] transition-all duration-300",
                     isMapFullscreen && "h-[calc(100vh-220px)]"
                )}>
                    <CardContent className="p-2 md:p-4 h-full w-full">
                        <MapView 
                          transactions={filteredTransactions}
                          center={mapCenter}
                          zoom={mapZoom}
                          onViewChange={() => { setMapCenter(undefined); setMapZoom(undefined); }}
                          isFullscreen={isMapFullscreen}
                          onToggleFullscreen={() => setIsMapFullscreen(!isMapFullscreen)}
                        />
                    </CardContent>
                </Card>
                
                {!isMapFullscreen && (
                    <Card className="bg-card/60 backdrop-blur-lg">
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                            <CardDescription>A complete log of your financial activities.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <TransactionFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                categories={allUniqueCategories}
                                clearFilters={clearFilters}
                                bucketTypes={['All', 'Needs', 'Wants', 'Savings', 'Investments']}
                            />
                            <TransactionList 
                                transactions={filteredTransactions}
                                onTransactionClick={handleTransactionClick}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </PageWrapper>
    );
}
