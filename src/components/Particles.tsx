'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, useSphere, useTrimesh } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { Matrix4, Object3D, Vector2 } from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import AnimateContent from './AnimateContent';

// Create funnel geometry points
function createFunnelPoints() {
  const points: Vector2[] = [];
  const segments = 32;

  const neckRadius = 0.1;
  const topRadius = 0.6;
  const totalHeight = 0.8;
  const neckHeightRatio = 0.25;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = t * totalHeight - totalHeight / 2;

    let radius: number;

    if (t < neckHeightRatio) {
      radius = neckRadius;
    } else {
      const bodyT = (t - neckHeightRatio) / (1 - neckHeightRatio);
      const quadratic = bodyT * bodyT;
      radius = neckRadius + (topRadius - neckRadius) * quadratic;
    }

    points.push(new Vector2(radius, y));
  }

  return { points, segments };
}

// Type for Cannon.js API
interface ParticleApi {
  position: { set: (x: number, y: number, z: number) => void };
  velocity: { set: (x: number, y: number, z: number) => void };
  wakeUp: () => void;
}

interface ParticlesProps {
  particleCount?: number;
  spawnHeight?: number;
  despawnHeight?: number;
  particleSize?: number;
  color?: number | string;
  funnelColor?: number | string;
  wireframeFunnel?: boolean;
  gravity?: [number, number, number];
  className?: string;
}

// Particle with physics body
function ParticleWithPhysics({
  initialPosition,
  particleSize,
  onPositionUpdate,
  onApiReady,
}: {
  initialPosition: [number, number, number];
  particleSize: number;
  onPositionUpdate: (pos: THREE.Vector3) => void;
  onApiReady: (api: ParticleApi) => void;
}) {
  const [ref, api] = useSphere(() => ({
    type: 'Dynamic',
    mass: 0.5, // Lighter mass for better flow through funnel
    position: initialPosition,
    args: [particleSize], // radius
    restitution: 0.7, // More bouncy
    friction: 0.2, // Less friction to slide better
    linearDamping: 0.05, // Less damping for smoother movement
    angularDamping: 0.1,
    allowSleep: false,
  }));

  const initializedRef = useRef(false);

  // Initialize particle and subscribe to position updates
  useEffect(() => {
    const timeout = setTimeout(() => {
      api.wakeUp();
      initializedRef.current = true;
      onApiReady(api);
    }, 0);

    // Subscribe to position updates
    const positionUnsubscribe = api.position.subscribe((position) => {
      const pos = new THREE.Vector3(...position);
      onPositionUpdate(pos);
    });

    return () => {
      clearTimeout(timeout);
      positionUnsubscribe();
    };
  }, [api, onPositionUpdate, onApiReady]);

  // Make invisible - we use instanced mesh for rendering
  return <mesh ref={ref} visible={false} />;
}

// Physical funnel with collider
function PhysicalFunnel({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, Math.PI * -0.05] as [number, number, number],
  color = 0xffffff,
  wireframe = true,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: number | string;
  wireframe?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const funnelData = useMemo(() => createFunnelPoints(), []);

  // Create the funnel geometry
  const geometry = useMemo(() => {
    return new THREE.LatheGeometry(funnelData.points, 48);
  }, [funnelData]);

  // Create wireframe material
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        wireframe,
        color,
        emissive: typeof color === 'number' ? color : 0x444444,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: wireframe ? 1.0 : 0.8,
      }),
    [color, wireframe],
  );

  // Convert geometry to trimesh format (vertices and indices) for physics
  const { vertices, indices } = useMemo(() => {
    const position = geometry.attributes.position;
    const vertices = new Float32Array(position.count * 3);

    for (let i = 0; i < position.count; i++) {
      // Slightly scale inward to avoid tunneling (0.99 scale)
      vertices[i * 3] = position.getX(i) * 0.99;
      vertices[i * 3 + 1] = position.getY(i);
      vertices[i * 3 + 2] = position.getZ(i) * 0.99;
    }

    const indices = new Uint16Array(geometry.index?.array || []);

    return { vertices, indices };
  }, [geometry]);

  // Use Trimesh for concave collision
  const [colliderRef] = useTrimesh(
    () => ({
      args: [vertices, indices],
      type: 'Static',
      position,
      rotation,
      restitution: 0.6, // Higher value for bouncy collisions
      friction: 0.3, // Moderate friction for sliding
    }),
    useRef<THREE.Mesh>(null),
  );

  return (
    <>
      {/* Visual mesh */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        position={[position[0], position[1], position[2]]}
        //rotation={[rotation[0], rotation[1], rotation[2]]}
      />

      {/* Physics collider (invisible) */}
      <mesh ref={colliderRef} visible={false} />
    </>
  );
}

