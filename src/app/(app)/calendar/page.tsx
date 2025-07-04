
'use client';

import { PageWrapper } from "@/components/PageWrapper";
import { AnalyticsCalendar } from "@/components/calendar/AnalyticsCalendar";
import { useFirebase } from "@/context/FirebaseContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarPage() {
    const { transactions, loading } = useFirebase();

    if (loading) {
        return (
            <PageWrapper>
                <div className="space-y-8">
                    <header>
                        <Skeleton className="h-9 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </header>
                    <Skeleton className="h-[calc(100vh-250px)] w-full" />
                </div>
            </PageWrapper>
        )
    }
    
    return (
        <PageWrapper>
             <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Financial Calendar</h1>
                    <p className="text-muted-foreground">
                        An interactive calendar view of your transactions. Click on a date to see details.
                    </p>
                </header>
                <AnalyticsCalendar transactions={transactions} />
            </div>
        </PageWrapper>
    );
}
