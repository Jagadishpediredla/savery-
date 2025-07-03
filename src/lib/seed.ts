
import { ref, set, remove, push } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { Transaction, Goal, Settings } from '@/lib/types';
import { mockAccounts, categories } from '@/data/mock-data';

const userId = 'user1';

// Helper to get random item from array
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate random date in the past year
const getRandomDate = (): string => {
  const end = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const generateRandomTransactions = (count: number): Omit<Transaction, 'id'>[] => {
  const transactions: Omit<Transaction, 'id'>[] = [];
  const transactionNotes: { [key: string]: string[] } = {
    Groceries: ['Weekly groceries', 'Supermarket run', 'Stocking up pantry'],
    Rent: ['Monthly rent payment'],
    Salary: ['Monthly salary deposit', 'Paycheck'],
    'Dining Out': ['Dinner with friends', 'Lunch meeting', 'Coffee break'],
    Entertainment: ['Movie tickets', 'Concert', 'Streaming service subscription'],
    Transfer: ['Transfer to savings', 'Sending money to a friend'],
    Investment: ['Stock purchase', 'Mutual fund investment'],
    Utilities: ['Electricity bill', 'Internet bill', 'Water bill'],
    Shopping: ['New clothes', 'Electronics purchase', 'Online shopping'],
    Other: ['Miscellaneous expense', 'Cash withdrawal'],
  };

  for (let i = 0; i < count; i++) {
    const type = Math.random() > 0.8 ? 'Credit' : 'Debit'; // 20% credit, 80% debit
    const category = type === 'Credit' ? 'Salary' : getRandomItem(categories.filter(c => c !== 'Salary'));
    const account = getRandomItem(mockAccounts).name;
    const note = getRandomItem(transactionNotes[category] || ['Misc note']);

    transactions.push({
      date: getRandomDate(),
      type,
      amount: parseFloat((Math.random() * (type === 'Credit' ? 40000 : 5000) + (type === 'Credit' ? 20000 : 50)).toFixed(2)),
      account,
      category,
      note,
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
        
        // Generate data
        const transactions = generateRandomTransactions(150);
        const goals = generateRandomGoals();

        // Clear existing data first
        await remove(ref(db, `users/${userId}`));
        
        const goalsRef = ref(db, `users/${userId}/goals`);
        const settingsRef = ref(db, `users/${userId}/settings`);

        // Create promises for setting data
        const transactionPromises = transactions.map(tx => {
            const account = mockAccounts.find(a => a.name === tx.account);
            if (!account) {
                console.warn(`Could not find account for transaction: ${tx.account}`);
                return Promise.resolve();
            }

            const txDate = new Date(tx.date);
            const year = txDate.getFullYear();
            const month = (txDate.getMonth() + 1).toString().padStart(2, '0');
            const day = txDate.getDate().toString().padStart(2, '0');
            
            const path = `users/${userId}/transactions/${account.type}/${year}/${month}/${day}`;
            const transactionNodeRef = ref(db, path);
            return push(transactionNodeRef, tx);
        });

        const goalPromises = goals.map(goal => push(goalsRef, goal));
        
        await Promise.all([
            ...transactionPromises,
            ...goalPromises,
            set(settingsRef, defaultSettings),
        ]);

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
