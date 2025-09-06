import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('homepage should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check for performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      };
    });
    
    // DOM should be ready quickly
    expect(metrics.domContentLoaded).toBeLessThan(1500);
  });

  test('critical CSS should be inlined', async ({ page }) => {
    await page.goto('/');
    
    // Check that critical styles are present
    const hasInlineStyles = await page.evaluate(() => {
      const styleElements = document.querySelectorAll('style');
      return styleElements.length > 0;
    });
    
    expect(hasInlineStyles).toBeTruthy();
  });

  test('images should be optimized', async ({ page }) => {
    await page.goto('/');
    
    // Check that images have proper attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      
      // Images should have alt text
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      
      // Images should have width/height to prevent layout shift
      const width = await img.getAttribute('width');
      const height = await img.getAttribute('height');
      
      if (width && height) {
        expect(parseInt(width)).toBeGreaterThan(0);
        expect(parseInt(height)).toBeGreaterThan(0);
      }
    }
  });

  test('should have minimal JavaScript payload', async ({ page }) => {
    const coverage = await page.coverage.startJSCoverage();
    await page.goto('/');
    const jsCoverage = await page.coverage.stopJSCoverage();
    
    // Calculate total JS size
    const totalBytes = jsCoverage.reduce((total, entry) => {
      return total + entry.text.length;
    }, 0);
    
    // JS bundle should be reasonably small (< 500KB)
    expect(totalBytes).toBeLessThan(500000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        let cls = 0;
        let fcp = 0;
        let lcp = 0;
        
        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            cls += (entry as any).value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
        
        // First Contentful Paint
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          fcp = fcpEntry.startTime;
        }
        
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          lcp = (lastEntry as any).renderTime || (lastEntry as any).loadTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Give some time to collect metrics
        setTimeout(() => {
          resolve({ cls, fcp, lcp });
        }, 2000);
      });
    });
    
    // Good Core Web Vitals thresholds
    expect(metrics.cls).toBeLessThan(0.1);  // CLS < 0.1 is good
    expect(metrics.fcp).toBeLessThan(1800); // FCP < 1.8s is good
    expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s is good
  });
});