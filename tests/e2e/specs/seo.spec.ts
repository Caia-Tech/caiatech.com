import { test, expect } from '@playwright/test';

test.describe('SEO Tests', () => {
  const pages = [
    { url: '/', title: 'Caia Tech - Computer Science Research' },
    { url: '/articles/', title: 'Articles' },
    { url: '/tools/', title: 'Tools' },
    { url: '/datasets/', title: 'Datasets' },
  ];

  pages.forEach(({ url, title }) => {
    test(`should have proper SEO tags on ${url}`, async ({ page }) => {
      await page.goto(url);
      
      // Check title
      await expect(page).toHaveTitle(new RegExp(title));
      
      // Check meta description
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toBeTruthy();
      expect(metaDescription.length).toBeGreaterThan(50);
      expect(metaDescription.length).toBeLessThan(160);
      
      // Check canonical URL
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();
      
      // Check Open Graph tags
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle).toBeTruthy();
      
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      expect(ogDescription).toBeTruthy();
      
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogImage).toBeTruthy();
      
      // Check Twitter Cards
      const twitterCard = await page.locator('meta[property="twitter:card"]').getAttribute('content');
      expect(twitterCard).toBeTruthy();
      
      // Check structured data
      const structuredData = await page.locator('script[type="application/ld+json"]').count();
      expect(structuredData).toBeGreaterThan(0);
    });
  });

  test('should have valid structured data on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Get all structured data scripts
    const scripts = await page.locator('script[type="application/ld+json"]').all();
    
    for (const script of scripts) {
      const content = await script.textContent();
      
      // Validate JSON
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        throw new Error(`Invalid JSON in structured data: ${e}`);
      }
      
      // Check for required schema.org properties
      if (parsed['@type'] === 'Organization') {
        expect(parsed.name).toBe('Caia Tech');
        expect(parsed.url).toContain('caiatech.com');
        expect(parsed.email).toBe('owner@caiatech.com');
      }
      
      if (parsed['@type'] === 'WebSite') {
        expect(parsed.url).toContain('caiatech.com');
        expect(parsed.name).toContain('Caia Tech');
      }
    }
  });

  test('should have robots meta tag', async ({ page }) => {
    await page.goto('/');
    
    const robotsTag = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robotsTag).toContain('index');
    expect(robotsTag).toContain('follow');
  });

  test('should have sitemap accessible', async ({ page }) => {
    const response = await page.goto('/sitemap-index.xml');
    expect(response.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('<?xml');
    expect(content).toContain('sitemap');
  });

  test('should have robots.txt accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('User-agent');
    expect(content).toContain('Sitemap');
  });

  test('articles should have proper metadata', async ({ page }) => {
    await page.goto('/articles/');
    
    // Navigate to first article if exists
    const articleLinks = page.locator('a[href^="/articles/"][href$="/"]');
    const count = await articleLinks.count();
    
    if (count > 0) {
      await articleLinks.first().click();
      
      // Check article metadata
      await expect(page).toHaveTitle(/.+/);
      
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toBeTruthy();
      
      // Check for article schema
      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      const hasArticleSchema = scripts.some(s => s.includes('Article') || s.includes('BlogPosting'));
      expect(hasArticleSchema).toBeTruthy();
    }
  });
});