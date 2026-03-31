import roleRepository from '../repositories/role.repository';
import prisma from '../config/database';
import { ConflictError, NotFoundError, BadRequestError } from '../utils/errors';
import logger from '../utils/logger';

// Define all available permissions
export const PERMISSIONS = {
  // User permissions
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE: 'user:manage',
  
  // Role permissions
  ROLE_READ: 'role:read',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  ROLE_ASSIGN: 'role:assign',
  
  // Admin permissions
  ADMIN_ACCESS: 'admin:access',
  ADMIN_SETTINGS: 'admin:settings',
  AUDIT_READ: 'audit:read',
  
  // System permissions
  SYSTEM_MANAGE: 'system:manage',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Default role permissions
export const DEFAULT_ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  moderator: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.ROLE_READ,
    PERMISSIONS.AUDIT_READ,
    PERMISSIONS.ADMIN_ACCESS,
  ],
  user: [
    PERMISSIONS.USER_READ,
  ],
};

export interface RoleData {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

function mapRole(role: { id: string; name: string; description: string | null; permissions: unknown; createdAt: Date; updatedAt: Date }, userCount: number): RoleData {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions as string[],
    userCount,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}

export class RoleService {
  async getAllRoles(): Promise<RoleData[]> {
    const roles = await roleRepository.findAll();
    const rolesWithCount = await Promise.all(
      roles.map(async (role) => mapRole(role, await roleRepository.getUsersWithRole(role.id)))
    );
    return rolesWithCount;
  }

  async getRoleById(id: string): Promise<RoleData> {
    const role = await roleRepository.findById(id);
    if (!role) throw new NotFoundError('Role not found');
    return mapRole(role, await roleRepository.getUsersWithRole(role.id));
  }

  async createRole(data: { name: string; description?: string; permissions: string[] }): Promise<RoleData> {
    // Validate permissions
    const invalidPerms = data.permissions.filter(p => !Object.values(PERMISSIONS).includes(p as Permission));
    if (invalidPerms.length > 0) {
      throw new BadRequestError(`Invalid permissions: ${invalidPerms.join(', ')}`);
    }

    // Check if role exists
    const existing = await roleRepository.findByName(data.name);
    if (existing) throw new ConflictError('Role already exists');

    const role = await roleRepository.create(data);
    
    await prisma.auditLog.create({
      data: { action: 'ROLE_CREATED', resource: 'role', resourceId: role.id, details: { name: data.name } },
    });

    logger.info({ roleId: role.id, message: 'Role created' });
    return mapRole(role, 0);
  }

  async updateRole(id: string, data: { name?: string; description?: string; permissions?: string[] }): Promise<RoleData> {
    const role = await roleRepository.findById(id);
    if (!role) throw new NotFoundError('Role not found');

    // Prevent modifying system roles
    if (['admin', 'user', 'moderator'].includes(role.name) && data.name) {
      throw new BadRequestError('Cannot rename system roles');
    }

    if (data.permissions) {
      const invalidPerms = data.permissions.filter(p => !Object.values(PERMISSIONS).includes(p as Permission));
      if (invalidPerms.length > 0) {
        throw new BadRequestError(`Invalid permissions: ${invalidPerms.join(', ')}`);
      }
    }

    const updated = await roleRepository.update(id, data);
    
    await prisma.auditLog.create({
      data: { action: 'ROLE_UPDATED', resource: 'role', resourceId: id },
    });

    return mapRole(updated, await roleRepository.getUsersWithRole(id));
  }

  async deleteRole(id: string): Promise<void> {
    const role = await roleRepository.findById(id);
    if (!role) throw new NotFoundError('Role not found');

    // Prevent deleting system roles
    if (['admin', 'user', 'moderator'].includes(role.name)) {
      throw new BadRequestError('Cannot delete system roles');
    }

    const userCount = await roleRepository.getUsersWithRole(id);
    if (userCount > 0) {
      throw new BadRequestError(`Cannot delete role with ${userCount} assigned users`);
    }

    await roleRepository.delete(id);
    
    await prisma.auditLog.create({
      data: { action: 'ROLE_DELETED', resource: 'role', resourceId: id, details: { name: role.name } },
    });

    logger.info({ roleId: id, message: 'Role deleted' });
  }

  async assignRoleToUser(userId: string, roleId: string, assignedBy: string): Promise<void> {
    const role = await roleRepository.findById(roleId);
    if (!role) throw new NotFoundError('Role not found');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');

    // Check if already assigned
    const existing = await prisma.userRole.findUnique({
      where: { userId_roleId: { userId, roleId } },
    });
    if (existing) throw new ConflictError('Role already assigned to user');

    await prisma.userRole.create({
      data: { userId, roleId, assignedBy },
    });

    await prisma.auditLog.create({
      data: {
        userId: assignedBy,
        action: 'ROLE_ASSIGNED',
        resource: 'user',
        resourceId: userId,
        details: { roleName: role.name },
      },
    });

    logger.info({ userId, roleId, message: 'Role assigned' });
  }

  async removeRoleFromUser(userId: string, roleId: string, removedBy: string): Promise<void> {
    const role = await roleRepository.findById(roleId);
    if (!role) throw new NotFoundError('Role not found');

    // Prevent removing last role
    const userRoles = await prisma.userRole.count({ where: { userId } });
    if (userRoles <= 1) {
      throw new BadRequestError('User must have at least one role');
    }

    await prisma.userRole.delete({
      where: { userId_roleId: { userId, roleId } },
    });

    await prisma.auditLog.create({
      data: {
        userId: removedBy,
        action: 'ROLE_REMOVED',
        resource: 'user',
        resourceId: userId,
        details: { roleName: role.name },
      },
    });

    logger.info({ userId, roleId, message: 'Role removed' });
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    return userRoles.map(ur => ur.role.name);
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    
    const permissions = new Set<string>();
    userRoles.forEach(ur => {
      (ur.role.permissions as string[]).forEach(p => permissions.add(p));
    });
    
    return Array.from(permissions);
  }

  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(permission);
  }

  async hasRole(userId: string, roleName: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.includes(roleName);
  }

  getAvailablePermissions(): string[] {
    return Object.values(PERMISSIONS);
  }
}

export default new RoleService();
