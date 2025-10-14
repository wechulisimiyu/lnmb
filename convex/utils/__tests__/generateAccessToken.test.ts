import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// stub env
const ORIGINAL_ENV = process.env;

describe('generateAccessToken', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    vi.restoreAllMocks();
  });

  it('uses JENGA_AUTH_URL when provided and returns accessToken', async () => {
    process.env.JENGA_AUTH_URL = 'https://example.test/auth';
    process.env.JENGA_MERCHANT_CODE = 'mc';
    process.env.JENGA_CONSUMER_SECRET = 'secret';
    process.env.JENGA_API_KEY = 'apikey';

    const mockResponse = { data: { accessToken: 'tok_123' } };
    vi.spyOn(axios, 'post').mockResolvedValue(mockResponse as any);

    const { default: authToken, getAuthUrl } = await import('../generateAccessToken');

    expect(getAuthUrl()).toBe('https://example.test/auth');

    const token = await authToken();
    expect(token).toBe('tok_123');

    expect(axios.post).toHaveBeenCalledWith(
      'https://example.test/auth',
      {
        merchantCode: 'mc',
        consumerSecret: 'secret',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': 'apikey',
        },
      },
    );
  });

  it('throws if required env vars are missing', async () => {
    delete process.env.JENGA_MERCHANT_CODE;
    delete process.env.JENGA_CONSUMER_SECRET;
    delete process.env.JENGA_API_KEY;

    const { default: authToken } = await import('../generateAccessToken');

    await expect(authToken()).rejects.toThrow(/Missing JENGA_/);
  });
});
