import prisma from '../config/database';
import { EmailVerification } from '@prisma/client';

export class EmailVerificationRepository {
  async create(userId: string, token: string, expiresAt: Date): Promise<EmailVerification> {
    return await prisma.emailVerification.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findByToken(token: string): Promise<EmailVerification | null> {
    return await prisma.emailVerification.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });
  }

  async deleteByToken(token: string): Promise<void> {
    await prisma.emailVerification.delete({
      where: { token },
    });
  }

  async deleteAllUserTokens(userId: string): Promise<void> {
    await prisma.emailVerification.deleteMany({
      where: { userId },
    });
  }

  async deleteExpiredTokens(): Promise<void> {
    await prisma.emailVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}

export default new EmailVerificationRepository();
