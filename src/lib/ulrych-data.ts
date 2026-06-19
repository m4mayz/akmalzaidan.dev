import type {
  AboutData,
  ArticleItem,
  NavItem,
  ServiceItem,
  SocialLink,
  StatItem,
  WorkItem,
} from "@/types/site";

export const navItems: NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "Articles", href: "/articles" },
  { label: "About", href: "/about" },
];

export const heroStats: StatItem[] = [
  { label: "Based", value: "Prague, Czechia" },
  { label: "Focus", value: "Product UX/UI, Design Systems" },
  { label: "Languages", value: "Czech, English" },
  { label: "Open for", value: "Smaller freelance work" },
];

export const workItems: WorkItem[] = [
  {
    title: "Eqvista",
    year: "2025-2026",
    description:
      "Mobile app design for an equity management platform, focused on clarity, dashboards and financial data.",
    href: "/work/eqvista",
    image: "/images/ulrychkristian/eqvista_thumbnail.jpg",
    alt: "Eqvista cap-table interface",
    variant: "portrait",
  },
  {
    title: "Telemedicine portal",
    year: "2025-2026",
    description:
      "Doctor-facing web platform for online consultations, patient management and healthcare workflows.",
    href: "/work/telemedicine-portal",
    image: "/images/ulrychkristian/telemedicine-thumbnail.png",
    alt: "Telemedicine portal interface overview",
    variant: "wide",
  },
  {
    title: "Sportelo",
    year: "2025-2026",
    description:
      "Product and visual direction for a sports platform, combining community, content and digital services.",
    href: "/work/sportelo",
    image: "/images/ulrychkristian/sportelo_thumbnail.png",
    alt: "Sportelo athlete platform app and brand identity overview",
    variant: "portrait",
  },
  {
    title: "Veevoy web",
    year: "2025-2026",
    description:
      "Website and visual direction for a software studio building digital healthcare products.",
    href: "/work/veevoy",
    image: "/images/ulrychkristian/veevoy_thumbnail.png",
    alt: "Veevoy marketing site on a desktop monitor",
    variant: "wide",
  },
  {
    title: "Mapwhizz",
    year: "2026",
    description:
      "B2B product redesign for office location analysis, commute insights and workplace planning.",
    href: "/work/mapwhizz",
    image: "/images/ulrychkristian/mapwhizz-thumbnail.png",
    alt: "Mapwhizz travel-time analysis report on a MacBook",
    variant: "wide",
  },
];

export const serviceItems: ServiceItem[] = [
  {
    number: "01",
    title: "Product design",
    description:
      "End-to-end UX and UI for digital products - from early concepts and user flows to polished interfaces ready to ship. I focus on clarity, structure and details that make products easier to use.",
  },
  {
    number: "02",
    title: "Design systems",
    description:
      "Scalable design systems with clear foundations, reusable components and practical documentation. Built to support both designers and developers, so the system stays useful beyond handoff.",
  },
  {
    number: "03",
    title: "Interface direction",
    description:
      "Visual direction for digital products that need a distinct and consistent presence. From typography and motion to imagery and UI details, I help shape interfaces that feel cohesive and memorable.",
  },
  {
    number: "04",
    title: "Web design",
    description:
      "Thoughtful websites for studios, founders and brands - with a strong sense of typography, structure and visual clarity. Designed to feel considered, expressive and easy to navigate.",
  },
  {
    number: "05",
    title: "Brand identity",
    description:
      "Visual identities and brand systems for digital products and modern businesses. Usually developed alongside the product, so brand and interface feel like one coherent experience.",
  },
  {
    number: "06",
    title: "Advisory & audits",
    description:
      "Focused design support for teams that need an outside perspective. UX/UI reviews, design system audits and hands-on feedback to identify gaps, sharpen decisions and move work forward.",
  },
];

export const articleItems: ArticleItem[] = [
  {
    title: "Ferrari 499P from scratch: Best 3D Graphics of the Semester",
    description:
      "A full 3D model of the Ferrari 499P built in Blender - modelling, texturing, lighting and render series that won Best 3D Graphics of the Semester at Multifest.",
    href: "/articles/ferrari-499p",
    image: "/images/ulrychkristian/ferrari1.png",
    alt: "Ferrari 499P 3D render front three-quarter view",
    badge: "/images/ulrychkristian/best-3d-award-badge.png",
    badgeAlt: "Best 3D Award semester winner",
  },
  {
    title: "The school project people wanted to buy",
    description:
      "A fan-made 3D printed Formula 1 model inspired by Red Bull Racing - modelled in Blender, 200+ hours of work, 30,000+ views online.",
    href: "/articles/rb18-3d-printed-model",
    image: "/images/ulrychkristian/thumbnail.jpeg",
    alt: "Fan-made 3D printed RB18 Formula 1 model",
  },
];

