import jwtService from '../../src/services/jwt.service';

// Mock config
jest.mock('../../src/config', () => ({
  default: {
    jwt: { accessSecret: 'test-access-secret-key-for-testing', refreshSecret: 'test-refresh-secret-key-for-testing', accessExpiry: '15m', refreshExpiry: '7d' },
  },
}));

describe('JwtService', () => {
  const testPayload = { userId: 'user-123', email: 'test@example.com', roles: ['user'], permissions: ['USER_READ'] };

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = jwtService.generateAccessToken(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = jwtService.generateRefreshToken(testPayload.userId);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and decode a valid access token', () => {
      const token = jwtService.generateAccessToken(testPayload);
      const decoded = jwtService.verifyAccessToken(token);
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
    });

    it('should throw for invalid token', () => {
      expect(() => jwtService.verifyAccessToken('invalid-token')).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and decode a valid refresh token', () => {
      const token = jwtService.generateRefreshToken(testPayload.userId);
      const decoded = jwtService.verifyRefreshToken(token);
      expect(decoded.userId).toBe(testPayload.userId);
    });
  });
});
