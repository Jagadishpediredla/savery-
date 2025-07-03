
'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltipContent } from '@/components/ui/chart';

const data = [
  { name: 'New Tickets', value: 38.2, color: 'hsl(var(--chart-2))' },
  { name: 'Returned Tickets', value: 62.8, color: 'hsl(var(--chart-1))' },
];

export function NewVsReturnedChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>New Tickets vs Returned Tickets</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Tooltip
                            content={<ChartTooltipContent indicator="dot" nameKey="name" formatter={(value) => `${value}%`} />}
                        />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={450}
                            strokeWidth={2}
                        >
                            {data.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} stroke={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                    <p className="text-muted-foreground">Returned Tickets</p>
                    <p className="text-2xl font-bold">1,200</p>
                </div>
                 <div className="flex justify-center gap-4 mt-4 w-full text-sm">
                    {data.map(item => (
                        <div key={item.name} className="flex items-center gap-2">
                             <span className="h-3 w-3 rounded-full" style={{backgroundColor: item.color}} />
                            <span>{item.value}% {item.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
