# User Management Backend

A production-grade REST API for comprehensive user management built with TypeScript, Fastify, Prisma, and PostgreSQL.

<p align="center">
  <img src="/web/public/hero.png" alt="User Management Backend Banner" width="100%" />
</p>

## Features

- **Authentication**: JWT-based with access/refresh tokens, email verification, password reset
- **Two-Factor Authentication**: TOTP-based 2FA with QR codes and backup codes
- **Role-Based Access Control**: 14 granular permissions with custom roles
- **Session Management**: Track and revoke sessions across devices
- **Admin Dashboard**: User search, impersonation, bulk operations
- **Audit Logging**: Complete activity tracking and analytics
- **GDPR Compliance**: Data export, soft delete with recovery

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Validation**: Zod

## Quick Start

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
npm run db:migrate

# Seed default roles
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
PORT=5001
NODE_ENV=development
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

## API Overview

Base URL: `http://localhost:5001/api/v1`

| Endpoint | Description |
|----------|-------------|
| `/auth/*` | Authentication (register, login, logout, etc.) |
| `/users/*` | User profile management |
| `/account/*` | Account operations (deactivate, delete, export) |
| `/2fa/*` | Two-factor authentication |
| `/sessions/*` | Session management |
| `/roles/*` | Role & permission management (admin) |
| `/admin/*` | Admin operations |
| `/audit/*` | Audit logs & analytics (admin) |
| `/notifications/*` | User notifications |
| `/health` | Health checks |

See [API Documentation](./backend/docs/API.md) for full details.

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

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with short expiry
- Rate limiting (100 req/min)
- Account lockout after 5 failed attempts
- Security headers via Helmet
- Input validation on all endpoints

## Default Roles

| Role | Permissions |
|------|-------------|
| admin | All permissions |
| moderator | USER_READ, USER_UPDATE, AUDIT_READ |
| user | Basic access |

## License

MIT

## Author

Built as a learning project demonstrating production-grade backend practices.
