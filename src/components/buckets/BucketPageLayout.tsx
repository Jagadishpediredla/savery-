
'use client';

import { useState, useMemo } from 'react';
import type { DateRange } from 'react-day-picker';
import { PageWrapper } from '@/components/PageWrapper';
import { useFirebase } from '@/context/FirebaseContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionList } from '@/components/dashboard/RecentTransactions';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { parseISO, isWithinInterval } from 'date-fns';
import type { Transaction, BucketType } from '@/lib/types';
import { SpendingByCategoryChart } from '../analytics/SpendingByCategoryChart';
import { MonthlyBucketTrendChart } from './MonthlyBucketTrendChart';

const LoadingSkeleton = () => (
  <div className="space-y-8">
    <header>
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-4 w-64 mt-2" />
    </header>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      <Skeleton className="lg:col-span-2 h-[250px]" />
      <Skeleton className="lg:col-span-3 h-[250px]" />
    </div>
    <Skeleton className="h-96" />
  </div>
);

interface BucketPageLayoutProps {
  bucketType: BucketType;
  title: string;
  description: string;
}

export function BucketPageLayout({ bucketType, title, description }: BucketPageLayoutProps) {
  const { transactions, loading } = useFirebase();

  const [filters, setFilters] = useState<{
    dateRange: DateRange | undefined;
    searchTerm: string;
    category: string;
    transactionType: 'All' | 'Credit' | 'Debit';
  }>({
    dateRange: undefined,
    searchTerm: '',
    category: 'All',
    transactionType: 'All',
  });
  
  const bucketTransactions = useMemo(() => {
    return transactions.filter(t => t.bucket === bucketType);
  }, [transactions, bucketType]);


  const filteredTransactions = useMemo(() => {
    const { dateRange, searchTerm, category, transactionType } = filters;
    return bucketTransactions.filter((t: Transaction) => {
      const txDate = parseISO(t.date);
      const isDateMatch = !dateRange?.from || isWithinInterval(txDate, {
        start: dateRange.from,
        end: dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)) : dateRange.from,
      });
      const isSearchMatch = !searchTerm || (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase()));
      const isTypeMatch = transactionType === 'All' || t.type === transactionType;
      const isCategoryMatch = category === 'All' || t.category === category;
      
      return isDateMatch && isSearchMatch && isTypeMatch && isCategoryMatch;
    });
  }, [bucketTransactions, filters]);
  
  const categories = useMemo(() => ['All', ...Array.from(new Set(bucketTransactions.map(t => t.category || 'Other')))], [bucketTransactions]);

  if (loading) {
    return (
      <PageWrapper>
        <LoadingSkeleton />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <SpendingByCategoryChart transactions={filteredTransactions} />
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                 <CardHeader>
                    <CardTitle>Spending Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <MonthlyBucketTrendChart bucketType={bucketType} />
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Review and filter your transactions below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TransactionFilters
              filters={filters}
              onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
              categories={categories}
              clearFilters={() => setFilters({
                dateRange: undefined,
                searchTerm: '',
                category: 'All',
                transactionType: 'All',
              })}
            />
            <TransactionList transactions={filteredTransactions} />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
