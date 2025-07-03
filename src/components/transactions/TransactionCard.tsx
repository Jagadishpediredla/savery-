'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { mockAccounts } from '@/data/mock-data';
import type { Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Plus, Minus } from 'lucide-react';

interface TransactionCardProps {
    transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
    const account = mockAccounts.find(a => a.name === transaction.account);
    const accountTypeInitial = account ? account.type.charAt(0) : '?';

    const accountTypeColor = {
        'N': 'bg-blue-500/20 text-blue-300',
        'W': 'bg-purple-500/20 text-purple-300',
        'S': 'bg-yellow-500/20 text-yellow-300',
        'I': 'bg-indigo-500/20 text-indigo-300',
        '?': 'bg-gray-500/20 text-gray-300',
    }

    return (
        <Card className={cn("transition-all hover:shadow-lg hover:border-accent/50", 
            transaction.type === 'Credit' ? 'bg-green-900/20 border-green-800/50' : 'bg-red-900/20 border-red-800/50'
        )}>
            <CardContent className="p-4 grid grid-cols-12 items-center gap-4">
                {/* Icon */}
                <div className="col-span-1 flex items-center justify-center">
                    <div className={cn("p-2 rounded-full", transaction.type === 'Credit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>
                        {transaction.type === 'Credit' ? <Plus className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
                    </div>
                </div>

                {/* Details */}
                <div className="col-span-11 md:col-span-5">
                    <p className="font-bold text-base">{transaction.category}</p>
                    <p className="text-sm text-muted-foreground">{transaction.note}</p>
                </div>

                {/* Date & Account */}
                <div className="col-span-6 md:col-span-3 text-left md:text-center">
                     <div className="flex items-center gap-2">
                         <Badge 
                            variant="outline"
                            className={cn("w-6 h-6 p-0 flex items-center justify-center font-bold", accountTypeColor[accountTypeInitial as keyof typeof accountTypeColor])}
                         >
                            {accountTypeInitial}
                        </Badge>
                        <span className="text-sm text-muted-foreground hidden md:inline">{transaction.account}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(transaction.date), 'MMM dd, yyyy')}</p>
                </div>

                {/* Amount */}
                <div className="col-span-6 md:col-span-3 text-right">
                    <p className={cn("text-xl font-bold", transaction.type === 'Credit' ? 'text-green-400' : 'text-red-400')}>
                       {transaction.type === 'Credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
