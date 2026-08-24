import { PieChart } from "lucide-react";

import { useTransactions } from "@/context/TransactionsContext";
import { currency } from "@/lib/format";
import { iconFor } from "./categoryIcons";

export function CategoryBreakdown() {
  const { breakdown } = useTransactions();
  const total = breakdown.reduce((s, c) => s + c.total, 0);

  return (
    <section
      aria-label="Spending by category"
      className="rise-in card-lift rounded-xl border border-border bg-card p-4 shadow-card"
      style={{ animationDelay: "180ms" }}
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Spending by category</h2>
        <span className="num text-xs text-muted-foreground">{currency(total, 0)}</span>
      </div>

      {breakdown.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <span className="flex size-11 items-center justify-center rounded-full border border-border">
            <PieChart className="size-5 text-muted-foreground" aria-hidden />
          </span>
          <p className="mt-3 text-sm text-muted-foreground">No expenses in this period yet.</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3.5">
          {breakdown.map((slice, i) => {
            const Icon = iconFor(slice.category);
            const width = Math.max(slice.share * 100, 2);
            const shade = 0.85 - Math.min(i, 6) * 0.1;
            return (
              <li key={slice.category}>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-2 font-medium">
                    <Icon className="size-3.5 text-muted-foreground" aria-hidden />
                    {slice.category}
                  </span>
                  <span className="num text-muted-foreground">
                    {currency(slice.total)} · {Math.round(slice.share * 100)}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full origin-left rounded-full"
                    style={{
                      width: `${width}%`,
                      backgroundColor: `color-mix(in oklab, var(--foreground) ${shade * 100}%, transparent)`,
                      animation: `bar-grow 700ms cubic-bezier(0.22,1,0.36,1) ${i * 60}ms both`,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
