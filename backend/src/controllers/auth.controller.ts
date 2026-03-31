import { FastifyRequest, FastifyReply } from 'fastify';
import authService from '../services/auth.service';
import { successResponse } from '../utils/response';
import { z } from 'zod';
import { registerSchema } from '../validators/schemas';
import logger from '../utils/logger';

export class AuthController {
  async register(
    request: FastifyRequest<{ Body: z.infer<typeof registerSchema> }>,
    reply: FastifyReply
  ): Promise<void> {
    const { email, username, password, firstName, lastName } = request.body;

    const result = await authService.register({
      email,
      username,
      password,
      firstName,
      lastName,
    });

    logger.info({
      userId: result.user.id,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      message: 'User registration successful',
    });

    reply.status(201).send(
      successResponse('Registration successful. Please verify your email to activate your account.', {
        user: result.user,
        message: 'A verification email has been sent to your email address.',
      })
    );
  }

  async checkEmailAvailability(
    request: FastifyRequest<{ Querystring: { email: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { email } = request.query;

    if (!email) {
      reply.status(400).send(
        successResponse('Email parameter is required', {
          available: false,
        })
      );
      return;
    }

    const isAvailable = await authService.checkEmailAvailability(email);

    reply.send(
      successResponse(isAvailable ? 'Email is available' : 'Email is already taken', {
        email,
        available: isAvailable,
      })
    );
  }

  async checkUsernameAvailability(
    request: FastifyRequest<{ Querystring: { username: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { username } = request.query;

    if (!username) {
      reply.status(400).send(
        successResponse('Username parameter is required', {
          available: false,
        })
      );
      return;
    }

    const isAvailable = await authService.checkUsernameAvailability(username);

    reply.send(
      successResponse(
        isAvailable ? 'Username is available' : 'Username is already taken',
        {
          username,
          available: isAvailable,
        }
      )
    );
  }
}

export default new AuthController();
