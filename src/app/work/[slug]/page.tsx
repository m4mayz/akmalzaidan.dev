import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { ContactSection } from "@/components/contact-section";
import { LazyImage } from "@/components/effects/lazy-image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type ProjectSection = {
    slot: string;
    heading: string;
    body: string[];
    cta?: {
        label: string;
        href: string;
    };
};

type GalleryItem =
    | {
          type?: "image";
          src: string;
          alt: string;
          aspect: "16/9" | "4/3";
          span?: "half" | "full";
          slot: string;
          imageClassName?: string;
      }
    | {
          type: "comparison";
          before: string;
          after: string;
          beforeLabel: string;
          afterLabel: string;
          span?: "full";
          slot: string;
      };

type WorkProject = {
    slug: string;
    title: string;
    category: string;
    year: string;
    role: string;
    client: string;
    summary: string;
    image: string;
    imageAlt: string;
    sections: ProjectSection[];
    gallery: GalleryItem[];
};

const imageBase = "/images/ulrychkristian/work-details";

const projects: WorkProject[] = [
    {
        slug: "eqvista",
        title: "Eqvista",
        category: "Mobile app design",
        year: "2025-2026",
        role: "UX/UI designer",
        client: "Eqvista",
        summary: "Designing a mobile app for an equity management platform",
        image: `${imageBase}/eqvista-eqvista_thumbnail.jpg`,
        imageAlt: "Eqvista cap-table interface",
        sections: [
            {
                slot: "overview",
                heading: "Overview",
                body: [
                    "Eqvista is a platform focused on equity management, cap tables, company valuations, and shareholder-related workflows. The client already had an existing web platform, a defined visual identity, and a clear set of product features. The goal of the project was to design a mobile app that would naturally extend their existing digital product ecosystem.",
                    "I worked on the project as a UX/UI designer. My role included designing the mobile interface, joining online client meetings, and collaborating closely with the developer to make sure the design was not only visually consistent, but also clear and practical to implement.",
                ],
            },
            {
                slot: "challenge",
                heading: "Challenge",
                body: [
                    "The main challenge was the tight timeline. The app had to be designed quickly, without room for a long discovery phase or a full product redesign. This meant I had to understand the product fast, identify which parts of the web platform were essential for the app, and translate them into a mobile experience as efficiently as possible.",
                    "The goal was not to redesign the product from scratch. The priority was to keep the experience aligned with Eqvista's existing web platform, respect the brand guidelines, and create a mobile interface that would feel familiar, trustworthy, and easy to navigate.",
                    "Another important challenge was the nature of the product itself. Equity management, valuations, and financial data require clarity, precision, and trust. The interface had to help users understand key information quickly, navigate complex workflows, and take action without unnecessary friction.",
                ],
            },
            {
                slot: "approach",
                heading: "Approach",
                body: [
                    "I started from Eqvista's existing web platform and brand guidelines. Instead of creating a completely new visual direction, I focused on translating the core product logic and key features into a mobile-first interface that would feel like a natural extension of the existing platform.",
                    "My focus was on clean screen structure, readable financial data, consistent components, and simple navigation. For a complex financial product, the interface should reduce complexity rather than add to it. I kept the design clear, functional, and visually calm, so users could focus on the information and actions that matter.",
                    "The project also involved close communication with the client. Through online meetings, we were able to validate the direction, respond to feedback, and keep the project moving. I also worked closely with the developer throughout the process to make sure screens, states, and components were clear from an implementation perspective.",
                ],
            },
            {
                slot: "outcome",
                heading: "Outcome",
                body: [
                    "The result was a complete mobile app design that extends Eqvista's digital product experience beyond the web platform. The app follows the existing brand, supports the core product functionality, and adapts it into a mobile experience focused on clarity, consistency, and usability.",
                    "The project shows how a complex financial product can be translated into a mobile interface within a tight timeline by working efficiently with existing product patterns, brand guidelines, and close collaboration between design and development.",
                    "The app is now live and available to download on the App Store.",
                ],
                cta: {
                    label: "Download on the App Store",
                    href: "https://apps.apple.com/us/app/eqvista/id6760104861",
                },
            },
        ],
        gallery: [
            {
                src: `${imageBase}/eqvista-eqvista_1.jpg`,
                alt: "Eqvista sign-in screen",
                aspect: "16/9",
                slot: "overview",
            },
            {
                src: `${imageBase}/eqvista-eqvista_logo.png`,
                alt: "Eqvista logo",
                aspect: "4/3",
                span: "half",
                slot: "challenge",
            },
            {
                src: `${imageBase}/eqvista-eqvista_5.png`,
                alt: "Eqvista splash screen",
                aspect: "4/3",
                span: "half",
                slot: "challenge",
            },
            {
                src: `${imageBase}/eqvista-closeup.png`,
                alt: "Eqvista mobile valuation and public peers",
                aspect: "16/9",
                slot: "approach",
            },
            {
                src: `${imageBase}/eqvista-eqvista_iphone_icon.jpg`,
                alt: "Eqvista on iPhone home screen",
                aspect: "4/3",
                span: "half",
                slot: "approach",
            },
            {
                src: `${imageBase}/eqvista-eqvista_2.png`,
                alt: "Eqvista dashboard interface",
                aspect: "4/3",
                span: "half",
                slot: "approach",
            },
            {
                src: `${imageBase}/eqvista-eqvista_3.jpg`,
                alt: "Eqvista dashboard",
                aspect: "16/9",
                span: "full",
                slot: "outcome",
            },
            {
                src: `${imageBase}/eqvista-eqvista_4.png`,
                alt: "Eqvista screens overview",
                aspect: "16/9",
                slot: "outcome",
            },
        ],
    },
    {
        slug: "veevoy",
        title: "Veevoy web",
        category: "Website, Branding",
        year: "2025-2026",
        role: "UX/UI designer and brand designer",
        client: "Veevoy",
        summary:
            "Visual website refresh for a software agency focused on custom development and healthcare projects.",
        image: `${imageBase}/veevoy-veevoy_thumbnail.png`,
        imageAlt: "Veevoy marketing site on a desktop monitor",
        sections: [
            {
                slot: "context",
                heading: "Overview",
                body: [
                    "Veevoy is a software agency focused on custom web, app, and digital product development, with a strong focus on healthcare and medical projects. The website already existed, but it felt too generic and lacked a distinctive visual element that would give the brand more personality and make it easier to recognize.",
                    "My task was to improve the website visually and conceptually without redesigning everything from scratch. I focused on creating a characteristic brand element that could be used across the website, social media, and other communication materials. I also updated selected existing pages and designed new sections of the website.",
                ],
            },
            {
                slot: "challenge",
                heading: "Challenge",
                body: [
                    "The main challenge was to improve an existing website in a way that would make the brand feel stronger and more memorable, while still keeping the foundation of the current design. The goal was not to rebuild the whole website, but to identify what was missing and add a visual layer that would make the experience more distinctive.",
                    "The original website was clean and professional, but it lacked a unique visual language. For a software agency that needs to feel trustworthy, modern, and slightly different from competitors, it was important to create a brand element that could support long-term recognition.",
                    "The hardest part was finding the right visual motif. It had to be distinctive enough to make the website feel less generic, but flexible enough to work across different pages, formats, and communication channels.",
                ],
            },
            {
                slot: "approach",
                heading: "Approach",
                body: [
                    "I started by exploring a visual principle that could give Veevoy a stronger and more ownable brand character. The goal was not to create a one-off decoration for a single section, but a scalable visual element that could be reused and developed across the brand.",
                    "The result was an interactive and animated brand element created in Unicorn Studio. It helps the website feel more dynamic, technological, and memorable, while still keeping the overall experience professional. The element works as a visual motif that connects different parts of the website and can also be used outside of the website itself.",
                    "At the same time, I updated selected existing pages and designed new parts of the website. I focused on stronger visual hierarchy, more consistent content structure, and a more distinctive presentation of the agency's services.",
                ],
            },
            {
                slot: "outcome",
                heading: "Outcome",
                body: [
                    "The result is a more distinctive website that keeps the original foundation but adds a clearer brand character. The new brand element helps Veevoy feel more modern, memorable, and recognizable within the software agency space.",
                    "The project also created a flexible visual system that can be used beyond the website, including social media, presentations, and other brand materials.",
                    "The website has not been publicly launched yet, so performance data is not available at this stage.",
                ],
            },
        ],
        gallery: [
            {
                src: `${imageBase}/veevoy-Studio-Display.png`,
                alt: "Veevoy site on Apple Studio Display",
                aspect: "4/3",
                span: "half",
                slot: "context",
            },
            {
                src: `${imageBase}/veevoy-Samsung-Galaxy-Book-4-Ultra.png`,
                alt: "Veevoy careers page on Samsung Galaxy Book",
                aspect: "4/3",
                span: "half",
                slot: "context",
            },
            {
                type: "comparison",
                before: `${imageBase}/veevoy-veevoy_before.png`,
                after: `${imageBase}/veevoy-veevoy_after.jpg`,
                beforeLabel: "Before",
                afterLabel: "After",
                span: "full",
                slot: "context",
            },
            {
                src: `${imageBase}/veevoy-Xiaomi-Pad-5.png`,
                alt: "Veevoy site across two tablets",
                aspect: "16/9",
                span: "full",
                slot: "challenge",
            },
            {
                src: `${imageBase}/veevoy-Samsung-Galaxy-Tab-S10-Ultra.png`,
                alt: "Veevoy footer on Samsung tablet",
                aspect: "4/3",
                span: "full",
                slot: "approach",
            },
            {
                src: `${imageBase}/veevoy-iPad-Pro.png`,
                alt: "Veevoy about page on iPad Pro",
                aspect: "4/3",
                span: "half",
                slot: "approach",
            },
            {
                src: `${imageBase}/veevoy-Samsung-Galaxy-S25-Edge.png`,
                alt: "Veevoy Czech homepage on Samsung Galaxy",
                aspect: "4/3",
                span: "half",
                slot: "outcome",
            },
            {
                src: `${imageBase}/veevoy-Hanging-Vertical-Banner-Mockup.png`,
                alt: "Veevoy hanging banner mockup",
                aspect: "4/3",
                span: "half",
                slot: "outcome",
            },
            {
                src: `${imageBase}/veevoy-MacBook-Pro-16.png`,
                alt: "Veevoy client work on MacBook Pro",
                aspect: "16/9",
                span: "full",
                slot: "outcome",
            },
        ],
    },
    {
        slug: "telemedicine-portal",
        title: "Telemedicine portal",
        category: "Web portal, design system",
        year: "2025-2026",
        role: "UX/UI designer",
        client: "Confidential",
        summary:
            "UX/UI design for a telemedicine web platform for doctors - online consultations, patient management, prescriptions, scheduling, and measurement monitoring.",
        image: `${imageBase}/telemedicine-portal-telemedicine-thumbnail.png`,
        imageAlt: "Telemedicine portal interface overview",
        sections: [
            {
                slot: "context",
                heading: "Overview",
                body: [
                    "The telemedicine portal is a web platform designed for doctors and connected to a patient mobile app. The portal allows doctors to run online consultations, manage patients, prescribe medication and medical aids, schedule examinations, and monitor patient measurements and health-related values.",
                    "I worked on the project as a UX/UI designer. My role included designing the full web portal, creating the design system, building prototypes, preparing final screens, and collaborating with developers during implementation.",
                ],
            },
            {
                slot: "challenge",
                heading: "Challenge",
                body: [
                    "The main challenge was the scale of the product. The portal includes many features, user scenarios, and data-heavy areas that doctors need to work with during patient care. The interface had to be clear, consistent, and practical, without adding unnecessary friction to the doctor's workflow.",
                    "The project was designed almost from scratch. The hospital already had an existing system, but its UX and visual design were not a strong foundation for the new portal.",
                    "Another challenge was the timeline. A healthcare product of this size would ideally require more time for detailed research, testing, and gradual refinement. The project had to move quickly, so the design process required pragmatic decisions, clear structure, and constant attention to consistency across the whole system.",
                ],
            },
            {
                slot: "approach",
                heading: "Approach",
                body: [
                    "My focus was on simplicity, clarity, and efficient work with information. A medical portal cannot be just visually clean - it has to help doctors quickly find important information, complete key actions, and stay oriented while working with a patient.",
                    "I designed the main parts of the portal, including patient management, patient detail, online consultations, prescriptions for medication and medical aids, examination scheduling, and measurement overviews.",
                    "A major part of the work was creating the design system. For a product of this size, it was important to keep components, states, forms, tables, and interactions consistent across the entire portal.",
                ],
            },
            {
                slot: "outcome",
                heading: "Outcome",
                body: [
                    "The result is a complete UX/UI design for a large telemedicine portal for doctors. The portal covers key parts of digital healthcare - from online consultations and patient management to prescriptions, scheduling, and monitoring patient values.",
                    "The design created a solid foundation for a modern, clear, and scalable healthcare product that helps doctors work with patients more efficiently in a digital environment.",
                ],
            },
        ],
        gallery: [
            {
                src: `${imageBase}/telemedicine-portal-telemedicine-screen-1.png`,
                alt: "Telemedicine portal patient management screen",
                aspect: "16/9",
                span: "full",
                slot: "context",
            },
            {
                src: `${imageBase}/telemedicine-portal-telemedicine-photo-1.jpg`,
                alt: "Telemedicine portal context photo",
                aspect: "4/3",
                span: "half",
                slot: "context",
            },
            {
                src: `${imageBase}/telemedicine-portal-telemedicine-vector-1.png`,
                alt: "Telemedicine portal design system diagram",
                aspect: "4/3",
                span: "half",
                slot: "context",
            },
            {
                src: `${imageBase}/telemedicine-portal-telemedicine-macbook.png`,
                alt: "Telemedicine portal on MacBook",
                aspect: "16/9",
                span: "full",
                slot: "challenge",
            },
            {
                src: `${imageBase}/telemedicine-portal-telemedicine-screen-3.png`,
                alt: "Telemedicine consultations screen",
                aspect: "16/9",
                span: "half",
                slot: "challenge",
            },
            {
                src: `${imageBase}/telemedicine-portal-telemedicine-screen-2.png`,
                alt: "Telemedicine patient detail screen",
                aspect: "16/9",
                span: "half",
                slot: "challenge",
            },
            {
                src: `${imageBase}/telemedicine-portal-telemedicine-components.png`,
                alt: "Telemedicine components and color tokens",
                aspect: "16/9",
                span: "full",
                slot: "approach",
            },
            {
                src: `${imageBase}/telemedicine-portal-telemedicine-design-system.png`,
                alt: "Telemedicine design system overview",
                aspect: "16/9",
                span: "half",
                slot: "approach",
            },
            {
                src: `${imageBase}/telemedicine-portal-telemedicine-screen-4.png`,
                alt: "Telemedicine prescriptions screen",
                aspect: "16/9",
                span: "half",
                slot: "approach",
            },
            {
                src: `${imageBase}/telemedicine-portal-telemedicine-vector-2.png`,
                alt: "Telemedicine design system diagram",
                aspect: "16/9",
                span: "full",
                slot: "outcome",
            },
            {
                src: `${imageBase}/telemedicine-portal-telemedicine-screen-5.png`,
                alt: "Telemedicine measurements overview",
                aspect: "4/3",
                span: "half",
                slot: "outcome",
            },
            {
                src: `${imageBase}/telemedicine-portal-telemedicine-photo-2.jpg`,
                alt: "Telemedicine context photo",
                aspect: "4/3",
                span: "half",
                slot: "outcome",
            },
        ],
    },
    {
        slug: "mapwhizz",
        title: "Mapwhizz",
        category: "UX/UI",
        year: "2026",
        role: "UX/UI designer",
        client: "Mapwhizz",
        summary: "Redesigning a B2B platform for office location analysis",
        image: `${imageBase}/mapwhizz-mapwhizz-thumbnail.png`,
        imageAlt: "Mapwhizz travel-time analysis report on a MacBook",
        sections: [
            {
                slot: "overview",
                heading: "Overview",
                body: [
                    "Mapwhizz is a B2B web platform that helps consultants, office agents, and company decision-makers evaluate office locations based on employee commute times.",
                    "The product allows users to compare a current office with several potential new locations and understand how each move would affect the team. Instead of relying only on price, location, or intuition, Mapwhizz turns office relocation into a commute-based analysis.",
                    "I worked on the project as a UX/UI designer. My role was to redesign the existing portal, join regular client calls, design key parts of the product experience, and prepare the design handoff for development.",
                ],
            },
            {
                slot: "challenge",
                heading: "Challenge",
                body: [
                    "The project was specific because the client already had an existing version of the product built by a previous team. We were not starting from scratch. The redesign had to improve the user experience, make the interface clearer, and elevate the visual quality of the product while keeping backend changes as limited as possible.",
                    "This was especially important in the report area. Many of the outputs were calculated on the backend, and some information that would have been useful from an ideal UX perspective was simply not available in the system.",
                    "Another challenge was the nature of the product itself. Mapwhizz works with data that supports important business decisions. The interface had to feel clear, professional, and trustworthy.",
                ],
            },
            {
                slot: "approach",
                heading: "Approach",
                body: [
                    "I started from the existing product, the available backend logic, and the client's brand guidelines. The goal was not to completely rebuild the platform, but to improve its usability, visual hierarchy, and overall product experience while respecting the technical constraints.",
                    "My focus was on clearer screen structure, better data presentation, and easier navigation through the report. Key outputs such as the recommended office, average commute change, and side-by-side comparison of locations had to be easy to scan and understand.",
                    "Close collaboration with the client was an important part of the process. Through regular online calls, we reviewed designs, discussed feedback, and refined individual parts of the interface step by step.",
                ],
            },
            {
                slot: "outcome",
                heading: "Outcome",
                body: [
                    "The result is a redesigned B2B platform that moves Mapwhizz toward a cleaner, more premium, and more usable SaaS experience. The new interface better supports the core purpose of the product: helping users compare office locations, understand employee commute impact, and prepare a clear foundation for decision-making.",
                    "The project also shows how to approach a redesign with strong technical constraints. Instead of designing an ideal solution without limits, the process required pragmatic decisions - improving as much as possible, respecting the existing system, and identifying where backend changes were truly worth making.",
                    "The product is currently being finalized and is expected to launch soon, so performance data is not available yet.",
                ],
            },
        ],
        gallery: [
            {
                src: `${imageBase}/mapwhizz-mapwhizz-commute-analysis-macbook.png`,
                alt: "Mapwhizz commute analysis on MacBook Air",
                aspect: "16/9",
                span: "full",
                slot: "overview",
            },
            {
                src: `${imageBase}/mapwhizz-mapwhizz-location-comparison-macbook.png`,
                alt: "Mapwhizz location comparison report",
                aspect: "16/9",
                span: "full",
                slot: "challenge",
            },
            {
                src: `${imageBase}/mapwhizz-mapwhizz-iphone.png`,
                alt: "Mapwhizz on iPhone",
                aspect: "4/3",
                span: "half",
                slot: "challenge",
            },
            {
                src: `${imageBase}/mapwhizz-mapwhizz-iphone-detail.png`,
                alt: "Mapwhizz on iPhone detail view",
                aspect: "4/3",
                span: "half",
                slot: "challenge",
            },
            {
                src: `${imageBase}/mapwhizz-mapwhizz-recommended-office-macbook.png`,
                alt: "Mapwhizz recommended office report",
                aspect: "16/9",
                span: "full",
                slot: "approach",
            },
            {
                src: `${imageBase}/mapwhizz-mapwhizz-ipad-pro.png`,
                alt: "Mapwhizz on iPad Pro",
                aspect: "16/9",
                span: "full",
                slot: "outcome",
            },
        ],
    },
    {
        slug: "sportelo",
        title: "Sportelo",
        category: "UX/UI, Branding",
        year: "2025-2026",
        role: "UX/UI Designer",
        client: "Sportelo",
        summary: "Visual direction and product redesign for a sports platform.",
        image: `${imageBase}/sportelo-sportelo_thumbnail.png`,
        imageAlt: "Sportelo athlete platform app and brand identity overview",
        sections: [
            {
                slot: "context",
                heading: "Overview",
                body: [
                    "Sportelo is a sports platform where the goal was to move the visual identity forward and create a new direction for its digital products, mainly the website, booking system, and mobile app.",
                    "I worked on the project as a UX/UI designer. My role included exploring a new visual direction for the brand, designing selected digital parts, and redesigning the booking system and mobile app.",
                ],
            },
            {
                slot: "challenge",
                heading: "Challenge",
                body: [
                    "The project combined several areas at once: visual identity, website, booking system, and mobile app. The challenge was to design product-related parts while the brand direction was still evolving.",
                    "Colors, typography, and the overall visual tone were being refined throughout the process, which naturally affected the UI work as well. The design process required flexibility, fast iterations, and the ability to adapt to new decisions without losing the overall direction.",
                    "It was important to create something that would not work only as a one-off visual update, but as a usable foundation for future digital outputs of the brand.",
                ],
            },
            {
                slot: "approach",
                heading: "Approach",
                body: [
                    "I started by exploring a visual direction that could give Sportelo a stronger character and better express the energy of a sports platform. I worked with colors, typography, UI elements, and the overall brand feeling to make the product feel more modern, dynamic, and consistent across different touchpoints.",
                    "The work also included redesigning the booking system and designing the mobile app. For the booking system, I focused mainly on clarity, easier orientation, and more visible key actions.",
                    "Because the project moved quickly, the design process had to be pragmatic. Some parts were developed as more detailed product designs, while others served as a direction that the team could continue building on.",
                ],
            },
            {
                slot: "outcome",
                heading: "Outcome",
                body: [
                    "The result was a set of visual proposals and product directions that helped move Sportelo toward a clearer digital style. The project created a foundation for further work on the brand, booking system, and mobile app.",
                    "The designs helped align the visual direction, explore possible product improvements, and give the team concrete material to build on. The project also highlighted how important a stable brand foundation is when designing larger digital products.",
                ],
            },
        ],
        gallery: [
            {
                src: `${imageBase}/sportelo-sportelo_hero_mockup.png`,
                alt: "Sportelo app overview hero mockup",
                aspect: "16/9",
                span: "full",
                slot: "context",
            },
            {
                src: `${imageBase}/sportelo-sportelo-logo-gridlines.png`,
                alt: "Sportelo logo construction grid",
                aspect: "4/3",
                span: "half",
                slot: "context",
            },
            {
                src: `${imageBase}/sportelo-sportelo_logo_safezone.png`,
                alt: "Sportelo logo safe zone guidelines",
                aspect: "4/3",
                span: "half",
                slot: "context",
            },
            {
                src: `${imageBase}/sportelo-sportelo-macbook-1.png`,
                alt: "Sportelo web platform on MacBook Air",
                aspect: "16/9",
                span: "full",
                slot: "challenge",
            },
            {
                src: `${imageBase}/sportelo-sportelo-iphone-2.png`,
                alt: "Sportelo app screen on iPhone",
                aspect: "4/3",
                span: "half",
                slot: "challenge",
            },
            {
                src: `${imageBase}/sportelo-sportelo-iphone-1.png`,
                alt: "Sportelo app screen on iPhone",
                aspect: "4/3",
                span: "half",
                slot: "challenge",
            },
            {
                src: `${imageBase}/sportelo-sportelo_ball.png`,
                alt: "Sportelo brand element ball illustration",
                aspect: "4/3",
                span: "half",
                slot: "approach",
            },
            {
                src: `${imageBase}/sportelo-sportelo-iphone-reservation.png`,
                alt: "Sportelo reservation flow on iPhone",
                aspect: "4/3",
                span: "half",
                slot: "approach",
            },
            {
                src: `${imageBase}/sportelo-sportelo-tennis-player.png`,
                alt: "Tennis player in Sportelo branded shirt",
                aspect: "4/3",
                span: "half",
                slot: "outcome",
            },
            {
                src: `${imageBase}/sportelo-sportelo-iphone-pro.png`,
                alt: "Sportelo app on iPhone Pro",
                aspect: "4/3",
                span: "half",
                slot: "outcome",
            },
            {
                src: `${imageBase}/sportelo-sportelo-macbook-2.png`,
                alt: "Sportelo web platform on MacBook",
                aspect: "16/9",
                span: "full",
                slot: "outcome",
            },
        ],
    },
];

