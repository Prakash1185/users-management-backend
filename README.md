# User Management Backend

A production-grade REST API for comprehensive user management built with TypeScript, Fastify, Prisma, and PostgreSQL.

<p align="center">
  <img src="/web/public/hero.png" alt="User Management Backend Banner" width="100%" />
</p>

## ✨ Features

- **Authentication**: JWT-based with access/refresh tokens, email verification, password reset
- **Two-Factor Authentication**: TOTP-based 2FA with QR codes and 10 backup codes
- **Role-Based Access Control**: 14 granular permissions with custom roles
- **Session Management**: Track and revoke sessions across devices
- **Admin Dashboard**: User search, impersonation, bulk operations
- **Audit Logging**: Complete activity tracking and analytics
- **Notifications**: In-app notification system
- **GDPR Compliance**: Data export, soft delete with 30-day recovery

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js 18+ |
| Language | TypeScript (strict mode) |
| Framework | Fastify |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcrypt (12 rounds) |
| 2FA | otplib (TOTP) |
| Validation | Zod |
| Logging | Pino |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repo-url>
cd users_management_backend

# Install backend dependencies
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL and secrets

# Run database migrations
npx prisma migrate dev

# Seed default roles
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/user_management"
PORT=5001
NODE_ENV=development
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

---

## 📚 API Reference

Base URL: `http://localhost:5001/api/v1`

### Authentication `/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | Login and get tokens | ❌ |
| `POST` | `/auth/logout` | Invalidate refresh token | ❌ |
| `POST` | `/auth/refresh` | Refresh access token | ❌ |
| `GET` | `/auth/verify-email` | Verify email with token | ❌ |
| `POST` | `/auth/resend-verification` | Resend verification email | ❌ |
| `POST` | `/auth/forgot-password` | Request password reset | ❌ |
| `POST` | `/auth/reset-password` | Reset password with token | ❌ |
| `POST` | `/auth/change-password` | Change current password | ✅ |
| `GET` | `/auth/check-email` | Check email availability | ❌ |
| `GET` | `/auth/check-username` | Check username availability | ❌ |

### User Profile `/users`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/users/profile` | Get current user profile | ✅ |
| `PUT` | `/users/profile` | Update profile (full) | ✅ |
| `PATCH` | `/users/profile` | Update profile (partial) | ✅ |
| `PUT` | `/users/preferences` | Update user preferences | ✅ |
| `GET` | `/users/:username` | Get public profile | ❌ |

### Account Management `/account`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/account/deactivate` | Deactivate account | ✅ |
| `POST` | `/account/reactivate` | Reactivate account | ❌ |
| `DELETE` | `/account/` | Soft delete (30-day recovery) | ✅ |
| `POST` | `/account/recover` | Recover deleted account | ❌ |
| `POST` | `/account/permanent-delete` | Permanent deletion | ✅ |
| `GET` | `/account/export` | Export all user data (GDPR) | ✅ |

### Two-Factor Authentication `/2fa`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/2fa/status` | Get 2FA status | ✅ |
| `POST` | `/2fa/setup` | Generate QR code & secret | ✅ |
| `POST` | `/2fa/enable` | Enable 2FA with TOTP | ✅ |
| `POST` | `/2fa/disable` | Disable 2FA | ✅ |
| `POST` | `/2fa/verify` | Verify TOTP token | ✅ |
| `POST` | `/2fa/backup-codes` | Regenerate backup codes | ✅ |

### Session Management `/sessions`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/sessions/` | List all active sessions | ✅ |
| `DELETE` | `/sessions/:sessionId` | Revoke specific session | ✅ |
| `POST` | `/sessions/revoke-all` | Revoke all other sessions | ✅ |

### Roles & Permissions `/roles`

| Method | Endpoint | Description | Auth | Permission |
|--------|----------|-------------|------|------------|
| `GET` | `/roles/` | List all roles | ✅ | `ROLE_READ` |
| `GET` | `/roles/permissions` | List available permissions | ✅ | `ROLE_READ` |
| `GET` | `/roles/:id` | Get role by ID | ✅ | `ROLE_READ` |
| `POST` | `/roles/` | Create new role | ✅ | Admin |
| `PUT` | `/roles/:id` | Update role | ✅ | Admin |
| `DELETE` | `/roles/:id` | Delete role | ✅ | Admin |
| `GET` | `/roles/user/:userId` | Get user's roles | ✅ | `USER_READ` |
| `POST` | `/roles/user/:userId/assign` | Assign role to user | ✅ | `ROLE_ASSIGN` |
| `DELETE` | `/roles/user/:userId/:roleId` | Remove role from user | ✅ | `ROLE_ASSIGN` |

### Admin Panel `/admin`

