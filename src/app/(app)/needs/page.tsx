'use client';
import { PageWrapper } from "@/components/PageWrapper";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { mockAccounts, mockTransactions } from "@/data/mock-data";

export default function NeedsAccountPage() {
    const needsAccountNames = mockAccounts.filter(acc => acc.type === 'Needs').map(acc => acc.name);
    const transactions = mockTransactions.filter(t => needsAccountNames.includes(t.account));

    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Needs Account</h1>
                    <p className="text-muted-foreground">
                        Transactions related to your essential spending.
                    </p>
                </header>
                
                {/* Placeholder for future filter bar */}
                
                <RecentTransactions transactions={transactions} />
            </div>
        </PageWrapper>
    );
}
