import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useTransactions } from "@/context/TransactionsContext";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "press shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function Filters() {
  const {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    hasFilters,
    clearFilters,
  } = useTransactions();

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search description or category"
          aria-label="Search transactions"
          className="h-10 border-border bg-background pl-9 text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Chip active={typeFilter === "INCOME"} onClick={() => setTypeFilter(typeFilter === "INCOME" ? null : "INCOME")}>
          + Income
        </Chip>
        <Chip
          active={typeFilter === "EXPENSE"}
          onClick={() => setTypeFilter(typeFilter === "EXPENSE" ? null : "EXPENSE")}
        >
          − Expense
        </Chip>
        <span className="mx-1 h-4 w-px bg-border" aria-hidden />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              active={categoryFilter === c}
              onClick={() => setCategoryFilter(categoryFilter === c ? null : c)}
            >
              {c}
            </Chip>
          ))}
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="press ml-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" aria-hidden /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
