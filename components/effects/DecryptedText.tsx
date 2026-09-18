"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type AnimateOn = "view" | "hover" | "inViewHover" | "click";
type RevealDirection = "start" | "end" | "center";
type ClickMode = "once" | "toggle";

type DecryptedTextProps = {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: RevealDirection;
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: AnimateOn;
  clickMode?: ClickMode;
  style?: CSSProperties;
};

const buildOrder = (text: string, direction: RevealDirection) => {
  const indices = Array.from(text).reduce<number[]>((result, char, index) => {
    if (!/\s/.test(char)) result.push(index);
    return result;
  }, []);

  if (direction === "start") return indices;
  if (direction === "end") return indices.reverse();

  const middle = Math.floor(indices.length / 2);
  const order: number[] = [];
  let offset = 0;

  while (order.length < indices.length) {
    const index = offset % 2 === 0 ? middle + offset / 2 : middle - Math.ceil(offset / 2);
    if (index >= 0 && index < indices.length) order.push(indices[index]);
    offset += 1;
  }

  return order;
};

export function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "hover",
  clickMode = "once",
  style,
}: DecryptedTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== "click");
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealedRef = useRef(new Set<number>());
  const orderRef = useRef<number[]>([]);
  const pointerRef = useRef(0);
  const iterationRef = useRef(0);
  const directionRef = useRef<"forward" | "reverse">("forward");

  const availableChars = useMemo(() => {
    if (useOriginalCharsOnly) {
      return Array.from(new Set(text.split(""))).filter((char) => !/\s/.test(char));
    }
    return characters.split("");
  }, [characters, text, useOriginalCharsOnly]);

  const scrambleText = useCallback(
    (revealed: Set<number>) =>
      text
        .split("")
        .map((char, index) => {
          if (/\s/.test(char) || revealed.has(index)) return char;
          return availableChars[Math.floor(Math.random() * availableChars.length)] ?? char;
        })
        .join(""),
    [availableChars, text],
  );

  const clearTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const revealAll = useCallback(() => {
    const all = new Set(buildOrder(text, "start"));
    revealedRef.current = all;
    setRevealedIndices(all);
    setDisplayText(text);
    setIsAnimating(false);
    setIsDecrypted(true);
  }, [text]);

  const startDecrypt = useCallback(
    (direction: "forward" | "reverse" = "forward") => {
      clearTimer();

      if (shouldReduceMotion) {
        revealAll();
        return;
      }

      const order = buildOrder(text, revealDirection);
      const initial = direction === "reverse" ? new Set(order) : new Set<number>();
      orderRef.current = direction === "reverse" ? order.slice().reverse() : order;
      pointerRef.current = 0;
      iterationRef.current = 0;
      directionRef.current = direction;
      revealedRef.current = initial;
      setRevealedIndices(initial);
      setDisplayText(direction === "reverse" ? text : scrambleText(initial));
      setIsDecrypted(direction === "reverse");
      setIsAnimating(true);
    }, [clearTimer, revealAll, revealDirection, scrambleText, shouldReduceMotion, text],
  );

  useEffect(() => {
    if (!isAnimating) return undefined;

    intervalRef.current = setInterval(() => {
      setRevealedIndices((previous) => {
        const next = new Set(previous);

        if (sequential) {
          const index = orderRef.current[pointerRef.current];
          if (index === undefined) {
            clearTimer();
            if (directionRef.current === "forward") revealAll();
            else {
              setIsAnimating(false);
              setIsDecrypted(false);
            }
            return next;
          }

          if (directionRef.current === "forward") next.add(index);
          else next.delete(index);
          pointerRef.current += 1;
          revealedRef.current = next;
          setDisplayText(next.size === orderRef.current.length ? text : scrambleText(next));
          return next;
        }

        iterationRef.current += 1;
        if (directionRef.current === "forward") {
          setDisplayText(scrambleText(next));
          if (iterationRef.current >= maxIterations) {
            clearTimer();
            revealAll();
          }
        } else if (iterationRef.current >= maxIterations) {
          clearTimer();
          setDisplayText(scrambleText(new Set()));
          setIsAnimating(false);
          setIsDecrypted(false);
        } else {
          setDisplayText(scrambleText(next));
        }

        return next;
      });
    }, Math.max(16, speed));

    return clearTimer;
  }, [clearTimer, isAnimating, maxIterations, revealAll, scrambleText, sequential, speed, text]);

  useEffect(() => {
    if (animateOn === "click" && !shouldReduceMotion) {
      const empty = new Set<number>();
      revealedRef.current = empty;
      setRevealedIndices(empty);
      setDisplayText(scrambleText(empty));
      setIsDecrypted(false);
    } else {
      revealAll();
    }
    setHasAnimated(false);
    setIsAnimating(false);
    clearTimer();
  }, [animateOn, clearTimer, revealAll, scrambleText, shouldReduceMotion, text]);

  useEffect(() => {
    if (animateOn !== "view" && animateOn !== "inViewHover") return undefined;

    const current = containerRef.current;
    if (!current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !hasAnimated) {
          startDecrypt();
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(current);

    return () => observer.disconnect();
  }, [animateOn, hasAnimated, startDecrypt]);

  useEffect(() => clearTimer, [clearTimer]);

  const handleMouseEnter = () => {
    if (animateOn === "hover" || animateOn === "inViewHover") startDecrypt();
  };

  const handleMouseLeave = () => {
    if (animateOn === "hover" || animateOn === "inViewHover") revealAll();
  };

  const handleClick = () => {
    if (animateOn !== "click") return;
    if (clickMode === "once" && isDecrypted) return;
    startDecrypt(clickMode === "toggle" && isDecrypted ? "reverse" : "forward");
  };

  return (
    <motion.span
      ref={containerRef}
      aria-label={text}
      className={parentClassName}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block", whiteSpace: "pre-wrap", ...style }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealed = revealedIndices.has(index) || (!isAnimating && isDecrypted);
          return (
            <span className={isRevealed ? className : encryptedClassName} key={`${index}-${char}`}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
