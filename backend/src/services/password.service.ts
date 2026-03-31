import userRepository from '../repositories/user.repository';
import passwordRepository from '../repositories/password.repository';
import hashService from './hash.service';
import emailService from './email.service';
import tokenRepository from '../repositories/token.repository';
import prisma from '../config/database';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/errors';
import logger from '../utils/logger';

export class PasswordService {
  async forgotPassword(email: string): Promise<void> {
    const user = await userRepository.findByEmail(email.toLowerCase().trim());

    if (!user) {
      // Don't reveal if email exists or not for security
      logger.info({
        email,
        message: 'Password reset requested for non-existent email',
      });
      return;
    }

    if (user.deletedAt || user.isSuspended) {
      logger.warn({
        email,
        message: 'Password reset requested for inactive account',
      });
      return;
    }

    // Delete any existing reset tokens
    await passwordRepository.deleteAllUserPasswordResets(user.id);

    // Generate reset token
    const resetToken = hashService.generateToken(64);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await passwordRepository.createPasswordReset(user.id, resetToken, expiresAt);

    // Send reset email
    await emailService.sendPasswordResetEmail(user.email, resetToken, user.username);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET_REQUESTED',
        resource: 'user',
        resourceId: user.id,
      },
    });

    logger.info({
      userId: user.id,
      email: user.email,
      message: 'Password reset email sent',
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetRecord = await passwordRepository.findPasswordResetByToken(token);

    if (!resetRecord) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    if (resetRecord.used) {
      throw new BadRequestError('This reset link has already been used');
    }

    if (resetRecord.expiresAt < new Date()) {
      await passwordRepository.deletePasswordReset(token);
      throw new BadRequestError('Reset token has expired');
    }

    // Check if new password is in history
    const isInHistory = await passwordRepository.isPasswordInHistory(
      resetRecord.userId,
      newPassword,
      hashService.compare.bind(hashService)
    );

    if (isInHistory) {
      throw new BadRequestError('Cannot reuse one of your last 5 passwords');
    }

    // Hash new password
    const hashedPassword = await hashService.hash(newPassword);

    // Update password
    await userRepository.updateById(resetRecord.userId, {
      password: hashedPassword,
    });

    // Add to password history
    await passwordRepository.addPasswordToHistory(resetRecord.userId, hashedPassword);

    // Mark reset token as used
    await passwordRepository.markPasswordResetAsUsed(token);

    // Invalidate all refresh tokens (force re-login)
    await tokenRepository.deleteAllUserRefreshTokens(resetRecord.userId);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: resetRecord.userId,
        action: 'PASSWORD_RESET_COMPLETED',
        resource: 'user',
        resourceId: resetRecord.userId,
      },
    });

    logger.info({
      userId: resetRecord.userId,
      message: 'Password reset completed',
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await hashService.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Check if new password is same as current
    const isSameAsCurrent = await hashService.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      throw new BadRequestError('New password cannot be the same as current password');
    }

    // Check if new password is in history
    const isInHistory = await passwordRepository.isPasswordInHistory(
      userId,
      newPassword,
      hashService.compare.bind(hashService)
    );

    if (isInHistory) {
      throw new BadRequestError('Cannot reuse one of your last 5 passwords');
    }

    // Hash new password
    const hashedPassword = await hashService.hash(newPassword);

    // Update password
    await userRepository.updateById(userId, {
      password: hashedPassword,
    });

    // Add to password history
    await passwordRepository.addPasswordToHistory(userId, hashedPassword);

    // Invalidate all refresh tokens except current (optional: invalidate all)
    await tokenRepository.deleteAllUserRefreshTokens(userId);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PASSWORD_CHANGED',
        resource: 'user',
        resourceId: userId,
      },
    });

    logger.info({
      userId,
      message: 'Password changed successfully',
    });
  }
}

export default new PasswordService();
