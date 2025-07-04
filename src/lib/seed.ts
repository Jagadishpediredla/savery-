

import { ref, set, remove, push } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { Transaction, Goal, Settings, BucketType, Categories } from '@/lib/types';
import { defaultCategories, mockAccounts, mockNotes } from '@/data/mock-data';

const userId = 'user1';

// Helper to get random item from array
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate random date in the past year
const getRandomDateForMonth = (year: number, month: number): string => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};


const generateRandomTransactions = (year: number, month: number, settings: Omit<Settings, 'savingsPercentage'>, categories: Categories): Omit<Transaction, 'id'>[] => {
  const transactions: Omit<Transaction, 'id'>[] = [];
  const numTransactions = Math.floor(Math.random() * 40) + 20; // 20-60 transactions per month

  const allocationMap: Record<string, number> = {
      'Needs': settings.needsPercentage,
      'Wants': settings.wantsPercentage,
      'Investments': settings.investmentsPercentage,
      'Savings': 100 - (settings.needsPercentage + settings.wantsPercentage + settings.investmentsPercentage),
  };

  const accountForBucket = (bucket: BucketType) => mockAccounts.find(a => a.type === bucket)?.name || 'Main Checking';

  for (let i = 0; i < numTransactions; i++) {
    const isCredit = Math.random() < 0.05;
    
    let bucket: BucketType;
    let type: 'Credit' | 'Debit';
    let note: string;
    let category: string;
    let account: string;

    if (isCredit) {
        type = 'Credit';
        bucket = 'Savings';
        account = accountForBucket(bucket);
        category = getRandomItem(categories.Savings || ['Salary']);
        note = getRandomItem(mockNotes[category] || ['Income']);
    } else {
        type = 'Debit';
        const bucketRoll = Math.random() * 100;
        if (bucketRoll < settings.needsPercentage) bucket = 'Needs';
        else if (bucketRoll < settings.needsPercentage + settings.wantsPercentage) bucket = 'Wants';
        else bucket = 'Investments';
        
        account = accountForBucket(bucket);
        category = getRandomItem(categories[bucket] || ['Other']);
        note = getRandomItem(mockNotes[category] || mockNotes['Other']);
    }

    transactions.push({
      date: getRandomDateForMonth(year, month),
      type,
      amount: parseFloat((Math.random() * (type === 'Credit' ? 40000 : 5000) + (type === 'Credit' ? 20000 : 50)).toFixed(2)),
      account,
      bucket,
      category,
      note,
      monthlySalary: settings.monthlySalary,
      allocationPercentage: allocationMap[bucket] || 0
    });
  }
  return transactions;
};

const generateRandomGoals = (): Omit<Goal, 'id'>[] => [
    { name: 'Vacation to Japan', targetAmount: 200000, currentAmount: 75000 },
    { name: 'New Laptop', targetAmount: 150000, currentAmount: 145000 },
    { name: 'Emergency Fund', targetAmount: 500000, currentAmount: 350000 },
];

const defaultSettings: Omit<Settings, 'savingsPercentage'> = {
  monthlySalary: 75000,
  needsPercentage: 50,
  wantsPercentage: 30,
  investmentsPercentage: 10,
};

export const seedDatabase = async () => {
    try {
        console.log('Seeding database...');
        
        // Clear existing data first
        await remove(ref(db, `users/${userId}`));
        
        const goals = generateRandomGoals();
        const goalsRef = ref(db, `users/${userId}/goals`);
        const settingsRef = ref(db, `users/${userId}/settings/default`);
        const categoriesRef = ref(db, `users/${userId}/categories`);

        
        const promises: Promise<any>[] = [
            ...goals.map(goal => push(goalsRef, goal)),
            set(settingsRef, defaultSettings),
            set(categoriesRef, defaultCategories)
        ];
        
        // Generate data for the last 6 months
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const year = date.getFullYear();
            const month = date.getMonth(); // 0-11
            const monthStr = (month + 1).toString().padStart(2, '0');

            const monthSettings = defaultSettings; // for now, use default for all months
            const transactions = generateRandomTransactions(year, month, monthSettings, defaultCategories);

            transactions.forEach(tx => {
                // Correct path based on the new structure
                const path = `users/${userId}/transactions/${tx.bucket}/${year}/${monthStr}`;
                const transactionNodeRef = ref(db, path);
                promises.push(push(transactionNodeRef, tx));
            });
        }
        
        await Promise.all(promises);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

export const clearDatabase = async () => {
    try {
        console.log('Clearing database...');
        await remove(ref(db, `users/${userId}`));
        console.log('Database cleared successfully!');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
};
