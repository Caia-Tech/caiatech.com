import { test, expect } from '@playwright/test';
import { ToolsPage } from './pages/ToolsPage';

test.describe('Tools Overview Page', () => {
  let toolsPage: ToolsPage;

  test.beforeEach(async ({ page }) => {
    toolsPage = new ToolsPage(page);
    await toolsPage.goto();
  });

  test('should load tools page with terminal aesthetic', async () => {
    // Verify page loaded correctly
    await expect(toolsPage.pageTitle).toContainText('TOOLS');
    
    // Check terminal aesthetic
    const hasAesthetic = await toolsPage.verifyToolsAesthetic();
    expect(hasAesthetic).toBeTruthy();
  });

  test('should display privacy features prominently', async () => {
    await toolsPage.verifyPrivacyFeatures();
  });

  test('should display all tool categories', async () => {
    await toolsPage.verifyToolCategories();
  });

  test('should have at least 69 tools available', async () => {
    const toolCount = await toolsPage.getToolCount();
    expect(toolCount).toBeGreaterThanOrEqual(69);
  });

  test('should have functional search', async () => {
    await toolsPage.verifySearchFunctionality();
  });

  test('search should filter tools correctly', async () => {
    // Test JSON search
    await toolsPage.searchTools('json');
    const jsonResults = await toolsPage.getVisibleToolCount();
    expect(jsonResults).toBeGreaterThan(0);
    expect(jsonResults).toBeLessThan(10); // Should filter significantly

    // Test security search
    await toolsPage.searchTools('encrypt');
    const encryptResults = await toolsPage.getVisibleToolCount();
    expect(encryptResults).toBeGreaterThan(0);

    // Test non-existent term
    await toolsPage.searchTools('nonexistentterm12345');
    const noResults = await toolsPage.getVisibleToolCount();
    expect(noResults).toBe(0);

    // Clear search should restore all tools
    await toolsPage.searchTools('');
    await page.waitForTimeout(500);
    const allTools = await toolsPage.getVisibleToolCount();
    expect(allTools).toBeGreaterThanOrEqual(69);
  });

  test('should navigate to individual tools', async () => {
    // Get first few tools and test navigation
    const toolTitles = await toolsPage.getToolTitles();
    
    // Test JSON formatter navigation
    if (toolTitles.some(title => title.includes('JSON'))) {
      await toolsPage.clickTool('JSON');
      await expect(toolsPage.page).toHaveURL(/\/tools\/json$/);
      
      // Go back to tools page
      await toolsPage.goto();
    }
  });

  test('should maintain responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(toolsPage.toolCards.first()).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(toolsPage.toolCards.first()).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(toolsPage.toolCards.first()).toBeVisible();
  });

  test('should have proper SEO structure', async ({ page }) => {
    // Check meta tags
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    
    // Check title
    const title = await page.title();
    expect(title).toContain('Tools');
    expect(title).toContain('Caia');
    
    // Check heading hierarchy
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toBeVisible();
  });

  test('should load without external dependencies', async ({ page }) => {
    const externalRequests: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (!url.includes('localhost') && !url.includes('127.0.0.1') && !url.includes('caiatech.com')) {
        externalRequests.push(url);
      }
    });

    await toolsPage.goto();
    
    // Allow time for any potential external requests
    await page.waitForTimeout(2000);
    
    // Should have minimal external requests (only fonts/CDN if any)
    const nonFontRequests = externalRequests.filter(url => 
      !url.includes('fonts.googleapis.com') && 
      !url.includes('fonts.gstatic.com')
    );
    
    expect(nonFontRequests.length).toBe(0);
  });
});