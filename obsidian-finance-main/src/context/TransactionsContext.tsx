import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import * as api from "@/lib/api";
import type {
  CategorySlice,
  Period,
  Summary,
  Transaction,
  TransactionInput,
  TransactionType,
} from "@/lib/types";

interface TransactionsValue {
  transactions: Transaction[];
  visible: Transaction[];
  summary: Summary;
  breakdown: CategorySlice[];
  loading: boolean;
  error: string | null;
  reload: () => void;

  period: Period;
  setPeriod: (p: Period) => void;
  search: string;
  setSearch: (s: string) => void;
  typeFilter: TransactionType | null;
  setTypeFilter: (t: TransactionType | null) => void;
  categoryFilter: string | null;
  setCategoryFilter: (c: string | null) => void;
  clearFilters: () => void;
  hasFilters: boolean;

  create: (input: TransactionInput) => Promise<void>;
  update: (id: string, input: TransactionInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
  recentlyAdded: string | null;
}

const TransactionsContext = createContext<TransactionsValue | null>(null);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("THIS_MONTH");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTransactions(await api.getTransactions());
    } catch {
      setError("We couldn't load your transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return api
      .filterByPeriod(transactions, period)
      .filter((t) => (typeFilter ? t.type === typeFilter : true))
      .filter((t) => (categoryFilter ? t.category === categoryFilter : true))
      .filter((t) =>
        q ? t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) : true,
      );
  }, [transactions, period, typeFilter, categoryFilter, search]);

  const summary = useMemo(() => api.computeSummary(transactions, period), [transactions, period]);
  const breakdown = useMemo(
    () => api.computeCategoryBreakdown(transactions, period),
    [transactions, period],
  );

  const create = useCallback(async (input: TransactionInput) => {
    const created = await api.createTransaction(input);
    setTransactions((prev) =>
      [created, ...prev].sort((a, b) => b.date.localeCompare(a.date)),
    );
    setRecentlyAdded(created.id);
    setTimeout(() => setRecentlyAdded((id) => (id === created.id ? null : id)), 1400);
  }, []);

  const update = useCallback(async (id: string, input: TransactionInput) => {
    const updated = await api.updateTransaction(id, input);
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? updated : t)).sort((a, b) => b.date.localeCompare(a.date)),
    );
  }, []);

  const remove = useCallback(async (id: string) => {
    await api.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setTypeFilter(null);
    setCategoryFilter(null);
  }, []);

  const value: TransactionsValue = {
    transactions,
    visible,
    summary,
    breakdown,
    loading,
    error,
    reload: () => void load(),
    period,
    setPeriod,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    clearFilters,
    hasFilters: Boolean(search || typeFilter || categoryFilter),
    create,
    update,
    remove,
    recentlyAdded,
  };

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions must be used inside TransactionsProvider");
  return ctx;
}
