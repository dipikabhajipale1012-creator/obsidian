import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { Filters } from "@/components/dashboard/Filters";
import { Header } from "@/components/dashboard/Header";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TransactionDrawer } from "@/components/dashboard/TransactionDrawer";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { TransactionsProvider } from "@/context/TransactionsContext";
import type { Transaction } from "@/lib/types";

const title = "Ledger — Minimal Expense Tracker";
const description =
  "Track income and expenses in a fast, monochrome personal finance dashboard with live totals, category insights and period filters.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (tx: Transaction) => {
    setEditing(tx);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAdd={openNew} />

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="sr-only">Expense tracker dashboard</h1>
        <SummaryCards />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="rise-in" style={{ animationDelay: "60ms" }}>
              <Filters />
            </div>
            <TransactionList onAdd={openNew} onEdit={openEdit} />
          </div>
          <div className="space-y-5">
            <CategoryBreakdown />
          </div>
        </div>
      </main>

      <TransactionDrawer open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}

function Index() {
  return (
    <TransactionsProvider>
      <Dashboard />
    </TransactionsProvider>
  );
}
