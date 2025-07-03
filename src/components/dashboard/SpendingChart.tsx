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
import { mockMonthlyBreakdown } from '@/data/mock-data';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
  needs: {
    label: 'Needs',
    color: 'hsl(var(--chart-1))',
  },
  wants: {
    label: 'Wants',
    color: 'hsl(var(--chart-2))',
  },
  investments: {
    label: 'Investments',
    color: 'hsl(var(--chart-3))',
  }
};

export function SpendingChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trend</CardTitle>
        <CardDescription>Your spending over the last months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart
            data={mockMonthlyBreakdown}
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
                formatter={(value) => `₹${Number(value).toLocaleString()}`}
                indicator="dot"
              />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="needs"
              stackId="1"
              stroke="var(--color-needs)"
              fill="url(#colorNeeds)"
              strokeWidth={2}
            />
             <Area
              type="monotone"
              dataKey="wants"
              stackId="1"
              stroke="var(--color-wants)"
              fill="url(#colorWants)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="investments"
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
