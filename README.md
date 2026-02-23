# Auth System with Roles

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

> Authentication and authorization system with JWT access/refresh tokens, role-based access control (RBAC), and production-ready security features

## ✨ Features

### Authentication & Authorization
- ✅ **Dual-token system**: Access tokens (15 min) + Refresh tokens (7 days)
- ✅ **Token blacklist**: Secure logout with revoked token tracking
- ✅ **Role-based access control**: Admin, Moderator, User roles
- ✅ **Granular permissions**: Route-level authorization guards
- ✅ **Automatic admin creation**: Default admin user on startup

### Security
- ✅ **Rate limiting**: 5 login attempts per 15 minutes per IP
- ✅ **Password hashing**: bcrypt with cost factor 10
- ✅ **Input validation**: express-validator for all endpoints
- ✅ **Security headers**: Helmet.js protection
- ✅ **CORS configuration**: Configurable origin whitelist

### Developer Experience
- ✅ **Clean Architecture**: Services, Repositories, Controllers pattern
- ✅ **OpenAPI/Swagger**: Interactive API documentation
- ✅ **Structured logging**: Winston with environment-based formatting
- ✅ **Error handling**: Consistent error responses
- ✅ **Environment config**: dotenv for configuration management

## 🏗️ Architecture

```
┌─────────────────┐
│   Controllers   │  HTTP layer (requests/responses)
└────────┬────────┘
         │
┌────────▼────────┐
│    Services     │  Business logic (token management, auth flow)
└────────┬────────┘
         │
┌────────▼────────┐
│  Repositories   │  Data access (user queries, token storage)
└────────┬────────┘
         │
┌────────▼────────┐
│     Models      │  Data structures (User, Token schemas)
└─────────────────┘
```

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/MrDanLee/auth-system-roles.git
cd auth-system-roles

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev
```

**Default admin credentials:**
```
Email:    admin@test.com
Password: admin123
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and get tokens | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout and blacklist token | Yes |
| GET | `/api/auth/me` | Get current user info | Yes |

### User Management (Admin Only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | List all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin/Self |
| PUT | `/api/users/:id/role` | Update user role | Admin |
| DELETE | `/api/users/:id` | Deactivate user | Admin |

## 🔐 Authentication Flow

### 1. Register/Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@test.com",
    "role": "admin",
    "isActive": true
  }
}
```

### 2. Use Access Token
```bash
GET /api/users
Authorization: Bearer <accessToken>
```

### 3. Refresh When Expired
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Token renewed",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Logout
```bash
POST /api/auth/logout
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 👥 User Roles

### Admin
- Full system access
- Manage all users
- Change user roles
- Deactivate users

### Moderator
- Access own profile
- Elevated permissions above regular users

### User
- Access own profile
- Basic authenticated actions

## 🔒 Security Features

### Token Management
- **Access tokens**: Short-lived (15 minutes) for API requests
- **Refresh tokens**: Long-lived (7 days) for obtaining new access tokens
- **Token blacklist**: Revoked tokens stored to prevent reuse
- **Automatic cleanup**: Expired blacklisted tokens removed periodically

### Rate Limiting
```
Login endpoint:   5 requests per 15 minutes per IP
General API:    100 requests per 15 minutes per IP
```

### Password Security
- Hashed with bcrypt (cost factor: 10)
- Never stored or transmitted in plain text
- Constant-time comparison to prevent timing attacks

## 🔄 Token Lifecycle

```
1. User logs in
   ↓
2. Receives access token (15min) + refresh token (7d)
   ↓
3. Uses access token for API requests
   ↓
4. Access token expires
   ↓
5. Uses refresh token to get new access token
   ↓
6. Repeat steps 3-5
   ↓
7. User logs out
   ↓
8. Both tokens added to blacklist
```

## 📋 Example Use Cases

### Register New User
```bash
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "user"
  }'
```

### Change User Role (Admin)
```bash
curl -X PUT http://localhost:3002/api/users/2/role \
  -H "Authorization: Bearer <admin-access-token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "moderator"}'
```

### List All Users (Admin)
```bash
curl http://localhost:3002/api/users \
  -H "Authorization: Bearer <admin-access-token>"
```

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **Security:** Helmet, express-rate-limit
- **Logging:** Winston
- **Documentation:** Swagger/OpenAPI

## 📁 Project Structure

```
src/
├── config/
│   ├── database.js       # In-memory data store
│   └── logger.js         # Winston configuration
├── controllers/
│   ├── authController.js # Auth request handlers
│   └── userController.js # User management handlers
├── services/
│   └── authService.js    # Auth business logic
├── repositories/
│   └── userRepository.js # User data access
├── models/
│   └── User.js           # User data model
├── middlewares/
│   ├── auth.js           # JWT verification
│   └── rateLimit.js      # Rate limiting config
├── routes/
│   ├── authRoutes.js     # Auth endpoints
│   └── userRoutes.js     # User endpoints
└── app.js                # Express app setup
```

## 🔐 Environment Variables

```env
# Server
PORT=3002
NODE_ENV=development

# JWT Tokens
ACCESS_TOKEN_SECRET=your-access-secret-min-32-chars
REFRESH_TOKEN_SECRET=your-refresh-secret-min-32-chars
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5

# CORS
CORS_ORIGIN=*

# Logging
LOG_LEVEL=info
```

## 📈 Roadmap

- Database persistence (PostgreSQL or MongoDB) to replace in-memory storage
- Automated test suite with Jest
- Token cleanup background job
- CI/CD pipeline with GitHub Actions
- Expanded moderator permissions

## 📈 Performance Considerations

- **Token validation**: O(1) lookup in blacklist
- **Rate limiting**: In-memory store (use Redis in production)
- **Password hashing**: Balanced cost factor (10)
- **Logging**: Async, environment-aware

## 🤝 Contributing

This is a portfolio project showcasing authentication best practices. Feedback welcome!

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 👤 Author

**Daniel Andrés Lozano Meriño**

- 💼 GitHub: [@MrDanLee](https://github.com/MrDanLee)
- 📧 Email: daniel23lozano@gmail.com

---

**Built with 🔐 and security in mind**
