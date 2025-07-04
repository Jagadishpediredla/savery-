
'use client';

import { useState, useMemo, type ComponentPropsWithRef } from 'react';
import type { DayPicker } from 'react-day-picker';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import type { Transaction, BucketType } from '@/lib/types';
import { isSameDay, parseISO, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DayTransactionsDialog } from './DayTransactionsDialog';
import { useFirebase } from '@/context/FirebaseContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bucketColors: Record<BucketType, string> = {
    Needs: 'bg-chart-3',
    Wants: 'bg-chart-2',
    Savings: 'bg-chart-4',
    Investments: 'bg-chart-5',
};

const categoryLegend: {type: BucketType, color: string}[] = [
    { type: 'Needs', color: 'bg-chart-3'},
    { type: 'Wants', color: 'bg-chart-2'},
    { type: 'Investments', color: 'bg-chart-5'},
    { type: 'Savings', color: 'bg-chart-4'},
];


export function AnalyticsCalendar({ transactions }: { transactions: Transaction[]}) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [month, setMonth] = useState<Date>(new Date());
    
    const transactionsByDate = useMemo(() => {
        const map = new Map<string, Set<BucketType>>();

        transactions.forEach(t => {
            const dateStr = format(parseISO(t.date), 'yyyy-MM-dd');
            const bucketType = t.bucket;
            if (bucketType) {
                if (!map.has(dateStr)) {
                    map.set(dateStr, new Set());
                }
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
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">{format(month, "MMMM yyyy")}</h2>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <ToggleGroup type="single" defaultValue="month" variant="outline" className="hidden md:flex">
                        <ToggleGroupItem value="month">Month</ToggleGroupItem>
                        <ToggleGroupItem value="week" disabled>Week</ToggleGroupItem>
                        <ToggleGroupItem value="day" disabled>Day</ToggleGroupItem>
                    </ToggleGroup>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                     <Calendar
                        mode="single"
                        month={month}
                        onMonthChange={setMonth}
                        onDayClick={handleDayClick}
                        className="p-0 w-full"
                        classNames={{
                            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full',
                            month: 'space-y-4 w-full',
                            caption: 'hidden', // Hiding default caption, using custom header
                            table: 'w-full border-collapse space-y-1',
                            head_row: 'flex justify-around',
                            row: 'flex w-full mt-2 justify-around',
                            cell: 'h-16 w-full text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
                            day: 'h-full w-full p-0 font-normal aria-selected:opacity-100 rounded-lg',
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                            day_today: 'bg-accent/50 text-accent-foreground rounded-lg',
                            day_outside: "day-outside text-muted-foreground/70 opacity-50",
                        }}
                        components={{
                            Day: DayWithDots,
                            IconLeft: () => null,
                            IconRight: () => null
                        }}
                    />
                     <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs text-muted-foreground">
                        {categoryLegend.map(item => (
                             <div key={item.type} className="flex items-center gap-2">
                                <span className={cn("h-2 w-2 rounded-full", item.color)} />
                                <span>{item.type}</span>
                            </div>
                        ))}
                    </div>
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
