import { test, expect } from '@playwright/test';

test.describe('Basic Website Health', () => {
  test('Homepage loads and has correct title', async ({ page }) => {
    await page.goto('/');
    
    // Check page loads and has title containing "Caiatech"
    await expect(page).toHaveTitle(/Caiatech/);
    
    // Check there's at least one h1 element
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Navigation links are present', async ({ page }) => {
    await page.goto('/');
    
    // Check key navigation links exist
    await expect(page.locator('a[href="/tools/"]')).toBeVisible();
    await expect(page.locator('a[href="/about/"]')).toBeVisible();
    await expect(page.locator('a[href="/contact/"]')).toBeVisible();
  });

  test('Essential pages return 200', async ({ page }) => {
    const pages = ['/', '/tools/', '/about/', '/contact/', '/privacy/', '/terms/'];
    
    for (const path of pages) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    }
  });

  test('AI discovery files are accessible', async ({ page }) => {
    const files = [
      '/robots.txt',
      '/api-schema.json', 
      '/digital-footprint.json',
      '/.well-known/ai-manifest.json'
    ];
    
    for (const file of files) {
      const response = await page.request.get(file);
      expect(response.status()).toBe(200);
    }
  });

  test('SEO basics are present', async ({ page }) => {
    await page.goto('/');
    
    // Check meta description exists
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    
    // Check canonical URL exists
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
  });

  test('Structured data is present', async ({ page }) => {
    await page.goto('/');
    
    // Check for at least one JSON-LD script
    const jsonLdCount = await page.locator('script[type="application/ld+json"]').count();
    expect(jsonLdCount).toBeGreaterThan(0);
  });

  test('Contact email is correct', async ({ page }) => {
    await page.goto('/contact/');
    
    // Check contact email is present
    await expect(page.locator('text=owner@caiatech.com')).toBeVisible();
  });

  test('Privacy policy mentions no data collection', async ({ page }) => {
    await page.goto('/privacy/');
    
    // Check privacy-first messaging is present
    await expect(page.locator('text=don\'t collect')).toBeVisible();
  });
});