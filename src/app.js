const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Auth System with Roles is running',
    version: '1.0.0',
    author: 'Daniel Lozano',
    features: [
      'Access tokens (15 min)',
      'Refresh tokens (7 days)',
      'Token blacklist',
      'Roles: admin / moderator / user',
      'Rate limiting by IP'
    ],
    endpoints: {
      auth: '/api/auth',
      users: '/api/users'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Server error'
  });
});

module.exports = app;