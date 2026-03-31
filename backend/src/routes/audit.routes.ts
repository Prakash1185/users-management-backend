import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import auditController from '../controllers/audit.controller';
import { authenticate } from '../middlewares/auth';
import { requirePermission, requireAdmin } from '../middlewares/rbac';

export default async function auditRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [authenticate, requirePermission('AUDIT_READ')] }, (req, reply) => auditController.getLogs(req as FastifyRequest<{ Querystring: Record<string, string> }>, reply));
  fastify.get('/stats', { preHandler: [authenticate, requirePermission('AUDIT_READ')] }, (req, reply) => auditController.getStats(req, reply));
  fastify.get('/analytics', { preHandler: [authenticate, requirePermission('AUDIT_READ')] }, (req, reply) => auditController.getAnalytics(req, reply));
  fastify.get('/user/:userId', { preHandler: [authenticate, requirePermission('AUDIT_READ')] }, (req, reply) => auditController.getUserActivity(req as FastifyRequest<{ Params: { userId: string }; Querystring: { page?: string; limit?: string } }>, reply));
  fastify.post('/cleanup', { preHandler: [authenticate, requireAdmin] }, (req, reply) => auditController.cleanupLogs(req as FastifyRequest<{ Body: { retentionDays?: number } }>, reply));
}
