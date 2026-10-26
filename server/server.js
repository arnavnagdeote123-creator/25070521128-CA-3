const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'Full Stack Web Development CA-03',
    app: 'CineScope Movie & Series Watchlist Portal',
    prn: '25070521128',
    message: 'REST API Server Running',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me'
      },
      movies: {
        getAll: 'GET /api/movies',
        getById: 'GET /api/movies/:id',
        create: 'POST /api/movies',
        update: 'PUT /api/movies/:id',
        delete: 'DELETE /api/movies/:id',
        seed: 'POST /api/movies/seed'
      }
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🎬 CineScope Backend Server (PRN: 25070521128)`);
  console.log(`📡 Server listening on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});
