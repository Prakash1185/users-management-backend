import { FastifyInstance } from 'fastify';
import { validateRequest } from '../middlewares/validation';
import { successResponse } from '../utils/response';
import { registerSchema, loginSchema, idSchema, paginationSchema } from '../validators/schemas';
import { z } from 'zod';

/**
 * Example Routes for Validation & Error Handling Demonstration
 * 
 * These routes demonstrate how to use:
 * - Request validation with Zod schemas
 * - Error handling with custom error classes
 * - Standardized response formatting
 * 
 * Note: These are educational/demonstration endpoints.
 * Real authentication routes are in /api/v1/auth
 */

export default async function exampleRoutes(app: FastifyInstance): Promise<void> {
  // Example: Validation with body
  app.post(
    '/example/register',
    {
      preHandler: validateRequest({ body: registerSchema }),
    },
    async (request, reply) => {
      const body = request.body as z.infer<typeof registerSchema>;

      return reply.send(
        successResponse('Registration validation passed', {
          email: body.email,
          username: body.username,
        })
      );
    }
  );

  // Example: Validation with params
  app.get(
    '/example/user/:id',
    {
      preHandler: validateRequest({ params: idSchema }),
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof idSchema>;

      return reply.send(
        successResponse('User ID validated', {
          userId: id,
        })
      );
    }
  );

  // Example: Validation with query params
  app.get(
    '/example/users',
    {
      preHandler: validateRequest({ query: paginationSchema }),
    },
    async (request, reply) => {
      const { page, limit } = request.query as z.infer<typeof paginationSchema>;

      return reply.send(
        successResponse('Pagination validated', {
          page,
          limit,
        })
      );
    }
  );

  // Example: Combined validation
  app.post(
    '/example/login',
    {
      preHandler: validateRequest({ body: loginSchema }),
    },
    async (request, reply) => {
      const body = request.body as z.infer<typeof loginSchema>;

      return reply.send(
        successResponse('Login validation passed', {
          identifier: body.identifier,
        })
      );
    }
  );

  // Example: Error throwing
  app.get('/example/error', async () => {
    const { BadRequestError } = await import('../utils/errors');
    throw new BadRequestError('This is a test error');
  });

  // Example: Not found resource
  app.get('/example/notfound', async () => {
    const { NotFoundError } = await import('../utils/errors');
    throw new NotFoundError('Resource not found');
  });
}
