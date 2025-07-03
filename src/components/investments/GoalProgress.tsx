'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Goal } from "@/lib/types";
import { Target } from "lucide-react";

interface GoalProgressProps {
    goal: Goal;
}

export function GoalProgress({ goal }: GoalProgressProps) {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;

    return (
        <Card className="bg-card/60 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle>{goal.name}</CardTitle>
                    <CardDescription>Target: ₹{goal.targetAmount.toLocaleString()}</CardDescription>
                </div>
                <Target className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Progress value={progress} />
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>₹{goal.currentAmount.toLocaleString()}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
