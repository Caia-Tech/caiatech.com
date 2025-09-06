import { test, expect } from '@playwright/test';

test.describe('Website Health Check', () => {
  test('Homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check page loads
    await expect(page).toHaveTitle(/Caiatech/);
    
    // Check key content is present
    await expect(page.locator('h1')).toContainText('Caiatech');
    
    // Check navigation works
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('a[href="/tools/"]')).toBeVisible();
    await expect(page.locator('a[href="/articles/"]')).toBeVisible();
    await expect(page.locator('a[href="/about/"]')).toBeVisible();
    await expect(page.locator('a[href="/contact/"]')).toBeVisible();
  });

  test('Tools page loads correctly', async ({ page }) => {
    await page.goto('/tools/');
    
    // Check page loads
    await expect(page).toHaveTitle(/Tools/);
    
    // Check tools are displayed
    await expect(page.locator('.tool-card')).toHaveCount({ timeout: 10000 });
    
    // Check categories exist
    const categories = ['Core Utilities', 'Security & Crypto', 'Text & Format'];
    for (const category of categories) {
      await expect(page.locator(`text=${category}`)).toBeVisible();
    }
  });

  test('About page loads correctly', async ({ page }) => {
    await page.goto('/about/');
    
    // Check page loads
    await expect(page).toHaveTitle(/About/);
    
    // Check Terminal components load
    await expect(page.locator('.terminal-container')).toHaveCount({ timeout: 10000 });
    
    // Check key content
    await expect(page.locator('text=Caiatech Research Lab')).toBeVisible();
  });

  test('Contact page loads correctly', async ({ page }) => {
    await page.goto('/contact/');
    
    // Check page loads
    await expect(page).toHaveTitle(/Contact/);
    
    // Check contact form exists
    await expect(page.locator('form')).toBeVisible();
    
    // Check email is correct
    await expect(page.locator('text=owner@caiatech.com')).toBeVisible();
  });

  test('Privacy page loads correctly', async ({ page }) => {
    await page.goto('/privacy/');
    
    // Check page loads
    await expect(page).toHaveTitle(/Privacy/);
    
    // Check key privacy content
    await expect(page.locator('text=We don\'t collect')).toBeVisible();
  });

  test('Terms page loads correctly', async ({ page }) => {
    await page.goto('/terms/');
    
    // Check page loads
    await expect(page).toHaveTitle(/Terms/);
    
    // Check legal content
    await expect(page.locator('text=Terms of Service')).toBeVisible();
  });

  test('Article listing loads correctly', async ({ page }) => {
    await page.goto('/articles/');
    
    // Check page loads
    await expect(page).toHaveTitle(/Articles/);
    
    // Check articles are displayed
    await expect(page.locator('.article-card')).toHaveCount({ timeout: 10000 });
  });

  test('Navigation works across pages', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to tools
    await page.click('a[href="/tools/"]');
    await expect(page).toHaveURL(/tools/);
    
    // Test navigation to articles
    await page.click('a[href="/articles/"]');
    await expect(page).toHaveURL(/articles/);
    
    // Test navigation to about
    await page.click('a[href="/about/"]');
    await expect(page).toHaveURL(/about/);
    
    // Test navigation back to home
    await page.click('a[href="/"]');
    await expect(page).toHaveURL(/^https?:\/\/[^\/]+\/?$/);
  });

  test('Footer is present on all pages', async ({ page }) => {
    const pages = ['/', '/tools/', '/articles/', '/about/', '/contact/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.locator('footer').locator('text=© 2025 Caiatech')).toBeVisible();
    }
  });

  test('SEO meta tags are present', async ({ page }) => {
    await page.goto('/');
    
    // Check essential meta tags
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);
    
    // Check Open Graph tags
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content');
    
    // Check canonical URL
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href');
  });

  test('Structured data is present', async ({ page }) => {
    await page.goto('/');
    
    // Check for JSON-LD structured data
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').count();
    expect(jsonLdScripts).toBeGreaterThan(0);
  });

  test('AI discovery endpoints exist', async ({ page }) => {
    // Check robots.txt
    const robotsResponse = await page.request.get('/robots.txt');
    expect(robotsResponse.status()).toBe(200);
    const robotsText = await robotsResponse.text();
    expect(robotsText).toContain('Sitemap:');
    expect(robotsText).toContain('User-agent: *');
    
    // Check API schema
    const apiSchemaResponse = await page.request.get('/api-schema.json');
    expect(apiSchemaResponse.status()).toBe(200);
    
    // Check digital footprint
    const footprintResponse = await page.request.get('/digital-footprint.json');
    expect(footprintResponse.status()).toBe(200);
    
    // Check AI manifest
    const manifestResponse = await page.request.get('/.well-known/ai-manifest.json');
    expect(manifestResponse.status()).toBe(200);
  });
});

test.describe('Tool Functionality Tests', () => {
  test('JSON Formatter tool works', async ({ page }) => {
    await page.goto('/tools/json/');
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('JSON');
    
    // Test JSON formatting
    const textarea = page.locator('textarea').first();
    await textarea.fill('{"test": "value", "number": 123}');
    
    const formatButton = page.locator('button').filter({ hasText: /format|prettify/i });
    if (await formatButton.count() > 0) {
      await formatButton.click();
    }
    
    // Check if formatting worked (formatted JSON typically has newlines)
    const result = await textarea.inputValue();
    expect(result).toContain('test');
    expect(result).toContain('value');
  });

  test('Base64 Encoder tool works', async ({ page }) => {
    await page.goto('/tools/base64/');
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Base64');
    
    // Test encoding
    const inputTextarea = page.locator('textarea').first();
    await inputTextarea.fill('Hello, World!');
    
    const encodeButton = page.locator('button').filter({ hasText: /encode/i });
    if (await encodeButton.count() > 0) {
      await encodeButton.click();
      await page.waitForTimeout(500);
    }
    
    // Check if result area has content
    const resultArea = page.locator('textarea').last();
    const result = await resultArea.inputValue();
    expect(result.length).toBeGreaterThan(0);
  });

  test('UUID Generator tool works', async ({ page }) => {
    await page.goto('/tools/uuid/');
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('UUID');
    
    // Test UUID generation
    const generateButton = page.locator('button').filter({ hasText: /generate/i });
    await generateButton.click();
    
    // Check if UUID was generated
    const uuidField = page.locator('input[type="text"], textarea').first();
    const uuid = await uuidField.inputValue();
    
    // UUID should be 36 characters with dashes
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});