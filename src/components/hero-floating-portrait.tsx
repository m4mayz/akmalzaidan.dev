"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function HeroFloatingPortrait() {
    const frameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const frame = frameRef.current;

        if (!frame) {
            return undefined;
        }

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (reducedMotion) {
            return undefined;
        }

        let animationFrame = 0;

        const update = () => {
            if (window.innerWidth < 768) {
                frame.style.transform = "none";
                return;
            }

            const scrollProgress = Math.min(window.scrollY / 1400, 1);
            const y = scrollProgress * -400;
            const x = scrollProgress * 0;

            frame.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        };

        const requestUpdate = () => {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("scroll", requestUpdate);
            window.removeEventListener("resize", requestUpdate);
        };
    }, []);

    return (
        <div
            className="relative aspect-[583/637] overflow-hidden md:will-change-transform"
            ref={frameRef}
        >
            <Image
                alt="Akmal Zaidan portfolio interface"
                className="object-cover"
                fill
                preload
                sizes="(min-width: 768px) 41vw, 100vw"
                src="/images/akmal/placeholders/project-portfolio-dashboard.svg"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(140%_100%_at_50%_60%,rgba(255,99,34,0)_40%,rgba(255,99,34,0.35)_100%)]" />
        </div>
    );
}
