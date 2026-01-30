'use client';

import { useRef, useMemo, useState, useEffect, useCallback, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { cn, getCssVariable } from '@josui/core-web/src';

// Import types only (no runtime cost) for TypeScript
import type { ShaderMaterial, Group } from 'three';

// Dynamically import THREE to avoid blocking module load
let THREE: typeof import('three') | null = null;
const threePromise = import('three').then((mod) => {
  THREE = mod;
  return mod;
});

// Globe data computed by worker
interface GlobeData {
  positions: Float32Array;
  liftSpeeds: Float32Array;
  liftDirections: Float32Array;
}

// ============================================================================
// Configuration
// ============================================================================

export interface GlobeConfig {
  // Dots
  dotCount?: number; // number of dots on surface
  dotSize?: number; // size of each dot
  dotColor?: string; // dot color
  dotOpacity?: number; // dot opacity (0-1)
  dotBlur?: number; // dot edge softness (0=hard, 1=soft)
  dotOffset?: number; // height above sphere surface
  minDotDistance?: number; // minimum spacing between dots

  // Dot shadows
  dotShadows?: boolean; // enable flat shadow circles under dots
  dotShadowColor?: string; // shadow color
  dotShadowOpacity?: number; // shadow opacity (0-1)
  dotShadowSize?: number; // shadow circle radius
  dotShadowBlur?: number; // shadow edge softness (0=hard, 1=soft)

  // Trails
  trailColor?: string; // trail color (defaults to dotColor)
  trailOpacity?: number; // trail opacity (0-1)
  trailWidth?: number; // trail line thickness
  trailBlur?: number; // trail edge softness (0=hard, 1=soft)

  // Sphere
  sphereRadius?: number; // globe radius
  sphereSegments?: number; // geometry detail (higher=rounder)
  sphereColor?: string; // base sphere color
  sphereOpacity?: number; // base sphere opacity (0-1)

  // Atmosphere
  atmosphereColor?: string; // outer glow color
  atmosphereOpacity?: number; // outer glow opacity (0-1)
  atmosphereScale?: number; // glow size (multiplier of sphereRadius)

  // Fresnel rim
  fresnelColor?: string; // edge highlight color
  fresnelOpacity?: number; // edge highlight intensity
  fresnelPower?: number; // edge sharpness (higher=thinner rim)

  // Noise texture
  noise?: boolean; // enable procedural noise overlay
  noiseColor?: string; // noise color
  noiseOpacity?: number; // noise opacity (0-1)
  noiseScale?: number; // noise frequency (higher=finer grain)

  // City lights
  cityLights?: boolean; // enable procedural city lights
  cityLightColor?: string; // light color
  cityLightOpacity?: number; // overall intensity (0-1)
  cityLightDensity?: number; // how many lights (higher=more)
  cityLightSize?: number; // size of light points
  cityLightCluster?: number; // clustering tendency (0=scattered, 1=clustered)

  // Animation
  takeoffThreshold?: number; // scroll % before dots lift off (0-1)
  liftDistance?: number; // how far dots travel when lifted
  idleRotationSpeed?: number; // base rotation speed (radians/sec)
  scrollRotation?: number; // additional rotation from scroll
  baseTilt?: number; // initial X-axis tilt (radians)
  scrollTilt?: number; // additional tilt from scroll

  // Performance
  idleFps?: number; // render rate when not scrolling
}

const DEFAULT_CONFIG: Required<GlobeConfig> = {
  // Dots
  dotCount: 100,
  dotSize: 0.0075,
  dotColor: '#ffb92f',
  dotOpacity: 0.3,
  dotBlur: 0.5,
  dotOffset: 0.05,
  minDotDistance: 0.18,

  // Dot shadows
  dotShadows: true,
  dotShadowColor: '#ffb92f',
  dotShadowOpacity: 0.2,
  dotShadowSize: 0.05,
  dotShadowBlur: 1,

  // Trails
  trailColor: '#ffb92f',
  trailOpacity: 1,
  trailWidth: 0.008,
  trailBlur: 0.3,

  // Sphere
  sphereRadius: 5.85,
  sphereSegments: 64,
  sphereColor: '#ffb92f',
  sphereOpacity: 0.01,

  // Atmosphere
  atmosphereColor: '#ffb92f',
  atmosphereOpacity: 0.1,
  atmosphereScale: 1.1,

  // Fresnel rim
  fresnelColor: '#ffffff',
  fresnelOpacity: 0.15,
  fresnelPower: 3.0,

  // Noise texture
  noise: true,
  noiseColor: '#2076ff',
  noiseOpacity: 0.3,
  noiseScale: 3.0,

  // City lights
  cityLights: true,
  cityLightColor: '#F5B82E',
  cityLightOpacity: 0.3,
  cityLightDensity: 30.0,
  cityLightSize: 0.05,
  cityLightCluster: 0.12,

  // Animation
  takeoffThreshold: 0.3,
  liftDistance: 4.0,
  idleRotationSpeed: 0.05,
  scrollRotation: Math.PI * 0.5,
  baseTilt: 0.2,
  scrollTilt: 0.1,

  // Performance
  idleFps: 60,
};

// ============================================================================
// Worker computation with caching
// ============================================================================

const workerCache = new Map<string, Promise<GlobeData>>();

function computeGlobeData(count: number, radius: number, minDistance: number): Promise<GlobeData> {
  const cacheKey = `${count}-${radius}-${minDistance}`;

  if (workerCache.has(cacheKey)) {
    return workerCache.get(cacheKey)!;
  }

  const promise = new Promise<GlobeData>((resolve) => {
    const worker = new Worker(new URL('../workers/globeWorker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (e: MessageEvent<GlobeData>) => {
      resolve(e.data);
      worker.terminate();
    };

    worker.postMessage({ type: 'compute', count, radius, minDistance });
  });

  workerCache.set(cacheKey, promise);
  return promise;
}

// Pre-compute with defaults for fast initial load
computeGlobeData(DEFAULT_CONFIG.dotCount, DEFAULT_CONFIG.sphereRadius + 0.15, DEFAULT_CONFIG.minDotDistance);

// ============================================================================
// Shader factories
// ============================================================================

function createTrailShader(takeoffThreshold: number, liftDistance: number, trailWidth: number) {
  const delayDivisor = 1 - takeoffThreshold;
  return {
    vertexShader: `
      attribute vec3 basePosition;
      attribute float liftSpeed;
      attribute vec3 liftDirection;

      uniform float hoverAmount;
      uniform float baseRadius;

      varying float vAlpha;
      varying float vRadialDist;

      void main() {
        float delayedHover = max(0.0, (hoverAmount - ${takeoffThreshold.toFixed(2)}) / ${delayDivisor.toFixed(2)});
        float liftDist = delayedHover * liftSpeed * ${liftDistance.toFixed(1)};

        float len = length(basePosition);
        vec3 surfacePos = (basePosition / len) * baseRadius;

        float t = position.y + 0.5;
        vec3 trailPos = surfacePos + liftDirection * liftDist * t;

        vAlpha = t * (1.0 - liftDist / ${(liftDistance * 2).toFixed(1)});

        // Cylinder vertices are all on the outer surface, so radial blur doesn't apply
        // Set to 0 to disable radial fade (trails are already thin from trailWidth)
        vRadialDist = 0.0;

        vec3 transformed = vec3(position.x * ${trailWidth.toFixed(4)}, 0.0, position.z * ${trailWidth.toFixed(4)}) + trailPos;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float baseOpacity;
      uniform float hoverAmount;
      uniform float blur;

      varying float vAlpha;
      varying float vRadialDist;

      void main() {
        float delayedHover = max(0.0, (hoverAmount - ${takeoffThreshold.toFixed(2)}) / ${delayDivisor.toFixed(2)});

        // Blur controls edge softness (0 = hard edge, 1 = soft from center)
        float innerEdge = 1.0 - blur;
        float edgeFade = 1.0 - smoothstep(innerEdge, 1.0, vRadialDist);

        float opacity = baseOpacity * vAlpha * delayedHover * edgeFade;
        gl_FragColor = vec4(color, opacity);
      }
    `,
  };
}

function createPointsShader(takeoffThreshold: number, liftDistance: number) {
  const delayDivisor = 1 - takeoffThreshold;
  return {
    vertexShader: `
      attribute float liftSpeed;
      attribute vec3 liftDirection;

      uniform float hoverAmount;
      uniform float baseRadius;
      uniform float pointSize;

      varying float vFade;

      void main() {
        float delayedHover = max(0.0, (hoverAmount - ${takeoffThreshold.toFixed(2)}) / ${delayDivisor.toFixed(2)});
        float liftDist = delayedHover * liftSpeed * ${liftDistance.toFixed(1)};

        float len = length(position);
        vec3 surfacePos = (position / len) * baseRadius;
        vec3 newPos = surfacePos + liftDirection * liftDist;

        float fadeScale = max(0.0, 1.0 - liftDist / ${(liftDistance * 2).toFixed(1)});
        vFade = fadeScale;

        vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        gl_PointSize = pointSize * fadeScale * (300.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float baseOpacity;
      uniform float hoverAmount;
      uniform float blur;

      varying float vFade;

      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        if (dist > 0.5) discard;

        // Blur controls falloff: 0 = hard edge, 1 = fully soft from center
        float innerEdge = 0.5 * (1.0 - blur);
        float alpha = 1.0 - smoothstep(innerEdge, 0.5, dist);
        float opacity = baseOpacity * (1.0 - hoverAmount * 0.5) * vFade * alpha;
        gl_FragColor = vec4(color, opacity);
      }
    `,
  };
}

function createFresnelShader(power: number) {
  return {
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float opacity;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = 1.0 - abs(dot(viewDir, vNormal));
        fresnel = pow(fresnel, ${power.toFixed(1)});
        gl_FragColor = vec4(color, fresnel * opacity);
      }
    `,
  };
}

// ============================================================================
// Components
// ============================================================================

interface GlobeProps {
  containerRef: RefObject<HTMLDivElement | null>;
  data: GlobeData;
  config: Required<GlobeConfig>;
}

function FresnelSphere({
  radius,
  color,
  opacity,
  power,
  segments,
}: {
  radius: number;
  color: string;
  opacity: number;
  power: number;
  segments: number;
}) {
  const shader = useMemo(() => createFresnelShader(power), [power]);

  const material = useMemo(() => {
    if (!THREE) return null;
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        color: { value: new THREE.Color(color) },
        opacity: { value: opacity },
      },
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
    });
  }, [color, opacity, shader]);

  if (!material) return null;

  return (
    <mesh material={material}>
      <sphereGeometry args={[radius, segments, segments]} />
    </mesh>
  );
}

// Simplex 3D noise GLSL function
const simplexNoise3D = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

function NoiseSphere({
  radius,
  color,
  opacity,
  scale,
  segments,
}: {
  radius: number;
  color: string;
  opacity: number;
  scale: number;
  segments: number;
}) {
  const material = useMemo(() => {
    if (!THREE) return null;
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.NormalBlending,
      uniforms: {
        color: { value: new THREE.Color(color) },
        opacity: { value: opacity },
        noiseScale: { value: scale },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        ${simplexNoise3D}

        uniform vec3 color;
        uniform float opacity;
        uniform float noiseScale;

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        // Fast pseudo-random for grain
        float random(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        }

        void main() {
          // High-frequency grain noise
          float grain = random(vPosition * 100.0);

          // Add some variation with nearby samples for texture
          grain += random(vPosition * 100.0 + vec3(0.1, 0.0, 0.0)) * 0.5;
          grain += random(vPosition * 100.0 + vec3(0.0, 0.1, 0.0)) * 0.5;
          grain = grain / 2.0;

          // Fresnel to fade at edges
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = abs(dot(viewDir, vNormal));

          // Combine grain with fresnel falloff
          float alpha = grain * fresnel * opacity;

          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
  }, [color, opacity, scale]);

  if (!material) return null;

  return (
    <mesh material={material}>
      <sphereGeometry args={[radius, segments, segments]} />
    </mesh>
  );
}

function CityLights({
  radius,
  color,
  opacity,
  density,
  size,
  cluster,
  segments,
}: {
  radius: number;
  color: string;
  opacity: number;
  density: number;
  size: number;
  cluster: number;
  segments: number;
}) {
  const material = useMemo(() => {
    if (!THREE) return null;
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        color: { value: new THREE.Color(color) },
        opacity: { value: opacity },
        density: { value: density },
        lightSize: { value: size },
        cluster: { value: cluster },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        ${simplexNoise3D}

        uniform vec3 color;
        uniform float opacity;
        uniform float density;
        uniform float lightSize;
        uniform float cluster;

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        // Hash function for random values
        float hash(vec3 p) {
          p = fract(p * vec3(443.897, 441.423, 437.195));
          p += dot(p, p.yxz + 19.19);
          return fract((p.x + p.y) * p.z);
        }

        void main() {
          // Fresnel to fade at edges
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = abs(dot(viewDir, vNormal));

          // Create clustered regions using low-frequency noise
          float clusterNoise = snoise(vPosition * 2.0) * 0.5 + 0.5;
          clusterNoise = pow(clusterNoise, 2.0 - cluster * 1.5); // Higher cluster = more concentrated

          // Grid-based point lights
          vec3 gridPos = vPosition * density;
          vec3 cellId = floor(gridPos);
          vec3 cellUv = fract(gridPos);

          float light = 0.0;

          // Check neighboring cells for lights
          for (int x = -1; x <= 1; x++) {
            for (int y = -1; y <= 1; y++) {
              for (int z = -1; z <= 1; z++) {
                vec3 neighbor = cellId + vec3(float(x), float(y), float(z));

                // Random offset within cell
                vec3 pointOffset = vec3(
                  hash(neighbor),
                  hash(neighbor + vec3(1.0, 0.0, 0.0)),
                  hash(neighbor + vec3(0.0, 1.0, 0.0))
                );

                // Random intensity per light
                float intensity = hash(neighbor + vec3(0.0, 0.0, 1.0));

                // Only show some lights based on cluster density
                float threshold = 1.0 - clusterNoise * 0.8;
                if (intensity < threshold) continue;

                vec3 pointPos = neighbor + pointOffset;
                float dist = length(gridPos - pointPos);

                // Soft falloff
                float pointLight = 1.0 - smoothstep(0.0, lightSize * density, dist);
                pointLight = pointLight * pointLight; // Sharper falloff

                // Vary brightness
                pointLight *= 0.5 + intensity * 0.5;

                light += pointLight;
              }
            }
          }

          light = min(light, 1.0); // Clamp

          float alpha = light * fresnel * opacity * clusterNoise;

          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
  }, [color, opacity, density, size, cluster]);

  if (!material) return null;

  return (
    <mesh material={material}>
      <sphereGeometry args={[radius, segments, segments]} />
    </mesh>
  );
}

function AtmosphereGlow({
  radius,
  color,
  opacity,
  segments,
}: {
  radius: number;
  color: string;
  opacity: number;
  segments: number;
}) {
  const material = useMemo(() => {
    if (!THREE) return null;
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      uniforms: {
        color: { value: new THREE.Color(color) },
        opacity: { value: opacity },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec3 viewDir = normalize(vViewPosition);
          float rim = abs(dot(viewDir, vNormal));
          float intensity = smoothstep(0.0, 1.0, rim);
          gl_FragColor = vec4(color, intensity * opacity);
        }
      `,
    });
  }, [color, opacity]);

  if (!material) return null;

  return (
    <mesh material={material}>
      <sphereGeometry args={[radius, segments, segments]} />
    </mesh>
  );
}

