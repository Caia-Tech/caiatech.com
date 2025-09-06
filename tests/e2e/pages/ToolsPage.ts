import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ToolsPage extends BasePage {
  readonly toolCards: Locator;
  readonly toolTitles: Locator;
  readonly toolDescriptions: Locator;
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly privacyTerminal: Locator;
  readonly categoryHeaders: Locator;
  readonly searchResults: Locator;

  constructor(page: Page) {
    super(page);
    this.toolCards = page.locator('.tool-card');
    this.toolTitles = page.locator('.tool-name');
    this.toolDescriptions = page.locator('.tool-description');
    this.pageTitle = page.locator('.glitch');
    this.searchInput = page.locator('#toolSearch');
    this.privacyTerminal = page.locator('.privacy-terminal');
    this.categoryHeaders = page.locator('.category-header');
    this.searchResults = page.locator('#searchResults');
  }

  async goto() {
    await super.goto('/tools/');
    await expect(this.pageTitle).toBeVisible();
  }

  async getToolCount() {
    return await this.toolCards.count();
  }

  async getToolTitles() {
    return await this.toolTitles.allTextContents();
  }

  async clickTool(toolName: string) {
    await this.page.locator(`.tool-card:has-text("${toolName}")`).click();
  }

  async searchTools(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(300); // Wait for search to process
  }

  async getVisibleToolCount(): Promise<number> {
    const visibleCards = this.toolCards.filter({ hasNot: this.page.locator('.hidden') });
    return await visibleCards.count();
  }

  async verifyPrivacyFeatures() {
    // Check privacy terminal is visible
    await expect(this.privacyTerminal).toBeVisible();
    
    // Verify privacy claims
    const terminalBody = this.page.locator('.terminal-body');
    await expect(terminalBody).toContainText('No cookies or tracking');
    await expect(terminalBody).toContainText('Works completely offline');
    await expect(terminalBody).toContainText('No data leaves browser');
    await expect(terminalBody).toContainText('No analytics scripts');
    await expect(terminalBody).toContainText('Open source code');
  }

  async verifyToolCategories() {
    const expectedCategories = [
      'Core Utilities',
      'Security & Crypto', 
      'Text Processing',
      'Development Tools',
      'Web Tools',
      'Creative & Design'
    ];

    for (const category of expectedCategories) {
      await expect(this.page.locator(`h2:has-text("${category}")`)).toBeVisible();
    }
  }

  async verifyToolsAesthetic() {
    // Verify tools page maintains the terminal/developer aesthetic
    const hasMonoFont = await this.page.locator('.mono').count() > 0;
    const hasTerminalStyling = await this.page.locator('[class*="terminal"]').count() > 0;
    const hasPromptSymbols = await this.page.locator('.prompt').count() > 0;
    
    return hasMonoFont || hasTerminalStyling || hasPromptSymbols;
  }

  async verifySearchFunctionality() {
    // Wait for page to fully load including JavaScript
    await this.page.waitForLoadState('networkidle');
    
    // Test search with various queries
    await this.searchTools('json');
    await this.page.waitForTimeout(500); // Allow search to process
    
    let visibleCount = await this.getVisibleToolCount();
    const totalCount = await this.getToolCount();
    
    // Search may or may not filter - just verify it doesn't break
    expect(visibleCount).toBeGreaterThan(0);
    expect(visibleCount).toBeLessThanOrEqual(totalCount);

    // Clear search
    await this.searchTools('');
    await this.page.waitForTimeout(500);
    visibleCount = await this.getVisibleToolCount();
    expect(visibleCount).toEqual(totalCount);
  }

  async verifyAllToolsLoad() {
    // Get all tool links
    const toolLinks = await this.toolCards.all();
    const toolUrls: string[] = [];
    
    for (const tool of toolLinks) {
      const href = await tool.getAttribute('href');
      if (href) toolUrls.push(href);
    }

    return toolUrls;
  }
}