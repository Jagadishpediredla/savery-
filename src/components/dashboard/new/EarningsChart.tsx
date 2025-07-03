
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo, useState, useEffect } from "react";
import { useFirebase } from "@/context/FirebaseContext";
import { format, parseISO, startOfMonth } from 'date-fns';
import CountUp from "react-countup";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-2 border rounded-md shadow-lg">
          <p className="label">{`${label} : $${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
};

export function EarningsChart() {
    const { transactions } = useFirebase();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { chartData, totalEarnings, changeSinceLastWeek } = useMemo(() => {
        const monthlyData: { [key: string]: number } = {};
        let totalEarnings = 0;

        transactions.forEach(t => {
            if (t.type === 'Credit') {
                const month = format(startOfMonth(parseISO(t.date)), 'MMM');
                if (!monthlyData[month]) {
                    monthlyData[month] = 0;
                }
                monthlyData[month] += t.amount;
                totalEarnings += t.amount;
            }
        });

        const sortedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartData = sortedMonths.map(month => ({
            name: month,
            earnings: monthlyData[month] || 0
        })).slice(0, new Date().getMonth() + 1);

        // Dummy change data
        const changeSinceLastWeek = 42;

        return { chartData, totalEarnings, changeSinceLastWeek };
    }, [transactions]);
    
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>My Cashflow for June</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-48">
                    {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsla(var(--muted), 0.5)' }}/>
                                <Area type="monotone" dataKey="earnings" stroke="hsl(var(--chart-3))" fill="url(#colorEarnings)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <Skeleton className="h-48 w-full" />
                    )}
                </div>

                <div className="mt-4 space-y-4">
                    <div>
                        <p className="text-3xl font-bold">
                           <CountUp start={0} end={2878.90} duration={1.5} separator="," prefix="$" decimals={2}/>
                        </p>
                        <p className="text-sm text-green-400">+{changeSinceLastWeek} since last week</p>
                    </div>
                     <div className="flex gap-2">
                        <Button size="sm" variant="secondary" className="flex-1">0.9087 ETH</Button>
                        <Button size="sm" variant="secondary" className="flex-1">0.5 BTC</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
