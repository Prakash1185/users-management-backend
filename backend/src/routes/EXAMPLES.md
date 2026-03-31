# Example Routes

## Purpose
These routes are **demonstration/learning endpoints** that showcase:
- Request validation using Zod
- Error handling with custom error classes  
- Standardized response formatting
- Middleware usage patterns

## Status
**Educational/Portfolio Use Only**

These routes are intentionally kept in the codebase to:
1. Demonstrate validation and error handling concepts
2. Provide working examples for documentation
3. Allow testing of the validation framework
4. Serve as reference for implementing new features

## In Production
For a production deployment, you have options:
1. **Keep them** - Many APIs have `/playground` or `/examples` endpoints
2. **Disable via ENV** - Use `NODE_ENV=production` to disable example routes
3. **Remove them** - Delete before final production release

## Available Example Endpoints

### POST /api/v1/example/register
Demonstrates user registration validation with:
- Email format validation
- Password strength requirements
- Username format validation

### POST /api/v1/example/login  
Demonstrates login validation

### GET /api/v1/example/user/:id
Demonstrates URL parameter validation (CUID format)

### GET /api/v1/example/users
Demonstrates query parameter validation (pagination)

### GET /api/v1/example/error
Demonstrates custom error handling (400 Bad Request)

### GET /api/v1/example/notfound
Demonstrates 404 error handling

## Real Implementation
The actual authentication routes are in:
- `/api/v1/auth/*` - Authentication endpoints
- `/api/v1/users/*` - User management endpoints

These example routes do NOT interact with the database or create real users.
