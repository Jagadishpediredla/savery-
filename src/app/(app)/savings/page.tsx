
'use client';
import { AccountPageLayout } from "@/components/accounts/AccountPageLayout";
import { useFirebase } from "@/context/FirebaseContext";

export default function SavingsAccountPage() {
    const { accounts, transactions } = useFirebase();

    const accountNames = accounts.filter(acc => acc.type === 'Savings').map(acc => acc.name);
    const savingsTransactions = transactions.filter(t => accountNames.includes(t.account));

    return (
        <AccountPageLayout
            title="Savings Account"
            description="Transactions related to your savings goals."
            transactions={savingsTransactions}
        />
    );
}
