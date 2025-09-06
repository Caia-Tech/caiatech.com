import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Setup DOM environment
const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = window.document;
global.window = window as any;

describe('Tool Functions', () => {
  describe('JSON Formatter Functions', () => {
    const formatJSON = (input: string): { formatted: string; isValid: boolean; error?: string } => {
      try {
        const parsed = JSON.parse(input);
        return {
          formatted: JSON.stringify(parsed, null, 2),
          isValid: true
        };
      } catch (error) {
        return {
          formatted: input,
          isValid: false,
          error: error instanceof Error ? error.message : 'Invalid JSON'
        };
      }
    };

    const minifyJSON = (input: string): { minified: string; isValid: boolean; error?: string } => {
      try {
        const parsed = JSON.parse(input);
        return {
          minified: JSON.stringify(parsed),
          isValid: true
        };
      } catch (error) {
        return {
          minified: input,
          isValid: false,
          error: error instanceof Error ? error.message : 'Invalid JSON'
        };
      }
    };

    it('should format valid JSON correctly', () => {
      const input = '{"name":"test","value":123}';
      const result = formatJSON(input);
      
      expect(result.isValid).toBe(true);
      expect(result.formatted).toContain('{\n  "name": "test",\n  "value": 123\n}');
    });

    it('should handle arrays correctly', () => {
      const input = '[1,2,3,{"key":"value"}]';
      const result = formatJSON(input);
      
      expect(result.isValid).toBe(true);
      expect(result.formatted).toContain('[\n  1,\n  2,\n  3,\n  {\n    "key": "value"\n  }\n]');
    });

    it('should detect and handle invalid JSON', () => {
      const input = '{invalid json}';
      const result = formatJSON(input);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should minify JSON correctly', () => {
      const input = '{\n  "name": "test",\n  "value": 123\n}';
      const result = minifyJSON(input);
      
      expect(result.isValid).toBe(true);
      expect(result.minified).toBe('{"name":"test","value":123}');
    });
  });

  describe('Base64 Encoder Functions', () => {
    const encodeBase64 = (input: string): string => {
      try {
        return btoa(unescape(encodeURIComponent(input)));
      } catch (error) {
        throw new Error('Failed to encode to Base64');
      }
    };

    const decodeBase64 = (input: string): string => {
      try {
        return decodeURIComponent(escape(atob(input)));
      } catch (error) {
        throw new Error('Invalid Base64 string');
      }
    };

    it('should encode text to base64', () => {
      expect(encodeBase64('Hello World')).toBe('SGVsbG8gV29ybGQ=');
      expect(encodeBase64('test')).toBe('dGVzdA==');
      expect(encodeBase64('')).toBe('');
    });

    it('should decode base64 to text', () => {
      expect(decodeBase64('SGVsbG8gV29ybGQ=')).toBe('Hello World');
      expect(decodeBase64('dGVzdA==')).toBe('test');
      expect(decodeBase64('')).toBe('');
    });

    it('should handle UTF-8 characters', () => {
      const text = 'Hello 世界 🌍';
      const encoded = encodeBase64(text);
      const decoded = decodeBase64(encoded);
      expect(decoded).toBe(text);
    });

    it('should throw error for invalid base64', () => {
      expect(() => decodeBase64('invalid base64!')).toThrow('Invalid Base64 string');
    });
  });

  describe('URL Encoder Functions', () => {
    const encodeURL = (input: string): string => {
      return encodeURIComponent(input);
    };

    const decodeURL = (input: string): string => {
      try {
        return decodeURIComponent(input);
      } catch (error) {
        throw new Error('Invalid URL encoding');
      }
    };

    it('should encode special characters', () => {
      expect(encodeURL('hello world')).toBe('hello%20world');
      expect(encodeURL('test@example.com')).toBe('test%40example.com');
      expect(encodeURL('100% complete')).toBe('100%25%20complete');
    });

    it('should decode URL-encoded strings', () => {
      expect(decodeURL('hello%20world')).toBe('hello world');
      expect(decodeURL('test%40example.com')).toBe('test@example.com');
      expect(decodeURL('100%25%20complete')).toBe('100% complete');
    });

    it('should handle complex URLs', () => {
      const url = 'https://example.com/search?q=hello world&category=test';
      const encoded = encodeURL(url);
      const decoded = decodeURL(encoded);
      expect(decoded).toBe(url);
    });
  });

  describe('Hash Generator Functions', () => {
    // Mock crypto API for testing
    beforeEach(() => {
      global.crypto = {
        subtle: {
          digest: vi.fn().mockImplementation((algorithm, data) => {
            // Simple mock implementation that produces different hashes for different inputs
            const text = new TextDecoder().decode(data);
            const hashBuffer = new ArrayBuffer(algorithm === 'SHA-256' ? 32 : 16);
            const hashArray = new Uint8Array(hashBuffer);
            
            // Generate a simple hash based on the text content
            let hash = 0;
            for (let i = 0; i < text.length; i++) {
              hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
            }
            
            // Fill the hash buffer with values based on the hash
            for (let i = 0; i < hashArray.length; i++) {
              hashArray[i] = (hash + i) & 0xff;
            }
            
            return Promise.resolve(hashBuffer);
          })
        }
      } as any;
    });

    const generateHash = async (input: string, algorithm: string): Promise<string> => {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    it('should generate SHA-256 hash', async () => {
      const hash = await generateHash('test', 'SHA-256');
      expect(hash).toHaveLength(64); // SHA-256 produces 64 hex characters
    });

    it('should generate different hashes for different inputs', async () => {
      const hash1 = await generateHash('test1', 'SHA-256');
      const hash2 = await generateHash('test2', 'SHA-256');
      expect(hash1).not.toBe(hash2);
    });

    it('should generate consistent hashes for same input', async () => {
      const hash1 = await generateHash('test', 'SHA-256');
      const hash2 = await generateHash('test', 'SHA-256');
      expect(hash1).toBe(hash2);
    });
  });

  describe('UUID Generator Functions', () => {
    // Mock crypto.randomUUID
    beforeEach(() => {
      global.crypto = {
        randomUUID: vi.fn(() => '123e4567-e89b-12d3-a456-426614174000')
      } as any;
    });

    const generateUUID = (): string => {
      if (crypto.randomUUID) {
        return crypto.randomUUID();
      }
      // Fallback implementation
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    it('should generate valid UUID format', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should generate UUIDs with version 4 format when using fallback', () => {
      global.crypto = {} as any; // Remove randomUUID to test fallback
      const uuid = generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('Password Generator Functions', () => {
    const generatePassword = (options: {
      length: number;
      includeUppercase: boolean;
      includeLowercase: boolean;
      includeNumbers: boolean;
      includeSymbols: boolean;
    }): string => {
      let charset = '';
      if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (options.includeNumbers) charset += '0123456789';
      if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (charset === '') return '';

      let password = '';
      for (let i = 0; i < options.length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return password;
    };

    const checkPasswordStrength = (password: string): {
      score: number;
      feedback: string[];
    } => {
      let score = 0;
      const feedback: string[] = [];

      if (password.length >= 8) score++;
      else feedback.push('Password should be at least 8 characters long');

      if (/[A-Z]/.test(password)) score++;
      else feedback.push('Include uppercase letters');

      if (/[a-z]/.test(password)) score++;
      else feedback.push('Include lowercase letters');

      if (/\d/.test(password)) score++;
      else feedback.push('Include numbers');

      if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score++;
      else feedback.push('Include special characters');

      return { score, feedback };
    };

    it('should generate password with correct length', () => {
      const options = {
        length: 12,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false
      };
      const password = generatePassword(options);
      expect(password).toHaveLength(12);
    });

    it('should include requested character types', () => {
      const options = {
        length: 20,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true
      };
      const password = generatePassword(options);
      
      expect(password).toMatch(/[A-Z]/); // Has uppercase
      expect(password).toMatch(/[a-z]/); // Has lowercase
      expect(password).toMatch(/\d/); // Has numbers
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/); // Has symbols
    });

    it('should return empty string if no character types selected', () => {
      const options = {
        length: 10,
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: false
      };
      const password = generatePassword(options);
      expect(password).toBe('');
    });

    it('should correctly assess password strength', () => {
      const weakPassword = checkPasswordStrength('123');
      expect(weakPassword.score).toBeLessThan(3);
      expect(weakPassword.feedback.length).toBeGreaterThan(0);

      const strongPassword = checkPasswordStrength('MyStr0ng!P@ssw0rd');
      expect(strongPassword.score).toBe(5);
      expect(strongPassword.feedback).toHaveLength(0);
    });
  });

  describe('Color Converter Functions', () => {
    const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
      const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      return match ? {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16)
      } : null;
    };

    const rgbToHex = (r: number, g: number, b: number): string => {
      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    };

    const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const diff = max - min;
      const sum = max + min;
      const l = sum / 2;

      let h = 0;
      let s = 0;

      if (diff !== 0) {
        s = l > 0.5 ? diff / (2 - sum) : diff / sum;

        switch (max) {
          case r:
            h = ((g - b) / diff) + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / diff + 2;
            break;
          case b:
            h = (r - g) / diff + 4;
            break;
        }
        h /= 6;
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    };

    it('should convert hex to RGB', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('should convert RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    });

    it('should handle invalid hex colors', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('#GGG')).toBeNull();
    });

    it('should convert RGB to HSL', () => {
      const red = rgbToHsl(255, 0, 0);
      expect(red.h).toBe(0);
      expect(red.s).toBe(100);
      expect(red.l).toBe(50);

      const white = rgbToHsl(255, 255, 255);
      expect(white.h).toBe(0);
      expect(white.s).toBe(0);
      expect(white.l).toBe(100);
    });
  });

  describe('Timestamp Converter Functions', () => {
    const timestampToDate = (timestamp: number): string => {
      return new Date(timestamp * 1000).toISOString();
    };

    const dateToTimestamp = (dateString: string): number => {
      return Math.floor(new Date(dateString).getTime() / 1000);
    };

    const getCurrentTimestamp = (): number => {
      return Math.floor(Date.now() / 1000);
    };

    it('should convert timestamp to date', () => {
      const timestamp = 1609459200; // 2021-01-01 00:00:00 UTC
      const date = timestampToDate(timestamp);
      expect(date).toBe('2021-01-01T00:00:00.000Z');
    });

    it('should convert date to timestamp', () => {
      const dateString = '2021-01-01T00:00:00.000Z';
      const timestamp = dateToTimestamp(dateString);
      expect(timestamp).toBe(1609459200);
    });

    it('should get current timestamp', () => {
      const now = getCurrentTimestamp();
      const currentTime = Math.floor(Date.now() / 1000);
      expect(Math.abs(now - currentTime)).toBeLessThanOrEqual(1); // Allow 1 second difference
    });

    it('should handle round trip conversion', () => {
      const originalDate = '2023-06-15T10:30:00.000Z';
      const timestamp = dateToTimestamp(originalDate);
      const convertedDate = timestampToDate(timestamp);
      expect(convertedDate).toBe(originalDate);
    });
  });
});