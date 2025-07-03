
'use client';

import { PageWrapper } from "@/components/PageWrapper";
import { useFirebase } from "@/context/FirebaseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Shield, ShoppingBag, PiggyBank, CandlestickChart, ArrowRight } from "lucide-react";
import type { Account } from "@/lib/types";
import CountUp from 'react-countup';
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountPageLayout } from "@/components/accounts/AccountPageLayout";

const iconMap: { [key in Account['type']]: React.ElementType } = {
    Needs: Shield,
    Wants: ShoppingBag,
    Savings: PiggyBank,
    Investments: CandlestickChart,
};

const AccountCard = ({ account }: { account: Account }) => {
    const Icon = iconMap[account.type];
    const href = `/${account.type.toLowerCase()}`;
    return (
        <Link href={href} passHref>
             <Card className="hover:border-primary/80 hover:shadow-primary/20 transition-all cursor-pointer bg-card/60 backdrop-blur-lg">
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

export default function AccountsPage() {
    const { accounts, transactions, loading } = useFirebase();

    const needsAccountNames = accounts.filter(acc => acc.type === 'Needs').map(acc => acc.name);
    const needsTransactions = transactions.filter(t => needsAccountNames.includes(t.account));
    
    const wantsAccountNames = accounts.filter(acc => acc.type === 'Wants').map(acc => acc.name);
    const wantsTransactions = transactions.filter(t => wantsAccountNames.includes(t.account));

    const savingsAccountNames = accounts.filter(acc => acc.type === 'Savings').map(acc => acc.name);
    const savingsTransactions = transactions.filter(t => savingsAccountNames.includes(t.account));


    if (loading) {
        return (
             <PageWrapper>
                <div className="space-y-8">
                    <header>
                        <Skeleton className="h-9 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </header>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                    </div>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">All Accounts</h1>
                    <p className="text-muted-foreground">
                        An overview of all your financial accounts. Click a card or tab to see details.
                    </p>
                </header>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="needs">Needs</TabsTrigger>
                        <TabsTrigger value="wants">Wants</TabsTrigger>
                        <TabsTrigger value="savings">Savings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {accounts.map(account => <AccountCard key={account.id} account={account} />)}
                        </div>
                    </TabsContent>
                    <TabsContent value="needs" className="mt-6">
                        <AccountPageLayout
                            title="Needs Account"
                            description="Transactions related to your essential spending."
                            transactions={needsTransactions}
                        />
                    </TabsContent>
                    <TabsContent value="wants" className="mt-6">
                        <AccountPageLayout
                            title="Wants Account"
                            description="Transactions related to your discretionary spending."
                            transactions={wantsTransactions}
                        />
                    </TabsContent>
                    <TabsContent value="savings" className="mt-6">
                         <AccountPageLayout
                            title="Savings Account"
                            description="Transactions related to your savings goals."
                            transactions={savingsTransactions}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </PageWrapper>
    );
}
