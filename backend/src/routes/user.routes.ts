import { FastifyInstance } from 'fastify';
import { validateRequest } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { updateProfileSchema } from '../validators/schemas';
import userController from '../controllers/user.controller';
import { z } from 'zod';

export default async function userRoutes(app: FastifyInstance): Promise<void> {
  // Get current user's profile (Protected)
  app.get(
    '/profile',
    {
      preHandler: authenticate,
    },
    async (request, reply) => userController.getProfile(request, reply)
  );

  // Update current user's profile (Protected)
  app.put<{ Body: z.infer<typeof updateProfileSchema> }>(
    '/profile',
    {
      preHandler: [authenticate, validateRequest({ body: updateProfileSchema })],
    },
    async (request, reply) => userController.updateProfile(request, reply)
  );

  // Partial update current user's profile (Protected)
  app.patch<{ Body: z.infer<typeof updateProfileSchema> }>(
    '/profile',
    {
      preHandler: [authenticate, validateRequest({ body: updateProfileSchema })],
    },
    async (request, reply) => userController.updateProfile(request, reply)
  );

  // Update preferences (Protected)
  app.put<{ Body: Record<string, unknown> }>(
    '/preferences',
    {
      preHandler: authenticate,
    },
    async (request, reply) => userController.updatePreferences(request, reply)
  );

  // Get public profile by username
  app.get<{ Params: { username: string } }>(
    '/:username',
    async (request, reply) => userController.getPublicProfile(request, reply)
  );
}
