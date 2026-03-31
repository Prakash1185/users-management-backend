# User Management Backend - API Documentation

## Overview
Production-grade REST API for comprehensive user management including authentication, RBAC, 2FA, and admin features.

**Base URL**: `http://localhost:5001/api/v1`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Endpoints

### Auth Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/refresh` | Refresh access token | No (needs refresh token) |
| POST | `/auth/verify-email` | Verify email with token | No |
| POST | `/auth/resend-verification` | Resend verification email | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| POST | `/auth/change-password` | Change password | Yes |

#### Register User
```json
POST /auth/register
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

---

### User Routes (`/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Get current user profile | Yes |
| PATCH | `/users/me` | Update profile | Yes |
| GET | `/users/me/preferences` | Get preferences | Yes |
| PATCH | `/users/me/preferences` | Update preferences | Yes |
| GET | `/users/:username/public` | Get public profile | No |

---

### Account Routes (`/account`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/account/deactivate` | Deactivate account | Yes |
| POST | `/account/reactivate` | Reactivate account | Yes |
| DELETE | `/account` | Soft delete (30-day recovery) | Yes |
| DELETE | `/account/permanent` | Permanent deletion | Yes |
| GET | `/account/export` | GDPR data export | Yes |

---

### 2FA Routes (`/2fa`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/2fa/setup` | Generate 2FA secret & QR | Yes |
| POST | `/2fa/enable` | Enable 2FA with TOTP | Yes |
| POST | `/2fa/disable` | Disable 2FA | Yes |
| POST | `/2fa/verify` | Verify 2FA during login | Yes |
| GET | `/2fa/status` | Get 2FA status | Yes |
| POST | `/2fa/backup-codes/regenerate` | Regenerate backup codes | Yes |

---

### Session Routes (`/sessions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/sessions` | List active sessions | Yes |
| DELETE | `/sessions/:sessionId` | Revoke specific session | Yes |
| DELETE | `/sessions` | Revoke all other sessions | Yes |

---

### Role Routes (`/roles`) - Admin Only

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/roles` | List all roles | ROLE_READ |
| GET | `/roles/:id` | Get role details | ROLE_READ |
| POST | `/roles` | Create role | ROLE_CREATE |
| PATCH | `/roles/:id` | Update role | ROLE_UPDATE |
| DELETE | `/roles/:id` | Delete role | ROLE_DELETE |
| GET | `/roles/permissions` | List available permissions | ROLE_READ |
| POST | `/roles/:roleId/users/:userId` | Assign role to user | ROLE_ASSIGN |
| DELETE | `/roles/:roleId/users/:userId` | Remove role from user | ROLE_ASSIGN |

---

### Admin Routes (`/admin`) - Admin Only

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/admin/dashboard` | Dashboard stats | ADMIN_ACCESS |
| GET | `/admin/users` | Search/list users | USER_READ |
| GET | `/admin/users/:userId` | User details | USER_READ |
| POST | `/admin/users/:userId/reset-password` | Force password reset | USER_MANAGE |
| POST | `/admin/users/:userId/verify-email` | Manual email verify | USER_MANAGE |
| POST | `/admin/users/:userId/unlock` | Unlock account | USER_MANAGE |
| POST | `/admin/users/:userId/suspend` | Suspend user | USER_MANAGE |
| POST | `/admin/users/:userId/reactivate` | Reactivate user | USER_MANAGE |
| POST | `/admin/users/:userId/impersonate` | Impersonate user | ADMIN_ACCESS |
| POST | `/admin/bulk/assign-role` | Bulk role assignment | ROLE_ASSIGN |

---

### Audit Routes (`/audit`) - Admin Only

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/audit` | Query audit logs | AUDIT_READ |
| GET | `/audit/stats` | Audit statistics | AUDIT_READ |
| GET | `/audit/analytics` | User analytics | AUDIT_READ |
| GET | `/audit/user/:userId` | User activity | AUDIT_READ |
| POST | `/audit/cleanup` | Cleanup old logs | SYSTEM_MANAGE |

---

### Notification Routes (`/notifications`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | List notifications | Yes |
| PATCH | `/notifications/:id/read` | Mark as read | Yes |
| PATCH | `/notifications/read-all` | Mark all as read | Yes |
| DELETE | `/notifications/:id` | Delete notification | Yes |
| DELETE | `/notifications` | Delete all | Yes |

---

### Upload Routes (`/upload`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload/avatar` | Upload avatar | Yes |
| DELETE | `/upload/avatar` | Delete avatar | Yes |

---

## Response Format

All responses follow this structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Server Error |

---

## Rate Limiting

- **Default**: 100 requests per minute
- **Auth endpoints**: 10 requests per minute
- **Upload**: 5 requests per minute

---

## Permissions

| Permission | Description |
|------------|-------------|
| USER_READ | View users |
| USER_CREATE | Create users |
| USER_UPDATE | Update users |
| USER_DELETE | Delete users |
| USER_MANAGE | Full user management |
| ROLE_READ | View roles |
| ROLE_CREATE | Create roles |
| ROLE_UPDATE | Update roles |
| ROLE_DELETE | Delete roles |
| ROLE_ASSIGN | Assign/remove roles |
| ADMIN_ACCESS | Admin panel access |
| ADMIN_SETTINGS | Modify settings |
| AUDIT_READ | View audit logs |
| SYSTEM_MANAGE | System management |

---

## Default Roles

| Role | Permissions |
|------|-------------|
| admin | All permissions |
| moderator | USER_READ, USER_UPDATE, AUDIT_READ |
| user | (Basic user access) |
