'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockTransactions } from '@/data/mock-data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Your latest financial movements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Details</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-full", transaction.type === 'Credit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>
                        {transaction.type === 'Credit' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    </div>
                    <div>
                        <p className="font-medium">{transaction.note}</p>
                        <p className="text-sm text-muted-foreground">{transaction.account}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{transaction.category}</Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell className={cn("text-right font-semibold", transaction.type === 'Credit' ? 'text-green-400' : 'text-red-400')}>
                    {transaction.type === 'Credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
