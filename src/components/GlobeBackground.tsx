'use client';

import { useRef, useMemo, useState, useEffect, useCallback, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { cn } from '@/lib/utils';

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

// Start worker computation immediately (runs in parallel with THREE loading)
let globeDataPromise: Promise<GlobeData> | null = null;

function startWorkerComputation(): Promise<GlobeData> {
  if (globeDataPromise) return globeDataPromise;

  globeDataPromise = new Promise((resolve) => {
    const worker = new Worker(new URL('../workers/globeWorker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (e: MessageEvent<GlobeData>) => {
      resolve(e.data);
      worker.terminate();
    };

    worker.postMessage({ type: 'compute', count: 100, radius: 6, minDistance: 0.18 });
  });

  return globeDataPromise;
}

// Kick off computation immediately when module loads (but in worker, not main thread)
startWorkerComputation();

interface GlobeProps {
  containerRef: RefObject<HTMLDivElement | null>;
  data: GlobeData;
}

// Trail shader - thin lines from surface to dot
const trailShader = {
  vertexShader: `
    attribute vec3 basePosition;
    attribute float liftSpeed;
    attribute vec3 liftDirection;

    uniform float hoverAmount;
    uniform float baseRadius;

    varying float vAlpha;

    void main() {
      // Delay lift-off until scroll is past 30%
      float delayedHover = max(0.0, (hoverAmount - 0.3) / 0.7);
      float liftDistance = delayedHover * liftSpeed * 4.0;

      // Surface position
      float len = length(basePosition);
      vec3 surfacePos = (basePosition / len) * baseRadius;

      // position.y goes from -0.5 to 0.5 for cylinder
      // Map to 0 (surface) to 1 (dot position)
      float t = position.y + 0.5;

      // Interpolate along trail
      vec3 trailPos = surfacePos + liftDirection * liftDistance * t;

      // Fade based on position along trail (brighter at dot end)
      vAlpha = t * (1.0 - liftDistance / 8.0);

      // Scale cylinder radius
      vec3 transformed = vec3(position.x * 0.008, 0.0, position.z * 0.008) + trailPos;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float baseOpacity;
    uniform float hoverAmount;

    varying float vAlpha;

    void main() {
      float delayedHover = max(0.0, (hoverAmount - 0.3) / 0.7);
      float opacity = baseOpacity * vAlpha * delayedHover;
      gl_FragColor = vec4(color, opacity);
    }
  `,
};

// GPU Points shader - renders dots as GL_POINTS instead of instanced spheres
const pointsShader = {
  vertexShader: `
    attribute float liftSpeed;
    attribute vec3 liftDirection;

    uniform float hoverAmount;
    uniform float baseRadius;
    uniform float pointSize;

    varying float vFade;

    void main() {
      // Delay lift-off until scroll is past 30%
      float delayedHover = max(0.0, (hoverAmount - 0.3) / 0.7);
      float liftDistance = delayedHover * liftSpeed * 4.0;

      // Start at surface position
      float len = length(position);
      vec3 surfacePos = (position / len) * baseRadius;

      // Lift off in random direction
      vec3 newPos = surfacePos + liftDirection * liftDistance;

      // Scale down as dots lift off
      float fadeScale = max(0.0, 1.0 - liftDistance / 8.0);
      vFade = fadeScale;

      vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size attenuation based on distance
      gl_PointSize = pointSize * fadeScale * (300.0 / -mvPosition.z);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float baseOpacity;
    uniform float hoverAmount;

    varying float vFade;

    void main() {
      // Circular soft-edge point
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      if (dist > 0.5) discard;

      float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
      float opacity = baseOpacity * (1.0 - hoverAmount * 0.5) * vFade * alpha;
      gl_FragColor = vec4(color, opacity);
    }
  `,
};

// Fresnel rim shader - glows at edges
function FresnelSphere({ radius, color, opacity }: { radius: number; color: string; opacity: number }) {
  const material = useMemo(() => {
    if (!THREE) return null;
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
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
          float fresnel = 1.0 - abs(dot(viewDir, vNormal));
          fresnel = pow(fresnel, 3.0);
          gl_FragColor = vec4(color, fresnel * opacity);
        }
      `,
    });
  }, [color, opacity]);

  if (!material) return null;

  return (
    <mesh material={material}>
      <sphereGeometry args={[radius, 32, 32]} />
    </mesh>
  );
}

// Atmosphere glow - soft halo behind globe
function AtmosphereGlow({ radius, color, opacity }: { radius: number; color: string; opacity: number }) {
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
          // Reversed - stronger at outer edge, fades toward globe
          float intensity = smoothstep(0.0, 1.0, rim);
          gl_FragColor = vec4(color, intensity * opacity);
        }
      `,
    });
  }, [color, opacity]);

  if (!material) return null;

  return (
    <mesh material={material}>
      <sphereGeometry args={[radius, 32, 32]} />
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
  scrollProgressRef,
}: {
  positions: Float32Array;
  liftSpeeds: Float32Array;
  liftDirections: Float32Array;
  color: string;
  size: number;
  baseOpacity: number;
  scrollProgressRef: RefObject<number>;
}) {
  const materialRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(() => {
    if (!THREE) return null;
    return {
      hoverAmount: { value: 0 },
      baseRadius: { value: 5.865 },
      pointSize: { value: size * 100 },
      color: { value: new THREE.Color(color) },
      baseOpacity: { value: baseOpacity },
    };
  }, [size, color, baseOpacity]);

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
        vertexShader={pointsShader.vertexShader}
        fragmentShader={pointsShader.fragmentShader}
      />
    </points>
  );
}

