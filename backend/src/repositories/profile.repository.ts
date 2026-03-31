import prisma from '../config/database';
import { UserProfile } from '@prisma/client';

interface ProfileUpdateInput {
  bio?: string | null;
  phone?: string | null;
  dateOfBirth?: Date | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  timezone?: string | null;
  language?: string;
}

export class ProfileRepository {
  async findByUserId(userId: string): Promise<UserProfile | null> {
    return await prisma.userProfile.findUnique({
      where: { userId },
    });
  }

  async update(userId: string, data: ProfileUpdateInput): Promise<UserProfile> {
    return await prisma.userProfile.update({
      where: { userId },
      data,
    });
  }

  async upsert(userId: string, data: ProfileUpdateInput): Promise<UserProfile> {
    return await prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        bio: data.bio ?? null,
        phone: data.phone ?? null,
        dateOfBirth: data.dateOfBirth ?? null,
        address: data.address ?? null,
        city: data.city ?? null,
        country: data.country ?? null,
        timezone: data.timezone ?? null,
        language: data.language ?? 'en',
      },
    });
  }

  async updatePreferences(userId: string, preferences: Record<string, unknown>): Promise<UserProfile> {
    return await prisma.userProfile.update({
      where: { userId },
      data: {
        preferences: JSON.parse(JSON.stringify(preferences)),
      },
    });
  }
}

export default new ProfileRepository();
