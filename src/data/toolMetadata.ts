/**
 * Tool metadata for SEO optimization
 * Each tool gets a unique, keyword-rich meta description
 */

export interface ToolMetadata {
  title: string;
  description: string;
  keywords: string[];
}

export const toolMetadata: Record<string, ToolMetadata> = {
  // Core Utilities
  'json': {
    title: 'JSON Formatter & Validator - Free Online JSON Beautifier',
    description: 'Format, validate, and beautify JSON data instantly. Professional JSON formatter with syntax highlighting, error detection, and minification. 100% client-side processing.',
    keywords: ['JSON formatter', 'JSON validator', 'JSON beautifier', 'JSON parser', 'JSON minifier']
  },
  'base64': {
    title: 'Base64 Encoder & Decoder - Convert Text to Base64 Online',
    description: 'Encode and decode Base64 data instantly. Convert text, files, and binary data to Base64 format. Supports UTF-8 encoding. Works offline in your browser.',
    keywords: ['Base64 encoder', 'Base64 decoder', 'Base64 converter', 'encode Base64', 'decode Base64']
  },
  'uuid': {
    title: 'UUID Generator - Create Unique Identifiers Online',
    description: 'Generate UUID v4, v1, and NIL UUIDs instantly. Create unique identifiers for databases, APIs, and applications. Bulk generation with custom formatting options.',
    keywords: ['UUID generator', 'GUID generator', 'unique identifier', 'UUID v4', 'random UUID']
  },
  'url': {
    title: 'URL Encoder & Decoder - Percent Encoding Tool',
    description: 'URL encode and decode strings for safe transmission. Handle special characters, spaces, and Unicode. Essential tool for web developers working with URLs.',
    keywords: ['URL encoder', 'URL decoder', 'percent encoding', 'URL escape', 'URI encoding']
  },
  'hex': {
    title: 'Hex Converter - Hexadecimal to Text Conversion Tool',
    description: 'Convert between hexadecimal, text, binary, and decimal formats. Hex editor with color code support. Perfect for debugging and data analysis.',
    keywords: ['hex converter', 'hexadecimal converter', 'hex to text', 'hex to binary', 'hex editor']
  },
  'binary': {
    title: 'Binary Converter - Binary, Hex, Decimal Conversion',
    description: 'Convert between binary, hexadecimal, decimal, and text formats. Educational tool for understanding number systems and data representation.',
    keywords: ['binary converter', 'binary to text', 'binary to decimal', 'binary to hex', 'number systems']
  },
  
  // Security & Crypto
  'hash': {
    title: 'Hash Generator - MD5, SHA-256, SHA-512 Online',
    description: 'Generate cryptographic hashes using MD5, SHA-256, SHA-512, and more. Calculate file checksums and verify data integrity. Secure client-side hashing.',
    keywords: ['hash generator', 'MD5 hash', 'SHA-256', 'SHA-512', 'checksum calculator']
  },
  'password': {
    title: 'Password Generator - Create Strong Secure Passwords',
    description: 'Generate strong, secure passwords with custom length and character sets. Create memorable passphrases and check password strength. No data stored or transmitted.',
    keywords: ['password generator', 'secure password', 'strong password', 'random password', 'password creator']
  },
  'jwt': {
    title: 'JWT Debugger - Decode and Verify JWT Tokens',
    description: 'Decode, verify, and inspect JWT tokens. View header, payload, and signature. Debug authentication issues and validate token claims. Works entirely offline.',
    keywords: ['JWT debugger', 'JWT decoder', 'JWT token', 'JSON Web Token', 'JWT validator']
  },
  'rsa': {
    title: 'RSA Key Generator - Create RSA Key Pairs Online',
    description: 'Generate RSA public and private key pairs for encryption and digital signatures. Multiple key sizes supported. Export keys in PEM format.',
    keywords: ['RSA key generator', 'RSA keys', 'public key', 'private key', 'RSA encryption']
  },
  'bcrypt': {
    title: 'Bcrypt Hash Generator - Password Hashing Tool',
    description: 'Generate and verify bcrypt password hashes. Adjustable cost factor for security. Industry-standard password hashing for applications.',
    keywords: ['bcrypt generator', 'bcrypt hash', 'password hashing', 'bcrypt verify', 'secure hashing']
  },
  'aes': {
    title: 'AES Encryption Tool - Encrypt & Decrypt with AES',
    description: 'Encrypt and decrypt text using AES encryption. Support for multiple key sizes and modes. Secure client-side encryption for sensitive data.',
    keywords: ['AES encryption', 'AES decrypt', 'symmetric encryption', 'AES-256', 'data encryption']
  },
  'pgp': {
    title: 'PGP Toolkit - Generate PGP Keys and Encrypt Messages',
    description: 'Generate PGP key pairs, encrypt messages, and create digital signatures. Full OpenPGP implementation running in your browser.',
    keywords: ['PGP encryption', 'PGP keys', 'OpenPGP', 'PGP generator', 'email encryption']
  },
  'ssh-key': {
    title: 'SSH Key Generator - Create SSH Key Pairs',
    description: 'Generate SSH key pairs for secure server access. Support for RSA, DSA, and ECDSA algorithms. Export keys in OpenSSH format.',
    keywords: ['SSH key generator', 'SSH keys', 'RSA SSH', 'SSH keygen', 'public SSH key']
  },
  'ssl': {
    title: 'SSL Certificate Checker - Verify SSL/TLS Certificates',
    description: 'Check SSL certificate details, expiration dates, and chain validity. Debug HTTPS issues and verify certificate installations.',
    keywords: ['SSL checker', 'SSL certificate', 'TLS checker', 'certificate validator', 'HTTPS checker']
  },
  
  // Text & Format
  'diff': {
    title: 'Diff Checker - Compare Text Differences Online',
    description: 'Compare two texts and highlight differences line by line. Visual diff tool with side-by-side and unified views. Perfect for code reviews.',
    keywords: ['diff checker', 'text comparison', 'file diff', 'compare text', 'difference checker']
  },
  'regex': {
    title: 'Regex Tester - Test Regular Expressions Online',
    description: 'Test and debug regular expressions with real-time matching. Support for multiple regex flavors. Includes pattern explanation and match highlighting.',
    keywords: ['regex tester', 'regular expression', 'regex validator', 'pattern matching', 'regex debugger']
  },
  'markdown': {
    title: 'Markdown Editor - Live Preview Markdown Editor',
    description: 'Write and preview Markdown with live rendering. Export to HTML, PDF, or plain text. Full CommonMark and GFM support with syntax highlighting.',
    keywords: ['markdown editor', 'markdown preview', 'markdown to HTML', 'markdown converter', 'live markdown']
  },
  'case': {
    title: 'Case Converter - Change Text Case Online',
    description: 'Convert text between uppercase, lowercase, title case, camelCase, snake_case, and more. Bulk text transformation for any programming style.',
    keywords: ['case converter', 'text case', 'camelCase', 'snake_case', 'title case converter']
  },
  'lorem': {
    title: 'Lorem Ipsum Generator - Placeholder Text Generator',
    description: 'Generate Lorem Ipsum placeholder text for designs and mockups. Customizable word, paragraph, and list generation. Multiple language support.',
    keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'lorem generator', 'sample text']
  },
  'word-counter': {
    title: 'Word Counter - Count Words and Characters Online',
    description: 'Count words, characters, sentences, and paragraphs in your text. Reading time estimate and keyword density analysis. Real-time statistics.',
    keywords: ['word counter', 'character counter', 'text counter', 'word count tool', 'character count']
  },
  'text-stats': {
    title: 'Text Statistics Analyzer - Readability and Metrics',
    description: 'Analyze text readability, complexity, and statistics. Calculate Flesch score, reading level, and linguistic metrics. SEO content optimization.',
    keywords: ['text analyzer', 'readability score', 'text statistics', 'content analysis', 'reading level']
  },
  'escape': {
    title: 'Escape/Unescape Tool - HTML, JavaScript, SQL Escaping',
    description: 'Escape and unescape special characters for HTML, JavaScript, SQL, and more. Prevent injection attacks and handle special characters safely.',
    keywords: ['escape characters', 'unescape', 'HTML escape', 'JavaScript escape', 'SQL escape']
  },
  
  // Code Tools
  'minify': {
    title: 'Code Minifier - Minify JavaScript, CSS, HTML',
    description: 'Minify JavaScript, CSS, and HTML code to reduce file size. Remove whitespace, comments, and optimize for production. Instant compression.',
    keywords: ['code minifier', 'JavaScript minifier', 'CSS minifier', 'HTML minifier', 'compress code']
  },
  'beautify': {
    title: 'Code Beautifier - Format and Beautify Code',
    description: 'Beautify and format JavaScript, CSS, HTML, JSON, and XML. Customizable indentation and formatting rules. Make code readable and consistent.',
    keywords: ['code beautifier', 'code formatter', 'prettify code', 'format JavaScript', 'beautify HTML']
  },
  'sql': {
    title: 'SQL Formatter - Format and Beautify SQL Queries',
    description: 'Format SQL queries with proper indentation and syntax highlighting. Support for multiple SQL dialects. Optimize query readability.',
    keywords: ['SQL formatter', 'SQL beautifier', 'format SQL', 'SQL query formatter', 'SQL prettify']
  },
  'js-formatter': {
    title: 'JavaScript Formatter - Format JS Code Online',
    description: 'Format JavaScript and TypeScript code with configurable style rules. ES6+ support with JSX formatting. Professional code formatting.',
    keywords: ['JavaScript formatter', 'JS formatter', 'format JavaScript', 'TypeScript formatter', 'ES6 formatter']
  },
  'css-formatter': {
    title: 'CSS Formatter - Format and Beautify CSS',
    description: 'Format CSS and SCSS code with proper indentation. Organize properties, add vendor prefixes, and optimize stylesheets. Support for CSS3 and SASS.',
    keywords: ['CSS formatter', 'CSS beautifier', 'format CSS', 'SCSS formatter', 'stylesheet formatter']
  },
  'prettify': {
    title: 'Code Prettifier - Universal Code Formatter',
    description: 'Prettify any code with automatic language detection. Support for 100+ programming languages. Consistent formatting across all file types.',
    keywords: ['code prettifier', 'prettify code', 'universal formatter', 'code formatting', 'syntax formatter']
  },
  
  // Data Formats
  'yaml': {
    title: 'YAML Validator - Validate and Format YAML',
    description: 'Validate YAML syntax and convert between YAML and JSON. Debug configuration files and ensure proper formatting. Real-time error detection.',
    keywords: ['YAML validator', 'YAML formatter', 'YAML to JSON', 'validate YAML', 'YAML parser']
  },
  'xml': {
    title: 'XML Formatter - Format and Validate XML',
    description: 'Format, validate, and minify XML documents. Tree view visualization and XPath support. Convert between XML and JSON formats.',
    keywords: ['XML formatter', 'XML validator', 'format XML', 'XML beautifier', 'XML to JSON']
  },
  'csv': {
    title: 'CSV Editor - Edit and Convert CSV Files',
    description: 'Edit CSV files with a spreadsheet-like interface. Convert between CSV, JSON, and Excel formats. Handle large datasets efficiently.',
    keywords: ['CSV editor', 'CSV converter', 'CSV to JSON', 'CSV viewer', 'CSV parser']
  },
  'html-entities': {
    title: 'HTML Entity Encoder - Encode Special Characters',
    description: 'Encode and decode HTML entities. Convert special characters to HTML-safe format. Handle Unicode and named entities.',
    keywords: ['HTML entities', 'HTML encoder', 'HTML escape', 'entity encoder', 'special characters']
  },
  
  // Network & Web
  'api': {
    title: 'API Tester - Test REST APIs Online',
    description: 'Test REST APIs with custom headers, authentication, and request bodies. Support for GET, POST, PUT, DELETE. Debug API responses.',
    keywords: ['API tester', 'REST API tester', 'API client', 'HTTP client', 'API debugger']
  },
  'webhook': {
    title: 'Webhook Tester - Test and Debug Webhooks',
    description: 'Test webhook endpoints and inspect payloads. Generate unique URLs for webhook testing. Debug webhook integrations easily.',
    keywords: ['webhook tester', 'webhook debugger', 'test webhooks', 'webhook URL', 'webhook inspector']
  },
  'dns': {
    title: 'DNS Lookup Tool - DNS Record Checker',
    description: 'Lookup DNS records including A, AAAA, MX, TXT, and more. Diagnose DNS issues and verify domain configurations. Multiple DNS servers supported.',
    keywords: ['DNS lookup', 'DNS checker', 'DNS records', 'domain lookup', 'DNS query']
  },
  'ip': {
    title: 'IP Address Tools - IP Lookup and Utilities',
    description: 'IP address lookup, geolocation, and subnet calculator. Convert between IPv4 and IPv6. Network troubleshooting utilities.',
    keywords: ['IP lookup', 'IP address', 'IP geolocation', 'subnet calculator', 'IPv4 IPv6']
  },
  'ports': {
    title: 'Port Checker - Network Port Reference',
    description: 'Common network port reference and port scanner. Check open ports and service assignments. TCP and UDP port information.',
    keywords: ['port checker', 'network ports', 'port scanner', 'TCP ports', 'UDP ports']
  },
  'http': {
    title: 'HTTP Status Codes - Complete Reference Guide',
    description: 'Complete HTTP status code reference with descriptions and use cases. Debug web applications and understand server responses.',
    keywords: ['HTTP status codes', 'HTTP codes', 'status code reference', 'HTTP errors', 'response codes']
  },
  'ua': {
    title: 'User Agent Parser - Parse Browser User Agents',
    description: 'Parse and analyze user agent strings. Detect browser, OS, and device information. Test user agent detection logic.',
    keywords: ['user agent parser', 'UA parser', 'browser detection', 'user agent string', 'device detection']
  },
  'mime': {
    title: 'MIME Type Lookup - File Type Reference',
    description: 'Look up MIME types for file extensions. Complete reference for content types. Essential for web development and file handling.',
    keywords: ['MIME types', 'content types', 'file types', 'MIME lookup', 'media types']
  },
  
  // Generators
  'qr': {
    title: 'QR Code Generator - Create QR Codes Online',
    description: 'Generate QR codes for URLs, text, WiFi, contacts, and more. Customizable colors and sizes. Download in multiple formats.',
    keywords: ['QR code generator', 'create QR code', 'QR generator', 'QR code maker', 'QR code']
  },
  'barcode': {
    title: 'Barcode Generator - Create Barcodes Online',
    description: 'Generate barcodes in multiple formats including Code 128, EAN, UPC. Bulk barcode generation with custom labels.',
    keywords: ['barcode generator', 'create barcode', 'barcode maker', 'UPC generator', 'EAN barcode']
  },
  'ascii-art': {
    title: 'ASCII Art Generator - Text to ASCII Art Converter',
    description: 'Convert text to ASCII art with multiple fonts and styles. Create ASCII banners and decorative text. Perfect for terminal applications.',
    keywords: ['ASCII art', 'ASCII generator', 'text to ASCII', 'ASCII text', 'ASCII banner']
  },
  'color': {
    title: 'Color Converter - RGB, HEX, HSL Color Conversion',
    description: 'Convert between HEX, RGB, HSL, and other color formats. Color picker with palette generation. Essential tool for designers.',
    keywords: ['color converter', 'HEX to RGB', 'color picker', 'RGB converter', 'HSL converter']
  },
  'favicon': {
    title: 'Favicon Generator - Create Website Favicons',
    description: 'Generate favicons from images or text. Multiple sizes and formats for all platforms. Include app icons and manifest files.',
    keywords: ['favicon generator', 'favicon maker', 'icon generator', 'website icon', 'app icon']
  },
  'meta': {
    title: 'Meta Tag Generator - SEO Meta Tags Creator',
    description: 'Generate meta tags for SEO and social media. OpenGraph and Twitter Card tags. Preview how your site appears in search results.',
    keywords: ['meta tag generator', 'SEO meta tags', 'OpenGraph tags', 'Twitter Card', 'meta description']
  },
  'robots': {
    title: 'Robots.txt Generator - Create Robots.txt Files',
    description: 'Generate robots.txt files for search engine crawlers. Configure crawl rules and sitemap locations. SEO optimization tool.',
    keywords: ['robots.txt generator', 'robots file', 'crawler rules', 'SEO robots', 'search engine']
  },
  'sitemap': {
    title: 'Sitemap Generator - Create XML Sitemaps',
    description: 'Generate XML sitemaps for better SEO. Automatic URL discovery and priority settings. Submit to search engines easily.',
    keywords: ['sitemap generator', 'XML sitemap', 'SEO sitemap', 'site map', 'Google sitemap']
  },
  
  // Time & Date
  'timestamp': {
    title: 'Unix Timestamp Converter - Epoch Time Converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa. Support for milliseconds and multiple timezones.',
    keywords: ['Unix timestamp', 'epoch converter', 'timestamp converter', 'Unix time', 'epoch time']
  },
  'date-format': {
    title: 'Date Formatter - Format Dates in Any Style',
    description: 'Format dates in any style or locale. Convert between date formats and timezones. Parse and validate date strings.',
    keywords: ['date formatter', 'date converter', 'format dates', 'date parser', 'timezone converter']
  },
  'cron': {
    title: 'Cron Expression Builder - Cron Job Scheduler',
    description: 'Build and validate cron expressions with a visual interface. Understand cron syntax and schedule recurring tasks.',
    keywords: ['cron builder', 'cron expression', 'cron generator', 'cron syntax', 'job scheduler']
  },
  'pomodoro': {
    title: 'Pomodoro Timer - Productivity Timer Tool',
    description: 'Boost productivity with the Pomodoro Technique timer. Customizable work and break intervals. Track your focus sessions.',
    keywords: ['pomodoro timer', 'productivity timer', 'focus timer', 'work timer', 'pomodoro technique']
  }
};

export function getToolMetadata(toolSlug: string): ToolMetadata | null {
  return toolMetadata[toolSlug] || null;
}