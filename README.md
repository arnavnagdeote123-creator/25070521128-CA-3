# FinWise — Personal Finance & Smart Expense Tracker
### Full Stack Web Development (CA-03)
**PRN:** `25070521128`  
**Repository Name:** `25070521128-CA-03`

---

## 📌 Project Overview
**FinWise** is a full-stack personal finance and expense management platform built using the MERN stack (MongoDB, Express, React, Node.js). It empowers users to monitor cash flow, track daily expenses and income streams, calculate savings rates, and categorize financial records with payment method tags.

---

## 📁 Repository Structure
Conforms strictly to the CA-03 assignment guidelines:
```text
25070521128/
├── client/                     # Frontend React Application (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Navbar, StatCards, TransactionRow, TransactionModal, DeleteModal
│   │   ├── context/            # AuthContext (JWT Authentication State)
│   │   ├── pages/              # AuthPage (Login/Register), DashboardPage
│   │   ├── services/           # api.js (REST API integration)
│   │   ├── App.jsx             # Root App with Protected Views
│   │   ├── main.jsx
│   │   └── index.css           # Financial dark-theme styling
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Node.js / Express Application
│   ├── config/
│   │   └── db.js               # MongoDB Connection logic (Compass / Local / Atlas)
│   ├── middleware/
│   │   └── auth.js             # JWT Verification Middleware
│   ├── models/
│   │   ├── User.js             # User Schema with Bcrypt Password Hashing
│   │   └── Transaction.js      # Financial Ledger Schema (Income / Expense)
│   ├── routes/
│   │   ├── auth.js             # Auth Endpoints (Register, Login, Me)
│   │   └── transactions.js     # Full CRUD Endpoints (POST, GET, PUT, DELETE, Seed)
│   ├── .env                    # Configured environment variables
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express Server Entry Point
│
├── run-client.bat              # One-click Windows runner for React client
├── run-server.bat              # One-click Windows runner for Express server
├── .gitignore
└── README.md
```

---

## 🚀 Key Features

### 1. User Authentication & Security
* **User Registration & Login**: Credentials stored in MongoDB with salted bcrypt hashing.
* **JWT Protected Endpoints**: API routes guarded by Bearer tokens.
* **Separated Authentication View**: Unauthenticated visitors only see the Login / Register screen and are redirected to the dashboard upon successful login.
* **Evaluator Demo Button**: 1-click button on login screen to test immediately without typing credentials.

### 2. Financial Ledger & Expense Tracking (Full CRUD)
* **Real-time Financial Metric Cards**:
  * **Total Balance**: Real-time net liquidity (Income - Expenses).
  * **Total Income**: Sum of all earnings (Salary, Freelance, Investments).
  * **Monthly Expenses**: Sum of all debits (Rent, Groceries, Dining, Utilities).
  * **Savings Rate (%)**: Dynamic calculation $\frac{\text{Income} - \text{Expenses}}{\text{Income}} \times 100$ with visual progress bar.
* **Create (`POST /api/transactions`)**: Record income or expense with Title, Amount, Category, Payment Method, Date, and Notes.
* **Read (`GET /api/transactions`)**: View transactions with live search, transaction type tabs (*All*, *Expenses*, *Income*), category filter chips, payment method filter, and sorting (*Date*, *Amount High-to-Low*, *Amount Low-to-High*).
* **Update (`PUT /api/transactions/:id`)**: Edit transaction amount, category, or remarks.
* **Delete (`DELETE /api/transactions/:id`)**: Remove entries with confirmation dialog.
* **Seed Ledger (`POST /api/transactions/seed`)**: Navbar button to load sample monthly finances into MongoDB.

---

## 🛠️ REST API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & get JWT token | Public |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Protected |
| `GET` | `/api/transactions` | Fetch all entries with summary statistics | Public |
| `GET` | `/api/transactions/:id` | Fetch single transaction details | Public |
| `POST` | `/api/transactions` | Log new transaction | Protected |
| `PUT` | `/api/transactions/:id` | Update transaction details | Protected |
| `DELETE` | `/api/transactions/:id` | Remove transaction from ledger | Protected |
| `POST` | `/api/transactions/seed` | Seed default monthly transactions | Public |

---

## ⚡ How to Run Locally

### 1. Start Backend Server
```bash
cd server
npm run dev
```
*Server runs on:* `http://localhost:5000`

### 2. Start Frontend Client
In a separate terminal:
```bash
cd client
npm run dev
```
*Client runs on:* `http://localhost:3000`

*(Or double-click `run-server.bat` and `run-client.bat` on Windows!)*

---

## 💻 Git & GitHub Submission
```bash
git init
git add .
git commit -m "feat: complete FinWise personal finance and expense tracker"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/25070521128-CA-03.git
git push -u origin main
```
