import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth';
import accountController from '../controllers/account.controller';

export default async function accountRoutes(app: FastifyInstance): Promise<void> {
  // Deactivate account (Protected) - user can reactivate later
  app.post<{ Body: { password: string } }>(
    '/deactivate',
    {
      preHandler: authenticate,
    },
    async (request, reply) => accountController.deactivateAccount(request, reply)
  );

  // Reactivate account (Public) - for deactivated accounts
  app.post<{ Body: { email: string; password: string } }>(
    '/reactivate',
    async (request, reply) => accountController.reactivateAccount(request, reply)
  );

  // Soft delete account (Protected) - 30 day recovery window
  app.delete<{ Body: { password: string } }>(
    '/',
    {
      preHandler: authenticate,
    },
    async (request, reply) => accountController.deleteAccount(request, reply)
  );

  // Recover deleted account (Public) - within 30 day window
  app.post<{ Body: { email: string; password: string } }>(
    '/recover',
    async (request, reply) => accountController.recoverAccount(request, reply)
  );

  // Permanent delete (Protected) - requires email confirmation
  app.post<{ Body: { password: string; confirmEmail: string } }>(
    '/permanent-delete',
    {
      preHandler: authenticate,
    },
    async (request, reply) => accountController.permanentDelete(request, reply)
  );

  // Export user data - GDPR compliance (Protected)
  app.get(
    '/export',
    {
      preHandler: authenticate,
    },
    async (request, reply) => accountController.exportData(request, reply)
  );
}
