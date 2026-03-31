import hashService from '../../src/services/hash.service';

describe('HashService', () => {
  const testPassword = 'TestPassword123!';

  describe('hash', () => {
    it('should hash a password', async () => {
      const hash = await hashService.hash(testPassword);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(testPassword);
      expect(hash.startsWith('$2b$')).toBe(true);
    });

    it('should generate different hashes for same password', async () => {
      const hash1 = await hashService.hash(testPassword);
      const hash2 = await hashService.hash(testPassword);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const hash = await hashService.hash(testPassword);
      const isMatch = await hashService.compare(testPassword, hash);
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const hash = await hashService.hash(testPassword);
      const isMatch = await hashService.compare('WrongPassword', hash);
      expect(isMatch).toBe(false);
    });
  });
});
