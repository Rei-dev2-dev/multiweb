"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "right" | "center" | "justify" | "initial" | "inherit";
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
  useScrollTrigger?: boolean;
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  useScrollTrigger = false,
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.fonts?.status === "loaded") {
      setFontsLoaded(true);
    } else if (document.fonts?.ready) {
      document.fonts.ready.then(() => setFontsLoaded(true));
    } else {
      setFontsLoaded(true);
    }
  }, []);

  const units =
    splitType === "words"
      ? text.split(" ").map((w, i, arr) => (i < arr.length - 1 ? w + "\u00A0" : w))
      : text.split("");

  useEffect(() => {
    if (!fontsLoaded || !containerRef.current) return;

    const spans = containerRef.current.querySelectorAll<HTMLSpanElement>(".split-unit");
    if (!spans.length) return;

    const staggerSec = delay / 1000;

    const tweenVars: gsap.TweenVars = {
      ...to,
      duration,
      ease,
      stagger: staggerSec,
      onComplete: () => {
        onLetterAnimationComplete?.();
      },
      willChange: "transform, opacity",
      force3D: true,
    };

    if (useScrollTrigger) {
      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
          ? `-=${Math.abs(marginValue)}${marginUnit}`
          : `+=${marginValue}${marginUnit}`;
      tweenVars.scrollTrigger = {
        trigger: containerRef.current,
        start: `top ${startPct}%${sign}`,
        once: true,
        fastScrollEnd: true,
      };
    }

    const tween = gsap.fromTo(spans, { ...from }, tweenVars);

    return () => {
      tween.kill();
      if (useScrollTrigger) {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === containerRef.current) st.kill();
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsLoaded, text, delay, duration, ease, useScrollTrigger]);

  const style: React.CSSProperties = {
    textAlign,
    display: "inline-block",
    whiteSpace: "normal",
    wordWrap: "break-word",
  };

  const Tag = (tag || "p") as React.ElementType;

  return (
    <Tag
      ref={containerRef as React.Ref<never>}
      style={style}
      className={`split-parent ${className}`}
    >
      {units.map((unit, i) => (
        <span
          key={i}
          className="split-unit"
          style={{ display: "inline-block", willChange: "transform, opacity" }}
        >
          {unit === " " ? "\u00A0" : unit}
        </span>
      ))}
    </Tag>
  );
};

export default SplitText;
