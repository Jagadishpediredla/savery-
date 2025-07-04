
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CountUp from 'react-countup';
import type { Bucket, BucketType } from "@/lib/types";
import { Shield, ShoppingBag, PiggyBank, CandlestickChart } from "lucide-react";

interface BucketSummaryCardProps {
    bucket: Bucket;
}

const iconMap: Record<BucketType, React.ElementType> = {
    Needs: Shield,
    Wants: ShoppingBag,
    Savings: PiggyBank,
    Investments: CandlestickChart,
};


export function BucketSummaryCard({ bucket }: BucketSummaryCardProps) {
    const isOverspent = bucket.balance < 0;
    const Icon = iconMap[bucket.name];

    return (
        <Card className="bg-card/60 backdrop-blur-lg transition-all hover:border-primary/80 hover:shadow-lg hover:shadow-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{bucket.name}</CardTitle>
                {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                     <CountUp
                        start={0}
                        end={bucket.balance}
                        duration={1.5}
                        separator=","
                        prefix="₹"
                        decimals={2}
                    />
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                    <span>Spent: ₹{bucket.spent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    <span className={cn(isOverspent ? 'text-red-500' : 'text-green-500')}>
                        {isOverspent ? 'Over' : 'Under'}: ₹{Math.abs(bucket.allocated - bucket.spent).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
