import { FastifyInstance, FastifyRequest } from 'fastify';
import adminController from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth';
import { requireAdmin, requirePermission } from '../middlewares/rbac';

export default async function adminRoutes(fastify: FastifyInstance) {
  // All admin routes require authentication and admin access
  fastify.addHook('preHandler', authenticate);
  fastify.addHook('preHandler', requireAdmin);

  // Dashboard
  fastify.get('/dashboard', (req, reply) => adminController.getDashboard(req, reply));

  // User management
  fastify.get('/users', { preHandler: requirePermission('USER_READ') }, (req, reply) => adminController.searchUsers(req as FastifyRequest<{ Querystring: Record<string, string> }>, reply));
  fastify.get('/users/:userId', { preHandler: requirePermission('USER_READ') }, (req, reply) => adminController.getUserDetails(req as FastifyRequest<{ Params: { userId: string } }>, reply));
  fastify.post('/users/:userId/reset-password', { preHandler: requirePermission('USER_MANAGE') }, (req, reply) => adminController.forcePasswordReset(req as FastifyRequest<{ Params: { userId: string } }>, reply));
  fastify.post('/users/:userId/verify-email', { preHandler: requirePermission('USER_MANAGE') }, (req, reply) => adminController.verifyUserEmail(req as FastifyRequest<{ Params: { userId: string } }>, reply));
  fastify.post('/users/:userId/unlock', { preHandler: requirePermission('USER_MANAGE') }, (req, reply) => adminController.unlockAccount(req as FastifyRequest<{ Params: { userId: string } }>, reply));
  fastify.post('/users/:userId/suspend', { preHandler: requirePermission('USER_MANAGE') }, (req, reply) => adminController.suspendUser(req as FastifyRequest<{ Params: { userId: string }; Body: { reason?: string } }>, reply));
  fastify.post('/users/:userId/reactivate', { preHandler: requirePermission('USER_MANAGE') }, (req, reply) => adminController.reactivateUser(req as FastifyRequest<{ Params: { userId: string } }>, reply));
  fastify.post('/users/:userId/impersonate', { preHandler: requirePermission('ADMIN_ACCESS') }, (req, reply) => adminController.impersonateUser(req as FastifyRequest<{ Params: { userId: string } }>, reply));

  // Bulk operations
  fastify.post('/bulk/assign-role', { preHandler: requirePermission('ROLE_ASSIGN') }, (req, reply) => adminController.bulkAssignRole(req as FastifyRequest<{ Body: { userIds: string[]; roleId: string } }>, reply));
}
