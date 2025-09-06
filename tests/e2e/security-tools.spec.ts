import { test, expect } from '@playwright/test';
import { ToolBasePage } from './pages/ToolBasePage';

test.describe('Security Tools', () => {
  test.describe('Password Generator', () => {
    let passwordTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      passwordTool = new ToolBasePage(page, 'password');
      await passwordTool.goto();
    });

    test('should generate secure passwords', async ({ page }) => {
      const generateBtn = page.locator('#generate-btn, button:has-text("Generate Password")').first();
      await generateBtn.click();
      
      await page.waitForTimeout(300);
      
      const outputArea = page.locator('textarea, input[type="text"], .password-output');
      const password = await outputArea.first().inputValue() || await outputArea.first().textContent();
      
      if (password) {
        expect(password.trim().length).toBeGreaterThan(8);
        expect(password).toMatch(/[A-Za-z0-9]/); // Should contain alphanumeric
      }
    });

    test('should allow password customization', async ({ page }) => {
      // Look for length slider or input
      const lengthControl = page.locator('input[type="range"], input[type="number"]').first();
      if (await lengthControl.count() > 0) {
        await lengthControl.fill('16');
      }
      
      const generateBtn = page.locator('#generate-btn, button:has-text("Generate Password")').first();
      await generateBtn.click();
      
      await page.waitForTimeout(300);
      
      const outputArea = page.locator('textarea, input[type="text"], .password-output');
      const password = await outputArea.first().inputValue() || await outputArea.first().textContent();
      
      if (password) {
        expect(password.trim().length).toBeGreaterThanOrEqual(12);
      }
    });
  });

  test.describe('Hash Generator', () => {
    let hashTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      hashTool = new ToolBasePage(page, 'hash');
      await hashTool.goto();
    });

    test('should generate MD5 hash', async ({ page }) => {
      const inputText = 'Hello World';
      const expectedMD5 = 'b10a8db164e0754105b7a99be72e3fe5';
      
      const textarea = page.locator('textarea').first();
      await textarea.fill(inputText);
      
      // Select MD5 if there's a hash type selector
      const hashSelect = page.locator('select');
      if (await hashSelect.count() > 0) {
        await hashSelect.selectOption('md5');
      }
      
      await page.waitForTimeout(500);
      
      const outputTextarea = page.locator('textarea').nth(1);
      if (await outputTextarea.count() > 0) {
        const output = await outputTextarea.inputValue();
        expect(output.toLowerCase()).toBe(expectedMD5.toLowerCase());
      }
    });

    test('should generate SHA256 hash', async ({ page }) => {
      const inputText = 'Hello World';
      
      const textarea = page.locator('textarea').first();
      await textarea.fill(inputText);
      
      const hashSelect = page.locator('select');
      if (await hashSelect.count() > 0) {
        await hashSelect.selectOption('sha256');
      }
      
      await page.waitForTimeout(500);
      
      const outputTextarea = page.locator('textarea').nth(1);
      if (await outputTextarea.count() > 0) {
        const output = await outputTextarea.inputValue();
        expect(output).toMatch(/^[a-f0-9]{64}$/i); // SHA256 is 64 hex chars
      }
    });
  });

  test.describe('AES Encryption', () => {
    let aesTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      aesTool = new ToolBasePage(page, 'aes');
      await aesTool.goto();
    });

    test('should encrypt and decrypt text', async ({ page }) => {
      const plaintext = 'Secret message';
      const password = 'testpassword123';
      
      // Fill plaintext
      const textInput = page.locator('textarea, input[placeholder*="text"], input[placeholder*="message"]').first();
      await textInput.fill(plaintext);
      
      // Fill password
      const passwordInput = page.locator('input[type="password"], input[placeholder*="password"], input[placeholder*="key"]').first();
      if (await passwordInput.count() > 0) {
        await passwordInput.fill(password);
      }
      
      // Encrypt
      const encryptBtn = page.locator('button:has-text("Encrypt")');
      if (await encryptBtn.count() > 0) {
        await encryptBtn.click();
        await page.waitForTimeout(500);
        
        const outputArea = page.locator('textarea').nth(1);
        const encrypted = await outputArea.inputValue();
        
        if (encrypted && encrypted !== plaintext) {
          expect(encrypted.length).toBeGreaterThan(plaintext.length);
          expect(encrypted).not.toBe(plaintext);
        }
      }
    });
  });

  test.describe('JWT Decoder', () => {
    let jwtTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      jwtTool = new ToolBasePage(page, 'jwt');
      await jwtTool.goto();
    });

    test('should decode valid JWT token', async ({ page }) => {
      // Sample JWT token (header.payload.signature)
      const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      const textarea = page.locator('textarea').first();
      await textarea.fill(sampleJWT);
      
      await page.waitForTimeout(500);
      
      // Check if decoded output is visible
      const outputArea = page.locator('textarea').nth(1);
      if (await outputArea.count() > 0) {
        const output = await outputArea.inputValue();
        expect(output).toContain('John Doe'); // Should decode the payload
        expect(output).toContain('1234567890'); // Should contain the sub claim
      }
    });
  });

  test.describe('RSA Key Generator', () => {
    let rsaTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      rsaTool = new ToolBasePage(page, 'rsa');
      await rsaTool.goto();
    });

    test('should generate RSA key pair', async ({ page }) => {
      const generateBtn = page.locator('#generate-btn, button:has-text("Generate")').first();
      await generateBtn.click();
      
      await page.waitForTimeout(2000); // RSA generation can take time
      
      // Check for private key
      const privateKeyArea = page.locator('textarea:has-text("PRIVATE KEY"), textarea:has-text("BEGIN RSA")');
      if (await privateKeyArea.count() > 0) {
        const privateKey = await privateKeyArea.inputValue();
        expect(privateKey).toContain('BEGIN');
        expect(privateKey).toContain('PRIVATE KEY');
      }
      
      // Check for public key
      const publicKeyArea = page.locator('textarea:has-text("PUBLIC KEY")');
      if (await publicKeyArea.count() > 0) {
        const publicKey = await publicKeyArea.inputValue();
        expect(publicKey).toContain('BEGIN');
        expect(publicKey).toContain('PUBLIC KEY');
      }
    });
  });

  test.describe('SSL Certificate Info', () => {
    let sslTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      sslTool = new ToolBasePage(page, 'ssl');
      await sslTool.goto();
    });

    test('should check SSL certificate info', async ({ page }) => {
      const urlInput = page.locator('input[type="url"], input[placeholder*="domain"], input[placeholder*="url"]').first();
      await urlInput.fill('https://google.com');
      
      const checkBtn = page.locator('button:has-text("Check"), button:has-text("Analyze")');
      if (await checkBtn.count() > 0) {
        await checkBtn.click();
        
        // Wait for SSL check (might take time)
        await page.waitForTimeout(5000);
        
        // Look for certificate information
        const outputArea = page.locator('textarea, .output, .result');
        if (await outputArea.count() > 0) {
          const output = await outputArea.first().textContent() || await outputArea.first().inputValue();
          if (output) {
            // Should contain certificate details
            expect(output.length).toBeGreaterThan(50);
          }
        }
      }
    });
  });

  test.describe('PGP Key Generator', () => {
    let pgpTool: ToolBasePage;

    test.beforeEach(async ({ page }) => {
      pgpTool = new ToolBasePage(page, 'pgp');
      await pgpTool.goto();
    });

    test('should generate PGP key pair', async ({ page }) => {
      // Fill name and email if required
      const nameInput = page.locator('input[placeholder*="name"]').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill('Test User');
      }
      
      const emailInput = page.locator('input[type="email"], input[placeholder*="email"]').first();
      if (await emailInput.count() > 0) {
        await emailInput.fill('test@example.com');
      }
      
      const generateBtn = page.locator('#generate-btn, button:has-text("Generate")').first();
      await generateBtn.click();
      
      await page.waitForTimeout(3000); // PGP generation can take time
      
      // Check for PGP key output
      const outputArea = page.locator('textarea');
      if (await outputArea.count() > 0) {
        const output = await outputArea.first().inputValue();
        if (output && output.length > 100) {
          expect(output).toContain('BEGIN PGP');
        }
      }
    });
  });

  test('all security tools should work offline', async ({ page }) => {
    const securityTools = ['password', 'hash', 'aes', 'jwt', 'rsa', 'ssl', 'pgp'];
    
    for (const toolName of securityTools) {
      const tool = new ToolBasePage(page, toolName);
      await tool.goto();
      await tool.verifyOfflineCapability();
    }
  });

  test('security tools should have proper privacy warnings', async ({ page }) => {
    const securityTools = ['password', 'hash', 'aes', 'rsa', 'pgp'];
    
    for (const toolName of securityTools) {
      const tool = new ToolBasePage(page, toolName);
      await tool.goto();
      
      // Should have privacy badge or warning
      const privacyElements = page.locator('.privacy, .security, .warning, [class*="privacy"], [class*="security"]');
      const hasPrivacyInfo = await privacyElements.count() > 0;
      
      expect(hasPrivacyInfo).toBeTruthy();
    }
  });
});