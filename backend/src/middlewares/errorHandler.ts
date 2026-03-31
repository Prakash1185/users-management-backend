import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';
import { z } from 'zod';

export const errorHandler = (
  error: Error | AppError | z.ZodError,
  request: FastifyRequest,
  reply: FastifyReply
): void => {
  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const errors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    logger.warn({
      err: error,
      req: request,
      statusCode: 422,
    });

    void reply.status(422).send({
      success: false,
      message: 'Validation failed',
      errors,
      statusCode: 422,
    });
    return;
  }

  // Handle custom AppError
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

  // Handle generic errors
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
