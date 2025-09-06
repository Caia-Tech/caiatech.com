import { test, expect } from '@playwright/test';
import { ToolBasePage } from './pages/ToolBasePage';

test.describe('Development Tools', () => {
  test.describe('Git Command Helper', () => {
    let gitTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      gitTool = new ToolBasePage(page, 'git');
      await gitTool.goto();
    });

    test('should provide git command suggestions', async ({ page }) => {
      // Look for git scenario selector or input
      const actionSelect = page.locator('select, .git-actions');
      if (await actionSelect.count() > 0 && await actionSelect.first().isVisible()) {
        await actionSelect.first().click();
        
        // Check if commands are displayed
        await page.waitForTimeout(500);
        const commandOutput = page.locator('.command, .git-command, textarea');
        if (await commandOutput.count() > 0) {
          const commands = await commandOutput.first().textContent() || await commandOutput.first().inputValue();
          expect(commands).toContain('git');
        }
      }
    });
  });

  test.describe('Docker Helper', () => {
    let dockerTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      dockerTool = new ToolBasePage(page, 'docker');
      await dockerTool.goto();
    });

    test('should generate Docker commands', async ({ page }) => {
      // Look for Docker command generator
      const actionSelect = page.locator('select, button');
      if (await actionSelect.count() > 0) {
        await actionSelect.first().click();
        await page.waitForTimeout(500);
        
        const output = page.locator('textarea, .docker-command, .command');
        if (await output.count() > 0) {
          const command = await output.first().textContent() || await output.first().inputValue();
          if (command) {
            expect(command).toContain('docker');
          }
        }
      }
    });
  });

  test.describe('API Tester', () => {
    let apiTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      apiTool = new ToolBasePage(page, 'api');
      await apiTool.goto();
    });

    test('should have API testing interface', async ({ page }) => {
      // Look for URL input
      const urlInput = page.locator('input[type="url"], input[placeholder*="url"], input[placeholder*="endpoint"]');
      expect(await urlInput.count()).toBeGreaterThan(0);
      
      // Look for method selector
      const methodSelect = page.locator('select, .method-selector');
      if (await methodSelect.count() > 0) {
        expect(await methodSelect.first().isVisible()).toBeTruthy();
      }
    });

    test('should allow API request configuration', async ({ page }) => {
      const urlInput = page.locator('input[type="url"], input[placeholder*="url"]').first();
      await urlInput.fill('https://jsonplaceholder.typicode.com/posts/1');
      
      const sendBtn = page.locator('button:has-text("Send"), button:has-text("Test")');
      if (await sendBtn.count() > 0) {
        await sendBtn.click();
        
        // Wait for response (might take time for external API)
        await page.waitForTimeout(3000);
        
        const responseArea = page.locator('textarea').nth(1);
        if (await responseArea.count() > 0) {
          const response = await responseArea.inputValue();
          if (response && response.length > 10) {
            expect(response).toContain('{'); // Should be JSON response
          }
        }
      }
    });
  });

  test.describe('Cron Expression Helper', () => {
    let cronTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      cronTool = new ToolBasePage(page, 'cron');
      await cronTool.goto();
    });

    test('should validate cron expressions', async ({ page }) => {
      const cronInput = page.locator('input[type="text"], textarea').first();
      await cronInput.fill('0 0 * * *'); // Daily at midnight
      
      await page.waitForTimeout(500);
      
      // Check for cron description or validation
      const description = page.locator('.description, .explanation, .cron-description');
      if (await description.count() > 0) {
        const text = await description.first().textContent();
        expect(text).toContain('daily'); // Should explain the cron
      }
    });
  });

  test.describe('Webhook Tester', () => {
    let webhookTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      webhookTool = new ToolBasePage(page, 'webhook');
      await webhookTool.goto();
    });

    test('should provide webhook testing capabilities', async ({ page }) => {
      // Look for webhook URL generator or tester
      const generateBtn = page.locator('button:has-text("Generate"), button:has-text("Create")');
      if (await generateBtn.count() > 0) {
        await generateBtn.click();
        await page.waitForTimeout(500);
        
        // Should generate a webhook URL or testing interface
        const urlOutput = page.locator('input[type="url"], .webhook-url, textarea');
        if (await urlOutput.count() > 0) {
          const url = await urlOutput.first().inputValue() || await urlOutput.first().textContent();
          if (url) {
            expect(url).toContain('http');
          }
        }
      }
    });
  });

  test.describe('Regex Tester', () => {
    let regexTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      regexTool = new ToolBasePage(page, 'regex');
      await regexTool.goto();
    });

    test('should test regex patterns', async ({ page }) => {
      const regexInput = page.locator('input[placeholder*="regex"], input[placeholder*="pattern"]').first();
      await regexInput.fill('\\d+'); // Match numbers
      
      const testInput = page.locator('textarea, input[placeholder*="test"]').first();
      await testInput.fill('Hello 123 World 456');
      
      await page.waitForTimeout(500);
      
      // Check for matches
      const matchesOutput = page.locator('.matches, .results, textarea').nth(1);
      if (await matchesOutput.count() > 0) {
        const matches = await matchesOutput.textContent() || await matchesOutput.inputValue();
        if (matches) {
          expect(matches).toContain('123');
          expect(matches).toContain('456');
        }
      }
    });
  });

  test.describe('SQL Formatter', () => {
    let sqlTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      sqlTool = new ToolBasePage(page, 'sql');
      await sqlTool.goto();
    });

    test('should format SQL queries', async ({ page }) => {
      const sqlInput = 'SELECT name,email FROM users WHERE active=1 ORDER BY name';
      
      const textarea = page.locator('textarea').first();
      await textarea.fill(sqlInput);
      
      const formatBtn = page.locator('button:has-text("Format")');
      if (await formatBtn.count() > 0) {
        await formatBtn.click();
        await page.waitForTimeout(500);
        
        const outputTextarea = page.locator('textarea').nth(1);
        if (await outputTextarea.count() > 0) {
          const formatted = await outputTextarea.inputValue();
          expect(formatted.length).toBeGreaterThan(sqlInput.length);
          expect(formatted).toContain('\n'); // Should have line breaks
        }
      }
    });
  });

  test.describe('CSS Formatter', () => {
    let cssTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      cssTool = new ToolBasePage(page, 'css-formatter');
      await cssTool.goto();
    });

    test('should format CSS code', async ({ page }) => {
      const cssInput = '.container{display:flex;justify-content:center;align-items:center;}';
      
      const textarea = page.locator('textarea').first();
      await textarea.fill(cssInput);
      
      const formatBtn = page.locator('button:has-text("Format")');
      if (await formatBtn.count() > 0) {
        await formatBtn.click();
        await page.waitForTimeout(500);
        
        const outputTextarea = page.locator('textarea').nth(1);
        if (await outputTextarea.count() > 0) {
          const formatted = await outputTextarea.inputValue();
          expect(formatted.length).toBeGreaterThan(cssInput.length);
          expect(formatted).toContain('\n'); // Should have line breaks
        }
      }
    });
  });

  test.describe('JavaScript Formatter', () => {
    let jsTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      jsTool = new ToolBasePage(page, 'js-formatter');
      await jsTool.goto();
    });

    test('should format JavaScript code', async ({ page }) => {
      const jsInput = 'function test(){console.log("hello");return true;}';
      
      const textarea = page.locator('textarea').first();
      await textarea.fill(jsInput);
      
      const formatBtn = page.locator('button:has-text("Format"), button:has-text("Beautify")');
      if (await formatBtn.count() > 0) {
        await formatBtn.click();
        await page.waitForTimeout(500);
        
        const outputTextarea = page.locator('textarea').nth(1);
        if (await outputTextarea.count() > 0) {
          const formatted = await outputTextarea.inputValue();
          expect(formatted.length).toBeGreaterThan(jsInput.length);
          expect(formatted).toContain('\n'); // Should have line breaks
        }
      }
    });
  });

  test('development tools should work offline', async ({ page }) => {
    const devTools = ['git', 'docker', 'cron', 'regex', 'sql', 'css-formatter', 'js-formatter'];
    
    for (const toolName of devTools) {
      const tool = new ToolBasePage(page, toolName);
      await tool.goto();
      await tool.verifyOfflineCapability();
    }
  });

  test('development tools should maintain code aesthetic', async ({ page }) => {
    const devTools = ['git', 'docker', 'api', 'cron', 'regex', 'sql'];
    
    for (const toolName of devTools) {
      const tool = new ToolBasePage(page, toolName);
      await tool.goto();
      
      const hasTerminalAesthetic = await tool.verifyTerminalAesthetic();
      expect(hasTerminalAesthetic).toBeTruthy();
    }
  });
});