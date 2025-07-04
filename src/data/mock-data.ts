
import type { BucketType, Account, Categories } from '@/lib/types';

// These are bucket definitions. Balances are calculated dynamically.
export const mockAccounts: Omit<Account, 'balance'>[] = [
  { id: 'acc1', name: 'Main Checking', type: 'Needs' },
  { id: 'acc2', name: 'Fun Money', type: 'Wants' },
  { id: 'acc3', name: 'High-Yield Savings', type: 'Savings' },
  { id: 'acc4', name: 'Brokerage', type: 'Investments' },
];

export const buckets: { name: BucketType; }[] = [
  { name: 'Needs' },
  { name: 'Wants' },
  { name: 'Savings' },
  { name: 'Investments' },
];

export const defaultCategories: Categories = {
    Needs: ['Groceries', 'Rent', 'Utilities', 'Transportation', 'Insurance'],
    Wants: ['Dining Out', 'Entertainment', 'Shopping', 'Hobbies', 'Vacations'],
    Savings: ['Salary', 'Transfer', 'Freelance Income', 'Bonus', 'Other Incomes'],
    Investments: ['Stock Purchase', 'Mutual Fund', 'Retirement Contribution']
};


export const mockNotes: Record<string, string[]> = {
    ...defaultCategories,
    Groceries: ["Weekly groceries", "Supermarket run", "Stocking up pantry"],
    Rent: ["Monthly rent payment"],
    Salary: ["Monthly salary deposit", "Paycheck"],
    'Dining Out': ["Dinner with friends", "Lunch meeting", "Coffee break"],
    Entertainment: ["Movie tickets", "Concert", "Streaming service subscription"],
    Transfer: ["Transfer to savings", "Sending money to a friend"],
    Investment: ["Stock purchase", "Mutual fund investment"],
    Utilities: ["Electricity bill", "Internet bill", "Water bill"],
    Shopping: ["New clothes", "Electronics purchase", "Online shopping"],
    'Other Incomes': ["Side project payment", "Selling old stuff", "Cash gift"],
    Other: ["Miscellaneous expense", "Cash withdrawal"]
};