export const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kristi%C3%A1n-ulrych-0355a030b/",
  },
  { label: "Behance", href: "https://www.behance.net/kristianulrych" },
  { label: "Dribbble", href: "https://dribbble.com/TwenntyOnee" },
];

export const aboutData: AboutData = {
  email: "kristian.ulrych@gmail.com",
  location: "Prague, Czechia",
  headline:
    "I design digital products with clarity, character, and real-world usability in mind.",
  subhead:
    "I am a UX/UI designer based in Prague. I design websites, applications, design systems, and digital identities for products that need to work not only visually, but also practically.",
  designPhilosophy: [
    "Good design is not just a polished layout. To me, it is a way to simplify complex things, give information a clear structure, and create an environment where people can quickly understand what matters.",
    "A lot of my work involves products that are not simple by nature — healthcare portals, B2B SaaS tools, financial applications, or internal systems. In these projects, clarity, calmness, and practical decision-making matter more than visual noise.",
    "Design does not happen in a vacuum. There is often an existing backend, a tight timeline, incomplete information, or a brand direction that is still evolving. I see these constraints as part of the work. My goal is to find solutions that move the product forward even when the conditions are not perfect.",
  ],
  experiences: [
    { role: "UX/UI Designer", company: "Veevoy", period: "2025 — Present" },
    { role: "UX/UI Designer", company: "Sportelo", period: "2025 — Present" },
    {
      role: "Freelance Graphic Designer",
      company: "Self-employed",
      period: "2025 — Present",
    },
    { role: "Graphic Designer", company: "Greendot", period: "2023 — 2025" },
  ],
  education: [
    {
      degree: "Bachelor (Bc.), Intermedia / Multimedia",
      institution: "VŠE — Faculty of Informatics and Statistics",
      period: "2023 — 2027",
    },
    {
      degree: "Computer and Information Sciences",
      institution: "SPŠ Radlická",
      period: "2019 — 2023",
    },
  ],
  skills: [
    "UX Design",
    "UI Design",
    "Design Systems",
    "Web Design",
    "Visual Identity",
    "Visual Direction",
    "Prototyping",
    "Motion Design",
    "3D Design",
    "3D Printing",
    "Vibecoding",
    "Photography",
  ],
  tools: [
    "Figma",
    "Blender",
    "Spline",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "After Effects",
    "Unicorn Studio",
    "ChatGPT",
    "Claude",
  ],
  beyondScreens: [
    "Design does not end with websites and apps for me. I am also interested in 3D, motorsport, visual experiments, and personal projects where I can explore ideas without a client brief.",
    "One of these projects was a fan-made 3D printed Formula 1 model inspired by Red Bull Racing, created as my final school project. It took over 200 hours to build and reached more than 30,000 views after I shared it online.",
    "Projects like this remind me why I enjoy design in the first place: the mix of detail, patience, technical problem-solving, and the satisfaction of turning an idea into something real.",
  ],
  beyondScreensImages: [
    { src: "/images/ulrychkristian/about_personal_1.jpg", alt: "Kristian Ulrych personal photo" },
    { src: "/images/ulrychkristian/about_personal_2.jpg", alt: "Kristian Ulrych personal photo" },
    { src: "/images/ulrychkristian/about_event_2fresh.jpg", alt: "At a 2Fresh event" },
    { src: "/images/ulrychkristian/about_tennis.jpg", alt: "Playing tennis" },
  ],
  albums: [
    { src: "/images/ulrychkristian/album-1.jpg", alt: "Album cover 1" },
    { src: "/images/ulrychkristian/album-2.webp", alt: "Album cover 2" },
    { src: "/images/ulrychkristian/album-3.jpeg", alt: "Album cover 3" },
    { src: "/images/ulrychkristian/album-4.jpeg", alt: "Album cover 4" },
    { src: "/images/ulrychkristian/album-5.jpeg", alt: "Album cover 5" },
    { src: "/images/ulrychkristian/album-6.jpg", alt: "Album cover 6" },
  ],
};
