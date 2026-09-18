"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, Undo02Icon } from "@hugeicons/core-free-icons";
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

const LINE = [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }];
const OUTLINE = [{ strokeDashoffset: 0 }, { strokeDashoffset: -1 }];

const SIZES = {
  sm: { height: 36, font: 13, icon: 14, px: 16 },
  md: { height: 44, font: 14, icon: 15, px: 20 },
  lg: { height: 52, font: 15, icon: 17, px: 24 },
} as const;

type Phase = "idle" | "armed" | "settled";
type Fuse = "outline" | "bottom" | "top";
type Size = keyof typeof SIZES;
type CommitReason = "press" | "fuseEnd";

export type FuseButtonProps = {
  label?: string;
  undoLabel?: string;
  doneLabel?: string;
  icon?: ReactNode;
  color?: string;
  background?: string;
  fuseColor?: string;
  size?: Size;
  radius?: number;
  undoWindow?: number;
  fuse?: Fuse;
  fuseThickness?: number;
  crossfadeMs?: number;
  commitOn?: "press" | "fuseEnd";
  pauseOnHover?: boolean;
  settle?: "reset" | "stay";
  disabled?: boolean;
  onCommit?: (reason: CommitReason) => void;
  onUndo?: () => void;
  onFuseEnd?: () => void;
  onPhaseChange?: (phase: Phase) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  ariaLabel?: string;
};

