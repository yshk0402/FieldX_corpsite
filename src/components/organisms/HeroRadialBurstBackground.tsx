"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const MAX_BLOBS = 7;

const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
#define MAX_BLOBS ${MAX_BLOBS}

uniform float uTime;
uniform float uMotion;
uniform float uScrollProgress;
uniform float uIntensity;
uniform float uBlobCount;
uniform float uThreshold;
uniform float uEdgeSoftness;
uniform vec2 uResolution;
uniform vec2 uOrigin;
uniform vec4 uBlobData[MAX_BLOBS];
uniform vec3 uPalette[5];
varying vec2 vUv;

float hash11(float value) {
  return fract(sin(value * 127.1) * 43758.5453123);
}

vec2 withAspect(vec2 point, float aspect) {
  return vec2(point.x * aspect, point.y);
}

vec2 blobPosition(int index, float t, float motion, float progress) {
  vec4 blob = uBlobData[index];
  float fi = float(index);
  float phase = blob.w * 6.28318530718;
  float seedA = hash11(fi * 3.17 + blob.w * 11.0);
  float seedB = hash11(fi * 5.93 + blob.w * 7.0);
  float seedC = hash11(fi * 8.41 + blob.w * 13.0);
  vec2 clusterCenter = vec2(
    0.66 + sin(t * 0.08 + seedC * 6.28318530718) * 0.04,
    -0.02
  );
  vec2 clusterDrift = vec2(
    sin(t * 0.07 + seedA * 6.28318530718),
    cos(t * 0.06 + seedB * 6.28318530718)
  ) * 0.02 * motion;

  if (index == 0) {
    vec2 coreDrift = vec2(
      sin(t * 0.2 + phase) * 0.034 + sin(t * 0.42 - phase * 0.7) * 0.01,
      cos(t * 0.16 - phase) * 0.04 + cos(t * 0.38 + phase * 1.1) * 0.012
    ) * motion;
    return clusterCenter + clusterDrift * 0.7 + coreDrift;
  }

  vec2 direction = normalize(blob.xy);
  vec2 tangent = vec2(-direction.y, direction.x);
  float launchCycle = fract(t * (0.1 + seedA * 0.05) + phase * (0.26 + seedB * 0.18));
  float launchProgress = smoothstep(0.04, 0.26, launchCycle) * (1.0 - smoothstep(0.78, 0.985, launchCycle));
  float launchArc = pow(launchProgress, 0.92);
  float radialPulse = sin(t * (0.22 + fi * 0.02 + seedA * 0.06) + phase) * 0.5 + 0.5;
  float orbitPulse = cos(t * (0.18 + fi * 0.02 + seedB * 0.07) - phase * 0.8) * 0.5 + 0.5;
  float swayPulse = sin(t * (0.32 + fi * 0.035 + seedC * 0.08) - phase * 1.1);
  float radialJitter = sin(t * (0.3 + fi * 0.025) + phase * (0.8 + seedA * 0.32)) * 0.08;
  float launchDistance = mix(0.04, 0.44 + 0.04 * fi, launchArc) * mix(0.96, 1.18, progress);
  float radialScale = launchDistance + mix(0.08, 0.26, radialPulse) + radialJitter;
  vec2 radialOffset = direction * radialScale;
  float leftBias = smoothstep(0.22, 0.82, sin(t * (0.16 + seedB * 0.08) + phase * 1.1) * 0.5 + 0.5);
  vec2 crossSweep = vec2(-1.0, 0.0) * (0.02 + 0.05 * launchArc + 0.018 * leftBias) * motion;
  vec2 tangentialOffset = tangent * (0.01 + 0.022 * launchArc + 0.008 * fi) * (orbitPulse - 0.5) * 2.0 * motion;
  vec2 breathing = direction * (0.008 + 0.012 * launchArc + 0.005 * fi) * sin(t * (0.26 + fi * 0.02) + phase * 1.0) * motion;
  vec2 sway = vec2(direction.y, -direction.x) * (0.008 + 0.004 * fi) * swayPulse * motion;
  vec2 lissajous = vec2(
    sin(t * (0.18 + seedA * 0.22) + phase * (0.8 + seedB * 0.4)),
    cos(t * (0.24 + seedC * 0.18) - phase * (0.7 + seedA * 0.3))
  ) * (0.004 + 0.01 * launchArc + 0.004 * fi) * motion;
  float burst = smoothstep(0.72, 0.98, sin(t * (0.14 + seedB * 0.06) + phase * 1.2) * 0.5 + 0.5);
  vec2 burstOffset = direction * (0.006 + 0.02 * launchArc + 0.004 * fi) * burst * motion;
  return clusterCenter + clusterDrift + radialOffset + crossSweep + tangentialOffset + breathing + sway + lissajous + burstOffset;
}

