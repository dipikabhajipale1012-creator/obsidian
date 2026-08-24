import {
  Banknote,
  Bus,
  Clapperboard,
  CreditCard,
  GraduationCap,
  HeartPulse,
  Laptop,
  ShoppingBag,
  UtensilsCrossed,
  Shapes,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Food: UtensilsCrossed,
  Transport: Bus,
  Education: GraduationCap,
  Shopping: ShoppingBag,
  Bills: CreditCard,
  Entertainment: Clapperboard,
  Health: HeartPulse,
  Salary: Banknote,
  Freelance: Laptop,
  Other: Shapes,
};

export const iconFor = (category: string): LucideIcon => CATEGORY_ICONS[category] ?? Shapes;
