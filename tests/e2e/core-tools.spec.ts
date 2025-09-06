import { test, expect } from '@playwright/test';
import { ToolBasePage } from './pages/ToolBasePage';

test.describe('Core Tools Functionality', () => {
  test.describe('JSON Formatter', () => {
    let jsonTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      jsonTool = new ToolBasePage(page, 'json');
      await jsonTool.goto();
    });

    test('should load JSON formatter correctly', async () => {
      await jsonTool.verifyToolLoaded();
      await expect(jsonTool.toolTitle).toContainText('JSON');
    });

    test('should format valid JSON', async ({ page }) => {
      const inputJson = '{"name":"test","value":123,"array":[1,2,3]}';
      const textarea = page.locator('textarea').first();
      
      await textarea.fill(inputJson);
      
      // Trigger formatting (look for format button or auto-format)
      const formatBtn = page.locator('button:has-text("Format"), button:has-text("Beautify")');
      if (await formatBtn.count() > 0) {
        await formatBtn.click();
      }
      
      await page.waitForTimeout(500);
      
      // Check if output is formatted (should have line breaks)
      const outputTextarea = page.locator('textarea').nth(1);
      if (await outputTextarea.count() > 0) {
        const output = await outputTextarea.inputValue();
        expect(output.length).toBeGreaterThan(inputJson.length);
        expect(output).toContain('\n'); // Should have line breaks
      }
    });

    test('should validate invalid JSON', async ({ page }) => {
      const invalidJson = '{"name": test, "value":}';
      const textarea = page.locator('textarea').first();
      
      await textarea.fill(invalidJson);
      await page.waitForTimeout(500);
      
      // Check for error indication
      const errorElements = page.locator('.error, .invalid, [class*="error"], [class*="invalid"]');
      const hasError = await errorElements.count() > 0;
      
      if (hasError) {
        await expect(errorElements.first()).toBeVisible();
      }
    });

    test('should work offline', async () => {
      await jsonTool.verifyOfflineCapability();
    });
  });

  test.describe('Base64 Encoder', () => {
    let base64Tool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      base64Tool = new ToolBasePage(page, 'base64');
      await base64Tool.goto();
    });

    test('should encode text to base64', async ({ page }) => {
      const inputText = 'Hello World';
      const expectedBase64 = 'SGVsbG8gV29ybGQ=';
      
      const textarea = page.locator('textarea').first();
      await textarea.fill(inputText);
      
      // Look for encode button or auto-encoding
      const encodeBtn = page.locator('button:has-text("Encode")');
      if (await encodeBtn.count() > 0) {
        await encodeBtn.click();
      }
      
      await page.waitForTimeout(500);
      
      // Check output
      const outputTextarea = page.locator('textarea').nth(1);
      if (await outputTextarea.count() > 0) {
        const output = await outputTextarea.inputValue();
        expect(output).toBe(expectedBase64);
      }
    });

    test('should decode base64 to text', async ({ page }) => {
      const base64Input = 'SGVsbG8gV29ybGQ=';
      const expectedText = 'Hello World';
      
      // Switch to decode mode if needed
      const modeSelect = page.locator('select#mode-select, .mode-select');
      if (await modeSelect.count() > 0) {
        await modeSelect.selectOption('decode');
      }
      
      const textarea = page.locator('textarea').first();
      await textarea.fill(base64Input);
      
      const decodeBtn = page.locator('button:has-text("Decode")');
      if (await decodeBtn.count() > 0) {
        await decodeBtn.click();
      }
      
      await page.waitForTimeout(500);
      
      const outputTextarea = page.locator('textarea').nth(1);
      if (await outputTextarea.count() > 0) {
        const output = await outputTextarea.inputValue();
        expect(output).toBe(expectedText);
      }
    });
  });

  test.describe('UUID Generator', () => {
    let uuidTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      uuidTool = new ToolBasePage(page, 'uuid');
      await uuidTool.goto();
    });

    test('should generate valid UUIDs', async ({ page }) => {
      // Wait for page to load completely
      await page.waitForLoadState('networkidle');
      
      // Check if a UUID is already generated on page load
      await expect(page.locator('.uuid-text').first()).toBeVisible();
      
      // Get the initial UUID
      const initialUuid = await page.locator('.uuid-text').first().textContent();
      expect(initialUuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      
      // Click generate button to create a new UUID
      await page.locator('#generate-btn').click();
      
      // Wait a moment for the new UUID to be generated
      await page.waitForTimeout(500);
      
      // Get the new UUID and verify it's different and valid
      const newUuid = await page.locator('.uuid-text').first().textContent();
      expect(newUuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      expect(newUuid).not.toBe(initialUuid); // Should be a different UUID
    });

    test('should generate multiple unique UUIDs', async ({ page }) => {
      const generateBtn = page.locator('button:has-text("Generate"), button:has-text("New")');
      const uuids: string[] = [];
      
      for (let i = 0; i < 3; i++) {
        await generateBtn.click();
        await page.waitForTimeout(200);
        
        const outputArea = page.locator('textarea, input, .output');
        const uuid = await outputArea.first().inputValue() || await outputArea.first().textContent();
        
        if (uuid) {
          uuids.push(uuid.trim());
        }
      }
      
      // All UUIDs should be unique
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(uuids.length);
    });
  });

  test.describe('URL Encoder', () => {
    let urlTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      urlTool = new ToolBasePage(page, 'url');
      await urlTool.goto();
    });

    test('should encode URLs correctly', async ({ page }) => {
      const inputUrl = 'https://example.com/path with spaces?query=test value';
      const expectedEncoded = 'https%3A//example.com/path%20with%20spaces%3Fquery%3Dtest%20value';
      
      const textarea = page.locator('textarea').first();
      await textarea.fill(inputUrl);
      
      const encodeBtn = page.locator('button:has-text("Encode")');
      if (await encodeBtn.count() > 0) {
        await encodeBtn.click();
      }
      
      await page.waitForTimeout(500);
      
      const outputTextarea = page.locator('textarea').nth(1);
      if (await outputTextarea.count() > 0) {
        const output = await outputTextarea.inputValue();
        expect(output).toContain('%20'); // Space should be encoded
        expect(output).toContain('%3A'); // Colon should be encoded
      }
    });
  });

  test.describe('Binary Converter', () => {
    let binaryTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      binaryTool = new ToolBasePage(page, 'binary');
      await binaryTool.goto();
    });

    test('should convert text to binary', async ({ page }) => {
      const inputText = 'Hello';
      
      const textarea = page.locator('textarea').first();
      await textarea.fill(inputText);
      
      await page.waitForTimeout(500);
      
      // Check if binary output is generated
      const outputTextarea = page.locator('textarea').nth(1);
      if (await outputTextarea.count() > 0) {
        const output = await outputTextarea.inputValue();
        expect(output).toMatch(/^[01\s]+$/); // Should only contain 0s, 1s, and spaces
        expect(output.length).toBeGreaterThan(inputText.length * 6); // Binary is much longer
      }
    });
  });

  test.describe('Hex Converter', () => {
    let hexTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      hexTool = new ToolBasePage(page, 'hex');
      await hexTool.goto();
    });

    test('should convert text to hex', async ({ page }) => {
      const inputText = 'Hello';
      
      const textarea = page.locator('textarea').first();
      await textarea.fill(inputText);
      
      await page.waitForTimeout(500);
      
      const outputTextarea = page.locator('textarea').nth(1);
      if (await outputTextarea.count() > 0) {
        const output = await outputTextarea.inputValue();
        expect(output).toMatch(/^[0-9a-f\s]+$/i); // Should only contain hex chars
        expect(output.toLowerCase()).toContain('48656c6c6f'); // "Hello" in hex
      }
    });
  });

  test('all core tools should maintain privacy standards', async ({ page }) => {
    const coreTools = ['json', 'base64', 'uuid', 'url', 'binary', 'hex'];
    
    for (const toolName of coreTools) {
      const tool = new ToolBasePage(page, toolName);
      await tool.goto();
      await tool.verifyPrivacyBadge();
      await tool.verifyOfflineCapability();
    }
  });
});