export function FuseButton({
  label = "Archive",
  undoLabel = "Undo",
  doneLabel = "Archived",
  icon,
  color = "#f5f5f5",
  background = "#27272a",
  fuseColor = "#f5a524",
  size = "md",
  radius = 22,
  undoWindow = 4000,
  fuse = "outline",
  fuseThickness = 1.5,
  crossfadeMs = 200,
  commitOn = "press",
  pauseOnHover = true,
  settle = "reset",
  disabled = false,
  onCommit,
  onUndo,
  onFuseEnd,
  onPhaseChange,
  className = "",
  type = "button",
  ariaLabel,
}: FuseButtonProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [instant, setInstant] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const idleRef = useRef<HTMLButtonElement>(null);
  const undoRef = useRef<HTMLButtonElement>(null);
  const lineRef = useRef<HTMLElement>(null);
  const rimRef = useRef<SVGRectElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const pauseRef = useRef({ hover: false, hidden: false, canHoverPause: false });
  const lastInputRef = useRef<"pointer" | "keyboard">("pointer");
  const windowRef = useRef(undoWindow);
  const latestRef = useRef({ commitOn, settle, onCommit, onUndo, onFuseEnd, onPhaseChange });
  const statusId = useId();
  const preset = SIZES[size] ?? SIZES.md;

  latestRef.current = { commitOn, settle, onCommit, onUndo, onFuseEnd, onPhaseChange };

  const go = (next: Phase) => {
    setInstant(lastInputRef.current === "keyboard");
    setPhase(next);
    latestRef.current.onPhaseChange?.(next);
  };

  const syncPlayState = () => {
    const animation = animationRef.current;
    if (!animation) return;
    const { hover, hidden } = pauseRef.current;

    if (hover || hidden) {
      if (animation.playState === "running") animation.pause();
    } else if (animation.playState === "paused") {
      void animation.play();
    }
  };

  const light = (from = 0) => {
    const element = fuse === "outline" ? rimRef.current : lineRef.current;
    if (!element) return;

    animationRef.current?.cancel();
    const animation = element.animate(fuse === "outline" ? OUTLINE : LINE, {
      duration: windowRef.current,
      easing: "linear",
      fill: "forwards",
    });

    if (from) animation.currentTime = from;
    animation.onfinish = () => {
      const latest = latestRef.current;
      latest.onFuseEnd?.();
      if (latest.commitOn === "fuseEnd") latest.onCommit?.("fuseEnd");
      lastInputRef.current = "pointer";
      go(latest.settle === "stay" ? "settled" : "idle");
    };
    animationRef.current = animation;
    syncPlayState();
  };

  const arm = () => {
    if (disabled || phase !== "idle") return;
    windowRef.current = undoWindow;
    light();
    pauseRef.current.canHoverPause = false;
    pauseRef.current.hover = false;
    if (commitOn === "press") onCommit?.("press");
    go("armed");
  };

  const undo = () => {
    if (phase !== "armed") return;
    const animation = animationRef.current;
    if (animation) {
      animation.onfinish = null;
      animation.pause();
    }
    onUndo?.();
    go("idle");
  };

  useEffect(() => {
    const inside = rootRef.current?.contains(document.activeElement);
    if (phase === "armed") undoRef.current?.focus({ preventScroll: true });
    else if (inside) (phase === "idle" ? idleRef.current : rootRef.current)?.focus({ preventScroll: true });
  }, [phase]);

  useEffect(() => {
    const onVisibility = () => {
      pauseRef.current.hidden = document.hidden;
      syncPlayState();
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      animationRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    const animation = animationRef.current;
    if (!animation || phase !== "armed") return;
    light(Number(animation.currentTime) || 0);
    // This effect intentionally restarts the fuse when its visual mode changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fuse]);

  useEffect(() => {
    if (pauseOnHover) return;
    pauseRef.current.hover = false;
    syncPlayState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseOnHover]);

  const handlePointerDown = (event: PointerEvent<HTMLSpanElement>) => {
    lastInputRef.current = "pointer";
    const pressable = phase === "armed" || (phase === "idle" && !disabled);
    if (event.button === 0 && pressable && rootRef.current) rootRef.current.dataset.pressed = "";
  };

  const release = () => {
    if (rootRef.current) delete rootRef.current.dataset.pressed;
  };

  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    if (pauseOnHover && event.pointerType === "mouse" && pauseRef.current.canHoverPause) {
      pauseRef.current.hover = true;
      syncPlayState();
    }
  };

  const handlePointerLeave = (event: PointerEvent<HTMLSpanElement>) => {
    release();
    if (event.pointerType !== "mouse") return;
    pauseRef.current.canHoverPause = true;
    pauseRef.current.hover = false;
    syncPlayState();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Enter" || event.key === " ") lastInputRef.current = "keyboard";
    if (event.key === "Escape" && phase === "armed") {
      event.preventDefault();
      lastInputRef.current = "keyboard";
      undo();
    }
  };

  const actionIcon = icon ?? null;
  const line = <i ref={lineRef} className="fuse-button__fuse" aria-hidden="true" />;
  const style = {
    "--fb-ink": color,
    "--fb-bg": background,
    "--fb-fuse": fuseColor,
    "--fb-fuse-h": `${fuseThickness}px`,
    "--fb-radius": `${radius}px`,
    "--fb-fade": `${crossfadeMs}ms`,
    "--fb-h": `${preset.height}px`,
    "--fb-fs": `${preset.font}px`,
    "--fb-icon": `${preset.icon}px`,
    "--fb-px": `${preset.px}px`,
  } as CSSProperties;

  return (
    <span
      ref={rootRef}
      tabIndex={-1}
      className={`fuse-button${className ? ` ${className}` : ""}`}
      data-phase={phase}
      data-fuse={fuse}
      data-instant={instant ? "" : undefined}
      aria-disabled={phase === "settled" || undefined}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={idleRef}
        type={type}
        className="fuse-button__face fuse-button__idle"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-hidden={phase !== "idle" || undefined}
        tabIndex={phase === "idle" ? 0 : -1}
        onClick={arm}
      >
        {actionIcon ? <span className="fuse-button__icon" aria-hidden="true">{actionIcon}</span> : null}
        {label}
      </button>
      <button
        ref={undoRef}
        type="button"
        className="fuse-button__face fuse-button__undo"
        aria-describedby={statusId}
        aria-keyshortcuts="Escape"
        aria-hidden={phase !== "armed" || undefined}
        tabIndex={phase === "armed" ? 0 : -1}
        onClick={undo}
      >
        <span className="fuse-button__icon fuse-button__icon--undo" aria-hidden="true">
          <HugeiconsIcon icon={Undo02Icon} size={preset.icon} strokeWidth={2} />
        </span>
        {undoLabel}
        {fuse !== "outline" ? line : null}
      </button>
      <span className="fuse-button__face fuse-button__settled" aria-hidden={phase !== "settled" || undefined}>
        <span className="fuse-button__icon" aria-hidden="true">
          <HugeiconsIcon icon={Tick02Icon} size={preset.icon} strokeWidth={2.2} />
        </span>
        {doneLabel}
      </span>
      {fuse === "outline" ? (
        <svg className="fuse-button__rim" aria-hidden="true">
          <rect ref={rimRef} pathLength="1" />
        </svg>
      ) : null}
      <span className="fuse-button__status" id={statusId} role="status" aria-live="polite">
        {phase === "idle" ? "" : doneLabel}
      </span>
    </span>
  );
}
