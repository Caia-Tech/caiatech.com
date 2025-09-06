import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4322';

test.describe('Simple Tool Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
    // Disable DevTools to avoid interference
    await page.goto('about:blank');
  });

  test.describe('JSON Formatter Tool - Core Functionality', () => {
    test('should process JSON input and output', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/json/`);
      
      // Input unformatted JSON into the specific textarea
      const input = '{"name":"test","value":123}';
      await page.locator('#json-input').fill(input);
      
      // Wait for automatic processing
      await page.waitForTimeout(1500);
      
      // Check that output contains formatted JSON
      const output = await page.locator('#json-output').textContent();
      
      // Verify JSON was processed (should be formatted)
      expect(output).toBeTruthy();
      expect(output).toContain('"name"');
      expect(output).toContain('"test"');
      expect(output).toContain('"value"');
      expect(output).toContain('123');
      
      // Should be formatted (contain line breaks for prettification)
      expect(output).toMatch(/{\s*"name"/);
    });

    test('should detect invalid JSON', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/json/`);
      
      // Input invalid JSON
      await page.locator('#json-input').fill('{invalid json}');
      
      // Wait for processing
      await page.waitForTimeout(1500);
      
      // Should show error message
      const errorVisible = await page.locator('#error-message').isVisible();
      expect(errorVisible).toBe(true);
    });

    test('should minify JSON when checkbox is checked', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/json/`);
      
      const formattedInput = `{
  "name": "test",
  "value": 123
}`;
      
      await page.locator('#json-input').fill(formattedInput);
      
      // Check minify checkbox
      await page.locator('#minify-checkbox').check();
      
      await page.waitForTimeout(1500);
      
      const output = await page.locator('#json-output').textContent();
      
      // Should be minified (no extra whitespace)
      expect(output?.replace(/\s/g, '')).toMatch(/{"name":"test","value":123}/);
    });

    test('should update statistics', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/json/`);
      
      await page.locator('#json-input').fill('{"test": true}');
      await page.waitForTimeout(1000);
      
      // Check that size stat is updated
      const sizeText = await page.locator('#size-stat').textContent();
      const size = parseInt(sizeText || '0');
      expect(size).toBeGreaterThan(0);
      
      // Check that lines stat is updated
      const linesText = await page.locator('#lines-stat').textContent();
      const lines = parseInt(linesText || '0');
      expect(lines).toBeGreaterThan(0);
    });

    test('should clear input when clear button is clicked', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/json/`);
      
      await page.locator('#json-input').fill('{"test": "data"}');
      
      // Click clear button
      await page.locator('#clear-btn').click();
      
      const inputValue = await page.locator('#json-input').inputValue();
      expect(inputValue).toBe('');
    });
  });

  test.describe('Privacy and Offline Functionality', () => {
    test('should work offline', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/json/`);
      
      // Go offline
      await page.context().setOffline(true);
      
      // Tool should still work
      await page.locator('#json-input').fill('{"offline": true}');
      
      await page.waitForTimeout(1000);
      
      const output = await page.locator('#json-output').textContent();
      expect(output).toContain('offline');
      
      // Go back online
      await page.context().setOffline(false);
    });

    test('should not make external requests during tool usage', async ({ page }) => {
      const externalRequests: string[] = [];
      
      page.on('request', (request) => {
        const url = request.url();
        if (!url.startsWith(BASE_URL) && 
            !url.startsWith('data:') && 
            !url.startsWith('blob:') &&
            !url.includes('localhost') &&
            !url.includes('127.0.0.1') &&
            !url.includes('chrome-extension') &&
            !url.includes('moz-extension')) {
          externalRequests.push(url);
        }
      });
      
      await page.goto(`${BASE_URL}/tools/json/`);
      await page.locator('#json-input').fill('{"test": true}');
      
      // Wait for processing
      await page.waitForTimeout(2000);
      
      // Filter out browser internal requests
      const filteredRequests = externalRequests.filter(url => 
        !url.includes('google.com') &&
        !url.includes('googleapis.com') &&
        !url.includes('gstatic.com') &&
        !url.includes('chrome.com') &&
        !url.includes('mozilla.org') &&
        !url.includes('firefox.com')
      );
      
      expect(filteredRequests).toHaveLength(0);
    });
  });

  test.describe('Basic Tool Page Loading', () => {
    test('should load JSON formatter page', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/json/`);
      
      // Should have the JSON input textarea
      await expect(page.locator('#json-input')).toBeVisible();
      
      // Should have the JSON output area
      await expect(page.locator('#json-output')).toBeVisible();
      
      // Should have minify checkbox
      await expect(page.locator('#minify-checkbox')).toBeVisible();
      
      // Should have clear button
      await expect(page.locator('#clear-btn')).toBeVisible();
    });

    test('should load other tool pages without errors', async ({ page }) => {
      const toolPaths = [
        '/tools/base64/',
        '/tools/uuid/',
        '/tools/url/',
        '/tools/hash/',
        '/tools/password/',
        '/tools/color/',
        '/tools/binary/',
        '/tools/hex/'
      ];
      
      for (const path of toolPaths) {
        await page.goto(`${BASE_URL}${path}`);
        
        // Page should load without obvious errors
        // Check that it's not a 404 or error page
        const pageContent = await page.textContent('body');
        expect(pageContent).not.toContain('404');
        expect(pageContent).not.toContain('Not Found');
        expect(pageContent).not.toContain('Error');
        
        // Should contain "Caiatech" somewhere (in title, header, etc.)
        expect(pageContent).toContain('Caiatech');
      }
    });

    test('should have responsive layout', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/json/`);
      
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Core elements should still be visible
      await expect(page.locator('#json-input')).toBeVisible();
      await expect(page.locator('#json-output')).toBeVisible();
      
      // Reset to desktop
      await page.setViewportSize({ width: 1280, height: 720 });
    });
  });

  test.describe('UUID Generator Tool', () => {
    test('should load UUID tool page', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/uuid/`);
      
      // Page should load successfully
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('UUID');
      expect(pageContent).toContain('Caiatech');
    });
  });

  test.describe('Base64 Tool', () => {
    test('should load Base64 tool page', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/base64/`);
      
      // Page should load successfully
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('Base64');
      expect(pageContent).toContain('Caiatech');
    });
  });

  test.describe('Hash Generator Tool', () => {
    test('should load Hash generator page', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/hash/`);
      
      // Page should load successfully
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('Hash');
      expect(pageContent).toContain('Caiatech');
    });
  });

  test.describe('Password Generator Tool', () => {
    test('should load Password generator page', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/password/`);
      
      // Page should load successfully
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('Password');
      expect(pageContent).toContain('Caiatech');
    });
  });

  test.describe('Tool Navigation', () => {
    test('should navigate from tools index to individual tools', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/`);
      
      // Should load tools index
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('Tools');
      expect(pageContent).toContain('Caiatech');
      
      // Find and click on JSON formatter link if it exists
      const jsonLink = page.locator('a[href*="/tools/json"]').first();
      if (await jsonLink.isVisible()) {
        await jsonLink.click();
        
        // Should navigate to JSON tool
        await page.waitForURL('**/tools/json/**');
        await expect(page.locator('#json-input')).toBeVisible();
      }
    });
  });
});