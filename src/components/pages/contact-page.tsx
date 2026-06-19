import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getContactData, getSiteData } from "@/lib/content";
import { withLocale } from "@/lib/i18n";
import type { ContactData, Locale } from "@/types/content";

function TextField({
    id,
    label,
    placeholder,
    multiline = false,
}: {
    id: keyof ContactData["labels"];
    label: string;
    placeholder: string;
    multiline?: boolean;
}) {
    const inputClassName =
        "peer w-full border-0 border-b border-border bg-transparent px-0 pb-4 pt-8 text-[16px] leading-[1.5] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground";

    return (
        <div className="group relative">
            <label
                className="absolute left-0 top-0 text-[11px] font-medium uppercase leading-none tracking-[0.16em] text-muted-foreground transition-colors group-focus-within:text-foreground"
                htmlFor={id}
            >
                {label}
            </label>
            {multiline ? (
                <textarea
                    className={`${inputClassName} min-h-[128px] resize-none`}
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    rows={4}
                />
            ) : (
                <input
                    className={inputClassName}
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    type={id === "email" ? "email" : "text"}
                />
            )}
        </div>
    );
}

export function ContactPage({ locale }: { locale: Locale }) {
    const site = getSiteData(locale);
    const contact = getContactData(locale);

    return (
        <>
            <SiteHeader locale={locale} site={site} />
            <main className="relative z-10 flex-1 pb-16 md:pb-32">
                <section className="px-5 pt-32 md:px-10 md:pt-[8.75rem]">
                    <div className="mx-auto max-w-[89.5rem]">
                        <div className="grid gap-x-12 gap-y-16 md:grid-cols-12">
                            <div className="md:col-span-5" data-reveal>
                                <h1 className="font-heading text-[40px] font-light leading-[1.05] tracking-[-0.04em] md:text-[clamp(40px,5vw,80px)]">
                                    {contact.headline}
                                </h1>

                                <div className="mt-8 max-w-[33rem] text-[17px] leading-[1.55] text-foreground/85 md:text-[19px]">
                                    <p>{contact.body}</p>
                                </div>

                                <a
                                    className="gradient-text group relative mt-8 inline-flex items-baseline gap-3 text-[clamp(20px,1.6vw,26px)] leading-[1.5] text-foreground"
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

                            <div
                                className="md:col-span-6 md:col-start-7"
                                data-reveal
                            >
                                <form
                                    action={`mailto:${site.email}`}
                                    encType="text/plain"
                                    method="post"
                                >
                                    <div className="grid gap-y-10 md:grid-cols-2 md:gap-x-10">
                                        <TextField
                                            id="name"
                                            label={contact.labels.name}
                                            placeholder={
                                                contact.placeholders.name
                                            }
                                        />
                                        <TextField
                                            id="email"
                                            label={contact.labels.email}
                                            placeholder={
                                                contact.placeholders.email
                                            }
                                        />
                                    </div>

                                    <div className="mt-10">
                                        <TextField
                                            id="subject"
                                            label={contact.labels.subject}
                                            placeholder={
                                                contact.placeholders.subject
                                            }
                                        />
                                    </div>

                                    <div className="mt-10">
                                        <TextField
                                            id="message"
                                            label={contact.labels.message}
                                            multiline
                                            placeholder={
                                                contact.placeholders.message
                                            }
                                        />
                                    </div>

                                    <div className="hidden">
                                        <label htmlFor="company">
                                            {contact.labels.company}
                                        </label>
                                        <input
                                            autoComplete="off"
                                            id="company"
                                            name="company"
                                            tabIndex={-1}
                                            type="text"
                                        />
                                    </div>

                                    <div className="mt-12">
                                        <button
                                            className="inline-flex h-11 items-center rounded-full border border-white bg-white px-5 text-[14px] text-black transition-colors hover:bg-transparent hover:text-white active:scale-[0.98]"
                                            data-cursor="pointer"
                                            type="submit"
                                        >
                                            {contact.submitLabel}
                                        </button>

                                        <p className="mt-6 max-w-[28rem] text-[12px] leading-[1.5] text-muted-foreground">
                                            {contact.privacyPrefix}{" "}
                                            <Link
                                                className="underline underline-offset-4 transition-colors hover:text-foreground"
                                                data-cursor="pointer"
                                                href={withLocale(
                                                    "/privacy",
                                                    locale,
                                                )}
                                            >
                                                {contact.privacyLinkLabel}
                                            </Link>
                                            {contact.privacySuffix}
                                        </p>
                                    </div>
                                </form>
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
