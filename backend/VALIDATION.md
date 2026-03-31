# Validation & Error Handling Documentation

## Overview
This backend uses Zod for runtime type validation and comprehensive error handling with standardized responses.

## Features

### Request Validation
- Body validation
- Query parameter validation
- URL parameter validation
- Type-safe schemas with TypeScript inference
- Detailed error messages

### Error Handling
- Custom error classes for common HTTP errors
- Centralized error handler
- Zod validation error formatting
- Structured error responses

### Response Standardization
- Success responses with consistent format
- Error responses with error details
- Paginated responses
- Meta information support

## Validation Schemas

### Common Patterns

```typescript
import { emailSchema, passwordSchema, usernameSchema } from './validators/schemas';

// Email validation
email: emailSchema  // Valid email format required

// Password validation (8+ chars, uppercase, lowercase, number, special char)
password: passwordSchema

// Username validation (3-30 chars, alphanumeric + underscores)
username: usernameSchema

// Phone validation (E.164 format)
phone: phoneSchema

// Pagination
{ page, limit } = paginationSchema
```

### User Schemas
- `registerSchema` - User registration
- `loginSchema` - User login
- `updateProfileSchema` - Profile updates
- `changePasswordSchema` - Password change
- `forgotPasswordSchema` - Password reset request
- `resetPasswordSchema` - Password reset with token
- `verifyEmailSchema` - Email verification

### Role Schemas
- `createRoleSchema` - Create new role
- `updateRoleSchema` - Update role
- `assignRoleSchema` - Assign role to user

## Using Validation

### In Routes

```typescript
import { validateRequest } from '../middlewares/validation';
import { registerSchema } from '../validators/schemas';
import { successResponse } from '../utils/response';

app.post('/register',
  {
    preHandler: validateRequest({ body: registerSchema }),
  },
  async (request, reply) => {
    const body = request.body as z.infer<typeof registerSchema>;
    
    // Body is validated and typed
    return reply.send(successResponse('Success', data));
  }
);
```

### Multiple Validations

```typescript
validateRequest({
  body: registerSchema,
  params: idSchema,
  query: paginationSchema,
})
```

## Error Classes

### Available Errors

```typescript
import {
  BadRequestError,      // 400
  UnauthorizedError,    // 401
  ForbiddenError,       // 403
  NotFoundError,        // 404
  ConflictError,        // 409
  ValidationError,      // 422
  InternalServerError,  // 500
} from '../utils/errors';

// Usage
throw new BadRequestError('Invalid input');
throw new NotFoundError('User not found');
throw new UnauthorizedError('Invalid credentials');
```

### Custom Errors

```typescript
import { AppError } from '../utils/errors';

throw new AppError('Custom message', 418); // Status code
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Success with Pagination

```json
{
  "success": true,
  "message": "Users retrieved",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 422,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### Standard Error

```json
{
  "success": false,
  "message": "Resource not found",
  "statusCode": 404
}
```

## Response Helpers

### Success Response

```typescript
import { successResponse, paginatedResponse } from '../utils/response';

// Simple success
return successResponse('User created', userData);

// With pagination
return paginatedResponse('Users list', users, page, limit, total);
```

### Error Response

Errors are automatically formatted by the error handler.

## Example Endpoints

### Test Validation
```bash
# Valid registration
curl -X POST http://localhost:5001/api/v1/example/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe123",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Invalid registration (validation errors)
curl -X POST http://localhost:5001/api/v1/example/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "username": "ab",
    "password": "weak"
  }'

# Pagination
curl "http://localhost:5001/api/v1/example/users?page=1&limit=20"

# Error handling
curl "http://localhost:5001/api/v1/example/error"
```

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Username Requirements
- 3-30 characters
- Letters, numbers, underscores only
- No spaces or special characters

### Email
- Valid email format (RFC 5322)

### Pagination
- page: positive integer (default: 1)
- limit: 1-100 (default: 10)

## Best Practices

1. **Always validate user input** - Use schemas for all endpoints
2. **Use specific error types** - Choose appropriate error class
3. **Provide clear messages** - Help users understand what went wrong
4. **Don't expose internals** - Generic 500 errors in production
5. **Type inference** - Use `z.infer<typeof schema>` for types
6. **Consistent responses** - Always use response helpers
7. **Document schemas** - Add comments to validation schemas

## Creating Custom Schemas

```typescript
import { z } from 'zod';

export const customSchema = z.object({
  field1: z.string().min(3).max(50),
  field2: z.number().int().positive(),
  field3: z.enum(['option1', 'option2']),
  field4: z.array(z.string()).optional(),
  field5: z.boolean().default(false),
});

// Use in validation
validateRequest({ body: customSchema })
```

## Error Logging

All errors are automatically logged:
- Validation errors: WARN level
- Application errors: WARN level (operational)
- System errors: ERROR level
- Includes request details and stack traces

## Testing Validation

Run example validation tests:
```bash
npm run start:dev
# Then test endpoints listed above
```
