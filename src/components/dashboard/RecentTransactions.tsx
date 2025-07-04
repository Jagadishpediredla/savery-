'use client';

import type { Transaction } from '@/lib/types';
import { TransactionCard } from '../transactions/TransactionCard';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  // Sort transactions by date in descending order (most recent first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      {sortedTransactions.length > 0 ? (
        <div className="space-y-4">
          {sortedTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-12">
          No transactions found for this period.
        </div>
      )}
    </>
  );
}
