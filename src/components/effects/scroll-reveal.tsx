"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollReveal() {
    const pathname = usePathname();

    useEffect(() => {
        const targets = Array.from(
            document.querySelectorAll<HTMLElement>("[data-reveal]"),
        );

        if (targets.length === 0) {
            return undefined;
        }

        const revealTarget = (target: Element) => {
            target.setAttribute("data-revealed", "true");
        };

        const revealAllTargets = () => {
            for (const target of targets) {
                revealTarget(target);
            }
        };

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            for (const target of targets) {
                revealTarget(target);
            }

            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        revealTarget(entry.target);
                        observer.unobserve(entry.target);
                    }
                }
            },
            {
                rootMargin: "0px 0px -12% 0px",
                threshold: 0.08,
            },
        );

        for (const target of targets) {
            observer.observe(target);
        }

        return () => {
            observer.disconnect();
            revealAllTargets();
        };
    }, [pathname]);

    return null;
}
