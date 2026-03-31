import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth';
import twoFactorController from '../controllers/twoFactor.controller';

export default async function twoFactorRoutes(app: FastifyInstance): Promise<void> {
  // Get 2FA status
  app.get('/status', { preHandler: authenticate }, async (request, reply) =>
    twoFactorController.getStatus(request, reply)
  );

  // Setup 2FA (get QR code and secret)
  app.post('/setup', { preHandler: authenticate }, async (request, reply) =>
    twoFactorController.setup(request, reply)
  );

  // Enable 2FA (verify token to activate)
  app.post<{ Body: { token: string } }>(
    '/enable',
    { preHandler: authenticate },
    async (request, reply) => twoFactorController.enable(request, reply)
  );

  // Disable 2FA
  app.post<{ Body: { token: string } }>(
    '/disable',
    { preHandler: authenticate },
    async (request, reply) => twoFactorController.disable(request, reply)
  );

  // Verify 2FA token
  app.post<{ Body: { token: string } }>(
    '/verify',
    { preHandler: authenticate },
    async (request, reply) => twoFactorController.verify(request, reply)
  );

  // Regenerate backup codes
  app.post<{ Body: { token: string } }>(
    '/backup-codes',
    { preHandler: authenticate },
    async (request, reply) => twoFactorController.regenerateBackupCodes(request, reply)
  );
}
