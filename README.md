# BeatFlow - Music Streaming & Audio Management System
### Full Stack Web Development (CA-03)
**PRN:** `25070521128`  
**Repository Name:** `25070521128-CA-03`

---

## 📌 Project Overview
BeatFlow is a modern, responsive full-stack web application designed for audio streaming and music collection management. The application features a dedicated authentication system, persistent interactive audio playback, and complete CRUD operations connected to a MongoDB database.

---

## 📁 Repository Structure
Strictly structured according to the CA-03 assignment guidelines:
```text
25070521128/
├── client/                     # Frontend React Application (Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, SongCard, SongModal, DeleteModal, AudioPlayer
│   │   ├── context/            # AuthContext (JWT Authentication State)
│   │   ├── pages/              # AuthPage (Login/Register), DashboardPage
│   │   ├── services/           # api.js (Axios/Fetch REST integration)
│   │   ├── App.jsx             # Root App with Protected Views
│   │   ├── main.jsx
│   │   └── index.css           # Styling & theme variables
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
│   │   └── Song.js             # Song / Audio Track Schema
│   ├── routes/
│   │   ├── auth.js             # Auth Endpoints (Register, Login, Me)
│   │   └── songs.js            # Full CRUD Endpoints (POST, GET, PUT, DELETE, Seed)
│   ├── .env                    # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express Server Entry Point
│
├── .gitignore
└── README.md
```

---

## 🚀 Key Features

### 1. Authentication & Security
* **User Registration & Login**: Validated user credentials stored in MongoDB with salted bcrypt hashing.
* **JWT Protected Endpoints**: API routes guarded by Bearer tokens.
* **Separated Authentication View**: As mandated by the rubric, unauthenticated users only see the authentication screen, and are redirected to the dashboard upon successful login.
* **Evaluator Demo Button**: 1-click button on login screen to quickly test without manually typing credentials.

### 2. Music Streaming & Library Management (Full CRUD)
* **Create (`POST /api/songs`)**: Add tracks with Title, Artist, Album, Genre, Duration, Cover Art URL, and Audio stream URL.
* **Read (`GET /api/songs`)**: View all tracks with live search, genre filtering (Pop, Electronic, Lo-Fi, Rock, Ambient, etc.), and multi-mode sorting.
* **Update (`PUT /api/songs/:id`)**: Edit any track's metadata in real-time.
* **Delete (`DELETE /api/songs/:id`)**: Remove tracks with confirmation dialog.
* **Interactive Audio Player**: Bottom fixed player with play/pause, seek slider, duration formatting, volume control, and mute toggle.

---

## 🛠️ REST API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & get JWT token | Public |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Protected |
| `GET` | `/api/songs` | Fetch all songs (query by search, genre, sort) | Public |
| `GET` | `/api/songs/:id` | Fetch single song details | Public |
| `POST` | `/api/songs` | Add new song to library | Protected |
| `PUT` | `/api/songs/:id` | Update track information | Protected |
| `DELETE` | `/api/songs/:id` | Remove track from database | Protected |
| `POST` | `/api/songs/seed` | Seed default sample tracks | Public |

---

## ⚡ How to Run Locally

### 1. Prerequisites
* **Node.js**: v18+ installed
* **MongoDB**: Running locally on `mongodb://127.0.0.1:27017` or via MongoDB Compass

### 2. Start Backend Server
```bash
cd server
npm install
npm run dev
```
*Server will start on:* `http://localhost:5000`

### 3. Start Frontend Client
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
*Client will open on:* `http://localhost:3000`

---

## 💻 Git & GitHub Submission Details
1. **Repository Name:** `25070521128-CA-03`
2. **Commands used:**
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/25070521128-CA-03.git
git push -u origin main
```
