
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { Transaction, Account, Goal, Settings, AiChatMessage } from '@/lib/types';
import { mockAccounts as accountDefinitions } from '@/data/mock-data';
import { seedDatabase, clearDatabase } from '@/lib/seed';
import { financialAssistant } from '@/ai/flows/financial-assistant-flow';

// Hardcoded user ID for now. In a real app, this would come from an auth system.
const userId = 'user1';

interface FirebaseContextType {
    transactions: Transaction[];
    accounts: Account[];
    goals: Goal[];
    settings: Settings;
    loading: boolean;
    aiHistory: AiChatMessage[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    updateSettings: (settings: Omit<Settings, 'savingsPercentage'>) => Promise<void>;
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
        monthlySalary: 50000,
        needsPercentage: 50,
        wantsPercentage: 30,
        investmentsPercentage: 15,
        savingsPercentage: 5,
    });
    const [aiHistory, setAiHistory] = useState<AiChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const transactionsRef = ref(db, `users/${userId}/transactions`);
        const goalsRef = ref(db, `users/${userId}/goals`);
        const settingsRef = ref(db, `users/${userId}/settings`);
        const aiHistoryRef = ref(db, `users/${userId}/aiHistory`);

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

        const unsubscribeAiHistory = onValue(aiHistoryRef, (snapshot) => {
            const data = snapshot.val();
            const historyArray: AiChatMessage[] = data ? Object.values(data) : [];
            setAiHistory(historyArray);
        });

        return () => {
            unsubscribeTransactions();
            unsubscribeGoals();
            unsubscribeSettings();
            unsubscribeAiHistory();
        };
    }, []);

    const accounts = useMemo(() => {
        const balanceMap = new Map<string, number>();

        accountDefinitions.forEach(acc => balanceMap.set(acc.name, 0));

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


    const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
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
    }, []);

    const updateSettings = useCallback(async (newSettings: Omit<Settings, 'savingsPercentage'>) => {
        const settingsRef = ref(db, `users/${userId}/settings`);
        await set(settingsRef, newSettings);
    }, []);

    const sendChatMessage = useCallback(async (prompt: string) => {
        const userMessage: AiChatMessage = { role: 'user', content: prompt };
        
        // Use a functional update to get the latest history
        let latestHistory: AiChatMessage[] = [];
        setAiHistory(currentHistory => {
            latestHistory = [...currentHistory, userMessage];
            return latestHistory;
        });

        // Save user message to Firebase
        const historyRef = ref(db, `users/${userId}/aiHistory`);
        const userMessageRef = push(historyRef);
        await set(userMessageRef, userMessage);
        
        // Format for Genkit flow (exclude the message we just added)
        const flowHistory = latestHistory.slice(0, -1).map(msg => ({
            role: msg.role,
            content: [{ text: msg.content }]
        }));

        try {
            // Call AI
            const responseText = await financialAssistant({ prompt, history: flowHistory });
            const modelMessage: AiChatMessage = { role: 'model', content: responseText };

            // Save model response to Firebase
            const modelMessageRef = push(historyRef);
            await set(modelMessageRef, modelMessage);
            // UI will update via the onValue listener
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


    const value = useMemo(() => ({
        transactions,
        accounts,
        goals,
        settings,
        loading,
        aiHistory,
        addTransaction,
        updateSettings,
        sendChatMessage,
        clearAiHistory,
        seedDatabase,
        clearDatabase,
    }), [transactions, accounts, goals, settings, loading, aiHistory, addTransaction, updateSettings, sendChatMessage, clearAiHistory]);

    return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};
