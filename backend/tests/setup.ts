// Test setup file
import { PrismaClient } from '@prisma/client';

// Mock Prisma for unit tests
jest.mock('../src/utils/database', () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn() },
    role: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    session: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), updateMany: jest.fn(), delete: jest.fn(), deleteMany: jest.fn() },
    refreshToken: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn(), deleteMany: jest.fn() },
    auditLog: { create: jest.fn(), findMany: jest.fn(), count: jest.fn(), groupBy: jest.fn() },
    notification: { create: jest.fn(), findMany: jest.fn(), update: jest.fn(), updateMany: jest.fn(), delete: jest.fn(), deleteMany: jest.fn(), count: jest.fn() },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
}));

// Global test timeout
jest.setTimeout(10000);

// Clean up after all tests
afterAll(async () => {
  jest.clearAllMocks();
});
