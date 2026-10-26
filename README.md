# CineScope - Film & Series Watchlist Management Portal
### Full Stack Web Development (CA-03)
**PRN:** `25070521128`  
**Repository Name:** `25070521128-CA-03`

---

## 📌 Project Overview
**CineScope** is a modern full-stack web application for film enthusiasts to discover, track, review, and catalog masterpiece cinema and series. Built with the MERN stack (MongoDB, Express, React, Node.js), it includes complete user authentication, streaming service indicators, director technique notes, and full CRUD operations.

---

## 📁 Repository Structure
Conforms strictly to CA-03 specifications:
```text
25070521128/
├── client/                     # Frontend React Application (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Navbar, MovieCard, MovieModal, DeleteModal
│   │   ├── context/            # AuthContext (JWT Authentication State)
│   │   ├── pages/              # AuthPage (Login/Register), DashboardPage
│   │   ├── services/           # api.js (REST API integration)
│   │   ├── App.jsx             # Root App with Protected Views
│   │   ├── main.jsx
│   │   └── index.css           # Cinematic dark theme styling
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
│   │   └── Movie.js            # Movie Schema with Metadata & Director Notes
│   ├── routes/
│   │   ├── auth.js             # Auth Endpoints (Register, Login, Me)
│   │   └── movies.js           # Full CRUD Endpoints (POST, GET, PUT, DELETE, Seed)
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

### 1. Dedicated Authentication & Security
* **User Registration & Login**: Credentials stored in MongoDB with salted bcrypt hashing.
* **JWT Protected Endpoints**: API routes guarded by Bearer tokens.
* **Separated Authentication View**: Unauthenticated visitors only see the Login / Register screen and are redirected to the movie catalog upon successful login.
* **Evaluator Demo Button**: 1-click button on login screen to test instantly without manual typing.

### 2. Film & Series Watchlist (Full CRUD)
* **Create (`POST /api/movies`)**: Add films with Title, Director, Release Year, Genre, Duration, Poster URL, Streaming Platform, Watch Status, Rating, Personal Review, and Director Notes.
* **Read (`GET /api/movies`)**: View catalog with live search, Watch Status tabs (*All*, *Watchlist*, *Watched*, *Favorites*), genre chips, platform filters, and multi-mode sorting.
* **Update (`PUT /api/movies/:id`)**: Edit any film's details or cycle watch status in real-time.
* **Delete (`DELETE /api/movies/:id`)**: Remove films with confirmation dialog.
* **Seed Catalog (`POST /api/movies/seed`)**: Navbar button to load default cinematic masterpieces into MongoDB.

---

## 🛠️ REST API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & get JWT token | Public |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Protected |
| `GET` | `/api/movies` | Fetch all movies (search, genre, status, platform, sort) | Public |
| `GET` | `/api/movies/:id` | Fetch single movie details | Public |
| `POST` | `/api/movies` | Add new film to catalog | Protected |
| `PUT` | `/api/movies/:id` | Update film details | Protected |
| `DELETE` | `/api/movies/:id` | Remove film from database | Protected |
| `POST` | `/api/movies/seed` | Seed default curated movies | Public |

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

*(Or simply double-click `run-server.bat` and `run-client.bat` on Windows!)*

---

## 💻 Git & GitHub Submission
```bash
git init
git add .
git commit -m "feat: complete CineScope movie watchlist portal"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/25070521128-CA-03.git
git push -u origin main
```
