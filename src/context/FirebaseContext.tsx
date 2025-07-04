
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { ref, onValue, push, set, remove, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { Transaction, Bucket, Goal, Settings, BucketType, Categories } from '@/lib/types';
import { seedDatabase as seedDb, clearDatabase as clearDb } from '@/lib/seed';
import { useToast } from '@/hooks/use-toast';
import { mockAccounts, defaultCategories } from '@/data/mock-data';
import * as financialService from '@/services/firebase-service';


const userId = 'user1';

// The form provides the account name, but not the bucket. 
// We derive the bucket from the account in the addTransaction function.
type AddTransactionInput = Omit<Transaction, 'id' | 'bucket' | 'monthlySalary' | 'allocationPercentage' | 'timestamp'> & { account: string };


interface FirebaseContextType {
    transactions: Transaction[];
    buckets: Bucket[];
    goals: Goal[];
    settings: Settings;
    loading: boolean;
    allCategories: Categories;
    isMapFullscreen: boolean;
    setIsMapFullscreen: (isFS: boolean) => void;
    addTransaction: (transaction: AddTransactionInput) => Promise<void>;
    updateSettings: (newSettings: Omit<Settings, 'savingsPercentage'>) => Promise<void>;
    seedDatabase: () => Promise<void>;
    clearDatabase: () => Promise<void>;
    addCategory: (bucket: BucketType, newCategory: string) => Promise<void>;
    editCategory: (bucket: BucketType, oldCategory: string, newCategory: string) => Promise<void>;
    deleteCategory: (bucket: BucketType, categoryToDelete: string) => Promise<void>;
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
    const [allCategories, setAllCategories] = useState<Categories>(defaultCategories);
    const [loading, setLoading] = useState(true);
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setLoading(true);
        const userRef = ref(db, `users/${userId}`);
        
        const unsub = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Settings
                const dbSettings = data.settings?.default;
                if (dbSettings) {
                    const savingsPercentage = 100 - (dbSettings.needsPercentage + dbSettings.wantsPercentage + dbSettings.investmentsPercentage);
                    setSettings({ ...dbSettings, savingsPercentage });
                } else {
                     setSettings({
                        monthlySalary: 75000,
                        needsPercentage: 50,
                        wantsPercentage: 30,
                        investmentsPercentage: 10,
                        savingsPercentage: 10,
                    });
                }

                // Transactions
                const txData = data.transactions;
                const allTransactions: Transaction[] = [];
                if (txData) {
                    for (const bucket in txData) {
                        for (const year in data[bucket]) {
                            for (const month in data[bucket][year]) {
                                const transactionsForMonth = data[bucket][year][month];
                                for (const txnId in transactionsForMonth) {
                                    const tx = transactionsForMonth[txnId];
                                    allTransactions.push({
                                        id: txnId,
                                        ...tx,
                                        amount: Number(tx.amount || 0), // Ensure amount is a number
                                    });
                                 }
                            }
                        }
                    }
                }
                setTransactions(allTransactions.sort((a,b) => (b.timestamp || 0) - (a.timestamp || 0)));


                // Goals
                const goalsData = data.goals;
                setGoals(goalsData ? Object.keys(goalsData).map(key => ({ id: key, ...goalsData[key] })) : []);

                // Categories
                setAllCategories(data.categories || defaultCategories);

            } else {
                // Handle case where no user data exists
                setTransactions([]);
                setGoals([]);
                setSettings({
                    monthlySalary: 75000,
                    needsPercentage: 50,
                    wantsPercentage: 30,
                    investmentsPercentage: 10,
                    savingsPercentage: 10,
                });
                setAllCategories(defaultCategories);
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const addTransaction = useCallback(async (transaction: AddTransactionInput) => {
        const accountToBucketMap = new Map<string, BucketType>(mockAccounts.map(acc => [acc.name, acc.type]));
        const bucket = accountToBucketMap.get(transaction.account);

        if (!bucket) {
            console.error(`Could not find bucket for account: ${transaction.account}`);
            toast({
                variant: 'destructive',
                title: 'Invalid Account',
                description: `Could not determine the financial bucket for ${transaction.account}.`
            });
            return;
        }

        const txDate = new Date(transaction.date);
        const year = txDate.getFullYear();
        const month = (txDate.getMonth() + 1).toString().padStart(2, '0');
        
        const settingsForMonthRef = ref(db, `users/${userId}/settings/default`);
        const settingsSnapshot = await get(settingsForMonthRef);
        
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
        };

        const fullTransaction: Omit<Transaction, 'id'> = {
            ...transaction,
            amount: Number(transaction.amount),
            bucket: bucket,
            timestamp: new Date().getTime(),
            monthlySalary: currentSettings.monthlySalary,
            allocationPercentage: allocationMap[bucket] || 0,
            category: transaction.category || 'Other',
            note: transaction.note || ''
        };
        
        const removeUndefined = (obj: any): any => {
            const newObj: { [key: string]: any } = {};
            for (const key in obj) {
                if (obj[key] !== undefined) {
                    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                        newObj[key] = removeUndefined(obj[key]);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
            return newObj;
        };
        
        const sanitizedTransaction = removeUndefined(fullTransaction);

        const path = `users/${userId}/transactions/${bucket}/${year}/${month}`;
        const transactionNodeRef = ref(db, path);
        const newTransactionRef = push(transactionNodeRef);
        await set(newTransactionRef, sanitizedTransaction);
    }, [toast]);


    const updateSettings = useCallback(async (newSettings: Omit<Settings, 'savingsPercentage'>) => {
        const path = `users/${userId}/settings/default`;
        await set(ref(db, path), newSettings);
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
            const allocated = (Number(settings.monthlySalary) * (Number((settings as any)[`${name.toLowerCase()}Percentage`]) || 0)) / 100;
            
            let spent = 0;
            if (name === 'Savings') {
                const credits = monthlyTransactions
                    .filter(t => t.bucket === name && t.type === 'Credit')
                    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
                 const debits = monthlyTransactions
                    .filter(t => t.bucket === name && t.type === 'Debit')
                    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
                spent = credits - debits;
                 return { name, allocated, spent, balance: allocated - spent };
            } else {
                 spent = monthlyTransactions
                    .filter(t => t.bucket === name && t.type === 'Debit')
                    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
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

    const addCategory = useCallback(async (bucket: BucketType, newCategory: string) => {
        const currentCategories = allCategories[bucket] || [];
        if (!currentCategories.includes(newCategory)) {
            const newCategories = [...currentCategories, newCategory];
            await financialService.updateCategoriesForBucket(bucket, newCategories);
        }
    }, [allCategories]);

    const editCategory = useCallback(async (bucket: BucketType, oldCategory: string, newCategory: string) => {
        const currentCategories = allCategories[bucket] || [];
        const index = currentCategories.indexOf(oldCategory);
        if (index > -1) {
            const newCategories = [...currentCategories];
            newCategories[index] = newCategory;
            await financialService.updateCategoriesForBucket(bucket, newCategories);
        }
    }, [allCategories]);

    const deleteCategory = useCallback(async (bucket: BucketType, categoryToDelete: string) => {
        const currentCategories = allCategories[bucket] || [];
        const newCategories = currentCategories.filter(c => c !== categoryToDelete);
        await financialService.updateCategoriesForBucket(bucket, newCategories);
    }, [allCategories]);

    const value = useMemo(() => ({
        transactions,
        buckets,
        goals,
        settings,
        loading,
        allCategories,
        isMapFullscreen,
        setIsMapFullscreen,
        addTransaction,
        updateSettings,
        addCategory,
        editCategory,
        deleteCategory,
        seedDatabase: () => seedDb(),
        clearDatabase: () => clearDb(),
    }), [transactions, buckets, goals, settings, loading, allCategories, isMapFullscreen, addTransaction, updateSettings, addCategory, editCategory, deleteCategory]);

    return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};