| Method | Endpoint | Description | Auth | Permission |
|--------|----------|-------------|------|------------|
| `GET` | `/admin/dashboard` | Dashboard stats | ✅ | Admin |
| `GET` | `/admin/users` | Search users | ✅ | `USER_READ` |
| `GET` | `/admin/users/:userId` | Get user details | ✅ | `USER_READ` |
| `POST` | `/admin/users/:userId/reset-password` | Force password reset | ✅ | `USER_MANAGE` |
| `POST` | `/admin/users/:userId/verify-email` | Manually verify email | ✅ | `USER_MANAGE` |
| `POST` | `/admin/users/:userId/unlock` | Unlock locked account | ✅ | `USER_MANAGE` |
| `POST` | `/admin/users/:userId/suspend` | Suspend user | ✅ | `USER_MANAGE` |
| `POST` | `/admin/users/:userId/reactivate` | Reactivate user | ✅ | `USER_MANAGE` |
| `POST` | `/admin/users/:userId/impersonate` | Impersonate user | ✅ | `ADMIN_ACCESS` |
| `POST` | `/admin/bulk/assign-role` | Bulk assign role | ✅ | `ROLE_ASSIGN` |

### Audit Logs `/audit`

| Method | Endpoint | Description | Auth | Permission |
|--------|----------|-------------|------|------------|
| `GET` | `/audit/` | Get audit logs | ✅ | `AUDIT_READ` |
| `GET` | `/audit/stats` | Get audit statistics | ✅ | `AUDIT_READ` |
| `GET` | `/audit/analytics` | Get analytics data | ✅ | `AUDIT_READ` |
| `GET` | `/audit/user/:userId` | Get user activity | ✅ | `AUDIT_READ` |
| `POST` | `/audit/cleanup` | Cleanup old logs | ✅ | Admin |

### Notifications `/notifications`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/notifications/` | Get all notifications | ✅ |
| `PATCH` | `/notifications/:id/read` | Mark as read | ✅ |
| `PATCH` | `/notifications/read-all` | Mark all as read | ✅ |
| `DELETE` | `/notifications/:id` | Delete notification | ✅ |
| `DELETE` | `/notifications/` | Delete all notifications | ✅ |

### File Upload `/upload`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/upload/avatar` | Upload avatar image | ✅ |
| `DELETE` | `/upload/avatar` | Remove avatar | ✅ |

### Health Checks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Basic health check |
| `GET` | `/health/detailed` | Detailed health with dependencies |
| `GET` | `/ready` | Kubernetes readiness probe |
| `GET` | `/live` | Kubernetes liveness probe |

---

## 🔐 Permissions

| Permission | Description |
|------------|-------------|
| `USER_READ` | View user details |
| `USER_CREATE` | Create new users |
| `USER_UPDATE` | Update user data |
| `USER_DELETE` | Delete users |
| `USER_MANAGE` | Full user management |
| `ROLE_READ` | View roles |
| `ROLE_CREATE` | Create roles |
| `ROLE_UPDATE` | Update roles |
| `ROLE_DELETE` | Delete roles |
| `ROLE_ASSIGN` | Assign/remove roles |
| `ADMIN_ACCESS` | Admin panel access |
| `ADMIN_SETTINGS` | System settings |
| `AUDIT_READ` | View audit logs |
| `SYSTEM_MANAGE` | System management |

### Default Roles

| Role | Permissions |
|------|-------------|
| `admin` | All permissions |
| `moderator` | USER_READ, USER_UPDATE, AUDIT_READ |
| `user` | Basic access (own profile only) |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── repositories/ # Data access
│   │   ├── middlewares/  # Auth, validation, RBAC
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Helpers
│   │   └── validators/   # Zod schemas
│   ├── prisma/           # Database schema
│   ├── tests/            # Test suites
│   └── docs/             # Documentation
└── web/                  # Next.js showcase frontend
```

## Scripts

```bash
# Development
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed default data
npm run db:studio    # Open Prisma Studio

# Testing
npm run test         # Run tests
npm run test:coverage # With coverage

# Code Quality
npm run lint         # ESLint
npm run format       # Prettier
```

## Architecture

The project follows **Clean Architecture** principles:

1. **Controllers** - Handle HTTP requests, validate input
2. **Services** - Business logic and rules
3. **Repositories** - Data access layer (Prisma)

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT access tokens expire in 15 minutes
- Refresh tokens stored in database (revocable)
- Rate limiting (100 requests/minute)
- Account lockout after 5 failed attempts
- Security headers via Helmet
- Input validation on all endpoints (Zod)
- SQL injection prevention (Prisma ORM)

---

## 📂 Database Schema

```
users              # Core user data
user_profiles      # Extended profile info
refresh_tokens     # JWT refresh tokens
email_verifications # Email verification tokens
password_resets    # Password reset tokens
password_histories # Previous passwords (prevent reuse)
roles              # Custom roles
user_roles         # User-role assignments
two_factor_auth    # 2FA secrets & backup codes
sessions           # Active sessions
audit_logs         # Activity logs
notifications      # User notifications
```

---

## 🌐 Documentation Site

The `web/` folder contains a Next.js documentation site built with:
- **Shadcn UI** components
- **Dark/Light mode** toggle
- **Sidebar navigation**
- All API endpoints documented

```bash
cd web
npm install
npm run dev
```

---

## 📝 License

MIT

## 👤 Author

Built as a learning project demonstrating production-grade backend architecture and best practices.
