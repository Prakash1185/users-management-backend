import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import config from './config';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    logger:
      config.nodeEnv === 'development'
        ? {
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            },
          }
        : true,
    disableRequestLogging: false,
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'reqId',
    genReqId: () => {
      return Math.random().toString(36).substring(2, 15);
    },
  });

  // Security plugins
  await app.register(helmet, {
    contentSecurityPolicy: config.nodeEnv === 'production' ? undefined : false,
  });

  await app.register(cors, {
    origin: config.nodeEnv === 'development' ? true : ['http://localhost:5001'],
    credentials: true,
  });

  await app.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.window,
  });

  // Health check route
  app.get('/health', async () => {
    const { checkDatabaseConnection } = await import('./utils/database');
    const dbHealthy = await checkDatabaseConnection();

    return {
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealthy ? 'connected' : 'disconnected',
    };
  });

  // API routes will be registered here
  app.get('/api/v1', async () => {
    return {
      success: true,
      message: 'User Management API v1',
      version: '1.0.0',
      documentation: '/api/v1/docs',
      endpoints: {
        health: 'GET /health',
        api: 'GET /api/v1',
        auth: {
          register: 'POST /api/v1/auth/register',
          login: 'POST /api/v1/auth/login',
          refresh: 'POST /api/v1/auth/refresh',
          logout: 'POST /api/v1/auth/logout',
          checkEmail: 'GET /api/v1/auth/check-email',
          checkUsername: 'GET /api/v1/auth/check-username',
        },
        examples: {
          register: 'POST /api/v1/example/register',
          login: 'POST /api/v1/example/login',
          user: 'GET /api/v1/example/user/:id',
          users: 'GET /api/v1/example/users',
        },
      },
    };
  });

  // Register example routes
  await app.register(
    async (instance) => {
      const exampleRoutes = await import('./routes/example.routes');
      await exampleRoutes.default(instance);
    },
    { prefix: '/api/v1' }
  );

  // Register auth routes
  await app.register(
    async (instance) => {
      const authRoutes = await import('./routes/auth.routes');
      await authRoutes.default(instance);
    },
    { prefix: '/api/v1/auth' }
  );

  // Not found handler
  app.setNotFoundHandler(notFoundHandler);

  // Global error handler
  app.setErrorHandler(errorHandler);

  return app;
};
