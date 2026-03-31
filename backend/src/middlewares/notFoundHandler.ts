import { FastifyRequest, FastifyReply } from 'fastify';

export const notFoundHandler = (request: FastifyRequest, reply: FastifyReply): void => {
  void reply.status(404).send({
    success: false,
    message: `Route ${request.method} ${request.url} not found`,
    statusCode: 404,
  });
};
