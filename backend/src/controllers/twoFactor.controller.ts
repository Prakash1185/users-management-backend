import { FastifyRequest, FastifyReply } from 'fastify';
import twoFactorService from '../services/twoFactor.service';
import { successResponse } from '../utils/response';

export class TwoFactorController {
  async setup(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.user) {
      reply.status(401).send({ success: false, message: 'Authentication required', statusCode: 401 });
      return;
    }

    const result = await twoFactorService.setup(request.user.id, request.user.email);

    reply.send(successResponse('2FA setup initiated. Scan the QR code and verify.', {
      qrCodeUrl: result.qrCodeUrl,
      secret: result.secret,
      backupCodes: result.backupCodes,
    }));
  }

  async enable(
    request: FastifyRequest<{ Body: { token: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      reply.status(401).send({ success: false, message: 'Authentication required', statusCode: 401 });
      return;
    }

    const result = await twoFactorService.enable(request.user.id, request.body.token);
    reply.send(successResponse(result.message));
  }

  async disable(
    request: FastifyRequest<{ Body: { token: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      reply.status(401).send({ success: false, message: 'Authentication required', statusCode: 401 });
      return;
    }

    const result = await twoFactorService.disable(request.user.id, request.body.token);
    reply.send(successResponse(result.message));
  }

  async verify(
    request: FastifyRequest<{ Body: { token: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      reply.status(401).send({ success: false, message: 'Authentication required', statusCode: 401 });
      return;
    }

    const isValid = await twoFactorService.verify(request.user.id, request.body.token);
    
    if (isValid) {
      reply.send(successResponse('Verification successful'));
    } else {
      reply.status(400).send({ success: false, message: 'Invalid code', statusCode: 400 });
    }
  }

  async regenerateBackupCodes(
    request: FastifyRequest<{ Body: { token: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      reply.status(401).send({ success: false, message: 'Authentication required', statusCode: 401 });
      return;
    }

    const backupCodes = await twoFactorService.regenerateBackupCodes(
      request.user.id,
      request.body.token
    );

    reply.send(successResponse('Backup codes regenerated', { backupCodes }));
  }

  async getStatus(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.user) {
      reply.status(401).send({ success: false, message: 'Authentication required', statusCode: 401 });
      return;
    }

    const isEnabled = await twoFactorService.isEnabled(request.user.id);
    reply.send(successResponse('2FA status', { enabled: isEnabled }));
  }
}

export default new TwoFactorController();
