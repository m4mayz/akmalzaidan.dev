"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

type ShowcaseSlide = {
    src: string;
    alt: string;
};

type ShowcaseSlideshowProps = {
    images: ShowcaseSlide[];
};

const slideDuration = 5200;
const progressRadius = 26;
const progressCircumference = 2 * Math.PI * progressRadius;

export function ShowcaseSlideshow({ images }: ShowcaseSlideshowProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progressKey, setProgressKey] = useState(0);

    useEffect(() => {
        if (!isPlaying || images.length < 2) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setActiveIndex((current) => (current + 1) % images.length);
            setProgressKey((current) => current + 1);
        }, slideDuration);

        return () => window.clearTimeout(timer);
    }, [activeIndex, images.length, isPlaying]);

    const togglePlayback = () => {
        setIsPlaying((current) => !current);
        setProgressKey((current) => current + 1);
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-white/5">
            {images.map((image, index) => (
                <Image
                    alt={image.alt}
                    className={`object-cover transition-opacity duration-1000 ease-out ${
                        index === activeIndex ? "opacity-100" : "opacity-0"
                    }`}
                    fill
                    key={image.src}
                    loading="lazy"
                    sizes="100vw"
                    src={image.src}
                />
            ))}

            <button
                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                className="absolute bottom-6 right-6 grid h-12 w-12 place-items-center rounded-full text-white transition-opacity hover:opacity-80"
                data-cursor="pointer"
                onClick={togglePlayback}
                type="button"
            >
                <svg
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full -rotate-90"
                    shapeRendering="geometricPrecision"
                    viewBox="0 0 56 56"
                >
                    <circle
                        className="text-white/25"
                        cx="28"
                        cy="28"
                        fill="none"
                        r={progressRadius}
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                    {isPlaying ? (
                        <circle
                            className="showcase-progress-ring text-white"
                            cx="28"
                            cy="28"
                            fill="none"
                            key={progressKey}
                            r={progressRadius}
                            stroke="currentColor"
                            strokeDasharray={progressCircumference}
                            strokeDashoffset={progressCircumference}
                            strokeLinecap="round"
                            strokeWidth="1"
                            style={
                                {
                                    "--progress-circumference":
                                        progressCircumference,
                                } as CSSProperties
                            }
                        />
                    ) : null}
                </svg>
                {isPlaying ? (
                    <Pause aria-hidden="true" size={16} strokeWidth={1.8} />
                ) : (
                    <Play aria-hidden="true" size={16} strokeWidth={1.8} />
                )}
            </button>
        </div>
    );
}
