import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth';
import uploadController from '../controllers/upload.controller';

export default async function uploadRoutes(app: FastifyInstance): Promise<void> {
  // Upload avatar (Protected)
  app.post(
    '/avatar',
    {
      preHandler: authenticate,
    },
    async (request, reply) => uploadController.uploadAvatar(request, reply)
  );

  // Remove avatar (Protected)
  app.delete(
    '/avatar',
    {
      preHandler: authenticate,
    },
    async (request, reply) => uploadController.removeAvatar(request, reply)
  );
}
