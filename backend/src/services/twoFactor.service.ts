import { TOTP, generateSecret } from 'otplib';
import QRCode from 'qrcode';
import crypto from 'crypto';
import twoFactorRepository from '../repositories/twoFactor.repository';
import hashService from './hash.service';
import prisma from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

const totpInstance = new TOTP();

export interface TwoFactorSetupResult {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export class TwoFactorService {
  private generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  async setup(userId: string, email: string): Promise<TwoFactorSetupResult> {
    const existing = await twoFactorRepository.findByUserId(userId);
    if (existing?.isEnabled) {
      throw new BadRequestError('Two-factor authentication is already enabled');
    }

    const secret = await generateSecret();
    const otpauth = `otpauth://totp/UserManagement:${email}?secret=${secret}&issuer=UserManagement`;
    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    const backupCodes = this.generateBackupCodes();
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => hashService.hash(code))
    );

    if (existing) {
      await prisma.twoFactorAuth.update({
        where: { userId },
        data: { secret, backupCodes: hashedBackupCodes },
      });
    } else {
      await prisma.twoFactorAuth.create({
        data: { userId, secret, isEnabled: false, backupCodes: hashedBackupCodes },
      });
    }

    logger.info({ userId, message: '2FA setup initiated' });
    return { secret, qrCodeUrl, backupCodes };
  }

  async verify(userId: string, token: string): Promise<boolean> {
    const twoFactor = await twoFactorRepository.findByUserId(userId);
    if (!twoFactor) throw new NotFoundError('Two-factor authentication not set up');

    const result = await totpInstance.verify(token, { secret: twoFactor.secret });
    const isValid = result.valid;
    if (isValid) await twoFactorRepository.updateLastUsed(userId);
    return isValid;
  }

  async enable(userId: string, token: string): Promise<{ message: string }> {
    const twoFactor = await twoFactorRepository.findByUserId(userId);
    if (!twoFactor) throw new NotFoundError('Please set up 2FA first');
    if (twoFactor.isEnabled) throw new BadRequestError('2FA is already enabled');

    const result = await totpInstance.verify(token, { secret: twoFactor.secret });
    if (!result.valid) throw new BadRequestError('Invalid verification code');

    await prisma.twoFactorAuth.update({
      where: { userId },
      data: { isEnabled: true, enabledAt: new Date() },
    });

    await prisma.auditLog.create({
      data: { userId, action: '2FA_ENABLED', resource: 'user', resourceId: userId },
    });

    logger.info({ userId, message: '2FA enabled' });
    return { message: 'Two-factor authentication enabled successfully' };
  }

  async disable(userId: string, token: string): Promise<{ message: string }> {
    const twoFactor = await twoFactorRepository.findByUserId(userId);
    if (!twoFactor || !twoFactor.isEnabled) throw new BadRequestError('2FA is not enabled');

    const result = await totpInstance.verify(token, { secret: twoFactor.secret });
    if (!result.valid) throw new BadRequestError('Invalid verification code');

    await twoFactorRepository.disable(userId);

    await prisma.auditLog.create({
      data: { userId, action: '2FA_DISABLED', resource: 'user', resourceId: userId },
    });

    logger.info({ userId, message: '2FA disabled' });
    return { message: 'Two-factor authentication disabled' };
  }

  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const twoFactor = await twoFactorRepository.findByUserId(userId);
    if (!twoFactor || !twoFactor.isEnabled) return false;

    const backupCodes = twoFactor.backupCodes as string[];
    
    for (let i = 0; i < backupCodes.length; i++) {
      const isMatch = await hashService.compare(code.toUpperCase(), backupCodes[i]);
      if (isMatch) {
        backupCodes.splice(i, 1);
        await twoFactorRepository.updateBackupCodes(userId, backupCodes);
        logger.info({ userId, message: 'Backup code used' });
        return true;
      }
    }
    return false;
  }

  async regenerateBackupCodes(userId: string, token: string): Promise<string[]> {
    const twoFactor = await twoFactorRepository.findByUserId(userId);
    if (!twoFactor || !twoFactor.isEnabled) throw new BadRequestError('2FA is not enabled');

    const result = await totpInstance.verify(token, { secret: twoFactor.secret });
    if (!result.valid) throw new BadRequestError('Invalid verification code');

    const backupCodes = this.generateBackupCodes();
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => hashService.hash(code))
    );

    await twoFactorRepository.updateBackupCodes(userId, hashedBackupCodes);
    logger.info({ userId, message: 'Backup codes regenerated' });
    return backupCodes;
  }

  async isEnabled(userId: string): Promise<boolean> {
    const twoFactor = await twoFactorRepository.findByUserId(userId);
    return twoFactor?.isEnabled ?? false;
  }
}

export default new TwoFactorService();
