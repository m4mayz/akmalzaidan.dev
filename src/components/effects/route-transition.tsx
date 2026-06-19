"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const stripCount = 4;
const closeDuration = 620;
const openDuration = 620;
const openFallbackDelay = 4000;

type TransitionPhase = "closing" | "opening";

function scrollToTopInstant() {
    document.documentElement.classList.add("route-scroll-reset");
    window.__siteLenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ left: 0, top: 0, behavior: "auto" });

    window.requestAnimationFrame(() => {
        document.documentElement.classList.remove("route-scroll-reset");
    });
}

function getInternalAnchor(event: MouseEvent) {
    if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    ) {
        return null;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
        return null;
    }

    const anchor = target.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) {
        return null;
    }

    if (
        anchor.target ||
        anchor.hasAttribute("download") ||
        anchor.dataset.routeTransition === "false"
    ) {
        return null;
    }

    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) {
        return null;
    }

    const currentUrl = new URL(window.location.href);
    const onlyHashChanged =
        url.pathname === currentUrl.pathname &&
        url.search === currentUrl.search &&
        url.hash !== currentUrl.hash;

    if (onlyHashChanged || url.href === currentUrl.href) {
        return null;
    }

    return url;
}

export function RouteTransition() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentRoute = useMemo(() => {
        const query = searchParams.toString();
        return query ? `${pathname}?${query}` : pathname;
    }, [pathname, searchParams]);

    const previousRoute = useRef(currentRoute);
    const pendingHref = useRef<string | null>(null);
    const isLinkTransition = useRef(false);
    const closeTimer = useRef<number | null>(null);
    const openTimer = useRef<number | null>(null);
    const fallbackTimer = useRef<number | null>(null);

    const [transitionKey, setTransitionKey] = useState(0);
    const [phase, setPhase] = useState<TransitionPhase>("closing");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        return () => {
            if (closeTimer.current) window.clearTimeout(closeTimer.current);
            if (openTimer.current) window.clearTimeout(openTimer.current);
            if (fallbackTimer.current) window.clearTimeout(fallbackTimer.current);
        };
    }, []);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const url = getInternalAnchor(event);

            if (!url) {
                return;
            }

            if (isLinkTransition.current) {
                event.preventDefault();
                return;
            }

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                return;
            }

            event.preventDefault();
            pendingHref.current = `${url.pathname}${url.search}${url.hash}`;
            isLinkTransition.current = true;
            setTransitionKey((key) => key + 1);
            setPhase("closing");
            setIsVisible(true);

            closeTimer.current = window.setTimeout(() => {
                if (pendingHref.current) {
                    router.push(pendingHref.current, { scroll: false });
                }

                fallbackTimer.current = window.setTimeout(() => {
                    setPhase("opening");
                }, openFallbackDelay);
            }, closeDuration);
        };

        document.addEventListener("click", handleClick, true);

        return () => {
            document.removeEventListener("click", handleClick, true);
        };
    }, [router]);

    useEffect(() => {
        if (previousRoute.current === currentRoute) {
            return;
        }

        previousRoute.current = currentRoute;

        if (!isLinkTransition.current || pendingHref.current === null) {
            return;
        }

        scrollToTopInstant();

        if (fallbackTimer.current) {
            window.clearTimeout(fallbackTimer.current);
            fallbackTimer.current = null;
        }

        setPhase("opening");
    }, [currentRoute]);

    useEffect(() => {
        if (!isVisible || phase !== "opening") {
            return undefined;
        }

        openTimer.current = window.setTimeout(() => {
            setIsVisible(false);
            pendingHref.current = null;
            isLinkTransition.current = false;
        }, openDuration);

        return () => {
            if (openTimer.current) {
                window.clearTimeout(openTimer.current);
                openTimer.current = null;
            }
        };
    }, [isVisible, phase]);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            aria-hidden="true"
            className="route-transition"
            data-phase={phase}
            key={transitionKey}
        >
            {Array.from({ length: stripCount }, (_, index) => (
                <div
                    className="route-transition-strip"
                    key={index}
                    style={
                        {
                            "--strip-index": index,
                        } as CSSProperties
                    }
                />
            ))}
        </div>
    );
}
