import { FastifyInstance } from 'fastify';
import auditController from '../controllers/audit.controller';
import { authenticate } from '../middlewares/auth';
import { requirePermission, requireAdmin } from '../middlewares/rbac';

export default async function auditRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [authenticate, requirePermission('AUDIT_READ')] }, auditController.getLogs.bind(auditController));
  fastify.get('/stats', { preHandler: [authenticate, requirePermission('AUDIT_READ')] }, auditController.getStats.bind(auditController));
  fastify.get('/analytics', { preHandler: [authenticate, requirePermission('AUDIT_READ')] }, auditController.getAnalytics.bind(auditController));
  fastify.get('/user/:userId', { preHandler: [authenticate, requirePermission('AUDIT_READ')] }, auditController.getUserActivity.bind(auditController));
  fastify.post('/cleanup', { preHandler: [authenticate, requireAdmin] }, auditController.cleanupLogs.bind(auditController));
}
