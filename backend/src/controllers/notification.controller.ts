import { FastifyRequest, FastifyReply } from 'fastify';
import notificationService from '../services/notification.service';
import { successResponse } from '../utils/response';

export class NotificationController {
  async getNotifications(
    request: FastifyRequest<{ Querystring: { page?: string; limit?: string; unreadOnly?: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { page, limit, unreadOnly } = request.query;
    const result = await notificationService.getUserNotifications(
      request.user!.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      unreadOnly === 'true'
    );
    reply.send(successResponse('Notifications retrieved', result));
  }

  async markAsRead(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    await notificationService.markAsRead(request.user!.id, request.params.id);
    reply.send(successResponse('Notification marked as read'));
  }

  async markAllAsRead(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const result = await notificationService.markAllAsRead(request.user!.id);
    reply.send(successResponse('All notifications marked as read', { count: result.count }));
  }

  async deleteNotification(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    await notificationService.delete(request.user!.id, request.params.id);
    reply.send(successResponse('Notification deleted'));
  }

  async deleteAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const result = await notificationService.deleteAll(request.user!.id);
    reply.send(successResponse('All notifications deleted', { count: result.count }));
  }
}

export default new NotificationController();
