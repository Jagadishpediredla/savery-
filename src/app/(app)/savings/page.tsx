'use client';
import { mockAccounts, mockTransactions } from "@/data/mock-data";
import { AccountPageLayout } from "@/components/accounts/AccountPageLayout";

export default function SavingsAccountPage() {
    const accountNames = mockAccounts.filter(acc => acc.type === 'Savings').map(acc => acc.name);
    const transactions = mockTransactions.filter(t => accountNames.includes(t.account));

    return (
        <AccountPageLayout
            title="Savings Account"
            description="Transactions related to your savings goals."
            transactions={transactions}
        />
    );
}
