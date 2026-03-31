import userRepository from '../repositories/user.repository';
import profileRepository from '../repositories/profile.repository';
import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export interface UserProfileData {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
  profile: {
    bio: string | null;
    phone: string | null;
    dateOfBirth: Date | null;
    address: string | null;
    city: string | null;
    country: string | null;
    timezone: string | null;
    language: string;
    preferences: Record<string, unknown> | null;
  } | null;
  roles: string[];
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  dateOfBirth?: Date | string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
  language?: string;
}

export interface UpdatePreferencesInput {
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  twoFactorEnabled?: boolean;
  [key: string]: unknown;
}

export class UserService {
  async getProfile(userId: string): Promise<UserProfileData> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.deletedAt) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      profile: user.profile ? {
        bio: user.profile.bio,
        phone: user.profile.phone,
        dateOfBirth: user.profile.dateOfBirth,
        address: user.profile.address,
        city: user.profile.city,
        country: user.profile.country,
        timezone: user.profile.timezone,
        language: user.profile.language,
        preferences: user.profile.preferences as Record<string, unknown> | null,
      } : null,
      roles: user.userRoles.map((ur) => ur.role.name),
    };
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfileData> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update user table fields
    if (input.firstName !== undefined || input.lastName !== undefined) {
      await userRepository.updateById(userId, {
        firstName: input.firstName,
        lastName: input.lastName,
      });
    }

    // Update profile table fields
    const profileData: Record<string, unknown> = {};
    if (input.bio !== undefined) profileData.bio = input.bio;
    if (input.phone !== undefined) profileData.phone = input.phone;
    if (input.dateOfBirth !== undefined) {
      profileData.dateOfBirth = input.dateOfBirth ? new Date(input.dateOfBirth) : null;
    }
    if (input.address !== undefined) profileData.address = input.address;
    if (input.city !== undefined) profileData.city = input.city;
    if (input.country !== undefined) profileData.country = input.country;
    if (input.timezone !== undefined) profileData.timezone = input.timezone;
    if (input.language !== undefined) profileData.language = input.language;

    if (Object.keys(profileData).length > 0) {
      await profileRepository.upsert(userId, profileData);
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PROFILE_UPDATED',
        resource: 'user',
        resourceId: userId,
        details: {
          updatedFields: Object.keys(input),
        },
      },
    });

    logger.info({
      userId,
      message: 'Profile updated',
      updatedFields: Object.keys(input),
    });

    return this.getProfile(userId);
  }

  async updatePreferences(userId: string, preferences: UpdatePreferencesInput): Promise<UserProfileData> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Get current preferences
    const profile = await profileRepository.findByUserId(userId);
    const currentPreferences = (profile?.preferences as Record<string, unknown>) || {};

    // Merge preferences
    const mergedPreferences = {
      ...currentPreferences,
      ...preferences,
    };

    await profileRepository.updatePreferences(userId, mergedPreferences);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PREFERENCES_UPDATED',
        resource: 'user',
        resourceId: userId,
        details: {
          updatedKeys: Object.keys(preferences),
        },
      },
    });

    logger.info({
      userId,
      message: 'Preferences updated',
    });

    return this.getProfile(userId);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<UserProfileData> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    await userRepository.updateById(userId, {
      avatar: avatarUrl,
    });

    logger.info({
      userId,
      message: 'Avatar updated',
    });

    return this.getProfile(userId);
  }

  async removeAvatar(userId: string): Promise<UserProfileData> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    await userRepository.updateById(userId, {
      avatar: null,
    });

    logger.info({
      userId,
      message: 'Avatar removed',
    });

    return this.getProfile(userId);
  }
}

export default new UserService();
