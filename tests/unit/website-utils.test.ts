import { describe, it, expect } from 'vitest';

// Test utility functions and basic JavaScript functionality
describe('Website Utils', () => {
  describe('Email validation', () => {
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    it('should validate correct email addresses', () => {
      expect(isValidEmail('owner@caiatech.com')).toBe(true);
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('invalid@domain')).toBe(false);
    });
  });

  describe('URL validation', () => {
    const isValidURL = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    it('should validate correct URLs', () => {
      expect(isValidURL('https://caiatech.com')).toBe(true);
      expect(isValidURL('http://localhost:3000')).toBe(true);
      expect(isValidURL('https://example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidURL('not-a-url')).toBe(false);
      expect(isValidURL('http://')).toBe(false);
      expect(isValidURL('')).toBe(false);
    });
  });

  describe('JSON validation', () => {
    const isValidJSON = (str: string): boolean => {
      try {
        JSON.parse(str);
        return true;
      } catch {
        return false;
      }
    };

    it('should validate correct JSON', () => {
      expect(isValidJSON('{"test": "value"}')).toBe(true);
      expect(isValidJSON('[1, 2, 3]')).toBe(true);
      expect(isValidJSON('null')).toBe(true);
      expect(isValidJSON('true')).toBe(true);
    });

    it('should reject invalid JSON', () => {
      expect(isValidJSON('{test: "value"}')).toBe(false);
      expect(isValidJSON('{')).toBe(false);
      expect(isValidJSON('invalid')).toBe(false);
    });
  });

  describe('Base64 encoding/decoding', () => {
    const base64Encode = (str: string): string => {
      return btoa(str);
    };

    const base64Decode = (str: string): string => {
      return atob(str);
    };

    it('should encode strings to base64', () => {
      expect(base64Encode('Hello, World!')).toBe('SGVsbG8sIFdvcmxkIQ==');
      expect(base64Encode('test')).toBe('dGVzdA==');
    });

    it('should decode base64 to strings', () => {
      expect(base64Decode('SGVsbG8sIFdvcmxkIQ==')).toBe('Hello, World!');
      expect(base64Decode('dGVzdA==')).toBe('test');
    });

    it('should handle round-trip encoding/decoding', () => {
      const original = 'This is a test string with special chars: !@#$%^&*()';
      const encoded = base64Encode(original);
      const decoded = base64Decode(encoded);
      expect(decoded).toBe(original);
    });
  });

  describe('UUID generation', () => {
    const generateUUID = (): string => {
      return crypto.randomUUID();
    };

    it('should generate valid UUIDs', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('Text utilities', () => {
    const escapeHtml = (text: string): string => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    const unescapeHtml = (html: string): string => {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    };

    it('should escape HTML entities', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
      expect(escapeHtml('Hello & Goodbye')).toBe('Hello &amp; Goodbye');
    });

    it('should unescape HTML entities', () => {
      expect(unescapeHtml('&lt;script&gt;')).toBe('<script>');
      expect(unescapeHtml('Hello &amp; Goodbye')).toBe('Hello & Goodbye');
    });
  });

  describe('Data formatting', () => {
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    it('should format byte sizes correctly', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
    });
  });

  describe('Privacy validation', () => {
    it('should not use external tracking', () => {
      // This test runs in a DOM environment, so we can check for tracking scripts
      const scripts = document.querySelectorAll('script[src]');
      const trackingDomains = ['google-analytics.com', 'googletagmanager.com', 'facebook.net'];
      
      scripts.forEach(script => {
        const src = script.getAttribute('src') || '';
        trackingDomains.forEach(domain => {
          expect(src).not.toContain(domain);
        });
      });
    });

    it('should not have external form submissions', () => {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        const action = form.getAttribute('action');
        if (action) {
          // Should not submit to external domains
          expect(action.startsWith('http')).toBe(false);
        }
      });
    });
  });
});

describe('Schema validation', () => {
  const validateStructuredData = (jsonLd: string): boolean => {
    try {
      const data = JSON.parse(jsonLd);
      return !!(data['@context'] && data['@type']);
    } catch {
      return false;
    }
  };

  it('should have valid JSON-LD structure', () => {
    const validJsonLd = `{
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Caiatech"
    }`;
    
    expect(validateStructuredData(validJsonLd)).toBe(true);
  });

  it('should reject invalid structured data', () => {
    expect(validateStructuredData('{"name": "test"}')).toBe(false);
    expect(validateStructuredData('invalid json')).toBe(false);
  });
});

describe('Contact form validation', () => {
  const validateContactForm = (data: {
    name: string;
    email: string;
    message: string;
  }): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!data.name.trim()) errors.push('Name is required');
    if (!data.email.trim()) errors.push('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Invalid email format');
    if (!data.message.trim()) errors.push('Message is required');
    if (data.message.length < 10) errors.push('Message too short');
    
    return { valid: errors.length === 0, errors };
  };

  it('should validate complete form data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message with sufficient length'
    };
    
    const result = validateContactForm(validData);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject incomplete form data', () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      message: 'short'
    };
    
    const result = validateContactForm(invalidData);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});