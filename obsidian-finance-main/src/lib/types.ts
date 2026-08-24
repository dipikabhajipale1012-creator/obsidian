export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO date
  createdAt: string;
  updatedAt: string;
}

export type TransactionInput = Omit<Transaction, "id" | "createdAt" | "updatedAt">;

export const CATEGORIES = [
  "Food",
  "Transport",
  "Education",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Salary",
  "Freelance",
  "Other",
] as const;

export type Period = "THIS_MONTH" | "LAST_MONTH" | "ALL_TIME";

export interface Summary {
  balance: number;
  income: number;
  expenses: number;
  netChange: number;
}

export interface CategorySlice {
  category: string;
  total: number;
  share: number;
}
