import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ContactForm } from "@/components/pages/contact-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getContactData, getSiteData } from "@/lib/content";
import { withLocale } from "@/lib/i18n";
import type { Locale } from "@/types/content";

export async function ContactPage({ locale }: { locale: Locale }) {
  const site = await getSiteData(locale);
  const contact = await getContactData(locale);

  return (
    <>
      <SiteHeader locale={locale} site={site} />
      <main className="relative z-10 flex-1 pb-16 md:pb-32">
        <section className="px-5 pt-32 md:px-10 md:pt-35">
          <div className="mx-auto max-w-358">
            <div className="grid gap-x-12 gap-y-16 md:grid-cols-12">
              <div className="md:col-span-5" data-reveal>
                <h1 className="font-heading text-[40px] font-light leading-[1.05] tracking-[-0.04em] md:text-[clamp(40px,5vw,80px)]">
                  {contact.headline}
                </h1>

                <div className="mt-8 max-w-132 text-[17px] leading-[1.55] text-foreground/85 md:text-[19px]">
                  <p>{contact.body}</p>
                </div>

                <a
                  className="gradient-text group relative mt-8 inline-flex items-baseline gap-3 text-[clamp(20px,1.6vw,26px)] leading-normal text-foreground"
                  data-cursor="link"
                  href={`mailto:${site.email}`}
                >
                  <span>{site.email}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.8}
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,#ebe1b0_-86.53%,#aea8fe_100%)] transition-transform duration-500 ease-out group-hover:scale-x-100 md:h-px" />
                </a>
              </div>

              <div className="md:col-span-6 md:col-start-7" data-reveal>
                <ContactForm contact={contact} locale={locale} />
                <p className="mt-6 max-w-md text-[12px] leading-normal text-muted-foreground">
                  {contact.privacyPrefix}{" "}
                  <Link
                    className="underline underline-offset-4 transition-colors hover:text-foreground"
                    data-cursor="pointer"
                    href={withLocale("/privacy", locale)}
                  >
                    {contact.privacyLinkLabel}
                  </Link>
                  {contact.privacySuffix}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="relative z-10">
        <SiteFooter locale={locale} site={site} />
      </div>
    </>
  );
}
