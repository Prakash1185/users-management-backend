import { FastifyRequest, FastifyReply } from 'fastify';
import roleService, { PERMISSIONS } from '../services/role.service';
import { ForbiddenError } from '../utils/errors';

type PermissionCheck = string | string[];

export const requirePermission = (permissions: PermissionCheck) => {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      throw new ForbiddenError('Authentication required');
    }

    const requiredPerms = Array.isArray(permissions) ? permissions : [permissions];
    const userPermissions = await roleService.getUserPermissions(request.user.id);

    const hasPermission = requiredPerms.some(perm => userPermissions.includes(perm));
    
    if (!hasPermission) {
      throw new ForbiddenError('Insufficient permissions');
    }
  };
};

export const requireRole = (roles: string | string[]) => {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      throw new ForbiddenError('Authentication required');
    }

    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    const userRoles = await roleService.getUserRoles(request.user.id);

    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRole) {
      throw new ForbiddenError('Insufficient role privileges');
    }
  };
};

export const requireAdmin = requireRole('admin');
export const requireModerator = requireRole(['admin', 'moderator']);

// Export permissions for easy access
export { PERMISSIONS };
