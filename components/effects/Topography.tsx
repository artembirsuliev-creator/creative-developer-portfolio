"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

import "./Topography.css";

type ColorMode = "elevation" | "uniform" | "alternating";

type TopographyProps = {
  lowColor?: string;
  midColor?: string;
  highColor?: string;
  speed?: number;
  morphAmount?: number;
  morphSpeed?: number;
  bands?: number;
  thickness?: number;
  scale?: number;
  pixelSize?: number;
  glow?: number;
  colorMode?: ColorMode;
  contrast?: number;
  brightness?: number;
  fillBands?: boolean;
  opacity?: number;
  grain?: boolean;
  grainIntensity?: number;
  mouseInteraction?: boolean;
  mouseRadius?: number;
  mouseStrength?: number;
  lightMode?: boolean;
  className?: string;
};

type TopographyContext = {
  renderer: Renderer;
  program: Program;
  mesh: Mesh;
};

const contextMap = new WeakMap<HTMLDivElement, TopographyContext>();

const CTRL_INDICES = [
  [1, -2, 3, -4],
  [9, -8, 7, -6],
  [5, 2, 5, -5],
  [-1, -3, 8, 9],
];

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uMorphAmount;
uniform float uBands;
uniform float uThickness;
uniform float uScale;
uniform float uPixelSize;
uniform float uGlow;
uniform float uColorMode;
uniform float uContrast;
uniform float uBrightness;
uniform float uFillBands;
uniform float uOpacity;
uniform float uLightMode;
uniform vec3 uLow;
uniform vec3 uMid;
uniform vec3 uHigh;
uniform vec2 uMouse;
uniform float uMouseEnabled;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uMouseActive;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec4 uCtrlA;
uniform vec4 uCtrlB;
uniform vec4 uCtrlC;
uniform vec4 uCtrlD;
out vec4 fragColor;

float bez(float t, vec4 c) {
  float w = 6.2831853 * t;
  return 0.5 * (c.x * sin(w) + c.y * cos(w) + c.z * sin(2.0 * w) + c.w * cos(2.0 * w));
}

float field(vec2 uv) {
  vec2 a = vec2(bez(uv.x, uCtrlA), bez(uv.x, uCtrlB));
  vec2 b = vec2(bez(uv.y, uCtrlC), bez(uv.y, uCtrlD));
  return distance(a, b);
}

vec3 elevationColor(float e) {
  vec3 c = mix(uLow, uMid, smoothstep(0.0, 0.5, e));
  return mix(c, uHigh, smoothstep(0.5, 1.0, e));
}

void main() {
  vec2 res = iResolution.xy;
  vec2 uv = gl_FragCoord.xy / res;
  vec2 suv = (uv - 0.5) / max(uScale, 0.001) + 0.5;
  vec2 sampleUv = suv;

  if (uPixelSize > 1.0) {
    vec2 px = res / uPixelSize;
    sampleUv = (floor(suv * px) + 0.5) / px;
  }

  float fv = field(sampleUv);

  if (uMouseEnabled > 0.5) {
    vec2 d = uv - uMouse;
    d.x *= res.x / max(res.y, 1.0);
    float r = max(uMouseRadius, 0.001);
    float bump = exp(-dot(d, d) / (r * r)) * uMouseStrength * uMouseActive;
    fv += bump;
  }

  float f = fv * uBands;
  float frac = fract(f);
  float lineDist = min(frac, 1.0 - frac);
  float aa = fwidth(f) + 0.0001;
  float mask = 1.0 - smoothstep(uThickness - aa, uThickness + aa, lineDist);
  float glowR = uThickness + uGlow * 0.5 + aa;
  float glow = (1.0 - smoothstep(uThickness, glowR, lineDist)) * step(0.0001, uGlow);
  float elev = clamp(fv / (uMorphAmount * 2.5 + 0.001), 0.0, 1.0);

  vec3 lineCol;
  if (uColorMode < 0.5) {
    lineCol = elevationColor(elev);
  } else if (uColorMode < 1.5) {
    lineCol = uMid;
  } else {
    float parity = mod(floor(f), 2.0);
    lineCol = mix(uMid, uHigh, parity);
  }

  float coverage = clamp(mask + glow * 0.55, 0.0, 1.0);
  coverage = pow(coverage, max(uContrast, 0.001));
  vec3 outColor = lineCol;
  float outAlpha = coverage;

  if (uFillBands > 0.5) {
    vec3 fillCol = elevationColor(elev);
    float fillA = 0.1 * elev;
    outColor = mix(fillCol, lineCol, coverage);
    outAlpha = clamp(coverage + fillA, 0.0, 1.0);
  }

  if (uGrain > 0.5) {
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453);
    outAlpha += (g - 0.5) * uGrainIntensity;
  }

  outColor *= uBrightness;
  outColor = clamp(outColor, 0.0, 1.0);
  float a = clamp(outAlpha, 0.0, 1.0) * uOpacity;

  if (uLightMode > 0.5) {
    float peak = max(outColor.r, max(outColor.g, outColor.b));
    vec3 chroma = pow(clamp(outColor / max(peak, 0.0001), 0.0, 1.0), vec3(1.18));
    fragColor = vec4(mix(vec3(1.0), chroma, a * 0.94), 1.0);
  } else {
    fragColor = vec4(outColor * a, a);
  }
}
`;

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const colorModeToFloat = (mode: ColorMode) => {
  if (mode === "uniform") return 1;
  if (mode === "alternating") return 2;
  return 0;
};

export default function Topography({
  lowColor = "#5227FF",
  midColor = "#FF9FFC",
  highColor = "#FFFFFF",
  speed = 0.35,
  morphAmount = 3,
  morphSpeed = 0.05,
  bands = 2,
  thickness = 0.01,
  scale = 1,
  pixelSize = 1,
  glow = 0.5,
  colorMode = "elevation",
  contrast = 3,
  brightness = 1,
  fillBands = false,
  opacity = 1,
  grain = true,
  grainIntensity = 0.05,
  mouseInteraction = true,
  mouseRadius = 0.3,
  mouseStrength = 0.4,
  lightMode = false,
  className = "",
}: TopographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
    } catch {
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      transparent: true,
      depthTest: false,
      depthWrite: false,
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: speed },
        uMorphAmount: { value: morphAmount },
        uMorphSpeed: { value: morphSpeed },
        uBands: { value: bands },
        uThickness: { value: thickness },
        uScale: { value: scale },
        uPixelSize: { value: pixelSize },
        uGlow: { value: glow },
        uColorMode: { value: colorModeToFloat(colorMode) },
        uContrast: { value: contrast },
        uBrightness: { value: brightness },
        uFillBands: { value: fillBands ? 1 : 0 },
        uOpacity: { value: opacity },
        uLightMode: { value: lightMode ? 1 : 0 },
        uGrain: { value: grain ? 1 : 0 },
        uGrainIntensity: { value: grainIntensity },
        uLow: { value: new Float32Array(hexToRgb(lowColor)) },
        uMid: { value: new Float32Array(hexToRgb(midColor)) },
        uHigh: { value: new Float32Array(hexToRgb(highColor)) },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseEnabled: { value: mouseInteraction ? 1 : 0 },
        uMouseRadius: { value: mouseRadius },
        uMouseStrength: { value: mouseStrength },
        uMouseActive: { value: 0 },
        uCtrlA: { value: new Float32Array([0, 0, 0, 0]) },
        uCtrlB: { value: new Float32Array([0, 0, 0, 0]) },
        uCtrlC: { value: new Float32Array([0, 0, 0, 0]) },
        uCtrlD: { value: new Float32Array([0, 0, 0, 0]) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    contextMap.set(container, { renderer, program, mesh });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      const resolution = program.uniforms.iResolution.value as Float32Array;
      resolution[0] = gl.drawingBufferWidth;
      resolution[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };

    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);
    setSize();

    const currentMouse = [0.5, 0.5];
    const targetMouse = [0.5, 0.5];
    let mouseActive = 0;
    let mouseActiveTarget = 0;

    const onPointerMove = (event: PointerEvent) => {
      if (!mouseInteraction) return;
      const rect = container.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        mouseActiveTarget = 0;
        return;
      }
      targetMouse[0] = (event.clientX - rect.left) / Math.max(rect.width, 1);
      targetMouse[1] = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
      mouseActiveTarget = 1;
    };

    const onPointerLeave = () => {
      mouseActiveTarget = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", onPointerLeave);

    const ctrlArrays = [
      program.uniforms.uCtrlA.value as Float32Array,
      program.uniforms.uCtrlB.value as Float32Array,
      program.uniforms.uCtrlC.value as Float32Array,
      program.uniforms.uCtrlD.value as Float32Array,
    ];

    let animationFrame = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const shouldAnimate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startTime = performance.now();

    const loop = (time: number) => {
      const elapsed = (time - startTime) * 0.001;
      const uniforms = program.uniforms;
      uniforms.iTime.value = elapsed;

      const morph = uniforms.uMorphAmount.value as number;
      const animationSpeed = uniforms.uSpeed.value as number;
      const pointSpeed = uniforms.uMorphSpeed.value as number;
      for (let group = 0; group < 4; group += 1) {
        const values = ctrlArrays[group];
        const indices = CTRL_INDICES[group];
        for (let index = 0; index < 4; index += 1) {
          const value = indices[index];
          values[index] = morph * Math.sin(elapsed * animationSpeed * Math.sin(value * pointSpeed) + value);
        }
      }

      currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
      currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
      uniforms.uMouse.value[0] = currentMouse[0];
      uniforms.uMouse.value[1] = currentMouse[1];
      mouseActive += 0.05 * (mouseActiveTarget - mouseActive);
      uniforms.uMouseActive.value = mouseActive;

      renderer.render({ scene: mesh });
      animationFrame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (shouldAnimate && isVisible && isPageVisible && animationFrame === 0) {
        animationFrame = requestAnimationFrame(loop);
      }
    };

    const stop = () => {
      if (animationFrame !== 0) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) start();
      else stop();
    });
    intersectionObserver.observe(container);

    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) start();
      else stop();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onPointerLeave);
      contextMap.delete(container);
      try {
        container.removeChild(canvas);
      } catch {
        // The canvas may already be gone after a hot reload.
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // The WebGL scene is initialized once; live values are synchronized below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const context = contextMap.get(container);
    if (!context) return;

    const uniforms = context.program.uniforms;
    uniforms.uSpeed.value = speed;
    uniforms.uMorphAmount.value = morphAmount;
    uniforms.uMorphSpeed.value = morphSpeed;
    uniforms.uBands.value = bands;
    uniforms.uThickness.value = thickness;
    uniforms.uScale.value = scale;
    uniforms.uPixelSize.value = pixelSize;
    uniforms.uGlow.value = glow;
    uniforms.uColorMode.value = colorModeToFloat(colorMode);
    uniforms.uContrast.value = contrast;
    uniforms.uBrightness.value = brightness;
    uniforms.uFillBands.value = fillBands ? 1 : 0;
    uniforms.uOpacity.value = opacity;
    uniforms.uLightMode.value = lightMode ? 1 : 0;
    uniforms.uGrain.value = grain ? 1 : 0;
    uniforms.uGrainIntensity.value = grainIntensity;
    uniforms.uLow.value = new Float32Array(hexToRgb(lowColor));
    uniforms.uMid.value = new Float32Array(hexToRgb(midColor));
    uniforms.uHigh.value = new Float32Array(hexToRgb(highColor));
    uniforms.uMouseEnabled.value = mouseInteraction ? 1 : 0;
    uniforms.uMouseRadius.value = mouseRadius;
    uniforms.uMouseStrength.value = mouseStrength;
  }, [
    lowColor,
    midColor,
    highColor,
    speed,
    morphAmount,
    morphSpeed,
    bands,
    thickness,
    scale,
    pixelSize,
    glow,
    colorMode,
    contrast,
    brightness,
    fillBands,
    opacity,
    grain,
    grainIntensity,
    mouseInteraction,
    mouseRadius,
    mouseStrength,
    lightMode,
  ]);

  return <div ref={containerRef} className={`topography-container ${className}`.trim()} aria-hidden="true" />;
}
