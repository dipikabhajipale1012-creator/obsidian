import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useTransactions } from "@/context/TransactionsContext";
import { CATEGORIES, type Transaction, type TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Transaction | null;
}

const today = () => new Date().toISOString().slice(0, 10);

export function TransactionDrawer({ open, onOpenChange, editing }: Props) {
  const { create, update } = useTransactions();

  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today());
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  type FieldErrors = {
  amount?: string;
  category?: string;
  date?: string;
  description?: string;
};

  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setSubmitting(false);
    if (editing) {
      setType(editing.type);
      setAmount(String(editing.amount));
      setCategory(editing.category);
      setDate(editing.date);
      setDescription(editing.description);
    } else {
      setType("EXPENSE");
      setAmount("");
      setCategory("");
      setDate(today());
      setDescription("");
    }
    setNote("");
  }, [open, editing]);

  const validate = () => {
    const next: FieldErrors = {};
    const value = Number(amount);
    if (!amount.trim()) next.amount = "Enter an amount.";
    else if (Number.isNaN(value) || value <= 0) next.amount = "Amount must be greater than 0.";
    if (!category) next.category = "Pick a category.";
    if (!date) next.date = "Pick a date.";
    if (!description.trim()) next.description = "Add a short description.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        type,
        amount: Math.round(Number(amount) * 100) / 100,
        category,
        date,
        description: description.trim(),
      };
      if (editing) {
        await update(editing.id, payload);
        toast.success("Transaction updated");
      } else {
        await create(payload);
        toast.success("Transaction added");
      }
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const income = type === "INCOME";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto border-l border-border bg-background p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="text-base">
            {editing ? "Edit transaction" : "New transaction"}
          </SheetTitle>
          <SheetDescription className="text-xs">
            {editing ? "Update the details and save." : "Record income or an expense."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={submit} className="flex flex-1 flex-col gap-5 px-5 py-5" noValidate>
          <div
            role="radiogroup"
            aria-label="Transaction type"
            className="relative grid grid-cols-2 gap-1 rounded-lg border border-border bg-secondary p-1"
          >
            {(["EXPENSE", "INCOME"] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={type === t}
                onClick={() => setType(t)}
                className={cn(
                  "press rounded-md px-3 py-1.5 text-sm font-medium",
                  type === t
                    ? "bg-background text-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mr-1.5 inline-block size-1.5 rounded-full align-middle",
                    t === "INCOME" ? "bg-income" : "bg-expense",
                    type === t ? "opacity-100" : "opacity-40",
                  )}
                />
                {t === "INCOME" ? "Income" : "Expense"}
              </button>
            ))}
          </div>

          <div>
            <Label htmlFor="amount" className="text-xs uppercase tracking-wide text-muted-foreground">
              Amount
            </Label>
            <div className="mt-1.5 flex items-baseline gap-1 border-b border-border pb-1 focus-within:border-foreground">
              <span
                className={cn(
                  "num text-2xl font-semibold",
                  income ? "text-income" : "text-expense",
                )}
                aria-hidden
              >
                {income ? "+" : "−"}$
              </span>
              <input
                id="amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                aria-invalid={Boolean(errors.amount)}
                aria-describedby={errors.amount ? "amount-error" : undefined}
                className="num w-full bg-transparent text-3xl font-semibold outline-none placeholder:text-muted-foreground/50"
              />
            </div>
            {errors.amount && (
              <p id="amount-error" className="mt-1.5 text-xs text-destructive">
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="text-xs uppercase tracking-wide text-muted-foreground">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Weekly groceries"
              aria-invalid={Boolean(errors.description)}
              className="mt-1.5 h-10 border-border bg-background text-sm"
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Category</Label>
            <Popover open={catOpen} onOpenChange={setCatOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={catOpen}
                  className="press mt-1.5 h-10 w-full justify-between border-border bg-background text-sm font-normal"
                >
                  {category || <span className="text-muted-foreground">Select category</span>}
                  <ChevronsUpDown className="size-4 opacity-50" aria-hidden />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] border-border p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search category" className="text-sm" />
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {CATEGORIES.map((c) => (
                        <CommandItem
                          key={c}
                          value={c}
                          onSelect={() => {
                            setCategory(c);
                            setCatOpen(false);
                          }}
                        >
                          <Check
                            className={cn("mr-2 size-4", category === c ? "opacity-100" : "opacity-0")}
                          />
                          {c}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.category && <p className="mt-1.5 text-xs text-destructive">{errors.category}</p>}
          </div>

          <div>
            <Label htmlFor="date" className="text-xs uppercase tracking-wide text-muted-foreground">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-invalid={Boolean(errors.date)}
              className="mt-1.5 h-10 border-border bg-background text-sm"
            />
            {errors.date && <p className="mt-1.5 text-xs text-destructive">{errors.date}</p>}
          </div>

          <div>
            <Label htmlFor="note" className="text-xs uppercase tracking-wide text-muted-foreground">
              Note (optional)
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Anything worth remembering"
              className="mt-1.5 resize-none border-border bg-background text-sm"
            />
          </div>

          <div className="mt-auto flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="press h-10 flex-1 border-border"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="press h-10 flex-1 gap-2">
              {submitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {editing ? "Save changes" : "Add transaction"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
