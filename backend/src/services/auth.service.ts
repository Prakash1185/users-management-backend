import userRepository from '../repositories/user.repository';
import tokenRepository from '../repositories/token.repository';
import emailVerificationRepository from '../repositories/emailVerification.repository';
import hashService from './hash.service';
import jwtService from './jwt.service';
import emailService from './email.service';
import prisma from '../config/database';
import { ConflictError, BadRequestError, UnauthorizedError, NotFoundError } from '../utils/errors';
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

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    emailVerified: boolean;
    roles: string[];
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
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

    await emailVerificationRepository.create(user.id, verificationToken, expiresAt);

    // Send verification email
    await emailService.sendVerificationEmail(user.email, verificationToken, user.username);

    logger.info({
      userId: user.id,
      email: user.email,
      username: user.username,
      message: 'User registered successfully and verification email sent',
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

  async login(input: LoginInput): Promise<LoginResponse> {
    const { identifier, password } = input;

    // Find user by email or username
    const user = await userRepository.findByEmailOrUsername(identifier.toLowerCase().trim());

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedError(
        `Account is locked due to too many failed login attempts. Try again in ${minutesLeft} minutes.`
      );
    }

    // Check if account is suspended
    if (user.isSuspended) {
      throw new UnauthorizedError('Account has been suspended. Please contact support.');
    }

    // Check if account is deleted
    if (user.deletedAt) {
      throw new UnauthorizedError('Account not found');
    }

    // Verify password
    const isPasswordValid = await hashService.compare(password, user.password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await userRepository.incrementFailedLoginAttempts(user.id);

      logger.warn({
        userId: user.id,
        email: user.email,
        failedAttempts: user.failedLoginAttempts + 1,
        message: 'Failed login attempt',
      });

      throw new UnauthorizedError('Invalid credentials');
    }

    // Get user roles
    const userWithRoles = await userRepository.findById(user.id);
    const roles = userWithRoles?.userRoles.map((ur) => ur.role.name) || [];

    // Generate JWT tokens
    const jwtPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      roles,
    };

    const accessToken = jwtService.generateAccessToken(jwtPayload);
    const refreshToken = jwtService.generateRefreshToken(jwtPayload);

    // Store refresh token in database
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await tokenRepository.createRefreshToken(user.id, refreshToken, refreshTokenExpiry);

    // Update last login and reset failed attempts
    await userRepository.updateLastLogin(user.id);

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        resource: 'auth',
        resourceId: user.id,
        details: {
          method: 'password',
          success: true,
        },
      },
    });

    logger.info({
      userId: user.id,
      email: user.email,
      message: 'User logged in successfully',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        roles,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: '15m',
      },
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Verify refresh token
    const decoded = jwtService.verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const storedToken = await tokenRepository.findRefreshToken(refreshToken);
    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      await tokenRepository.deleteRefreshToken(refreshToken);
      throw new UnauthorizedError('Refresh token expired');
    }

    // Get user with roles
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);

    // Generate new access token
    const accessToken = jwtService.generateAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      roles,
    });

    logger.info({
      userId: user.id,
      message: 'Access token refreshed',
    });

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await tokenRepository.deleteRefreshToken(refreshToken);
      logger.info('User logged out successfully');
    } catch (error) {
      // Token might not exist, which is fine
      logger.warn('Logout attempted with invalid token');
    }
  }

  async logoutAllDevices(userId: string): Promise<void> {
    await tokenRepository.deleteAllUserRefreshTokens(userId);
    logger.info({
      userId,
      message: 'User logged out from all devices',
    });
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const user = await userRepository.findByEmail(email.toLowerCase().trim());
    return !user;
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const user = await userRepository.findByUsername(username.toLowerCase().trim());
    return !user;
  }

  async verifyEmail(token: string): Promise<void> {
    const verification = await emailVerificationRepository.findByToken(token);

    if (!verification) {
      throw new BadRequestError('Invalid or expired verification token');
    }

    if (verification.expiresAt < new Date()) {
      await emailVerificationRepository.deleteByToken(token);
      throw new BadRequestError('Verification token has expired');
    }

    // Verify the user
    await userRepository.verifyEmail(verification.userId);

    // Delete the verification token
    await emailVerificationRepository.deleteByToken(token);

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: verification.userId,
        action: 'EMAIL_VERIFIED',
        resource: 'user',
        resourceId: verification.userId,
      },
    });

    logger.info({
      userId: verification.userId,
      message: 'Email verified successfully',
    });
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await userRepository.findByEmail(email.toLowerCase().trim());

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestError('Email is already verified');
    }

    // Delete old verification tokens
    await emailVerificationRepository.deleteAllUserTokens(user.id);

    // Generate new token
    const verificationToken = hashService.generateToken(64);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await emailVerificationRepository.create(user.id, verificationToken, expiresAt);

    // Send verification email
    await emailService.sendVerificationEmail(user.email, verificationToken, user.username);

    logger.info({
      userId: user.id,
      email: user.email,
      message: 'Verification email resent',
    });
  }
}

export default new AuthService();
