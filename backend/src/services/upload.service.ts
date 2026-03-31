import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { BadRequestError } from '../utils/errors';
import logger from '../utils/logger';

interface UploadedFile {
  filename: string;
  filepath: string;
  mimetype: string;
  size: number;
  url: string;
}

interface UploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  directory?: string;
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const UPLOADS_DIR = 'uploads';

export class UploadService {
  private uploadsPath: string;

  constructor() {
    this.uploadsPath = path.join(process.cwd(), UPLOADS_DIR);
    this.ensureUploadsDirectory();
  }

  private async ensureUploadsDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.uploadsPath, { recursive: true });
      await fs.mkdir(path.join(this.uploadsPath, 'avatars'), { recursive: true });
      await fs.mkdir(path.join(this.uploadsPath, 'temp'), { recursive: true });
    } catch (error) {
      logger.error({ err: error }, 'Failed to create uploads directory');
    }
  }

  private generateFilename(originalName: string): string {
    const ext = path.extname(originalName).toLowerCase();
    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    return `${timestamp}-${randomName}${ext}`;
  }

  private validateFile(
    mimetype: string,
    size: number,
    options: UploadOptions
  ): void {
    const maxSize = options.maxSize || DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || DEFAULT_ALLOWED_TYPES;

    if (size > maxSize) {
      throw new BadRequestError(
        `File too large. Maximum size is ${maxSize / 1024 / 1024}MB`
      );
    }

    if (!allowedTypes.includes(mimetype)) {
      throw new BadRequestError(
        `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      );
    }
  }

  async uploadAvatar(
    buffer: Buffer,
    originalFilename: string,
    mimetype: string,
    userId: string
  ): Promise<UploadedFile> {
    // Validate
    this.validateFile(mimetype, buffer.length, {
      maxSize: 2 * 1024 * 1024, // 2MB for avatars
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });

    // Generate unique filename
    const filename = this.generateFilename(originalFilename);
    const directory = 'avatars';
    const filepath = path.join(this.uploadsPath, directory, filename);

    // Save file
    await fs.writeFile(filepath, buffer);

    // Generate URL (relative path for now, can be replaced with CDN URL)
    const url = `/${UPLOADS_DIR}/${directory}/${filename}`;

    logger.info({
      userId,
      message: 'Avatar uploaded',
      filename,
      size: buffer.length,
    });

    return {
      filename,
      filepath,
      mimetype,
      size: buffer.length,
      url,
    };
  }

  async deleteFile(filepath: string): Promise<void> {
    try {
      // Security: ensure file is within uploads directory
      const absolutePath = path.resolve(filepath);
      const uploadsAbsolute = path.resolve(this.uploadsPath);

      if (!absolutePath.startsWith(uploadsAbsolute)) {
        throw new BadRequestError('Invalid file path');
      }

      await fs.unlink(absolutePath);
      logger.info({ message: 'File deleted', filepath });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
      // File doesn't exist, that's fine
    }
  }

  async deleteAvatar(avatarUrl: string | null): Promise<void> {
    if (!avatarUrl) return;

    // Extract filepath from URL
    const filepath = path.join(process.cwd(), avatarUrl);
    await this.deleteFile(filepath);
  }

  // Get file info
  async getFileInfo(filepath: string): Promise<{ size: number; mtime: Date } | null> {
    try {
      const stats = await fs.stat(filepath);
      return {
        size: stats.size,
        mtime: stats.mtime,
      };
    } catch {
      return null;
    }
  }

  // Clean up old temp files (call periodically)
  async cleanupTempFiles(maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<number> {
    const tempDir = path.join(this.uploadsPath, 'temp');
    let cleaned = 0;

    try {
      const files = await fs.readdir(tempDir);
      const now = Date.now();

      for (const file of files) {
        const filepath = path.join(tempDir, file);
        const stats = await fs.stat(filepath);

        if (now - stats.mtimeMs > maxAgeMs) {
          await fs.unlink(filepath);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        logger.info({ message: 'Temp files cleaned', count: cleaned });
      }
    } catch (error) {
      logger.error({ err: error }, 'Failed to cleanup temp files');
    }

    return cleaned;
  }
}

export default new UploadService();
