
'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Transaction } from '@/lib/types';
import { TransactionCard } from '../transactions/TransactionCard';
import { useFirebase } from '@/context/FirebaseContext';


interface RecentTransactionsProps {
  transactions?: Transaction[];
}

export function RecentTransactions({ transactions: transactionsProp }: RecentTransactionsProps) {
  const { transactions: contextTransactions } = useFirebase();
  const transactions = transactionsProp || contextTransactions;
  
  const displayTransactions = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Your latest financial movements.
        </CardDescription>
      </CardHeader>
      <div className="p-0 sm:p-2 md:p-4">
        {displayTransactions.length > 0 ? (
          <div className="space-y-4">
            {displayTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            No transactions found for this period.
          </div>
        )}
      </div>
    </Card>
  );
}
