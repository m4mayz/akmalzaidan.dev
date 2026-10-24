"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const loadingDuration = 1900;
const exitDuration = 1050;
const imageSwitchDuration = 475;
// Only this many frames fit in loadingDuration; extra images would load eagerly for nothing.
const maxImages = Math.floor(loadingDuration / imageSwitchDuration);
const stripCount = 4;

type InitialLoaderImage = { src: string; alt: string };

type LoaderPhase = "loading" | "leaving" | "hidden";

type InitialLoaderProps = {
    images: InitialLoaderImage[];
};

export function InitialLoader({ images: allImages }: InitialLoaderProps) {
    const images = allImages.slice(0, maxImages);
    const [percent, setPercent] = useState(0);
    const [phase, setPhase] = useState<LoaderPhase>("loading");
    const frameRef = useRef<number | null>(null);
    const exitTimerRef = useRef<number | null>(null);
    const hideTimerRef = useRef<number | null>(null);

    const activeFrame = useMemo(() => {
        if (images.length === 0) return -1;
        const elapsed = (percent / 100) * loadingDuration;
        return Math.floor(elapsed / imageSwitchDuration) % images.length;
    }, [images.length, percent]);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            hideTimerRef.current = window.setTimeout(
                () => setPhase("hidden"),
                0,
            );
            return () => {
                if (hideTimerRef.current)
                    window.clearTimeout(hideTimerRef.current);
            };
        }

        document.documentElement.classList.add("initial-loader-active");
        window.__siteLenis?.stop();

        const startedAt = performance.now();

        const tick = (time: number) => {
            const progress = Math.min((time - startedAt) / loadingDuration, 1);
            setPercent(Math.round(progress * 100));

            if (progress < 1) {
                frameRef.current = window.requestAnimationFrame(tick);
                return;
            }

            exitTimerRef.current = window.setTimeout(() => {
                setPhase("leaving");
                hideTimerRef.current = window.setTimeout(() => {
                    setPhase("hidden");
                    document.documentElement.classList.remove(
                        "initial-loader-active",
                    );
                    window.__siteLenis?.start();
                }, exitDuration);
            }, 120);
        };

        frameRef.current = window.requestAnimationFrame(tick);

        return () => {
            if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
            if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
            if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
            document.documentElement.classList.remove("initial-loader-active");
            window.__siteLenis?.start();
        };
    }, []);

    if (phase === "hidden") {
        return null;
    }

    return (
        <div
            aria-label="Loading"
            aria-live="polite"
            className="initial-loader"
            data-phase={phase}
            role="status"
        >
            <div aria-hidden="true" className="initial-loader-bg" />

            <div aria-hidden="true" className="initial-loader-stripes">
                {Array.from({ length: stripCount }, (_, index) => (
                    <div
                        className="initial-loader-stripe"
                        key={index}
                        style={
                            {
                                "--strip-index": index,
                            } as CSSProperties
                        }
                    />
                ))}
            </div>

            {images.length > 0 ? (
                <div className="initial-loader-preview">
                    {images.map((image, index) => (
                        <Image
                            alt={image.alt}
                            className="initial-loader-preview-image"
                            data-active={index === activeFrame}
                            fetchPriority={index === 0 ? "high" : "auto"}
                            fill
                            key={`${image.src}-${index}`}
                            loading="eager"
                            quality={75}
                            sizes="(min-width: 768px) 32vw, 64vw"
                            src={image.src}
                        />
                    ))}
                </div>
            ) : null}

            <div className="initial-loader-progress">{percent}%</div>
        </div>
    );
}
