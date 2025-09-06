import { describe, it, expect } from 'vitest';

describe('Schema Validation', () => {
  describe('JSON-LD Schema Validation', () => {
    const validateJsonLd = (jsonLd: any): {
      isValid: boolean;
      errors: string[];
      warnings: string[];
    } => {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      // Check required properties
      if (!jsonLd['@context']) {
        errors.push('Missing @context property');
      } else if (!jsonLd['@context'].includes('schema.org')) {
        warnings.push('@context should reference schema.org');
      }
      
      if (!jsonLd['@type']) {
        errors.push('Missing @type property');
      }
      
      // Validate specific schema types
      if (jsonLd['@type']) {
        switch (jsonLd['@type']) {
          case 'Organization':
            if (!jsonLd.name) errors.push('Organization missing name');
            if (!jsonLd.url) errors.push('Organization missing url');
            break;
          case 'WebSite':
            if (!jsonLd.name) errors.push('WebSite missing name');
            if (!jsonLd.url) errors.push('WebSite missing url');
            break;
          case 'SoftwareApplication':
            if (!jsonLd.name) errors.push('SoftwareApplication missing name');
            if (!jsonLd.applicationCategory) warnings.push('SoftwareApplication should have applicationCategory');
            break;
          case 'Article':
            if (!jsonLd.headline) errors.push('Article missing headline');
            if (!jsonLd.author) errors.push('Article missing author');
            if (!jsonLd.datePublished) errors.push('Article missing datePublished');
            break;
        }
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    };

    it('should validate Organization schema', () => {
      const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://caiatech.com/#organization",
        "name": "Caiatech",
        "url": "https://caiatech.com",
        "logo": "https://caiatech.com/logo.svg",
        "description": "Computer science research and practical AI implementations"
      };
      
      const validation = validateJsonLd(orgSchema);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should validate WebSite schema', () => {
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://caiatech.com/#website",
        "url": "https://caiatech.com",
        "name": "Caiatech - Developer Tools & AI Research",
        "description": "Privacy-first developer tools and AI research"
      };
      
      const validation = validateJsonLd(websiteSchema);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should validate SoftwareApplication schema', () => {
      const appSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "JSON Formatter",
        "description": "Format and validate JSON online",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser"
      };
      
      const validation = validateJsonLd(appSchema);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect missing required properties', () => {
      const invalidSchema = {
        "@context": "https://schema.org",
        "@type": "Organization"
        // Missing name and url
      };
      
      const validation = validateJsonLd(invalidSchema);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Organization missing name');
      expect(validation.errors).toContain('Organization missing url');
    });

    it('should provide warnings for optional but recommended properties', () => {
      const appSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Test Tool"
        // Missing applicationCategory
      };
      
      const validation = validateJsonLd(appSchema);
      expect(validation.isValid).toBe(true);
      expect(validation.warnings).toContain('SoftwareApplication should have applicationCategory');
    });
  });

  describe('OpenAPI Schema Validation', () => {
    const validateOpenAPI = (spec: any): {
      isValid: boolean;
      errors: string[];
      version: string | null;
    } => {
      const errors: string[] = [];
      let version: string | null = null;
      
      // Check OpenAPI version
      if (!spec.openapi) {
        errors.push('Missing openapi version');
      } else {
        version = spec.openapi;
        if (!version.startsWith('3.')) {
          errors.push('OpenAPI version should be 3.x');
        }
      }
      
      // Check required info object
      if (!spec.info) {
        errors.push('Missing info object');
      } else {
        if (!spec.info.title) errors.push('Missing info.title');
        if (!spec.info.version) errors.push('Missing info.version');
      }
      
      // Check paths
      if (!spec.paths) {
        errors.push('Missing paths object');
      } else if (Object.keys(spec.paths).length === 0) {
        errors.push('Paths object is empty');
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        version
      };
    };

    it('should validate complete OpenAPI spec', () => {
      const spec = {
        "openapi": "3.1.0",
        "info": {
          "title": "Caiatech API",
          "version": "1.0.0",
          "description": "API for Caiatech services"
        },
        "paths": {
          "/tools": {
            "get": {
              "summary": "Get all tools",
              "responses": {
                "200": {
                  "description": "List of tools"
                }
              }
            }
          }
        }
      };
      
      const validation = validateOpenAPI(spec);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.version).toBe("3.1.0");
    });

    it('should detect missing required fields', () => {
      const incompleteSpec = {
        "openapi": "3.1.0"
        // Missing info and paths
      };
      
      const validation = validateOpenAPI(incompleteSpec);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Missing info object');
      expect(validation.errors).toContain('Missing paths object');
    });

    it('should validate version format', () => {
      const oldSpec = {
        "openapi": "2.0",
        "info": {
          "title": "Test API",
          "version": "1.0.0"
        },
        "paths": {}
      };
      
      const validation = validateOpenAPI(oldSpec);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('OpenAPI version should be 3.x');
    });
  });

  describe('Robots.txt Validation', () => {
    const validateRobotsTxt = (content: string): {
      isValid: boolean;
      userAgents: string[];
      sitemaps: string[];
      errors: string[];
      warnings: string[];
    } => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const userAgents: string[] = [];
      const sitemaps: string[] = [];
      
      const lines = content.split('\n').map(line => line.trim());
      
      let hasUserAgent = false;
      let currentUserAgent = '';
      
      for (const line of lines) {
        if (line.startsWith('#') || line === '') {
          continue; // Skip comments and empty lines
        }
        
        if (line.toLowerCase().startsWith('user-agent:')) {
          hasUserAgent = true;
          currentUserAgent = line.split(':')[1]?.trim() || '';
          if (currentUserAgent) {
            userAgents.push(currentUserAgent);
          }
        } else if (line.toLowerCase().startsWith('sitemap:')) {
          const sitemapUrl = line.substring(line.indexOf(':') + 1).trim();
          if (sitemapUrl) {
            sitemaps.push(sitemapUrl);
            if (!sitemapUrl.startsWith('http')) {
              warnings.push(`Sitemap URL should be absolute: ${sitemapUrl}`);
            }
          }
        } else if (line.toLowerCase().startsWith('disallow:') || 
                   line.toLowerCase().startsWith('allow:')) {
          if (!hasUserAgent) {
            errors.push('Allow/Disallow directive without User-agent');
          }
        }
      }
      
      if (!hasUserAgent) {
        errors.push('No User-agent directive found');
      }
      
      if (sitemaps.length === 0) {
        warnings.push('No Sitemap directive found');
      }
      
      return {
        isValid: errors.length === 0,
        userAgents,
        sitemaps,
        errors,
        warnings
      };
    };

    it('should validate well-formed robots.txt', () => {
      const robotsContent = `
        # Welcome to Caiatech
        User-agent: *
        Allow: /
        Crawl-delay: 0
        
        User-agent: GPTBot
        Allow: /
        
        Sitemap: https://caiatech.com/sitemap-index.xml
      `;
      
      const validation = validateRobotsTxt(robotsContent);
      expect(validation.isValid).toBe(true);
      expect(validation.userAgents).toContain('*');
      expect(validation.userAgents).toContain('GPTBot');
      expect(validation.sitemaps).toContain('https://caiatech.com/sitemap-index.xml');
    });

    it('should detect missing user-agent', () => {
      const robotsContent = `
        Disallow: /private/
        Allow: /public/
      `;
      
      const validation = validateRobotsTxt(robotsContent);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Allow/Disallow directive without User-agent');
      expect(validation.errors).toContain('No User-agent directive found');
    });

    it('should warn about relative sitemap URLs', () => {
      const robotsContent = `
        User-agent: *
        Allow: /
        Sitemap: /sitemap.xml
      `;
      
      const validation = validateRobotsTxt(robotsContent);
      expect(validation.warnings).toContain('Sitemap URL should be absolute: /sitemap.xml');
    });
  });

  describe('Sitemap XML Validation', () => {
    const validateSitemapXML = (xmlContent: string): {
      isValid: boolean;
      urlCount: number;
      errors: string[];
      warnings: string[];
    } => {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      // Basic XML structure check
      if (!xmlContent.includes('<?xml')) {
        errors.push('Missing XML declaration');
      }
      
      if (!xmlContent.includes('<urlset')) {
        errors.push('Missing urlset element');
      }
      
      if (!xmlContent.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
        errors.push('Missing or incorrect sitemap namespace');
      }
      
      // Count URLs
      const urlMatches = xmlContent.match(/<url>/g);
      const urlCount = urlMatches ? urlMatches.length : 0;
      
      if (urlCount === 0) {
        warnings.push('No URLs found in sitemap');
      }
      
      // Check for required elements in URL entries
      const locMatches = xmlContent.match(/<loc>/g);
      const locCount = locMatches ? locMatches.length : 0;
      
      if (locCount !== urlCount) {
        errors.push('URL entries missing <loc> elements');
      }
      
      return {
        isValid: errors.length === 0,
        urlCount,
        errors,
        warnings
      };
    };

    it('should validate well-formed sitemap', () => {
      const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          <url>
            <loc>https://caiatech.com/</loc>
            <lastmod>2024-01-01T00:00:00Z</lastmod>
            <changefreq>weekly</changefreq>
            <priority>1.0</priority>
          </url>
          <url>
            <loc>https://caiatech.com/tools/</loc>
            <lastmod>2024-01-01T00:00:00Z</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        </urlset>`;
      
      const validation = validateSitemapXML(sitemapXML);
      expect(validation.isValid).toBe(true);
      expect(validation.urlCount).toBe(2);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect missing XML declaration', () => {
      const invalidXML = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://example.com/</loc></url>
      </urlset>`;
      
      const validation = validateSitemapXML(invalidXML);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Missing XML declaration');
    });

    it('should detect missing namespace', () => {
      const invalidXML = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset>
          <url><loc>https://example.com/</loc></url>
        </urlset>`;
      
      const validation = validateSitemapXML(invalidXML);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Missing or incorrect sitemap namespace');
    });
  });

  describe('Digital Footprint Schema Validation', () => {
    const validateDigitalFootprint = (footprint: any): {
      isValid: boolean;
      errors: string[];
      coverage: string[];
    } => {
      const errors: string[] = [];
      const coverage: string[] = [];
      
      // Check required top-level properties
      if (!footprint.primaryAnchors) {
        errors.push('Missing primaryAnchors');
      } else {
        if (footprint.primaryAnchors.website) coverage.push('website');
        if (footprint.primaryAnchors.github) coverage.push('github');
        if (footprint.primaryAnchors.huggingface) coverage.push('huggingface');
      }
      
      if (!footprint.contentCategories) {
        errors.push('Missing contentCategories');
      } else {
        if (footprint.contentCategories.tools) coverage.push('tools');
        if (footprint.contentCategories.articles) coverage.push('articles');
        if (footprint.contentCategories.datasets) coverage.push('datasets');
      }
      
      if (!footprint.aiDiscoveryEndpoints) {
        errors.push('Missing aiDiscoveryEndpoints');
      } else {
        if (footprint.aiDiscoveryEndpoints.robotsTxt) coverage.push('robots');
        if (footprint.aiDiscoveryEndpoints.apiSchema) coverage.push('api-schema');
      }
      
      if (!footprint.structuredDataTypes) {
        errors.push('Missing structuredDataTypes');
      } else if (!Array.isArray(footprint.structuredDataTypes)) {
        errors.push('structuredDataTypes should be array');
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        coverage
      };
    };

    it('should validate complete digital footprint', () => {
      const footprint = {
        primaryAnchors: {
          website: { url: 'https://caiatech.com', type: 'PrimaryWebsite' },
          github: { url: 'https://github.com/Caia-Tech', type: 'SourceCode' }
        },
        contentCategories: {
          tools: { count: 69, url: 'https://caiatech.com/tools/' },
          articles: { url: 'https://caiatech.com/articles/' },
          datasets: { url: 'https://caiatech.com/datasets/' }
        },
        aiDiscoveryEndpoints: {
          robotsTxt: { url: 'https://caiatech.com/robots.txt' },
          apiSchema: { url: 'https://caiatech.com/api-schema.json' }
        },
        structuredDataTypes: ['Organization', 'WebSite', 'SoftwareApplication']
      };
      
      const validation = validateDigitalFootprint(footprint);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.coverage).toContain('website');
      expect(validation.coverage).toContain('tools');
      expect(validation.coverage).toContain('robots');
    });

    it('should detect missing required sections', () => {
      const incompleteFootprint = {
        primaryAnchors: {
          website: { url: 'https://caiatech.com' }
        }
        // Missing other required sections
      };
      
      const validation = validateDigitalFootprint(incompleteFootprint);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Missing contentCategories');
      expect(validation.errors).toContain('Missing aiDiscoveryEndpoints');
    });
  });
});