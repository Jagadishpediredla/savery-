
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const bills = [
    { date: 'JUN 1', name: 'Rent', amount: 1100.00, due: true },
    { date: 'JUN 15', name: 'LADWP', amount: 34.00, due: false },
    { date: 'AUG 30', name: 'State Farm', amount: 108.00, due: false },
]

export function UpcomingBills() {
    const totalDue = bills.reduce((acc, bill) => acc + bill.amount, 0);

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>Upcoming Bills</CardTitle>
                    <CardDescription>Total Bills Due in the Next 30 Days: ${totalDue.toLocaleString(undefined, {minimumFractionDigits: 2})}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {bills.map(bill => (
                        <li key={bill.name} className="flex items-center gap-4">
                           <div className="flex flex-col items-center">
                                <span className={cn("text-xs font-bold", bill.due ? "text-primary" : "text-muted-foreground")}>{bill.date.split(' ')[0]}</span>
                                <span className={cn("text-lg font-semibold", bill.due ? "text-foreground" : "text-muted-foreground")}>{bill.date.split(' ')[1]}</span>
                           </div>
                           <div className="flex-1">
                               <p className="font-semibold">{bill.name}</p>
                           </div>
                           <div className="text-right">
                               <p className="font-semibold">${bill.amount.toFixed(2)}</p>
                           </div>
                           <Button size="sm" variant={bill.due ? "default" : "secondary"}>
                                {bill.due ? 'Mark Paid' : 'Pay Now'}
                           </Button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
