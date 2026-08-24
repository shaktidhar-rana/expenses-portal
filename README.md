# PennyTrack

PennyTrack is a responsive personal expense tracker MVP based on the provided development plan.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static server:

```powershell
python -m http.server 4173
```

Then visit `http://localhost:4173`. Transactions and categories persist in browser local storage. The app includes the planned dashboard, transaction CRUD form, filtering, category budgets, reports, settings, CSV import, and CSV export surfaces. Authentication and PostgreSQL-backed APIs remain the next production integration step from the plan.