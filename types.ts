export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceProps {
  title: string;
  subtitle: string;
  price: string;
  timeline?: string;
  description: string;
  features: string[];
  isPrimary?: boolean;
}

export interface ContentBlockProps {
  title: string;
  content: string;
  number: string;
}