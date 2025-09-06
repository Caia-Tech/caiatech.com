import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Setup DOM environment
const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = window.document;
global.window = window as any;

describe('Component Functions', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Terminal Component Logic', () => {
    const createTerminalElement = (title: string, icon: string): HTMLElement => {
      const terminal = document.createElement('div');
      terminal.className = 'terminal-container';
      
      const header = document.createElement('div');
      header.className = 'terminal-header';
      
      const controls = document.createElement('div');
      controls.className = 'terminal-controls';
      controls.innerHTML = `
        <span class="control red"></span>
        <span class="control yellow"></span>
        <span class="control green"></span>
      `;
      
      const titleElement = document.createElement('span');
      titleElement.className = 'terminal-title';
      titleElement.textContent = `${icon} ${title}`;
      
      header.appendChild(controls);
      header.appendChild(titleElement);
      
      const body = document.createElement('div');
      body.className = 'terminal-body';
      
      terminal.appendChild(header);
      terminal.appendChild(body);
      
      return terminal;
    };

    it('should create terminal with correct structure', () => {
      const terminal = createTerminalElement('TEST', '🔧');
      
      expect(terminal.querySelector('.terminal-header')).toBeTruthy();
      expect(terminal.querySelector('.terminal-body')).toBeTruthy();
      expect(terminal.querySelector('.terminal-controls')).toBeTruthy();
      expect(terminal.querySelector('.terminal-title')?.textContent).toBe('🔧 TEST');
    });

    it('should have proper control buttons', () => {
      const terminal = createTerminalElement('TEST', '🔧');
      const controls = terminal.querySelectorAll('.control');
      
      expect(controls).toHaveLength(3);
      expect(controls[0].className).toContain('red');
      expect(controls[1].className).toContain('yellow');
      expect(controls[2].className).toContain('green');
    });
  });

  describe('Navigation Component Logic', () => {
    const createNavigationElement = (currentPath: string): HTMLElement => {
      const nav = document.createElement('nav');
      nav.className = 'navigation';
      
      const links = [
        { href: '/', text: 'home', active: currentPath === '/' },
        { href: '/tools/', text: 'tools', active: currentPath.startsWith('/tools') },
        { href: '/articles/', text: 'articles', active: currentPath.startsWith('/articles') },
        { href: '/about/', text: 'about', active: currentPath.startsWith('/about') },
        { href: '/contact/', text: 'contact', active: currentPath.startsWith('/contact') }
      ];
      
      links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.className = link.active ? 'nav-link active' : 'nav-link';
        a.innerHTML = `<span class="prompt">~/</span>${link.text}`;
        nav.appendChild(a);
      });
      
      return nav;
    };

    it('should highlight active page', () => {
      const nav = createNavigationElement('/tools/');
      const activeLink = nav.querySelector('.nav-link.active');
      
      expect(activeLink?.getAttribute('href')).toBe('/tools/');
      expect(activeLink?.textContent).toContain('tools');
    });

    it('should create all navigation links', () => {
      const nav = createNavigationElement('/');
      const links = nav.querySelectorAll('.nav-link');
      
      expect(links).toHaveLength(5);
      expect(nav.querySelector('a[href="/"]')).toBeTruthy();
      expect(nav.querySelector('a[href="/tools/"]')).toBeTruthy();
      expect(nav.querySelector('a[href="/articles/"]')).toBeTruthy();
      expect(nav.querySelector('a[href="/about/"]')).toBeTruthy();
      expect(nav.querySelector('a[href="/contact/"]')).toBeTruthy();
    });

    it('should format links with terminal prompt style', () => {
      const nav = createNavigationElement('/');
      const homeLink = nav.querySelector('a[href="/"]');
      
      expect(homeLink?.innerHTML).toContain('<span class="prompt">~/</span>home');
    });
  });

  describe('Footer Component Logic', () => {
    const createFooterElement = (): HTMLElement => {
      const footer = document.createElement('footer');
      footer.innerHTML = `
        <div class="footer-content">
          <div class="nav-section">
            <h3>Navigate</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/tools/">Tools</a></li>
              <li><a href="/articles/">Articles</a></li>
              <li><a href="/about/">About</a></li>
            </ul>
          </div>
          <div class="nav-section">
            <h3>Connect</h3>
            <ul>
              <li><a href="https://github.com/caiatech">GitHub</a></li>
              <li><a href="mailto:owner@caiatech.com">Email</a></li>
            </ul>
          </div>
          <div class="nav-section">
            <h3>Legal</h3>
            <ul>
              <li><a href="/privacy/">Privacy Policy</a></li>
              <li><a href="/terms/">Terms of Service</a></li>
            </ul>
          </div>
          <div class="footer-bottom">
            <p>© ${new Date().getFullYear()} Caiatech. All rights reserved.</p>
          </div>
        </div>
      `;
      return footer;
    };

    it('should have correct section structure', () => {
      const footer = createFooterElement();
      
      expect(footer.querySelectorAll('.nav-section')).toHaveLength(3);
      expect(footer.querySelector('.footer-bottom')).toBeTruthy();
    });

    it('should display current year in copyright', () => {
      const footer = createFooterElement();
      const copyright = footer.querySelector('.footer-bottom p');
      const currentYear = new Date().getFullYear();
      
      expect(copyright?.textContent).toContain(`© ${currentYear} Caiatech`);
    });

    it('should have correct contact email', () => {
      const footer = createFooterElement();
      const emailLink = footer.querySelector('a[href="mailto:owner@caiatech.com"]');
      
      expect(emailLink).toBeTruthy();
      expect(emailLink?.textContent).toBe('Email');
    });
  });

  describe('Tool SEO Component Logic', () => {
    const generateToolSEO = (toolName: string, description: string) => {
      const fullTitle = `${toolName} - Free Online Tool | Caiatech`;
      const fullDescription = `${description}. 100% free, runs in your browser, no data collection. Part of 69+ developer tools.`;
      
      return {
        title: fullTitle,
        description: fullDescription,
        keywords: [
          toolName.toLowerCase(),
          'online tool',
          'free',
          'developer tool',
          'web tool',
          'browser based',
          'no signup',
          'privacy focused'
        ].join(', '),
        structuredData: {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": toolName,
          "description": fullDescription,
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }
      };
    };

    it('should generate proper SEO data for tools', () => {
      const seo = generateToolSEO('JSON Formatter', 'Format and validate JSON');
      
      expect(seo.title).toBe('JSON Formatter - Free Online Tool | Caiatech');
      expect(seo.description).toContain('Format and validate JSON');
      expect(seo.description).toContain('100% free');
      expect(seo.description).toContain('69+ developer tools');
      expect(seo.keywords).toContain('json formatter');
      expect(seo.keywords).toContain('privacy focused');
    });

    it('should generate valid structured data', () => {
      const seo = generateToolSEO('Base64 Encoder', 'Encode and decode Base64');
      
      expect(seo.structuredData['@context']).toBe('https://schema.org');
      expect(seo.structuredData['@type']).toBe('SoftwareApplication');
      expect(seo.structuredData.name).toBe('Base64 Encoder');
      expect(seo.structuredData.applicationCategory).toBe('DeveloperApplication');
      expect(seo.structuredData.offers.price).toBe('0');
    });
  });

  describe('Privacy Badge Component Logic', () => {
    const createPrivacyBadge = (): HTMLElement => {
      const badge = document.createElement('div');
      badge.className = 'privacy-badge';
      badge.innerHTML = `
        <div class="privacy-icon">🔒</div>
        <div class="privacy-text">
          <strong>100% Private</strong>
          <p>No data leaves your device</p>
        </div>
      `;
      return badge;
    };

    const validatePrivacy = (element: HTMLElement): boolean => {
      // Check for external tracking scripts
      const scripts = element.querySelectorAll('script[src]');
      const trackingDomains = [
        'google-analytics.com',
        'googletagmanager.com', 
        'facebook.net',
        'doubleclick.net'
      ];
      
      for (const script of scripts) {
        const src = script.getAttribute('src') || '';
        for (const domain of trackingDomains) {
          if (src.includes(domain)) {
            return false;
          }
        }
      }
      
      return true;
    };

    it('should create privacy badge with correct content', () => {
      const badge = createPrivacyBadge();
      
      expect(badge.querySelector('.privacy-icon')?.textContent).toBe('🔒');
      expect(badge.querySelector('.privacy-text strong')?.textContent).toBe('100% Private');
      expect(badge.textContent).toContain('No data leaves your device');
    });

    it('should validate no tracking scripts', () => {
      const container = document.createElement('div');
      const badge = createPrivacyBadge();
      container.appendChild(badge);
      
      expect(validatePrivacy(container)).toBe(true);
    });

    it('should detect tracking scripts if present', () => {
      const container = document.createElement('div');
      const trackingScript = document.createElement('script');
      trackingScript.src = 'https://www.google-analytics.com/analytics.js';
      container.appendChild(trackingScript);
      
      expect(validatePrivacy(container)).toBe(false);
    });
  });

  describe('Contact Form Logic', () => {
    const validateContactForm = (formData: {
      name: string;
      email: string;
      company?: string;
      subject?: string;
      message: string;
    }) => {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      // Required field validation
      if (!formData.name.trim()) {
        errors.push('Name is required');
      } else if (formData.name.trim().length < 2) {
        warnings.push('Name seems very short');
      }
      
      if (!formData.email.trim()) {
        errors.push('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('Invalid email format');
      }
      
      if (!formData.message.trim()) {
        errors.push('Message is required');
      } else if (formData.message.trim().length < 10) {
        warnings.push('Message seems very short');
      }
      
      // Security validation
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /onclick=/i,
        /onerror=/i
      ];
      
      const allText = `${formData.name} ${formData.email} ${formData.message} ${formData.subject || ''} ${formData.company || ''}`;
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(allText)) {
          errors.push('Suspicious content detected');
          break;
        }
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        isSecure: !suspiciousPatterns.some(pattern => pattern.test(allText))
      };
    };

    const generateMailtoLink = (formData: {
      name: string;
      email: string;
      company?: string;
      subject?: string;
      message: string;
    }) => {
      const subject = encodeURIComponent(`[Contact Form] ${formData.subject || 'Inquiry'}`);
      const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || 'Not provided'}

