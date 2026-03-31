import prisma from '../config/database';
import { Role } from '@prisma/client';

export class RoleRepository {
  async findAll(): Promise<Role[]> {
    return await prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Role | null> {
    return await prisma.role.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Role | null> {
    return await prisma.role.findUnique({ where: { name } });
  }

  async create(data: { name: string; description?: string; permissions: string[] }): Promise<Role> {
    return await prisma.role.create({ data });
  }

  async update(id: string, data: { name?: string; description?: string; permissions?: string[] }): Promise<Role> {
    return await prisma.role.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.role.delete({ where: { id } });
  }

  async getUsersWithRole(roleId: string): Promise<number> {
    return await prisma.userRole.count({ where: { roleId } });
  }
}

export default new RoleRepository();
