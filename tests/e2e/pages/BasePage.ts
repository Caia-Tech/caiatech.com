import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly navLogo: Locator;
  readonly navHome: Locator;
  readonly navArticles: Locator;
  readonly navTools: Locator;
  readonly navDatasets: Locator;
  readonly mobileMenuToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navLogo = page.locator('.logo');
    this.navHome = page.locator('a.nav-link:has-text("home")');
    this.navArticles = page.locator('a.nav-link:has-text("articles")');
    this.navTools = page.locator('a.nav-link:has-text("tools")');
    this.navDatasets = page.locator('a.nav-link:has-text("datasets")');
    this.mobileMenuToggle = page.locator('.mobile-menu-toggle');
  }

  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  async clickNavLink(linkName: 'home' | 'articles' | 'tools' | 'datasets') {
    const links = {
      home: this.navHome,
      articles: this.navArticles,
      tools: this.navTools,
      datasets: this.navDatasets,
    };
    await links[linkName].click();
  }

  async toggleMobileMenu() {
    await this.mobileMenuToggle.click();
  }

  async isNavLinkActive(linkName: 'home' | 'articles' | 'tools' | 'datasets') {
    const links = {
      home: this.navHome,
      articles: this.navArticles,
      tools: this.navTools,
      datasets: this.navDatasets,
    };
    return await links[linkName].evaluate((el) => el.classList.contains('active'));
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async checkTerminalAesthetic() {
    // Verify the terminal-style aesthetic is preserved
    const terminalElements = await this.page.locator('.terminal').count();
    const monoFont = await this.page.locator('.mono').count();
    const accentColor = await this.page.locator('.accent').count();
    return terminalElements > 0 || monoFont > 0 || accentColor > 0;
  }
}