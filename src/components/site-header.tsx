"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { getAlternateLocalePath, withLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Locale, SiteData } from "@/types/content";

type SiteHeaderProps = {
    locale: Locale;
    site: SiteData;
};

export function SiteHeader({ locale, site: siteData }: SiteHeaderProps) {
    const pathname = usePathname();
    const targetLocale: Locale = locale === "en" ? "id" : "en";
    const switchHref = getAlternateLocalePath(pathname, targetLocale);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasMenuInteracted, setHasMenuInteracted] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const [isMobileLangDropdownOpen, setIsMobileLangDropdownOpen] = useState(false);
    const contactLabel = locale === "id" ? "Hubungi saya" : "Get in touch";

    useEffect(() => {
        if (!isLangDropdownOpen && !isMobileLangDropdownOpen) return;

        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (isLangDropdownOpen && !target.closest(".lang-dropdown-container")) {
                setIsLangDropdownOpen(false);
            }
            if (isMobileLangDropdownOpen && !target.closest(".mobile-lang-dropdown-container")) {
                setIsMobileLangDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, [isLangDropdownOpen, isMobileLangDropdownOpen]);


    useEffect(() => {
        const updateHeaderState = () => {
            setIsScrolled(window.scrollY > 8);
        };

        updateHeaderState();
        window.addEventListener("scroll", updateHeaderState, { passive: true });

        return () => window.removeEventListener("scroll", updateHeaderState);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle(
            "lenis-stopped",
            isMenuOpen,
        );

        return () => {
            document.documentElement.classList.remove("lenis-stopped");
        };
    }, [isMenuOpen]);

    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsMobileLangDropdownOpen(false);
    };

    return (
        <>
            <header
                className={cn(
                    "fixed inset-x-0 top-0 z-50 px-5 py-5 transition-colors duration-300 md:px-10",
                    isScrolled && !isMenuOpen
                        ? "bg-background/55 backdrop-blur-xl"
                        : "bg-transparent",
                )}
            >
                <nav className="flex h-9 items-center justify-between gap-5 text-[15px] leading-none">
                    <div className="flex min-w-0 items-center gap-9">
                        <Link
                            className="shrink-0 text-foreground transition-opacity hover:opacity-80"
                            data-cursor="pointer"
                            href={withLocale("/", locale)}
                            onClick={closeMenu}
                        >
                            {siteData.name}
                        </Link>
                        <span className="hidden text-muted-foreground md:inline">
                            {siteData.role}
                        </span>
                    </div>

                    <div className="hidden items-center gap-8 md:flex">
                        {siteData.nav.map((item) => (
                            <Link
                                className="group relative inline-block py-1 text-muted-foreground transition-colors hover:text-foreground"
                                data-cursor="pointer"
                                href={withLocale(item.href, locale)}
                                key={item.href}
                            >
                                {item.label}
                                <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
                            </Link>
                        ))}
                        <div className="flex gap-2">
                            <div className="relative lang-dropdown-container">
                                <button
                                    className={cn(
                                        "inline-flex h-9 items-center justify-between gap-1.5 rounded-full border px-3.5 text-xs text-foreground transition-all duration-200 active:scale-95",
                                        isLangDropdownOpen
                                            ? "border-white bg-white/10"
                                            : "border-white/55 hover:border-white"
                                    )}
                                    data-cursor="pointer"
                                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                                    type="button"
                                >
                                    {siteData.language.current}{" "}
                                    <ChevronDown
                                        className={cn("transition-transform duration-200", isLangDropdownOpen && "rotate-180")}
                                        aria-hidden="true"
                                        size={14}
                                        strokeWidth={1.8}
                                    />
                                </button>
                                {isLangDropdownOpen && (
                                    <div 
                                        className="absolute right-0 mt-1.5 w-24 rounded-2xl border border-white/14 bg-background/90 backdrop-blur-md p-1 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                                    >
                                        <Link
                                            className={cn(
                                                "flex h-8 items-center rounded-xl px-3 text-[11px] transition-colors",
                                                locale === "en"
                                                    ? "bg-white/10 text-foreground font-medium"
                                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                            )}
                                            href={getAlternateLocalePath(pathname, "en")}
                                            onClick={() => setIsLangDropdownOpen(false)}
                                            data-cursor="pointer"
                                        >
                                            English
                                        </Link>
                                        <Link
                                            className={cn(
                                                "flex h-8 items-center rounded-xl px-3 text-[11px] transition-colors mt-0.5",
                                                locale === "id"
                                                    ? "bg-white/10 text-foreground font-medium"
                                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                            )}
                                            href={getAlternateLocalePath(pathname, "id")}
                                            onClick={() => setIsLangDropdownOpen(false)}
                                            data-cursor="pointer"
                                        >
                                            Indonesia
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <Link
                                className="inline-flex h-9 items-center rounded-full border border-white bg-white px-4 text-black transition-colors hover:bg-transparent hover:text-white"
                                data-cursor="pointer"
                                href={withLocale("/contact", locale)}
                            >
                                {contactLabel}
                            </Link>
                        </div>
                    </div>

                    <button
                        aria-controls="mobile-menu"
                        aria-expanded={isMenuOpen}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="relative z-[60] grid h-10 w-10 place-items-center text-foreground transition-transform duration-150 active:scale-90 md:hidden"
                        data-cursor="pointer"
                        data-no-transition="true"
                        onClick={() => {
                            setHasMenuInteracted(true);
                            setIsMenuOpen((current) => !current);
                        }}
                        type="button"
                    >
                        <span className="relative block h-3.5 w-6">
                            <span
                                aria-hidden="true"
                                className={cn(
                                    "absolute left-0 right-0 top-0 h-px bg-current transition-transform duration-300 ease-out",
                                    isMenuOpen && "translate-y-[7px] rotate-45",
                                )}
                            />
                            <span
                                aria-hidden="true"
                                className={cn(
                                    "absolute bottom-0 left-0 right-0 h-px bg-current transition-transform duration-300 ease-out",
                                    isMenuOpen && "-translate-y-[7px] -rotate-45",
                                )}
                            />
                        </span>
                    </button>
                </nav>
            </header>

            <div
                aria-hidden={!isMenuOpen}
                aria-label="Site menu"
                aria-modal="true"
                className={cn(
                    "fixed inset-0 z-40 md:hidden",
                    isMenuOpen ? "pointer-events-auto" : "pointer-events-none",
                )}
                id="mobile-menu"
                role="dialog"
            >
                <div
                    aria-hidden="true"
                    className="absolute inset-0 flex overflow-hidden"
                >
                    {[0, 1, 2, 3].map((index) => (
                        <div
                            className={cn(
                                "mobile-menu-strip h-full w-[calc(25%+2px)] flex-none bg-background -ml-px first:ml-0",
                                isMenuOpen
                                    ? "mobile-menu-strip-open"
                                    : hasMenuInteracted
                                      ? "mobile-menu-strip-closed"
                                      : "mobile-menu-strip-idle",
                            )}
                            key={index}
                            style={
                                {
                                    "--mobile-menu-delay": isMenuOpen
                                        ? `${index * 70}ms`
                                        : `${index * 55}ms`,
                                } as CSSProperties
                            }
                        />
                    ))}
                </div>

                <div
                    className={cn(
                        "relative flex h-full flex-col px-5 pb-10 pt-28 transition-all duration-300",
                        isMenuOpen
                            ? "translate-y-0 opacity-100 delay-200"
                            : "translate-y-4 opacity-0",
                    )}
                >
                    <nav className="flex flex-col gap-2">
                        {siteData.nav.map((item, index) => (
                            <Link
                                className="block py-2"
                                data-cursor="pointer"
                                href={withLocale(item.href, locale)}
                                key={item.href}
                                onClick={closeMenu}
                            >
                                <span
                                    className={cn(
                                        "block font-heading text-[clamp(48px,12vw,80px)] font-light leading-none tracking-normal text-foreground transition-all duration-500 ease-out",
                                        isMenuOpen
                                            ? "translate-y-0 opacity-100"
                                            : "translate-y-4 opacity-0",
                                    )}
                                    style={
                                        {
                                            transitionDelay: isMenuOpen
                                                ? `${260 + index * 70}ms`
                                                : "0ms",
                                        } as CSSProperties
                                    }
                                >
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                        <div
                            className={cn(
                                "flex items-center gap-3 pt-8 transition-all duration-500 ease-out",
                                isMenuOpen
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-4 opacity-0",
                            )}
                            style={
                                {
                                    transitionDelay: isMenuOpen ? "420ms" : "0ms",
                                } as CSSProperties
                            }
                        >
                            <Link
                                className="inline-flex h-14 items-center rounded-full border border-white bg-white px-7 text-[16px] leading-none text-black transition-colors hover:bg-transparent hover:text-white active:scale-[0.96]"
                                data-cursor="pointer"
                                href={withLocale("/contact", locale)}
                                onClick={closeMenu}
                            >
                                {contactLabel}
                            </Link>
                            <div className="relative mobile-lang-dropdown-container">
                                <button
                                    className={cn(
                                        "inline-flex h-14 items-center gap-2 rounded-full border px-5 text-[14px] uppercase tracking-[0.08em] text-foreground transition-colors active:scale-[0.96]",
                                        isMobileLangDropdownOpen
                                            ? "border-white bg-white/10"
                                            : "border-white/60 hover:border-white"
                                    )}
                                    data-cursor="pointer"
                                    onClick={() => setIsMobileLangDropdownOpen(!isMobileLangDropdownOpen)}
                                    type="button"
                                >
                                    {siteData.language.current}
                                    <ChevronDown
                                        className={cn("transition-transform duration-200", isMobileLangDropdownOpen && "rotate-180")}
                                        aria-hidden="true"
                                        size={14}
                                        strokeWidth={1.8}
                                    />
                                </button>
                                {isMobileLangDropdownOpen && (
                                    <div 
                                        className="absolute left-0 bottom-full mb-2 w-32 rounded-2xl border border-white/14 bg-background/95 backdrop-blur-md p-1 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
                                    >
                                        <Link
                                            className={cn(
                                                "flex h-11 items-center rounded-xl px-4 text-sm transition-colors",
                                                locale === "en"
                                                    ? "bg-white/10 text-foreground font-medium"
                                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                            )}
                                            href={getAlternateLocalePath(pathname, "en")}
                                            onClick={() => {
                                                setIsMobileLangDropdownOpen(false);
                                                closeMenu();
                                            }}
                                            data-cursor="pointer"
                                        >
                                            English
                                        </Link>
                                        <Link
                                            className={cn(
                                                "flex h-11 items-center rounded-xl px-4 text-sm transition-colors mt-0.5",
                                                locale === "id"
                                                    ? "bg-white/10 text-foreground font-medium"
                                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                            )}
                                            href={getAlternateLocalePath(pathname, "id")}
                                            onClick={() => {
                                                setIsMobileLangDropdownOpen(false);
                                                closeMenu();
                                            }}
                                            data-cursor="pointer"
                                        >
                                            Indonesia
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>

                    <div
                        className={cn(
                            "mt-auto flex flex-col gap-2 transition-opacity duration-500",
                            isMenuOpen ? "opacity-100 delay-500" : "opacity-0",
                        )}
                    >
                        <Link
                            className="gradient-text self-start font-heading text-[clamp(20px,5.5vw,28px)] font-light leading-[1.1] tracking-normal"
                            data-cursor="link"
                            href={`mailto:${siteData.email}`}
                        >
                            {siteData.email}
                        </Link>
                        <span className="text-[14px] text-muted-foreground">
                            {siteData.location}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
