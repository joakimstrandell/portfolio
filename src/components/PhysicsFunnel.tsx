'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls } from '@react-three/drei';
import { Physics, useBox, useSphere, useTrimesh } from '@react-three/cannon';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { Matrix4, Object3D } from 'three';

// Reuse the existing funnel geometry logic
function createFunnelPoints() {
  const points: THREE.Vector2[] = [];
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

    points.push(new THREE.Vector2(radius, y));
  }

  return { points, segments };
}

// Type for Cannon.js API
interface ParticleApi {
  position: { set: (x: number, y: number, z: number) => void };
  velocity: { set: (x: number, y: number, z: number) => void };
  wakeUp: () => void;
  applyLocalForce?: (force: [number, number, number], point: [number, number, number]) => void;
  applyImpulse?: (impulse: [number, number, number], point: [number, number, number]) => void;
}

// Visual funnel component with subtle wobble
function VisualFunnel() {
  const meshRef = useRef<THREE.Mesh>(null);
  const funnelData = useMemo(() => createFunnelPoints(), []);

  const geometry = useMemo(() => {
    return new THREE.LatheGeometry(funnelData.points, 48);
  }, [funnelData]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        wireframe: true,
        color: 0xffffff,
        emissive: 0x333333,
        emissiveIntensity: 0.1,
      }),
    [],
  );

  // Add subtle wobble to rotation
  useFrame((state) => {
    if (meshRef.current) {
      const wobble = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      meshRef.current.rotation.z = Math.PI * -0.05 + wobble;
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} rotation={[0, 0, Math.PI * -0.05]} />;
}

// Funnel collider using Trimesh for concave shape
// Slightly offset to avoid tunneling issues
function FunnelCollider() {
  const funnelData = useMemo(() => createFunnelPoints(), []);

  // Create the funnel geometry for collision
  const geometry = useMemo(() => {
    return new THREE.LatheGeometry(funnelData.points, 48);
  }, [funnelData]);

  // Convert geometry to trimesh format (vertices and indices)
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
  const [ref] = useTrimesh(
    () => ({
      args: [vertices, indices],
      type: 'Static',
      position: [0, 0, 0],
      rotation: [0, 0, Math.PI * -0.05],
      restitution: 0.3,
      friction: 0.4, // Higher friction for better sliding
    }),
    useRef<THREE.Mesh>(null),
  );

  // Make it invisible
  return <mesh ref={ref} visible={false} />;
}

// Particle system with instanced rendering and recycling
function ParticleSystem() {
  const MAX_PARTICLES = 150;
  const SPAWN_Y = 1.0; // Above the funnel
  const DESPAWN_Y = -1.5; // Below this threshold, recycle particle
  const PARTICLE_RADIUS = 0.015;

  const [particles, setParticles] = useState<Array<{ id: number; position: [number, number, number] }>>([]);
  const particleIdRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const particleApisRef = useRef<Map<number, ParticleApi>>(new Map());

  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const particlePositionsRef = useRef<Map<number, THREE.Vector3>>(new Map());
  const tempObject = useMemo(() => new Object3D(), []);
  const matrices = useMemo(() => Array.from({ length: MAX_PARTICLES }, () => new Matrix4()), []);

  // Particle geometry and material - glowing blue spheres
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 12, 12), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.6,
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.95,
      }),
    [],
  );

  // Spawn new particles continuously
  useFrame((state, delta) => {
    spawnTimerRef.current += delta;

    // Spawn new particle every 0.05-0.1 seconds
    const spawnInterval = 0.05 + Math.random() * 0.05;
    if (spawnTimerRef.current > spawnInterval && particles.length < MAX_PARTICLES) {
      // Random position above funnel (within top radius)
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.5; // Within top radius
      const spawnX = Math.cos(angle) * radius;
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
      const updated = prev.filter((p) => {
        console.log('p', p);
        const pos = particlePositionsRef.current.get(p.id);
        if (pos && pos.y < DESPAWN_Y) {
          // Recycle particle - move it back to top
          const api = particleApisRef.current.get(p.id);
          if (api) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.5;
            const newX = Math.cos(angle) * radius;
            const newZ = Math.sin(angle) * radius;
            const newY = SPAWN_Y;

            // Reset position and velocity - set multiple times to ensure it works
            api.position.set(newX, newY, newZ);
            api.wakeUp();
            api.velocity.set(0, -2, 0); // Initial downward velocity
            api.velocity.set(0, -2, 0); // Set twice to ensure it sticks

            particlePositionsRef.current.set(p.id, new THREE.Vector3(newX, newY, newZ));
          }
          return true; // Keep particle, just recycled
        }
        return true;
      });

      return updated;
    });

    // Update instanced mesh matrices
    if (instancedMeshRef.current) {
      particles.forEach((particle, i) => {
        const pos = particlePositionsRef.current.get(particle.id);
        if (pos) {
          tempObject.position.copy(pos);
          tempObject.scale.set(PARTICLE_RADIUS, PARTICLE_RADIUS, PARTICLE_RADIUS);
          tempObject.rotation.set(0, 0, 0);
          tempObject.updateMatrix();
          matrices[i].copy(tempObject.matrix);
          instancedMeshRef.current?.setMatrixAt(i, matrices[i]);
        }
      });

      // Hide unused instances
      for (let i = particles.length; i < MAX_PARTICLES; i++) {
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
      <instancedMesh ref={instancedMeshRef} args={[geometry, material, MAX_PARTICLES]} frustumCulled={false} />

      {/* Individual physics bodies for each particle */}
      {particles.map((particle) => (
        <ParticleWithPhysics
          key={particle.id}
          initialPosition={particle.position}
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

// Particle with physics body
function ParticleWithPhysics({
  initialPosition,
  onPositionUpdate,
  onApiReady,
}: {
  initialPosition: [number, number, number];
  onPositionUpdate: (pos: THREE.Vector3) => void;
  onApiReady: (api: ParticleApi) => void;
}) {
  const [ref, api] = useSphere(() => ({
    type: 'Dynamic',
    mass: 1,
    position: initialPosition,
    args: [0.015], // radius: 0.015
    restitution: 0.3,
    friction: 0.4, // Higher friction for smooth sliding
    linearDamping: 0.1, // Smooth sliding without jitter
    angularDamping: 0.2,
    allowSleep: false,
    velocity: [0, -2, 0], // Set initial velocity in the hook config
  }));

  const initializedRef = useRef(false);
  const velocityRef = useRef<[number, number, number]>([0, -2, 0]);
  const lastCheckRef = useRef(0);

  // Initialize particle immediately with downward velocity
  useEffect(() => {
    // Use a small timeout to ensure API is ready
    const timeout = setTimeout(() => {
      api.wakeUp();
      // Set initial velocity multiple times to ensure it sticks
      api.velocity.set(0, -2, 0);
      api.velocity.set(0, -2, 0); // Set twice to ensure it works

      initializedRef.current = true;
      // Notify parent of API availability
      onApiReady(api);
    }, 0);

    // Subscribe to velocity updates
    const velocityUnsubscribe = api.velocity.subscribe((velocity) => {
      velocityRef.current = velocity;
    });

    // Subscribe to position updates
    const positionUnsubscribe = api.position.subscribe((position) => {
      const pos = new THREE.Vector3(...position);
      onPositionUpdate(pos);
    });

    return () => {
      clearTimeout(timeout);
      velocityUnsubscribe();
      positionUnsubscribe();
    };
  }, [api, onPositionUpdate, onApiReady]);

  // Continuously ensure particle is falling
  useFrame((state, delta) => {
    if (!initializedRef.current) return;

    // Check every frame but throttle velocity updates
    lastCheckRef.current += delta;
    if (lastCheckRef.current < 0.03) return; // Check every 30ms
    lastCheckRef.current = 0;

    const velocity = velocityRef.current;
    // Aggressively ensure particle is falling
    // If velocity is not negative enough, force it down
    if (velocity[1] > -1.0) {
      // Force downward velocity - ensure it's always falling
      api.velocity.set(velocity[0], -2.0, velocity[2]);
    }
  });

  // Make invisible - we use instanced mesh for rendering
  return <mesh ref={ref} visible={false} />;
}

function RotationControls() {
  type RotationDirection = 'clockwise' | 'counterclockwise';
  const [lastAngle, setLastAngle] = useState<number>(0);
  const [rotationDirection, setRotationDirection] = useState<RotationDirection>('clockwise');

  return (
    <OrbitControls
      makeDefault
      enableZoom={false}
      enablePan={false}
      rotateSpeed={1}
      minPolarAngle={Math.PI / 8}
      maxPolarAngle={(Math.PI * 7) / 8}
      autoRotate={true}
      autoRotateSpeed={rotationDirection === 'clockwise' ? -0.5 : 0.5}
      onChange={(e) => {
        if (!e) return;

        const camera = e.target.object;
        if (!camera) return;

        const controls = e.target;
        const currentAngle = controls.getAzimuthalAngle();

        if (currentAngle !== lastAngle) {
          let direction: RotationDirection = currentAngle > lastAngle ? 'clockwise' : 'counterclockwise';

          const wrappedAround = Math.abs(currentAngle - lastAngle) > Math.PI;
          if (wrappedAround) {
            direction = direction === 'clockwise' ? 'counterclockwise' : 'clockwise';
          }

          setLastAngle(currentAngle);
          setRotationDirection(direction);
        }
      }}
    />
  );
}

// Floor to catch particles (for cleanup)
function Floor() {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [0, -2, 0],
    args: [2, 0.1, 2],
    restitution: 0.3,
    friction: 0.4,
  }));

  return <mesh ref={ref} visible={false} />;
}

// Complete physics funnel scene
function PhysicsFunnelScene() {
  return (
    <>
      <OrthographicCamera makeDefault position={[1.5, 0.5, 1.5]} zoom={250} />
      <RotationControls />

      {/* Lighting setup */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[1, 1, 2]} intensity={0.8} />
      <directionalLight position={[-1, 0.5, -1]} intensity={0.3} />
      <pointLight position={[0, 0.5, 0]} intensity={0.5} color="#00aaff" />

      {/* Physics world with Cannon */}
      <Physics gravity={[0, -9.81, 0]} defaultContactMaterial={{ restitution: 0.3, friction: 0.4 }} allowSleep={false}>
        {/* Visual components */}
        <VisualFunnel />

        {/* Physics components */}
        <FunnelCollider />
        <ParticleSystem />
        <Floor />
      </Physics>
    </>
  );
}

// Main export component
interface PhysicsFunnelProps {
  className?: string;
}

export function PhysicsFunnel({ className }: PhysicsFunnelProps) {
  return (
    <div className={cn('relative h-96 w-96', className)}>
      <Canvas shadows>
        <PhysicsFunnelScene />
      </Canvas>
    </div>
  );
}
