import { FastifyInstance } from 'fastify';
import prisma from '../utils/database';

export default async function healthRoutes(fastify: FastifyInstance) {
  // Basic health check
  fastify.get('/health', async (_request, reply) => {
    reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Detailed health check with dependencies
  fastify.get('/health/detailed', async (_request, reply) => {
    const checks: Record<string, { status: string; latency?: number; error?: string }> = {};

    // Database check
    const dbStart = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = { status: 'healthy', latency: Date.now() - dbStart };
    } catch (error) {
      checks.database = { status: 'unhealthy', error: 'Database connection failed' };
    }

    // Memory check
    const memUsage = process.memoryUsage();
    checks.memory = {
      status: memUsage.heapUsed / memUsage.heapTotal < 0.9 ? 'healthy' : 'warning',
      latency: Math.round(memUsage.heapUsed / 1024 / 1024),
    };

    const allHealthy = Object.values(checks).every(c => c.status === 'healthy');

    reply.status(allHealthy ? 200 : 503).send({
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      checks,
    });
  });

  // Readiness check (for k8s)
  fastify.get('/ready', async (_request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      reply.send({ ready: true });
    } catch {
      reply.status(503).send({ ready: false });
    }
  });

  // Liveness check (for k8s)
  fastify.get('/live', async (_request, reply) => {
    reply.send({ alive: true });
  });
}
