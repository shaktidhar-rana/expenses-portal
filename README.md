# PennyTrack

PennyTrack is a lightweight personal expense tracker for people who want a clear view of where their money goes. It brings daily expenses, income, categories, budgets, and spending patterns into one responsive browser application.

## Features

- Dashboard with monthly income, expenses, net balance, largest category, and average transaction summaries
- Add and edit income or expense transactions with amount, date, category, description, and merchant
- Delete transactions with confirmation
- Search and filter transactions by description, merchant, category, or type
- Predefined and custom spending categories
- Category budget limits with progress indicators
- Reports showing spending by category and spending over time
- CSV import and export for moving data in and out of the app
- Responsive layout for desktop and mobile browsers
- Local browser persistence using `localStorage`

## Technology Used

- HTML5 for the application structure
- CSS3 for responsive styling and visual design
- Vanilla JavaScript for application state, navigation, forms, filtering, charts, and CSV handling
- Browser `localStorage` for MVP data persistence
- Vercel for public static deployment

## Installation

1. Clone the repository:

	```powershell
	git clone https://github.com/shaktidhar-rana/expenses-portal.git
	cd expenses-portal
	```

2. No package installation is required. The application has no build step or external runtime dependencies.

## Run Locally

Start a local static server from the project directory:

```powershell
python -m http.server 4173
```

Open [http://localhost:4173](http://localhost:4173) in a browser. You can also open `index.html` directly, although a local server is recommended for a browser-like environment.

Transactions and categories are saved only in the current browser profile. Clearing browser storage will remove local MVP data.

## GitHub Repository

The source code is available at [github.com/shaktidhar-rana/expenses-portal](https://github.com/shaktidhar-rana/expenses-portal).

## Live Application URL

The deployed application is available at [pennytrack.vercel.app](https://pennytrack.vercel.app/).

The Vercel production deployment serves the static application publicly. The source repository is [github.com/shaktidhar-rana/expenses-portal](https://github.com/shaktidhar-rana/expenses-portal).

## Project Status

This is the frontend MVP described in the project plan. Authentication, a Node.js/Express API, and PostgreSQL persistence are planned production enhancements; the current version is intentionally dependency-free and stores data locally in the browser.