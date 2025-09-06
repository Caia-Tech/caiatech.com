import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Homepage Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display hero section with correct content', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/Caia Tech.*Computer Science Research/);
    
    // Check hero title
    await expect(homePage.heroTitle).toBeVisible();
    await expect(homePage.heroTitle).toContainText('Caia');
    await expect(homePage.heroTitle).toContainText('Tech');
    
    // Check terminal is visible
    expect(await homePage.isTerminalVisible()).toBeTruthy();
  });

  test('should have all hero buttons functional', async ({ page }) => {
    // Check all buttons are visible
    await expect(homePage.articlesButton).toBeVisible();
    await expect(homePage.toolsButton).toBeVisible();
    await expect(homePage.softwareButton).toBeVisible();
    await expect(homePage.papersButton).toBeVisible();
    await expect(homePage.booksButton).toBeVisible();
    
    // Test articles button
    await homePage.clickHeroButton('articles');
    await expect(page).toHaveURL('/articles/');
    await page.goBack();
    
    // Test tools button
    await homePage.clickHeroButton('tools');
    await expect(page).toHaveURL('/tools/');
  });

  test('should display terminal with correct styling', async ({ page }) => {
    // Check terminal exists
    await expect(homePage.terminal).toBeVisible();
    
    // Check terminal has content
    const terminalContent = await homePage.getTerminalContent();
    expect(terminalContent).toContain('kubectl');
    
    // Check prompt symbols are present
    const prompts = page.locator('.prompt');
    const promptCount = await prompts.count();
    expect(promptCount).toBeGreaterThan(0);
  });

  test('should display contact information', async ({ page }) => {
    // Check contact email is present
    await expect(homePage.contactEmail).toBeVisible();
    const email = await homePage.getContactEmail();
    expect(email).toBe('owner@caiatech.com');
  });

  test('should maintain terminal aesthetic', async () => {
    // Verify the terminal/developer aesthetic is preserved
    const hasAesthetic = await homePage.verifyHeroAesthetic();
    expect(hasAesthetic).toBeTruthy();
    
    // Check for monospace font
    const monoElements = await homePage.page.locator('.mono').count();
    expect(monoElements).toBeGreaterThan(0);
    
    // Check for accent color
    const accentElements = await homePage.page.locator('.accent').count();
    expect(accentElements).toBeGreaterThan(0);
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toContain('Building the future of creative technology');
    
    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('Caia Tech');
    
    // Check structured data
    const structuredData = await page.locator('script[type="application/ld+json"]').count();
    expect(structuredData).toBeGreaterThan(0);
  });

  test('should be responsive', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(homePage.terminal).toBeVisible();
    
    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(homePage.heroTitle).toBeVisible();
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(homePage.heroTitle).toBeVisible();
    await expect(homePage.mobileMenuToggle).toBeVisible();
  });
});