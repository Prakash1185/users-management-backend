import { FastifyRequest, FastifyReply } from 'fastify';
import sessionService from '../services/session.service';
import { successResponse } from '../utils/response';

export class SessionController {
  async getSessions(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.user) {
      reply.status(401).send({ success: false, message: 'Authentication required', statusCode: 401 });
      return;
    }

    // Get current session ID from header or cookie if available
    const currentSessionId = request.headers['x-session-id'] as string | undefined;
    
    const sessions = await sessionService.getUserSessions(request.user.id, currentSessionId);
    reply.send(successResponse('Sessions retrieved', { sessions }));
  }

  async revokeSession(
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      reply.status(401).send({ success: false, message: 'Authentication required', statusCode: 401 });
      return;
    }

    await sessionService.revokeSession(request.user.id, request.params.sessionId);
    reply.send(successResponse('Session revoked'));
  }

  async revokeAllSessions(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.user) {
      reply.status(401).send({ success: false, message: 'Authentication required', statusCode: 401 });
      return;
    }

    const currentSessionId = request.headers['x-session-id'] as string | undefined;
    const count = await sessionService.revokeAllSessions(request.user.id, currentSessionId);

    reply.send(successResponse('All other sessions revoked', { revokedCount: count }));
  }
}

export default new SessionController();
