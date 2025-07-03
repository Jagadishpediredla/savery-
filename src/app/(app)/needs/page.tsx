'use client';
import { mockAccounts, mockTransactions } from "@/data/mock-data";
import { AccountPageLayout } from "@/components/accounts/AccountPageLayout";

export default function NeedsAccountPage() {
    const needsAccountNames = mockAccounts.filter(acc => acc.type === 'Needs').map(acc => acc.name);
    const transactions = mockTransactions.filter(t => needsAccountNames.includes(t.account));

    return (
        <AccountPageLayout
            title="Needs Account"
            description="Transactions related to your essential spending."
            transactions={transactions}
        />
    );
}
