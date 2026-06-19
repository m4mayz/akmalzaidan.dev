"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CursorVariant = "default" | "pointer" | "link";

type CursorState = {
    x: number;
    y: number;
    variant: CursorVariant;
    pressed: boolean;
};

const interactiveSelector =
    "[data-cursor], a, button, [role='button'], input, textarea, select, summary";

function getCursorVariant(target: EventTarget | null): CursorVariant {
    if (!(target instanceof Element)) {
        return "default";
    }

    const interactive = target.closest(interactiveSelector);

    if (!interactive) {
        return "default";
    }

    const explicit = interactive.getAttribute("data-cursor");

    if (explicit === "link" || explicit === "pointer") {
        return explicit;
    }

    return "pointer";
}

export function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const finePointer = window.matchMedia("(pointer: fine)").matches;
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (!finePointer || reducedMotion) {
            return undefined;
        }

        const enableFrame = window.requestAnimationFrame(() => {
            setEnabled(true);
        });
        document.documentElement.classList.add("custom-cursor-active");

        const state: CursorState = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            variant: "default",
            pressed: false,
        };

        const render = () => {
            const cursor = cursorRef.current;

            if (!cursor) {
                return;
            }

            cursor.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
            cursor.dataset.variant = state.variant;
            cursor.dataset.pressed = String(state.pressed);
        };

        const onPointerMove = (event: PointerEvent) => {
            state.x = event.clientX;
            state.y = event.clientY;
            state.variant = getCursorVariant(event.target);
            render();
        };

        const onPointerDown = () => {
            state.pressed = true;
            render();
        };

        const onPointerUp = () => {
            state.pressed = false;
            render();
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointerup", onPointerUp);

        render();

        return () => {
            window.cancelAnimationFrame(enableFrame);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointerup", onPointerUp);
            document.documentElement.classList.remove("custom-cursor-active");
        };
    }, []);

    if (!enabled) {
        return null;
    }

    return (
        <div aria-hidden="true" className="custom-cursor" ref={cursorRef}>
            <span className="custom-cursor-ring" />
            <ArrowUpRight
                className="custom-cursor-icon"
                size={56}
                strokeWidth={1.7}
            />
        </div>
    );
}
