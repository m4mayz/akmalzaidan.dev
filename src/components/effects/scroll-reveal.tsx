"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollReveal() {
    const pathname = usePathname();

    useEffect(() => {
        document.documentElement.classList.add("scroll-reveal-ready");

        const revealTarget = (target: Element) => {
            target.setAttribute("data-revealed", "true");
        };

        const targets = new Set<HTMLElement>();

        const revealVisibleTargets = () => {
            for (const target of targets) {
                if (target.dataset.revealed === "true") {
                    continue;
                }

                const rect = target.getBoundingClientRect();

                if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
                    revealTarget(target);
                }
            }
        };

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const reducedMotionTargets = document.querySelectorAll("[data-reveal]");

            for (const target of reducedMotionTargets) {
                revealTarget(target);
            }

            return () => {
                document.documentElement.classList.remove("scroll-reveal-ready");
            };
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
                rootMargin: "0px 0px 4% 0px",
                threshold: 0.01,
            },
        );

        const observeTargets = () => {
            const currentTargets = document.querySelectorAll<HTMLElement>("[data-reveal]");

            for (const target of currentTargets) {
                if (targets.has(target) || target.dataset.revealed === "true") {
                    continue;
                }

                targets.add(target);
                observer.observe(target);
            }

            revealVisibleTargets();
        };

        const mutationObserver = new MutationObserver(observeTargets);

        observeTargets();
        window.setTimeout(observeTargets, 80);
        window.setTimeout(observeTargets, 320);
        window.addEventListener("scroll", revealVisibleTargets, { passive: true });
        window.addEventListener("resize", revealVisibleTargets);
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener("scroll", revealVisibleTargets);
            window.removeEventListener("resize", revealVisibleTargets);
            document.documentElement.classList.remove("scroll-reveal-ready");
        };
    }, [pathname]);

    return null;
}
