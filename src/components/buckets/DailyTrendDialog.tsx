
'use client';

import { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts';
import type { Transaction } from '@/lib/types';
import { format, parseISO, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { ChartContainer, ChartTooltipContent } from '../ui/chart';

interface DailyTrendDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    transactions: Transaction[];
    displayMonth: Date;
    bucketType: string;
}

const CustomDot = (props: any) => {
  const { cx, cy, stroke, payload } = props;

  if (payload.total === 0) return null;

  return (
    <g>
        <Dot cx={cx} cy={cy} r={5} fill={stroke} stroke="hsl(var(--background))" strokeWidth={2} />
    </g>
  );
};


export function DailyTrendDialog({ isOpen, onOpenChange, transactions, displayMonth, bucketType }: DailyTrendDialogProps) {

    const chartData = useMemo(() => {
        const start = startOfMonth(displayMonth);
        const end = endOfMonth(displayMonth);
        const daysInMonth = eachDayOfInterval({ start, end });
        
        const data = daysInMonth.map(day => {
            const dayTxs = transactions.filter(tx => isSameDay(parseISO(tx.date), day));
            
            const total = dayTxs.reduce((sum, tx) => {
                if(bucketType === 'Savings') {
                    // Net savings: Credits are positive, Debits are negative
                    return sum + (tx.type === 'Credit' ? Number(tx.amount) : -Number(tx.amount));
                }
                // For other buckets, we only care about spending (Debits)
                return sum + (tx.type === 'Debit' ? Number(tx.amount) : 0)
            }, 0);

            return {
                date: format(day, 'dd'),
                fullDate: day,
                total
            };
        });

        return data;
    }, [transactions, displayMonth, bucketType]);
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl h-[85vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>{bucketType} Trend - {format(displayMonth, 'MMMM yyyy')}</DialogTitle>
                    <DialogDescription>
                        Daily {bucketType === 'Savings' ? 'net savings' : 'spending'} overview for the month.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                    <div className="h-full" style={{ width: '1800px' }}>
                        <ChartContainer config={{}} className="h-full w-full pr-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" padding={{ left: 20, right: 20 }} interval={0}/>
                                    <YAxis tickFormatter={(value) => `₹${value > 1000 ? `${(value/1000).toFixed(0)}k` : value}`} />
                                    <Tooltip content={<ChartTooltipContent indicator="dot" formatter={(value) => `₹${Number(value).toLocaleString()}`}/>} />
                                    <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} dot={<CustomDot />} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