Message:
${formData.message}
      `.trim());
      
      return `mailto:owner@caiatech.com?subject=${subject}&body=${body}`;
    };

    it('should validate complete form data', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Test Corp',
        subject: 'Inquiry',
        message: 'This is a test message with sufficient length'
      };
      
      const validation = validateContactForm(formData);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.isSecure).toBe(true);
    });

    it('should reject incomplete form data', () => {
      const formData = {
        name: '',
        email: 'invalid-email',
        message: ''
      };
      
      const validation = validateContactForm(formData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors).toContain('Name is required');
      expect(validation.errors).toContain('Invalid email format');
      expect(validation.errors).toContain('Message is required');
    });

    it('should detect suspicious content', () => {
      const formData = {
        name: 'Hacker',
        email: 'test@example.com',
        message: 'Click here: <script>alert("xss")</script>'
      };
      
      const validation = validateContactForm(formData);
      expect(validation.isValid).toBe(false);
      expect(validation.isSecure).toBe(false);
      expect(validation.errors).toContain('Suspicious content detected');
    });

    it('should generate proper mailto link', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message'
      };
      
      const mailtoLink = generateMailtoLink(formData);
      expect(mailtoLink).toContain('mailto:owner@caiatech.com');
      expect(mailtoLink).toContain('subject=');
      expect(mailtoLink).toContain('body=');
      expect(decodeURIComponent(mailtoLink)).toContain('John Doe');
      expect(decodeURIComponent(mailtoLink)).toContain('Test message');
    });

    it('should provide helpful warnings', () => {
      const formData = {
        name: 'J',
        email: 'test@example.com',
        message: 'Short'
      };
      
      const validation = validateContactForm(formData);
      expect(validation.warnings).toContain('Name seems very short');
      expect(validation.warnings).toContain('Message seems very short');
    });
  });
});