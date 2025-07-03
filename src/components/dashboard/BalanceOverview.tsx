
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
import { Cell, Pie, PieChart, ResponsiveContainer, Label } from 'recharts';

const chartConfig = {
  Needs: { label: 'Needs', color: 'hsl(var(--chart-3))' },
  Wants: { label: 'Wants', color: 'hsl(var(--chart-2))' },
  Savings: { label: 'Savings', color: 'hsl(var(--chart-4))' },
  Investments: { label: 'Investments', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

export function BalanceOverview() {
  const { accounts } = useFirebase();

  const { pieData, totalBalance } = useMemo(() => {
    const data = Object.entries(chartConfig)
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
      
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return { pieData: data, totalBalance: total };
  }, [accounts]);

  return (
    <Card className="h-full bg-card/60 backdrop-blur-lg">
      <CardHeader>
        <CardTitle>Balance Overview</CardTitle>
        <CardDescription>Your total balance distribution.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
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
                  innerRadius={60}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                      <Cell
                      key={`cell-${entry.name}`}
                      fill={entry.fill}
                      stroke={entry.fill}
                      />
                  ))}
                   <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground text-xl font-bold"
                          >
                            {`₹${totalBalance.toLocaleString()}`}
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
            </PieChart>
          </ResponsiveContainer>
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
