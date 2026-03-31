import prisma from '../utils/database';

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export class AuditRepository {
  async create(data: {
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.auditLog.create({ data: { ...data, details: data.details ? JSON.parse(JSON.stringify(data.details)) : undefined } });
  }

  async findMany(filters: AuditLogFilters) {
    const { userId, action, resource, startDate, endDate, page = 1, limit = 50 } = filters;
    const where: Record<string, unknown> = {};

    if (userId) where.userId = userId;
    if (action) where.action = { contains: action, mode: 'insensitive' };
    if (resource) where.resource = resource;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) (where.timestamp as Record<string, Date>).gte = startDate;
      if (endDate) (where.timestamp as Record<string, Date>).lte = endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { user: { select: { id: true, email: true, username: true } } },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getStats(days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const [totalLogs, byAction, byResource] = await Promise.all([
      prisma.auditLog.count({ where: { timestamp: { gte: since } } }),
      prisma.auditLog.groupBy({ by: ['action'], _count: true, where: { timestamp: { gte: since } }, orderBy: { _count: { action: 'desc' } }, take: 10 }),
      prisma.auditLog.groupBy({ by: ['resource'], _count: true, where: { timestamp: { gte: since } }, orderBy: { _count: { resource: 'desc' } }, take: 10 }),
    ]);

    return { totalLogs, byAction: byAction.map(a => ({ action: a.action, count: a._count })), byResource: byResource.map(r => ({ resource: r.resource, count: r._count })), period: `${days} days` };
  }

  async deleteOldLogs(retentionDays: number) {
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    return prisma.auditLog.deleteMany({ where: { timestamp: { lt: cutoff } } });
  }
}

export default new AuditRepository();
