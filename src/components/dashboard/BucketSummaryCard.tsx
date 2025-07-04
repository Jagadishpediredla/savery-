
'use client';

import Link from 'next/link';
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
    const Icon = iconMap[bucket.name];
    const href = `/${bucket.name.toLowerCase()}`;

    return (
        <Link href={href} passHref>
            <Card className="bg-card/60 backdrop-blur-lg transition-all hover:border-primary/80 hover:shadow-lg hover:shadow-primary/20 h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1 md:p-4 md:pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">{bucket.name}</CardTitle>
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />}
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
                    <div className="text-xl md:text-2xl font-bold">
                         <CountUp
                            start={0}
                            end={bucket.balance}
                            duration={1.5}
                            separator=","
                            prefix="₹"
                            decimals={0}
                        />
                    </div>
                    <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                        Spent: ₹{bucket.spent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
}
