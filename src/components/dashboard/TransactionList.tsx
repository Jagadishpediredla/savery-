
'use client';

import type { Transaction } from '@/lib/types';
import { TransactionCard } from '../transactions/TransactionCard';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <>
      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((transaction) => (
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
