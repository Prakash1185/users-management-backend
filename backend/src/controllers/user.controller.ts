import { FastifyRequest, FastifyReply } from 'fastify';
import userService from '../services/user.service';
import { successResponse } from '../utils/response';
import { z } from 'zod';
import { updateProfileSchema } from '../validators/schemas';

export class UserController {
  async getProfile(
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

    const profile = await userService.getProfile(request.user.id);

    reply.send(successResponse('Profile retrieved successfully', profile));
  }

  async updateProfile(
    request: FastifyRequest<{ Body: z.infer<typeof updateProfileSchema> }>,
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

    const updatedProfile = await userService.updateProfile(request.user.id, request.body);

    reply.send(successResponse('Profile updated successfully', updatedProfile));
  }

  async updatePreferences(
    request: FastifyRequest<{ Body: Record<string, unknown> }>,
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

    const updatedProfile = await userService.updatePreferences(request.user.id, request.body);

    reply.send(successResponse('Preferences updated successfully', updatedProfile));
  }

  async getPublicProfile(
    request: FastifyRequest<{ Params: { username: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { username } = request.params;

    // Get user by username
    const { default: userRepository } = await import('../repositories/user.repository');
    const user = await userRepository.findByUsername(username.toLowerCase());

    if (!user) {
      reply.status(404).send({
        success: false,
        message: 'User not found',
        statusCode: 404,
      });
      return;
    }

    // Return only public information
    const publicProfile = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    reply.send(successResponse('Public profile retrieved', publicProfile));
  }
}

export default new UserController();
