import prisma from '../config/database';
import { NotFoundError, BadRequestError, UnauthorizedError } from '../utils/errors';
import hashService from './hash.service';
import logger from '../utils/logger';

export interface ExportedUserData {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    emailVerified: boolean;
    createdAt: Date;
    lastLoginAt: Date | null;
  };
  profile: unknown;
  roles: string[];
  sessions: Array<{
    deviceInfo: string | null;
    ipAddress: string | null;
    lastActivity: Date;
    createdAt: Date;
  }>;
  auditLogs: Array<{
    action: string;
    resource: string | null;
    timestamp: Date;
    ipAddress: string | null;
  }>;
}

export class AccountService {
  // Deactivate account (user can reactivate)
  async deactivateAccount(
    userId: string,
    password: string
  ): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify password for security
    const isValid = await hashService.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid password');
    }

    // Deactivate account
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    // Invalidate all sessions
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    await prisma.session.updateMany({
      where: { userId, isValid: true },
      data: { isValid: false },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'ACCOUNT_DEACTIVATED',
        resource: 'user',
        resourceId: userId,
      },
    });

    logger.info({
      userId,
      message: 'Account deactivated',
    });

    return { message: 'Account deactivated successfully' };
  }

  // Reactivate account
  async reactivateAccount(
    email: string,
    password: string
  ): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isActive) {
      throw new BadRequestError('Account is already active');
    }

    // Verify password
    const isValid = await hashService.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid password');
    }

    // Reactivate
    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: true },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'ACCOUNT_REACTIVATED',
        resource: 'user',
        resourceId: user.id,
      },
    });

    logger.info({
      userId: user.id,
      message: 'Account reactivated',
    });

    return { message: 'Account reactivated successfully. Please login.' };
  }

  // Soft delete account (can be recovered within 30 days)
  async softDeleteAccount(
    userId: string,
    password: string
  ): Promise<{ message: string; recoveryDeadline: Date }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify password
    const isValid = await hashService.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid password');
    }

    const deletedAt = new Date();
    const recoveryDeadline = new Date();
    recoveryDeadline.setDate(recoveryDeadline.getDate() + 30);

    // Soft delete
    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        deletedAt,
      },
    });

    // Invalidate all tokens and sessions
    await prisma.refreshToken.deleteMany({ where: { userId } });
    await prisma.session.updateMany({
      where: { userId, isValid: true },
      data: { isValid: false },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'ACCOUNT_DELETED',
        resource: 'user',
        resourceId: userId,
        details: { recoveryDeadline },
      },
    });

    logger.warn({
      userId,
      message: 'Account soft deleted',
      recoveryDeadline,
    });

    return {
      message: 'Account scheduled for deletion. You have 30 days to recover it.',
      recoveryDeadline,
    };
  }

  // Recover soft-deleted account
  async recoverAccount(
    email: string,
    password: string
  ): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.deletedAt) {
      throw new BadRequestError('Account is not deleted');
    }

    // Check recovery window (30 days)
    const recoveryDeadline = new Date(user.deletedAt);
    recoveryDeadline.setDate(recoveryDeadline.getDate() + 30);

    if (new Date() > recoveryDeadline) {
      throw new BadRequestError('Recovery period has expired');
    }

    // Verify password
    const isValid = await hashService.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid password');
    }

    // Recover account
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
        deletedAt: null,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'ACCOUNT_RECOVERED',
        resource: 'user',
        resourceId: user.id,
      },
    });

    logger.info({
      userId: user.id,
      message: 'Account recovered',
    });

    return { message: 'Account recovered successfully. Please login.' };
  }

  // Permanent delete (requires email confirmation - admin feature)
  async permanentDeleteAccount(
    userId: string,
    password: string,
    confirmEmail: string
  ): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify email matches
    if (user.email !== confirmEmail) {
      throw new BadRequestError('Email confirmation does not match');
    }

    // Verify password
    const isValid = await hashService.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid password');
    }

    // Delete all related data first
    await prisma.$transaction(async (tx) => {
      await tx.refreshToken.deleteMany({ where: { userId } });
      await tx.session.deleteMany({ where: { userId } });
      await tx.emailVerification.deleteMany({ where: { userId } });
      await tx.passwordReset.deleteMany({ where: { userId } });
      await tx.passwordHistory.deleteMany({ where: { userId } });
      await tx.userRole.deleteMany({ where: { userId } });
      await tx.twoFactorAuth.deleteMany({ where: { userId } });
      await tx.notification.deleteMany({ where: { userId } });
      await tx.userProfile.deleteMany({ where: { userId } });

      // Keep audit logs for compliance but anonymize
      await tx.auditLog.updateMany({
        where: { userId },
        data: { details: { anonymized: true, deletedAt: new Date() } },
      });

      // Finally delete the user
      await tx.user.delete({ where: { id: userId } });
    });

    logger.warn({
      message: 'Account permanently deleted',
      email: confirmEmail,
    });

    return { message: 'Account permanently deleted' };
  }

  // Export user data (GDPR compliance)
  async exportUserData(userId: string): Promise<ExportedUserData> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Get profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    // Get roles
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    // Get sessions
    const sessions = await prisma.session.findMany({
      where: { userId },
      select: {
        deviceInfo: true,
        ipAddress: true,
        lastActivity: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Get audit logs
    const auditLogs = await prisma.auditLog.findMany({
      where: { userId },
      select: {
        action: true,
        resource: true,
        timestamp: true,
        ipAddress: true,
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    // Audit the export
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DATA_EXPORTED',
        resource: 'user',
        resourceId: userId,
      },
    });

    logger.info({
      userId,
      message: 'User data exported',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
      profile,
      roles: userRoles.map((ur) => ur.role.name),
      sessions,
      auditLogs,
    };
  }
}

export default new AccountService();
