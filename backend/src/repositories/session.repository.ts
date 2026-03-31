import prisma from '../config/database';
import { Session } from '@prisma/client';

export class SessionRepository {
  async create(data: {
    userId: string;
    token: string;
    ipAddress?: string;
    userAgent?: string;
    deviceInfo?: string;
    expiresAt: Date;
  }): Promise<Session> {
    return await prisma.session.create({
      data: {
        ...data,
        isValid: true,
        lastActivity: new Date(),
      },
    });
  }

  async findByToken(token: string): Promise<Session | null> {
    return await prisma.session.findFirst({
      where: { token, isValid: true },
    });
  }

  async findByUserId(userId: string): Promise<Session[]> {
    return await prisma.session.findMany({
      where: { userId, isValid: true },
      orderBy: { lastActivity: 'desc' },
    });
  }

  async updateActivity(id: string): Promise<void> {
    await prisma.session.update({
      where: { id },
      data: { lastActivity: new Date() },
    });
  }

  async invalidate(id: string): Promise<void> {
    await prisma.session.update({
      where: { id },
      data: { isValid: false },
    });
  }

  async invalidateAllForUser(userId: string, exceptId?: string): Promise<number> {
    const result = await prisma.session.updateMany({
      where: {
        userId,
        isValid: true,
        ...(exceptId && { NOT: { id: exceptId } }),
      },
      data: { isValid: false },
    });
    return result.count;
  }

  async deleteExpired(): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isValid: false },
        ],
      },
    });
    return result.count;
  }
}

export default new SessionRepository();
