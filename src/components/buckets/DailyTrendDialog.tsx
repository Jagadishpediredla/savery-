
'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts';
import type { Transaction } from '@/lib/types';
import { format, parseISO, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { ChartContainer, ChartTooltipContent } from '../ui/chart';
import { TransactionCard } from '../transactions/TransactionCard';
import { Card } from '../ui/card';

interface DailyTrendDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    transactions: Transaction[];
    displayMonth: Date;
    bucketType: string;
}

const CustomDot = (props: any) => {
  const { cx, cy, stroke, payload, onClick } = props;

  if (payload.total === 0) return null;

  return (
    <g onClick={() => onClick(payload)} className="cursor-pointer">
        <Dot cx={cx} cy={cy} r={5} fill={stroke} stroke="hsl(var(--background))" strokeWidth={2} />
    </g>
  );
};


export function DailyTrendDialog({ isOpen, onOpenChange, transactions, displayMonth, bucketType }: DailyTrendDialogProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const { chartData, dailyTransactionsMap } = useMemo(() => {
        const start = startOfMonth(displayMonth);
        const end = endOfMonth(displayMonth);
        const daysInMonth = eachDayOfInterval({ start, end });

        const dailyTransactionsMap = new Map<string, Transaction[]>();
        transactions.forEach(tx => {
            const dateStr = format(parseISO(tx.date), 'yyyy-MM-dd');
            if (!dailyTransactionsMap.has(dateStr)) {
                dailyTransactionsMap.set(dateStr, []);
            }
            dailyTransactionsMap.get(dateStr)!.push(tx);
        });
        
        const data = daysInMonth.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayTxs = dailyTransactionsMap.get(dateStr) || [];
            const total = dayTxs.reduce((sum, tx) => {
                if(bucketType === 'Savings') {
                    return sum + (tx.type === 'Credit' ? Number(tx.amount) : -Number(tx.amount));
                }
                return sum + (tx.type === 'Debit' ? Number(tx.amount) : 0)
            }, 0);

            return {
                date: format(day, 'dd'),
                fullDate: day,
                total
            };
        });

        return { chartData: data, dailyTransactionsMap };
    }, [transactions, displayMonth, bucketType]);
    
    const handleDotClick = (data: any) => {
        if(data && data.payload && data.payload.fullDate) {
            setSelectedDate(data.payload.fullDate);
        }
    };
    
    const selectedDayTransactions = selectedDate 
        ? dailyTransactionsMap.get(format(selectedDate, 'yyyy-MM-dd')) || [] 
        : [];
        
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{bucketType} Trend - {format(displayMonth, 'MMMM yyyy')}</DialogTitle>
                    <DialogDescription>
                        Daily {bucketType === 'Savings' ? 'net savings' : 'spending'} overview. Click on a dot to see transactions for that day.
                    </DialogDescription>
                </DialogHeader>
                <div className="h-1/2 flex-shrink-0">
                    <ScrollArea className="w-full h-full">
                        <div className="w-full h-full" style={{ minWidth: '1200px' }}>
                            <ChartContainer config={{}} className="h-full pr-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" padding={{ left: 20, right: 20 }}/>
                                        <YAxis tickFormatter={(value) => `₹${value > 1000 ? `${(value/1000).toFixed(0)}k` : value}`} />
                                        <Tooltip content={<ChartTooltipContent indicator="dot" formatter={(value) => `₹${Number(value).toLocaleString()}`}/>} />
                                        <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} dot={<CustomDot onClick={handleDotClick} />} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
                 <div className="flex-1 flex flex-col overflow-hidden">
                    <h3 className="font-semibold text-lg mb-2 shrink-0">
                         {selectedDate ? `Transactions for ${format(selectedDate, 'MMM dd')}`: 'Click a dot to see daily transactions'}
                    </h3>
                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        {selectedDayTransactions.length > 0 ? (
                            <div className="space-y-2">
                                {selectedDayTransactions.map(tx => <TransactionCard key={tx.id} transaction={tx} />)}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                {selectedDate ? 'No transactions for this day.' : ''}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    )
}
