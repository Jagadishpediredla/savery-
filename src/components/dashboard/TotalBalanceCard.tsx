'use client';

import { Card, CardContent } from "@/components/ui/card";
import { useFirebase } from "@/context/FirebaseContext";
import CountUp from "react-countup";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useMemo, useState, useEffect } from "react";
import { parseISO, startOfMonth, format } from "date-fns";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
    balance: { color: 'hsl(var(--chart-1))' },
};

export function TotalBalanceCard() {
    const { accounts, transactions } = useFirebase();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const totalBalance = useMemo(() => {
        return accounts.reduce((sum, acc) => sum + acc.balance, 0);
    }, [accounts]);

    const balanceHistory = useMemo(() => {
        if (transactions.length === 0) return [];

        const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        let cumulativeBalance = 0;
        const dataMap = new Map<string, number>();

        sortedTransactions.forEach(t => {
            if (t.type === 'Credit') cumulativeBalance += t.amount;
            else cumulativeBalance -= t.amount;
            
            const month = format(startOfMonth(parseISO(t.date)), 'MMM');
            dataMap.set(month, cumulativeBalance);
        });

        return Array.from(dataMap.entries()).map(([month, balance]) => ({
            month,
            balance,
        }));
    }, [transactions]);
    
    return (
        <Card className="col-span-1 lg:col-span-4">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">Total Balance</p>
                    <p className="text-4xl font-bold">
                        <CountUp
                            start={0}
                            end={totalBalance}
                            duration={1.5}
                            separator=","
                            prefix="₹"
                            decimals={2}
                        />
                    </p>
                    <p className="text-sm text-green-400">+15% from last month</p>
                </div>
                <div className="h-24 w-full md:w-1/3">
                    {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={balanceHistory} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartConfig.balance.color} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={chartConfig.balance.color} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="balance" stroke={chartConfig.balance.color} fill="url(#colorBalance)" strokeWidth={2} dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ): (
                        <Skeleton className="h-full w-full" />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
