
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, Home, MoreHorizontal, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const habits = [
    { title: "LYFT Savings", description: "Waste Management", progress: 60, goal: 100, daysLeft: 12, icon: <Droplet /> },
    { title: "<$50 on Gas", description: "Employer Challenge", progress: 23, goal: 100, daysLeft: 15, icon: <Droplet /> },
    { title: "Travel", description: "", progress: 60, goal: 100, daysLeft: 12, icon: <Droplet /> },
]

export function FinancialHabits() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Improving Financial Habits</CardTitle>
                 <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {habits.map(habit => (
                    <Card key={habit.title} className="bg-background/50">
                        <CardHeader>
                             <div className="w-10 h-10 bg-green-500/10 text-green-500 flex items-center justify-center rounded-full mb-2">
                                {habit.icon}
                            </div>
                            <CardTitle className="text-base">{habit.title}</CardTitle>
                            {habit.description && <CardDescription>{habit.description}</CardDescription>}
                        </CardHeader>
                        <CardContent>
                            <Progress value={habit.progress} className="h-2" />
                            <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                                <span>${habit.progress}/${habit.goal}</span>
                                <span>{habit.daysLeft} days left</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                 <Card className="bg-background/50 flex flex-col items-center justify-center min-h-[180px] text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer">
                    <Home className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Add Home</span>
                </Card>
            </CardContent>
        </Card>
    )
}
