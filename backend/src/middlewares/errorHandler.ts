import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

export const errorHandler = (
  error: Error | AppError,
  request: FastifyRequest,
  reply: FastifyReply
): void => {
  if (error instanceof AppError) {
    logger.warn({
      err: error,
      req: request,
      statusCode: error.statusCode,
    });

    void reply.status(error.statusCode).send({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
    return;
  }

  logger.error({
    err: error,
    req: request,
  });

  void reply.status(500).send({
    success: false,
    message: 'Internal server error',
    statusCode: 500,
  });
};
