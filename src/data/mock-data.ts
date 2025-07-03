import type { Account, Goal, Transaction } from '@/lib/types';

export const mockAccounts: Account[] = [
  { id: 'acc1', name: 'Main Checking', balance: 4580.75, type: 'Needs' },
  { id: 'acc2', name: 'Fun Money', balance: 850.0, type: 'Wants' },
  { id: 'acc3', name: 'High-Yield Savings', balance: 12400.0, type: 'Savings' },
  { id: 'acc4', name: 'Brokerage', balance: 25600.0, type: 'Investments' },
];

export const mockTransactions: Transaction[] = [
  { id: 'txn1', date: '2024-07-22', type: 'Debit', amount: 75.5, account: 'Main Checking', category: 'Groceries', note: 'Weekly shopping' },
  { id: 'txn2', date: '2024-07-21', type: 'Debit', amount: 1200, account: 'Main Checking', category: 'Rent', note: 'August Rent' },
  { id: 'txn3', date: '2024-07-20', type: 'Debit', amount: 45.0, account: 'Fun Money', category: 'Dining Out', note: 'Dinner with friends' },
  { id: 'txn4', date: '2024-07-20', type: 'Credit', amount: 5000, account: 'Main Checking', category: 'Salary', note: 'Paycheck' },
  { id: 'txn5', date: '2024-07-19', type: 'Debit', amount: 25.0, account: 'Fun Money', category: 'Entertainment', note: 'Movie tickets' },
  { id: 'txn6', date: '2024-07-18', type: 'Credit', amount: 500, account: 'High-Yield Savings', category: 'Transfer', note: 'Monthly saving' },
  { id: 'txn7', date: '2024-07-17', type: 'Debit', amount: 150, account: 'Brokerage', category: 'Investment', note: 'VOO ETF' },
];

export const mockGoals: Goal[] = [
    { id: 'goal1', name: 'Vacation to Japan', targetAmount: 5000, currentAmount: 1500 },
    { id: 'goal2', name: 'New Laptop', targetAmount: 2000, currentAmount: 1800 },
    { id: 'goal3', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 7500 },
];

export const mockSpendingData = [
  { month: 'Jan', spending: 2400 },
  { month: 'Feb', spending: 2210 },
  { month: 'Mar', spending: 2290 },
  { month: 'Apr', spending: 2000 },
  { month: 'May', spending: 2181 },
  { month: 'Jun', spending: 2500 },
  { month: 'Jul', spending: 2100 },
];
