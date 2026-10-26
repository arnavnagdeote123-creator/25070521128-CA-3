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
    app: 'FinWise Personal Finance & Expense Tracker',
    prn: '25070521128',
    message: 'REST API Server Running',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me'
      },
      transactions: {
        getAll: 'GET /api/transactions',
        getById: 'GET /api/transactions/:id',
        create: 'POST /api/transactions',
        update: 'PUT /api/transactions/:id',
        delete: 'DELETE /api/transactions/:id',
        seed: 'POST /api/transactions/seed'
      }
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

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
  console.log(`💰 FinWise Backend Server (PRN: 25070521128)`);
  console.log(`📡 Server listening on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});
