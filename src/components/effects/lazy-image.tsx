"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type LazyImageProps = Omit<ImageProps, "loading"> & {
    rootMargin?: string;
    placeholderClassName?: string;
};

export function LazyImage({
    rootMargin = "260px 0px",
    placeholderClassName,
    className,
    onLoad,
    ...imageProps
}: LazyImageProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const root = rootRef.current;

        if (!root || shouldLoad) {
            return undefined;
        }

        if (!("IntersectionObserver" in window)) {
            setShouldLoad(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin },
        );

        observer.observe(root);

        return () => observer.disconnect();
    }, [rootMargin, shouldLoad]);

    return (
        <div className="absolute inset-0" ref={rootRef}>
            <div
                className={cn(
                    "absolute inset-0 bg-white/5 transition-opacity duration-700 ease-out",
                    isLoaded ? "opacity-0" : "opacity-100",
                    placeholderClassName,
                )}
            />
            {shouldLoad ? (
                <Image
                    {...imageProps}
                    className={cn(
                        "opacity-0 transition-opacity duration-700 ease-out",
                        isLoaded && "opacity-100",
                        className,
                    )}
                    loading="lazy"
                    onLoad={(event) => {
                        setIsLoaded(true);
                        onLoad?.(event);
                    }}
                />
            ) : null}
        </div>
    );
}
