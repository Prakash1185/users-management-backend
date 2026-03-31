import { FastifyRequest, FastifyReply } from 'fastify';
import uploadService from '../services/upload.service';
import userService from '../services/user.service';
import { successResponse } from '../utils/response';
import { BadRequestError } from '../utils/errors';

export class UploadController {
  async uploadAvatar(
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

    // Get the uploaded file using @fastify/multipart
    const data = await request.file();

    if (!data) {
      throw new BadRequestError('No file uploaded');
    }

    // Read file buffer
    const chunks: Buffer[] = [];
    for await (const chunk of data.file) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Check if file was truncated (size limit exceeded during stream)
    if (data.file.truncated) {
      throw new BadRequestError('File too large. Maximum size is 2MB');
    }

    // Upload avatar
    const uploadedFile = await uploadService.uploadAvatar(
      buffer,
      data.filename,
      data.mimetype,
      request.user.id
    );

    // Get current user to delete old avatar
    const currentProfile = await userService.getProfile(request.user.id);
    if (currentProfile.avatar) {
      await uploadService.deleteAvatar(currentProfile.avatar);
    }

    // Update user's avatar URL
    const updatedProfile = await userService.updateAvatar(
      request.user.id,
      uploadedFile.url
    );

    reply.send(
      successResponse('Avatar uploaded successfully', {
        avatar: uploadedFile.url,
        user: updatedProfile,
      })
    );
  }

  async removeAvatar(
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

    // Get current avatar to delete
    const currentProfile = await userService.getProfile(request.user.id);

    if (currentProfile.avatar) {
      await uploadService.deleteAvatar(currentProfile.avatar);
    }

    // Remove avatar from user profile
    const updatedProfile = await userService.removeAvatar(request.user.id);

    reply.send(successResponse('Avatar removed successfully', updatedProfile));
  }
}

export default new UploadController();
