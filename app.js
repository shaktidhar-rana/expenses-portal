const initialTransactions = [
  {
    id: 1,
    date: "2026-08-22",
    description: "Weekly grocery run",
    category: "Groceries",
    merchant: "Fresh Market",
    amount: 86.4,
    type: "expense",
  },
  {
    id: 2,
    date: "2026-08-21",
    description: "Monthly rent",
    category: "Housing",
    merchant: "Northside Properties",
    amount: 1450,
    type: "expense",
  },
  {
    id: 3,
    date: "2026-08-19",
    description: "Dinner with friends",
    category: "Dining",
    merchant: "Clover Kitchen",
    amount: 74.2,
    type: "expense",
  },
  {
    id: 4,
    date: "2026-08-15",
    description: "Video streaming",
    category: "Subscriptions",
    merchant: "Streamly",
    amount: 16.99,
    type: "expense",
  },
  {
    id: 5,
    date: "2026-08-12",
    description: "Train pass",
    category: "Transportation",
    merchant: "Metro",
    amount: 42,
    type: "expense",
  },
  {
    id: 6,
    date: "2026-08-01",
    description: "August salary",
    category: "Salary",
    merchant: "Acme Studio",
    amount: 3200,
    type: "income",
  },
];
const defaultCategories = [
  { name: "Housing", color: "#d88b49", budget: 1500 },
  { name: "Groceries", color: "#4e9b7e", budget: 350 },
  { name: "Dining", color: "#92b9a3", budget: 180 },
  { name: "Transportation", color: "#d6c47d", budget: 120 },
  { name: "Subscriptions", color: "#8b9fbe", budget: 60 },
  { name: "Salary", color: "#1b604e", budget: 0 },
];
const validDate = (value) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
const validTransaction = (value) =>
  value &&
  typeof value === "object" &&
  validDate(value.date) &&
  typeof value.description === "string" &&
  value.description.trim() &&
  typeof value.category === "string" &&
  Number.isFinite(Number(value.amount)) &&
  Number(value.amount) > 0 &&
  ["expense", "income"].includes(value.type);
const loadArray = (key, fallback, validator) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(value) && value.every(validator) ? value : fallback;
  } catch {
    return fallback;
  }
};
const storedTransactions = loadArray(
  "pennytrack-transactions",
  initialTransactions,
  validTransaction,
);
const storedCategories = loadArray(
  "pennytrack-categories",
  defaultCategories,
  (value) =>
    value &&
    typeof value.name === "string" &&
    value.name.trim() &&
    /^#[0-9a-f]{6}$/i.test(value.color) &&
    Number.isFinite(Number(value.budget)) &&
    Number(value.budget) >= 0,
);
let transactions = storedTransactions.map((t) => ({
  ...t,
  amount: Number(t.amount),
  merchant: String(t.merchant || ""),
}));
let categories = storedCategories.map((c) => ({
  ...c,
  budget: Number(c.budget),
}));
let settings = (() => {
  try {
    const value = JSON.parse(
      localStorage.getItem("pennytrack-settings") || "null",
    );
    return value &&
      ["USD", "EUR", "GBP"].includes(value.currency) &&
      Number.isFinite(Number(value.budget)) &&
      Number(value.budget) >= 0
      ? { ...value, budget: Number(value.budget) }
      : {
          name: "Jamie Davis",
          email: "jamie@example.com",
          currency: "USD",
          budget: 2210,
        };
  } catch {
    return {
      name: "Jamie Davis",
      email: "jamie@example.com",
      currency: "USD",
      budget: 2210,
    };
  }
})();
let currentView = "dashboard";
let monthOffset = 0;
let editingId = null;
const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: settings.currency,
  }).format(value);
