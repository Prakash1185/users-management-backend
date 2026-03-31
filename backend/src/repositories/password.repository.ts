import prisma from '../config/database';
import { PasswordReset, PasswordHistory } from '@prisma/client';

export class PasswordRepository {
  async createPasswordReset(userId: string, token: string, expiresAt: Date): Promise<PasswordReset> {
    return await prisma.passwordReset.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findPasswordResetByToken(token: string): Promise<PasswordReset | null> {
    return await prisma.passwordReset.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });
  }

  async markPasswordResetAsUsed(token: string): Promise<void> {
    await prisma.passwordReset.update({
      where: { token },
      data: { used: true },
    });
  }

  async deletePasswordReset(token: string): Promise<void> {
    await prisma.passwordReset.delete({
      where: { token },
    });
  }

  async deleteAllUserPasswordResets(userId: string): Promise<void> {
    await prisma.passwordReset.deleteMany({
      where: { userId },
    });
  }

  async deleteExpiredPasswordResets(): Promise<void> {
    await prisma.passwordReset.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { used: true },
        ],
      },
    });
  }

  async addPasswordToHistory(userId: string, hashedPassword: string): Promise<PasswordHistory> {
    return await prisma.passwordHistory.create({
      data: {
        userId,
        password: hashedPassword,
      },
    });
  }

  async getPasswordHistory(userId: string, limit: number = 5): Promise<PasswordHistory[]> {
    return await prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async isPasswordInHistory(userId: string, password: string, hashCompare: (plain: string, hash: string) => Promise<boolean>): Promise<boolean> {
    const history = await this.getPasswordHistory(userId, 5);
    
    for (const entry of history) {
      const matches = await hashCompare(password, entry.password);
      if (matches) {
        return true;
      }
    }
    
    return false;
  }
}

export default new PasswordRepository();
