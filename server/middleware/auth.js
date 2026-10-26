const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_ca3_key_25070521128_symbiosis'
      );

      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        // Fallback for demo when MongoDB Compass is offline
        req.user = {
          _id: decoded.id || '65f1a2b3c4d5e6f7a8b9c0d1',
          name: decoded.name || 'Student User',
          email: decoded.email || 'student@symbiosis.edu',
          role: 'user'
        };
      }
      return next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
