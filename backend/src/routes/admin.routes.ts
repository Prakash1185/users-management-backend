import { FastifyInstance } from 'fastify';
import adminController from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth';
import { requireAdmin, requirePermission } from '../middlewares/rbac';

export default async function adminRoutes(fastify: FastifyInstance) {
  // All admin routes require authentication and admin access
  fastify.addHook('preHandler', authenticate);
  fastify.addHook('preHandler', requireAdmin);

  // Dashboard
  fastify.get('/dashboard', adminController.getDashboard.bind(adminController));

  // User management
  fastify.get('/users', { preHandler: requirePermission('USER_READ') }, adminController.searchUsers.bind(adminController));
  fastify.get('/users/:userId', { preHandler: requirePermission('USER_READ') }, adminController.getUserDetails.bind(adminController));
  fastify.post('/users/:userId/reset-password', { preHandler: requirePermission('USER_MANAGE') }, adminController.forcePasswordReset.bind(adminController));
  fastify.post('/users/:userId/verify-email', { preHandler: requirePermission('USER_MANAGE') }, adminController.verifyUserEmail.bind(adminController));
  fastify.post('/users/:userId/unlock', { preHandler: requirePermission('USER_MANAGE') }, adminController.unlockAccount.bind(adminController));
  fastify.post('/users/:userId/suspend', { preHandler: requirePermission('USER_MANAGE') }, adminController.suspendUser.bind(adminController));
  fastify.post('/users/:userId/reactivate', { preHandler: requirePermission('USER_MANAGE') }, adminController.reactivateUser.bind(adminController));
  fastify.post('/users/:userId/impersonate', { preHandler: requirePermission('ADMIN_ACCESS') }, adminController.impersonateUser.bind(adminController));

  // Bulk operations
  fastify.post('/bulk/assign-role', { preHandler: requirePermission('ROLE_ASSIGN') }, adminController.bulkAssignRole.bind(adminController));
}
