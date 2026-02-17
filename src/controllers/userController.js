const User = require('../models/User');

const getUsers = (req, res) => {
  const users = User.findAll();
  res.json({ total: users.length, users });
};

const getUser = (req, res) => {
  const userId = parseInt(req.params.id);

  if (req.user.role !== 'admin' && req.user.id !== userId) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  const user = User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json({ user: User.getPublicData(user) });
};

const updateRole = (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  if (!['user', 'moderator', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Rol invalido. Usa: user, moderator o admin' });
  }

  const user = User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  User.updateRole(userId, role);

  res.json({
    message: `Rol actualizado a ${role}`,
    user: User.getPublicData(user)
  });
};

const deactivateUser = (req, res) => {
  const userId = parseInt(req.params.id);

  const user = User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  User.deactivate(userId);

  res.json({ message: 'Usuario desactivado' });
};

module.exports = { getUsers, getUser, updateRole, deactivateUser };