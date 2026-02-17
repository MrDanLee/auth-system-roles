const { db } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { name, email, password, role } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const allowedRoles = ['user', 'moderator'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    const user = {
      id: db.counters.userId++,
      name,
      email,
      password: hashedPassword,
      role: userRole,
      isActive: true,
      createdAt: new Date()
    };

    db.users.push(user);
    return user;
  }

  static findByEmail(email) {
    return db.users.find(u => u.email === email);
  }

  static findById(id) {
    return db.users.find(u => u.id === id);
  }

  static findAll() {
    return db.users.map(u => this.getPublicData(u));
  }

  static updateRole(userId, role) {
    const user = this.findById(userId);
    if (user) user.role = role;
    return user;
  }

  static deactivate(userId) {
    const user = this.findById(userId);
    if (user) user.isActive = false;
    return user;
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static getPublicData(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
  }
}

module.exports = User;