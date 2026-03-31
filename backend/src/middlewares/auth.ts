import { FastifyRequest, FastifyReply } from 'fastify';
import jwtService from '../services/jwt.service';
import { UnauthorizedError } from '../utils/errors';

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Authorization header is missing');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedError('Invalid authorization header format. Use: Bearer <token>');
    }

    const token = parts[1];

    if (!token) {
      throw new UnauthorizedError('Token is missing');
    }

    // Verify and decode token
    const decoded = jwtService.verifyAccessToken(token);

    // Attach user to request
    request.user = {
      id: decoded.userId,
      email: decoded.email,
      username: decoded.username,
      roles: decoded.roles,
      permissions: [], // Will be populated when needed
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Authentication failed');
  }
};

export const optionalAuth = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const authHeader = request.headers.authorization;

    if (authHeader) {
      const parts = authHeader.split(' ');

      if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1];
        const decoded = jwtService.verifyAccessToken(token);

        request.user = {
          id: decoded.userId,
          email: decoded.email,
          username: decoded.username,
          roles: decoded.roles,
          permissions: [],
        };
      }
    }
  } catch (error) {
    // Ignore errors for optional auth
  }
};
