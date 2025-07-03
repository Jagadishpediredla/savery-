
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { ref, onValue, push, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { Transaction, Account, Goal, Settings } from '@/lib/types';
import { mockAccounts as accountDefinitions } from '@/data/mock-data';
import { seedDatabase, clearDatabase } from '@/lib/seed';

// Hardcoded user ID for now. In a real app, this would come from an auth system.
const userId = 'user1';

interface FirebaseContextType {
    transactions: Transaction[];
    accounts: Account[];
    goals: Goal[];
    settings: Settings;
    loading: boolean;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    updateSettings: (settings: Omit<Settings, 'savingsPercentage'>) => Promise<void>;
    seedDatabase: () => Promise<void>;
    clearDatabase: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [settings, setSettings] = useState<Settings>({
        monthlySalary: 50000,
        needsPercentage: 50,
        wantsPercentage: 30,
        investmentsPercentage: 15,
        savingsPercentage: 5,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const transactionsRef = ref(db, `users/${userId}/transactions`);
        const goalsRef = ref(db, `users/${userId}/goals`);
        const settingsRef = ref(db, `users/${userId}/settings`);

        const unsubscribeTransactions = onValue(transactionsRef, (snapshot) => {
            const data = snapshot.val();
            const transactionsArray: Transaction[] = [];

            if (data) {
                // Flatten the new hierarchical data structure
                for (const accountType in data) {
                    const years = data[accountType];
                    for (const year in years) {
                        const months = years[year];
                        for (const month in months) {
                            const days = months[month];
                            for (const day in days) {
                                const dailyTransactions = days[day];
                                for (const txnId in dailyTransactions) {
                                    transactionsArray.push({
                                        id: txnId,
                                        ...dailyTransactions[txnId]
                                    });
                                }
                            }
                        }
                    }
                }
            }

            setTransactions(transactionsArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setLoading(false);
        });

        const unsubscribeGoals = onValue(goalsRef, (snapshot) => {
            const data = snapshot.val();
            const goalsArray: Goal[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            setGoals(goalsArray);
        });

        const unsubscribeSettings = onValue(settingsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const savingsPercentage = 100 - (data.needsPercentage + data.wantsPercentage + data.investmentsPercentage);
                setSettings({ ...data, savingsPercentage });
            }
        });

        return () => {
            unsubscribeTransactions();
            unsubscribeGoals();
            unsubscribeSettings();
        };
    }, []);

    const accounts = useMemo(() => {
        const balanceMap = new Map<string, number>();

        // Initialize balances from definitions, though transactions are the source of truth
        accountDefinitions.forEach(acc => balanceMap.set(acc.name, 0));

        // Calculate balances from transactions
        transactions.forEach(t => {
            const currentBalance = balanceMap.get(t.account) ?? 0;
            if (t.type === 'Credit') {
                balanceMap.set(t.account, currentBalance + t.amount);
            } else {
                balanceMap.set(t.account, currentBalance - t.amount);
            }
        });

        return accountDefinitions.map(def => ({
            ...def,
            balance: balanceMap.get(def.name) ?? 0
        }));

    }, [transactions]);


    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        const account = accountDefinitions.find(a => a.name === transaction.account);
        if (!account) {
            console.error("Account definition not found for:", transaction.account);
            return;
        }

        const txDate = new Date(transaction.date);
        const year = txDate.getFullYear();
        const month = (txDate.getMonth() + 1).toString().padStart(2, '0');
        const day = txDate.getDate().toString().padStart(2, '0');

        const path = `users/${userId}/transactions/${account.type}/${year}/${month}/${day}`;
        const transactionNodeRef = ref(db, path);
        const newTransactionRef = push(transactionNodeRef);
        await set(newTransactionRef, transaction);
    };

    const updateSettings = async (newSettings: Omit<Settings, 'savingsPercentage'>) => {
        const settingsRef = ref(db, `users/${userId}/settings`);
        await set(settingsRef, newSettings);
    };

    const value = {
        transactions,
        accounts,
        goals,
        settings,
        loading,
        addTransaction,
        updateSettings,
        seedDatabase,
        clearDatabase,
    };

    return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};
