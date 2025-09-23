import { PortableTextBlock } from 'sanity';


type PricingTier = { name: string; price: string; description: string; features?: string[] };
type Benefit = { title: string; description: string };
type ProcessStep = { step: number; title: string; description: string };


export interface Service {
  _id: string;
  title: string;
  slug?: { current: string };
  shortDescription?: string;
  fullDescription?: PortableTextBlock[];
  heroImage?: unknown[];
  gallery?: unknown[];
  price?: string;
  pricingTiers?: PricingTier[];
  features?: string[];
  benefits?: Benefit[];
  process?: ProcessStep[];
  faq?: { question: string; answer: string }[];
  ctaText?: string;
  ctaLink?: string;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] };
  order?: number;
  active?: boolean;
  showInNavigation?: boolean;
  showInServicesSection?: boolean;
  description: string;
  icon?: string;
  featured?: boolean;
}