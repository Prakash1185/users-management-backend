# Database Setup Documentation

## Overview
This project uses Prisma ORM with PostgreSQL for database management.

## Database Schema

### Core Tables
- **users**: User accounts with authentication details
- **user_profiles**: Extended user information (bio, phone, preferences)
- **refresh_tokens**: JWT refresh tokens for authentication
- **email_verifications**: Email verification tokens
- **password_resets**: Password reset tokens
- **password_histories**: Track password history to prevent reuse
- **roles**: Role definitions with permissions
- **user_roles**: User-role junction table
- **two_factor_auth**: 2FA configuration per user
- **sessions**: Active user sessions
- **audit_logs**: Comprehensive audit trail
- **notifications**: User notifications

## Scripts

### Generate Prisma Client
```bash
npm run db:generate
```
Generates TypeScript types and Prisma Client from schema.

### Create Migration
```bash
npm run db:migrate
```
Creates a new migration from schema changes and applies it.

### Deploy Migrations (Production)
```bash
npm run db:migrate:prod
```
Applies pending migrations in production without prompts.

### Seed Database
```bash
npm run db:seed
```
Seeds database with default data (roles: admin, user, moderator).

### Prisma Studio
```bash
npm run db:studio
```
Opens Prisma Studio GUI to view and edit data.

### Reset Database
```bash
npm run db:reset
```
WARNING: Drops database, recreates it, and runs migrations + seed.

## Default Roles

### Admin Role
- Full system access
- Permissions: users, roles, audit, system management

### User Role
- Basic user access
- Permissions: profile read/update

### Moderator Role
- Elevated permissions
- Permissions: user management, content moderation

## Database Connection

Connection pooling is configured with 17 connections by default.

Connection string format:
```
postgresql://username:password@host:port/database?sslmode=require
```

## Prisma Client Usage

Import in your code:
```typescript
import prisma from './config/database';

// Example: Get all users
const users = await prisma.user.findMany();

// Example: Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    username: 'johndoe',
    password: 'hashedPassword',
  },
});
```

## Migration Workflow

1. Modify `prisma/schema.prisma`
2. Run `npm run db:migrate` with a descriptive name
3. Prisma generates migration SQL
4. Migration is applied to database
5. Prisma Client is regenerated

## Best Practices

- Always use Prisma Client for database operations (prevents SQL injection)
- Use transactions for multi-step operations
- Index frequently queried fields
- Use soft deletes (deletedAt) instead of hard deletes
- Audit all sensitive operations
- Use connection pooling in production
- Run migrations in CI/CD pipeline
- Keep schema.prisma in version control
- Back up production database before migrations

## Troubleshooting

### Cannot connect to database
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Check firewall/network settings

### Migration conflicts
```bash
npm run db:reset  # Development only!
```

### Out of sync schema
```bash
npm run db:generate
```

## Production Deployment

1. Set DATABASE_URL environment variable
2. Run migrations: `npm run db:migrate:prod`
3. Start application
4. Database connection is automatic
