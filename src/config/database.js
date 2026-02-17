const bcrypt = require('bcryptjs');

const db = {
  users: [],
  refreshTokens: [],
  blacklistedTokens: [],
  counters: {
    userId: 1
  }
};

const createDefaultAdmin = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  db.users.push({
    id: db.counters.userId++,
    name: 'Admin',
    email: 'admin@test.com',
    password: hashedPassword,
    role: 'admin',
    isActive: true,
    createdAt: new Date()
  });

  console.log('  Admin creado: admin@test.com / admin123');
};

module.exports = { db, createDefaultAdmin };