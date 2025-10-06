"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  delayMs?: number;
  once?: boolean;
  offset?: number;
  animation?: "fade-up" | "fade" | "slide-left" | "slide-right" | "zoom-in";
}

export const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(
  (
    {
      className,
      children,
      asChild,
      delayMs = 0,
      once = true,
      offset = 0.15,
      animation = "fade-up",
      ...props
    },
    ref
  ) => {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      const element = localRef.current;
      if (!element) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (delayMs > 0) {
                const timer = setTimeout(() => setIsVisible(true), delayMs);
                if (!once) return () => clearTimeout(timer);
              } else {
                setIsVisible(true);
              }
              if (once) observer.unobserve(entry.target);
            } else if (!once) {
              setIsVisible(false);
            }
          });
        },
        { threshold: offset }
      );

      observer.observe(element);
      return () => observer.disconnect();
    }, [delayMs, once, offset]);

    const animationBase = "opacity-0 translate-y-6 will-change-transform transition-all duration-700 ease-out";
    const animationVisible = "opacity-100 translate-y-0";
    const variants: Record<NonNullable<RevealProps["animation"]>, string> = {
      "fade-up": animationBase,
      fade: "opacity-0 will-change-transform transition-opacity duration-700 ease-out",
      "slide-left": "opacity-0 translate-x-6 will-change-transform transition-all duration-700 ease-out",
      "slide-right": "opacity-0 -translate-x-6 will-change-transform transition-all duration-700 ease-out",
      "zoom-in": "opacity-0 scale-[0.97] will-change-transform transition-all duration-700 ease-out",
    };

    const visibleVariants: Record<NonNullable<RevealProps["animation"]>, string> = {
      "fade-up": animationVisible,
      fade: "opacity-100",
      "slide-left": "opacity-100 translate-x-0",
      "slide-right": "opacity-100 translate-x-0",
      "zoom-in": "opacity-100 scale-100",
    };

    const Comp: any = asChild ? (children as any)?.type ?? "div" : "div";
    const childProps = asChild && React.isValidElement(children) ? (children as any).props : {};

    return (
      <Comp
        ref={setRefs}
        className={cn(
          variants[animation],
          isVisible && visibleVariants[animation],
          className,
          childProps?.className
        )}
        {...childProps}
        {...props}
      >
        {asChild ? (children as any)?.props?.children : children}
      </Comp>
    );
  }
);

Reveal.displayName = "Reveal";


