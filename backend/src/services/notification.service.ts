import prisma from '../utils/database';
import logger from '../utils/logger';

export type NotificationType = 'EMAIL_VERIFIED' | 'PASSWORD_CHANGED' | 'LOGIN_ALERT' | 'SECURITY_ALERT' | 'ACCOUNT_UPDATE' | 'ROLE_CHANGED' | 'SYSTEM';

export interface NotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export class NotificationService {
  async create(notification: NotificationData) {
    const created = await prisma.notification.create({
      data: {
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        metadata: notification.data ?? {},
      },
    });
    logger.debug({ notificationId: created.id, message: 'Notification created' });
    return created;
  }

  async getUserNotifications(userId: string, page = 1, limit = 20, unreadOnly = false) {
    const where: Record<string, unknown> = { userId };
    if (unreadOnly) where.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return { notifications, total, unreadCount, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async markAsRead(userId: string, notificationId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async delete(userId: string, notificationId: string) {
    return prisma.notification.deleteMany({ where: { id: notificationId, userId } });
  }

  async deleteAll(userId: string) {
    return prisma.notification.deleteMany({ where: { userId } });
  }

  // Helper methods for common notifications
  async notifyPasswordChanged(userId: string) {
    return this.create({ userId, type: 'PASSWORD_CHANGED', title: 'Password Changed', message: 'Your password was changed successfully. If you did not make this change, contact support immediately.' });
  }

  async notifySecurityAlert(userId: string, message: string, data?: Record<string, unknown>) {
    return this.create({ userId, type: 'SECURITY_ALERT', title: 'Security Alert', message, data });
  }

  async notifyLoginFromNewDevice(userId: string, deviceInfo: string, ipAddress: string) {
    return this.create({ userId, type: 'LOGIN_ALERT', title: 'New Login Detected', message: `A new login was detected from ${deviceInfo} (IP: ${ipAddress}). If this wasn't you, secure your account.`, data: { deviceInfo, ipAddress } });
  }

  async notifyRoleChanged(userId: string, action: 'assigned' | 'removed', roleName: string) {
    return this.create({ userId, type: 'ROLE_CHANGED', title: 'Role Updated', message: `The role "${roleName}" has been ${action} ${action === 'assigned' ? 'to' : 'from'} your account.`, data: { roleName, action } });
  }
}

export default new NotificationService();
