import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
    title: "Privacy Policy — Kristian Ulrych",
    description:
        "Privacy policy for Kristian Ulrych's portfolio website, including contact form, hosting, analytics, retention and GDPR rights.",
};

type PolicyNode = ReactNode;

type PolicyGroup = {
    subheading: string;
    content: PolicyNode[];
};

type PolicySection = {
    heading: string;
    content?: PolicyNode[];
    groups?: PolicyGroup[];
    list?: PolicyNode[];
    after?: PolicyNode[];
};

const policySections: PolicySection[] = [
    {
        heading: "Data controller",
        content: [
            <>
                Kristian Ulrych, an independent designer based in Prague,
                Czechia. The simplest way to reach me is by email at{" "}
                <a
                    className="underline decoration-white/35 underline-offset-4 transition-colors hover:text-foreground"
                    data-cursor="link"
                    href="mailto:kristian.ulrych@gmail.com"
                >
                    kristian.ulrych@gmail.com
                </a>
                .
            </>,
        ],
    },
    {
        heading: "What data is processed and why",
        groups: [
            {
                subheading: "Contact form",
                content: [
                    <>
                        When you submit the form on{" "}
                        <a
                            className="underline decoration-white/35 underline-offset-4 transition-colors hover:text-foreground"
                            data-cursor="pointer"
                            href="/contact"
                        >
                            /contact
                        </a>
                        , the following is collected: your name, your email, the
                        optional subject, the message you wrote, and request
                        metadata that may be recorded by the hosting platform
                        such as IP address, timestamp, and user agent. The
                        purpose is to receive your message and reply to it.
                    </>,
                    "The lawful basis is legitimate interest (Art. 6(1)(f) GDPR) — you actively initiated contact, and only the data necessary to reply is collected. If the conversation moves toward a possible engagement, processing for that conversation falls under Art. 6(1)(b), steps prior to entering a contract.",
                ],
            },
            {
                subheading: "Hosting",
                content: [
                    "This site is hosted on Vercel (Vercel Inc., USA). Vercel receives standard request metadata, including IP addresses, request paths, and user agents, needed to deliver the site and protect it from abuse.",
                ],
            },
            {
                subheading: "Email delivery",
                content: [
                    "Submissions from the contact form are delivered to my Gmail inbox by Resend (operated by Plus Five Five, Inc., USA), acting as a data processor. Your name, email, and message pass through Resend's servers and are retained in their delivery logs per Resend's standard retention. The resulting message is stored in my Gmail inbox provided by Google LLC.",
                ],
            },
            {
                subheading: "Analytics & performance",
                content: [
                    <>
                        The site uses{" "}
                        <a
                            className="underline decoration-white/35 underline-offset-4 transition-colors hover:text-foreground"
                            data-cursor="link"
                            href="https://vercel.com/docs/analytics"
                            rel="noreferrer"
                            target="_blank"
                        >
                            Vercel Web Analytics
                        </a>{" "}
                        and Vercel Speed Insights. These tools do not use
                        cookies and are designed to provide aggregated or
                        anonymous insights rather than identify individual
                        visitors. Vercel Web Analytics uses a daily-rotating
                        hash of request metadata and does not track visitors
                        across days.
                    </>,
                    "Speed Insights stores performance data such as route, device type, browser, country, and Core Web Vitals metrics (LCP, CLS, INP), but does not retain information that would allow a browsing session to be reconstructed or a specific user to be identified.",
                ],
            },
            {
                subheading: "Third-party assets",
                content: [
                    "Fonts are self-hosted and do not require requests to Google Fonts or other external font providers. The site loads a 3D background scene SDK from the jsDelivr CDN; that service may receive standard request metadata such as your IP address as part of normal request handling. No advertising or tracking cookies are used on this site.",
                ],
            },
        ],
    },
    {
        heading: "International transfers",
        content: [
            "Some service providers used by this site or for communication purposes (Vercel, Resend, Google) are based in the United States. Where personal data is transferred outside the EEA, the relevant provider relies on appropriate safeguards such as the EU Standard Contractual Clauses and/or participation in the EU-U.S. Data Privacy Framework, where applicable.",
        ],
    },
    {
        heading: "Retention",
        content: [
            "Messages are kept as long as needed to handle our conversation and any reasonable follow-up, and no longer than 24 months from the last interaction — unless a contractual or legal obligation requires longer retention. You can ask for earlier deletion at any time.",
        ],
    },
    {
        heading: "Your rights",
        content: ["Under the GDPR you have the right to:"],
        list: [
            "access the data I hold about you;",
            "have inaccurate data corrected;",
            "request deletion (“right to be forgotten”);",
            "restrict or object to processing;",
            "receive your data in a portable format;",
            <>
                lodge a complaint with the Czech supervisory authority,{" "}
                <a
                    className="underline decoration-white/35 underline-offset-4 transition-colors hover:text-foreground"
                    data-cursor="link"
                    href="https://uoou.gov.cz/"
                    rel="noreferrer"
                    target="_blank"
                >
                    Úřad pro ochranu osobních údajů
                </a>
                .
            </>,
        ],
        after: [
            <>
                To exercise any of these rights, email{" "}
                <a
                    className="underline decoration-white/35 underline-offset-4 transition-colors hover:text-foreground"
                    data-cursor="link"
                    href="mailto:kristian.ulrych@gmail.com"
                >
                    kristian.ulrych@gmail.com
                </a>
                .
            </>,
        ],
    },
    {
        heading: "Changes",
        content: [
            "This policy may be updated from time to time. The “Last updated” date at the top reflects the current version.",
        ],
    },
];

