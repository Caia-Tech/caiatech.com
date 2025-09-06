import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage should match visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      animations: 'disabled',
    });
    
    // Screenshot hero section specifically
    const heroSection = page.locator('.hero');
    await expect(heroSection).toHaveScreenshot('homepage-hero.png');
    
    // Screenshot terminal component
    const terminal = page.locator('.terminal').first();
    await expect(terminal).toHaveScreenshot('homepage-terminal.png');
  });

  test('articles page should match visual snapshot', async ({ page }) => {
    await page.goto('/articles/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('articles-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('tools page should match visual snapshot', async ({ page }) => {
    await page.goto('/tools/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('tools-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('datasets page should match visual snapshot', async ({ page }) => {
    await page.goto('/datasets/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('datasets-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('navigation should maintain consistent styling', async ({ page }) => {
    await page.goto('/');
    
    const navigation = page.locator('.navigation');
    await expect(navigation).toHaveScreenshot('navigation.png');
  });

  test('footer should maintain consistent styling', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('.contact-footer');
    await expect(footer).toHaveScreenshot('footer.png');
  });

  test('terminal aesthetic preserved on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('terminal aesthetic preserved on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});