float blobField(vec2 point, vec2 center, float radius) {
  vec2 delta = point - center;
  return (radius * radius) / max(dot(delta, delta), 0.0018);
}

vec3 paletteColor(float bodyMix, float topHeat, float lowerGlow, float marbleA, float marbleB, vec2 local, float aspect) {
  vec3 deep = uPalette[0];
  vec3 red = uPalette[1];
  vec3 orange = uPalette[2];
  vec3 amber = uPalette[3];
  vec3 yellow = uPalette[4];

  float redZone = smoothstep(-0.28 * aspect, 0.22 * aspect, local.x + marbleA * 0.08 * aspect) * smoothstep(0.42, -0.24, local.y + marbleB * 0.06);
  float orangeZone = smoothstep(-0.56 * aspect, 0.44 * aspect, local.x - marbleB * 0.05 * aspect);
  float yellowZone = smoothstep(-0.02, 0.72, local.y + marbleA * 0.08) * smoothstep(-0.08 * aspect, 0.52 * aspect, local.x + marbleB * 0.04 * aspect);

  vec3 body = mix(amber, orange, orangeZone * 0.72 + bodyMix * 0.12);
  body = mix(body, red, redZone * 0.88 + topHeat * 0.08);
  body = mix(body, yellow, yellowZone * 0.82 + lowerGlow * 0.08);
  body = mix(body, deep, smoothstep(1.0, 1.12, bodyMix + topHeat * 0.02) * 0.02);
  return body;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = withAspect(vUv * 2.0 - 1.0, aspect);
  vec2 origin = withAspect(uOrigin, aspect);
  float motion = clamp(uMotion, 0.0, 1.0);
  float progress = clamp(uScrollProgress, 0.0, 1.0);
  float intensity = clamp(uIntensity, 0.26, 1.0);
  float t = uTime * mix(0.28, 1.05, motion);

  float field = 0.0;
  float warmField = 0.0;
  vec2 blobCentroid = vec2(0.0);
  float blobCentroidWeight = 0.0;
  float islandMask = 0.0;
  float bridgeField = 0.0;
  vec2 centers[MAX_BLOBS];
  float radii[MAX_BLOBS];

  for (int i = 0; i < MAX_BLOBS; i++) {
    if (float(i) >= uBlobCount) {
      continue;
    }

    vec4 blob = uBlobData[i];
    vec2 center = blobPosition(i, t, motion, progress);
    float radiusPulseA = sin(t * (0.24 + float(i) * 0.035) + blob.w * 9.0) * 0.5 + 0.5;
    float radiusPulseB = cos(t * (0.34 + float(i) * 0.025) - blob.w * 7.0) * 0.5 + 0.5;
    float radiusPulse = mix(radiusPulseA, radiusPulseB, 0.34);
    float radius = blob.z * mix(0.82, 1.14, progress) * mix(0.84, 1.22, radiusPulse);
    centers[i] = center;
    radii[i] = radius;
    float currentField = blobField(p, center, radius);
    field += currentField;
    blobCentroid += center * radius;
    blobCentroidWeight += radius;
    warmField += currentField * (0.18 + 0.22 * hash11(float(i) + blob.w * 2.0));
    islandMask = max(islandMask, smoothstep(0.46, 1.36, currentField));
  }

  for (int i = 0; i < MAX_BLOBS; i++) {
    if (float(i) >= uBlobCount) {
      continue;
    }

    for (int j = i + 1; j < MAX_BLOBS; j++) {
      if (float(j) >= uBlobCount) {
        continue;
      }

      vec2 a = centers[i];
      vec2 b = centers[j];
      float pairDistance = length(a - b);
      float blendRange = (radii[i] + radii[j]) * 1.34;
      float pulse = sin(t * (0.46 + float(i + j) * 0.035) + float(i) * 1.7 + float(j) * 0.9) * 0.5 + 0.5;
      float pairBlend = (1.0 - smoothstep(blendRange * 0.52, blendRange * 0.86, pairDistance)) * mix(0.58, 1.08, pulse);
      vec2 segment = b - a;
      float segmentLength = max(length(segment), 0.001);
      vec2 direction = segment / segmentLength;
      float along = clamp(dot(p - a, direction) / segmentLength, 0.0, 1.0);
      vec2 closest = mix(a, b, along);
      float thickness = mix(min(radii[i], radii[j]) * 0.12, min(radii[i], radii[j]) * 0.34, clamp(pairBlend, 0.0, 1.0));
      float corridor = thickness * thickness / max(dot(p - closest, p - closest), 0.003);
      bridgeField += corridor * clamp(pairBlend, 0.0, 1.0) * 0.1;
    }
  }

  float mergedField = field + bridgeField;
  float threshold = mix(uThreshold + 0.18, uThreshold - 0.04, progress);
  float mask = smoothstep(threshold - uEdgeSoftness, threshold + uEdgeSoftness, mergedField);
  float inner = smoothstep(threshold + 0.12, threshold + 0.96, mergedField);
  vec2 blobCenter = blobCentroid / max(blobCentroidWeight, 0.001);
  vec2 local = p - blobCenter;
  float topHeat = smoothstep(0.56, -0.18, local.y) * smoothstep(-0.22 * aspect, 0.28 * aspect, local.x);
  float lowerGlow = smoothstep(-0.02, 0.76, local.y) * smoothstep(-0.18 * aspect, 0.58 * aspect, local.x + 0.04 * aspect);
  float bodyMix = inner * 0.68 + islandMask * 0.06 + smoothstep(threshold - 0.04, threshold + 0.66, warmField) * 0.1;
  float wash = exp(-length((p - origin) * vec2(0.72, 1.0)) * 1.28) * 0.008;
  float marbleA = sin(local.x * 4.2 + local.y * 2.7 + t * 0.22);
  float marbleB = cos(local.x * 3.1 - local.y * 3.8 - t * 0.18);
  marbleA = smoothstep(-0.22, 0.5, marbleA) * islandMask;
  marbleB = smoothstep(-0.18, 0.54, marbleB) * islandMask;

  float readabilityMask = 1.0;
  readabilityMask *= 1.0 - smoothstep(-0.22 * aspect, 0.58 * aspect, p.x) * smoothstep(-0.82, 0.68, p.y) * 0.36;
  readabilityMask *= 1.0 - exp(-pow(max(0.0, 0.12 * aspect - p.x), 2.0) * 5.0) * 0.16;

  float fillMask = step(threshold, mergedField);
  vec3 color = paletteColor(clamp(bodyMix + wash, 0.0, 1.0), topHeat, lowerGlow, marbleA, marbleB, local, aspect);
  float alpha = fillMask * mix(0.985, 1.0, intensity) * readabilityMask;

  gl_FragColor = vec4(color, alpha);
}
`;

type HeroFieldXConfig = {
  scrollDamping: number;
  originOffsetRatioX: number;
  originOffsetRatioY: number;
};

const HERO_FIELD_X_CONFIG: HeroFieldXConfig = {
  scrollDamping: 0.11,
  originOffsetRatioX: 1.35,
  originOffsetRatioY: 0.5,
};

const HERO_METABALL_PALETTE = ["#BB0002", "#FF0005", "#FF5500", "#FFC105", "#FFC800"] as const;

function randomBetween(min: number, max: number) {
  return THREE.MathUtils.lerp(min, max, Math.random());
}

function createRandomBlobLayout() {
  const blobs = [new THREE.Vector4(0, 0, randomBetween(0.25, 0.31), Math.random())];
  const activeCount = Math.floor(randomBetween(5, MAX_BLOBS + 0.999));

  for (let index = 1; index < MAX_BLOBS; index += 1) {
    const angle = randomBetween(-Math.PI * 0.92, Math.PI * 0.92);
    const distance = randomBetween(0.18, 0.38);
    const radius = index < activeCount ? randomBetween(0.11, 0.22) : randomBetween(0.08, 0.14);
    blobs.push(
      new THREE.Vector4(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        radius,
        Math.random(),
      ),
    );
  }

  return {
    activeCount,
    blobs,
  };
}

export function HeroFieldXBackground() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sectionEl = root.parentElement as HTMLElement | null;
    if (!sectionEl) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: InstanceType<typeof THREE.WebGLRenderer>;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      root.dataset.webgl = "unsupported";
      return;
    }

    const handleContextLoss = (event: Event) => {
      event.preventDefault();

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      root.dataset.webgl = "lost";
    };

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const canvas = renderer.domElement;
    canvas.className = "fx-hero-radial-canvas";
    canvas.addEventListener("webglcontextlost", handleContextLoss, false);
    root.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const blobLayout = createRandomBlobLayout();

    const uniforms = {
      uTime: { value: 0 },
      uMotion: { value: reduceMotion.matches ? 0.2 : 1 },
      uScrollProgress: { value: 0 },
      uIntensity: { value: 1 },
      uBlobCount: { value: blobLayout.activeCount },
      uThreshold: { value: 1.26 },
      uEdgeSoftness: { value: 0.09 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uOrigin: { value: new THREE.Vector2(0.26, -0.08) },
      uBlobData: { value: blobLayout.blobs.map((blob) => blob.clone()) },
      uPalette: { value: HERO_METABALL_PALETTE.map((color) => new THREE.Color(color)) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const originTarget = new THREE.Vector2(0.26, -0.08);
    let scrollTarget = 0;
    let scrollCurrent = 0;

    const updateOriginFromHeading = () => {
      const sectionRect = sectionEl.getBoundingClientRect();
      const heading = sectionEl.querySelector<HTMLElement>("#home-hero-title");
      if (!heading || sectionRect.width < 1 || sectionRect.height < 1) return;

      const headingRect = heading.getBoundingClientRect();
      const anchorX = headingRect.right + headingRect.width * HERO_FIELD_X_CONFIG.originOffsetRatioX;
      const anchorY = headingRect.top + headingRect.height * HERO_FIELD_X_CONFIG.originOffsetRatioY;

      const normalizedX = ((anchorX - sectionRect.left) / sectionRect.width) * 2 - 1;
      const normalizedY = (((anchorY - sectionRect.top) / sectionRect.height) * 2 - 1) * -1;
      const rightBiasedX = Math.max(normalizedX, 0.36);
      originTarget.set(THREE.MathUtils.clamp(rightBiasedX, -0.95, 0.95), THREE.MathUtils.clamp(normalizedY, -0.95, 0.95));
      uniforms.uOrigin.value.copy(originTarget);
    };

    const updateScrollProgress = () => {
      const rect = sectionEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const visible = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      const visibility = THREE.MathUtils.clamp(visible / Math.max(rect.height, 1), 0, 1);
      scrollTarget = visibility;
    };

    const onScroll = () => {
      updateScrollProgress();
    };

    const resize = () => {
      const width = Math.max(1, root.clientWidth);
      const height = Math.max(1, root.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
      const mobileScale = width <= 640 ? 0.78 : width <= 980 ? 0.9 : 1;
      uniforms.uIntensity.value = Math.min(1, width / 1120) * mobileScale;
      const blobCountCap = reduceMotion.matches ? (width <= 640 ? 4 : 5) : width <= 640 ? 5 : blobLayout.activeCount;
      const blobCountFloor = reduceMotion.matches ? 3 : 4;
      uniforms.uBlobCount.value = THREE.MathUtils.clamp(blobLayout.activeCount, blobCountFloor, blobCountCap);
      uniforms.uThreshold.value = width <= 640 ? 1.34 : 1.26;
      uniforms.uEdgeSoftness.value = width <= 640 ? 0.11 : 0.09;
      updateOriginFromHeading();
      updateScrollProgress();
      renderer.render(scene, camera);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(sectionEl);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const clock = new THREE.Clock();
    const renderFrame = () => {
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;
      scrollCurrent = THREE.MathUtils.lerp(scrollCurrent, scrollTarget, HERO_FIELD_X_CONFIG.scrollDamping);
      uniforms.uScrollProgress.value = scrollCurrent;
      renderer.render(scene, camera);
      rafRef.current = window.requestAnimationFrame(renderFrame);
    };

    renderFrame();

    const onMotionChange = (event: MediaQueryListEvent) => {
      uniforms.uMotion.value = event.matches ? 0.2 : 1;
      uniforms.uIntensity.value = event.matches ? Math.min(uniforms.uIntensity.value, 0.5) : Math.min(1, root.clientWidth / 1120);
      resize();
    };

    reduceMotion.addEventListener("change", onMotionChange);

    return () => {
      reduceMotion.removeEventListener("change", onMotionChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.removeEventListener("webglcontextlost", handleContextLoss, false);
      if (canvas.parentElement === root) {
        root.removeChild(canvas);
      }
    };
  }, []);

  return <div className="fx-hero-radial-bg" aria-hidden="true" ref={rootRef} />;
}

export function HeroRadialBurstBackground() {
  return <HeroFieldXBackground />;
}
