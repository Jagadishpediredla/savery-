
'use client';

import { PageWrapper } from '@/components/PageWrapper';
import { useFirebase } from '@/context/FirebaseContext';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/dashboard/crm/StatCard';
import { TicketsCreatedChart } from '@/components/dashboard/crm/TicketsCreatedChart';
import { TicketsByTypeChart } from '@/components/dashboard/crm/TicketsByTypeChart';
import { NewVsReturnedChart } from '@/components/dashboard/crm/NewVsReturnedChart';
import { ResolveTimeChart } from '@/components/dashboard/crm/ResolveTimeChart';
import { TicketsByDayChart } from '@/components/dashboard/crm/TicketsByDayChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';

const LoadingSkeleton = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
        </div>
    </div>
);


export default function DashboardPage() {
    const { loading } = useFirebase();
    
    if (loading) {
        return (
            <PageWrapper>
                <LoadingSkeleton />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Avg First Reply Time"
                        value="30"
                        unit="h"
                        value2="15"
                        unit2="min"
                        variant="purple"
                    />
                    <StatCard 
                        title="Avg Full Resolve Time"
                        value="22"
                        unit="h"
                        value2="40"
                        unit2="min"
                        variant="cyan"
                    />
                    <Card>
                        <CardContent className="p-4 flex items-center justify-between">
                            <p className="font-semibold">Messages</p>
                            <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-none">-20%</Badge>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center justify-between">
                             <p className="font-semibold">Emails</p>
                            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-none">+33%</Badge>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                       <TicketsCreatedChart />
                    </div>
                    <div className="space-y-6">
                        <ResolveTimeChart />
                    </div>
                </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <TicketsByTypeChart />
                    <NewVsReturnedChart />
                    <TicketsByDayChart />
                </div>
            </div>
        </PageWrapper>
    );
}
