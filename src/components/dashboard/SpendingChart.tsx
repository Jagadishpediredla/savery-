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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { mockSpendingData } from '@/data/mock-data';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
  spending: {
    label: 'Spending',
    color: 'hsl(var(--primary))',
  },
};

export function SpendingChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trend</CardTitle>
        <CardDescription>Your spending over the last 7 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart
            data={mockSpendingData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
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
                tickFormatter={(value) => `$${value/1000}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                formatter={(value) => `$${value.toLocaleString()}`}
                indicator="dot"
              />}
            />
            <Area
              type="monotone"
              dataKey="spending"
              stroke="hsl(var(--primary))"
              fillOpacity={1} 
              fill="url(#colorSpending)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
