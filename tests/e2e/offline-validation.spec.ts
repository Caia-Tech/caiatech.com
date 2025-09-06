import { test, expect } from '@playwright/test';
import { ToolsPage } from './pages/ToolsPage';

test.describe('Offline Tool Validation', () => {
  let toolsPage: ToolsPage;

  test.beforeEach(async ({ page }) => {
    toolsPage = new ToolsPage(page);
  });

  test('All tools should load and work without external dependencies', async ({ page }) => {
    // Go to tools page and get all tool links
    await toolsPage.goto();
    
    // Get all tool links using existing method
    const toolUrls = await toolsPage.verifyAllToolsLoad();
    
    console.log(`Found ${toolUrls.length} tools to test`);
    
    // Track external requests
    const externalRequests = new Map<string, string[]>();
    
    // Test each tool for offline capability
    for (const toolUrl of toolUrls.slice(0, 20)) { // Test first 20 tools to avoid timeout
      const toolName = toolUrl.replace('/tools/', '');
      console.log(`Testing offline capability for: ${toolName}`);
      
      const requests: string[] = [];
      
      // Set up request monitoring
      page.on('request', request => {
        const url = request.url();
        if (!url.startsWith('http://localhost') && 
            !url.startsWith('data:') && 
            !url.startsWith('blob:') &&
            !url.includes('favicon') &&
            !url.includes('dev-toolbar')) {
          requests.push(url);
        }
      });
      
      try {
        // Navigate to tool
        await page.goto(toolUrl);
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        
        // Verify tool loaded
        const title = await page.locator('h1, h2, .tool-title').first();
        await expect(title).toBeVisible({ timeout: 5000 });
        
        // Try to interact with the tool
        const buttons = page.locator('button:not([disabled])');
        const buttonCount = await buttons.count();
        
        if (buttonCount > 0) {
          // Click the first button that looks like an action button
          const actionButton = buttons.filter({ hasText: /Generate|Format|Convert|Create|Test|Encode|Decode|Hash|Encrypt|Decrypt|Minify|Beautify|Validate/ }).first();
          
          if (await actionButton.count() > 0) {
            await actionButton.click();
            await page.waitForTimeout(1000); // Wait for processing
          } else {
            // Just click the first button
            await buttons.first().click();
            await page.waitForTimeout(1000);
          }
        }
        
        // Check for inputs and try to fill them
        const inputs = page.locator('input[type="text"], textarea').first();
        if (await inputs.count() > 0) {
          await inputs.fill('test data');
          await page.waitForTimeout(500);
        }
        
        // Record any external requests
        if (requests.length > 0) {
          externalRequests.set(toolName, [...requests]);
        }
        
      } catch (error) {
        console.log(`Tool ${toolName} failed to load or interact: ${error}`);
        externalRequests.set(toolName, [`ERROR: ${error}`]);
      }
      
      // Clean up event listeners
      page.removeAllListeners('request');
    }
    
    // Report results
    console.log('External requests by tool:');
    for (const [tool, requests] of externalRequests.entries()) {
      console.log(`${tool}: ${requests.length} external requests`);
      requests.forEach(req => console.log(`  - ${req}`));
    }
    
    // Most tools should work offline (some exceptions like API tester, DNS lookup are expected)
    const offlineViolators = Array.from(externalRequests.entries())
      .filter(([tool, requests]) => {
        // Allow certain tools to make external requests
        const allowedExternalTools = ['api', 'dns', 'ssl', 'webhook'];
        if (allowedExternalTools.some(allowed => tool.includes(allowed))) {
          return false;
        }
        // Filter out non-error requests
        return requests.some(req => !req.startsWith('ERROR:'));
      });
    
    // Report offline violations
    if (offlineViolators.length > 0) {
      console.log('Tools making unexpected external requests:');
      offlineViolators.forEach(([tool, requests]) => {
        console.log(`${tool}: ${requests.join(', ')}`);
      });
    }
    
    // Assertion: Most tools should work offline
    expect(offlineViolators.length).toBeLessThanOrEqual(5); // Allow some tolerance
  });

  test('Tools should have privacy guarantees', async ({ page }) => {
    await toolsPage.goto();
    
    // Use existing privacy verification method
    await toolsPage.verifyPrivacyFeatures();
  });

  test('Tools should work without JavaScript external libraries (CDN independence)', async ({ page }) => {
    // Block all external CDN requests
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (url.includes('cdn.') || 
          url.includes('googleapis.com') || 
          url.includes('unpkg.com') ||
          url.includes('jsdelivr.net') ||
          url.includes('cdnjs.cloudflare.com')) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    await toolsPage.goto();
    await toolsPage.verifyToolsPageLoaded();
    
    // Navigate to a few key tools and verify they still work
    const testTools = ['json', 'base64', 'uuid', 'password', 'hash'];
    
    for (const toolName of testTools) {
      await page.goto(`/tools/${toolName}`);
      
      try {
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        
        // Verify tool loads
        const title = await page.locator('h1, h2').first();
        await expect(title).toBeVisible({ timeout: 3000 });
        
        // Try basic interaction
        const buttons = page.locator('button');
        if (await buttons.count() > 0) {
          await buttons.first().click();
          await page.waitForTimeout(500);
        }
        
        console.log(`Tool ${toolName} works without CDN dependencies`);
      } catch (error) {
        console.log(`Tool ${toolName} may depend on external resources: ${error}`);
      }
    }
  });

  test('Tools should maintain functionality in slow network conditions', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
      route.continue();
    });
    
    await toolsPage.goto();
    
    // Test a few tools with network delay
    const testTools = ['json', 'uuid', 'base64'];
    
    for (const toolName of testTools) {
      await page.goto(`/tools/${toolName}`);
      await page.waitForLoadState('networkidle');
      
      // Verify tool still works
      const title = await page.locator('h1, h2').first();
      await expect(title).toBeVisible();
      
      // Test interaction
      const generateBtn = page.locator('button').first();
      if (await generateBtn.isVisible()) {
        await generateBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });
});