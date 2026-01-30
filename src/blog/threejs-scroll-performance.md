# Fixing Scroll Jank in React Three Fiber

When combining scroll-driven animations with Three.js in React, a common mistake causes significant performance issues. Here's how I fixed laggy scroll animations on my portfolio's 3D globe.

## The Problem

I had a globe made of 2000 instanced dots that should animate based on scroll position. The dots lift off the sphere surface as you scroll down the page. Simple enough, but scrolling felt janky—the animation stuttered instead of running at smooth 60fps.

## The Mistake

The initial implementation used a custom `useScroll` hook that stored scroll progress in React state:

```tsx
// ❌ This causes re-renders on every scroll frame
function GlobeBackground() {
  const containerRef = useRef(null);
  const scrollProgress = useScroll(containerRef); // React state!

  return (
    <Canvas>
      <Globe scrollProgress={scrollProgress} />
    </Canvas>
  );
}
```

Every scroll event triggered:

1. `useScroll` updates React state
2. `GlobeBackground` re-renders
3. `Globe` re-renders
4. `GPUDots` re-renders
5. React's reconciliation runs

This interrupted Three.js's render loop. Even though the actual GPU work was minimal (just updating a uniform), React's overhead created frame drops.

## The Fix

The solution: bypass React state entirely. Calculate scroll position inside Three.js's `useFrame` callback and store it in a ref.

```tsx
// ✅ No React re-renders, smooth 60fps
function Globe({ containerRef }) {
  const scrollProgressRef = useRef(0);

  useFrame(() => {
    // Read scroll position directly from DOM
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = windowHeight;
      const end = -rect.height;
      const rawProgress = (start - rect.top) / (start - end);
      scrollProgressRef.current = Math.max(0, Math.min(1, rawProgress));
    }

    // Use the value directly—no state, no re-renders
    const scrollProgress = scrollProgressRef.current;
    // ... update rotation, uniforms, etc.
  });
}
```

The key insight: `useFrame` already runs every frame. Reading scroll position there (from `getBoundingClientRect`) and storing it in a ref means:

- No React state updates
- No component re-renders
- Three.js render loop runs uninterrupted
- Uniforms update synchronously with the render

## When to Use This Pattern

Use refs instead of state for Three.js animations when:

- Values change frequently (scroll, mouse position, time)
- The value only affects Three.js objects (meshes, materials, uniforms)
- You don't need React to "know" about the value for rendering

Use React state when:

- UI elements outside the canvas need to react to the value
- You need the value for conditional rendering
- Changes should trigger React's lifecycle

## The Result

Scrolling now runs at consistent 60fps. The globe rotates and dots lift off smoothly, synchronized perfectly with scroll position. Same visual effect, dramatically better performance.

The lesson: React and Three.js each have their own render loops. Keep them separate. Let React handle UI, let Three.js handle 3D—and use refs as the bridge between them.
