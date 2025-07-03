'use client';
import { mockAccounts, mockTransactions } from "@/data/mock-data";
import { AccountPageLayout } from "@/components/accounts/AccountPageLayout";

export default function WantsAccountPage() {
    const accountNames = mockAccounts.filter(acc => acc.type === 'Wants').map(acc => acc.name);
    const transactions = mockTransactions.filter(t => accountNames.includes(t.account));

    return (
        <AccountPageLayout
            title="Wants Account"
            description="Transactions related to your discretionary spending."
            transactions={transactions}
        />
    );
}
