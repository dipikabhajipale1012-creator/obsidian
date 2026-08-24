/**
 * Single data-access layer.
 *
 * Everything is implemented against an in-memory store today, but each function
 * mirrors the shape of the eventual REST endpoints so the internals can be
 * swapped for `fetch` calls without touching any component:
 *
 *   getTransactions()      -> GET    /api/transactions
 *   createTransaction()    -> POST   /api/transactions
 *   updateTransaction()    -> PATCH  /api/transactions/{id}
 *   deleteTransaction()    -> DELETE /api/transactions/{id}
 *   getSummary()           -> GET    /api/transactions/summary
 *   getCategoryBreakdown() -> GET    /api/transactions/categories
 */
import type {
  CategorySlice,
  Period,
  Summary,
  Transaction,
  TransactionInput,
} from "./types";

const LATENCY = 260;

const delay = <T,>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

const iso = (d: Date) => d.toISOString().slice(0, 10);


let store: Transaction[] = [];

const sortByDate = (list: Transaction[]) =>
  [...list].sort((a, b) => (a.date === b.date ? b.createdAt.localeCompare(a.createdAt) : b.date.localeCompare(a.date)));

export function periodRange(period: Period): { from?: string; to?: string } {
  if (period === "ALL_TIME") return {};
  const now = new Date();
  const offset = period === "THIS_MONTH" ? 0 : -1;
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  return { from: iso(start), to: iso(end) };
}

export function filterByPeriod(list: Transaction[], period: Period): Transaction[] {
  const { from, to } = periodRange(period);
  if (!from || !to) return list;
  return list.filter((t) => t.date >= from && t.date <= to);
}

export async function getTransactions(): Promise<Transaction[]> {
  return delay(sortByDate(store));
}

export async function createTransaction(input: TransactionInput): Promise<Transaction> {
  const stamp = new Date().toISOString();
  const created: Transaction = {
    ...input,
    id: (globalThis.crypto?.randomUUID?.() ?? `tx-${Date.now()}-${Math.random()}`) as string,
    createdAt: stamp,
    updatedAt: stamp,
  };
  store = [created, ...store];
  return delay(created);
}

export async function updateTransaction(
  id: string,
  input: Partial<TransactionInput>,
): Promise<Transaction> {
  const existing = store.find((t) => t.id === id);
  if (!existing) throw new Error("Transaction not found");
  const updated: Transaction = { ...existing, ...input, updatedAt: new Date().toISOString() };
  store = store.map((t) => (t.id === id ? updated : t));
  return delay(updated);
}

export async function deleteTransaction(id: string): Promise<{ id: string }> {
  store = store.filter((t) => t.id !== id);
  return delay({ id });
}

export function computeSummary(all: Transaction[], period: Period): Summary {
  const income = all.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expenses = all.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const scoped = filterByPeriod(all, period);
  const pIncome = scoped.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const pExpenses = scoped.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  return {
    balance: income - expenses,
    income: pIncome,
    expenses: pExpenses,
    netChange: pIncome - pExpenses,
  };
}

export function computeCategoryBreakdown(all: Transaction[], period: Period): CategorySlice[] {
  const scoped = filterByPeriod(all, period).filter((t) => t.type === "EXPENSE");
  const totals = new Map<string, number>();
  for (const t of scoped) totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  const grand = [...totals.values()].reduce((s, v) => s + v, 0);
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total, share: grand ? total / grand : 0 }))
    .sort((a, b) => b.total - a.total);
}

export async function getSummary(period: Period): Promise<Summary> {
  return delay(computeSummary(store, period));
}

export async function getCategoryBreakdown(period: Period): Promise<CategorySlice[]> {
  return delay(computeCategoryBreakdown(store, period));
}
