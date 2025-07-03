
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
            <CardHeader className="flex flex-row items-start justify-between">
                <CardTitle className="text-base">{title}</CardTitle>
                 <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-4">
                    <p className="text-4xl font-bold">{value}</p>
                    {icon}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{footerText}</p>
            </CardContent>
        </Card>
    )
}
