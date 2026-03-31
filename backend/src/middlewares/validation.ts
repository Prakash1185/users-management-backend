import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

export const asyncHandler = (
  fn: (req: FastifyRequest, reply: FastifyReply) => Promise<unknown>
) => {
  return async (req: FastifyRequest, reply: FastifyReply): Promise<unknown> => {
    try {
      return await fn(req, reply);
    } catch (error) {
      throw error;
    }
  };
};

export const validateRequest = (schema: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}) => {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      if (schema.body) {
        request.body = await schema.body.parseAsync(request.body);
      }
      if (schema.query) {
        request.query = await schema.query.parseAsync(request.query);
      }
      if (schema.params) {
        request.params = await schema.params.parseAsync(request.params);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        void reply.status(422).send({
          success: false,
          message: 'Validation failed',
          errors,
          statusCode: 422,
        });
        return;
      }
      throw error;
    }
  };
};
