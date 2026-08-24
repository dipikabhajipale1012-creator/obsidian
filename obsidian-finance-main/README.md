# Obsidian Finance

Build a polished, professional Expense Tracker web app — a personal finance dashboard for tracking income and expenses, with a minimalist black-and-white design system and smooth, deliberate motion throughout.

## Design Direction

Minimalist monochrome finance app. Think: a premium black-and-white banking app, not a colorful dashboard. High contrast, lots of whitespace, confident typography doing the heavy lifting instead of color or decoration.

Colors:

- Background: #FFFFFF (light mode) / #0A0A0A (dark mode)

- Surface/cards: #FFFFFF with a hairline border #E5E5E5 (light) / #1A1A1A with border #2A2A2A (dark)

- Primary text: #111111 (light) / #F5F5F5 (dark)

- Muted text: #6B6B6B (light) / #A1A1A1 (dark)

- Accent (use sparingly — only for income/expense signal, never for decoration): Income #16A34A, Expense #DC2626. These should appear only as: a small icon tint, a thin left-border on transaction rows, and the amount text color. Everything else (buttons, nav, cards, borders) stays black/white/gray.

- Primary action button: solid black (light mode) / solid white (dark mode) — high contrast, no gradients, no shadows beyond a subtle 1px border or barely-there elevation

Typography: Inter or similar. Numbers (amounts, balance) should be a slightly heavier weight than body text to establish hierarchy — this is a finance app, the numbers are the product.

Include a light/dark mode toggle in the header — this theme should look equally sharp in both.

## Motion & Animation (important — make this feel premium, not static)

- Page/section transitions: fade + slight upward slide (8-12px) on mount, ~200-250ms ease-out

- Stat cards (Balance, Income, Expenses, Net Change): animate the numbers counting up from 0 on load/update, not just snapping to the new value

- Transaction list: new items slide in from the top with a brief highlight flash; deleted items slide out and collapse height smoothly rather than disappearing instantly

- Buttons: subtle scale-down (0.97) on press, spring back on release

- Cards: gentle lift (translateY -2px + soft shadow increase) on hover, desktop only

- Drawer/modal (add/edit transaction): slide in from the right with a backdrop fade, not an abrupt pop

- Chart: bars/segments animate in (grow from baseline) on first render

- Toggle between light/dark mode: smooth color-transition across the whole page (~300ms), not an instant flash

- Keep all animations quick and purposeful — nothing should feel slow or delay the user from acting. No bouncy/playful easing; use ease-out or ease-in-out curves that feel controlled and premium.

## Layout

- Desktop: header + summary cards row + two-column main area (transaction list on the left/larger, chart + category breakdown on the right/sidebar)

- Mobile (360px+): everything stacks vertically — summary cards in a horizontal scroll or 2x2 grid, chart below transactions

- Header: app name/logo (left), period selector dropdown (This Month / Last Month / All Time), light/dark toggle, "Add Transaction" button (solid black/white, right-aligned)

## Summary Cards (top of dashboard)

Four cards: Balance, Total Income, Total Expenses, Net Change — each with a small icon, label, and the animated count-up number. Balance should be visually the largest/most prominent of the four.

## Transaction List

Each row: category icon (monochrome icon, small colored dot/tint matching income or expense), description, date, category label, amount (right-aligned, colored per income/expense, bold), edit and delete icon buttons that appear on hover (desktop) or are always visible (mobile).

## Add/Edit Transaction

Right-side slide-in drawer. Toggle switch for Income/Expense at the top (this should visually restyle the drawer's accent subtly — not repaint it, just a small indicator shift). Fields: Amount (large, prominent input), Category (dropdown, searchable), Date (date picker), Note (optional textarea). Save button disabled + spinner while submitting. Inline validation under invalid fields.

## Charts & Category Breakdown

A clean category breakdown — either a minimal donut/bar chart or a ranked list of categories with thin horizontal bars, all in grayscale except for subtle length/value differentiation. Only expense transactions count toward this. Use Chart.js via CDN, styled to match the monochrome theme (no default chart colors — override to grays with maybe one accent).

## Search & Filters

Search bar (title/category, live filter). Filter chips for Type (Income/Expense) and Category — active chips shown in solid black/white, inactive as outlined. Month/period selector in the header drives the whole dashboard.

## Empty & Error States

Centered icon (line-style, monochrome) + short message + CTA button when there's no data or no filter results. Graceful retry state if data "fetching" fails.

## Feedback

Toast notifications (top-right, minimal style — dark toast on light mode, light toast on dark mode) for create/edit/delete/errors. Confirmation dialog before delete, styled to match (not a jarring browser-default popup).

## Data Model (use this exact shape in local state)

```ts

interface Transaction {

  id: string;

  type: "INCOME" | "EXPENSE";

  amount: number;

  category: string;

  description: string;

  date: string; // ISO date

  createdAt: string;

  updatedAt: string;

}

```

Categories: Food, Transport, Education, Shopping, Bills, Entertainment, Health, Salary, Freelance, Other.

## Calculations

- Balance = total income − total expenses

- Net Change = income − expenses for the selected period only

- Category breakdown includes only EXPENSE transactions

## Initial State

Seed with 10 realistic transactions (mix of income and expense across several categories and dates, at least one from last month) so the dashboard and chart are populated immediately.

## Architecture Notes for Lovable

- Keep all data access in a single `lib/api.ts` file with functions like `getTransactions()`, `createTransaction()`, `updateTransaction()`, `deleteTransaction()`, `getSummary()`, `getCategoryBreakdown()` — implement against local React state for now, structured so they can later be swapped for real fetch calls to a REST backend (`/api/transactions`, `/api/transactions/{id}`, `/api/transactions/summary`, `/api/transactions/categories`)

- Shared state/context for transactions, filters, and selected period so all views stay in sync

- Fully responsive from 360px up

- Accessible: never convey income/expense by color alone — always pair with a +/- sign or icon; visible keyboard focus states; proper form labels

Priority order: get the full add → view → edit → delete → totals-update loop working correctly first. Then layer in the animation polish — don't let motion get in the way of the core flow working end-to-end.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2bd104df-c305-4244-b308-5e2c741e42d7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
