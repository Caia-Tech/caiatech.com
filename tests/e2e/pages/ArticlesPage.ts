import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlesPage extends BasePage {
  readonly articleCards: Locator;
  readonly articleTitles: Locator;
  readonly articleDescriptions: Locator;
  readonly articleDates: Locator;
  readonly articleTags: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.articleCards = page.locator('.article-card');
    this.articleTitles = page.locator('.article-title');
    this.articleDescriptions = page.locator('.article-description');
    this.articleDates = page.locator('.article-date');
    this.articleTags = page.locator('.article-tag');
    this.pageTitle = page.locator('h1');
  }

  async goto() {
    await super.goto('/articles/');
  }

  async getArticleCount() {
    return await this.articleCards.count();
  }

  async getArticleTitles() {
    return await this.articleTitles.allTextContents();
  }

  async clickArticle(index: number) {
    await this.articleCards.nth(index).click();
  }

  async getArticleByTitle(title: string) {
    return this.page.locator(`.article-card:has-text("${title}")`);
  }

  async getArticleTags(articleIndex: number) {
    const article = this.articleCards.nth(articleIndex);
    const tags = await article.locator('.article-tag').allTextContents();
    return tags;
  }

  async hasTag(tag: string) {
    return await this.page.locator(`.article-tag:has-text("${tag}")`).count() > 0;
  }

  async verifyArticlesAesthetic() {
    // Verify the articles page maintains the terminal aesthetic
    const hasMonoFont = await this.page.locator('.mono').count() > 0;
    const hasTerminalStyling = await this.page.locator('[class*="terminal"]').count() > 0;
    const hasDarkBackground = await this.page.evaluate(() => {
      const body = document.body;
      const bgColor = window.getComputedStyle(body).backgroundColor;
      return bgColor.includes('10, 10, 11') || bgColor.includes('#0a0a0b');
    });
    
    return hasMonoFont || hasTerminalStyling || hasDarkBackground;
  }
}