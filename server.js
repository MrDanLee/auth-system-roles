require('dotenv').config();
const app = require('./src/app');
const { createDefaultAdmin } = require('./src/config/database');

const PORT = process.env.PORT || 3002;

createDefaultAdmin();

app.listen(PORT, () => {
  console.log('===========================================');
  console.log('  AUTH SYSTEM - By Daniel Lozano');
  console.log('===========================================');
  console.log(`  Servidor: http://localhost:${PORT}`);
  console.log('');
  console.log('  Usuario admin por defecto:');
  console.log('    Email:    admin@test.com');
  console.log('    Password: admin123');
  console.log('');
  console.log('  Roles disponibles:');
  console.log('    admin / moderator / user');
  console.log('');
  console.log('  Endpoints:');
  console.log('    POST /api/auth/register');
  console.log('    POST /api/auth/login');
  console.log('    POST /api/auth/refresh');
  console.log('    POST /api/auth/logout');
  console.log('    GET  /api/users        (admin)');
  console.log('    PUT  /api/users/:id/role (admin)');
  console.log('===========================================');
});