# User Management Backend - Learning Project

A production-grade user management backend built as a learning project to demonstrate enterprise-level Node.js development practices.

## Project Purpose

This is a **learning and portfolio project** showcasing:
- Modern backend architecture patterns
- Production-ready code structure
- Comprehensive validation and error handling
- Type-safe development with TypeScript
- Security best practices
- Clean code principles

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript (strict mode)
- **Framework**: Fastify (high performance)
- **Database**: PostgreSQL
- **ORM**: Prisma 5
- **Validation**: Zod
- **Authentication**: JWT (to be implemented)
- **Logging**: Pino

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration management
│   ├── controllers/     # Request handlers (coming soon)
│   ├── services/        # Business logic (coming soon)
│   ├── repositories/    # Data access layer (coming soon)
│   ├── middlewares/     # Custom middlewares
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── validators/      # Zod validation schemas
│   ├── types/           # TypeScript type definitions
│   ├── app.ts           # Fastify app setup
│   └── server.ts        # Server entry point
├── prisma/              # Database schema & migrations
├── tests/               # Tests (coming soon)
└── docs/                # Additional documentation
```

## Current Features (Phase 1 Complete)

✅ **Project Setup**
- TypeScript configuration with strict mode
- ESLint & Prettier for code quality
- Environment-based configuration
- Structured logging with Pino

✅ **Database**
- PostgreSQL with Prisma ORM
- Comprehensive schema (12 tables)
- Connection pooling
- Migrations setup
- Database seeding

✅ **Validation & Error Handling**
- Zod-based request validation
- Custom error classes
- Standardized response format
- Detailed validation error messages

## Example Routes

The project includes **demonstration routes** (`/api/v1/example/*`) that showcase:
- How validation works
- Error handling patterns
- Response formatting

See [EXAMPLES.md](src/routes/EXAMPLES.md) for details.

**Note:** These are educational endpoints. Real authentication routes will be in `/api/v1/auth/*`.

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd users_management_backend/backend
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Run database migrations
```bash
npm run db:migrate
npm run db:seed
```

5. Start development server
```bash
npm run dev
```

Server will start on http://localhost:5001

## Available Scripts

```bash
npm run dev              # Start development server with hot reload
npm run start:dev        # Start with tsx (faster)
npm run build            # Build for production
npm start                # Run production build
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Create and apply migration
npm run db:seed          # Seed database with default data
npm run db:studio        # Open Prisma Studio
```

## API Endpoints

### Health & Info
- `GET /health` - Server health check
- `GET /api/v1` - API information

### Example Routes (Demo)
- `POST /api/v1/example/register` - Validation demo
- `POST /api/v1/example/login` - Login validation demo
- `GET /api/v1/example/users` - Pagination demo
- `GET /api/v1/example/user/:id` - Param validation demo
- `GET /api/v1/example/error` - Error handling demo

See [Postman Collection](docs/POSTMAN.md) for detailed testing.

## Documentation

- [DATABASE.md](DATABASE.md) - Database schema and operations
- [VALIDATION.md](VALIDATION.md) - Validation and error handling guide
- [EXAMPLES.md](src/routes/EXAMPLES.md) - Example routes documentation

## Learning Roadmap

### ✅ Phase 1 - Foundation (Complete)
- [x] Project setup with TypeScript
- [x] Database design and Prisma setup
- [x] Validation and error handling

### 🔄 Phase 2 - Authentication (In Progress)
- [ ] User registration
- [ ] User login with JWT
- [ ] Email verification
- [ ] Password reset

### 📋 Phase 3 - User Management
- [ ] User profile CRUD
- [ ] Avatar upload
- [ ] Account management

### 📋 Phase 4 - Advanced Security
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Rate limiting enhancements

### 📋 Phase 5 - Authorization
- [ ] Role-based access control (RBAC)
- [ ] Permissions system
- [ ] Role assignment

### 📋 Phase 6 - Monitoring
- [ ] Audit logs
- [ ] Analytics
- [ ] User activity tracking

## Code Quality

- **TypeScript**: Strict mode enabled, no implicit any
- **ESLint**: Enforced code standards
- **Prettier**: Consistent code formatting
- **Git**: Conventional commits (coming soon)

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- SQL injection prevention (Prisma)
- Password hashing (coming soon)
- JWT authentication (coming soon)

## Contributing

This is a learning project. Feel free to:
- Fork and experiment
- Suggest improvements
- Report issues
- Ask questions

## License

ISC

## Acknowledgments

Built as a learning project to demonstrate modern backend development practices with Node.js, TypeScript, and PostgreSQL.

---

**Status**: 🚧 Active Development - Phase 2 Starting Soon

**Progress**: 3/30 milestones completed (10%)
