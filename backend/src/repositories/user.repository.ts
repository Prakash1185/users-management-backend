import prisma from '../config/database';
import { User, Prisma } from '@prisma/client';

export class UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({
      data,
      include: {
        profile: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });
  }

  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    const normalizedIdentifier = identifier.toLowerCase();
    return await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }],
      },
    });
  }

  async updateById(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteById(id: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  async updateLastLogin(id: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  async incrementFailedLoginAttempts(id: string): Promise<User> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');

    const failedAttempts = user.failedLoginAttempts + 1;
    const shouldLock = failedAttempts >= 5;

    return await prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: failedAttempts,
        ...(shouldLock && {
          lockedUntil: new Date(Date.now() + 15 * 60 * 1000), // Lock for 15 minutes
        }),
      },
    });
  }

  async verifyEmail(id: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: {
        emailVerified: true,
      },
    });
  }

  async assignRole(userId: string, roleId: string, assignedBy?: string): Promise<void> {
    await prisma.userRole.create({
      data: {
        userId,
        roleId,
        assignedBy,
      },
    });
  }
}

export default new UserRepository();
