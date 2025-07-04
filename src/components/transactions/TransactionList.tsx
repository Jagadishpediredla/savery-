
'use client';

import type { Transaction, LocationData } from '@/lib/types';
import { TransactionCard } from '../transactions/TransactionCard';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (location: LocationData) => void;
}

export function TransactionList({ transactions, onTransactionClick }: TransactionListProps) {
  const sortedTransactions = [...transactions].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  return (
    <>
      {sortedTransactions.length > 0 ? (
        <div className="space-y-4">
          {sortedTransactions.map((transaction) => (
            <TransactionCard 
                key={transaction.id} 
                transaction={transaction}
                onClick={transaction.location && onTransactionClick ? () => onTransactionClick(transaction.location!) : undefined}
            />
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
