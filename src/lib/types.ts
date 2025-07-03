export interface Transaction {
  id: string;
  date: string;
  type: 'Credit' | 'Debit';
  amount: number;
  account: string;
  category: string;
  note: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'Needs' | 'Wants' | 'Savings' | 'Investments';
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface Settings {
  monthlySalary: number;
  needsPercentage: number;
  wantsPercentage: number;
  investmentsPercentage: number;
  savingsPercentage: number;
}
