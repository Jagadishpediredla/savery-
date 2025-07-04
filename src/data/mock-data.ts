
import type { BucketType, Account } from '@/lib/types';

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

export const categories = [
    'Groceries', 'Rent', 'Salary', 'Dining Out', 'Entertainment', 'Transfer', 'Investment', 'Utilities', 'Shopping', 'Other'
];
