'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Gift, Car, Home } from "lucide-react";

const goals = [
    { name: 'Present', icon: <Gift />, progress: 50, amount: '500' },
    { name: 'New Car', icon: <Car />, progress: 20, amount: '2,000' },
    { name: 'House', icon: <Home />, progress: 80, amount: '20,000' },
];

export function GoalStorageCard() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Goal Storage</CardTitle>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Plus className="w-4 h-4"/>
                    <span className="sr-only">Add new goal</span>
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {goals.map(goal => (
                    <div key={goal.name}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-muted rounded-md">{goal.icon}</div>
                            <div>
                                <p className="font-semibold">{goal.name}</p>
                                <p className="text-sm text-muted-foreground">${goal.amount}</p>
                            </div>
                        </div>
                        <Progress value={goal.progress} />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
