
'use client';

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { useFirebase } from '@/context/FirebaseContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { parseISO, isSameMonth, format, subMonths, addMonths, startOfMonth } from 'date-fns';
import type { BucketType } from '@/lib/types';
import { SpendingByCategoryChart } from '../analytics/SpendingByCategoryChart';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NetBalanceTrendChart } from './NetBalanceTrendChart';
import { TransactionFilters } from '../transactions/TransactionFilters';
import { BucketSummary } from './BucketSummary';
import { DailyTrendDialog } from './DailyTrendDialog';

const LoadingSkeleton = () => (
  <div className="space-y-8">
    <header>
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-4 w-64 mt-2" />
    </header>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      <Skeleton className="lg:col-span-2 h-[350px]" />
      <Skeleton className="lg:col-span-3 h-[350px]" />
    </div>
    <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="lg:col-span-2 h-96" />
        <Skeleton className="h-96" />
    </div>
  </div>
);

interface BucketPageLayoutProps {
  bucketType: BucketType;
  title: string;
  description: string;
}

export function BucketPageLayout({ bucketType, title, description }: BucketPageLayoutProps) {
  const { transactions, loading, allCategories, settings } = useFirebase();
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [isTrendDialogOpen, setIsTrendDialogOpen] = useState(false);

  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'All',
    transactionType: 'All' as 'All' | 'Credit' | 'Debit',
  });

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'All',
      transactionType: 'All',
    });
  };

  const handlePrevMonth = () => {
    setDisplayMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(prev => addMonths(prev, 1));
  };

  const isNextMonthDisabled = useMemo(() => {
    const nextMonth = startOfMonth(addMonths(new Date(), 1));
    return displayMonth >= startOfMonth(subMonths(nextMonth,1));
  }, [displayMonth]);


  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => 
        t.bucket === bucketType && isSameMonth(parseISO(t.date), displayMonth)
    ).sort((a,b) => b.timestamp - a.timestamp);
  }, [transactions, bucketType, displayMonth]);
  
  const availableCategories = useMemo(() => {
    return ['All', ...(allCategories[bucketType] || [])];
  }, [allCategories, bucketType]);

  const { spent, allocated } = useMemo(() => {
     const percentageKey = `${bucketType.toLowerCase()}Percentage` as keyof typeof settings;
      const bucketPercentage = (settings as any)[percentageKey] || 0;
      const allocated = (Number(settings.monthlySalary) * Number(bucketPercentage)) / 100;

      let spent = 0;
      if (bucketType === 'Savings') {
          const credits = monthlyTransactions
              .filter(t => t.type === 'Credit')
              .reduce((sum, t) => sum + Number(t.amount || 0), 0);
           const debits = monthlyTransactions
              .filter(t => t.type === 'Debit')
              .reduce((sum, t) => sum + Number(t.amount || 0), 0);
          spent = credits - debits;
      } else {
           spent = monthlyTransactions
              .filter(t => t.type === 'Debit')
              .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      }
      return { spent, allocated };

  }, [monthlyTransactions, bucketType, settings]);


  const filteredTransactions = useMemo(() => {
    return monthlyTransactions.filter(t => {
      const searchTermMatch = !filters.searchTerm || t.note?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const categoryMatch = filters.category === 'All' || t.category === filters.category;
      const typeMatch = filters.transactionType === 'All' || t.type === filters.transactionType;
      return searchTermMatch && categoryMatch && typeMatch;
    });
  }, [monthlyTransactions, filters]);
  
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-32 text-center">{format(displayMonth, "MMMM yyyy")}</span>
                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNextMonth} disabled={isNextMonthDisabled}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BucketSummary 
              bucketType={bucketType}
              spent={spent}
              allocated={allocated}
              onShowTrend={() => setIsTrendDialogOpen(true)}
            />
            <Card className="bg-card/60 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                    <CardDescription>Top {bucketType === 'Savings' ? 'income sources' : 'spending categories'} for {format(displayMonth, "MMMM")}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SpendingByCategoryChart transactions={transactions} displayMonth={displayMonth} bucketType={bucketType} />
                </CardContent>
            </Card>
        </div>
        
        <Card className="bg-card/60 backdrop-blur-lg">
            <CardHeader>
                <CardTitle>Net Balance Trend</CardTitle>
                <CardDescription>Your net balance (budget - spent) over time.</CardDescription>
            </CardHeader>
            <CardContent>
                <NetBalanceTrendChart bucketType={bucketType} />
            </CardContent>
        </Card>
        
        <Card className="bg-card/60 backdrop-blur-lg">
          <CardHeader>
            <CardTitle>Transactions for {format(displayMonth, "MMMM yyyy")}</CardTitle>
            <CardDescription>All transactions for {format(displayMonth, "MMMM yyyy")}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <TransactionFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={availableCategories}
                clearFilters={clearFilters}
                bucketType={bucketType}
             />
            <TransactionList transactions={filteredTransactions} />
          </CardContent>
        </Card>
      </div>
      <DailyTrendDialog 
        isOpen={isTrendDialogOpen}
        onOpenChange={setIsTrendDialogOpen}
        transactions={monthlyTransactions}
        displayMonth={displayMonth}
        bucketType={bucketType}
      />
    </PageWrapper>
  );
}
