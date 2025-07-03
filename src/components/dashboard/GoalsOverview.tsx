
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirebase } from "@/context/FirebaseContext";
import { GoalProgress } from "../investments/GoalProgress";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function GoalsOverview() {
    const { goals, loading } = useFirebase();

    if (loading) {
        return (
            <Card className="h-full bg-card/60 backdrop-blur-lg">
                <CardHeader>
                     <Skeleton className="h-6 w-1/2" />
                     <Skeleton className="h-4 w-3/4 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                </CardContent>
            </Card>
        )
    }

    const topGoals = goals.slice(0, 2); // Show top 2 goals on dashboard

    return (
        <Card className="h-full bg-card/60 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Goal Progress</CardTitle>
                    <CardDescription>A summary of your top financial goals.</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm">
                    <Link href="/investments">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {topGoals.length > 0 ? (
                    topGoals.map(goal => <GoalProgress key={goal.id} goal={goal} />)
                ) : (
                    <div className="text-center text-muted-foreground py-10">
                        <p>No goals set up yet.</p>
                        <Button asChild variant="link" className="mt-2">
                           <Link href="/investments">Set a Goal</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
