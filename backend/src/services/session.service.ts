import crypto from 'crypto';
import sessionRepository from '../repositories/session.repository';
import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export interface SessionInfo {
  id: string;
  deviceInfo: string | null;
  ipAddress: string | null;
  lastActivity: Date;
  createdAt: Date;
  isCurrent: boolean;
}

export class SessionService {
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async createSession(
    userId: string,
    options: {
      ipAddress?: string;
      userAgent?: string;
      deviceInfo?: string;
      expiresInDays?: number;
    } = {}
  ): Promise<{ sessionId: string; token: string }> {
    const token = this.generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (options.expiresInDays || 7));

    const session = await sessionRepository.create({
      userId,
      token,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      deviceInfo: options.deviceInfo || this.parseDeviceInfo(options.userAgent),
      expiresAt,
    });

    logger.info({ userId, sessionId: session.id, message: 'Session created' });

    return { sessionId: session.id, token };
  }

  private parseDeviceInfo(userAgent?: string): string {
    if (!userAgent) return 'Unknown Device';
    
    if (userAgent.includes('Mobile')) return 'Mobile Device';
    if (userAgent.includes('Windows')) return 'Windows PC';
    if (userAgent.includes('Mac')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Unknown Device';
  }

  async validateSession(token: string): Promise<{ userId: string; sessionId: string } | null> {
    const session = await sessionRepository.findByToken(token);
    
    if (!session) return null;
    if (session.expiresAt < new Date()) {
      await sessionRepository.invalidate(session.id);
      return null;
    }

    // Update last activity
    await sessionRepository.updateActivity(session.id);

    return { userId: session.userId, sessionId: session.id };
  }

  async getUserSessions(userId: string, currentSessionId?: string): Promise<SessionInfo[]> {
    const sessions = await sessionRepository.findByUserId(userId);
    
    return sessions.map(session => ({
      id: session.id,
      deviceInfo: session.deviceInfo,
      ipAddress: session.ipAddress,
      lastActivity: session.lastActivity,
      createdAt: session.createdAt,
      isCurrent: session.id === currentSessionId,
    }));
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    const sessions = await sessionRepository.findByUserId(userId);
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      throw new NotFoundError('Session not found');
    }

    await sessionRepository.invalidate(sessionId);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'SESSION_REVOKED',
        resource: 'session',
        resourceId: sessionId,
      },
    });

    logger.info({ userId, sessionId, message: 'Session revoked' });
  }

  async revokeAllSessions(userId: string, exceptCurrentId?: string): Promise<number> {
    const count = await sessionRepository.invalidateAllForUser(userId, exceptCurrentId);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'ALL_SESSIONS_REVOKED',
        resource: 'user',
        resourceId: userId,
        details: { exceptCurrent: !!exceptCurrentId, revokedCount: count },
      },
    });

    logger.info({ userId, count, message: 'All sessions revoked' });

    return count;
  }

  async cleanupExpiredSessions(): Promise<number> {
    const count = await sessionRepository.deleteExpired();
    if (count > 0) {
      logger.info({ count, message: 'Expired sessions cleaned up' });
    }
    return count;
  }
}

export default new SessionService();
