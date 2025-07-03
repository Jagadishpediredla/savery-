
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useFirebase } from "@/context/FirebaseContext";
import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import CountUp from "react-countup";

const chartConfig = {
    Needs: { label: 'Needs', color: 'hsl(var(--chart-3))' },
    Wants: { label: 'Wants', color: 'hsl(var(--chart-2))' },
    Savings: { label: 'Savings', color: 'hsl(var(--chart-1))' },
}

export function SpendingBreakdown() {
    const { transactions, settings } = useFirebase();

    const breakdown = useMemo(() => {
        const result = {
            Needs: { spent: 0, budget: settings.monthlySalary * (settings.needsPercentage / 100) },
            Wants: { spent: 0, budget: settings.monthlySalary * (settings.wantsPercentage / 100) },
            Savings: { spent: 0, budget: settings.monthlySalary * ((settings.investmentsPercentage + settings.savingsPercentage) / 100) }
        }

        transactions.forEach(t => {
            if (t.type === 'Debit') {
                if (result[t.account as keyof typeof result]) {
                    result[t.account as keyof typeof result].spent += t.amount;
                } else if (t.account === 'Investments') {
                     result.Savings.spent += t.amount;
                }
            }
        });

        return result;

    }, [transactions, settings]);

    const totalSpent = breakdown.Needs.spent + breakdown.Wants.spent + breakdown.Savings.spent;
    const totalBudget = breakdown.Needs.budget + breakdown.Wants.budget + breakdown.Savings.budget;

    const pieData = Object.entries(breakdown).map(([key, value]) => ({
        name: key,
        value: value.spent,
        fill: chartConfig[key as keyof typeof chartConfig].color,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Spending for June</CardTitle>
                <CardDescription>Well done, your budget is on track</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                 <div className="relative w-48 h-48">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <PieChart>
                             <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={80}
                                strokeWidth={2}
                            >
                                {pieData.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={entry.fill} stroke={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xs text-muted-foreground">Budget Spent</p>
                        <div className="text-3xl font-bold">
                            <CountUp start={0} end={totalSpent} duration={1.5} separator="," prefix="$" decimals={0} />
                        </div>
                        <p className="text-xs text-muted-foreground">of ${totalBudget.toLocaleString()}</p>
                    </div>
                </div>
                <div className="w-full mt-6 space-y-4 text-sm">
                    {Object.entries(breakdown).map(([key, value]) => (
                         <div key={key} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chartConfig[key as keyof typeof chartConfig].color }}></span>
                                <span>{key}</span>
                            </div>
                            <span className="font-medium">${value.spent.toLocaleString()}/${value.budget.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
