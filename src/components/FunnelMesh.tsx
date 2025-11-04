'use client';

import { useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { LatheGeometry, Mesh, MeshStandardMaterial, Vector2 } from 'three';
import { cn } from '@/lib/utils';

export function FunnelMesh() {
  // References for the meshes to animate rotation
  const primaryMeshRef = useRef<Mesh>(null);

  // Create funnel curve data - shared calculations used by both geometries
  const funnelData = useMemo(() => {
    const points: Vector2[] = [];
    const segments = 32; // Number of vertical segments

    // Dimensions: bowl shape at top with narrow neck
    const neckRadius = 0.1;
    const topRadius = 0.6; // 6× the neck radius
    const totalHeight = 0.8;
    const neckHeightRatio = 0.25; // 25% of total height for the neck

    // Generate parabolic curve for the funnel
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = t * totalHeight - totalHeight / 2; // Centered vertically

      let radius: number;

      if (t < neckHeightRatio) {
        // Bottom neck section - uniform cylindrical
        radius = neckRadius;
      } else {
        // Main body uses quadratic curve for consistent visual appearance
        const bodyT = (t - neckHeightRatio) / (1 - neckHeightRatio);
        const quadratic = bodyT * bodyT;
        radius = neckRadius + (topRadius - neckRadius) * quadratic;
      }

      points.push(new Vector2(radius, y));
    }

    return { points, segments };
  }, []);

  // Create main geometry with all radial segments
  const primaryGeometry = useMemo(() => {
    return new LatheGeometry(funnelData.points, 48);
  }, [funnelData]);

  // Create materials - base color and highlight color
  const primaryMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        wireframe: true,
      }),
    [],
  );

  return (
    <mesh
      ref={primaryMeshRef}
      geometry={primaryGeometry}
      material={primaryMaterial}
      rotation={[0, 0, Math.PI * -0.05]}
    />
  );
}

interface FunnelMeshProps {
  className?: string;
}

// Modified tracker that accepts a callback
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
      autoRotateSpeed={rotationDirection === 'clockwise' ? -0.5 : 0.5} // Negative for clockwise rotation
      onChange={(e) => {
        if (!e) return;

        // Get camera and compute current azimuthal angle
        // This works for user-controlled rotation
        const camera = e.target.object;
        if (!camera) return;

        // Get controls
        const controls = e.target;

        // Calculate the azimuthal angle (horizontal rotation)
        const currentAngle = controls.getAzimuthalAngle();

        if (currentAngle !== lastAngle) {
          // Calculate base direction
          let direction: RotationDirection = currentAngle > lastAngle ? 'clockwise' : 'counterclockwise';

          // Account for the angle wrapping around at ±π
          const wrappedAround = Math.abs(currentAngle - lastAngle) > Math.PI;

          if (wrappedAround) {
            direction = direction === 'clockwise' ? 'counterclockwise' : 'clockwise';
          }

          // Update state
          setLastAngle(currentAngle);
          setRotationDirection(direction);
        }
      }}
    />
  );
}

export function FunnelCanvas({ className }: FunnelMeshProps) {
  return (
    <div className={cn('relative h-96 w-96', className)}>
      <Canvas>
        {/* Orthographic camera to prevent perspective distortion */}
        <OrthographicCamera makeDefault position={[1.5, 0.5, 1.5]} zoom={250} />

        {/* Modified RotationTracker that uses our callback */}
        <RotationControls />

        {/* Ambient light for better visibility */}
        <ambientLight intensity={0.2} />

        {/* Directional light for depth */}
        <directionalLight position={[1, 1, 2]} intensity={0.8} />
        {/* Secondary light from another angle */}
        <directionalLight position={[-1, 0.5, -1]} intensity={0.3} />

        <FunnelMesh />
      </Canvas>
    </div>
  );
}
