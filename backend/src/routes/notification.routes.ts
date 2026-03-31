import { FastifyInstance } from 'fastify';
import notificationController from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth';

export default async function notificationRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', notificationController.getNotifications.bind(notificationController));
  fastify.patch('/:id/read', notificationController.markAsRead.bind(notificationController));
  fastify.patch('/read-all', notificationController.markAllAsRead.bind(notificationController));
  fastify.delete('/:id', notificationController.deleteNotification.bind(notificationController));
  fastify.delete('/', notificationController.deleteAll.bind(notificationController));
}
