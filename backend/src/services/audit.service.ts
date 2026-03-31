import auditRepository, { AuditLogFilters } from '../repositories/audit.repository';
import prisma from '../utils/database';

export const AUDIT_ACTIONS = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_REGISTERED: 'USER_REGISTERED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  PASSWORD_RESET: 'PASSWORD_RESET',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  TWO_FACTOR_ENABLED: 'TWO_FACTOR_ENABLED',
  TWO_FACTOR_DISABLED: 'TWO_FACTOR_DISABLED',
  SESSION_REVOKED: 'SESSION_REVOKED',
  ROLE_ASSIGNED: 'ROLE_ASSIGNED',
  ROLE_REMOVED: 'ROLE_REMOVED',
  ACCOUNT_DEACTIVATED: 'ACCOUNT_DEACTIVATED',
  ACCOUNT_DELETED: 'ACCOUNT_DELETED',
} as const;

export class AuditService {
  async log(data: { userId?: string; action: string; resource: string; resourceId?: string; details?: Record<string, unknown>; ipAddress?: string; userAgent?: string }) {
    return auditRepository.create(data);
  }

  async getLogs(filters: AuditLogFilters) {
    return auditRepository.findMany(filters);
  }

  async getStats(days?: number) {
    return auditRepository.getStats(days);
  }

  async getUserActivity(userId: string, page = 1, limit = 20) {
    return auditRepository.findMany({ userId, page, limit });
  }

  async cleanupOldLogs(retentionDays = 90) {
    return auditRepository.deleteOldLogs(retentionDays);
  }

  async getAnalytics() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalUsers, activeToday, activeWeek, activeMonth, newUsersToday, newUsersWeek, loginStats, verifiedUsers] = await Promise.all([
      prisma.user.count(),
      prisma.auditLog.groupBy({ by: ['userId'], where: { createdAt: { gte: today }, action: 'USER_LOGIN' } }).then((results: unknown[]) => results.length),
      prisma.auditLog.groupBy({ by: ['userId'], where: { createdAt: { gte: weekAgo }, action: 'USER_LOGIN' } }).then((results: unknown[]) => results.length),
      prisma.auditLog.groupBy({ by: ['userId'], where: { createdAt: { gte: monthAgo }, action: 'USER_LOGIN' } }).then((results: unknown[]) => results.length),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.auditLog.count({ where: { action: 'USER_LOGIN', createdAt: { gte: monthAgo } } }),
      prisma.user.count({ where: { emailVerified: true } }),
    ]);

    return {
      users: { total: totalUsers, verified: verifiedUsers, verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) + '%' : '0%' },
      activity: { activeToday, activeWeek, activeMonth },
      growth: { newUsersToday, newUsersWeek },
      logins: { last30Days: loginStats },
    };
  }
}

export default new AuditService();
