import logger from '../utils/logger';
import config from '../config';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  async sendEmail(options: EmailOptions): Promise<void> {
    // TODO: Implement actual email sending with SendGrid/NodeMailer
    // For now, just log the email content
    logger.info({
      to: options.to,
      subject: options.subject,
      message: 'Email would be sent (email service not configured)',
    });

    // In production, implement with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send(options);

    // Or with NodeMailer:
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail(options);

    console.log('\n=== EMAIL WOULD BE SENT ===');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Content: ${options.text || options.html}`);
    console.log('============================\n');
  }

  async sendVerificationEmail(email: string, token: string, username: string): Promise<void> {
    const verificationUrl = `${config.nodeEnv === 'production' ? 'https://yourdomain.com' : 'http://localhost:5001'}/api/v1/auth/verify-email?token=${token}`;

    const subject = 'Verify Your Email Address';
    const text = `
Hi ${username},

Thank you for registering! Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.

Best regards,
User Management Team
    `;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background-color: #007bff; 
      color: white; 
      text-decoration: none; 
      border-radius: 4px; 
      margin: 20px 0;
    }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Verify Your Email Address</h2>
    <p>Hi ${username},</p>
    <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
    <a href="${verificationUrl}" class="button">Verify Email</a>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all;">${verificationUrl}</p>
    <p>This link will expire in 24 hours.</p>
    <p>If you didn't create an account, please ignore this email.</p>
    <div class="footer">
      <p>Best regards,<br>User Management Team</p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail({
      to: email,
      subject,
      text,
      html,
    });

    logger.info({
      email,
      message: 'Verification email sent',
      verificationUrl,
    });
  }

  async sendPasswordResetEmail(email: string, token: string, username: string): Promise<void> {
    const resetUrl = `${config.nodeEnv === 'production' ? 'https://yourdomain.com' : 'http://localhost:5001'}/reset-password?token=${token}`;

    const subject = 'Reset Your Password';
    const text = `
Hi ${username},

You requested to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.

Best regards,
User Management Team
    `;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background-color: #dc3545; 
      color: white; 
      text-decoration: none; 
      border-radius: 4px; 
      margin: 20px 0;
    }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Reset Your Password</h2>
    <p>Hi ${username},</p>
    <p>You requested to reset your password. Click the button below to create a new password:</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all;">${resetUrl}</p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request a password reset, please ignore this email.</p>
    <div class="footer">
      <p>Best regards,<br>User Management Team</p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail({
      to: email,
      subject,
      text,
      html,
    });

    logger.info({
      email,
      message: 'Password reset email sent',
    });
  }
}

export default new EmailService();
