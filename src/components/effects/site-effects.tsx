"use client";

import { CustomCursor } from "@/components/effects/custom-cursor";
import { LenisProvider } from "@/components/effects/lenis-provider";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import Galaxy from "@/components/galaxy";

export function SiteEffects() {
    return (
        <>
            <LenisProvider />
            <ScrollReveal />
            <CustomCursor />
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 z-0 bg-background"
            >
                <Galaxy
                    mouseRepulsion
                    mouseInteraction
                    density={0.6}
                    glowIntensity={0.2}
                    saturation={0.4}
                    hueShift={130}
                    twinkleIntensity={0.1}
                    rotationSpeed={0}
                    repulsionStrength={0.5}
                    autoCenterRepulsion={0}
                    starSpeed={0.1}
                    speed={0.4}
                />
            </div>
        </>
    );
}
