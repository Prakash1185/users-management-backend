import { User } from '@prisma/client';
import userRepository from '../repositories/user.repository';
import hashService from './hash.service';
import prisma from '../config/database';
import { ConflictError, BadRequestError } from '../utils/errors';
import logger from '../utils/logger';

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    emailVerified: boolean;
    createdAt: Date;
  };
}

export class AuthService {
  async register(input: RegisterInput): Promise<RegisterResponse> {
    const { email, username, password, firstName, lastName } = input;

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    // Check if email already exists
    const existingEmail = await userRepository.findByEmail(normalizedEmail);
    if (existingEmail) {
      throw new ConflictError('Email already registered');
    }

    // Check if username already exists
    const existingUsername = await userRepository.findByUsername(normalizedUsername);
    if (existingUsername) {
      throw new ConflictError('Username already taken');
    }

    // Hash password
    const hashedPassword = await hashService.hash(password);

    // Create user with transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          username: normalizedUsername,
          password: hashedPassword,
          firstName: firstName?.trim() || null,
          lastName: lastName?.trim() || null,
        },
      });

      // Create user profile
      await tx.userProfile.create({
        data: {
          userId: newUser.id,
        },
      });

      // Assign default 'user' role
      const userRole = await tx.role.findUnique({
        where: { name: 'user' },
      });

      if (userRole) {
        await tx.userRole.create({
          data: {
            userId: newUser.id,
            roleId: userRole.id,
          },
        });
      }

      // Store password in history
      await tx.passwordHistory.create({
        data: {
          userId: newUser.id,
          password: hashedPassword,
        },
      });

      return newUser;
    });

    // Generate email verification token
    const verificationToken = hashService.generateToken(64);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt,
      },
    });

    logger.info({
      userId: user.id,
      email: user.email,
      username: user.username,
      message: 'User registered successfully',
    });

    // TODO: Send verification email (Phase 2: Email Verification)
    logger.info({
      userId: user.id,
      verificationToken,
      message: 'Email verification token generated',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    };
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const user = await userRepository.findByEmail(email.toLowerCase().trim());
    return !user;
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const user = await userRepository.findByUsername(username.toLowerCase().trim());
    return !user;
  }
}

export default new AuthService();
