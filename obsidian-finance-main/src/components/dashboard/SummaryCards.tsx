import { ArrowDownLeft, ArrowUpRight, Scale, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useCountUp } from "@/hooks/useCountUp";
import { useTransactions } from "@/context/TransactionsContext";
import { currency } from "@/lib/format";
import { cn } from "@/lib/utils";

function AmountValue({ value, className }: { value: number; className?: string }) {
  const animated = useCountUp(value);
  return <span className={cn("num", className)}>{currency(animated)}</span>;
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "neutral",
  prominent = false,
  sign,
  delay,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone?: "neutral" | "income" | "expense";
  prominent?: boolean;
  sign?: string;
  delay: number;
}) {
  const toneClass =
    tone === "income" ? "text-income" : tone === "expense" ? "text-expense" : "text-foreground";

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "rise-in card-lift rounded-xl border border-border bg-card p-4 shadow-card",
        prominent && "sm:col-span-2 sm:p-5",
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className={cn("size-4", tone !== "neutral" && toneClass)} aria-hidden />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p
        className={cn(
          "mt-2.5 font-semibold",
          prominent ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl",
          toneClass,
        )}
      >
        {sign && <span aria-hidden>{sign}</span>}
        <AmountValue value={Math.abs(value)} />
        <span className="sr-only">{sign === "-" ? "negative" : ""}</span>
      </p>
    </div>
  );
}

export function SummaryCards() {
  const { summary } = useTransactions();

  return (
    <section aria-label="Summary" className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <StatCard icon={Scale} label="Balance" value={summary.balance} prominent delay={0} sign={summary.balance < 0 ? "-" : ""} />
      <StatCard icon={ArrowUpRight} label="Income" value={summary.income} tone="income" sign="+" delay={60} />
      <StatCard icon={ArrowDownLeft} label="Expenses" value={summary.expenses} tone="expense" sign="-" delay={120} />
      <StatCard
        icon={TrendingUp}
        label="Net Change"
        value={summary.netChange}
        tone={summary.netChange >= 0 ? "income" : "expense"}
        sign={summary.netChange >= 0 ? "+" : "-"}
        delay={180}
      />
    </section>
  );
}