const save = () => {
  try {
    localStorage.setItem(
      "pennytrack-transactions",
      JSON.stringify(transactions),
    );
    localStorage.setItem("pennytrack-categories", JSON.stringify(categories));
    localStorage.setItem("pennytrack-settings", JSON.stringify(settings));
  } catch (error) {
    console.error("Unable to save PennyTrack data.", error);
    alert(
      "Your changes could not be saved. Please check available browser storage.",
    );
  }
};
const monthDate = () => {
  const date = new Date(2026, 7 + monthOffset, 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    label: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
};
const monthTransactions = () => {
  const { year, month } = monthDate();
  return transactions.filter((t) => {
    const d = new Date(`${t.date}T12:00:00`);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};
const esc = (value) =>
  String(value).replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ],
  );
function render() {
  document
    .querySelectorAll(".nav-item")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.view === currentView),
    );
  document.getElementById("pageLabel").textContent =
    currentView[0].toUpperCase() + currentView.slice(1);
  document.getElementById("app").innerHTML = views[currentView]();
  updateSidebar();
}
function updateSidebar() {
  const tx = monthTransactions();
  const spent = tx
    .filter((t) => t.type === "expense")
    .reduce((a, t) => a + t.amount, 0);
  const budget = settings.budget;
  document.getElementById("sideBudget").textContent = money(
    Math.max(0, budget - spent),
  );
  document.getElementById("sideProgress").style.width =
    `${budget ? Math.min(100, (spent / budget) * 100) : 0}%`;
}
function header(title, kicker, action = "") {
  return `<div class="view-intro"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1></div>${action}</div>`;
}
function transactionRows(list) {
  if (!list.length)
    return '<div class="empty">No transactions match this view yet.</div>';
  return `<table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Merchant</th><th class="amount">Amount</th><th></th></tr></thead><tbody>${list
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(
      (t) =>
        `<tr><td>${new Date(`${t.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td><td><strong>${esc(t.description)}</strong></td><td><span class="tag ${t.type === "income" ? "green" : ""}">${esc(t.category)}</span></td><td>${esc(t.merchant || "—")}</td><td class="amount ${t.type}">${t.type === "income" ? "+" : "-"}${money(t.amount)}</td><td><button class="edit-link" data-edit="${t.id}">Edit</button> <button class="edit-link" data-delete="${t.id}">Delete</button></td></tr>`,
    )
    .join("")}</tbody></table>`;
}
function dashboard() {
  const tx = monthTransactions(),
    expenses = tx.filter((t) => t.type === "expense"),
    income = tx.filter((t) => t.type === "income");
  const spent = expenses.reduce((a, t) => a + t.amount, 0),
    earned = income.reduce((a, t) => a + t.amount, 0),
    largest = categories
      .map((c) => ({
        ...c,
        total: expenses
          .filter((t) => t.category === c.name)
          .reduce((a, t) => a + t.amount, 0),
      }))
      .sort((a, b) => b.total - a.total)
      .filter((c) => c.total)[0] || { name: "—", total: 0 };
    const budget = settings.budget;
  return `<section class="main-view">${header(monthDate().label, "Overview", `<div class="month-nav"><button data-month="-1" aria-label="Previous month">‹</button><span>MONTH ${String(monthDate().month + 1).padStart(2, "0")} / 12</span><button data-month="1" aria-label="Next month">›</button></div>`)}<div class="summary-grid"><article class="stat-card balance"><span class="label">NET BALANCE</span><strong>${money(earned - spent)}</strong><p>${money(earned)} income this month</p></article><article class="stat-card"><span class="label">TOTAL EXPENSES</span><strong>${money(spent)}</strong><p>${expenses.length} transactions this month</p></article><article class="stat-card"><span class="label">LARGEST CATEGORY</span><strong>${esc(largest.name)}</strong><p>${money(largest.total)} of your spending</p></article><article class="stat-card"><span class="label">AVERAGE TRANSACTION</span><strong>${money(expenses.length ? spent / expenses.length : 0)}</strong><p>Across recorded expenses</p></article></div><div class="dashboard-grid"><section class="panel"><div class="panel-heading"><div><div class="eyebrow">Where it goes</div><h2>Category spending</h2></div><span class="eyebrow">% of total</span></div>${categories
    .filter((c) => c.name !== "Salary")
    .map((c) => {
      const total = expenses
        .filter((t) => t.category === c.name)
        .reduce((a, t) => a + t.amount, 0);
      return `<div class="category-row"><div class="row-top"><span class="category-name"><i class="dot" style="background:${c.color}"></i>${esc(c.name)}</span><span>${money(total)}</span></div><div class="progress"><i style="width:${spent ? Math.max(2, (total / spent) * 100) : 0}%;background:${c.color}"></i></div></div>`;
    })
    .join(
      "",
    )}</section><section class="panel"><div class="panel-heading"><div><div class="eyebrow">Monthly guardrail</div><h2>Overall budget</h2></div><button class="edit-link" data-view="categories">Edit</button></div><div class="budget-number">${money(Math.max(0, budget - spent))} <span>remaining</span></div><div class="budget-meta"><span>${money(spent)} spent</span><span>${budget ? Math.round((spent / budget) * 100) : 0}% used</span></div><div class="progress"><i style="width:${budget ? Math.min(100, (spent / budget) * 100) : 0}%"></i></div><div class="signal-list"><div class="signal"><b>↗</b><span>Your top category is <strong>${esc(largest.name)}</strong>, at ${money(largest.total)}.</span></div><div class="signal"><b>!</b><span>${expenses.filter((t) => t.category === "Housing" || t.category === "Subscriptions").length} recurring expenses total ${money(expenses.filter((t) => t.category === "Housing" || t.category === "Subscriptions").reduce((a, t) => a + t.amount, 0))}.</span></div></div></section></div><section class="activity"><div class="panel-heading"><div><div class="eyebrow">Activity</div><h2>Recent transactions</h2></div><span class="eyebrow">${tx.length} records</span></div><div class="table-wrap">${transactionRows(tx.slice(0, 6))}</div></section></section>`;
}
function transactionsPage() {
  return `<section class="main-view">${header("Transactions", "Activity", `<button class="primary-button" id="addPage">＋ Add transaction</button>`)}<section class="page-panel"><div class="toolbar"><input id="search" placeholder="Search description or merchant"/><select id="filterCategory"><option value="">All categories</option>${categories.map((c) => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join("")}</select><select id="filterType"><option value="">All types</option><option value="expense">Expenses</option><option value="income">Income</option></select></div><div class="table-wrap" id="transactionTable">${transactionRows(transactions)}</div></section></section>`;
}
function categoriesPage() {
  return `<section class="main-view">${header("Categories", "Organize your money", `<button class="primary-button" id="addCategory">＋ Add category</button>`)}<div class="category-cards">${categories
    .map((c) => {
      const total = monthTransactions()
        .filter((t) => t.category === c.name && t.type === "expense")
        .reduce((a, t) => a + t.amount, 0);
      return `<article class="category-card"><i class="dot" style="background:${c.color}"></i><h3>${esc(c.name)}</h3><p>${c.name === "Salary" ? "Income" : "Expense"} category</p><div class="budget-line"><span>${c.budget ? `${money(total)} of ${money(c.budget)}` : "No budget limit"}</span><span>${c.budget ? Math.round((total / c.budget) * 100) + "%" : ""}</span></div>${c.budget ? `<div class="progress" style="margin-top:9px"><i style="width:${Math.min(100, (total / c.budget) * 100)}%;background:${c.color}"></i></div>` : ""}</article>`;
    })
    .join("")}</div></section>`;
}
function reportsPage() {
  const expenses = transactions.filter((t) => t.type === "expense"),
    total = expenses.reduce((a, t) => a + t.amount, 0),
    vals = [42, 68, 48, 91, 58, 75, 63, 96];
  return `<section class="main-view">${header("Reports", "Patterns worth noticing")}<div class="chart-layout"><section class="panel"><div class="panel-heading"><div><div class="eyebrow">This month</div><h2>Spending by category</h2></div></div><div class="chart-box"><div class="donut"></div></div><div class="legend">${categories
    .filter((c) => c.name !== "Salary")
    .slice(0, 4)
    .map((c) => {
      const value = expenses
        .filter((t) => t.category === c.name)
        .reduce((a, t) => a + t.amount, 0);
      return `<div class="legend-item"><div><i class="dot" style="background:${c.color}"></i>${esc(c.name)}</div><strong>${total ? Math.round((value / total) * 100) : 0}%</strong></div>`;
    })
    .join(
      "",
    )}</div></section><section class="panel"><div class="panel-heading"><div><div class="eyebrow">Last 8 months</div><h2>Spending over time</h2></div><span class="tag green">${money(total)} this month</span></div><div class="chart-box"><div class="bars">${vals.map((v, i) => `<div class="bar" style="height:${v * 1.8}px"><span>${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][i]}</span></div>`).join("")}</div></div></section></div></section>`;
}
function settingsPage() {
  return `<section class="main-view">${header("Settings", "Your account")}<div class="settings-grid"><section class="page-panel"><div class="eyebrow">Profile</div><h2>Personal details</h2><label class="settings-field">Full name<input id="settingsName" value="${esc(settings.name)}" required /></label><label class="settings-field">Email address<input id="settingsEmail" value="${esc(settings.email)}" type="email" required /></label><button class="primary-button" id="saveSettings">Save changes</button></section><section class="page-panel"><div class="eyebrow">Preferences</div><h2>Money display</h2><label class="settings-field">Currency<select id="settingsCurrency"><option value="USD" ${settings.currency === "USD" ? "selected" : ""}>USD — US Dollar</option><option value="EUR" ${settings.currency === "EUR" ? "selected" : ""}>EUR — Euro</option><option value="GBP" ${settings.currency === "GBP" ? "selected" : ""}>GBP — Pound Sterling</option></select></label><label class="settings-field">Monthly budget<input id="settingsBudget" value="${settings.budget}" type="number" min="0" step="0.01" required /></label><button class="ghost-button" id="importCsv">⇧ Import CSV</button></section></div></section>`;
}
const views = {
  dashboard,
  transactions: transactionsPage,
  categories: categoriesPage,
  reports: reportsPage,
  settings: settingsPage,
};
function openModal(id = null) {
  editingId = id;
  const form = document.getElementById("transactionForm");
  form.reset();
  document.getElementById("modalTitle").textContent = id
    ? "Edit transaction"
    : "Add an expense";
  document.getElementById("categorySelect").innerHTML = categories
    .map((c) => `<option value="${esc(c.name)}">${esc(c.name)}</option>`)
    .join("");
  if (id) {
    const t = transactions.find((x) => x.id === id);
    Object.entries(t).forEach(([key, value]) => {
      const input = form.elements[key];
      if (input) input.value = value;
    });
    form.elements.type.value = t.type;
  }
  document.getElementById("modalBackdrop").hidden = false;
  form.elements.amount.focus();
}
function exportCsv() {
  const rows = [
    ["Date", "Description", "Category", "Merchant", "Amount", "Type"],
    ...transactions.map((t) => [
      t.date,
      t.description,
      t.category,
      t.merchant || "",
      t.amount,
      t.type,
    ]),
  ];
  const blob = new Blob(
    [
      rows
        .map((r) =>
          r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
        )
        .join("\n"),
    ],
    { type: "text/csv" },
  );
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "pennytrack-transactions.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}
document.addEventListener("click", (e) => {
  const nav = e.target.closest("[data-view]");
  if (nav) {
    currentView = nav.dataset.view;
    document.getElementById("sidebar").classList.remove("open");
    render();
  }
  if (e.target.closest("#addTop,#addPage")) openModal();
  if (e.target.closest("#exportTop")) exportCsv();
  if (e.target.closest("[data-month]")) {
    monthOffset += Number(e.target.closest("[data-month]").dataset.month);
    render();
  }
  const edit = e.target.closest("[data-edit]");
  if (edit) openModal(Number(edit.dataset.edit));
  const remove = e.target.closest("[data-delete]");
  if (remove && confirm("Delete this transaction?")) {
    transactions = transactions.filter(
      (t) => t.id !== Number(remove.dataset.delete),
    );
    save();
    render();
  }
  if (e.target.closest("#addCategory")) {
    const name = prompt("Category name");
    if (name && /^[a-z0-9 &-]{1,32}$/i.test(name.trim()) && !categories.some((c) => c.name.toLowerCase() === name.trim().toLowerCase())) {
      categories.push({ name: name.trim(), color: "#6f8f82", budget: 0 });
      save();
      render();
    }
  }
  if (e.target.closest("#saveSettings")) {
    const name = document.getElementById("settingsName").value.trim();
    const email = document.getElementById("settingsEmail").value.trim();
    const budget = Number(document.getElementById("settingsBudget").value);
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !Number.isFinite(budget) || budget < 0) {
      alert("Enter a valid name, email address, and non-negative budget.");
      return;
    }
    settings = { name, email, currency: document.getElementById("settingsCurrency").value, budget };
    save();
    render();
  }
  if (e.target.closest("#closeModal,#cancelModal"))
    document.getElementById("modalBackdrop").hidden = true;
  if (e.target.closest("#mobileMenu"))
    document.getElementById("sidebar").classList.toggle("open");
  if (e.target.closest("#importCsv"))
    document.getElementById("csvInput").click();
});
document.addEventListener("input", (e) => {
  if (!["search", "filterCategory", "filterType"].includes(e.target.id)) return;
  const query = document.getElementById("search").value.toLowerCase();
  const cat = document.getElementById("filterCategory").value;
  const type = document.getElementById("filterType").value;
  document.getElementById("transactionTable").innerHTML = transactionRows(
    transactions.filter(
      (t) =>
        (!query ||
          `${t.description} ${t.merchant}`.toLowerCase().includes(query)) &&
        (!cat || t.category === cat) &&
        (!type || t.type === type),
    ),
  );
});
document.getElementById("transactionForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  data.amount = Number(data.amount);
  if (!validTransaction({ ...data, id: editingId || Date.now() })) {
    alert("Enter a valid date, description, category, amount, and transaction type.");
    return;
  }
  if (editingId)
    transactions = transactions.map((t) =>
      t.id === editingId ? { ...t, ...data } : t,
    );
  else transactions.unshift({ id: Date.now(), ...data });
  save();
  document.getElementById("modalBackdrop").hidden = true;
  render();
});
const parseCsv = (text) => {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"' && quoted && text[index + 1] === '"') { field += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === "," && !quoted) { row.push(field); field = ""; }
    else if ((character === "\n" || character === "\r") && !quoted) { if (character === "\r" && text[index + 1] === "\n") index += 1; row.push(field); rows.push(row); row = []; field = ""; }
    else field += character;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
};
document.getElementById("csvInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const rows = parseCsv(reader.result).slice(1);
    let imported = 0;
    rows.forEach(([date, description, category, merchant, amount, type]) => {
      const transaction = { id: Date.now() + Math.random(), date, description, category, merchant, amount: Number(amount), type: type || "expense" };
      if (validTransaction(transaction)) { transactions.push(transaction); imported += 1; }
    });
    e.target.value = "";
    save();
    render();
    alert(`${imported} transaction${imported === 1 ? "" : "s"} imported.`);
  };
  reader.onerror = () => alert("The CSV file could not be read.");
  reader.readAsText(file);
});
render();
