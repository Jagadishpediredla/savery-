
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFirebase } from "@/context/FirebaseContext";
import { useMemo } from "react";
import CountUp from "react-countup";

export function CashflowCard() {
    const { transactions } = useFirebase();

    const { earned, spent, remaining } = useMemo(() => {
        let earned = 0;
        let spent = 0;
        transactions.forEach(t => {
            if (t.type === 'Credit') earned += t.amount;
            else spent += t.amount;
        });
        return { earned, spent, remaining: earned - spent };
    }, [transactions]);
    
    const earnedGoal = 6000;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>My Cashflow for June</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Earned</span>
                        <span><span className="font-semibold">${earned.toLocaleString()}</span> of ${earnedGoal.toLocaleString()}</span>
                    </div>
                    <Progress value={(earned / earnedGoal) * 100} className="h-2" />
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Spent</span>
                         <span className="font-semibold">-${spent.toLocaleString()}</span>
                    </div>
                    <Progress value={(spent / earned) * 100} className="h-2 [&>div]:bg-primary" />
                </div>
                <div className="text-right">
                    <p className="text-muted-foreground text-sm">Remaining</p>
                    <p className="text-2xl font-bold">
                        <CountUp start={0} end={remaining} duration={1.5} separator="," prefix="$" />
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