// Scroll-driven invalidation hook - only renders when scroll changes
function useScrollInvalidate(containerRef: RefObject<HTMLDivElement | null>, scrollProgressRef: RefObject<number>) {
  const { invalidate } = useThree();
  const isScrollingRef = useRef(false);
  const positionGroupRef = useRef<Group>(null);

  // Mutable ref to track scroll progress without triggering re-renders
  const mutableScrollRef = useRef(0);

  const updateScroll = useCallback(() => {
    if (!containerRef.current) return false;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const start = windowHeight;
    const end = -rect.height;
    const rawProgress = (start - rect.top) / (start - end);
    const newProgress = Math.max(0, Math.min(1, rawProgress));

    // Only invalidate if changed significantly
    if (Math.abs(newProgress - mutableScrollRef.current) > 0.0005) {
      mutableScrollRef.current = newProgress;
      // Update the shared ref that components read from
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

    // Initial scroll position
    if (updateScroll()) {
      invalidate();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [updateScroll, invalidate]);

  // Idle rotation at ~60 FPS
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isScrollingRef.current) {
        invalidate();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [invalidate]);

  // Fixed position (no aspect ratio adjustment)
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
  scrollProgressRef,
}: {
  positions: Float32Array;
  liftSpeeds: Float32Array;
  liftDirections: Float32Array;
  color: string;
  baseOpacity: number;
  scrollProgressRef: RefObject<number>;
}) {
  const materialRef = useRef<ShaderMaterial>(null);
  const count = positions.length / 3;

  const uniforms = useMemo(() => {
    if (!THREE) return null;
    return {
      hoverAmount: { value: 0 },
      baseRadius: { value: 5.865 },
      color: { value: new THREE.Color(color) },
      baseOpacity: { value: baseOpacity },
    };
  }, [color, baseOpacity]);

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
        vertexShader={trailShader.vertexShader}
        fragmentShader={trailShader.fragmentShader}
      />
    </instancedMesh>
  );
}

function Globe({ containerRef, data }: GlobeProps) {
  const groupRef = useRef<Group>(null);
  const scrollProgressRef = useRef(0);

  const { positions, liftSpeeds, liftDirections } = data;

  // Use scroll-driven invalidation (only renders when scroll changes)
  const { positionGroupRef } = useScrollInvalidate(containerRef, scrollProgressRef);

  useFrame((state) => {
    const scrollProgress = scrollProgressRef.current;
    const elapsed = state.clock.getElapsedTime();
    const baseRotation = elapsed * 0.05;
    const scrollRotation = scrollProgress * Math.PI * 0.5;
    const rotationY = baseRotation + scrollRotation;
    const rotationX = 0.2 + scrollProgress * 0.1;

    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY;
      groupRef.current.rotation.x = rotationX;
    }
  });

  return (
    <group ref={positionGroupRef} position={[0, -5, 0]}>
      <group ref={groupRef}>
        {/* Atmosphere glow behind */}
        <AtmosphereGlow radius={7.0} color="#ffbb49" opacity={0.12} />
        {/* Solid surface - reduced segments from 64 to 32 */}
        <mesh>
          <sphereGeometry args={[5.85, 32, 32]} />
          <meshBasicMaterial color="#e5e5e5" transparent opacity={0.15} />
        </mesh>
        {/* Fresnel rim highlight */}
        <FresnelSphere radius={5.86} color="#ffffff" opacity={0.3} />
        <Trails
          positions={positions}
          liftSpeeds={liftSpeeds}
          liftDirections={liftDirections}
          color="#ffbb49"
          baseOpacity={0.5}
          scrollProgressRef={scrollProgressRef}
        />
        {/* GPU Points instead of instanced spheres - 72x triangle reduction */}
        <PointsDots
          positions={positions}
          liftSpeeds={liftSpeeds}
          liftDirections={liftDirections}
          color="#ffbb49"
          size={0.0075}
          baseOpacity={0.5}
          scrollProgressRef={scrollProgressRef}
        />
        {/* FlatCircles removed - was 64,000 triangles for same visual effect */}
      </group>
    </group>
  );
}

export function GlobeBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [globeData, setGlobeData] = useState<GlobeData | null>(null);

  useEffect(() => {
    // Wait for both THREE and worker data to be ready
    Promise.all([threePromise, startWorkerComputation()]).then(([, data]) => {
      // Use requestIdleCallback to defer even further if available
      const scheduleMount = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1));
      scheduleMount(() => {
        setGlobeData(data);
        setIsReady(true);
      });
    });
  }, []);

  // IntersectionObserver - zero GPU usage when off-screen
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.01 });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute top-[100px] left-1/2 hidden h-[1000px] w-full -translate-x-1/2 md:block',
        className,
      )}
      style={{
        maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
      }}
    >
      {isReady && globeData && isVisible && (
        <Canvas
          camera={{ position: [0, -5, 10], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
          frameloop="demand"
        >
          <Globe containerRef={containerRef} data={globeData} />
        </Canvas>
      )}
    </div>
  );
}

export default GlobeBackground;
