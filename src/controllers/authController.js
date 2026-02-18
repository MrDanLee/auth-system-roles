const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { db } = require('../config/database');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (User.findByEmail(email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    db.refreshTokens.push({ token: refreshToken, userId: user.id });

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: User.getPublicData(user)
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = User.findByEmail(email);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await User.comparePassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    db.refreshTokens.push({ token: refreshToken, userId: user.id });

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: User.getPublicData(user)
    });
  } catch (error) {
    next(error);
  }
};

const refresh = (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const tokenData = db.refreshTokens.find(t => t.token === refreshToken);

    if (!tokenData) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(403).json({ error: 'Invalid user' });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({
      message: 'Token renewed',
      accessToken: newAccessToken
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Refresh token expired' });
    }
    next(error);
  }
};

const logout = (req, res) => {
  const { refreshToken } = req.body;

  db.blacklistedTokens.push(req.token);

  const index = db.refreshTokens.findIndex(t => t.token === refreshToken);
  if (index !== -1) {
    db.refreshTokens.splice(index, 1);
  }

  res.json({ message: 'Logout successful' });
};

const getMe = (req, res) => {
  res.json({ user: User.getPublicData(req.user) });
};

module.exports = { register, login, refresh, logout, getMe };