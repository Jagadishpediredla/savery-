import { PageWrapper } from "@/components/PageWrapper";
import { GoalProgress } from "@/components/investments/GoalProgress";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { mockGoals, mockTransactions } from "@/data/mock-data";

export default function InvestmentsPage() {
    const investmentTransactions = mockTransactions.filter(
        t => t.category === "Investment" || t.account === "Brokerage"
    );

    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
                    <p className="text-muted-foreground">
                        Track your goals and grow your wealth.
                    </p>
                </header>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Your Goals</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {mockGoals.map(goal => (
                            <GoalProgress key={goal.id} goal={goal} />
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Investment History</h2>
                    <RecentTransactions />
                </div>
            </div>
        </PageWrapper>
    );
}
