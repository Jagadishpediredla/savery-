
'use client';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BudgetProgressProps {
    spent: number;
    allocated: number;
    bucketType: string;
}

export function BudgetProgress({ spent, allocated, bucketType }: BudgetProgressProps) {
    const progress = allocated > 0 ? (spent / allocated) * 100 : 0;
    const isOverspent = spent > allocated;
    const isSavings = bucketType === 'Savings';

    return (
        <div className="space-y-3">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isSavings ? 'Saved' : 'Spent'}</span>
                <span className="font-medium">₹{spent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <Progress 
                value={Math.min(100, progress)} 
                indicatorClassName={cn(isOverspent && !isSavings && "bg-destructive")} 
            />
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isSavings ? 'Goal' : 'Budget'}</span>
                <span className="font-medium">₹{allocated.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
        </div>
    )
}
