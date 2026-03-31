# User Management Backend

Production-grade user management backend built with Fastify, TypeScript, Prisma, and PostgreSQL.

## Features

- High-performance Fastify server
- Type-safe with TypeScript (strict mode)
- PostgreSQL with Prisma ORM
- JWT-based authentication
- Comprehensive error handling
- Structured logging with Pino
- Security best practices (Helmet, CORS, Rate limiting)
- Clean architecture (Controllers, Services, Repositories)
- ESLint & Prettier configured
- Environment-based configuration

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Logging**: Pino
- **Validation**: Zod

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Update the following in `.env`:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: Strong random secret for JWT tokens
- `JWT_REFRESH_SECRET`: Strong random secret for refresh tokens

### 3. Run Development Server

```bash
npm run dev
```

The server will start on http://localhost:5000

### 4. Available Endpoints

- `GET /health` - Health check endpoint
- `GET /api/v1` - API version info

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── models/           # Prisma models & types
│   ├── middlewares/      # Custom middlewares
│   ├── routes/           # API routes
│   ├── utils/            # Helper functions
│   ├── validators/       # Input validation schemas
│   ├── types/            # TypeScript types
│   ├── app.ts            # Fastify app setup
│   └── server.ts         # Server entry point
├── prisma/               # Prisma schema & migrations
├── tests/                # Test files
├── scripts/              # Utility scripts
└── logs/                 # Application logs
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run start:dev` - Start with tsx (fast)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Development Workflow

1. Create feature branch
2. Write code following TypeScript/ESLint rules
3. Test endpoints with health check
4. Format code before commit
5. Create pull request

## Environment Variables

See `.env.example` for all available configuration options.

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- JWT token-based authentication
- Password hashing with bcrypt
- Input validation
- SQL injection prevention (Prisma)

## Error Handling

Centralized error handling with custom error classes:
- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `ValidationError` (422)
- `InternalServerError` (500)

## Logging

Structured logging with Pino:
- Development: Pretty-printed colorized logs
- Production: JSON-formatted logs
- Request/response logging
- Error tracking

## License

ISC
