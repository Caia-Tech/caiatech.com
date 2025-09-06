import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4322';

test.describe('Advanced Tool Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
  });

  test.describe('Regular Expression Tester', () => {
    test('should test regex patterns', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/regex/`);
      
      // Input regex pattern
      await page.locator('input[placeholder*="regex"], input[placeholder*="pattern"], .pattern-input').first().fill('\\d{3}-\\d{3}-\\d{4}');
      
      // Input test text
      await page.locator('textarea[placeholder*="text"], .test-text, .input-text').first().fill('Call me at 555-123-4567 or email test@example.com');
      
      // Test the regex
      await page.locator('button:has-text("Test"), button:has-text("Match"), .test-btn').first().click();
      
      // Should highlight or show matches
      await expect(page.locator('.match, .highlight, .result').first()).toBeVisible();
      
      const result = await page.locator('.matches, .result, .output').first().textContent();
      expect(result).toContain('555-123-4567');
    });

    test('should validate regex syntax', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/regex/`);
      
      // Invalid regex
      await page.locator('input[placeholder*="regex"], .pattern-input').first().fill('[invalid regex');
      
      // Should show error
      await expect(page.locator('.error, .invalid, [class*="error"]').first()).toBeVisible();
    });

    test('should handle global flag', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/regex/`);
      
      await page.locator('input[placeholder*="regex"], .pattern-input').first().fill('\\d+');
      await page.locator('textarea[placeholder*="text"], .test-text').first().fill('There are 123 items and 456 users');
      
      // Enable global flag if available
      const globalCheckbox = page.locator('input[type="checkbox"][value="g"], .flag-g, input:has-text("g")').first();
      if (await globalCheckbox.isVisible()) {
        await globalCheckbox.check();
      }
      
      await page.locator('button:has-text("Test"), .test-btn').first().click();
      
      const result = await page.locator('.matches, .result, .output').first().textContent();
      expect(result).toContain('123');
      expect(result).toContain('456');
    });
  });

  test.describe('YAML Validator/Formatter', () => {
    test('should format YAML', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/yaml/`);
      
      const yamlInput = `name: test
version: 1.0
config:
  debug: true
  port: 3000`;
      
      await page.locator('textarea#input, .input-area textarea').first().fill(yamlInput);
      
      await page.locator('button:has-text("Format"), button:has-text("Validate"), .format-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toContain('name: test');
      expect(output).toContain('version: 1.0');
      expect(output).toContain('config:');
      expect(output).toContain('debug: true');
    });

    test('should detect YAML errors', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/yaml/`);
      
      const invalidYaml = `name: test
version: 1.0
config
  debug: true`;  // Missing colon after config
      
      await page.locator('textarea#input, .input-area textarea').first().fill(invalidYaml);
      
      await page.locator('button:has-text("Format"), button:has-text("Validate"), .validate-btn').first().click();
      
      await expect(page.locator('.error, .invalid, [class*="error"]').first()).toBeVisible();
    });
  });

  test.describe('XML Formatter/Validator', () => {
    test('should format XML', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/xml/`);
      
      const xmlInput = '<root><item id="1"><name>Test</name></item></root>';
      
      await page.locator('textarea#input, .input-area textarea').first().fill(xmlInput);
      
      await page.locator('button:has-text("Format"), button:has-text("Prettify"), .format-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toContain('<root>');
      expect(output).toContain('  <item id="1">');
      expect(output).toContain('    <name>Test</name>');
    });

    test('should validate XML', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/xml/`);
      
      const invalidXml = '<root><item><name>Test</name></root>'; // Missing closing tag
      
      await page.locator('textarea#input, .input-area textarea').first().fill(invalidXml);
      
      await page.locator('button:has-text("Validate"), .validate-btn').first().click();
      
      await expect(page.locator('.error, .invalid, [class*="error"]').first()).toBeVisible();
    });
  });

  test.describe('Diff/Compare Tool', () => {
    test('should show differences between texts', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/diff/`);
      
      const text1 = `Line 1
Line 2
Line 3
Line 4`;
      
      const text2 = `Line 1
Line 2 modified
Line 3
Line 5`;
      
      await page.locator('textarea[placeholder*="Original"], .left-text, .text1').first().fill(text1);
      await page.locator('textarea[placeholder*="Modified"], .right-text, .text2').first().fill(text2);
      
      await page.locator('button:has-text("Compare"), button:has-text("Diff"), .compare-btn').first().click();
      
      // Should show diff visualization
      await expect(page.locator('.diff, .comparison, .result').first()).toBeVisible();
      
      const result = await page.locator('.diff, .comparison, .result').first().textContent();
      expect(result).toContain('Line 2');
      expect(result).toContain('modified');
    });

    test('should handle identical texts', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/diff/`);
      
      const sameText = 'This is the same text';
      
      await page.locator('.left-text, .text1').first().fill(sameText);
      await page.locator('.right-text, .text2').first().fill(sameText);
      
      await page.locator('button:has-text("Compare"), .compare-btn').first().click();
      
      const result = await page.locator('.diff, .comparison, .result, .no-diff').first().textContent();
      expect(result).toContain('identical' || 'same' || 'no differences');
    });
  });

  test.describe('Cron Expression Generator', () => {
    test('should generate cron expression', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/cron/`);
      
      // Set daily at 9 AM
      const minuteSelect = page.locator('select[name="minute"], .minute-select').first();
      const hourSelect = page.locator('select[name="hour"], .hour-select').first();
      
      if (await minuteSelect.isVisible()) {
        await minuteSelect.selectOption('0');
        await hourSelect.selectOption('9');
      }
      
      await page.locator('button:has-text("Generate"), .generate-btn').first().click();
      
      const cronExpression = await page.locator('.cron-output, .result, code').first().textContent();
      expect(cronExpression).toContain('0 9');
    });

    test('should validate cron expression', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/cron/`);
      
      // Input valid cron expression
      await page.locator('input[placeholder*="cron"], .cron-input').first().fill('0 9 * * *');
      
      await page.locator('button:has-text("Validate"), button:has-text("Parse"), .validate-btn').first().click();
      
      const description = await page.locator('.description, .explanation, .result').first().textContent();
      expect(description).toContain('daily' || '9' || 'AM');
    });
  });

  test.describe('JWT Token Decoder', () => {
    test('should decode JWT token', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/jwt/`);
      
      // Sample JWT token (header.payload.signature format)
      const sampleJWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.Twqp8kOiXcqAXTuFG9GqJ9dQSXux_4rOHGdqy5DFkPU';
      
      await page.locator('textarea[placeholder*="JWT"], .jwt-input, textarea#input').first().fill(sampleJWT);
      
      await page.locator('button:has-text("Decode"), button:has-text("Parse"), .decode-btn').first().click();
      
      // Should show decoded header and payload
      const result = await page.locator('.decoded, .result, .payload').first().textContent();
      expect(result).toContain('John Doe');
      expect(result).toContain('admin');
    });

    test('should handle invalid JWT', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/jwt/`);
      
      await page.locator('textarea[placeholder*="JWT"], .jwt-input').first().fill('invalid.jwt.token');
      
      await page.locator('button:has-text("Decode"), .decode-btn').first().click();
      
      await expect(page.locator('.error, .invalid, [class*="error"]').first()).toBeVisible();
    });
  });

  test.describe('SQL Formatter', () => {
    test('should format SQL query', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/sql/`);
      
      const sqlQuery = 'SELECT u.name,u.email,p.title FROM users u JOIN posts p ON u.id=p.user_id WHERE u.active=true ORDER BY u.name';
      
      await page.locator('textarea#input, .input-area textarea').first().fill(sqlQuery);
      
      await page.locator('button:has-text("Format"), button:has-text("Prettify"), .format-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toContain('SELECT');
      expect(output).toContain('FROM users u');
      expect(output).toContain('JOIN posts p');
      expect(output).toContain('WHERE u.active');
    });

    test('should validate SQL syntax', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/sql/`);
      
      const invalidSQL = 'SELECT FROM WHERE';
      
      await page.locator('textarea#input, .input-area textarea').first().fill(invalidSQL);
      
      await page.locator('button:has-text("Validate"), .validate-btn').first().click();
      
      await expect(page.locator('.error, .invalid, [class*="error"], .warning').first()).toBeVisible();
    });
  });

  test.describe('Image Tools', () => {
    test('should handle image upload in image tools', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/image/`);
      
      // Create a simple test image file
      const canvas = await page.evaluateHandle(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx!.fillStyle = '#ff0000';
        ctx!.fillRect(0, 0, 100, 100);
        return canvas;
      });
      
      // Should have file input for image upload
      await expect(page.locator('input[type="file"], .file-upload').first()).toBeVisible();
    });
  });

  test.describe('Binary/Hex Converter', () => {
    test('should convert text to binary', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/binary/`);
      
      await page.locator('textarea#input, .input-area textarea').first().fill('Hello');
      
      await page.locator('button:has-text("To Binary"), button:has-text("Encode"), .binary-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toMatch(/^[01\s]+$/); // Should contain only 0s, 1s, and spaces
      expect(output).toContain('01001000'); // 'H' in binary
    });

    test('should convert binary to text', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/binary/`);
      
      // 'Hello' in binary
      const binaryInput = '01001000 01100101 01101100 01101100 01101111';
      
      await page.locator('textarea#input, .input-area textarea').first().fill(binaryInput);
      
      await page.locator('button:has-text("To Text"), button:has-text("Decode"), .text-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output).toBe('Hello');
    });

    test('should convert to hexadecimal', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/hex/`);
      
      await page.locator('textarea#input, .input-area textarea').first().fill('Hello');
      
      await page.locator('button:has-text("To Hex"), button:has-text("Encode"), .hex-btn').first().click();
      
      const output = await page.locator('textarea#output, .output-area textarea, .result').first().textContent();
      expect(output?.toLowerCase()).toContain('48656c6c6f'); // 'Hello' in hex
    });
  });

  test.describe('DNS Lookup Tool', () => {
    test('should handle domain input', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/dns/`);
      
      await page.locator('input[placeholder*="domain"], .domain-input').first().fill('example.com');
      
      // Should have lookup button
      await expect(page.locator('button:has-text("Lookup"), .lookup-btn').first()).toBeVisible();
    });
  });

  test.describe('User Agent Parser', () => {
    test('should parse user agent string', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/ua/`);
      
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      
      await page.locator('textarea#input, .input-area textarea').first().fill(userAgent);
      
      await page.locator('button:has-text("Parse"), button:has-text("Analyze"), .parse-btn').first().click();
      
      const result = await page.locator('.result, .parsed, .output').first().textContent();
      expect(result).toContain('Chrome' || 'Windows' || 'WebKit');
    });

    test('should detect current user agent', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/ua/`);
      
      // Should auto-detect or have button to detect current UA
      const currentUA = await page.evaluate(() => navigator.userAgent);
      
      const detectBtn = page.locator('button:has-text("Detect"), button:has-text("Current"), .detect-btn').first();
      if (await detectBtn.isVisible()) {
        await detectBtn.click();
        
        const result = await page.locator('.result, .current-ua').first().textContent();
        expect(result).toContain('Chrome' || 'Firefox' || 'Safari');
      }
    });
  });

  test.describe('Text Statistics Tool', () => {
    test('should count characters and words', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/text-stats/`);
      
      const text = 'Hello world! This is a test text with multiple words and characters.';
      
      await page.locator('textarea#input, .input-area textarea').first().fill(text);
      
      // Should automatically calculate or have analyze button
      const analyzeBtn = page.locator('button:has-text("Analyze"), .analyze-btn').first();
      if (await analyzeBtn.isVisible()) {
        await analyzeBtn.click();
      }
      
      // Should show statistics
      const stats = await page.locator('.stats, .result, .output').first().textContent();
      expect(stats).toContain('characters' || 'words' || 'lines');
      expect(stats).toMatch(/\d+/); // Should contain numbers
    });

    test('should count lines and paragraphs', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/text-stats/`);
      
      const multilineText = `First line
      
Second line after empty line

Third paragraph`;
      
      await page.locator('textarea#input, .input-area textarea').first().fill(multilineText);
      
      const stats = await page.locator('.stats, .result').first().textContent();
      expect(stats).toContain('3' || 'lines');
    });
  });

  test.describe('Tool Performance', () => {
    test('tools should respond quickly', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/json/`);
      
      const startTime = Date.now();
      
      await page.locator('textarea#input, .input-area textarea').first().fill('{"test": true}');
      await page.locator('button:has-text("Format"), .format-btn').first().click();
      
      // Wait for result
      await page.locator('textarea#output, .output-area textarea').first().waitFor();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    test('tools should handle large inputs', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/base64/`);
      
      // Generate large text (1MB)
      const largeText = 'A'.repeat(1024 * 1024);
      
      await page.locator('textarea#input, .input-area textarea').first().fill(largeText);
      await page.locator('button:has-text("Encode"), .encode-btn').first().click();
      
      // Should handle large input without crashing
      await expect(page.locator('textarea#output, .output-area textarea').first()).toBeVisible();
    });
  });
});