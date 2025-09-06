import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ArticlesPage } from '../pages/ArticlesPage';
import { ToolsPage } from '../pages/ToolsPage';

test.describe('Navigation Tests', () => {
  test('should navigate between main sections', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Start at home
    await homePage.goto();
    await expect(page).toHaveTitle(/Caia Tech/);
    expect(await homePage.isNavLinkActive('home')).toBeTruthy();
    
    // Navigate to Articles
    await homePage.clickNavLink('articles');
    await expect(page).toHaveURL('/articles/');
    await expect(page).toHaveTitle(/Articles/);
    
    // Navigate to Tools
    await homePage.clickNavLink('tools');
    await expect(page).toHaveURL('/tools/');
    await expect(page).toHaveTitle(/Tools/);
    
    // Navigate to Datasets
    await homePage.clickNavLink('datasets');
    await expect(page).toHaveURL('/datasets/');
    await expect(page).toHaveTitle(/Datasets/);
    
    // Return home via logo
    await homePage.navLogo.click();
    await expect(page).toHaveURL('/');
  });

  test('should maintain terminal aesthetic across navigation', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.goto();
    expect(await homePage.verifyHeroAesthetic()).toBeTruthy();
    
    const articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
    expect(await articlesPage.verifyArticlesAesthetic()).toBeTruthy();
    
    const toolsPage = new ToolsPage(page);
    await toolsPage.goto();
    expect(await toolsPage.verifyToolsAesthetic()).toBeTruthy();
  });

  test('mobile navigation should work', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const homePage = new HomePage(page);
    await homePage.goto();
    
    // Toggle mobile menu
    await homePage.toggleMobileMenu();
    
    // Check if nav links are visible
    await expect(homePage.navArticles).toBeVisible();
    await expect(homePage.navTools).toBeVisible();
    await expect(homePage.navDatasets).toBeVisible();
    
    // Navigate via mobile menu
    await homePage.clickNavLink('articles');
    await expect(page).toHaveURL('/articles/');
  });

  test('should have proper active states', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Check home active state
    await homePage.goto();
    expect(await homePage.isNavLinkActive('home')).toBeTruthy();
    expect(await homePage.isNavLinkActive('articles')).toBeFalsy();
    
    // Check articles active state
    await homePage.clickNavLink('articles');
    expect(await homePage.isNavLinkActive('articles')).toBeTruthy();
    expect(await homePage.isNavLinkActive('home')).toBeFalsy();
  });
});