// Particle system with instanced rendering and recycling
function ParticleSystem({
  particleCount = 150,
  spawnHeight = 1.0,
  despawnHeight = -1.5,
  particleSize = 0.015,
  color = 0xffffff,
}: {
  particleCount: number;
  spawnHeight: number;
  despawnHeight: number;
  particleSize: number;
  color: number | string;
}) {
  const SPAWN_Y = spawnHeight;
  const DESPAWN_Y = despawnHeight;
  const PARTICLE_RADIUS = particleSize;

  const [particles, setParticles] = useState<Array<{ id: number; position: [number, number, number] }>>([]);
  const particleIdRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const particleApisRef = useRef<Map<number, ParticleApi>>(new Map());

  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const particlePositionsRef = useRef<Map<number, THREE.Vector3>>(new Map());
  const tempObject = useMemo(() => new Object3D(), []);
  const matrices = useMemo(() => Array.from({ length: particleCount }, () => new Matrix4()), [particleCount]);

  // Convert color to number if it's a string
  const colorNumber = useMemo(() => {
    if (typeof color === 'string') {
      // Handle hex strings like "#ffffff" or "0xffffff"
      if (color.startsWith('#')) {
        return parseInt(color.slice(1), 16);
      }
      if (color.startsWith('0x')) {
        return parseInt(color.slice(2), 16);
      }
      return 0xffffff; // Default to white
    }
    return color;
  }, [color]);

  // Particle geometry and material
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colorNumber,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [colorNumber],
  );

  // Spawn new particles continuously
  useFrame((state, delta) => {
    spawnTimerRef.current += delta;

    // Spawn new particle every 0.07-0.15 seconds (slightly slower to prevent overwhelming the funnel)
    const spawnInterval = 0.07 + Math.random() * 0.08;
    if (spawnTimerRef.current > spawnInterval && particles.length < particleCount) {
      // Random position at top within a smaller radius to better target the funnel
      const radius = Math.random() * 0.5; // Smaller spawn radius
      const angle = Math.random() * Math.PI * 2;
      const spawnX = 1.0 + Math.cos(angle) * radius; // Offset to match funnel position
      const spawnZ = Math.sin(angle) * radius;
      const spawnY = SPAWN_Y;

      const newParticle = {
        id: particleIdRef.current++,
        position: [spawnX, spawnY, spawnZ] as [number, number, number],
      };

      setParticles((prev) => [...prev, newParticle]);
      particlePositionsRef.current.set(newParticle.id, new THREE.Vector3(spawnX, spawnY, spawnZ));
      spawnTimerRef.current = 0;
    }

    // Update particle positions and recycle old ones
    setParticles((prev) => {
      prev.forEach((p) => {
        const pos = particlePositionsRef.current.get(p.id);
        if (pos && pos.y < DESPAWN_Y) {
          // Recycle particle - move it back to top
          const api = particleApisRef.current.get(p.id);
          if (api) {
            // Use same circular distribution when recycling
            const radius = Math.random() * 0.5;
            const angle = Math.random() * Math.PI * 2;
            const newX = 1.0 + Math.cos(angle) * radius; // Offset to match funnel position
            const newZ = Math.sin(angle) * radius;
            const newY = SPAWN_Y;

            // Reset position and velocity
            api.position.set(newX, newY, newZ);
            api.wakeUp();
            api.velocity.set(0, 0, 0); // Reset velocity, let gravity handle it

            particlePositionsRef.current.set(p.id, new THREE.Vector3(newX, newY, newZ));
          }
        }
      });

      return prev;
    });

    // Update instanced mesh matrices with a soft pulse for a smoother look
    if (instancedMeshRef.current) {
      const elapsed = state.clock.elapsedTime;
      particles.forEach((particle, i) => {
        const pos = particlePositionsRef.current.get(particle.id);
        if (pos) {
          const pulse = 0.9 + Math.sin(elapsed * 3 + i * 0.35) * 0.12;
          tempObject.position.copy(pos);
          const scale = PARTICLE_RADIUS * pulse;
          tempObject.scale.set(scale, scale, scale);
          tempObject.rotation.set(0, 0, 0);
          tempObject.updateMatrix();
          matrices[i].copy(tempObject.matrix);
          instancedMeshRef.current?.setMatrixAt(i, matrices[i]);
        }
      });

      // Hide unused instances
      for (let i = particles.length; i < particleCount; i++) {
        tempObject.scale.set(0, 0, 0);
        tempObject.updateMatrix();
        matrices[i].copy(tempObject.matrix);
        instancedMeshRef.current.setMatrixAt(i, matrices[i]);
      }

      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Instanced mesh for efficient rendering */}
      <instancedMesh ref={instancedMeshRef} args={[geometry, material, particleCount]} frustumCulled={false} />

      {/* Individual physics bodies for each particle */}
      {particles.map((particle) => (
        <ParticleWithPhysics
          key={particle.id}
          initialPosition={particle.position}
          particleSize={PARTICLE_RADIUS}
          onPositionUpdate={(pos) => {
            particlePositionsRef.current.set(particle.id, pos);
          }}
          onApiReady={(api) => {
            particleApisRef.current.set(particle.id, api);
          }}
        />
      ))}
    </>
  );
}

// Complete particles scene
function ParticlesScene({
  particleCount = 150,
  spawnHeight = 1.0,
  despawnHeight = -1.5,
  particleSize = 0.015,
  color = 0xffffff,
  funnelColor = 0xffffff,
  wireframeFunnel = true,
  gravity = [0, -9.81, 0],
}: {
  particleCount: number;
  spawnHeight: number;
  despawnHeight: number;
  particleSize: number;
  color: number | string;
  funnelColor?: number | string;
  wireframeFunnel?: boolean;
  gravity: [number, number, number];
}) {
  // Add proper typing for the controls ref
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Position the funnel so particles can fall into it
  const funnelPosition: [number, number, number] = [1.0, 0.1, 0];

  // Set camera to focus on the funnel with a closer zoom
  useEffect(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      // Position camera closer to the funnel for a tighter zoom
      controls.object.position.set(1.8, 0.7, 1.0);
      controls.target.set(1.0, 0.1, 0); // Target the funnel's center
      controls.update();
    }
  }, []);

  // Calculate optimal spawn height to be above funnel opening
  const effectiveSpawnHeight = Math.max(spawnHeight, 0.8);

  // Convert funnel color to number if it's a string
  const processedFunnelColor = useMemo(() => {
    if (typeof funnelColor === 'string') {
      // Handle hex strings like "#ffffff" or "0xffffff"
      if (funnelColor.startsWith('#')) {
        return parseInt(funnelColor.slice(1), 16);
      }
      if (funnelColor.startsWith('0x')) {
        return parseInt(funnelColor.slice(2), 16);
      }
      return 0xffffff; // Default to white
    }
    return funnelColor;
  }, [funnelColor]);

  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[1, 1, 2]} intensity={0.6} />
      <directionalLight position={[-1, 0.5, -1]} intensity={0.3} />

      {/* Add camera controls */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableZoom={false}
        minDistance={0.8} // Allow closer zoom
        maxDistance={3} // Restrict max distance for a tighter view
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={1.5} // Slightly slower rotation for better viewingLimit camera to hemisphere above funnel
      />

      {/* Physics world with Cannon */}
      <Physics gravity={gravity} defaultContactMaterial={{ restitution: 0.6, friction: 0.3 }} allowSleep={false}>
        {/* Add funnel component */}
        <PhysicalFunnel position={funnelPosition} color={processedFunnelColor} wireframe={wireframeFunnel} />

        <ParticleSystem
          particleCount={particleCount}
          spawnHeight={effectiveSpawnHeight}
          despawnHeight={despawnHeight}
          particleSize={particleSize}
          color={color}
        />
      </Physics>
    </>
  );
}

// Main export component
export function Particles({
  particleCount = 50,
  spawnHeight = 2.0,
  despawnHeight = -3,
  particleSize = 0.015,
  color = 0xffffff,
  funnelColor,
  wireframeFunnel = true,
  gravity = [0, -1.81, 0],
  className,
}: ParticlesProps) {
  // Use the specified funnel color or default to the particle color
  const actualFunnelColor = funnelColor || color;

  return (
    <div className={cn('h-full w-full', className)}>
      <Canvas shadows>
        <ParticlesScene
          particleCount={particleCount}
          spawnHeight={spawnHeight}
          despawnHeight={despawnHeight}
          particleSize={particleSize}
          color={color}
          funnelColor={actualFunnelColor}
          wireframeFunnel={wireframeFunnel}
          gravity={gravity}
        />
      </Canvas>
    </div>
  );
}
