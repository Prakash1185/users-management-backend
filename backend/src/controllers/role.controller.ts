import { FastifyRequest, FastifyReply } from 'fastify';
import roleService from '../services/role.service';
import { successResponse } from '../utils/response';

export class RoleController {
  async getAllRoles(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const roles = await roleService.getAllRoles();
    reply.send(successResponse('Roles retrieved', { roles }));
  }

  async getRoleById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const role = await roleService.getRoleById(request.params.id);
    reply.send(successResponse('Role retrieved', role));
  }

  async createRole(
    request: FastifyRequest<{ Body: { name: string; description?: string; permissions: string[] } }>,
    reply: FastifyReply
  ): Promise<void> {
    const role = await roleService.createRole(request.body);
    reply.status(201).send(successResponse('Role created', role));
  }

  async updateRole(
    request: FastifyRequest<{ Params: { id: string }; Body: { name?: string; description?: string; permissions?: string[] } }>,
    reply: FastifyReply
  ): Promise<void> {
    const role = await roleService.updateRole(request.params.id, request.body);
    reply.send(successResponse('Role updated', role));
  }

  async deleteRole(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    await roleService.deleteRole(request.params.id);
    reply.send(successResponse('Role deleted'));
  }

  async getAvailablePermissions(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const permissions = roleService.getAvailablePermissions();
    reply.send(successResponse('Permissions retrieved', { permissions }));
  }

  async assignRole(
    request: FastifyRequest<{ Params: { userId: string }; Body: { roleId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      reply.status(401).send({ success: false, message: 'Authentication required', statusCode: 401 });
      return;
    }
    await roleService.assignRoleToUser(request.params.userId, request.body.roleId, request.user.id);
    reply.send(successResponse('Role assigned'));
  }

  async removeRole(
    request: FastifyRequest<{ Params: { userId: string; roleId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      reply.status(401).send({ success: false, message: 'Authentication required', statusCode: 401 });
      return;
    }
    await roleService.removeRoleFromUser(request.params.userId, request.params.roleId, request.user.id);
    reply.send(successResponse('Role removed'));
  }

  async getUserRoles(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const roles = await roleService.getUserRoles(request.params.userId);
    const permissions = await roleService.getUserPermissions(request.params.userId);
    reply.send(successResponse('User roles retrieved', { roles, permissions }));
  }
}

export default new RoleController();