function PolicyParagraph({ children }: { children: PolicyNode }) {
    return (
        <p className="text-[16px] leading-[1.65] text-foreground/80 md:text-[18px]">
            {children}
        </p>
    );
}

export default function PrivacyPage() {
    return (
        <>
            <SiteHeader />
            <main className="relative z-10 px-5 pb-20 pt-32 md:px-10 md:pb-32 md:pt-[8.75rem]">
                <article className="mx-auto max-w-[52rem]">
                    <div data-reveal>
                        <p className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                            Legal
                        </p>
                        <h1 className="mt-6 font-heading text-4xl font-light leading-[1.05] tracking-normal text-foreground md:text-[80px]">
                            Privacy Policy
                        </h1>
                        <p className="mt-8 text-[15px] leading-[1.5] text-muted-foreground md:text-[16px]">
                            Last updated: 2 May 2026
                        </p>
                        <p className="mt-10 text-[17px] leading-[1.6] text-foreground/85 md:text-[20px]">
                            This page explains what personal data is collected
                            when you use Kristian&apos;s portfolio site, why it
                            is processed, and what your rights are under the EU
                            General Data Protection Regulation (Regulation (EU)
                            2016/679, “GDPR”).
                        </p>
                    </div>

                    <div className="mt-14 space-y-14 md:mt-20 md:space-y-20">
                        {policySections.map((section) => (
                            <section
                                className="border-t border-border pt-8 md:pt-10"
                                data-reveal
                                key={section.heading}
                            >
                                <h2 className="font-heading text-2xl font-light leading-[1.12] tracking-normal text-foreground md:text-[42px]">
                                    {section.heading}
                                </h2>

                                {"content" in section && section.content ? (
                                    <div className="mt-6 space-y-5">
                                        {section.content.map((item, index) => (
                                            <PolicyParagraph
                                                key={`${section.heading}-content-${index}`}
                                            >
                                                {item}
                                            </PolicyParagraph>
                                        ))}
                                    </div>
                                ) : null}

                                {"groups" in section && section.groups ? (
                                    <div className="mt-8 space-y-9">
                                        {section.groups.map((group) => (
                                            <div key={group.subheading}>
                                                <h3 className="text-[18px] leading-[1.35] text-foreground md:text-[22px]">
                                                    {group.subheading}
                                                </h3>
                                                <div className="mt-4 space-y-5">
                                                    {group.content.map(
                                                        (item, index) => (
                                                            <PolicyParagraph
                                                                key={`${group.subheading}-${index}`}
                                                            >
                                                                {item}
                                                            </PolicyParagraph>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}

                                {"list" in section && section.list ? (
                                    <ul className="mt-5 list-disc space-y-2 pl-5 text-[16px] leading-[1.65] text-foreground/80 md:text-[18px]">
                                        {section.list.map((item, index) => (
                                            <li
                                                key={`${section.heading}-list-${index}`}
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}

                                {"after" in section && section.after ? (
                                    <div className="mt-5 space-y-5">
                                        {section.after.map((item, index) => (
                                            <PolicyParagraph
                                                key={`${section.heading}-after-${index}`}
                                            >
                                                {item}
                                            </PolicyParagraph>
                                        ))}
                                    </div>
                                ) : null}
                            </section>
                        ))}
                    </div>
                </article>
            </main>
            <div className="relative z-10">
                <SiteFooter />
            </div>
        </>
    );
}
