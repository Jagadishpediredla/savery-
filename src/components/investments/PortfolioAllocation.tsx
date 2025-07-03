'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'];

export function PortfolioAllocation() {
    const [debt, setDebt] = useState(40);
    const equity = 100 - debt;

    const pieData = [
        { name: 'Debt', value: debt },
        { name: 'Equity', value: equity },
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
                         <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "var(--radius)"
                                    }}
                                    formatter={(value) => `${value}%`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
