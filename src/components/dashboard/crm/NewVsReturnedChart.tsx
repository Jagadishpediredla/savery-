
'use client';
import { PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const data = [
  { name: 'New Tickets', value: 38.2, fill: 'var(--color-New_Tickets)' },
  { name: 'Returned Tickets', value: 62.8, fill: 'var(--color-Returned_Tickets)' },
];

const chartConfig = {
    'New_Tickets': {
        label: 'New Tickets',
        color: 'hsl(var(--chart-2))'
    },
    'Returned_Tickets': {
        label: 'Returned Tickets',
        color: 'hsl(var(--chart-1))'
    }
} satisfies ChartConfig;

export function NewVsReturnedChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>New Tickets vs Returned Tickets</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex flex-col items-center justify-center">
                <ChartContainer config={chartConfig} className="w-full h-[200px]">
                    <PieChart>
                        <ChartTooltip
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
                                <Cell key={entry.name} fill={entry.fill} stroke={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
                <div className="text-center mt-4">
                    <p className="text-muted-foreground">Returned Tickets</p>
                    <p className="text-2xl font-bold">1,200</p>
                </div>
                 <div className="flex justify-center gap-4 mt-4 w-full text-sm">
                    <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full" style={{backgroundColor: 'hsl(var(--chart-2))'}} />
                        <span>38.2% New Tickets</span>
                    </div>
                    <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full" style={{backgroundColor: 'hsl(var(--chart-1))'}} />
                        <span>62.8% Returned Tickets</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
