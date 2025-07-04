
'use server';

import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { Transaction, Goal, Settings, Account, BucketType } from '@/lib/types';
import { mockAccounts } from '@/data/mock-data';

const userId = 'user1'; // Hardcoded for now

export async function getTransactions(): Promise<Transaction[]> {
    const transactionsRef = ref(db, `users/${userId}/transactions`);
    const snapshot = await get(transactionsRef);
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const transactionsArray: Transaction[] = [];

    const accountTypeMap = new Map(mockAccounts.map(acc => [acc.type, acc.name]));

    for (const year in data) {
        for (const month in data[year]) {
            for (const bucket in data[year][month]) {
                 const transactionsForBucket = data[year][month][bucket];
                 for (const txnId in transactionsForBucket) {
                    const tx = transactionsForBucket[txnId];
                    transactionsArray.push({
                        id: txnId,
                        ...tx,
                        // Explicitly add the bucket from the DB path
                        bucket: bucket as BucketType,
                        // Ensure account field is populated for older seed data
                        account: tx.account || accountTypeMap.get(tx.bucket as BucketType) || 'Unknown'
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
