# Personal Expense Tracker — Development Plan

## Application Name
**PennyTrack** — A Personal Expense Tracker

## Problem Statement
Many people lose track of where their money goes each month because spending is scattered across cash, cards, and multiple apps, with no simple way to categorize it or see trends over time. PennyTrack solves this by giving an individual a single, easy-to-use place to log expenses and income, categorize them, and visualize spending patterns — helping them build better financial habits and stick to a budget.

## Target Users
- Individuals who want to track personal daily spending and income
- Students or young professionals managing a limited budget
- Anyone who wants a lightweight alternative to complex finance/accounting software
- Single-user focus (not designed for shared/family accounts in v1)

## Main Features
1. **User authentication** — sign up, log in, log out, secure session
2. **Add/edit/delete transactions** — amount, category, date, note, type (income/expense)
3. **Categories** — predefined + custom categories (Food, Transport, Rent, Salary, etc.)
4. **Dashboard** — summary of total income, total expenses, and net balance for a selected period
5. **Charts & reports** — spending by category (pie chart), spending over time (line/bar chart)
6. **Filtering & search** — filter transactions by date range, category, or type
7. **Monthly budget limits** — set a budget per category and get warned when near/over limit
8. **Export data** — download transactions as CSV
9. **Responsive design** — usable on both desktop and mobile browsers

## Pages / Screens Required
| # | Screen | Purpose |
|---|--------|---------|
| 1 | Login / Sign Up | User authentication |
| 2 | Dashboard | Overview: balance, recent transactions, quick charts |
| 3 | Transactions List | Full list with filter/search/sort, edit/delete actions |
| 4 | Add/Edit Transaction | Form to create or update a transaction |
| 5 | Categories | View/manage custom categories and budget limits |
| 6 | Reports/Analytics | Charts for spending by category and over time |
| 7 | Settings/Profile | Update profile, change password, currency preference |

## Technology Stack
- **Frontend:** React (with React Router), Chart.js or Recharts for visualizations, Tailwind CSS for styling
- **Backend:** Node.js with Express.js (REST API)
- **Database:** PostgreSQL (relational data fits transactions/categories well)
- **Authentication:** JWT-based auth with bcrypt password hashing
- **ORM:** Prisma or Sequelize (simplifies DB queries and migrations)
- **Hosting:**
  - Frontend → Vercel or Netlify
  - Backend → Render or Railway
  - Database → Supabase, Railway, or Neon (managed PostgreSQL)
- **Version control:** Git + GitHub

> Alternative simpler stack (if you want to avoid a backend/server): React + Firebase (Firestore + Firebase Auth) — good for a faster MVP with less setup.

## Project Folder Structure
```
expense-tracker/
├── PLAN.md
├── README.md
├── .gitignore
├── client/                      # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   ├── CategoryManager.jsx
│   │   │   ├── Charts/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── Settings.jsx
│   │   ├── context/              # Auth context, global state
│   │   ├── services/             # API calls (axios/fetch wrappers)
│   │   ├── utils/                # Formatters, helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
├── server/                       # Node/Express backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   └── categoryController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   └── categoryRoutes.js
│   │   ├── models/                # Prisma schema or Sequelize models
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── config/
│   │   │   └── db.js
│   │   └── app.js
│   ├── prisma/ (or migrations/)
│   ├── package.json
│   └── server.js
└── docs/
    └── api-spec.md               # API endpoint documentation
```

## Data That Needs to Be Stored
**Users**
- id, name, email, password (hashed), currency preference, created_at

**Categories**
- id, user_id (nullable for default categories), name, type (income/expense), color/icon

**Transactions**
- id, user_id, category_id, amount, type (income/expense), date, note, created_at, updated_at

**Budgets**
- id, user_id, category_id, monthly_limit, month/year

**Sessions/Tokens** (if not using stateless JWT only)
- token, user_id, expires_at

## Development Steps
1. **Planning & design** — finalize requirements, wireframe key screens, design DB schema
2. **Project setup** — initialize `client/` (React) and `server/` (Express) repos, configure Git
3. **Backend: Auth** — build signup/login/logout API with JWT + bcrypt
4. **Backend: Core APIs** — CRUD endpoints for transactions, categories, budgets
5. **Database setup** — create PostgreSQL schema/migrations, seed default categories
6. **Frontend: Auth pages** — build Login/Signup UI, connect to backend, handle tokens
7. **Frontend: Core pages** — build Dashboard, Transactions list, Add/Edit form
8. **Frontend: Categories & Budgets** — build category manager and budget-setting UI
9. **Frontend: Reports** — integrate charting library for category/time-based visualizations
10. **Filtering, search, CSV export** — add these secondary features
11. **Testing** — unit tests for backend (Jest), manual/UI testing for frontend, fix bugs
12. **Polish** — responsive design pass, loading states, error handling, empty states
13. **Deployment** — deploy backend, frontend, and database (see below)
14. **Post-launch** — gather feedback, monitor errors, plan v2 features (multi-currency, recurring transactions, shared budgets)

## Deployment Approach
1. **Database:** Provision a managed PostgreSQL instance (Supabase/Neon/Railway); run migrations against it.
2. **Backend:** Deploy the Express API to Render or Railway; set environment variables (DB connection string, JWT secret, CORS allowed origins).
3. **Frontend:** Build the React app (`npm run build`) and deploy to Vercel or Netlify; set the API base URL as an environment variable pointing to the deployed backend.
4. **Domain & HTTPS:** Use the free subdomain provided by the host initially (e.g., `pennytrack.vercel.app`); attach a custom domain later if desired — HTTPS is handled automatically by these platforms.
5. **CI/CD:** Connect the GitHub repo to Vercel/Render so every push to `main` auto-deploys; use a `develop` branch for staging if needed.
6. **Monitoring:** Add basic error logging (e.g., Sentry free tier) and check platform logs/dashboards for uptime and errors.
7. **Backups:** Enable automatic daily backups on the managed database service.
