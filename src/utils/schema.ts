import type { Organization, WebSite, Service, ContactPoint } from 'schema-dts';
import type { CaiaTechSchema } from '../types/schema';

export const generateOrganizationSchema = (): Organization => ({
  "@type": "Organization",
  "@id": "https://caiatech.com/#organization",
  "name": "Caia Tech",
  "url": "https://caiatech.com",
  "logo": "https://caiatech.com/logo.svg",
  "description": "Computer Science Lab exploring the frontiers of technology through systematic analysis and experimentation",
  "foundingDate": "2024",
  "industry": "Computer Science Research",
  "location": {
    "@type": "Place",
    "name": "Remote-first research lab"
  },
  "sameAs": [
    "https://github.com/caiatech"
  ]
});

export const generateWebSiteSchema = (): WebSite => ({
  "@type": "WebSite",
  "@id": "https://caiatech.com/#website",
  "url": "https://caiatech.com",
  "name": "Caia Tech - Computer Science Lab",
  "description": "Computer Science Lab exploring the frontiers of technology through research, experimentation, and thoughtful analysis",
  "publisher": {
    "@id": "https://caiatech.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://caiatech.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const generateServicesSchema = (): Service[] => [
  {
    "@type": "Service",
    "@id": "https://caiatech.com/research/ai-synthesis",
    "name": "Weekly CS Synthesis",
    "description": "Curated analysis of significant developments in computer science research and industry",
    "provider": {
      "@id": "https://caiatech.com/#organization"
    },
    "category": "Research Analysis",
    "url": "https://caiatech.com/research"
  },
  {
    "@type": "Service", 
    "@id": "https://caiatech.com/lab-notes",
    "name": "Lab Notes & Experiments",
    "description": "Documentation of computer science experiments, technical investigations, and research findings",
    "provider": {
      "@id": "https://caiatech.com/#organization"
    },
    "category": "Research Documentation",
    "url": "https://caiatech.com/lab-notes"
  }
];

export const generateContactSchema = (): ContactPoint => ({
  "@type": "ContactPoint",
  "contactType": "Business Inquiries",
  "url": "https://caiatech.com/contact"
});

export const generateFullSchema = (): CaiaTechSchema => ({
  organization: generateOrganizationSchema(),
  website: generateWebSiteSchema(),
  services: generateServicesSchema(),
  contactPoint: generateContactSchema()
});

export const jsonLdScript = (schema: any) => {
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
};