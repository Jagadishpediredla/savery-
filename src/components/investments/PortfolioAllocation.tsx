
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const chartConfig = {
    Debt: {
        label: 'Debt',
        color: 'hsl(var(--chart-1))',
    },
    Equity: {
        label: 'Equity',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;


export function PortfolioAllocation() {
    const [debt, setDebt] = useState(40);
    const equity = 100 - debt;

    const pieData = [
        { name: 'Debt', value: debt, fill: 'var(--color-Debt)' },
        { name: 'Equity', value: equity, fill: 'var(--color-Equity)' },
    ];

    return (
        <Card className="bg-card/60 backdrop-blur-lg">
            <CardHeader>
                <CardTitle>Portfolio Allocation</CardTitle>
                <CardDescription>Adjust your desired Debt to Equity ratio.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <div>
                            <label className="text-sm font-medium">Debt ({debt}%)</label>
                            <Slider
                                value={[debt]}
                                onValueChange={(vals) => setDebt(vals[0])}
                                max={100}
                                step={1}
                            />
                        </div>
                         <div>
                            <label className="text-sm font-medium">Equity ({equity}%)</label>
                            <Slider
                                disabled
                                value={[equity]}
                                max={100}
                                step={1}
                            />
                        </div>
                    </div>
                    <div>
                         <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full max-h-[150px]">
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent formatter={(value) => `${value}%`} />}
                                />
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry) => (
                                        <Cell key={`cell-${entry.name}`} fill={entry.fill} stroke={entry.fill}/>
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
