
'use client';
import { AccountPageLayout } from "@/components/accounts/AccountPageLayout";
import { useFirebase } from "@/context/FirebaseContext";

export default function WantsAccountPage() {
    const { accounts, transactions } = useFirebase();
    
    const accountNames = accounts.filter(acc => acc.type === 'Wants').map(acc => acc.name);
    const wantsTransactions = transactions.filter(t => accountNames.includes(t.account));

    return (
        <AccountPageLayout
            title="Wants Account"
            description="Transactions related to your discretionary spending."
            transactions={wantsTransactions}
        />
    );
}
