import { FastifyInstance } from 'fastify';
import { validateRequest } from '../middlewares/validation';
import { registerSchema } from '../validators/schemas';
import authController from '../controllers/auth.controller';

export default async function authRoutes(app: FastifyInstance): Promise<void> {
  // User Registration
  app.post(
    '/register',
    {
      preHandler: validateRequest({ body: registerSchema }),
    },
    async (request, reply) => await authController.register(request, reply)
  );

  // Check Email Availability
  app.get('/check-email', async (request, reply) =>
    authController.checkEmailAvailability(request, reply)
  );

  // Check Username Availability
  app.get('/check-username', async (request, reply) =>
    authController.checkUsernameAvailability(request, reply)
  );
}
