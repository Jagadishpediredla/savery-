
'use client';

import { PageWrapper } from "@/components/PageWrapper";
import { StatCard } from "@/components/dashboard/support/StatCard";
import { TicketsCreatedChart } from "@/components/dashboard/support/TicketsCreatedChart";
import { TicketsTimeChart } from "@/components/dashboard/support/TicketsTimeChart";
import { TicketsByDayChart } from "@/components/dashboard/support/TicketsByDayChart";
import { TicketsByTypeChart } from "@/components/dashboard/support/TicketsByTypeChart";
import { NewVsReturnedChart } from "@/components/dashboard/support/NewVsReturnedChart";
import { Reply, Clock, Users, Ticket } from "lucide-react";

export default function SupportDashboardPage() {
    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Support Dashboard</h1>
                    <p className="text-muted-foreground">
                        An overview of your customer support performance.
                    </p>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Avg. First Reply Time" value="1h 30m" change="+5%" icon={<Reply className="w-6 h-6" />} />
                    <StatCard title="Avg. Resolve Time" value="8h 15m" change="-2%" icon={<Clock className="w-6 h-6" />} />
                    <StatCard title="New Tickets" value="2,350" change="+150" icon={<Ticket className="w-6 h-6" />} />
                    <StatCard title="Returning Customers" value="890" change="+12%" icon={<Users className="w-6 h-6" />} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                        <TicketsCreatedChart />
                    </div>
                    <div className="lg:col-span-2">
                        <TicketsByDayChart />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                         <TicketsTimeChart />
                    </div>
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TicketsByTypeChart />
                        <NewVsReturnedChart />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
