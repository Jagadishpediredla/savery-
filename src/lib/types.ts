
export type BucketType = 'Needs' | 'Wants' | 'Savings' | 'Investments';

export interface LocationData {
  latitude: number;
  longitude: number;
  label?: string;
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'Credit' | 'Debit';
  amount: number;
  account: string;
  bucket: BucketType;
  category: string;
  note?: string; 
  location?: LocationData;
  // Contextual data stored with each transaction
  monthlySalary: number;
  allocationPercentage: number;
  timestamp: number;
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
  savingsPercentage: number; // This will be calculated
}

export interface Bucket {
  name: BucketType;
  allocated: number;
  spent: number;
  balance: number;
}

export type Categories = Record<BucketType, string[]>;
