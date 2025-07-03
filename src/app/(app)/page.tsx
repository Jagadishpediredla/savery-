import { PageWrapper } from '@/components/PageWrapper';
import { BalanceOverview } from '@/components/dashboard/BalanceOverview';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAccounts } from '@/data/mock-data';
import { DollarSign, Wallet } from 'lucide-react';
import CountUp from 'react-countup';

export default function DashboardPage() {
  const totalBalance = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <PageWrapper>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your financial overview.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <CountUp
                  start={0}
                  end={totalBalance}
                  duration={2}
                  separator=","
                  prefix="$"
                  decimals={2}
                />
              </div>
              <p className="text-xs text-muted-foreground">Across all accounts</p>
            </CardContent>
          </Card>
          {mockAccounts.slice(0, 3).map(account => (
             <Card key={account.id}>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
               <Wallet className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">
                <CountUp
                  start={0}
                  end={account.balance}
                  duration={1.5}
                  separator=","
                  prefix="$"
                  decimals={2}
                />
               </div>
               <p className="text-xs text-muted-foreground">{account.type} Account</p>
             </CardContent>
           </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <SpendingChart />
            </div>
            <div className="lg:col-span-2">
                <BalanceOverview />
            </div>
        </div>

        <div>
            <RecentTransactions />
        </div>
      </div>
    </PageWrapper>
  );
}
