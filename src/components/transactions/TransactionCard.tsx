
'use client';

import { cn } from '@/lib/utils';
import type { Transaction } from '@/lib/types';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface TransactionCardProps {
    transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
    const isCredit = transaction.type === 'Credit';

    return (
        <div className="flex items-center gap-4 py-3">
            <div className={cn(
                "p-2 rounded-full flex items-center justify-center",
                isCredit ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            )}>
                {isCredit ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
            </div>
            <div className="flex-1">
                <p className="font-semibold">{transaction.category}</p>
                <p className="text-sm text-muted-foreground">{transaction.note}</p>
            </div>
            <div className="text-right">
                 <p className={cn("font-bold", isCredit ? "text-green-400" : "text-red-400")}>
                    {isCredit ? '+' : '-'}₹{(transaction.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
        </div>
    );
}
