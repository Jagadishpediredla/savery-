
'use client';

import { cn } from '@/lib/utils';
import type { Transaction } from '@/lib/types';
import { ArrowDownLeft, ArrowUpRight, MapPin } from 'lucide-react';

interface TransactionCardProps {
    transaction: Transaction;
    onClick?: () => void;
}

export function TransactionCard({ transaction, onClick }: TransactionCardProps) {
    const isCredit = transaction.type === 'Credit';
    const hasLocation = !!transaction.location;

    const Wrapper = onClick ? 'button' : 'div';

    return (
        <Wrapper
            className={cn(
                "flex items-center gap-4 py-3 w-full text-left",
                onClick && "cursor-pointer hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors"
            )}
            onClick={onClick}
        >
            <div className={cn(
                "p-2 rounded-full flex items-center justify-center",
                isCredit ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            )}>
                {isCredit ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
            </div>
            <div className="flex-1 space-y-1">
                <p className="font-semibold">{transaction.category}</p>
                <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <span>{transaction.account}</span>
                    {transaction.note && <><span>&middot;</span><span className='truncate'>{transaction.note}</span></>}
                </div>
            </div>
            <div className="text-right flex items-center gap-2">
                {hasLocation && <MapPin className="h-4 w-4 text-muted-foreground" />}
                <div>
                     <p className={cn("font-bold", isCredit ? "text-green-400" : "text-red-400")}>
                        {isCredit ? '+' : '-'}₹{(transaction.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
            </div>
        </Wrapper>
    );
}
