const User = require('../models/User');

const getUsers = (req, res) => {
  const users = User.findAll();
  res.json({ total: users.length, users });
};

const getUser = (req, res) => {
  const userId = parseInt(req.params.id);

  if (req.user.role !== 'admin' && req.user.id !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const user = User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user: User.getPublicData(user) });
};

const updateRole = (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  if (!['user', 'moderator', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Use: user, moderator or admin' });
  }

  const user = User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  User.updateRole(userId, role);

  res.json({
    message: `Role updated to ${role}`,
    user: User.getPublicData(user)
  });
};

const deactivateUser = (req, res) => {
  const userId = parseInt(req.params.id);

  const user = User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  User.deactivate(userId);

  res.json({ message: 'User deactivated' });
};

module.exports = { getUsers, getUser, updateRole, deactivateUser };