function PointsDots({
  positions,
  liftSpeeds,
  liftDirections,
  color,
  size,
  baseOpacity,
  baseRadius,
  scrollProgressRef,
  takeoffThreshold,
  liftDistance,
  blur,
  offset,
}: {
  positions: Float32Array;
  liftSpeeds: Float32Array;
  liftDirections: Float32Array;
  color: string;
  size: number;
  baseOpacity: number;
  baseRadius: number;
  scrollProgressRef: RefObject<number>;
  takeoffThreshold: number;
  liftDistance: number;
  blur: number;
  offset: number;
}) {
  const materialRef = useRef<ShaderMaterial>(null);
  const shader = useMemo(() => createPointsShader(takeoffThreshold, liftDistance), [takeoffThreshold, liftDistance]);

  const uniforms = useMemo(() => {
    if (!THREE) return null;
    return {
      hoverAmount: { value: 0 },
      baseRadius: { value: baseRadius + offset },
      pointSize: { value: size * 100 },
      color: { value: new THREE.Color(color) },
      baseOpacity: { value: baseOpacity },
      blur: { value: blur },
    };
  }, [size, color, baseOpacity, baseRadius, blur, offset]);

  const geometry = useMemo(() => {
    if (!THREE) return null;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('liftSpeed', new THREE.BufferAttribute(liftSpeeds, 1));
    geo.setAttribute('liftDirection', new THREE.BufferAttribute(liftDirections, 3));
    return geo;
  }, [positions, liftSpeeds, liftDirections]);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.hoverAmount.value = scrollProgressRef.current;
    }
  });

  if (!THREE || !geometry || !uniforms) return null;

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={shader.vertexShader}
        fragmentShader={shader.fragmentShader}
      />
    </points>
  );
}

