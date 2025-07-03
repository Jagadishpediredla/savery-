'use server';

import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { Transaction, Account, Goal, Settings } from '@/lib/types';
import { mockAccounts as accountDefinitions } from '@/data/mock-data';

const userId = 'user1'; // Hardcoded for now

export async function getTransactions(): Promise<Transaction[]> {
    const transactionsRef = ref(db, `users/${userId}/transactions`);
    const snapshot = await get(transactionsRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    const transactionsArray: Transaction[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
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
    const settingsRef = ref(db, `users/${userId}/settings`);
    const snapshot = await get(settingsRef);
    if (!snapshot.exists()) return null;
    const data = snapshot.val();
    const savingsPercentage = 100 - (data.needsPercentage + data.wantsPercentage + data.investmentsPercentage);
    return { ...data, savingsPercentage };
}

export async function getAccounts(): Promise<Account[]> {
    const transactions = await getTransactions();
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
}
