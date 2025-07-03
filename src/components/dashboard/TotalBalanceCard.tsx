
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirebase } from "@/context/FirebaseContext";
import CountUp from "react-countup";
import { Skeleton } from "../ui/skeleton";
import { Shield, ShoppingBag, PiggyBank, CandlestickChart } from "lucide-react";
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
            </div>
        )
    }

    return (
        <>
            <Card className="col-span-1 md:col-span-2 lg:col-span-4 p-6">
                <CardHeader className="p-0">
                    <CardDescription>Total Balance</CardDescription>
                    <CardTitle className="text-4xl font-bold">
                         <CountUp
                            start={0}
                            end={totalBalance}
                            duration={1.5}
                            separator=","
                            prefix="₹"
                            decimals={2}
                        />
                    </CardTitle>
                </CardHeader>
            </Card>

             <DashboardStatCard 
                title="Needs"
                amount={needsBalance}
                progress={50}
                icon={<Shield className="h-6 w-6" />}
                color="bg-needs/20 text-needs"
            />
             <DashboardStatCard 
                title="Wants"
                amount={wantsBalance}
                progress={30}
                icon={<ShoppingBag className="h-6 w-6" />}
                color="bg-wants/20 text-wants"
            />
             <DashboardStatCard 
                title="Savings"
                amount={savingsBalance}
                progress={15}
                icon={<PiggyBank className="h-6 w-6" />}
                color="bg-savings/20 text-savings"
            />
             <DashboardStatCard 
                title="Investments"
                amount={investmentsBalance}
                progress={5}
                icon={<CandlestickChart className="h-6 w-6" />}
                color="bg-investments/20 text-investments"
            />
        </>
    );
}