function DotShadows({
  positions,
  color,
  size,
  baseOpacity,
  baseRadius,
  blur,
}: {
  positions: Float32Array;
  color: string;
  size: number;
  baseOpacity: number;
  baseRadius: number;
  blur: number;
}) {
  const count = positions.length / 3;

  const geometry = useMemo(() => {
    if (!THREE) return null;
    // Flat circle geometry
    const geo = new THREE.CircleGeometry(1, 16);

    // Add instance attribute for positions
    geo.setAttribute('instancePosition', new THREE.InstancedBufferAttribute(positions, 3));

    return geo;
  }, [positions]);

  const material = useMemo(() => {
    if (!THREE) return null;
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        baseRadius: { value: baseRadius },
        shadowSize: { value: size },
        color: { value: new THREE.Color(color) },
        baseOpacity: { value: baseOpacity },
        blur: { value: blur },
      },
      vertexShader: `
        attribute vec3 instancePosition;

        uniform float baseRadius;
        uniform float shadowSize;

        varying vec2 vUv;

        void main() {
          vUv = uv;

          // Get surface position and normal
          float len = length(instancePosition);
          vec3 surfaceNormal = instancePosition / len;
          vec3 surfacePos = surfaceNormal * baseRadius;

          // Create tangent basis for the disc
          vec3 up = abs(surfaceNormal.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
          vec3 tangent = normalize(cross(up, surfaceNormal));
          vec3 bitangent = cross(surfaceNormal, tangent);

          // Transform disc vertex to lie flat on surface
          vec3 localPos = position * shadowSize;
          vec3 worldPos = surfacePos + tangent * localPos.x + bitangent * localPos.y;

          // Offset slightly above surface to prevent z-fighting
          worldPos += surfaceNormal * 0.01;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float baseOpacity;
        uniform float blur;

        varying vec2 vUv;

        void main() {
          // Distance from center (uv is 0-1, center is 0.5,0.5)
          vec2 center = vUv - vec2(0.5);
          float dist = length(center) * 2.0; // normalize to 0-1

          if (dist > 1.0) discard;

          // Blur controls the falloff: 0 = hard edge, 1 = fully soft
          float innerEdge = 1.0 - blur;
          float alpha = 1.0 - smoothstep(innerEdge, 1.0, dist);

          gl_FragColor = vec4(color, alpha * baseOpacity);
        }
      `,
    });
  }, [baseRadius, size, color, baseOpacity, blur]);

  if (!THREE || !geometry || !material) return null;

  return <instancedMesh args={[geometry, material, count]} frustumCulled={false} />;
}

