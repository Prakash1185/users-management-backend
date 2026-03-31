import { FastifyRequest, FastifyReply } from 'fastify';
import auditService from '../services/audit.service';
import { successResponse } from '../utils/response';

export class AuditController {
  async getLogs(
    request: FastifyRequest<{ Querystring: { userId?: string; action?: string; resource?: string; startDate?: string; endDate?: string; page?: string; limit?: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { userId, action, resource, startDate, endDate, page, limit } = request.query;
    const result = await auditService.getLogs({
      userId,
      action,
      resource,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
    });
    reply.send(successResponse('Audit logs retrieved', result));
  }

  async getStats(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const stats = await auditService.getStats();
    reply.send(successResponse('Audit stats retrieved', stats));
  }

  async getAnalytics(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const analytics = await auditService.getAnalytics();
    reply.send(successResponse('Analytics retrieved', analytics));
  }

  async getUserActivity(
    request: FastifyRequest<{ Params: { userId: string }; Querystring: { page?: string; limit?: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { page, limit } = request.query;
    const activity = await auditService.getUserActivity(request.params.userId, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
    reply.send(successResponse('User activity retrieved', activity));
  }

  async cleanupLogs(
    request: FastifyRequest<{ Body: { retentionDays?: number } }>,
    reply: FastifyReply
  ): Promise<void> {
    const result = await auditService.cleanupOldLogs(request.body.retentionDays);
    reply.send(successResponse('Old logs cleaned up', { deletedCount: result.count }));
  }
}

export default new AuditController();
