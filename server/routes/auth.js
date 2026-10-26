const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// In-memory fallback users cache (when MongoDB is offline)
const memoryUsers = [
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d1',
    name: 'Student Evaluator',
    email: 'student@symbiosis.edu',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'user'
  }
];

// Helper to generate JWT token
const generateToken = (id, name, email) => {
  return jwt.sign(
    { id, name, email },
    process.env.JWT_SECRET || 'super_secret_ca3_key_25070521128_symbiosis',
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // If MongoDB is connected, use Mongoose
    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password
      });

      const token = generateToken(user._id, user.name, user.email);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        }
      });
    } else {
      // In-Memory Fallback
      const userExists = memoryUsers.find((u) => u.email === normalizedEmail);
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: normalizedEmail,
        passwordHash: await bcrypt.hash(password, 10),
        role: 'user'
      };
      memoryUsers.push(newUser);

      const token = generateToken(newUser._id, newUser.name, newUser.email);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully (Memory Mode)',
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          token
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // If MongoDB is connected, use Mongoose
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user._id, user.name, user.email);

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        }
      });
    } else {
      // In-Memory Fallback
      const user = memoryUsers.find((u) => u.email === normalizedEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user._id, user.name, user.email);

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully (Memory Mode)',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile'
    });
  }
});

module.exports = router;
