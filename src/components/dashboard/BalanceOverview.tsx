'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockAccounts } from '@/data/mock-data';

const balanceTypes = ['Needs', 'Wants', 'Savings', 'Investments'];

export function BalanceOverview() {
    const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const balances = balanceTypes.map(type => {
        const balance = mockAccounts.filter(acc => acc.type === type).reduce((sum, acc) => sum + acc.balance, 0);
        const percentage = totalBalance > 0 ? (balance / totalBalance) * 100 : 0;
        return { type, balance, percentage };
    });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Balance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {balances.map(({ type, balance, percentage }) => (
            <div key={type} className="space-y-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-medium">{type}</h3>
                <span className="text-lg font-bold">${balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
              <Progress value={percentage} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
