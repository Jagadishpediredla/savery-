
'use client';

import { useState, useMemo, type ComponentPropsWithRef } from 'react';
import type { DayPicker } from 'react-day-picker';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import type { Transaction, Account } from '@/lib/types';
import { isSameDay, parseISO, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarDayTransactions } from './CalendarDayTransactions';
import { useFirebase } from '@/context/FirebaseContext';

const categoryColors: Record<Account['type'], string> = {
    Needs: 'bg-needs',
    Wants: 'bg-wants',
    Savings: 'bg-savings',
    Investments: 'bg-investments',
};

const categoryLegend: {type: Account['type'], color: string}[] = [
    { type: 'Needs', color: 'bg-needs'},
    { type: 'Wants', color: 'bg-wants'},
    { type: 'Savings', color: 'bg-savings'},
    { type: 'Investments', color: 'bg-investments'},
];


export function FullCalendar({ transactions }: { transactions: Transaction[]}) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { accounts } = useFirebase();
    const [month, setMonth] = useState<Date>(new Date());
    
    const accountTypeMap = useMemo(() => {
        const map = new Map<string, Account['type']>();
        accounts.forEach(acc => map.set(acc.name, acc.type));
        return map;
    }, [accounts]);

    const transactionsByDate = useMemo(() => {
        const map = new Map<string, Set<Account['type']>>();

        transactions.forEach(t => {
            const dateStr = format(parseISO(t.date), 'yyyy-MM-dd');
            const accountType = accountTypeMap.get(t.account);
            if (accountType) {
                if (!map.has(dateStr)) {
                    map.set(dateStr, new Set());
                }
                map.get(dateStr)!.add(accountType);
            }
        });
        return map;
    }, [transactions, accountTypeMap]);

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

    function DayWithDots(props: ComponentPropsWithRef<'button'> & DayProps & { date: Date }) {
        const dateStr = format(props.date, 'yyyy-MM-dd');
        const transactionTypes = transactionsByDate.get(dateStr);
        const { Day } = (props.components || {}) as DayPicker['components'];
        if(!Day) return <></>; // Should not happen with react-day-picker

        return (
            <div className="relative">
                <Day {...props} />
                {transactionTypes && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                        {Array.from(transactionTypes).map(type => (
                            <span key={type} className={cn("h-1.5 w-1.5 rounded-full", categoryColors[type])} />
                        ))}
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <>
            <Card className="bg-card/60 backdrop-blur-lg">
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
                            table: 'w-full border-collapse space-y-1',
                            head_row: 'flex justify-around',
                            row: 'flex w-full mt-2 justify-around',
                            cell: 'h-12 w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                            day: 'h-12 w-full p-0 font-normal aria-selected:opacity-100',
                            day_selected:
                            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                            day_today: 'bg-accent/50 text-accent-foreground rounded-full',
                        }}
                        components={{
                            Day: DayWithDots
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
                <CalendarDayTransactions
                    isOpen={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    date={selectedDate}
                    transactions={dailyTransactions}
                />
            )}
        </>
    );
}
