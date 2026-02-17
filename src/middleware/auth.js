const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { db } = require('../config/database');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    if (db.blacklistedTokens.includes(token)) {
      return res.status(401).json({ error: 'Token revocado' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Usuario no valido' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({ error: 'Token invalido' });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: `Se requiere rol: ${allowedRoles.join(' o ')}`
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };