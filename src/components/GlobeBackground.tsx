'use client';

import { useRef, useMemo, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

function generateSpherePoints(count: number, radius: number, minDistance: number = 0.15): Float32Array {
  const points: THREE.Vector3[] = [];

  let seed = 12345;
  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const maxAttempts = count * 20;
  let attempts = 0;

  while (points.length < count && attempts < maxAttempts) {
    attempts++;

    const theta = seededRandom() * Math.PI * 2;
    const phi = Math.acos(2 * seededRandom() - 1);

    const x = Math.sin(phi) * Math.cos(theta) * radius;
    const y = Math.cos(phi) * radius;
    const z = Math.sin(phi) * Math.sin(theta) * radius;

    const newPoint = new THREE.Vector3(x, y, z);

    let tooClose = false;
    for (const existing of points) {
      if (newPoint.distanceTo(existing) < minDistance) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      points.push(newPoint);
    }
  }

  const positions = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    positions[i * 3] = points[i].x;
    positions[i * 3 + 1] = points[i].y;
    positions[i * 3 + 2] = points[i].z;
  }

  return positions;
}

interface GlobeProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

// Fresnel rim shader - glows at edges
function FresnelSphere({ radius, color, opacity }: { radius: number; color: string; opacity: number }) {
  const material = useMemo(() => {
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

  return (
    <mesh material={material}>
      <sphereGeometry args={[radius, 64, 64]} />
    </mesh>
  );
}

// Atmosphere glow - soft halo behind globe
function AtmosphereGlow({ radius, color, opacity }: { radius: number; color: string; opacity: number }) {
  const material = useMemo(() => {
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

  return (
    <mesh material={material}>
      <sphereGeometry args={[radius, 64, 64]} />
    </mesh>
  );
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

// GPU-based dots shader - all calculations on GPU
const dotsShader = {
  vertexShader: `
    attribute vec3 basePosition;
    attribute float liftSpeed;
    attribute vec3 liftDirection;

    uniform float hoverAmount;
    uniform float baseRadius;
    uniform float dotSize;

    varying float vFade;

    void main() {
      // Delay lift-off until scroll is past 30%
      float delayedHover = max(0.0, (hoverAmount - 0.3) / 0.7);
      float liftDistance = delayedHover * liftSpeed * 4.0;

      // Start at surface position
      float len = length(basePosition);
      vec3 surfacePos = (basePosition / len) * baseRadius;

      // Lift off in random direction (mixed with outward direction)
      vec3 newPos = surfacePos + liftDirection * liftDistance;

      // Scale down as dots lift off
      float fadeScale = max(0.0, 1.0 - liftDistance / 8.0);
      vFade = fadeScale;

      // Apply position offset and scale
      vec3 transformed = position * dotSize * fadeScale + newPos;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float baseOpacity;
    uniform float hoverAmount;

    varying float vFade;

    void main() {
      float opacity = baseOpacity * (1.0 - hoverAmount * 0.5) * vFade;
      gl_FragColor = vec4(color, opacity);
    }
  `,
};

function FlatCircles({
  positions,
  color,
  radius,
  opacity,
  surfaceRadius = 5.86,
}: {
  positions: Float32Array;
  color: string;
  radius: number;
  opacity: number;
  surfaceRadius?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const initializedRef = useRef(false);
  const count = positions.length / 3;

  // Pre-compute all matrices
  const matrices = useMemo(() => {
    const result: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    const up = new THREE.Vector3(0, 0, 1); // Circle geometry faces +Z by default

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      // Normalize and scale to surface radius
      const normal = new THREE.Vector3(x, y, z).normalize();
      dummy.position.copy(normal).multiplyScalar(surfaceRadius);

      // Orient so circle lays flat on surface (normal points outward)
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
      dummy.quaternion.copy(quaternion);

      dummy.updateMatrix();
      result.push(dummy.matrix.clone());
    }

    return result;
  }, [positions, count, surfaceRadius]);

  // Apply matrices once mesh is ready (only once)
  useFrame(() => {
    if (!initializedRef.current && meshRef.current && meshRef.current.instanceMatrix) {
      for (let i = 0; i < matrices.length; i++) {
        meshRef.current.setMatrixAt(i, matrices[i]);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      initializedRef.current = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <circleGeometry args={[radius, 32]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function Trails({
  positions,
  color,
  baseOpacity,
  scrollProgressRef,
}: {
  positions: Float32Array;
  color: string;
  baseOpacity: number;
  scrollProgressRef: RefObject<number>;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = positions.length / 3;

  // Create instance attributes (same as dots)
  const { basePositions, liftSpeeds, liftDirections } = useMemo(() => {
    const basePositions = new Float32Array(count * 3);
    const liftSpeeds = new Float32Array(count);
    const liftDirections = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      const seed = i * 127.1 + 311.7;
      liftSpeeds[i] = (Math.sin(seed) * 0.5 + 0.5) * 2;

      const len = Math.sqrt(x * x + y * y + z * z);
      const nx = x / len;
      const ny = y / len;
      const nz = z / len;

      const seed2 = i * 43.758 + 23.421;
      const seed3 = i * 91.113 + 47.532;
      const randX = Math.sin(seed2) * 0.5;
      const randY = Math.sin(seed3) * 0.5;
      const randZ = Math.sin(seed2 + seed3) * 0.5;

      const dirX = nx * 0.7 + randX * 0.3;
      const dirY = ny * 0.7 + randY * 0.3;
      const dirZ = nz * 0.7 + randZ * 0.3;

      const dirLen = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
      liftDirections[i * 3] = dirX / dirLen;
      liftDirections[i * 3 + 1] = dirY / dirLen;
      liftDirections[i * 3 + 2] = dirZ / dirLen;
    }

    return { basePositions, liftSpeeds, liftDirections };
  }, [positions, count]);

  const uniforms = useMemo(
    () => ({
      hoverAmount: { value: 0 },
      baseRadius: { value: 5.865 },
      color: { value: new THREE.Color(color) },
      baseOpacity: { value: baseOpacity },
    }),
    [color, baseOpacity],
  );

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.hoverAmount.value = scrollProgressRef.current;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(1, 1, 1, 4, 1);

    geo.setAttribute('basePosition', new THREE.InstancedBufferAttribute(basePositions, 3));
    geo.setAttribute('liftSpeed', new THREE.InstancedBufferAttribute(liftSpeeds, 1));
    geo.setAttribute('liftDirection', new THREE.InstancedBufferAttribute(liftDirections, 3));

    return geo;
  }, [basePositions, liftSpeeds, liftDirections]);

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

function GPUDots({
  positions,
  color,
  size,
  baseOpacity,
  scrollProgressRef,
}: {
  positions: Float32Array;
  color: string;
  size: number;
  baseOpacity: number;
  scrollProgressRef: RefObject<number>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = positions.length / 3;

  // Create instance attributes once
  const { basePositions, liftSpeeds, liftDirections } = useMemo(() => {
    const basePositions = new Float32Array(count * 3);
    const liftSpeeds = new Float32Array(count);
    const liftDirections = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      const seed = i * 127.1 + 311.7;
      liftSpeeds[i] = (Math.sin(seed) * 0.5 + 0.5) * 2;

      // Calculate outward normal
      const len = Math.sqrt(x * x + y * y + z * z);
      const nx = x / len;
      const ny = y / len;
      const nz = z / len;

      // Generate random tangent offset using seeded random
      const seed2 = i * 43.758 + 23.421;
      const seed3 = i * 91.113 + 47.532;
      const randX = Math.sin(seed2) * 0.5;
      const randY = Math.sin(seed3) * 0.5;
      const randZ = Math.sin(seed2 + seed3) * 0.5;

      // Mix outward direction with random offset (mostly outward, some sideways)
      const dirX = nx * 0.7 + randX * 0.3;
      const dirY = ny * 0.7 + randY * 0.3;
      const dirZ = nz * 0.7 + randZ * 0.3;

      // Normalize
      const dirLen = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
      liftDirections[i * 3] = dirX / dirLen;
      liftDirections[i * 3 + 1] = dirY / dirLen;
      liftDirections[i * 3 + 2] = dirZ / dirLen;
    }

    return { basePositions, liftSpeeds, liftDirections };
  }, [positions, count]);

  const uniforms = useMemo(
    () => ({
      hoverAmount: { value: 0 },
      baseRadius: { value: 5.865 },
      dotSize: { value: size },
      color: { value: new THREE.Color(color) },
      baseOpacity: { value: baseOpacity },
    }),
    [size, color, baseOpacity],
  );

  // Only update the uniform (very cheap) - read from ref, no React re-renders
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.hoverAmount.value = scrollProgressRef.current;
    }
  });

  // Set up instanced attributes
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 6, 6);

    // Add instance attributes
    geo.setAttribute('basePosition', new THREE.InstancedBufferAttribute(basePositions, 3));
    geo.setAttribute('liftSpeed', new THREE.InstancedBufferAttribute(liftSpeeds, 1));
    geo.setAttribute('liftDirection', new THREE.InstancedBufferAttribute(liftDirections, 3));

    return geo;
  }, [basePositions, liftSpeeds, liftDirections]);

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={dotsShader.vertexShader}
        fragmentShader={dotsShader.fragmentShader}
      />
    </instancedMesh>
  );
}

function Globe({ containerRef }: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const positionGroupRef = useRef<THREE.Group>(null);
  const scrollProgressRef = useRef(0);
  const { viewport } = useThree();

  const spherePositions = useMemo(() => generateSpherePoints(2000, 6, 0.18), []);

  useFrame((state) => {
    // Adjust Y position based on aspect ratio - move down on narrow screens
    if (positionGroupRef.current) {
      const aspect = viewport.width / viewport.height;
      // On wide screens (aspect > 1), use -5. On narrow, push further down
      const baseY = -5;
      const yOffset = aspect < 1 ? (1 - aspect) * -8 : 0;
      positionGroupRef.current.position.y = baseY + yOffset;
    }
    // Calculate scroll progress directly from DOM - no React state updates
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = windowHeight;
      const end = -rect.height;
      const rawProgress = (start - rect.top) / (start - end);
      scrollProgressRef.current = Math.max(0, Math.min(1, rawProgress));
    }

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
        {/* Solid surface */}
        <mesh>
          <sphereGeometry args={[5.85, 64, 64]} />
          <meshBasicMaterial color="#e5e5e5" transparent opacity={0.15} />
        </mesh>
        {/* Fresnel rim highlight */}
        <FresnelSphere radius={5.86} color="#ffffff" opacity={0.3} />
        <Trails positions={spherePositions} color="#ffbb49" baseOpacity={0.5} scrollProgressRef={scrollProgressRef} />
        <GPUDots
          positions={spherePositions}
          color="#ffbb49"
          size={0.015}
          baseOpacity={0.3}
          scrollProgressRef={scrollProgressRef}
        />
        <FlatCircles positions={spherePositions} color="#ffbb49" radius={0.015} opacity={0.3} />
      </group>
    </group>
  );
}

export function GlobeBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-x-0 top-0 hidden aspect-square w-full md:block', className)}
      style={{
        // Fade mask - fade out at bottom
        maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, -5, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Globe containerRef={containerRef} />
      </Canvas>
    </div>
  );
}

export default GlobeBackground;
