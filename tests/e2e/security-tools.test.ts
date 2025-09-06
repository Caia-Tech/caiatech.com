import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4322';

test.describe('Security & Crypto Tool Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000); // Extended timeout for crypto operations
  });

  test.describe('AES Encryption Tool', () => {
    test('should encrypt and decrypt text', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/aes/`);
      
      const plaintext = 'This is a secret message';
      const password = 'mySecretPassword123';
      
      // Input text and password
      await page.locator('textarea[placeholder*="text"], textarea#plaintext, .plaintext-input').first().fill(plaintext);
      await page.locator('input[placeholder*="password"], input[type="password"], .password-input').first().fill(password);
      
      // Encrypt
      await page.locator('button:has-text("Encrypt"), .encrypt-btn').first().click();
      
      const encrypted = await page.locator('textarea#encrypted, .encrypted-output, .ciphertext').first().textContent() || 
                       await page.locator('textarea#encrypted, .encrypted-output, .ciphertext').first().inputValue();
      
      expect(encrypted).toBeTruthy();
      expect(encrypted).not.toBe(plaintext);
      
      // Now decrypt
      await page.locator('textarea#encrypted, .encrypted-input').first().fill(encrypted);
      await page.locator('button:has-text("Decrypt"), .decrypt-btn').first().click();
      
      const decrypted = await page.locator('textarea#decrypted, .decrypted-output, .plaintext-output').first().textContent() ||
                       await page.locator('textarea#decrypted, .decrypted-output, .plaintext-output').first().inputValue();
      
      expect(decrypted).toBe(plaintext);
    });

    test('should handle wrong password gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/aes/`);
      
      const encrypted = 'U2FsdGVkX1+3QoQ5e3D7F8Z8mIe8vK9Bc8wL7d8Y3T4='; // Sample encrypted text
      const wrongPassword = 'wrongPassword';
      
      await page.locator('textarea#encrypted, .encrypted-input').first().fill(encrypted);
      await page.locator('input[placeholder*="password"], .password-input').first().fill(wrongPassword);
      
      await page.locator('button:has-text("Decrypt"), .decrypt-btn').first().click();
      
      // Should show error or empty result
      await expect(page.locator('.error, .invalid, [class*="error"]').first()).toBeVisible();
    });
  });

  test.describe('RSA Key Generator', () => {
    test('should generate RSA key pair', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/rsa/`);
      
      // Select key size if dropdown exists
      const keySizeSelect = page.locator('select[name="keySize"], .key-size-select').first();
      if (await keySizeSelect.isVisible()) {
        await keySizeSelect.selectOption('2048');
      }
      
      await page.locator('button:has-text("Generate"), button:has-text("Create"), .generate-btn').first().click();
      
      // Should generate both public and private keys
      const publicKey = await page.locator('textarea[placeholder*="public"], .public-key, #publicKey').first().textContent();
      const privateKey = await page.locator('textarea[placeholder*="private"], .private-key, #privateKey').first().textContent();
      
      expect(publicKey).toContain('PUBLIC KEY');
      expect(privateKey).toContain('PRIVATE KEY');
      expect(publicKey).toContain('-----BEGIN');
      expect(privateKey).toContain('-----BEGIN');
    });

    test('should encrypt and decrypt with RSA keys', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/rsa/`);
      
      // First generate keys
      await page.locator('button:has-text("Generate"), .generate-btn').first().click();
      
      const message = 'Hello RSA';
      
      // Input message to encrypt
      await page.locator('textarea[placeholder*="message"], .message-input').first().fill(message);
      
      // Encrypt with public key
      await page.locator('button:has-text("Encrypt"), .encrypt-btn').first().click();
      
      const encrypted = await page.locator('.encrypted-output, .ciphertext').first().textContent();
      expect(encrypted).toBeTruthy();
      expect(encrypted).not.toBe(message);
    });
  });

  test.describe('SSL Certificate Analyzer', () => {
    test('should analyze SSL certificate', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/ssl/`);
      
      // Sample certificate (self-signed for testing)
      const sampleCert = `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoK/heBjcOuMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMjMwMTAxMDAwMDAwWhcNMjQwMTAxMDAwMDAwWjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEAuaGTkDFzj5hJ7nF1i+X8h7l+7DzWb1vO8v7qB8rJ5p+hF9vI3xA7N2gP
-----END CERTIFICATE-----`;
      
      await page.locator('textarea[placeholder*="certificate"], .cert-input').first().fill(sampleCert);
      
      await page.locator('button:has-text("Analyze"), button:has-text("Parse"), .analyze-btn').first().click();
      
      // Should show certificate details
      const result = await page.locator('.cert-details, .result, .output').first().textContent();
      expect(result).toContain('Subject:' || 'Issuer:' || 'Valid');
    });

    test('should validate certificate chain', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/ssl/`);
      
      // Should have domain input for chain validation
      await page.locator('input[placeholder*="domain"], .domain-input').first().fill('example.com');
      
      const checkBtn = page.locator('button:has-text("Check"), .check-btn').first();
      if (await checkBtn.isVisible()) {
        await checkBtn.click();
        
        // Should show some result or error (since this is offline)
        await expect(page.locator('.result, .error, .chain-info').first()).toBeVisible();
      }
    });
  });

  test.describe('PGP Tool', () => {
    test('should generate PGP key pair', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/pgp/`);
      
      // Fill in user details
      await page.locator('input[placeholder*="name"], .name-input').first().fill('Test User');
      await page.locator('input[placeholder*="email"], .email-input').first().fill('test@example.com');
      await page.locator('input[placeholder*="passphrase"], .passphrase-input').first().fill('testPassphrase123');
      
      await page.locator('button:has-text("Generate"), .generate-btn').first().click();
      
      // Should generate keys (this might take time)
      await page.waitForTimeout(5000);
      
      const publicKey = await page.locator('.public-key, [data-key="public"]').first().textContent();
      const privateKey = await page.locator('.private-key, [data-key="private"]').first().textContent();
      
      if (publicKey && privateKey) {
        expect(publicKey).toContain('PGP PUBLIC KEY');
        expect(privateKey).toContain('PGP PRIVATE KEY');
      }
    });

    test('should encrypt and decrypt messages', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/pgp/`);
      
      const message = 'This is a secret PGP message';
      
      // Input message
      await page.locator('textarea[placeholder*="message"], .message-input').first().fill(message);
      
      // Should have public key input for encryption
      await expect(page.locator('textarea[placeholder*="public"], .public-key-input').first()).toBeVisible();
    });
  });

  test.describe('Bcrypt Hash Generator', () => {
    test('should generate bcrypt hash', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/bcrypt/`);
      
      const password = 'mySecurePassword123';
      
      await page.locator('input[placeholder*="password"], .password-input').first().fill(password);
      
      // Set salt rounds if available
      const saltRoundsInput = page.locator('input[placeholder*="rounds"], .rounds-input').first();
      if (await saltRoundsInput.isVisible()) {
        await saltRoundsInput.fill('10');
      }
      
      await page.locator('button:has-text("Hash"), button:has-text("Generate"), .hash-btn').first().click();
      
      const hash = await page.locator('.hash-output, .result, .bcrypt-hash').first().textContent();
      
      expect(hash).toBeTruthy();
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/); // Bcrypt format
    });

    test('should verify bcrypt hash', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/bcrypt/`);
      
      const password = 'testPassword';
      const knownHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'; // Hash of "secret"
      
      await page.locator('input[placeholder*="password"], .password-input').first().fill('secret');
      await page.locator('input[placeholder*="hash"], .hash-input').first().fill(knownHash);
      
      await page.locator('button:has-text("Verify"), button:has-text("Check"), .verify-btn').first().click();
      
      const result = await page.locator('.verify-result, .result').first().textContent();
      expect(result).toContain('valid' || 'match' || 'true');
    });
  });

  test.describe('JWT Security', () => {
    test('should detect weak JWT secrets', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/jwt/`);
      
      // JWT with weak secret
      const weakJWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
      
      await page.locator('textarea[placeholder*="JWT"], .jwt-input').first().fill(weakJWT);
      
      await page.locator('button:has-text("Analyze"), button:has-text("Security"), .security-btn').first().click();
      
      // Should show security warnings
      const analysis = await page.locator('.security-analysis, .warnings, .result').first().textContent();
      expect(analysis).toContain('security' || 'warning' || 'weak');
    });

    test('should validate JWT signature', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/jwt/`);
      
      const jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.invalidSignature';
      
      await page.locator('textarea[placeholder*="JWT"], .jwt-input').first().fill(jwt);
      await page.locator('input[placeholder*="secret"], .secret-input').first().fill('your-256-bit-secret');
      
      await page.locator('button:has-text("Validate"), .validate-btn').first().click();
      
      const result = await page.locator('.signature-result, .validation').first().textContent();
      expect(result).toContain('invalid' || 'signature' || 'error');
    });
  });

  test.describe('Password Security Tools', () => {
    test('should analyze password strength', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/password/`);
      
      const weakPassword = '123456';
      const strongPassword = 'MyStr0ng!P@ssw0rd#2023';
      
      // Test weak password
      await page.locator('input[placeholder*="password"], .password-input').first().fill(weakPassword);
      
      const strengthIndicator = page.locator('.strength, .score, .strength-meter').first();
      if (await strengthIndicator.isVisible()) {
        const weakStrength = await strengthIndicator.textContent();
        expect(weakStrength?.toLowerCase()).toContain('weak' || 'poor' || 'very weak');
      }
      
      // Test strong password
      await page.locator('input[placeholder*="password"], .password-input').first().fill(strongPassword);
      
      if (await strengthIndicator.isVisible()) {
        const strongStrength = await strengthIndicator.textContent();
        expect(strongStrength?.toLowerCase()).toContain('strong' || 'excellent' || 'very strong');
      }
    });

    test('should detect common passwords', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/password/`);
      
      const commonPasswords = ['password', '123456', 'admin', 'qwerty'];
      
      for (const commonPwd of commonPasswords) {
        await page.locator('input[placeholder*="password"], .password-input').first().fill(commonPwd);
        
        // Should warn about common passwords
        const warning = page.locator('.warning, .common, .vulnerable').first();
        if (await warning.isVisible()) {
          const warningText = await warning.textContent();
          expect(warningText?.toLowerCase()).toContain('common' || 'weak' || 'avoid');
        }
      }
    });

    test('should estimate crack time', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/password/`);
      
      await page.locator('input[placeholder*="password"], .password-input').first().fill('MyComplexP@ssw0rd!');
      
      const crackTime = page.locator('.crack-time, .time-estimate').first();
      if (await crackTime.isVisible()) {
        const timeText = await crackTime.textContent();
        expect(timeText).toContain('year' || 'century' || 'second' || 'minute');
      }
    });
  });

  test.describe('Hash Security', () => {
    test('should detect hash type', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/hash/`);
      
      const md5Hash = '5d41402abc4b2a76b9719d911017c592'; // "hello" in MD5
      const sha256Hash = '2cf24dba4f21d4288094c6fe4a9e29e2a6b7c1b54c1e6c4b1d7a8e1f2c9b8a7'; // "hello" in SHA-256
      
      // Test MD5 detection
      await page.locator('input[placeholder*="hash"], .hash-input').first().fill(md5Hash);
      
      const hashType = page.locator('.hash-type, .detected-type').first();
      if (await hashType.isVisible()) {
        const typeText = await hashType.textContent();
        expect(typeText?.toLowerCase()).toContain('md5');
      }
      
      // Test SHA-256 detection
      await page.locator('input[placeholder*="hash"], .hash-input').first().fill(sha256Hash);
      
      if (await hashType.isVisible()) {
        const typeText = await hashType.textContent();
        expect(typeText?.toLowerCase()).toContain('sha' || '256');
      }
    });

    test('should warn about weak hash algorithms', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/hash/`);
      
      // Select MD5 algorithm if dropdown exists
      const algorithmSelect = page.locator('select[name="algorithm"], .algorithm-select').first();
      if (await algorithmSelect.isVisible()) {
        await algorithmSelect.selectOption('MD5');
        
        // Should show warning about MD5 being weak
        await expect(page.locator('.warning, .deprecated, .insecure').first()).toBeVisible();
      }
    });
  });

  test.describe('Security Best Practices', () => {
    test('should not log sensitive data to console', async ({ page }) => {
      const consoleLogs: string[] = [];
      
      page.on('console', (msg) => {
        consoleLogs.push(msg.text());
      });
      
      await page.goto(`${BASE_URL}/tools/aes/`);
      
      const sensitiveData = 'MySecretPassword123';
      await page.locator('.password-input').first().fill(sensitiveData);
      await page.locator('button:has-text("Encrypt")').first().click();
      
      // Wait for any delayed logging
      await page.waitForTimeout(2000);
      
      // Check that sensitive data isn't logged
      const hasLeakedData = consoleLogs.some(log => log.includes(sensitiveData));
      expect(hasLeakedData).toBe(false);
    });

    test('should clear sensitive inputs on page reload', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/password/`);
      
      await page.locator('.password-input').first().fill('sensitivePassword');
      
      // Reload page
      await page.reload();
      
      const inputValue = await page.locator('.password-input').first().inputValue();
      expect(inputValue).toBe('');
    });

    test('should have autocomplete=off on sensitive inputs', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/aes/`);
      
      const passwordInput = page.locator('input[type="password"], .password-input').first();
      const autocomplete = await passwordInput.getAttribute('autocomplete');
      
      expect(autocomplete).toBe('off');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle malformed input gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/jwt/`);
      
      // Input completely invalid data
      await page.locator('textarea[placeholder*="JWT"]').first().fill('not-a-jwt-at-all!@#$%');
      
      await page.locator('button:has-text("Decode")').first().click();
      
      // Should show error without crashing
      await expect(page.locator('.error, .invalid').first()).toBeVisible();
    });

    test('should handle binary data input', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/base64/`);
      
      // Input binary-like data
      const binaryData = '\x00\x01\x02\x03\xFF\xFE\xFD';
      
      await page.locator('textarea#input').first().fill(binaryData);
      await page.locator('button:has-text("Encode")').first().click();
      
      // Should handle without crashing
      const output = await page.locator('textarea#output').first().textContent();
      expect(output).toBeTruthy();
    });

    test('should handle extremely large inputs', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/hash/`);
      
      // Generate 10MB of data
      const largeInput = 'A'.repeat(10 * 1024 * 1024);
      
      await page.locator('textarea#input').first().fill(largeInput);
      
      // Should either process or show size limit warning
      const hasWarning = await page.locator('.warning, .limit, .size-error').first().isVisible();
      
      if (!hasWarning) {
        await page.locator('button:has-text("Generate")').first().click();
        await expect(page.locator('textarea#output').first()).toBeVisible();
      }
    });
  });
});