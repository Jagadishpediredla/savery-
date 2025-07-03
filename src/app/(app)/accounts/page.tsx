'use client';

import { PageWrapper } from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAccounts } from "@/data/mock-data";
import { Landmark, Wallet } from "lucide-react";
import CountUp from 'react-countup';

export default function AccountsPage() {
    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
                    <p className="text-muted-foreground">
                        An overview of all your accounts.
                    </p>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {mockAccounts.map(account => (
                        <Card key={account.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
                                <Landmark className="h-4 w-4 text-muted-foreground" />
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
                {/* Future: Transaction history for selected account will go here */}
            </div>
        </PageWrapper>
    );
}
