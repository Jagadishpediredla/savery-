import type { Account } from '@/lib/types';

// These are account definitions. Balances are calculated dynamically from transactions.
export const mockAccounts: Omit<Account, 'balance'>[] = [
  { id: 'acc1', name: 'Main Checking', type: 'Needs' },
  { id: 'acc2', name: 'Fun Money', type: 'Wants' },
  { id: 'acc3', name: 'High-Yield Savings', type: 'Savings' },
  { id: 'acc4', name: 'Brokerage', type: 'Investments' },
];

// This can be moved to Firebase in the future if dynamic categories are needed.
export const categories = [
    'Groceries', 'Rent', 'Salary', 'Dining Out', 'Entertainment', 'Transfer', 'Investment', 'Utilities', 'Shopping', 'Other'
];
