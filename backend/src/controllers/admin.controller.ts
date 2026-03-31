import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../utils/database';
import { successResponse } from '../utils/response';
import { NotFoundError, BadRequestError } from '../utils/errors';
import hashService from '../services/hash.service';
import crypto from 'crypto';

export class AdminController {
  // User search with filters
  async searchUsers(
    request: FastifyRequest<{ Querystring: { q?: string; role?: string; status?: string; verified?: string; sortBy?: string; order?: string; page?: string; limit?: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { q, role, status, verified, sortBy = 'createdAt', order = 'desc', page = '1', limit = '20' } = request.query;
    const where: Record<string, unknown> = {};

    if (q) {
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;
    if (verified === 'true') where.emailVerified = true;
    if (verified === 'false') where.emailVerified = false;
    if (role) {
      where.roles = { some: { role: { name: role } } };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, email: true, username: true, firstName: true, lastName: true, avatar: true, emailVerified: true, isActive: true, createdAt: true, roles: { include: { role: { select: { name: true } } } } },
        orderBy: { [sortBy]: order },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    reply.send(successResponse('Users retrieved', { users, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }));
  }

  // Get user details for admin
  async getUserDetails(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: request.params.userId },
      select: {
        id: true, email: true, username: true, firstName: true, lastName: true, avatar: true, emailVerified: true, isActive: true, loginAttempts: true, lockUntil: true, createdAt: true, updatedAt: true,
        profile: true,
        roles: { include: { role: true } },
        sessions: { where: { isValid: true }, select: { id: true, ipAddress: true, userAgent: true, lastActivity: true, createdAt: true } },
        twoFactorAuth: { select: { isEnabled: true, lastUsedAt: true } },
      },
    });
    if (!user) throw new NotFoundError('User not found');
    reply.send(successResponse('User details retrieved', user));
  }

  // Force password reset
  async forcePasswordReset(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: request.params.userId } });
    if (!user) throw new NotFoundError('User not found');

    const tempPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await hashService.hash(tempPassword);

    await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    await prisma.session.updateMany({ where: { userId: user.id }, data: { isValid: false } });

    await prisma.auditLog.create({ data: { userId: request.user!.id, action: 'ADMIN_FORCE_PASSWORD_RESET', resource: 'user', resourceId: user.id } });

    reply.send(successResponse('Password reset forced', { temporaryPassword: tempPassword, note: 'User must change password on next login' }));
  }

  // Manual email verification
  async verifyUserEmail(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: request.params.userId } });
    if (!user) throw new NotFoundError('User not found');
    if (user.emailVerified) throw new BadRequestError('Email already verified');

    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
    await prisma.auditLog.create({ data: { userId: request.user!.id, action: 'ADMIN_VERIFY_EMAIL', resource: 'user', resourceId: user.id } });

    reply.send(successResponse('Email verified manually'));
  }

  // Unlock user account
  async unlockAccount(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: request.params.userId } });
    if (!user) throw new NotFoundError('User not found');

    await prisma.user.update({ where: { id: user.id }, data: { loginAttempts: 0, lockUntil: null } });
    await prisma.auditLog.create({ data: { userId: request.user!.id, action: 'ADMIN_UNLOCK_ACCOUNT', resource: 'user', resourceId: user.id } });

    reply.send(successResponse('Account unlocked'));
  }

  // Suspend user
  async suspendUser(request: FastifyRequest<{ Params: { userId: string }; Body: { reason?: string } }>, reply: FastifyReply): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: request.params.userId } });
    if (!user) throw new NotFoundError('User not found');
    if (!user.isActive) throw new BadRequestError('User already suspended');

    await prisma.user.update({ where: { id: user.id }, data: { isActive: false } });
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    await prisma.session.updateMany({ where: { userId: user.id }, data: { isValid: false } });
    await prisma.auditLog.create({ data: { userId: request.user!.id, action: 'ADMIN_SUSPEND_USER', resource: 'user', resourceId: user.id, details: { reason: request.body.reason } } });

    reply.send(successResponse('User suspended'));
  }

  // Reactivate user
  async reactivateUser(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: request.params.userId } });
    if (!user) throw new NotFoundError('User not found');
    if (user.isActive) throw new BadRequestError('User already active');

    await prisma.user.update({ where: { id: user.id }, data: { isActive: true } });
    await prisma.auditLog.create({ data: { userId: request.user!.id, action: 'ADMIN_REACTIVATE_USER', resource: 'user', resourceId: user.id } });

    reply.send(successResponse('User reactivated'));
  }

  // Impersonate user (generate token as user)
  async impersonateUser(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: request.params.userId }, include: { roles: { include: { role: true } } } });
    if (!user) throw new NotFoundError('User not found');

    const jwtService = (await import('../services/jwt.service')).default;
    const permissions = user.roles.flatMap(ur => ur.role.permissions as string[]);
    const accessToken = jwtService.generateAccessToken({ userId: user.id, email: user.email, roles: user.roles.map(ur => ur.role.name), permissions, impersonatedBy: request.user!.id });

    await prisma.auditLog.create({ data: { userId: request.user!.id, action: 'ADMIN_IMPERSONATE', resource: 'user', resourceId: user.id } });

    reply.send(successResponse('Impersonation token generated', { accessToken, note: 'This token expires in 15 minutes and is for testing only', impersonating: { id: user.id, email: user.email } }));
  }

  // Bulk assign role
  async bulkAssignRole(request: FastifyRequest<{ Body: { userIds: string[]; roleId: string } }>, reply: FastifyReply): Promise<void> {
    const { userIds, roleId } = request.body;
    if (!userIds.length) throw new BadRequestError('No users specified');

    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundError('Role not found');

    const results = await Promise.allSettled(
      userIds.map(async (userId) => {
        const existing = await prisma.userRole.findUnique({ where: { userId_roleId: { userId, roleId } } });
        if (!existing) {
          await prisma.userRole.create({ data: { userId, roleId } });
        }
        return userId;
      })
    );

    const assigned = results.filter(r => r.status === 'fulfilled').length;
    await prisma.auditLog.create({ data: { userId: request.user!.id, action: 'ADMIN_BULK_ROLE_ASSIGN', resource: 'role', resourceId: roleId, details: { userCount: assigned } } });

    reply.send(successResponse('Role assigned', { assigned, total: userIds.length }));
  }

  // Dashboard stats
  async getDashboard(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const [totalUsers, activeUsers, verifiedUsers, twoFAUsers, activeSessions, recentSignups, rolesCount] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.twoFactorAuth.count({ where: { isEnabled: true } }),
      prisma.session.count({ where: { isValid: true } }),
      prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      prisma.role.count(),
    ]);

    reply.send(successResponse('Dashboard stats', { users: { total: totalUsers, active: activeUsers, verified: verifiedUsers, with2FA: twoFAUsers, newThisWeek: recentSignups }, sessions: { active: activeSessions }, roles: { total: rolesCount } }));
  }
}

export default new AdminController();
