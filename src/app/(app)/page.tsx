
'use client';

import { PageWrapper } from '@/components/PageWrapper';
import { BalanceOverview } from '@/components/dashboard/BalanceOverview';
import { TransactionList } from '@/components/dashboard/RecentTransactions';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirebase } from '@/context/FirebaseContext';
import { Wallet, Shield, ShoppingBag, PiggyBank, CandlestickChart, ArrowRight } from 'lucide-react';
import CountUp from 'react-countup';
import type { Account } from '@/lib/types';
import Link from 'next/link';
import { MagicCalendar } from '@/components/dashboard/MagicCalendar';

const iconMap: { [key in Account['type']]: React.ElementType } = {
    Needs: Shield,
    Wants: ShoppingBag,
    Savings: PiggyBank,
    Investments: CandlestickChart,
};

const AccountCard = ({ account }: { account: Account }) => {
    const Icon = iconMap[account.type] || Wallet;
    const href = `/${account.type.toLowerCase()}`;
    
    // The savings page is now part of investments, so we handle the link redirection
    const finalHref = account.type === 'Savings' ? '/investments' : href;

    return (
        <Link href={finalHref} passHref>
             <Card className="hover:border-primary/80 hover:shadow-primary/20 transition-all cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">{account.name}</CardTitle>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        <CountUp
                            start={0}
                            end={account.balance}
                            duration={1.5}
                            separator=","
                            prefix="₹"
                            decimals={2}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center">
                        Go to {account.type} <ArrowRight className="ml-1 h-3 w-3" />
                    </p>
                </CardContent>
            </Card>
        </Link>
    )
}

export default function DashboardPage() {
  const { accounts, transactions, loading } = useFirebase();
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  if (loading) {
    return (
      <PageWrapper>
        <div className="space-y-8">
          <header>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </header>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
          <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                  <Skeleton className="h-80" />
              </div>
              <div className="lg:col-span-2">
                  <Skeleton className="h-80" />
              </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your financial overview.
          </p>
        </header>

        <Card>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                <CountUp
                  start={0}
                  end={totalBalance}
                  duration={2}
                  separator=","
                  prefix="₹"
                  decimals={2}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all accounts</p>
            </CardContent>
          </Card>

        <div className="grid gap-6 md:grid-cols-2">
            {accounts.map(account => <AccountCard key={account.id} account={account} />)}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <SpendingChart />
            </div>
            <div className="lg:col-span-2">
                <BalanceOverview />
            </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
                <MagicCalendar />
            </div>
            <div className="lg:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>
                        Your latest financial movements.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TransactionList transactions={transactions.slice(0, 10)} />
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </PageWrapper>
  );
}
