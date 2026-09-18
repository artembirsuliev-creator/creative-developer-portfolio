"use client";

import { useCallback, useEffect, useId, useMemo, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";

type MaskedHeadingProps = {
  text?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  mediaType?: "image" | "video";
  src?: string;
  poster?: string;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  reveal?: "rise" | "wipe" | "fade" | "none";
  trigger?: "view" | "mount" | "hover";
  duration?: number;
  stagger?: number;
  align?: "left" | "center" | "right";
  weight?: number;
  tracking?: number;
  lineHeight?: number;
  textScale?: number;
  className?: string;
  style?: CSSProperties;
};

type MotionSettings = {
  fillScale: number;
  parallax: number;
  drift: number;
  brightness: number;
  saturation: number;
  grayscale: boolean;
  textScale: number;
};

const clamp = (value: number, min: number, max: number) => (value < min ? min : value > max ? max : value);

export function MaskedHeading({
  text = "Designed in the details",
  tag = "h2",
  mediaType = "image",
  src = "",
  poster = "",
  fillScale = 1.25,
  parallax = 26,
  drift = 18,
  brightness = 1,
  saturation = 1,
  grayscale = false,
  reveal = "rise",
  trigger = "view",
  duration = 1.1,
  stagger = 0.09,
  align = "center",
  weight = 700,
  tracking = -0.03,
  lineHeight = 1.06,
  textScale = 0.115,
  className = "",
  style,
}: MaskedHeadingProps) {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const revealRef = useRef<HTMLSpanElement>(null);
  const mediaRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const baseRefs = useRef<Array<HTMLElement | null>>([]);
  const glyphRefs = useRef<Array<SVGTextElement | null>>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const offsetRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const settingsRef = useRef<MotionSettings>({
    fillScale,
    parallax,
    drift,
    brightness,
    saturation,
    grayscale,
    textScale,
  });

  const clipId = `mh-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const words = useMemo(() => String(text).split(/\s+/).filter(Boolean), [text]);
  const Tag = tag;
  settingsRef.current = { fillScale, parallax, drift, brightness, saturation, grayscale, textScale };

  const place = useCallback(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;

    const settings = settingsRef.current;
    const maxX = Math.max(0, ((settings.fillScale - 1) / 2) * root.clientWidth);
    const maxY = Math.max(0, ((settings.fillScale - 1) / 2) * root.clientHeight);
    const offset = offsetRef.current;

    media.style.transform = `translate3d(${clamp(offset.x, -maxX, maxX).toFixed(2)}px, ${clamp(offset.y, -maxY, maxY).toFixed(2)}px, 0) scale(${settings.fillScale})`;
    media.style.filter = `brightness(${settings.brightness}) saturate(${settings.saturation})${settings.grayscale ? " grayscale(1)" : ""}`;
  }, []);

  const sync = useCallback(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;

    const settings = settingsRef.current;
    root.style.fontSize = `${clamp(root.clientWidth * settings.textScale, 20, 200).toFixed(1)}px`;
    const computedStyle = window.getComputedStyle(measure);

    wordRefs.current.forEach((word, index) => {
      const base = baseRefs.current[index];
      const glyph = glyphRefs.current[index];
      if (!word || !base || !glyph) return;

      glyph.setAttribute("x", `${word.offsetLeft}`);
      glyph.setAttribute("y", `${base.offsetTop}`);
      glyph.style.fontFamily = computedStyle.fontFamily;
      glyph.style.fontSize = computedStyle.fontSize;
      glyph.style.fontWeight = computedStyle.fontWeight;
      glyph.style.fontStyle = computedStyle.fontStyle;
      glyph.style.letterSpacing = computedStyle.letterSpacing;
    });

    place();
  }, [place]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let frameId = 0;
    let last = performance.now();
    let clock = 0;

    const stop = () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const frame = (now: number) => {
      frameId = 0;
      if (reducedMotion.matches) return;

      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += delta;
      const settings = settingsRef.current;
      const offset = offsetRef.current;
      const dx = Math.sin(clock * 0.21) * settings.drift;
      const dy = Math.cos(clock * 0.17) * settings.drift * 0.6;
      const ease = 1 - Math.exp(-delta / 0.18);

      offset.x += (offset.tx + dx - offset.x) * ease;
      offset.y += (offset.ty + dy - offset.y) * ease;
      place();
      frameId = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reducedMotion.matches && frameId === 0) {
        place();
        return;
      }
      if (frameId === 0) frameId = requestAnimationFrame(frame);
    };

    const onMove = (event: PointerEvent) => {
      const settings = settingsRef.current;
      if (settings.parallax <= 0) return;
      const rect = root.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      const ny = ((event.clientY - rect.top) / (rect.height || 1)) * 2 - 1;
      offsetRef.current.tx = clamp(nx, -1, 1) * -settings.parallax;
      offsetRef.current.ty = clamp(ny, -1, 1) * -settings.parallax;
    };

    const onLeave = () => {
      offsetRef.current.tx = 0;
      offsetRef.current.ty = 0;
    };
    const onReducedMotionChange = () => {
      stop();
      start();
    };

    sync();
    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(root);
    document.fonts?.ready.then(sync).catch(() => {});

    if (finePointer) {
      root.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerleave", onLeave);
    }
    reducedMotion.addEventListener("change", onReducedMotionChange);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", onReducedMotionChange);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [place, sync]);

  useEffect(() => {
    sync();
  }, [sync, words, tag, align, weight, tracking, lineHeight, textScale]);

  useEffect(() => {
    const root = rootRef.current;
    const layer = revealRef.current;
    if (!root || !layer) return undefined;

    const glyphs = glyphRefs.current.filter((glyph): glyph is SVGTextElement => Boolean(glyph));
    if (!glyphs.length) return undefined;

    const riseDistance = () => (parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.15;
    const settle = () => {
      gsap.set(glyphs, { y: 0 });
      gsap.set(layer, { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" });
    };
    const rest = () => {
      if (reveal === "rise") gsap.set(glyphs, { y: riseDistance() });
      if (reveal === "wipe") gsap.set(layer, { clipPath: "inset(0% 100% 0% 0%)" });
      if (reveal === "fade") gsap.set(layer, { opacity: 0, scale: 1.08 });
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reveal === "none" || reduce) {
      settle();
      return undefined;
    }

    const play = () => {
      tweenRef.current?.kill();
      if (reveal === "rise") {
        gsap.set(layer, { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" });
        tweenRef.current = gsap.fromTo(glyphs, { y: riseDistance() }, { y: 0, duration, stagger, ease: "power4.out" });
      } else if (reveal === "wipe") {
        gsap.set(glyphs, { y: 0 });
        const state = { progress: 100 };
        tweenRef.current = gsap.to(state, {
          progress: 0,
          duration,
          ease: "power3.inOut",
          onUpdate: () => {
            layer.style.clipPath = `inset(0% ${state.progress}% 0% 0%)`;
          },
        });
      } else {
        gsap.set(glyphs, { y: 0 });
        tweenRef.current = gsap.fromTo(layer, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration, ease: "power3.out" });
      }
    };

    if (trigger === "hover") {
      settle();
      root.addEventListener("pointerenter", play);
      return () => {
        root.removeEventListener("pointerenter", play);
        tweenRef.current?.kill();
      };
    }

    if (trigger === "view") {
      settle();
      rest();
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            play();
            observer.disconnect();
          }
        },
        { threshold: 0.25 },
      );
      observer.observe(root);
      return () => {
        observer.disconnect();
        tweenRef.current?.kill();
      };
    }

    play();
    return () => tweenRef.current?.kill();
  }, [duration, reveal, stagger, trigger, words]);

  return (
    <Tag
      ref={rootRef}
      aria-label={text}
      className={`masked-heading ${className}`.trim()}
      style={{ textAlign: align, fontWeight: weight, letterSpacing: `${tracking}em`, lineHeight, ...style }}
    >
      <span ref={measureRef} className="masked-heading__measure" aria-hidden="true">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            ref={(element) => {
              wordRefs.current[index] = element;
            }}
            className="masked-heading__word"
          >
            {word}
            <i
              ref={(element) => {
                baseRefs.current[index] = element;
              }}
              className="masked-heading__baseline"
            />
          </span>
        ))}
      </span>

      <svg className="masked-heading__defs" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            {words.map((word, index) => (
              <text
                key={`${word}-${index}`}
                ref={(element) => {
                  glyphRefs.current[index] = element;
                }}
              >
                {word}
              </text>
            ))}
          </clipPath>
        </defs>
      </svg>

      <span ref={revealRef} className="masked-heading__reveal" aria-hidden="true">
        <span className="masked-heading__clip" style={{ clipPath: `url(#${clipId})` }}>
          <span ref={mediaRef} className="masked-heading__media">
            {src ? (
              mediaType === "video" ? (
                <video className="masked-heading__source" src={src} poster={poster} autoPlay muted loop playsInline />
              ) : (
                <img className="masked-heading__source" src={src} alt="" draggable={false} />
              )
            ) : (
              <span className="masked-heading__gradient" />
            )}
          </span>
        </span>
      </span>
    </Tag>
  );
}
