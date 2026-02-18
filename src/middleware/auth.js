const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { db } = require('../config/database');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    if (db.blacklistedTokens.includes(token)) {
      return res.status(401).json({ error: 'Token revoked' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: `Requires role: ${allowedRoles.join(' or ')}`
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };