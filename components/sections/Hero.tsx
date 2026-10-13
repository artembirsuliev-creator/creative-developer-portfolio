"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";

/** A procedural chromatic ring that unfolds into a tunnel as the page scrolls. */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !canvas || !ctx) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, visible = true;
    let reduced = media.matches;
    const start = performance.now();
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const paint = (now: number) => {
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / Math.max(1, section.offsetHeight - window.innerHeight)));
      section.style.setProperty("--journey", String(progress));
      ctx.clearRect(0, 0, width, height);
      const time = reduced ? 0 : (now - start) / 1000;
      const radius = Math.min(width * 0.33, height * 0.34, 295);
      const cx = width / 2, cy = height / 2;
      // Deterministic stars, so resizing and reduced-motion never randomize the scene.
      for (let i = 0; i < 48; i++) {
        const x = ((i * 137.51) % 1000) / 1000 * width;
        const y = ((i * 231.17) % 1000) / 1000 * height;
        ctx.fillStyle = `rgba(205,211,226,${0.12 + (Math.sin(time * 0.4 + i) + 1) * 0.13})`;
        ctx.fillRect(x, y, i % 5 === 0 ? 2 : 1, 1);
      }
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalAlpha = 1 - progress * 0.85;
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 210; i++) {
        const a = (i / 210) * Math.PI * 2;
        const pulse = Math.sin(a * 13 + time * 0.6) * Math.cos(a * 7 - time * 0.3);
        const r = radius + pulse * 17;
        const length = 12 + Math.pow(Math.sin(a * 19 + time * 0.45), 2) * 62;
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        const hue = (i * 2.3 + time * 12) % 360;
        const gradient = ctx.createLinearGradient(x, y - length, x, y + length);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.35, `hsla(${hue},85%,62%,0.18)`);
        gradient.addColorStop(0.5, `hsla(${hue},65%,86%,0.9)`);
        gradient.addColorStop(0.65, `hsla(${(hue + 90) % 360},85%,60%,0.25)`);
        gradient.addColorStop(1, "transparent");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = i % 4 === 0 ? 1.4 : 0.6;
        ctx.beginPath();
        ctx.moveTo(x, y - length);
        ctx.lineTo(x, y + length);
        ctx.stroke();
      }
      ctx.restore();
      if (visible && !document.hidden && !reduced) frame = requestAnimationFrame(paint);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden) paint(performance.now());
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; restart(); });
    observer.observe(section);
    const sizeObserver = new ResizeObserver(() => { resize(); restart(); });
    sizeObserver.observe(canvas);
    const motionChange = () => { reduced = media.matches; restart(); };
    const onScroll = () => { if (reduced && visible) paint(performance.now()); };
    media.addEventListener("change", motionChange);
    document.addEventListener("visibilitychange", restart);
    window.addEventListener("scroll", onScroll, { passive: true });
    resize();
    restart();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      media.removeEventListener("change", motionChange);
      document.removeEventListener("visibilitychange", restart);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="signal-journey" ref={sectionRef} aria-labelledby="intro-heading">
      <div className="signal-sticky">
        <canvas ref={canvasRef} className="signal-canvas" aria-hidden="true" />
        <div className="signal-tunnel" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => <span key={i} style={{ "--frame": i } as React.CSSProperties} />)}
        </div>
        <div className="signal-intro">
          <p className="signal-label">INDEPENDENT CREATIVE DEVELOPER</p>
          <div className="signal-greeting">
            <h1 id="intro-heading">Hi, I’m Artem<span className="signal-dot">.</span></h1>
            <span className="signal-avatar" aria-hidden="true">A<span>✦</span></span>
          </div>
          <p className="signal-caption">Дизайн. Движение. Код.</p>
          <a className="signal-text-link" href={siteConfig.telegramUrl} target="_blank" rel="noreferrer">Обсудить проект <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
        <div className="signal-hero-bottom"><span>Доступен для новых проектов</span><a href="#about">Листай дальше <ArrowDown size={13} aria-hidden="true" /></a><span>PORTFOLIO / 2026</span></div>
      </div>
    </section>
  );
}
