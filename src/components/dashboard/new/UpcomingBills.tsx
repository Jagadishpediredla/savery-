'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Droplet, Wifi, Film } from "lucide-react";

const bills = [
    { icon: <Droplet />, category: 'Water Bill', date: 'Dec 24', amount: '60.00', color: 'bg-blue-500/10 text-blue-500' },
    { icon: <Wifi />, category: 'Internet Bill', date: 'Dec 26', amount: '75.50', color: 'bg-green-500/10 text-green-500' },
    { icon: <Film />, category: 'Netflix', date: 'Dec 28', amount: '15.00', color: 'bg-red-500/10 text-red-500' },
]

export function UpcomingBills() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Bills</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {bills.map(bill => (
                         <li key={bill.category} className="flex items-center gap-4">
                            <div className={cn("w-10 h-10 flex items-center justify-center rounded-full", bill.color)}>
                                {bill.icon}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{bill.category}</p>
                                <p className="text-xs text-muted-foreground">{bill.date}</p>
                            </div>
                            <span className="font-bold">${bill.amount}</span>
                            <Button size="sm" variant="outline">Pay</Button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
