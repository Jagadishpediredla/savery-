
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PiggyBank, MoreHorizontal } from "lucide-react";
import CountUp from "react-countup";
import { Pie, PieChart, Cell } from "recharts";
import { useState, useEffect } from "react";

const goal = 6000;
const current = 4200;
const progress = (current / goal) * 100;

const pieData = [
  { name: 'Current', value: current },
  { name: 'Remaining', value: goal - current },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

export function GoalStorageCard() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Stored For Goals</CardTitle>
                 <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative h-24 w-24">
                    {isMounted ? (
                        <PieChart width={96} height={96}>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={40}
                                dataKey="value"
                                stroke="none"
                                startAngle={90}
                                endAngle={450}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    ) : (
                        <div className="h-24 w-24" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                            <PiggyBank className="w-8 h-8" />
                         </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-2xl font-bold">
                        <CountUp start={0} end={current} duration={1.5} separator="," prefix="$" /> /
                        <span className="text-muted-foreground">${goal.toLocaleString()}</span>
                    </p>
                </div>

                <Button variant="secondary" className="w-full">
                    Save more with Round Up
                </Button>

            </CardContent>
        </Card>
    )
}
