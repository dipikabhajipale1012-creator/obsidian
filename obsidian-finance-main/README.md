# Obsidian Finance – Expense Tracker

A modern, responsive personal finance dashboard built to simplify income and expense management. Obsidian Finance provides a clean, minimalist interface to track transactions, monitor balances, and understand spending habits.

## 🚀 Features

- **Dashboard Overview:** View your balance, total income, total expenses, and net change in one place.
- **Transaction Management:** Add, edit, and delete income and expense transactions.
- **Category Tracking:** Organize transactions into categories such as Food, Transport, Education, Shopping, Bills, and more.
- **Interactive Charts:** Visualize expense distribution with clean, minimal charts.
- **Search and Filters:** Quickly find transactions by description, category, type, or selected period.
- **Light and Dark Mode:** Switch between elegant light and dark themes.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Animated Statistics:** Smooth number transitions and subtle interface animations.
- **Data Persistence:** Manage transactions through a structured data layer designed for future backend integration.

## 🛠️ Tech Stack

- **Frontend:** React.js, TypeScript
- **Styling:** CSS / Tailwind CSS
- **Charts:** Chart.js
- **Icons:** Lucide Icons
- **State Management:** React Context and Hooks
- **Data Handling:** Local state with a modular API structure
- **Development Tools:** Node.js, npm, Vite

## 📂 Project Structure

```text
obsidian-finance/
│
├── public/
│   └── assets/
│
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── Transactions/
│   │   ├── Charts/
│   │   └── UI/
│   │
│   ├── context/
│   │   └── TransactionContext.tsx
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   ├── pages/
│   │   └── Dashboard.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── index.html
└── README.md
```

*Note: This is a suggested structure. The actual folders and filenames may differ depending on your implementation.*

## ⚙️ Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure the following tools are installed:

- [Node.js](https://nodejs.org/)
- npm
- Visual Studio Code (recommended)

### Installation

**1. Clone the repository**

```bash
git clone <your-repository-url>
```

**2. Navigate to the project folder**

```bash
cd obsidian-finance
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the application**

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## 💰 How It Works

### 1. Dashboard

The dashboard displays four important financial metrics:

- **Balance:** Total income minus total expenses.
- **Total Income:** All recorded income.
- **Total Expenses:** All recorded expenses.
- **Net Change:** Income minus expenses for the selected period.

### 2. Manage Transactions

Users can:
- Add new income or expense entries.
- Update existing transaction details.
- Delete transactions after confirmation.
- View transaction dates, descriptions, categories, and amounts.

### 3. Expense Analysis

The application groups expense transactions by category and displays a visual breakdown to help users understand their spending patterns.

### 4. Search and Filters

Users can search transactions and filter them by transaction type, category, and time period.

## 📊 Transaction Data Model

Each transaction follows this structure:

```typescript
interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
```

### Available Categories

- Food
- Transport
- Education
- Shopping
- Bills
- Entertainment
- Health
- Salary
- Freelance
- Other

## 🎨 Design Philosophy

Obsidian Finance follows a minimalist black-and-white design approach.

- High-contrast interface with generous whitespace.
- Clean typography and clear financial data hierarchy.
- Subtle animations and smooth transitions.
- Consistent light and dark themes.
- Responsive layouts for different screen sizes.

## 🔮 Future Enhancements

- Backend integration with REST APIs.
- Database storage for persistent financial records.
- User authentication and secure personal accounts.
- Monthly and yearly financial reports.
- Budget planning and spending limits.
- Export transactions to CSV and PDF.
- Recurring transaction support.
- Advanced financial analytics.

## 👩‍💻 Author

**Dipika Bhajipale**

Computer Science Engineering Student  
Aspiring Web Developer

## 📄 License

This project is intended for educational and personal portfolio purposes. A formal open-source license can be added when the project is ready for public distribution.

---

**Obsidian Finance**  
*Track smarter. Spend wiser. Stay in control.*
