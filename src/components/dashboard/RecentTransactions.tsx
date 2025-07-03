'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockTransactions } from '@/data/mock-data';
import type { Transaction } from '@/lib/types';
import { TransactionCard } from '../transactions/TransactionCard';


interface RecentTransactionsProps {
  transactions?: Transaction[];
}

export function RecentTransactions({ transactions = mockTransactions }: RecentTransactionsProps) {
  const displayTransactions = transactions.slice(0, 5); // Show latest 5 or all if prop is passed

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Your latest financial movements.
        </CardDescription>
      </CardHeader>
      <div className="p-0 sm:p-2 md:p-4">
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
      </div>
    </Card>
  );
}
