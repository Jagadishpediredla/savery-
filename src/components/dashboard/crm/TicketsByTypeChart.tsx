
'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltipContent } from '@/components/ui/chart';

const data = [
  { name: 'Sales', value: 400, color: 'hsl(var(--chart-1))' },
  { name: 'Setup', value: 300, color: 'hsl(var(--chart-2))' },
  { name: 'Bug', value: 200, color: 'hsl(var(--chart-3))' },
  { name: 'Features', value: 278, color: 'hsl(var(--chart-4))' },
];

export function TicketsByTypeChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tickets By Type</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip
                            content={<ChartTooltipContent indicator="dot" nameKey="name" />}
                        />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            strokeWidth={2}
                        >
                            {data.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} stroke={entry.color} />
                            ))}
                        </Pie>
                        <Legend iconType="circle" iconSize={10} verticalAlign="bottom" align="center" />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
