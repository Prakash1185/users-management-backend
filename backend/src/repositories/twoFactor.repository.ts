import prisma from '../config/database';
import { TwoFactorAuth } from '@prisma/client';

export class TwoFactorRepository {
  async findByUserId(userId: string): Promise<TwoFactorAuth | null> {
    return await prisma.twoFactorAuth.findUnique({
      where: { userId },
    });
  }

  async create(userId: string, secret: string): Promise<TwoFactorAuth> {
    return await prisma.twoFactorAuth.create({
      data: {
        userId,
        secret,
        isEnabled: false,
      },
    });
  }

  async enable(userId: string, backupCodes: string[]): Promise<TwoFactorAuth> {
    return await prisma.twoFactorAuth.update({
      where: { userId },
      data: {
        isEnabled: true,
        backupCodes,
        enabledAt: new Date(),
      },
    });
  }

  async disable(userId: string): Promise<void> {
    await prisma.twoFactorAuth.delete({
      where: { userId },
    });
  }

  async updateBackupCodes(userId: string, backupCodes: string[]): Promise<TwoFactorAuth> {
    return await prisma.twoFactorAuth.update({
      where: { userId },
      data: { backupCodes },
    });
  }

  async updateLastUsed(userId: string): Promise<void> {
    await prisma.twoFactorAuth.update({
      where: { userId },
      data: { lastUsedAt: new Date() },
    });
  }
}

export default new TwoFactorRepository();
