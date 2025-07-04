'use client';

import { useState, useMemo, type ComponentPropsWithRef } from 'react';
import type { DayProps, DayPicker } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useFirebase } from '@/context/FirebaseContext';
import { DailyTransactionsModal } from './DailyTransactionsModal';
import { isSameDay, parseISO, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockAccounts } from '@/data/mock-data';
import type { Account } from '@/lib/types';

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


export function MagicCalendar() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { transactions } = useFirebase();

    const transactionsByDate = useMemo(() => {
        const accountTypeMap = new Map(mockAccounts.map(acc => [acc.name, acc.type]));
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
            <Card className="h-full bg-card/60 backdrop-blur-lg flex flex-col">
                <CardHeader>
                    <CardTitle>Magic Calendar</CardTitle>
                    <CardDescription>Dates with transactions are marked with colored dots.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center p-4">
                    <Calendar
                        mode="single"
                        onDayClick={handleDayClick}
                        className="p-0"
                        components={{
                            Day: DayWithDots,
                        }}
                        classNames={{
                            day: "text-foreground", // Ensure default day text is visible
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
                            day_today: "text-accent-foreground rounded-full bg-accent/50",
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
                <DailyTransactionsModal
                    isOpen={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    date={selectedDate}
                    transactions={dailyTransactions}
                />
            )}
        </>
    );
}
