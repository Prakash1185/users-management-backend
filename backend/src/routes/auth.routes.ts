import { FastifyInstance } from 'fastify';
import { validateRequest } from '../middlewares/validation';
import { registerSchema, loginSchema } from '../validators/schemas';
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

  // User Login
  app.post(
    '/login',
    {
      preHandler: validateRequest({ body: loginSchema }),
    },
    async (request, reply) => await authController.login(request, reply)
  );

  // Refresh Access Token
  app.post('/refresh', async (request, reply) => authController.refreshToken(request, reply));

  // Logout
  app.post('/logout', async (request, reply) => authController.logout(request, reply));

  // Check Email Availability
  app.get('/check-email', async (request, reply) =>
    authController.checkEmailAvailability(request, reply)
  );

  // Check Username Availability
  app.get('/check-username', async (request, reply) =>
    authController.checkUsernameAvailability(request, reply)
  );
}
