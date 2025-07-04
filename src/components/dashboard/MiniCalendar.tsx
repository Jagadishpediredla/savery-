
'use client';

import { useState, useMemo, type ComponentPropsWithRef } from 'react';
import type { DayPicker } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import type { Transaction, BucketType } from '@/lib/types';
import { isSameDay, parseISO, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DayTransactionsDialog } from '../calendar/DayTransactionsDialog';
import { useFirebase } from '@/context/FirebaseContext';

const bucketColors: Record<BucketType, string> = {
    Needs: 'bg-chart-3',
    Wants: 'bg-chart-2',
    Savings: 'bg-chart-4',
    Investments: 'bg-chart-5',
};

export function MiniCalendar() {
    const { transactions } = useFirebase();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const transactionsByDate = useMemo(() => {
        const map = new Map<string, Set<BucketType>>();
        transactions.forEach(t => {
            const dateStr = format(parseISO(t.date), 'yyyy-MM-dd');
            const bucketType = t.bucket;
            if (bucketType) {
                if (!map.has(dateStr)) map.set(dateStr, new Set());
                map.get(dateStr)!.add(bucketType);
            }
        });
        return map;
    }, [transactions]);

    const handleDayClick = (day: Date) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        if (transactionsByDate.has(dateStr)) {
            setSelectedDate(day);
            setIsModalOpen(true);
        }
    };
    
    const dailyTransactions = selectedDate 
        ? transactions.filter(t => isSameDay(parseISO(t.date), selectedDate))
        : [];

    function DayWithDots(props: ComponentPropsWithRef<'button'> & { date: Date }) {
        const dateStr = format(props.date, 'yyyy-MM-dd');
        const transactionTypes = transactionsByDate.get(dateStr);
        const { Day } = (props.components || {}) as DayPicker['components'];
        if(!Day) return <></>; 

        return (
            <div className="relative h-full w-full flex items-center justify-center">
                <Day {...props} />
                {transactionTypes && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                        {Array.from(transactionTypes).map(type => (
                            <span key={type} className={cn("h-1.5 w-1.5 rounded-full", bucketColors[type])} />
                        ))}
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <>
            <Card className="bg-card/60 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle>Magic Calendar</CardTitle>
                    <CardDescription>A quick glance at your month's activities.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Calendar
                        mode="single"
                        onDayClick={handleDayClick}
                        className="p-0 w-full"
                        components={{ Day: DayWithDots }}
                        classNames={{
                             caption_label: "hidden",
                             nav_button: "h-8 w-8",
                             nav_button_next: "absolute right-1 top-1",
                             nav_button_previous: "absolute left-1 top-1",
                        }}
                    />
                </CardContent>
            </Card>
             {selectedDate && (
                <DayTransactionsDialog
                    isOpen={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    date={selectedDate}
                    transactions={dailyTransactions}
                />
            )}
        </>
    );
}
