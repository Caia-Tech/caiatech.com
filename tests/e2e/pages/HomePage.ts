import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly articlesButton: Locator;
  readonly toolsButton: Locator;
  readonly softwareButton: Locator;
  readonly papersButton: Locator;
  readonly booksButton: Locator;
  readonly terminal: Locator;
  readonly terminalLines: Locator;
  readonly contactEmail: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('.hero');
    this.heroTitle = page.locator('h1');
    this.articlesButton = page.locator('.terminal-btn:has-text("articles")');
    this.toolsButton = page.locator('.terminal-btn:has-text("tools")');
    this.softwareButton = page.locator('.terminal-btn:has-text("software")');
    this.papersButton = page.locator('.terminal-btn:has-text("papers")');
    this.booksButton = page.locator('.terminal-btn:has-text("books")');
    this.terminal = page.locator('.terminal');
    this.terminalLines = page.locator('.terminal-line');
    this.contactEmail = page.locator('.contact-email');
  }

  async goto() {
    await super.goto('/');
  }

  async clickHeroButton(button: 'articles' | 'tools' | 'software' | 'papers' | 'books') {
    const buttons = {
      articles: this.articlesButton,
      tools: this.toolsButton,
      software: this.softwareButton,
      papers: this.papersButton,
      books: this.booksButton,
    };
    await buttons[button].click();
  }

  async getTerminalContent() {
    const lines = await this.terminalLines.allTextContents();
    return lines.join('\n');
  }

  async isTerminalVisible() {
    return await this.terminal.isVisible();
  }

  async getContactEmail() {
    return await this.contactEmail.textContent();
  }

  async verifyHeroAesthetic() {
    // Check that the hero maintains the terminal aesthetic
    const hasMonoFont = await this.page.locator('.hero .mono').count() > 0;
    const hasAccentColor = await this.page.locator('.hero .accent').count() > 0;
    const hasTerminalButtons = await this.page.locator('.terminal-btn').count() > 0;
    const hasPromptSymbol = await this.page.locator('.prompt:has-text("$")').count() > 0;
    
    return hasMonoFont && hasAccentColor && hasTerminalButtons && hasPromptSymbol;
  }
}