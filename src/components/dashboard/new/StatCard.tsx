
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    footerText: string;
    icon: React.ReactNode;
}

export function StatCard({ title, value, footerText, icon }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                 <Button variant="ghost" size="icon" className="w-8 h-8 -mt-2 -mr-2">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">{value}</p>
                    {icon}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{footerText}</p>
            </CardContent>
        </Card>
    )
}
