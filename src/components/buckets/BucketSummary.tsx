
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart } from 'lucide-react';
import type { BucketType } from '@/lib/types';
import CountUp from 'react-countup';
import { BudgetProgress } from './BudgetProgress';

interface BucketSummaryProps {
    bucketType: BucketType;
    spent: number;
    allocated: number;
    onShowTrend: () => void;
}

export function BucketSummary({ bucketType, spent, allocated, onShowTrend }: BucketSummaryProps) {
    const remaining = allocated - spent;
    const isOverspent = remaining < 0;
    const isSavings = bucketType === 'Savings';

    return (
        <Card className="bg-card/60 backdrop-blur-lg h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Monthly Summary</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onShowTrend}>
                        <LineChart className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col justify-center">
                <div className="text-4xl font-bold">
                    <CountUp
                        start={0}
                        end={remaining}
                        duration={1.5}
                        separator=","
                        prefix="₹"
                        decimals={0}
                    />
                </div>
                <p className="text-sm text-muted-foreground">
                    {isOverspent && !isSavings
                        ? `You've overspent by ₹${Math.abs(remaining).toLocaleString()}.`
                        : isSavings
                        ? `You have ₹${remaining.toLocaleString()} left to save towards your goal.`
                        : `You have ₹${remaining.toLocaleString()} left in your budget.`}
                </p>
                <BudgetProgress spent={spent} allocated={allocated} bucketType={bucketType} />
            </CardContent>
        </Card>
    );
}
