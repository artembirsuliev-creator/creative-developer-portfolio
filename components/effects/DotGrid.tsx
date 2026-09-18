"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";

import "./DotGrid.css";

gsap.registerPlugin(InertiaPlugin);

type Dot = {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  inertiaApplied: boolean;
};

type PointerState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  lastTime: number;
  lastX: number;
  lastY: number;
};

type DotGridProps = {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
};

const throttle = (callback: (event: MouseEvent) => void, limit: number) => {
  let lastCall = 0;

  return (event: MouseEvent) => {
    const now = performance.now();
    if (now - lastCall < limit) return;
    lastCall = now;
    callback(event);
  };
};

const hexToRgb = (hex: string) => {
  const value = hex.trim().replace(/^#/, "");
  const normalized = value.length === 3 ? value.replace(/./g, (channel) => channel + channel) : value;
  const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);

  if (!match) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
};

export function DotGrid({
  dotSize = 6,
  gap = 26,
  baseColor = "#5f4b96",
  activeColor = "#d8c7ff",
  proximity = 150,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = "",
  style,
}: DotGridProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef<PointerState>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });
  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const buildGrid = useCallback(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const { width, height } = wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const columns = Math.max(1, Math.floor((width + gap) / (dotSize + gap)));
    const rows = Math.max(1, Math.floor((height + gap) / (dotSize + gap)));
    const cell = dotSize + gap;
    const gridWidth = cell * columns - gap;
    const gridHeight = cell * rows - gap;
    const startX = (width - gridWidth) / 2 + dotSize / 2;
    const startY = (height - gridHeight) / 2 + dotSize / 2;
    const dots: Dot[] = [];

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        dots.push({
          cx: startX + x * cell,
          cy: startY + y * cell,
          xOffset: 0,
          yOffset: 0,
          inertiaApplied: false,
        });
      }
    }

    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const radiusSquared = proximity * proximity;
    let frameId = 0;

    const draw = () => {
      const currentCanvas = canvasRef.current;
      if (!currentCanvas) return;

      const dpr = window.devicePixelRatio || 1;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, currentCanvas.width / dpr, currentCanvas.height / dpr);
      const { x: pointerX, y: pointerY } = pointerRef.current;

      for (const dot of dotsRef.current) {
        const x = dot.cx + dot.xOffset;
        const y = dot.cy + dot.yOffset;
        const dx = dot.cx - pointerX;
        const dy = dot.cy - pointerY;
        const distanceSquared = dx * dx + dy * dy;
        let fillStyle = baseColor;

        if (distanceSquared <= radiusSquared) {
          const distance = Math.sqrt(distanceSquared);
          const amount = 1 - distance / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * amount);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * amount);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * amount);
          fillStyle = `rgb(${r}, ${g}, ${b})`;
        }

        context.beginPath();
        context.fillStyle = fillStyle;
        context.arc(x, y, dotSize / 2, 0, Math.PI * 2);
        context.fill();
      }

      if (!reducedMotion.matches) frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [activeRgb, baseColor, baseRgb, dotSize, proximity]);

  useEffect(() => {
    buildGrid();
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const resizeObserver = new ResizeObserver(buildGrid);
    resizeObserver.observe(wrapper);
    return () => resizeObserver.disconnect();
  }, [buildGrid]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const onMove = (event: MouseEvent) => {
      const now = performance.now();
      const pointer = pointerRef.current;
      const delta = pointer.lastTime ? now - pointer.lastTime : 16;
      const dx = event.clientX - pointer.lastX;
      const dy = event.clientY - pointer.lastY;
      let vx = (dx / delta) * 1000;
      let vy = (dy / delta) * 1000;
      let speed = Math.hypot(vx, vy);

      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }

      pointer.lastTime = now;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      pointer.vx = vx;
      pointer.vy = vy;
      pointer.speed = speed;

      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const distance = Math.hypot(dot.cx - pointer.x, dot.cy - pointer.y);
        if (speed > speedTrigger && distance < proximity && !dot.inertiaApplied) {
          dot.inertiaApplied = true;
          gsap.killTweensOf(dot);
          const pushX = dot.cx - pointer.x + vx * 0.005;
          const pushY = dot.cy - pointer.y + vy * 0.005;
          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1, 0.75)",
                onComplete: () => {
                  dot.inertiaApplied = false;
                },
              });
            },
          } as gsap.TweenVars);
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const centerX = event.clientX - rect.left;
      const centerY = event.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const distance = Math.hypot(dot.cx - centerX, dot.cy - centerY);
        if (distance >= shockRadius || dot.inertiaApplied) continue;

        dot.inertiaApplied = true;
        gsap.killTweensOf(dot);
        const falloff = Math.max(0, 1 - distance / shockRadius);
        const pushX = (dot.cx - centerX) * shockStrength * falloff;
        const pushY = (dot.cy - centerY) * shockStrength * falloff;

        gsap.to(dot, {
          inertia: { xOffset: pushX, yOffset: pushY, resistance },
          onComplete: () => {
            gsap.to(dot, {
              xOffset: 0,
              yOffset: 0,
              duration: returnDuration,
              ease: "elastic.out(1, 0.75)",
              onComplete: () => {
                dot.inertiaApplied = false;
              },
            });
          },
        } as gsap.TweenVars);
      }
    };

    const throttledMove = throttle(onMove, 50);
    window.addEventListener("mousemove", throttledMove, { passive: true });
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("mousemove", throttledMove);
      window.removeEventListener("click", onClick);
      dotsRef.current.forEach((dot) => gsap.killTweensOf(dot));
    };
  }, [maxSpeed, proximity, resistance, returnDuration, shockRadius, shockStrength, speedTrigger]);

  return (
    <section className={`dot-grid ${className}`.trim()} style={style} aria-hidden="true">
      <div ref={wrapperRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </section>
  );
}
