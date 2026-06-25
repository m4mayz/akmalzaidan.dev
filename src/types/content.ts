export type Locale = "en" | "id";

export type LocalizedPath = {
  en: string;
  id: string;
};

export type NavItemData = {
  label: string;
  href: string;
};

export type SocialLinkData = {
  label: "GitHub" | "LinkedIn" | "Instagram";
  href: string;
};

export type SiteData = {
  name: string;
  role: string;
  email: string;
  location: string;
  availability: string;
  metadata: {
    title: string;
    description: string;
    ogAlt: string;
  };
  nav: NavItemData[];
  socials: SocialLinkData[];
  footer: {
    credit: string;
    privacyLabel: string;
  };
  language: {
    current: string;
    switchTo: string;
  };
};

export type StatItemData = {
  label: string;
  value: string;
};

export type ServiceItemData = {
  number: string;
  title: string;
  description: string;
};

export type WorkSummaryData = {
  slug: string;
  title: string;
  year: string;
  description: string;
  href: string;
  image: string;
  alt: string;
  category: string;
};

export type WorkSectionSlot = "overview" | "challenge" | "approach" | "outcome";

export type WorkGalleryItemData = {
  src: string;
  alt: string;
  aspect: "16/9" | "4/3";
  span?: "half" | "full";
  slot: WorkSectionSlot;
};

export type WorkDetailData = WorkSummaryData & {
  role: string;
  client: string;
  summary: string;
  sections: {
    slot: WorkSectionSlot;
    heading: string;
    body: string[];
  }[];
  gallery: WorkGalleryItemData[];
};

export type WorkContentData = Omit<WorkDetailData, "href">;

export type ArticleSummaryData = {
  slug: string;
  title: string;
  description: string;
  href: string;
  image: string;
  alt: string;
  publishedAt: string;
};

export type ArticleDetailData = ArticleSummaryData & {
  lead: string;
  blocks: {
    heading?: string;
    paragraphs: string[];
  }[];
};

export type ArticleContentData = Omit<ArticleDetailData, "href">;

export type TimelineItemData = {
  title: string;
  organization: string;
  period: string;
};

export type AboutData = {
  headline: string;
  subhead: string;
  intro: string[];
  philosophyTitle: string;
  philosophy: string[];
  experienceTitle: string;
  experiences: TimelineItemData[];
  educationTitle: string;
  education: TimelineItemData[];
  skillsTitle: string;
  skills: string[];
  toolsTitle: string;
  tools: string[];
  beyondTitle: string;
  beyond: string[];
  images: {
    src: string;
    alt: string;
  }[];
};

export type ContactData = {
  headline: string;
  body: string;
  labels: {
    name: string;
    email: string;
    subject: string;
    message: string;
    company: string;
  };
  placeholders: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  submitLabel: string;
  privacyPrefix: string;
  privacyLinkLabel: string;
  privacySuffix: string;
};

export type PrivacyData = {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: {
    heading: string;
    paragraphs?: string[];
    groups?: {
      subheading: string;
      paragraphs: string[];
    }[];
    list?: string[];
  }[];
};

export type HomeData = {
  hero: {
    headline: string;
    highlightedWord: string;
  };
  stats: StatItemData[];
  services: ServiceItemData[];
  testimonials: {
    quote: string;
    author: string;
    role: string;
  }[];
};
