import { FastifyInstance } from 'fastify';
import { validateRequest } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from '../validators/schemas';
import authController from '../controllers/auth.controller';
import { z } from 'zod';

export default async function authRoutes(app: FastifyInstance): Promise<void> {
  // User Registration
  app.post<{ Body: z.infer<typeof registerSchema> }>(
    '/register',
    {
      preHandler: validateRequest({ body: registerSchema }),
    },
    async (request, reply) => await authController.register(request, reply)
  );

  // User Login
  app.post<{ Body: z.infer<typeof loginSchema> }>(
    '/login',
    {
      preHandler: validateRequest({ body: loginSchema }),
    },
    async (request, reply) => await authController.login(request, reply)
  );

  // Verify Email
  app.get<{ Querystring: { token: string } }>('/verify-email', async (request, reply) =>
    authController.verifyEmail(request, reply)
  );

  // Resend Verification Email
  app.post<{ Body: { email: string } }>('/resend-verification', async (request, reply) =>
    authController.resendVerificationEmail(request, reply)
  );

  // Forgot Password
  app.post<{ Body: z.infer<typeof forgotPasswordSchema> }>(
    '/forgot-password',
    {
      preHandler: validateRequest({ body: forgotPasswordSchema }),
    },
    async (request, reply) => authController.forgotPassword(request, reply)
  );

  // Reset Password
  app.post<{ Body: z.infer<typeof resetPasswordSchema> }>(
    '/reset-password',
    {
      preHandler: validateRequest({ body: resetPasswordSchema }),
    },
    async (request, reply) => authController.resetPassword(request, reply)
  );

  // Change Password (Protected)
  app.post<{ Body: z.infer<typeof changePasswordSchema> }>(
    '/change-password',
    {
      preHandler: [authenticate, validateRequest({ body: changePasswordSchema })],
    },
    async (request, reply) => authController.changePassword(request, reply)
  );

  // Refresh Access Token
  app.post<{ Body: { refreshToken: string } }>('/refresh', async (request, reply) => authController.refreshToken(request, reply));

  // Logout
  app.post<{ Body: { refreshToken: string } }>('/logout', async (request, reply) => authController.logout(request, reply));

  // Check Email Availability
  app.get<{ Querystring: { email: string } }>('/check-email', async (request, reply) =>
    authController.checkEmailAvailability(request, reply)
  );

  // Check Username Availability
  app.get<{ Querystring: { username: string } }>('/check-username', async (request, reply) =>
    authController.checkUsernameAvailability(request, reply)
  );
}
