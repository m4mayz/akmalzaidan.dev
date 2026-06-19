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

export type HomeData = {
  hero: {
    headline: string;
    highlightedWord: string;
    body: string;
  };
  stats: StatItemData[];
  services: ServiceItemData[];
  testimonials: {
    quote: string;
    author: string;
    role: string;
  }[];
};
