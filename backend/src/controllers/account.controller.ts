import { FastifyRequest, FastifyReply } from 'fastify';
import accountService from '../services/account.service';
import { successResponse } from '../utils/response';

export class AccountController {
  async deactivateAccount(
    request: FastifyRequest<{ Body: { password: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      reply.status(401).send({
        success: false,
        message: 'Authentication required',
        statusCode: 401,
      });
      return;
    }

    const result = await accountService.deactivateAccount(
      request.user.id,
      request.body.password
    );

    reply.send(successResponse(result.message));
  }

  async reactivateAccount(
    request: FastifyRequest<{ Body: { email: string; password: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { email, password } = request.body;
    const result = await accountService.reactivateAccount(email, password);
    reply.send(successResponse(result.message));
  }

  async deleteAccount(
    request: FastifyRequest<{ Body: { password: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      reply.status(401).send({
        success: false,
        message: 'Authentication required',
        statusCode: 401,
      });
      return;
    }

    const result = await accountService.softDeleteAccount(
      request.user.id,
      request.body.password
    );

    reply.send(successResponse(result.message, { recoveryDeadline: result.recoveryDeadline }));
  }

  async recoverAccount(
    request: FastifyRequest<{ Body: { email: string; password: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { email, password } = request.body;
    const result = await accountService.recoverAccount(email, password);
    reply.send(successResponse(result.message));
  }

  async permanentDelete(
    request: FastifyRequest<{ Body: { password: string; confirmEmail: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      reply.status(401).send({
        success: false,
        message: 'Authentication required',
        statusCode: 401,
      });
      return;
    }

    const { password, confirmEmail } = request.body;
    const result = await accountService.permanentDeleteAccount(
      request.user.id,
      password,
      confirmEmail
    );

    reply.send(successResponse(result.message));
  }

  async exportData(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      reply.status(401).send({
        success: false,
        message: 'Authentication required',
        statusCode: 401,
      });
      return;
    }

    const data = await accountService.exportUserData(request.user.id);

    // Set headers for download
    reply.header('Content-Type', 'application/json');
    reply.header(
      'Content-Disposition',
      `attachment; filename="user-data-${request.user.id}-${Date.now()}.json"`
    );

    reply.send(data);
  }
}

export default new AccountController();
