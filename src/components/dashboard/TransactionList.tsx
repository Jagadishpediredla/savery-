
'use client';

import type { Transaction } from '@/lib/types';
import { TransactionCard } from '../transactions/TransactionCard';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  // Ensure transactions are sorted by timestamp descending
  const sortedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp);

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