function getProject(slug: string) {
    return projects.find((project) => project.slug === slug);
}

function getNextProject(project: WorkProject) {
    const index = projects.findIndex((item) => item.slug === project.slug);
    return projects[(index + 1) % projects.length];
}

function getSpanClass(item: GalleryItem) {
    return item.span === "half" ? "md:col-span-6" : "md:col-span-12";
}

function getAspectClass(item: GalleryItem) {
    if (item.type === "comparison") {
        return "aspect-[16/9]";
    }

    return item.aspect === "4/3" ? "aspect-[4/3]" : "aspect-[16/9]";
}

function ProjectGalleryItem({
    item,
    index,
}: {
    item: GalleryItem;
    index: number;
}) {
    const className = `relative overflow-hidden bg-white/5 ${getAspectClass(item)} ${getSpanClass(item)}`;

    if (item.type === "comparison") {
        return (
            <div
                className={`${className} grid grid-cols-2 gap-px`}
                data-reveal
                style={
                    {
                        "--reveal-delay": `${Math.min(index, 3) * 70}ms`,
                    } as CSSProperties
                }
            >
                <div className="relative overflow-hidden">
                    <LazyImage
                        alt={item.beforeLabel}
                        className="object-cover"
                        fill
                        sizes="(min-width: 768px) 47vw, 50vw"
                        src={item.before}
                    />
                    <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[12px] uppercase tracking-[0.12em] text-white backdrop-blur">
                        {item.beforeLabel}
                    </span>
                </div>
                <div className="relative overflow-hidden">
                    <LazyImage
                        alt={item.afterLabel}
                        className="object-cover"
                        fill
                        sizes="(min-width: 768px) 47vw, 50vw"
                        src={item.after}
                    />
                    <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[12px] uppercase tracking-[0.12em] text-white backdrop-blur">
                        {item.afterLabel}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div
            className={className}
            data-reveal
            style={
                {
                    "--reveal-delay": `${Math.min(index, 3) * 70}ms`,
                } as CSSProperties
            }
        >
            <LazyImage
                alt={item.alt}
                className={`object-cover ${item.imageClassName ?? ""}`}
                fill
                sizes={
                    item.span === "half"
                        ? "(min-width: 768px) 47vw, 100vw"
                        : "94vw"
                }
                src={item.src}
            />
        </div>
    );
}

export function generateStaticParams() {
    return projects.map((project) => ({ slug: project.slug }));
}

export default async function WorkDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = getProject(slug);

    if (!project) {
        notFound();
    }

    const nextProject = getNextProject(project);

    return (
        <>
            <SiteHeader />
            <main className="relative z-10">
                <section className="px-5 pt-32 md:px-10 md:pt-[8.75rem]">
                    <div className="mx-auto max-w-[89.5rem]">
                        <p
                            className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground"
                            data-reveal
                        >
                            {project.title}
                        </p>
                        <h1
                            className="mt-6 max-w-[16ch] md:max-w-[23ch] font-heading text-[36px] font-light leading-[1.1] tracking-tighter text-foreground md:text-[80px]"
                            data-reveal
                            style={
                                { "--reveal-delay": "70ms" } as CSSProperties
                            }
                        >
                            {project.summary}
                        </h1>
                        <dl
                            className="mt-8 grid grid-cols-2 border-t border-border md:mt-12 md:grid-cols-4"
                            data-reveal
                            style={
                                { "--reveal-delay": "140ms" } as CSSProperties
                            }
                        >
                            {[
                                ["Scope", project.category],
                                ["Role", project.role],
                                ["Client", project.client],
                                ["Year", project.year],
                            ].map(([label, value], index) => (
                                <div
                                    className={`flex flex-col py-4 md:px-8 md:py-7 ${
                                        index === 0
                                            ? ""
                                            : "border-l border-border pl-5 md:pl-8"
                                    }`}
                                    key={label}
                                >
                                    <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                                        {label}
                                    </dt>
                                    <dd className="mt-1.5 text-[15px] leading-[1.45] text-foreground md:mt-3 md:text-[16px]">
                                        {value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div
                        className="relative mt-10 h-[430px] overflow-hidden bg-white/5 md:mt-16 md:h-[780px]"
                        data-reveal
                    >
                        <LazyImage
                            alt={project.imageAlt}
                            className="object-cover"
                            fill
                            rootMargin="400px 0px"
                            sizes="100vw"
                            src={project.image}
                        />
                    </div>
                </section>

                <div className="px-5 py-16 md:px-10 md:py-28">
                    <div className="mx-auto max-w-[89.5rem]">
                        {project.sections.map((section) => {
                            const sectionGallery = project.gallery.filter(
                                (item) => item.slot === section.slot,
                            );

                            return (
                                <section
                                    className="border-t border-border py-16 first:border-t-0 first:pt-0 md:py-28"
                                    key={section.slot}
                                >
                                    <div
                                        className="grid gap-8 md:grid-cols-15 md:gap-0"
                                        data-reveal
                                    >
                                        <h2 className="font-heading text-[28px] font-light leading-[1.1] tracking-normal text-foreground md:col-span-4 md:text-4xl">
                                            {section.heading}
                                        </h2>
                                        <div className="space-y-5 text-[17px] leading-[1.55] text-foreground/85 md:col-span-9 md:col-start-5 md:text-[19px]">
                                            {section.body.map((paragraph) => (
                                                <p key={paragraph}>
                                                    {paragraph}
                                                </p>
                                            ))}
                                            {section.cta ? (
                                                <Link
                                                    className="group relative mt-8 inline-block text-[16px] leading-none text-foreground"
                                                    data-cursor="link"
                                                    href={section.cta.href}
                                                    target="_blank"
                                                >
                                                    {section.cta.label}
                                                    <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left scale-x-100 bg-current transition-transform duration-300 group-hover:scale-x-0" />
                                                </Link>
                                            ) : null}
                                        </div>
                                    </div>

                                    {sectionGallery.length > 0 ? (
                                        <div className="mt-12 grid gap-6 md:mt-20 md:grid-cols-12">
                                            {sectionGallery.map(
                                                (item, index) => (
                                                    <ProjectGalleryItem
                                                        index={index}
                                                        item={item}
                                                        key={`${section.slot}-${index}`}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    ) : null}
                                </section>
                            );
                        })}
                    </div>
                </div>

                <section className="px-5 py-16 md:px-10 md:py-28">
                    <Link
                        className="group mx-auto block max-w-[89.5rem]"
                        data-cursor="link"
                        data-reveal
                        href={`/work/${nextProject.slug}`}
                    >
                        <p className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                            Next project
                        </p>
                        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_38%] md:items-end">
                            <div>
                                <h2 className="font-heading text-[42px] font-light leading-[1.05] tracking-normal text-foreground md:text-[92px]">
                                    {nextProject.title}
                                </h2>
                                <p className="mt-5 max-w-[680px] text-[16px] leading-[1.55] text-muted-foreground md:text-[18px]">
                                    {nextProject.summary}
                                </p>
                            </div>
                            <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                                <LazyImage
                                    alt={nextProject.imageAlt}
                                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                    fill
                                    sizes="(min-width: 768px) 38vw, 100vw"
                                    src={nextProject.image}
                                />
                            </div>
                        </div>
                    </Link>
                </section>

                <ContactSection />
            </main>
            <div className="relative z-10">
                <SiteFooter />
            </div>
        </>
    );
}
