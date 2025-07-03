
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useFirebase } from '@/context/FirebaseContext';
import { DailyTransactionsModal } from './DailyTransactionsModal';
import { isSameDay, parseISO } from 'date-fns';

export function MagicCalendar() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { transactions } = useFirebase();

    const transactionDates = transactions.map(t => parseISO(t.date));

    const handleDayClick = (day: Date) => {
        setSelectedDate(day);
        setIsModalOpen(true);
    };
    
    const dailyTransactions = selectedDate 
        ? transactions.filter(t => isSameDay(parseISO(t.date), selectedDate))
        : [];

    return (
        <>
            <Card className="h-full bg-card/60 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle>Magic Calendar</CardTitle>
                    <CardDescription>Click a date to see daily transactions.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onDayClick={handleDayClick}
                        className="p-0"
                        modifiers={{ hasTransactions: transactionDates }}
                        modifiersStyles={{
                            hasTransactions: {
                                border: "1px solid hsl(var(--primary))",
                                borderRadius: "var(--radius)",
                            }
                        }}
                    />
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
