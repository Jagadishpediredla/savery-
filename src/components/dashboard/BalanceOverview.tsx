'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { mockAccounts } from '@/data/mock-data';
import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const balanceTypes = ['Needs', 'Wants', 'Savings', 'Investments'];
const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export function BalanceOverview() {
    const pieData = useMemo(() => {
        return balanceTypes.map(type => {
            const balance = mockAccounts.filter(acc => acc.type === type).reduce((sum, acc) => sum + acc.balance, 0);
            return { name: type, value: balance };
        }).filter(item => item.value > 0);
    }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Balance Overview</CardTitle>
        <CardDescription>Your total balance distribution.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                        formatter={(value) => `₹${Number(value).toLocaleString()}`}
                        indicator="dot"
                    />}
                />
            </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
            {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}/>
                        <span>{entry.name}</span>
                    </div>
                    <span className="font-medium">
                        ₹{entry.value.toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
