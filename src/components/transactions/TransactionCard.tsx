
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { mockAccounts } from '@/data/mock-data';
import type { Transaction, Account } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Plus, Minus } from 'lucide-react';

interface TransactionCardProps {
    transaction: Transaction;
}

const accountTypeColorMap: { [key in Account['type']]: string } = {
    'Needs': 'border-needs/50 bg-needs/10 hover:border-needs/70 text-needs',
    'Wants': 'border-wants/50 bg-wants/10 hover:border-wants/70 text-wants',
    'Savings': 'border-savings/50 bg-savings/10 hover:border-savings/70 text-savings',
    'Investments': 'border-investments/50 bg-investments/10 hover:border-investments/70 text-investments',
};

const badgeColorMap: { [key in Account['type']]: string } = {
    'Needs': 'bg-needs/20 text-needs',
    'Wants': 'bg-wants/20 text-wants',
    'Savings': 'bg-savings/20 text-savings',
    'Investments': 'bg-investments/20 text-investments',
};


export function TransactionCard({ transaction }: TransactionCardProps) {
    const account = mockAccounts.find(a => a.name === transaction.account);
    const accountType = account ? account.type : 'Needs';
    const accountTypeInitial = account ? account.type.charAt(0) : '?';

    const cardColors = accountTypeColorMap[accountType];
    const badgeColors = badgeColorMap[accountType];

    return (
        <Card className={cn(
            "transition-all hover:shadow-lg backdrop-blur-sm", 
            cardColors
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
                    <p className="font-bold text-base text-foreground">{transaction.category}</p>
                    <p className="text-sm text-muted-foreground">{transaction.note}</p>
                </div>

                {/* Date & Account */}
                <div className="col-span-6 md:col-span-3 text-left md:text-center">
                     <div className="flex items-center gap-2">
                         <Badge 
                            variant="outline"
                            className={cn("w-6 h-6 p-0 flex items-center justify-center font-bold border-none", badgeColors)}
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
