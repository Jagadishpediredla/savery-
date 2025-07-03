
'use client';
import { AccountPageLayout } from "@/components/accounts/AccountPageLayout";
import { useFirebase } from "@/context/FirebaseContext";

export default function NeedsAccountPage() {
    const { accounts, transactions } = useFirebase();

    const needsAccountNames = accounts.filter(acc => acc.type === 'Needs').map(acc => acc.name);
    const needsTransactions = transactions.filter(t => needsAccountNames.includes(t.account));

    return (
        <AccountPageLayout
            title="Needs Account"
            description="Transactions related to your essential spending."
            transactions={needsTransactions}
        />
    );
}
