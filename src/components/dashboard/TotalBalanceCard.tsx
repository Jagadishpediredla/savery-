
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirebase } from "@/context/FirebaseContext";
import CountUp from "react-countup";
import { Skeleton } from "../ui/skeleton";
import { Shield, ShoppingBag, PiggyBank, CandlestickChart } from "lucide-react";
import AutoSizer from 'react-virtualized-auto-sizer';
import { DashboardStatCard } from "./DashboardStatCard";

export function TotalBalanceCard() {
    const { accounts, loading } = useFirebase();

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    const needsBalance = accounts.find(a => a.type === 'Needs')?.balance ?? 0;
    const wantsBalance = accounts.find(a => a.type === 'Wants')?.balance ?? 0;
    const savingsBalance = accounts.find(a => a.type === 'Savings')?.balance ?? 0;
    const investmentsBalance = accounts.find(a => a.type === 'Investments')?.balance ?? 0;

    if (loading) {
        return (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Skeleton className="h-40 lg:col-span-1 md:col-span-2" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="col-span-1 md:col-span-2 lg:col-span-1 p-6 flex flex-col justify-center bg-card/60 backdrop-blur-lg">
                <CardHeader className="p-0">
                    <CardDescription className="whitespace-nowrap">Total Balance</CardDescription>
                    <CardTitle className="text-4xl font-bold overflow-hidden" style={{ minHeight: '1em' }}> {/* Added minHeight to prevent collapse */}
                         <AutoSizer disableHeight>
                            {({ width }) => {
                                // Simple dynamic font sizing based on container width.
                                // You might need a more sophisticated calculation based on text length.
                                const fontSize = Math.min(48, width / 10); 
                                return (
                                    <span style={{ fontSize: `${fontSize}px` }}>
                                        <CountUp
                                            start={0}
                                            end={totalBalance}
                                            duration={1.5}
                                            separator=","
                                            prefix="₹"
                                            decimals={2} />
                                    </span>
                                );
                            }}
                         </AutoSizer>
                    </CardTitle>

                </CardHeader>
            </Card>

             <DashboardStatCard 
                title="Needs"
                amount={needsBalance}
                icon={<Shield className="h-6 w-6 text-white" />}
                color="bg-gradient-to-tr from-pink-500 to-fuchsia-500"
            />
             <DashboardStatCard 
                title="Wants"
                amount={wantsBalance}
                icon={<ShoppingBag className="h-6 w-6 text-white" />}
                color="bg-gradient-to-tr from-blue-500 to-cyan-500"
            />
             <DashboardStatCard 
                title="Savings"
                amount={savingsBalance}
                icon={<PiggyBank className="h-6 w-6 text-white" />}
                color="bg-gradient-to-tr from-emerald-500 to-green-500"
            />
             <DashboardStatCard 
                title="Investments"
                amount={investmentsBalance}
                icon={<CandlestickChart className="h-6 w-6 text-white" />}
                color="bg-gradient-to-tr from-amber-500 to-orange-500"
            />
        </div>
    );
}
