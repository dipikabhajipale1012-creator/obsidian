import { Moon, Plus, Sun, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/hooks/useTheme";
import { useTransactions } from "@/context/TransactionsContext";
import type { Period } from "@/lib/types";

export function Header({ onAdd }: { onAdd: () => void }) {
  const { period, setPeriod } = useTransactions();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Wallet className="size-4" aria-hidden />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Ledger</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger
              aria-label="Select period"
              className="press h-9 w-[130px] border-border bg-background text-sm sm:w-[150px]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="THIS_MONTH">This Month</SelectItem>
              <SelectItem value="LAST_MONTH">Last Month</SelectItem>
              <SelectItem value="ALL_TIME">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="press size-9 border-border bg-background"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <Button onClick={onAdd} className="press h-9 gap-1.5 px-3 text-sm font-medium">
            <Plus className="size-4" aria-hidden />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sr-only sm:hidden">Add Transaction</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
