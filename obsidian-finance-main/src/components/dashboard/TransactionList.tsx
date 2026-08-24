import { useState } from "react";
import { Inbox, Pencil, SearchX, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactions } from "@/context/TransactionsContext";
import { currency, formatDate } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import { iconFor } from "./categoryIcons";

function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon: typeof Inbox;
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="rise-in flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full border border-border">
        <Icon className="size-5 text-muted-foreground" aria-hidden />
      </span>
      <p className="mt-4 text-sm font-medium">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{message}</p>
      <Button onClick={onAction} className="press mt-5 h-9 text-sm">
        {actionLabel}
      </Button>
    </div>
  );
}

function Row({
  tx,
  leaving,
  fresh,
  onEdit,
  onDelete,
}: {
  tx: Transaction;
  leaving: boolean;
  fresh: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const Icon = iconFor(tx.category);
  const income = tx.type === "INCOME";

  return (
    <li
      className={cn(
        "group relative flex items-center gap-3 border-l-2 py-3 pl-3 pr-1 transition-colors sm:pl-4",
        income ? "border-l-income" : "border-l-expense",
        "hover:bg-secondary/60",
        fresh && "row-enter",
        leaving && "row-leave",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full border border-border",
          income ? "text-income" : "text-expense",
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{tx.description}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatDate(tx.date)} · {tx.category}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <p
          className={cn(
            "num text-sm font-semibold sm:text-base",
            income ? "text-income" : "text-expense",
          )}
        >
          {income ? "+" : "−"}
          {currency(tx.amount)}
          <span className="sr-only">{income ? " income" : " expense"}</span>
        </p>
        <div className="flex items-center opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="press size-8 text-muted-foreground hover:text-foreground"
            aria-label={`Edit ${tx.description}`}
            onClick={onEdit}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="press size-8 text-muted-foreground hover:text-foreground"
            aria-label={`Delete ${tx.description}`}
            onClick={onDelete}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </li>
  );
}

export function TransactionList({
  onAdd,
  onEdit,
}: {
  onAdd: () => void;
  onEdit: (tx: Transaction) => void;
}) {
  const { visible, loading, error, reload, remove, hasFilters, clearFilters, recentlyAdded } =
    useTransactions();
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);
  const [leavingId, setLeavingId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const tx = pendingDelete;
    setPendingDelete(null);
    setLeavingId(tx.id);
    await new Promise((r) => setTimeout(r, 220));
    try {
      await remove(tx.id);
      toast.success("Transaction deleted");
    } catch {
      toast.error("Couldn't delete the transaction");
    } finally {
      setLeavingId(null);
    }
  };

  return (
    <section
      aria-label="Transactions"
      className="rise-in rounded-xl border border-border bg-card shadow-card"
      style={{ animationDelay: "120ms" }}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight">Transactions</h2>
        <span className="num text-xs text-muted-foreground">{visible.length} shown</span>
      </div>

      {loading ? (
        <div className="space-y-3 p-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          icon={SearchX}
          title="Something went wrong"
          message={error}
          actionLabel="Try again"
          onAction={reload}
        />
      ) : visible.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="No matching transactions"
            message="Try a different search term or clear the active filters."
            actionLabel="Clear filters"
            onAction={clearFilters}
          />
        ) : (
          <EmptyState
            icon={Inbox}
            title="Nothing here yet"
            message="Add your first transaction for this period to see totals and category insights."
            actionLabel="Add transaction"
            onAction={onAdd}
          />
        )
      ) : (
        <ul className="divide-y divide-border px-1">
          {visible.map((tx) => (
            <Row
              key={tx.id}
              tx={tx}
              leaving={leavingId === tx.id}
              fresh={recentlyAdded === tx.id}
              onEdit={() => onEdit(tx)}
              onDelete={() => setPendingDelete(tx)}
            />
          ))}
        </ul>
      )}

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent className="border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `"${pendingDelete.description}" (${currency(pendingDelete.amount)}) will be removed permanently.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="press">Cancel</AlertDialogCancel>
            <AlertDialogAction className="press" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
