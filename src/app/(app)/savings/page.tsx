'use client';
import { PageWrapper } from "@/components/PageWrapper";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { mockAccounts, mockTransactions } from "@/data/mock-data";

export default function SavingsAccountPage() {
    const accountNames = mockAccounts.filter(acc => acc.type === 'Savings').map(acc => acc.name);
    const transactions = mockTransactions.filter(t => accountNames.includes(t.account));

    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Savings Account</h1>
                    <p className="text-muted-foreground">
                        Transactions related to your savings goals.
                    </p>
                </header>
                
                {/* Placeholder for future filter bar */}
                
                <RecentTransactions transactions={transactions} />
            </div>
        </PageWrapper>
    );
}
