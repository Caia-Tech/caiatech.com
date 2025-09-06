import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ToolBasePage extends BasePage {
  readonly toolTitle: Locator;
  readonly inputPanel: Locator;
  readonly outputPanel: Locator;
  readonly inputTextarea: Locator;
  readonly outputTextarea: Locator;
  readonly privacyBadge: Locator;
  readonly terminalControls: Locator;
  readonly toolActions: Locator;

  constructor(page: Page, protected toolPath: string) {
    super(page);
    this.toolTitle = page.locator('h1.tool-title, .tool-wrapper h1').first();
    this.inputPanel = page.locator('.input-panel, .terminal-panel').first();
    this.outputPanel = page.locator('.output-panel, .terminal-panel').nth(1);
    this.inputTextarea = page.locator('textarea').first();
    this.outputTextarea = page.locator('textarea').nth(1);
    this.privacyBadge = page.locator('.privacy-guarantee, .attribution-content').first();
    this.terminalControls = page.locator('.terminal-controls');
    this.toolActions = page.locator('.terminal-actions, .tool-actions');
  }

  async goto() {
    await super.goto(`/tools/${this.toolPath}/`);
    await this.page.waitForLoadState('networkidle');
  }

  async verifyToolLoaded() {
    // Check basic tool structure
    await expect(this.toolTitle).toBeVisible();
    await expect(this.inputPanel).toBeVisible();
    
    // Check terminal aesthetic elements
    await expect(this.terminalControls).toBeVisible();
  }

  async verifyPrivacyBadge() {
    // Verify privacy elements are present
    const privacyElements = this.page.locator('.privacy-guarantee, .disclaimer');
    await expect(privacyElements.first()).toBeVisible();
  }

  async inputText(text: string) {
    await this.inputTextarea.fill(text);
    await this.page.waitForTimeout(100); // Allow processing time
  }

  async getOutputText(): Promise<string> {
    return await this.outputTextarea.inputValue();
  }

  async clickButton(buttonText: string) {
    const button = this.page.locator(`button:has-text("${buttonText}")`);
    await button.click();
  }

  async verifyOfflineCapability() {
    // Test that tool works without network requests
    const networkRequests: string[] = [];
    
    this.page.on('request', request => {
      const url = request.url();
      // Only track external requests, not local assets
      if (!url.includes('localhost') && !url.includes('127.0.0.1')) {
        networkRequests.push(url);
      }
    });

    // Perform a basic operation
    await this.inputText('test data');
    await this.page.waitForTimeout(1000);

    // Verify no external network requests were made
    const externalRequests = networkRequests.filter(url => 
      !url.includes('caiatech.com') && 
      !url.includes('localhost') && 
      !url.includes('127.0.0.1')
    );

    expect(externalRequests.length).toBe(0);
  }

  async verifyTerminalAesthetic() {
    // Check for terminal-style elements
    const hasTerminalControls = await this.terminalControls.count() > 0;
    const hasMonospaceFont = await this.page.locator('.mono, [class*="mono"]').count() > 0;
    const hasTerminalTitle = await this.page.locator('.terminal-title').count() > 0;
    
    return hasTerminalControls && (hasMonospaceFont || hasTerminalTitle);
  }
}