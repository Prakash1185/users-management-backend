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
    origin: config.nodeEnv === 'development' ? true : ['http://localhost:3001'],
    credentials: true,
  });

  await app.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.window,
  });

  // Health check route
  app.get('/health', async () => {
    return {
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // API routes will be registered here
  app.get('/api/v1', async () => {
    return {
      success: true,
      message: 'User Management API v1',
      version: '1.0.0',
      documentation: '/api/v1/docs',
    };
  });

  // Not found handler
  app.setNotFoundHandler(notFoundHandler);

  // Global error handler
  app.setErrorHandler(errorHandler);

  return app;
};
