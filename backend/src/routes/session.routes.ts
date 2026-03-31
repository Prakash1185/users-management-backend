import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth';
import sessionController from '../controllers/session.controller';

export default async function sessionRoutes(app: FastifyInstance): Promise<void> {
  // Get all active sessions
  app.get('/', { preHandler: authenticate }, async (request, reply) =>
    sessionController.getSessions(request, reply)
  );

  // Revoke specific session
  app.delete<{ Params: { sessionId: string } }>(
    '/:sessionId',
    { preHandler: authenticate },
    async (request, reply) => sessionController.revokeSession(request, reply)
  );

  // Revoke all other sessions
  app.post('/revoke-all', { preHandler: authenticate }, async (request, reply) =>
    sessionController.revokeAllSessions(request, reply)
  );
}
