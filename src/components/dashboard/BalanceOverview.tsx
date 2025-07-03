
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
import type { ChartConfig } from '@/components/ui/chart';
import { useFirebase } from '@/context/FirebaseContext';
import { useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

const chartConfig = {
  Needs: { label: 'Needs', color: 'hsl(var(--chart-3))' },
  Wants: { label: 'Wants', color: 'hsl(var(--chart-2))' },
  Savings: { label: 'Savings', color: 'hsl(var(--chart-4))' },
  Investments: { label: 'Investments', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

export function BalanceOverview() {
  const { accounts } = useFirebase();

  const pieData = useMemo(() => {
    return Object.entries(chartConfig)
      .map(([type, config]) => {
        const balance = accounts
          .filter((acc) => acc.type === type)
          .reduce((sum, acc) => sum + acc.balance, 0);
        return {
          name: type,
          value: balance,
          fill: `var(--color-${type})`,
        };
      })
      .filter((item) => item.value > 0);
  }, [accounts]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Balance Overview</CardTitle>
        <CardDescription>Your total balance distribution.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[200px]"
        >
          <PieChart>
              <ChartTooltip
              cursor={false}
              content={
                  <ChartTooltipContent
                  formatter={(value) => `₹${Number(value).toLocaleString()}`}
                  indicator="dot"
                  />
              }
              />
              <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
              {pieData.map((entry) => (
                  <Cell
                  key={`cell-${entry.name}`}
                  fill={entry.fill}
                  stroke={entry.fill}
                  />
              ))}
              </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 space-y-2">
          {pieData.map((entry) => (
            <div
              key={entry.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      chartConfig[entry.name as keyof typeof chartConfig]?.color,
                  }}
                />
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
