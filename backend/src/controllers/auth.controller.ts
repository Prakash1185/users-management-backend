import { FastifyRequest, FastifyReply } from 'fastify';
import authService from '../services/auth.service';
import passwordService from '../services/password.service';
import { successResponse } from '../utils/response';
import { z } from 'zod';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from '../validators/schemas';
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

  async login(
    request: FastifyRequest<{ Body: z.infer<typeof loginSchema> }>,
    reply: FastifyReply
  ): Promise<void> {
    const { identifier, password } = request.body;

    const result = await authService.login({
      identifier,
      password,
    });

    // Create audit log
    logger.info({
      userId: result.user.id,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      message: 'User login successful',
    });

    reply.send(
      successResponse('Login successful', {
        user: result.user,
        tokens: result.tokens,
      })
    );
  }

  async refreshToken(
    request: FastifyRequest<{ Body: { refreshToken: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      reply.status(400).send({
        success: false,
        message: 'Refresh token is required',
        statusCode: 400,
      });
      return;
    }

    const result = await authService.refreshAccessToken(refreshToken);

    reply.send(
      successResponse('Access token refreshed', {
        accessToken: result.accessToken,
      })
    );
  }

  async logout(
    request: FastifyRequest<{ Body: { refreshToken: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { refreshToken } = request.body;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    reply.send(successResponse('Logged out successfully'));
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

  async verifyEmail(
    request: FastifyRequest<{ Querystring: { token: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { token } = request.query;

    if (!token) {
      reply.status(400).send({
        success: false,
        message: 'Verification token is required',
        statusCode: 400,
      });
      return;
    }

    await authService.verifyEmail(token);

    reply.send(
      successResponse('Email verified successfully. You can now login to your account.')
    );
  }

  async resendVerificationEmail(
    request: FastifyRequest<{ Body: { email: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { email } = request.body;

    if (!email) {
      reply.status(400).send({
        success: false,
        message: 'Email is required',
        statusCode: 400,
      });
      return;
    }

    await authService.resendVerificationEmail(email);

    reply.send(
      successResponse('Verification email sent. Please check your inbox.')
    );
  }

  async forgotPassword(
    request: FastifyRequest<{ Body: z.infer<typeof forgotPasswordSchema> }>,
    reply: FastifyReply
  ): Promise<void> {
    const { email } = request.body;

    await passwordService.forgotPassword(email);

    // Always return success to prevent email enumeration
    reply.send(
      successResponse('If an account with that email exists, a password reset link has been sent.')
    );
  }

  async resetPassword(
    request: FastifyRequest<{ Body: z.infer<typeof resetPasswordSchema> }>,
    reply: FastifyReply
  ): Promise<void> {
    const { token, password } = request.body;

    await passwordService.resetPassword(token, password);

    reply.send(
      successResponse('Password has been reset successfully. You can now login with your new password.')
    );
  }

  async changePassword(
    request: FastifyRequest<{ Body: z.infer<typeof changePasswordSchema> }>,
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

    const { currentPassword, newPassword } = request.body;

    await passwordService.changePassword(request.user.id, currentPassword, newPassword);

    reply.send(
      successResponse('Password changed successfully. Please login again with your new password.')
    );
  }
}

export default new AuthController();
