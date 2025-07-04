
'use server';

import { ref, get, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { Transaction, Goal, Settings, Account, BucketType, Categories } from '@/lib/types';
import { defaultCategories, mockAccounts } from '@/data/mock-data';

const userId = 'user1'; // Hardcoded for now

export async function getTransactions(): Promise<Transaction[]> {
    const transactionsRef = ref(db, `users/${userId}/transactions`);
    const snapshot = await get(transactionsRef);
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const transactionsArray: Transaction[] = [];

    // New structure: transactions/{bucket}/{year}/{month}
    for (const bucket in data) {
        for (const year in data[bucket]) {
            for (const month in data[bucket][year]) {
                const transactionsForMonth = data[bucket][year][month];
                for (const txnId in transactionsForMonth) {
                    const tx = transactionsForMonth[txnId];
                    transactionsArray.push({
                        id: txnId,
                        ...tx,
                        bucket: bucket as BucketType, // The bucket is now the top-level key
                    })
                 }
            }
        }
    }

    return transactionsArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}


export async function getGoals(): Promise<Goal[]> {
    const goalsRef = ref(db, `users/${userId}/goals`);
    const snapshot = await get(goalsRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.keys(data).map(key => ({ id: key, ...data[key] }));
}

export async function getSettings(): Promise<Settings | null> {
    const settingsRef = ref(db, `users/${userId}/settings/default`);
    const snapshot = await get(settingsRef);
    if (!snapshot.exists()) return null;
    
    const defaultSettings = snapshot.val();

    if (defaultSettings) {
        const savingsPercentage = 100 - (defaultSettings.needsPercentage + defaultSettings.wantsPercentage + defaultSettings.investmentsPercentage);
        return { ...defaultSettings, savingsPercentage };
    }
    
    return null;
}

export async function getAccounts(): Promise<(Account & { balance: number })[]> {
    const transactions = await getTransactions();
    const accountBalances = new Map<string, number>();

    // Initialize with 0
    mockAccounts.forEach(acc => accountBalances.set(acc.name, 0));

    // Calculate balances from transactions
    transactions.forEach(t => {
        const currentBalance = accountBalances.get(t.account) ?? 0;
        if (t.type === 'Credit') {
            accountBalances.set(t.account, currentBalance + t.amount);
        } else {
            accountBalances.set(t.account, currentBalance - t.amount);
        }
    });

    return mockAccounts.map(acc => ({
        ...acc,
        balance: accountBalances.get(acc.name) ?? 0
    }));
}

export async function getCategories(): Promise<Categories> {
    const categoriesRef = ref(db, `users/${userId}/categories`);
    const snapshot = await get(categoriesRef);
    if (!snapshot.exists()) {
        return defaultCategories;
    }
    return snapshot.val();
}

export async function updateCategoriesForBucket(bucketType: BucketType, categories: string[]): Promise<void> {
    const categoryRef = ref(db, `users/${userId}/categories/${bucketType}`);
    await set(categoryRef, categories);
}
