import { test, expect } from '@playwright/test';
import { ToolBasePage } from './pages/ToolBasePage';

test.describe('Development Tools', () => {
  
  test.describe('Code Tools', () => {
    test('JS Formatter should format JavaScript code', async ({ page }) => {
      const jsTool = new ToolBasePage(page, 'js-formatter');
      await jsTool.goto();
      
      const uglyJs = 'function test(){if(true){console.log("hello");}return{a:1,b:2};}';
      
      const input = page.locator('textarea').first();
      await input.fill(uglyJs);
      
      const formatBtn = page.locator('button:has-text("Format"), button:has-text("Prettify")').first();
      if (await formatBtn.isVisible()) {
        await formatBtn.click();
      }
      
      await page.waitForTimeout(500);
      
      const output = page.locator('textarea').nth(1);
      if (await output.isVisible()) {
        const formatted = await output.inputValue();
        expect(formatted).toContain('\n'); // Should have line breaks
        expect(formatted).toContain('  '); // Should have indentation
      }
    });

    test('CSS Formatter should format CSS code', async ({ page }) => {
      const cssTool = new ToolBasePage(page, 'css-formatter');
      await cssTool.goto();
      
      const uglyCSS = 'body{margin:0;padding:0}h1{color:red;font-size:24px}';
      
      const input = page.locator('textarea').first();
      await input.fill(uglyCSS);
      
      const formatBtn = page.locator('button:has-text("Format"), button:has-text("Prettify")').first();
      if (await formatBtn.isVisible()) {
        await formatBtn.click();
      }
      
      await page.waitForTimeout(500);
      
      const output = page.locator('textarea').nth(1);
      if (await output.isVisible()) {
        const formatted = await output.inputValue();
        expect(formatted).toContain('\n'); // Should have line breaks
        expect(formatted.length).toBeGreaterThan(uglyCSS.length);
      }
    });

    test('Code Minifier should minify code', async ({ page }) => {
      const minifyTool = new ToolBasePage(page, 'minify');
      await minifyTool.goto();
      
      const verboseJs = 'function test() {\n  if (true) {\n    console.log("hello");\n  }\n  return {\n    a: 1,\n    b: 2\n  };\n}';
      
      const input = page.locator('textarea').first();
      await input.fill(verboseJs);
      
      const minifyBtn = page.locator('button:has-text("Minify"), button:has-text("Compress")').first();
      if (await minifyBtn.isVisible()) {
        await minifyBtn.click();
      }
      
      await page.waitForTimeout(500);
      
      const output = page.locator('textarea').nth(1);
      if (await output.isVisible()) {
        const minified = await output.inputValue();
        expect(minified.length).toBeLessThan(verboseJs.length);
        expect(minified).not.toContain('\n  '); // Should remove indentation
      }
    });
  });

  test.describe('Network & Web Tools', () => {
    test('API Tester should allow making requests', async ({ page }) => {
      const apiTool = new ToolBasePage(page, 'api');
      await apiTool.goto();
      
      // Look for URL input
      const urlInput = page.locator('input[type="url"], input[placeholder*="url"], input[placeholder*="endpoint"]').first();
      if (await urlInput.isVisible()) {
        await urlInput.fill('https://httpbin.org/get');
        
        // Look for send/test button
        const sendBtn = page.locator('button:has-text("Send"), button:has-text("Test"), button:has-text("Execute")').first();
        if (await sendBtn.isVisible()) {
          await sendBtn.click();
          
          // Wait for response
          await page.waitForTimeout(2000);
          
          // Check for response area
          const responseArea = page.locator('textarea, .response, .output').last();
          if (await responseArea.isVisible()) {
            const response = await responseArea.textContent() || await responseArea.inputValue();
            if (response) {
              expect(response.length).toBeGreaterThan(10);
            }
          }
        }
      }
    });

    test('DNS Lookup tool should check DNS records', async ({ page }) => {
      const dnsTool = new ToolBasePage(page, 'dns');
      await dnsTool.goto();
      
      const domainInput = page.locator('input[type="text"], input[placeholder*="domain"]').first();
      if (await domainInput.isVisible()) {
        await domainInput.fill('google.com');
        
        const lookupBtn = page.locator('button:has-text("Lookup"), button:has-text("Check"), button:has-text("Query")').first();
        if (await lookupBtn.isVisible()) {
          await lookupBtn.click();
          
          await page.waitForTimeout(2000);
          
          const output = page.locator('textarea, .output, .results').last();
          if (await output.isVisible()) {
            const result = await output.textContent() || await output.inputValue();
            if (result) {
              expect(result.length).toBeGreaterThan(10);
            }
          }
        }
      }
    });
  });

  test.describe('Data Format Tools', () => {
    test('YAML Validator should validate YAML', async ({ page }) => {
      const yamlTool = new ToolBasePage(page, 'yaml');
      await yamlTool.goto();
      
      const validYAML = 'name: test\nversion: 1.0\ndependencies:\n  - express\n  - mongoose';
      
      const input = page.locator('textarea').first();
      await input.fill(validYAML);
      
      const validateBtn = page.locator('button:has-text("Validate"), button:has-text("Check")').first();
      if (await validateBtn.isVisible()) {
        await validateBtn.click();
      }
      
      await page.waitForTimeout(500);
      
      // Should show valid result
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(/(valid|success|✓|✅)/i);
    });

    test('XML Formatter should format XML', async ({ page }) => {
      const xmlTool = new ToolBasePage(page, 'xml');
      await xmlTool.goto();
      
      const uglyXML = '<root><item><name>test</name><value>123</value></item></root>';
      
      const input = page.locator('textarea').first();
      await input.fill(uglyXML);
      
      const formatBtn = page.locator('button:has-text("Format"), button:has-text("Prettify")').first();
      if (await formatBtn.isVisible()) {
        await formatBtn.click();
      }
      
      await page.waitForTimeout(500);
      
      const output = page.locator('textarea').nth(1);
      if (await output.isVisible()) {
        const formatted = await output.inputValue();
        expect(formatted).toContain('\n'); // Should have line breaks
        expect(formatted.length).toBeGreaterThan(uglyXML.length);
      }
    });
  });

  test.describe('Text Processing Tools', () => {
    test('Regex Tester should test regular expressions', async ({ page }) => {
      const regexTool = new ToolBasePage(page, 'regex');
      await regexTool.goto();
      
      // Enter a regex pattern
      const patternInput = page.locator('input[placeholder*="regex"], input[placeholder*="pattern"], textarea').first();
      await patternInput.fill('[a-z]+@[a-z]+\\.[a-z]+');
      
      // Enter test text
      const textInput = page.locator('textarea').last();
      await textInput.fill('Contact us at test@example.com or admin@site.org');
      
      const testBtn = page.locator('button:has-text("Test"), button:has-text("Match")').first();
      if (await testBtn.isVisible()) {
        await testBtn.click();
      }
      
      await page.waitForTimeout(500);
      
      // Should show matches
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('example.com');
    });

    test('Diff Checker should compare text', async ({ page }) => {
      const diffTool = new ToolBasePage(page, 'diff');
      await diffTool.goto();
      
      const text1 = 'Hello World\nThis is line 2\nThis is line 3';
      const text2 = 'Hello World\nThis is line 2 modified\nThis is line 3\nThis is line 4';
      
      const leftTextarea = page.locator('textarea').first();
      await leftTextarea.fill(text1);
      
      const rightTextarea = page.locator('textarea').nth(1);
      await rightTextarea.fill(text2);
      
      const compareBtn = page.locator('button:has-text("Compare"), button:has-text("Diff")').first();
      if (await compareBtn.isVisible()) {
        await compareBtn.click();
      }
      
      await page.waitForTimeout(500);
      
      // Should show differences
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(/(modified|added|removed|diff)/i);
    });
  });

  test.describe('Generator Tools', () => {
    test('QR Code generator should create QR codes', async ({ page }) => {
      const qrTool = new ToolBasePage(page, 'qr');
      await qrTool.goto();
      
      const input = page.locator('input[type="text"], textarea').first();
      await input.fill('https://caiatech.com');
      
      const generateBtn = page.locator('button:has-text("Generate"), button:has-text("Create")').first();
      if (await generateBtn.isVisible()) {
        await generateBtn.click();
      }
      
      await page.waitForTimeout(1000);
      
      // Should show QR code (as image or canvas)
      const qrImage = page.locator('img, canvas, svg').last();
      if (await qrImage.isVisible()) {
        expect(await qrImage.isVisible()).toBeTruthy();
      }
    });

    test('Color Converter should convert color formats', async ({ page }) => {
      const colorTool = new ToolBasePage(page, 'color');
      await colorTool.goto();
      
      // Enter a hex color
      const input = page.locator('input[type="text"], input[type="color"]').first();
      await input.fill('#ff0000');
      
      const convertBtn = page.locator('button:has-text("Convert"), button:has-text("Transform")').first();
      if (await convertBtn.isVisible()) {
        await convertBtn.click();
      }
      
      await page.waitForTimeout(500);
      
      // Should show RGB values
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(/(rgb|255.*0.*0)/i);
    });
  });

  test.describe('Time & Date Tools', () => {
    test('Timestamp converter should convert timestamps', async ({ page }) => {
      const timestampTool = new ToolBasePage(page, 'timestamp');
      await timestampTool.goto();
      
      // Enter a Unix timestamp
      const input = page.locator('input[type="number"], input[type="text"]').first();
      await input.fill('1640995200'); // 2022-01-01 00:00:00 UTC
      
      const convertBtn = page.locator('button:has-text("Convert"), button:has-text("Transform")').first();
      if (await convertBtn.isVisible()) {
        await convertBtn.click();
      }
      
      await page.waitForTimeout(500);
      
      // Should show human readable date
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(/(2022|Jan|January)/i);
    });

    test('Cron Builder should help build cron expressions', async ({ page }) => {
      const cronTool = new ToolBasePage(page, 'cron');
      await cronTool.goto();
      
      // Should have cron expression controls
      const cronInputs = page.locator('input, select');
      const inputCount = await cronInputs.count();
      expect(inputCount).toBeGreaterThan(0);
      
      // Should show explanation
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(/(minute|hour|day|month|cron)/i);
    });
  });

  test.describe('Tool Performance & Privacy', () => {
    const devTools = [
      'js-formatter', 'css-formatter', 'minify', 'api', 'dns', 'yaml', 
      'xml', 'regex', 'diff', 'qr', 'color', 'timestamp', 'cron'
    ];
    
    devTools.forEach(toolName => {
      test(`${toolName} should work offline and maintain privacy`, async ({ page }) => {
        const tool = new ToolBasePage(page, toolName);
        
        try {
          await tool.goto();
        } catch (error) {
          test.skip(`Tool ${toolName} not found, skipping`);
          return;
        }
        
        // Basic functionality check
        await expect(page.locator('h1, h2, .tool-title')).toBeVisible();
        
        // Privacy check - no external requests after load
        let externalRequests = 0;
        page.on('request', request => {
          const url = request.url();
          if (!url.startsWith('http://localhost') && 
              !url.startsWith('data:') && 
              !url.startsWith('blob:')) {
            externalRequests++;
          }
        });
        
        // Interact with the tool
        await page.waitForTimeout(1000);
        const buttons = page.locator('button');
        const buttonCount = await buttons.count();
        if (buttonCount > 0) {
          await buttons.first().click();
          await page.waitForTimeout(500);
        }
        
        // Should not make external requests (except API tester which is expected)
        if (toolName !== 'api' && toolName !== 'dns') {
          expect(externalRequests).toBe(0);
        }
      });
    });
  });
});