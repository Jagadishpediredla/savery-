
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { TransactionCard } from '../transactions/TransactionCard';

interface CalendarDayTransactionsProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    date: Date;
    transactions: Transaction[];
}

export function CalendarDayTransactions({ isOpen, onOpenChange, date, transactions }: CalendarDayTransactionsProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Transactions for {format(date, "MMMM dd, yyyy")}</DialogTitle>
                    <DialogDescription>
                        A log of all financial movements on this day.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                    {transactions.length > 0 ? (
                        <div className="space-y-4 py-4">
                            {transactions.map(transaction => (
                                <TransactionCard key={transaction.id} transaction={transaction} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-12">
                            No transactions found for this day.
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
