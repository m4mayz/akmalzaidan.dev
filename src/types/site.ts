export type NavItem = {
  label: string;
  href: string;
};

export type StatItem = {
  label: string;
  value: string;
};

export type WorkItem = {
  title: string;
  year: string;
  description: string;
  href: string;
  image: string;
  alt: string;
  variant: "wide" | "portrait" | "standard";
};

export type ServiceItem = {
  number: string;
  title: string;
  description: string;
};

export type ArticleItem = {
  title: string;
  description: string;
  href: string;
  image: string;
  alt: string;
  badge?: string;
  badgeAlt?: string;
};

export type SocialLink = {
  label: string;
  href: string;
};
