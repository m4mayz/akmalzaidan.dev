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

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
};

export type EducationItem = {
  degree: string;
  institution: string;
  period: string;
};

export type AboutData = {
  email: string;
  location: string;
  headline: string;
  subhead: string;
  designPhilosophy: string[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  tools: string[];
  beyondScreens: string[];
  beyondScreensImages: { src: string; alt: string }[];
  albums: { src: string; alt: string }[];
};