function useScrollInvalidate(
  containerRef: RefObject<HTMLDivElement | null>,
  scrollProgressRef: RefObject<number>,
  idleFps: number,
) {
  const { invalidate } = useThree();
  const isScrollingRef = useRef(false);
  const positionGroupRef = useRef<Group>(null);
  const mutableScrollRef = useRef(0);

  const updateScroll = useCallback(() => {
    if (!containerRef.current) return false;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const start = windowHeight;
    const end = -rect.height;
    const rawProgress = (start - rect.top) / (start - end);
    const newProgress = Math.max(0, Math.min(1, rawProgress));

    if (Math.abs(newProgress - mutableScrollRef.current) > 0.0005) {
      mutableScrollRef.current = newProgress;
      (scrollProgressRef as { current: number }).current = newProgress;
      return true;
    }
    return false;
  }, [containerRef, scrollProgressRef]);

  useEffect(() => {
    let rafId: number | null = null;
    let timeoutId: number | null = null;

    const handleScroll = () => {
      isScrollingRef.current = true;
      if (timeoutId) clearTimeout(timeoutId);

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          if (updateScroll()) {
            invalidate();
          }
          rafId = null;
        });
      }

      timeoutId = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (updateScroll()) {
      invalidate();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [updateScroll, invalidate]);

  useEffect(() => {
    const intervalMs = Math.round(1000 / idleFps);
    const interval = setInterval(() => {
      if (!isScrollingRef.current) {
        invalidate();
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [invalidate, idleFps]);

  useFrame(() => {
    if (positionGroupRef.current) {
      positionGroupRef.current.position.y = -5;
    }
  });

  return { isScrollingRef, positionGroupRef };
}

function Trails({
  positions,
  liftSpeeds,
  liftDirections,
  color,
  baseOpacity,
  baseRadius,
  scrollProgressRef,
  takeoffThreshold,
  liftDistance,
  trailWidth,
  blur,
}: {
  positions: Float32Array;
  liftSpeeds: Float32Array;
  liftDirections: Float32Array;
  color: string;
  baseOpacity: number;
  baseRadius: number;
  scrollProgressRef: RefObject<number>;
  takeoffThreshold: number;
  liftDistance: number;
  trailWidth: number;
  blur: number;
}) {
  const materialRef = useRef<ShaderMaterial>(null);
  const count = positions.length / 3;
  const shader = useMemo(
    () => createTrailShader(takeoffThreshold, liftDistance, trailWidth),
    [takeoffThreshold, liftDistance, trailWidth],
  );

  const uniforms = useMemo(() => {
    if (!THREE) return null;
    return {
      hoverAmount: { value: 0 },
      baseRadius: { value: baseRadius + 0.015 },
      color: { value: new THREE.Color(color) },
      baseOpacity: { value: baseOpacity },
      blur: { value: blur },
    };
  }, [color, baseOpacity, baseRadius, blur]);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.hoverAmount.value = scrollProgressRef.current;
    }
  });

  const geometry = useMemo(() => {
    if (!THREE) return null;
    const geo = new THREE.CylinderGeometry(1, 1, 1, 4, 1);

    geo.setAttribute('basePosition', new THREE.InstancedBufferAttribute(positions, 3));
    geo.setAttribute('liftSpeed', new THREE.InstancedBufferAttribute(liftSpeeds, 1));
    geo.setAttribute('liftDirection', new THREE.InstancedBufferAttribute(liftDirections, 3));

    return geo;
  }, [positions, liftSpeeds, liftDirections]);

  if (!THREE || !geometry || !uniforms) return null;

  return (
    <instancedMesh args={[geometry, undefined, count]} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={shader.vertexShader}
        fragmentShader={shader.fragmentShader}
      />
    </instancedMesh>
  );
}

function Globe({ containerRef, data, config }: GlobeProps) {
  const groupRef = useRef<Group>(null);
  const scrollProgressRef = useRef(0);
  console.log('--color-foreground', getCssVariable('--color-foreground'));
  const { positions, liftSpeeds, liftDirections } = data;

  const { positionGroupRef } = useScrollInvalidate(containerRef, scrollProgressRef, config.idleFps);

  useFrame((state) => {
    const scrollProgress = scrollProgressRef.current;
    const elapsed = state.clock.getElapsedTime();
    const baseRotation = elapsed * config.idleRotationSpeed;
    const scrollRotation = scrollProgress * config.scrollRotation;
    const rotationY = baseRotation + scrollRotation;
    const rotationX = config.baseTilt + scrollProgress * config.scrollTilt;

    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY;
      groupRef.current.rotation.x = rotationX;
    }
  });

  const atmosphereRadius = config.sphereRadius * config.atmosphereScale;

  return (
    <group ref={positionGroupRef} position={[0, -5, 0]}>
      <group ref={groupRef}>
        <AtmosphereGlow
          radius={atmosphereRadius}
          color={config.atmosphereColor}
          opacity={config.atmosphereOpacity}
          segments={config.sphereSegments}
        />
        <mesh>
          <sphereGeometry args={[config.sphereRadius, config.sphereSegments, config.sphereSegments]} />
          <meshBasicMaterial color={config.sphereColor} transparent opacity={config.sphereOpacity} />
        </mesh>
        <FresnelSphere
          radius={config.sphereRadius + 0.01}
          color={config.fresnelColor}
          opacity={config.fresnelOpacity}
          power={config.fresnelPower}
          segments={config.sphereSegments}
        />
        {config.noise && (
          <NoiseSphere
            radius={config.sphereRadius + 0.02}
            color={config.noiseColor}
            opacity={config.noiseOpacity}
            scale={config.noiseScale}
            segments={config.sphereSegments}
          />
        )}
        {config.cityLights && (
          <CityLights
            radius={config.sphereRadius + 0.03}
            color={config.cityLightColor}
            opacity={config.cityLightOpacity}
            density={config.cityLightDensity}
            size={config.cityLightSize}
            cluster={config.cityLightCluster}
            segments={config.sphereSegments}
          />
        )}
        {config.dotShadows && (
          <DotShadows
            positions={positions}
            color={config.dotShadowColor}
            size={config.dotShadowSize}
            baseOpacity={config.dotShadowOpacity}
            baseRadius={config.sphereRadius + 0.01}
            blur={config.dotShadowBlur}
          />
        )}
        <Trails
          positions={positions}
          liftSpeeds={liftSpeeds}
          liftDirections={liftDirections}
          color={config.trailColor}
          baseOpacity={config.trailOpacity}
          baseRadius={config.sphereRadius}
          scrollProgressRef={scrollProgressRef}
          takeoffThreshold={config.takeoffThreshold}
          liftDistance={config.liftDistance}
          trailWidth={config.trailWidth}
          blur={config.trailBlur}
        />
        <PointsDots
          positions={positions}
          liftSpeeds={liftSpeeds}
          liftDirections={liftDirections}
          color={config.dotColor}
          size={config.dotSize}
          baseOpacity={config.dotOpacity}
          baseRadius={config.sphereRadius}
          scrollProgressRef={scrollProgressRef}
          takeoffThreshold={config.takeoffThreshold}
          liftDistance={config.liftDistance}
          blur={config.dotBlur}
          offset={config.dotOffset}
        />
      </group>
    </group>
  );
}

