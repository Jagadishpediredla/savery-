
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { ref, onValue, push, set, remove, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { Transaction, Bucket, Goal, Settings, AiChatMessage } from '@/lib/types';
import { seedDatabase as seedDb, clearDatabase as clearDb } from '@/lib/seed';
import { financialAssistant } from '@/ai/flows/financial-assistant-flow';

const userId = 'user1';

interface FirebaseContextType {
    transactions: Transaction[];
    buckets: Bucket[];
    goals: Goal[];
    settings: Settings;
    loading: boolean;
    aiHistory: AiChatMessage[];
    addTransaction: (transaction: Omit<Transaction, 'id' | 'monthlySalary' | 'allocationPercentage'>) => Promise<void>;
    updateSettings: (newSettings: Omit<Settings, 'savingsPercentage'>) => Promise<void>;
    sendChatMessage: (prompt: string) => Promise<void>;
    clearAiHistory: () => Promise<void>;
    seedDatabase: () => Promise<void>;
    clearDatabase: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [settings, setSettings] = useState<Settings>({
        monthlySalary: 75000,
        needsPercentage: 50,
        wantsPercentage: 30,
        investmentsPercentage: 10,
        savingsPercentage: 10,
    });
    const [aiHistory, setAiHistory] = useState<AiChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const settingsRef = ref(db, `users/${userId}/settings/default`);
        const transactionsRef = ref(db, `users/${userId}/transactions`);
        const goalsRef = ref(db, `users/${userId}/goals`);
        const aiHistoryRef = ref(db, `users/${userId}/aiHistory`);

        const settingsUnsub = onValue(settingsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const savingsPercentage = 100 - (data.needsPercentage + data.wantsPercentage + data.investmentsPercentage);
                setSettings({ ...data, savingsPercentage });
            }
        });
        
        const transactionsUnsub = onValue(transactionsRef, (snapshot) => {
            const data = snapshot.val();
            const allTransactions: Transaction[] = [];
            if(data) {
                 for (const year in data) {
                    for (const month in data[year]) {
                        for (const bucket in data[year][month]) {
                             const dailyTransactions = data[year][month][bucket];
                             for (const txnId in dailyTransactions) {
                                allTransactions.push({
                                    id: txnId,
                                    ...dailyTransactions[txnId],
                                })
                             }
                        }
                    }
                }
            }
            setTransactions(allTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        });

        const goalsUnsub = onValue(goalsRef, (snapshot) => {
            const data = snapshot.val();
            setGoals(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
        });

        const aiHistoryUnsub = onValue(aiHistoryRef, (snapshot) => {
            const data = snapshot.val();
            setAiHistory(data ? Object.values(data) : []);
        });

        setLoading(false);

        return () => {
            settingsUnsub();
            transactionsUnsub();
            goalsUnsub();
            aiHistoryUnsub();
        };
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'| 'monthlySalary' | 'allocationPercentage'>) => {
        const txDate = new Date(transaction.date);
        const year = txDate.getFullYear();
        const month = (txDate.getMonth() + 1).toString().padStart(2, '0');
        
        const settingsForMonthRef = ref(db, `users/${userId}/settings/${year}/${month}`);
        let settingsSnapshot = await get(settingsForMonthRef);
        if (!settingsSnapshot.exists()) {
             const defaultSettingsRef = ref(db, `users/${userId}/settings/default`);
             settingsSnapshot = await get(defaultSettingsRef);
        }
        
        const currentSettings = settingsSnapshot.val() || {
            monthlySalary: 0,
            needsPercentage: 50,
            wantsPercentage: 30,
            investmentsPercentage: 10
        };

        const allocationMap: Record<string, number> = {
            'Needs': currentSettings.needsPercentage,
            'Wants': currentSettings.wantsPercentage,
            'Investments': currentSettings.investmentsPercentage,
            'Savings': 100 - (currentSettings.needsPercentage + currentSettings.wantsPercentage + currentSettings.investmentsPercentage),
        }

        const fullTransaction: Omit<Transaction, 'id'> = {
            ...transaction,
            monthlySalary: currentSettings.monthlySalary,
            allocationPercentage: allocationMap[transaction.bucket] || 0
        };

        const sanitizedTransaction = JSON.parse(JSON.stringify(fullTransaction));

        const path = `users/${userId}/transactions/${year}/${month}/${transaction.bucket}`;
        const transactionNodeRef = ref(db, path);
        const newTransactionRef = push(transactionNodeRef);
        await set(newTransactionRef, sanitizedTransaction);
    }, []);


    const updateSettings = useCallback(async (newSettings: Omit<Settings, 'savingsPercentage'>) => {
        const path = `users/${userId}/settings/default`;
        await set(ref(db, path), newSettings);
    }, []);

    const sendChatMessage = useCallback(async (prompt: string) => {
        const userMessage: AiChatMessage = { role: 'user', content: prompt };
        
        let latestHistory: AiChatMessage[] = [];
        setAiHistory(currentHistory => {
            latestHistory = [...currentHistory, userMessage];
            return latestHistory;
        });

        const historyRef = ref(db, `users/${userId}/aiHistory`);
        const userMessageRef = push(historyRef);
        await set(userMessageRef, userMessage);
        
        const flowHistory = latestHistory.slice(0, -1).map(msg => ({
            role: msg.role,
            content: [{ text: msg.content }]
        }));

        try {
            const responseText = await financialAssistant({ prompt, history: flowHistory });
            const modelMessage: AiChatMessage = { role: 'model', content: responseText };

            const modelMessageRef = push(historyRef);
            await set(modelMessageRef, modelMessage);
        } catch (error) {
            console.error("AI Assistant Error:", error);
            const errorMessage: AiChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
             const errorRef = push(historyRef);
            await set(errorRef, errorMessage);
        }
    }, []);

    const clearAiHistory = useCallback(async () => {
        const historyRef = ref(db, `users/${userId}/aiHistory`);
        await remove(historyRef);
    }, []);

    const buckets = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyTransactions = transactions.filter(t => {
            const txDate = new Date(t.date);
            return txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth;
        });

        const getBucketData = (name: 'Needs' | 'Wants' | 'Investments' | 'Savings') => {
            const allocated = (settings.monthlySalary * (settings as any)[`${name.toLowerCase()}Percentage`]) / 100;
            
            let spent = 0;
            if (name === 'Savings') {
                const credits = monthlyTransactions
                    .filter(t => t.bucket === name && t.type === 'Credit')
                    .reduce((sum, t) => sum + t.amount, 0);
                 const debits = monthlyTransactions
                    .filter(t => t.bucket === name && t.type === 'Debit')
                    .reduce((sum, t) => sum + t.amount, 0);
                spent = credits - debits; // For savings, "spent" is net saving.
                 return { name, allocated, spent, balance: allocated + spent };
            } else {
                 spent = monthlyTransactions
                    .filter(t => t.bucket === name && t.type === 'Debit')
                    .reduce((sum, t) => sum + t.amount, 0);
                return { name, allocated, spent, balance: allocated - spent };
            }
        };

        return [
            getBucketData('Needs'),
            getBucketData('Wants'),
            getBucketData('Investments'),
            getBucketData('Savings'),
        ];
    }, [transactions, settings]);

    const value = useMemo(() => ({
        transactions,
        buckets,
        goals,
        settings,
        loading,
        aiHistory,
        addTransaction,
        updateSettings,
        sendChatMessage,
        clearAiHistory,
        seedDatabase: () => seedDb(),
        clearDatabase: () => clearDb(),
    }), [transactions, buckets, goals, settings, loading, aiHistory, addTransaction, updateSettings, sendChatMessage, clearAiHistory]);

    return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};
