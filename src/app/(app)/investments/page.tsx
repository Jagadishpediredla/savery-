
'use client';

import { PageWrapper } from "@/components/PageWrapper";
import { GoalProgress } from "@/components/investments/GoalProgress";
import { PortfolioAllocation } from "@/components/investments/PortfolioAllocation";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirebase } from "@/context/FirebaseContext";

export default function InvestmentsPage() {
    const { transactions, goals, accounts } = useFirebase();

    const investmentAccountNames = accounts.filter(acc => acc.type === 'Investments').map(acc => acc.name);
    const investmentTransactions = transactions.filter(t => investmentAccountNames.includes(t.account));

    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
                    <p className="text-muted-foreground">
                        Track your goals and grow your wealth.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                         <PortfolioAllocation />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Your Goals</h2>
                        {goals.length > 0 ? goals.map(goal => (
                            <GoalProgress key={goal.id} goal={goal} />
                        )) : (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-muted-foreground text-center">No investment goals set up yet.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Investment History</h2>
                    <RecentTransactions transactions={investmentTransactions} />
                </div>
            </div>
        </PageWrapper>
    );
}