export function GlobeBackground({ className, ...configOverrides }: { className?: string } & GlobeConfig) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [globeData, setGlobeData] = useState<GlobeData | null>(null);

  const config: Required<GlobeConfig> = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...configOverrides,
      // Ensure trailColor defaults to dotColor if not specified
      trailColor: configOverrides.trailColor ?? configOverrides.dotColor ?? DEFAULT_CONFIG.trailColor,
    }),
    [JSON.stringify(configOverrides)],
  );

  useEffect(() => {
    const workerRadius = config.sphereRadius + 0.15;
    Promise.all([threePromise, computeGlobeData(config.dotCount, workerRadius, config.minDotDistance)]).then(
      ([, data]) => {
        const scheduleMount = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1));
        scheduleMount(() => {
          setGlobeData(data);
          setIsReady(true);
        });
      },
    );
  }, [config.dotCount, config.sphereRadius, config.minDotDistance]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.01 });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Track if globe has ever been visible (for fade-in, don't fade out)
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    if (isVisible && !hasBeenVisible) {
      setHasBeenVisible(true);
    }
  }, [isVisible, hasBeenVisible]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute left-1/2 hidden h-250 w-full -translate-x-1/2 mask-[linear-gradient(to_bottom,background_0%,background_50%,transparent_100%)] transition-opacity duration-1000 ease-out md:block',
        hasBeenVisible ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      {isReady && globeData && hasBeenVisible && (
        <Canvas
          camera={{ position: [0, -5, 10], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
          frameloop="demand"
        >
          <Globe containerRef={containerRef} data={globeData} config={config} />
        </Canvas>
      )}
    </div>
  );
}

export default GlobeBackground;
