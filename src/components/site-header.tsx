"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { navItems } from "@/lib/ulrych-data";
import { cn } from "@/lib/utils";

export function SiteHeader() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const updateHeaderState = () => {
            setIsScrolled(window.scrollY > 8);
        };

        updateHeaderState();
        window.addEventListener("scroll", updateHeaderState, { passive: true });

        return () => window.removeEventListener("scroll", updateHeaderState);
    }, []);

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 px-5 py-5 transition-colors duration-300 md:px-10",
                isScrolled
                    ? "bg-background/55 backdrop-blur-xl"
                    : "bg-transparent",
            )}
        >
            <nav className="flex h-9 items-center justify-between gap-5 text-[15px] leading-none">
                <div className="flex min-w-0 items-center gap-9">
                    <Link
                        className="shrink-0 text-foreground transition-opacity hover:opacity-80"
                        data-cursor="pointer"
                        href="/"
                    >
                        Kristian Ulrych
                    </Link>
                    <span className="hidden text-muted-foreground md:inline">
                        Digital Product Designer
                    </span>
                </div>

                <div className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <Link
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            data-cursor="pointer"
                            href={item.href}
                            key={item.href}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="gap-2 flex">
                        <button
                            className="justify-between inline-flex h-9 items-center text-xs rounded-full border border-white/55 px-3.5 text-foreground transition-colors hover:border-white"
                            data-cursor="pointer"
                            type="button"
                        >
                            EN{" "}
                            <ChevronDown
                                aria-hidden="true"
                                size={14}
                                strokeWidth={1.8}
                            />
                        </button>
                        <Link
                            className="inline-flex h-9 items-center rounded-full border border-white bg-white px-4 text-black transition-colors hover:bg-transparent hover:text-white"
                            data-cursor="pointer"
                            href="/contact"
                        >
                            Get in touch
                        </Link>
                    </div>
                </div>

                <button
                    aria-label="Open menu"
                    className="grid h-9 w-9 place-items-center md:hidden"
                    data-cursor="pointer"
                    type="button"
                >
                    <span className="flex w-4 flex-col gap-1">
                        <span className="h-px bg-foreground" />
                        <span className="h-px bg-foreground" />
                    </span>
                </button>
            </nav>
        </header>
    );
}
