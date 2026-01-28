// Web Worker for heavy globe computations - runs off main thread

function generateSpherePoints(count: number, radius: number, minDistance: number): Float32Array {
  const points: { x: number; y: number; z: number }[] = [];

  let seed = 12345;
  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const maxAttempts = count * 20;
  let attempts = 0;
  const minDistSq = minDistance * minDistance;

  while (points.length < count && attempts < maxAttempts) {
    attempts++;

    const theta = seededRandom() * Math.PI * 2;
    // Upper hemisphere only: phi in [0, PI/2] instead of [0, PI]
    const phi = Math.acos(seededRandom());

    const x = Math.sin(phi) * Math.cos(theta) * radius;
    const y = Math.cos(phi) * radius; // Always positive (upper half)
    const z = Math.sin(phi) * Math.sin(theta) * radius;

    let tooClose = false;
    for (const existing of points) {
      const dx = x - existing.x;
      const dy = y - existing.y;
      const dz = z - existing.z;
      if (dx * dx + dy * dy + dz * dz < minDistSq) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      points.push({ x, y, z });
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

function computeLiftData(positions: Float32Array) {
  const count = positions.length / 3;
  const liftSpeeds = new Float32Array(count);
  const liftDirections = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

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

  return { liftSpeeds, liftDirections };
}

// Handle messages from main thread
self.onmessage = (e: MessageEvent) => {
  const { type, count, radius, minDistance } = e.data;

  if (type === 'compute') {
    // Generate positions
    const positions = generateSpherePoints(count, radius, minDistance);

    // Compute lift data
    const { liftSpeeds, liftDirections } = computeLiftData(positions);

    // Transfer arrays back to main thread (zero-copy)
    self.postMessage(
      { positions, liftSpeeds, liftDirections },
      { transfer: [positions.buffer, liftSpeeds.buffer, liftDirections.buffer] }
    );
  }
};

export {};
