import type { Account, Goal, Transaction } from '@/lib/types';

export const mockAccounts: Account[] = [
  { id: 'acc1', name: 'Main Checking', balance: 45800.75, type: 'Needs' },
  { id: 'acc2', name: 'Fun Money', balance: 8500.0, type: 'Wants' },
  { id: 'acc3', name: 'High-Yield Savings', balance: 124000.0, type: 'Savings' },
  { id: 'acc4', name: 'Brokerage', balance: 256000.0, type: 'Investments' },
];

export const mockTransactions: Transaction[] = [
    // Needs
    { id: 'txn1', date: '2024-07-22', type: 'Debit', amount: 750.5, account: 'Main Checking', category: 'Groceries', note: 'Weekly shopping' },
    { id: 'txn2', date: '2024-07-01', type: 'Debit', amount: 12000, account: 'Main Checking', category: 'Rent', note: 'August Rent' },
    { id: 'txn10', date: '2024-07-10', type: 'Debit', amount: 1500, account: 'Main Checking', category: 'Utilities', note: 'Electricity and Water' },
    { id: 'txn11', date: '2024-06-22', type: 'Debit', amount: 800, account: 'Main Checking', category: 'Groceries', note: 'Mid-month top-up' },
    { id: 'txn12', date: '2024-06-01', type: 'Debit', amount: 12000, account: 'Main Checking', category: 'Rent', note: 'July Rent' },
    { id: 'txn13', date: '2024-05-20', type: 'Debit', amount: 900, account: 'Main Checking', category: 'Groceries', note: 'Groceries for the week' },
    { id: 'txn14', date: '2024-05-01', type: 'Debit', amount: 11500, account: 'Main Checking', category: 'Rent', note: 'June Rent' },
  
    // Wants
    { id: 'txn3', date: '2024-07-20', type: 'Debit', amount: 450.0, account: 'Fun Money', category: 'Dining Out', note: 'Dinner with friends' },
    { id: 'txn5', date: '2024-07-19', type: 'Debit', amount: 250.0, account: 'Fun Money', category: 'Entertainment', note: 'Movie tickets' },
    { id: 'txn15', date: '2024-06-15', type: 'Debit', amount: 2000, account: 'Fun Money', category: 'Shopping', note: 'New clothes' },
    { id: 'txn16', date: '2024-06-18', type: 'Debit', amount: 300, account: 'Fun Money', category: 'Dining Out', note: 'Coffee meeting' },
    { id: 'txn17', date: '2024-05-25', type: 'Debit', amount: 1500, account: 'Fun Money', category: 'Entertainment', note: 'Concert tickets' },
  
    // Credit / Income
    { id: 'txn4', date: '2024-07-01', type: 'Credit', amount: 50000, account: 'Main Checking', category: 'Salary', note: 'Paycheck' },
    { id: 'txn18', date: '2024-06-01', type: 'Credit', amount: 50000, account: 'Main Checking', category: 'Salary', note: 'Paycheck' },
    { id: 'txn19', date: '2024-05-01', type: 'Credit', amount: 48000, account: 'Main Checking', category: 'Salary', note: 'Paycheck' },
  
    // Savings & Investments
    { id: 'txn6', date: '2024-07-18', type: 'Credit', amount: 5000, account: 'High-Yield Savings', category: 'Transfer', note: 'Monthly saving' },
    { id: 'txn7', date: '2024-07-17', type: 'Debit', amount: 1500, account: 'Brokerage', category: 'Investment', note: 'VOO ETF' },
    { id: 'txn20', date: '2024-06-18', type: 'Credit', amount: 5000, account: 'High-Yield Savings', category: 'Transfer', note: 'Monthly saving' },
    { id: 'txn21', date: '2024-06-17', type: 'Debit', amount: 2500, account: 'Brokerage', category: 'Investment', note: 'Index Fund' },
    { id: 'txn22', date: '2024-05-18', type: 'Credit', amount: 4000, account: 'High-Yield Savings', category: 'Transfer', note: 'Bonus saving' },
    { id: 'txn23', date: '2024-05-17', type: 'Debit', amount: 1000, account: 'Brokerage', category: 'Investment', note: 'Stock purchase' },
];

export const mockGoals: Goal[] = [
    { id: 'goal1', name: 'Vacation to Japan', targetAmount: 50000, currentAmount: 15000 },
    { id: 'goal2', name: 'New Laptop', targetAmount: 20000, currentAmount: 18000 },
    { id: 'goal3', name: 'Emergency Fund', targetAmount: 100000, currentAmount: 75000 },
];

export const mockMonthlyBreakdown = [
  { month: 'May', needs: 12400, wants: 1500, investments: 1000 },
  { month: 'Jun', needs: 12800, wants: 2300, investments: 2500 },
  { month: 'Jul', needs: 14250.5, wants: 700, investments: 1500 },
];
