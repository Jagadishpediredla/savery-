
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useFirebase } from '@/context/FirebaseContext';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format, parseISO, startOfMonth } from 'date-fns';
import { mockAccounts } from '@/data/mock-data';

const chartConfig = {
  needs: { label: 'Needs', color: 'hsl(var(--chart-3))' },
  wants: { label: 'Wants', color: 'hsl(var(--chart-2))' },
  investments: { label: 'Investments', color: 'hsl(var(--chart-5))' },
};

export function SpendingChart() {
  const { transactions } = useFirebase();

  const monthlyBreakdown = useMemo(() => {
    const accountTypeMap = new Map(mockAccounts.map(acc => [acc.name, acc.type]));
    
    const monthlyData: { [key: string]: { Needs: number, Wants: number, Investments: number, Savings: number } } = {};

    transactions.forEach(t => {
      if (t.type === 'Debit') {
        const month = format(startOfMonth(parseISO(t.date)), 'MMM yyyy');
        if (!monthlyData[month]) {
          monthlyData[month] = { Needs: 0, Wants: 0, Investments: 0, Savings: 0 };
        }
        const accountType = accountTypeMap.get(t.account);
        if (accountType && (accountType === 'Needs' || accountType === 'Wants' || accountType === 'Investments')) {
          monthlyData[month][accountType] += t.amount;
        }
      }
    });
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month: month.split(' ')[0], // just 'May', 'Jun', etc.
      needs: data.Needs,
      wants: data.Wants,
      investments: data.Investments,
    })).sort((a,b) => new Date(a.month + " 1, 2024").getTime() - new Date(b.month + " 1, 2024").getTime()); // A bit hacky sort
  }, [transactions]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trend</CardTitle>
        <CardDescription>Your spending over the last months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart
            data={monthlyBreakdown}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
                <linearGradient id="colorNeeds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-needs)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-needs)" stopOpacity={0}/>
                </linearGradient>
                 <linearGradient id="colorWants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-wants)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-wants)" stopOpacity={0}/>
                </linearGradient>
                 <linearGradient id="colorInvestments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-investments)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-investments)" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${Number(value)/1000}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                formatter={(value, name) => `₹${Number(value).toLocaleString()}`}
                indicator="dot"
              />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="needs"
              name="Needs"
              stackId="1"
              stroke="var(--color-needs)"
              fill="url(#colorNeeds)"
              strokeWidth={2}
            />
             <Area
              type="monotone"
              dataKey="wants"
              name="Wants"
              stackId="1"
              stroke="var(--color-wants)"
              fill="url(#colorWants)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="investments"
              name="Investments"
              stackId="1"
              stroke="var(--color-investments)"
              fill="url(#colorInvestments)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
