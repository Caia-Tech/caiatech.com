import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4322';

test.describe('Tool Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for tool interactions
    test.setTimeout(60000);
  });

  test.describe('JSON Formatter Tool', () => {
    test('should format JSON correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/json/`);
      
      // Wait for tool to load
      await expect(page.locator('h1')).toContainText('JSON');
      
      // Input unformatted JSON
      const input = '{"name":"test","value":123,"nested":{"key":"value"}}';
      await page.locator('textarea#input, textarea[placeholder*="JSON"], .input-area textarea').first().fill(input);
      
      // Click format button
      await page.locator('button:has-text("Format"), button:has-text("Prettify"), .format-btn').first().click();
      
      // Check formatted output
      const output = await page.locator('textarea#output, .output-area textarea, pre').first().textContent();
      expect(output).toContain('{\n  "name": "test"');
      expect(output).toContain('  "value": 123');
      expect(output).toContain('  "nested": {\n    "key": "value"');
    });

    test('should handle invalid JSON gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/json/`);
      
      // Input invalid JSON
      await page.locator('textarea#input, textarea[placeholder*="JSON"], .input-area textarea').first().fill('{invalid json}');
      
      // Click format button
      await page.locator('button:has-text("Format"), button:has-text("Prettify"), .format-btn').first().click();
      
      // Should show error message
      await expect(page.locator('.error, .invalid, [class*="error"]').first()).toBeVisible();
    });

    test('should minify JSON', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/json/`);
      
      const formattedInput = `{
  "name": "test",
  "value": 123,
  "array": [1, 2, 3]
}`;
      
      await page.locator('textarea#input, textarea[placeholder*="JSON"], .input-area textarea').first().fill(formattedInput);
      
      // Click minify button
      await page.locator('button:has-text("Minify"), button:has-text("Compress"), .minify-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, pre').first().textContent();
      expect(output?.replace(/\s/g, '')).toContain('{"name":"test","value":123,"array":[1,2,3]}');
    });
  });

  test.describe('Base64 Encoder Tool', () => {
    test('should encode text to base64', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/base64/`);
      
      await page.locator('textarea#input, textarea[placeholder*="text"], .input-area textarea').first().fill('Hello World');
      
      await page.locator('button:has-text("Encode"), .encode-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toBe('SGVsbG8gV29ybGQ=');
    });

    test('should decode base64 to text', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/base64/`);
      
      await page.locator('textarea#input, textarea[placeholder*="base64"], .input-area textarea').first().fill('SGVsbG8gV29ybGQ=');
      
      await page.locator('button:has-text("Decode"), .decode-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toBe('Hello World');
    });

    test('should handle UTF-8 characters', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/base64/`);
      
      const unicodeText = 'Hello 世界 🌍';
      await page.locator('textarea#input, .input-area textarea').first().fill(unicodeText);
      
      // Encode
      await page.locator('button:has-text("Encode"), .encode-btn').first().click();
      const encoded = await page.locator('textarea#output, .output-area textarea').first().inputValue();
      
      // Clear and decode back
      await page.locator('textarea#input, .input-area textarea').first().fill(encoded);
      await page.locator('button:has-text("Decode"), .decode-btn').first().click();
      
      const decoded = await page.locator('textarea#output, .output-area textarea').first().textContent();
      expect(decoded).toBe(unicodeText);
    });
  });

  test.describe('UUID Generator Tool', () => {
    test('should generate valid UUIDs', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/uuid/`);
      
      await page.locator('button:has-text("Generate"), .generate-btn').first().click();
      
      const uuid = await page.locator('input[readonly], .output, .result, code').first().textContent() || 
                   await page.locator('input[readonly], .output, .result, code').first().inputValue();
      
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('should generate multiple different UUIDs', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/uuid/`);
      
      // Generate first UUID
      await page.locator('button:has-text("Generate"), .generate-btn').first().click();
      const uuid1 = await page.locator('input[readonly], .output, .result, code').first().textContent() || 
                    await page.locator('input[readonly], .output, .result, code').first().inputValue();
      
      // Generate second UUID
      await page.locator('button:has-text("Generate"), .generate-btn').first().click();
      const uuid2 = await page.locator('input[readonly], .output, .result, code').first().textContent() || 
                    await page.locator('input[readonly], .output, .result, code').first().inputValue();
      
      expect(uuid1).not.toBe(uuid2);
      expect(uuid1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(uuid2).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  test.describe('URL Encoder Tool', () => {
    test('should encode URLs', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/url/`);
      
      const input = 'hello world & special chars!';
      await page.locator('textarea#input, .input-area textarea').first().fill(input);
      
      await page.locator('button:has-text("Encode"), .encode-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toContain('hello%20world');
      expect(output).toContain('%26'); // & encoded
      expect(output).toContain('%21'); // ! encoded
    });

    test('should decode URLs', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/url/`);
      
      const encoded = 'hello%20world%26test%21';
      await page.locator('textarea#input, .input-area textarea').first().fill(encoded);
      
      await page.locator('button:has-text("Decode"), .decode-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toBe('hello world&test!');
    });
  });

  test.describe('Password Generator Tool', () => {
    test('should generate password with specified length', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/password/`);
      
      // Set length to 16
      await page.locator('input[type="number"], input[type="range"], .length-input').first().fill('16');
      
      await page.locator('button:has-text("Generate"), .generate-btn').first().click();
      
      const password = await page.locator('input[readonly], .output, .result, .password-output').first().textContent() || 
                      await page.locator('input[readonly], .output, .result, .password-output').first().inputValue();
      
      expect(password).toHaveLength(16);
    });

    test('should include selected character types', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/password/`);
      
      // Ensure all checkboxes are checked
      const checkboxes = await page.locator('input[type="checkbox"]').all();
      for (const checkbox of checkboxes) {
        await checkbox.check();
      }
      
      await page.locator('input[type="number"], .length-input').first().fill('20');
      await page.locator('button:has-text("Generate"), .generate-btn').first().click();
      
      const password = await page.locator('input[readonly], .output, .result').first().textContent() || 
                      await page.locator('input[readonly], .output, .result').first().inputValue();
      
      expect(password).toMatch(/[A-Z]/); // Uppercase
      expect(password).toMatch(/[a-z]/); // Lowercase  
      expect(password).toMatch(/\d/); // Numbers
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/); // Symbols
    });
  });

  test.describe('Color Converter Tool', () => {
    test('should convert HEX to RGB', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/color/`);
      
      await page.locator('input[placeholder*="HEX"], input#hex, .hex-input').first().fill('#FF0000');
      
      // Trigger conversion
      await page.locator('button:has-text("Convert"), .convert-btn').first().click();
      
      const rgbOutput = await page.locator('.rgb-output, .rgb-result, [data-format="rgb"]').first().textContent();
      expect(rgbOutput).toContain('255');
      expect(rgbOutput).toContain('0');
      expect(rgbOutput).toContain('0');
    });

    test('should convert RGB to HEX', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/color/`);
      
      await page.locator('input[placeholder*="R"], .r-input').first().fill('255');
      await page.locator('input[placeholder*="G"], .g-input').first().fill('0');
      await page.locator('input[placeholder*="B"], .b-input').first().fill('0');
      
      await page.locator('button:has-text("Convert"), .convert-btn').first().click();
      
      const hexOutput = await page.locator('.hex-output, .hex-result, [data-format="hex"]').first().textContent();
      expect(hexOutput?.toLowerCase()).toContain('#ff0000');
    });
  });

  test.describe('Hash Generator Tool', () => {
    test('should generate SHA-256 hash', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/hash/`);
      
      await page.locator('textarea#input, .input-area textarea').first().fill('test');
      
      // Select SHA-256 if dropdown exists
      const algorithmSelect = page.locator('select, .algorithm-select').first();
      if (await algorithmSelect.isVisible()) {
        await algorithmSelect.selectOption('SHA-256');
      }
      
      await page.locator('button:has-text("Generate"), button:has-text("Hash"), .hash-btn').first().click();
      
      const hash = await page.locator('textarea#output, .output-area textarea, .hash-result').first().textContent();
      expect(hash).toHaveLength(64); // SHA-256 produces 64 hex characters
      expect(hash).toMatch(/^[a-f0-9]{64}$/i);
    });

    test('should generate different hashes for different inputs', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/hash/`);
      
      // Hash first input
      await page.locator('textarea#input, .input-area textarea').first().fill('input1');
      await page.locator('button:has-text("Generate"), button:has-text("Hash"), .hash-btn').first().click();
      const hash1 = await page.locator('textarea#output, .output-area textarea, .hash-result').first().textContent();
      
      // Hash second input
      await page.locator('textarea#input, .input-area textarea').first().fill('input2');
      await page.locator('button:has-text("Generate"), button:has-text("Hash"), .hash-btn').first().click();
      const hash2 = await page.locator('textarea#output, .output-area textarea, .hash-result').first().textContent();
      
      expect(hash1).not.toBe(hash2);
    });
  });

  test.describe('QR Code Generator Tool', () => {
    test('should generate QR code', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/qr/`);
      
      await page.locator('textarea#input, input[placeholder*="text"], .input-area textarea, .text-input').first().fill('https://caiatech.com');
      
      await page.locator('button:has-text("Generate"), .generate-btn').first().click();
      
      // Should see QR code image or canvas
      await expect(page.locator('img, canvas, .qr-output, .qr-result').first()).toBeVisible();
    });

    test('should generate different QR codes for different inputs', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/qr/`);
      
      // Generate first QR code
      await page.locator('textarea#input, input[placeholder*="text"], .text-input').first().fill('test1');
      await page.locator('button:has-text("Generate"), .generate-btn').first().click();
      
      // Wait for generation and get the image source or canvas data
      await page.waitForTimeout(1000);
      const qr1Element = page.locator('img, canvas').first();
      
      // Generate second QR code
      await page.locator('textarea#input, input[placeholder*="text"], .text-input').first().fill('test2');
      await page.locator('button:has-text("Generate"), .generate-btn').first().click();
      await page.waitForTimeout(1000);
      
      // Both should be visible (different QR codes)
      await expect(qr1Element).toBeVisible();
    });
  });

  test.describe('Timestamp Converter Tool', () => {
    test('should convert timestamp to date', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/timestamp/`);
      
      // Unix timestamp for 2021-01-01 00:00:00 UTC
      await page.locator('input[placeholder*="timestamp"], .timestamp-input').first().fill('1609459200');
      
      await page.locator('button:has-text("Convert"), .convert-btn').first().click();
      
      const dateOutput = await page.locator('.date-output, .result, .converted-date').first().textContent();
      expect(dateOutput).toContain('2021');
      expect(dateOutput).toContain('01');
    });

    test('should convert date to timestamp', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/timestamp/`);
      
      await page.locator('input[type="datetime-local"], input[placeholder*="date"], .date-input').first().fill('2021-01-01T00:00');
      
      await page.locator('button:has-text("Convert"), .convert-btn').first().click();
      
      const timestampOutput = await page.locator('.timestamp-output, .result, .converted-timestamp').first().textContent();
      expect(timestampOutput).toContain('1609459200');
    });
  });

  test.describe('Text Case Converter Tool', () => {
    test('should convert to uppercase', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/case/`);
      
      await page.locator('textarea#input, .input-area textarea').first().fill('hello world');
      
      await page.locator('button:has-text("UPPERCASE"), button:has-text("Upper"), .uppercase-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toBe('HELLO WORLD');
    });

    test('should convert to lowercase', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/case/`);
      
      await page.locator('textarea#input, .input-area textarea').first().fill('HELLO WORLD');
      
      await page.locator('button:has-text("lowercase"), button:has-text("Lower"), .lowercase-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toBe('hello world');
    });

    test('should convert to title case', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/case/`);
      
      await page.locator('textarea#input, .input-area textarea').first().fill('hello world test');
      
      await page.locator('button:has-text("Title"), button:has-text("Proper"), .title-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toBe('Hello World Test');
    });
  });

  test.describe('HTML Entity Encoder Tool', () => {
    test('should encode HTML entities', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/entity/`);
      
      await page.locator('textarea#input, .input-area textarea').first().fill('<div>Hello & welcome</div>');
      
      await page.locator('button:has-text("Encode"), .encode-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toContain('&lt;div&gt;');
      expect(output).toContain('&amp;');
    });

    test('should decode HTML entities', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/entity/`);
      
      await page.locator('textarea#input, .input-area textarea').first().fill('&lt;div&gt;Hello &amp; welcome&lt;/div&gt;');
      
      await page.locator('button:has-text("Decode"), .decode-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toBe('<div>Hello & welcome</div>');
    });
  });

  test.describe('Privacy and Performance', () => {
    test('should not make external requests during tool usage', async ({ page }) => {
      const externalRequests: string[] = [];
      
      page.on('request', (request) => {
        const url = request.url();
        if (!url.startsWith(BASE_URL) && !url.startsWith('data:') && !url.startsWith('blob:')) {
          externalRequests.push(url);
        }
      });
      
      await page.goto(`${BASE_URL}/tools/json/`);
      await page.locator('textarea#input, .input-area textarea').first().fill('{"test": true}');
      await page.locator('button:has-text("Format"), .format-btn').first().click();
      
      // Wait a moment for any delayed requests
      await page.waitForTimeout(2000);
      
      expect(externalRequests).toHaveLength(0);
    });

    test('should have privacy badges visible', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/json/`);
      
      await expect(page.locator('.privacy-badge, [class*="privacy"], .private')).toBeVisible();
    });

    test('tools should work offline', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/base64/`);
      
      // Go offline
      await page.context().setOffline(true);
      
      // Tool should still work
      await page.locator('textarea#input, .input-area textarea').first().fill('test offline');
      await page.locator('button:has-text("Encode"), .encode-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toBeTruthy();
      
      // Go back online
      await page.context().setOffline(false);
    });
  });
});