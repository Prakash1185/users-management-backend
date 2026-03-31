import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth';
import { requirePermission, requireAdmin, PERMISSIONS } from '../middlewares/rbac';
import roleController from '../controllers/role.controller';

export default async function roleRoutes(app: FastifyInstance): Promise<void> {
  // Get all roles (requires role:read permission)
  app.get('/', {
    preHandler: [authenticate, requirePermission(PERMISSIONS.ROLE_READ)],
  }, async (request, reply) => roleController.getAllRoles(request, reply));

  // Get available permissions
  app.get('/permissions', {
    preHandler: [authenticate, requirePermission(PERMISSIONS.ROLE_READ)],
  }, async (request, reply) => roleController.getAvailablePermissions(request, reply));

  // Get role by ID
  app.get<{ Params: { id: string } }>('/:id', {
    preHandler: [authenticate, requirePermission(PERMISSIONS.ROLE_READ)],
  }, async (request, reply) => roleController.getRoleById(request, reply));

  // Create role (admin only)
  app.post<{ Body: { name: string; description?: string; permissions: string[] } }>('/', {
    preHandler: [authenticate, requireAdmin],
  }, async (request, reply) => roleController.createRole(request, reply));

  // Update role (admin only)
  app.put<{ Params: { id: string }; Body: { name?: string; description?: string; permissions?: string[] } }>('/:id', {
    preHandler: [authenticate, requireAdmin],
  }, async (request, reply) => roleController.updateRole(request, reply));

  // Delete role (admin only)
  app.delete<{ Params: { id: string } }>('/:id', {
    preHandler: [authenticate, requireAdmin],
  }, async (request, reply) => roleController.deleteRole(request, reply));

  // Get user's roles and permissions
  app.get<{ Params: { userId: string } }>('/user/:userId', {
    preHandler: [authenticate, requirePermission(PERMISSIONS.USER_READ)],
  }, async (request, reply) => roleController.getUserRoles(request, reply));

  // Assign role to user (requires role:assign)
  app.post<{ Params: { userId: string }; Body: { roleId: string } }>('/user/:userId/assign', {
    preHandler: [authenticate, requirePermission(PERMISSIONS.ROLE_ASSIGN)],
  }, async (request, reply) => roleController.assignRole(request, reply));

  // Remove role from user (requires role:assign)
  app.delete<{ Params: { userId: string; roleId: string } }>('/user/:userId/:roleId', {
    preHandler: [authenticate, requirePermission(PERMISSIONS.ROLE_ASSIGN)],
  }, async (request, reply) => roleController.removeRole(request, reply));
}
