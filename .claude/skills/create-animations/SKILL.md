---
name: Create Animations
description: Create scroll-triggered animations using GSAP and ScrollTrigger in React/TypeScript. Use this skill when building animated illustrations, scroll-driven animations, SVG animations, or interactive visual components for the portfolio. Triggers on requests to create, modify, or debug animations.
---

# Create Animations

Build scroll-triggered animations using GSAP with ScrollTrigger in React/TypeScript. Animations use SVG for complex illustrations and DOM elements for 3D transforms.

## Component Structure

```tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MyAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !elementRef.current) return;

      gsap.set(elementRef.current, { opacity: 0, scale: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'restart none restart reset',
        },
      });

      tl.to(elementRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.7)',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative flex aspect-square h-96 items-center justify-center">
      <svg viewBox="0 0 320 200" className="relative z-10 h-full w-full" style={{ overflow: 'visible' }}>
        {/* Content */}
      </svg>
    </div>
  );
};
```

## ScrollTrigger

**toggleActions** format: `"onEnter onLeave onEnterBack onLeaveBack"`
- `restart none restart reset` - Replays on enter, resets when fully leaving viewport
- `play none none none` - Plays once only

**Markers:**
- `start: 'top bottom'` - Triggers when element top hits viewport bottom
- `end: 'bottom top'` - Ends when element bottom hits viewport top

## SVG Patterns

### Gradients & Shadows

```tsx
<defs>
  <linearGradient id="grayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#525252" />
    <stop offset="100%" stopColor="#3f3f3f" />
  </linearGradient>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.25" />
  </filter>
</defs>
```

### SVG Transform Origin

```tsx
gsap.set(element, { rotation: 45, svgOrigin: '160 100' }); // x y in viewBox coords
```

## Z-Ordering

**SVG:** Elements rendered later appear on top. Reorder JSX to control layering.

**DOM with 3D transforms:** CSS z-index unreliable. Use DOM order instead:
```tsx
// Interleave for proper merge animations
const panes = [
  { side: 'left', index: 0 },
  { side: 'right', index: 0 },
  { side: 'left', index: 1 },
  // ...
];
```

## GSAP Techniques

### Stagger
```tsx
gsap.to(elements, { opacity: 1, stagger: 0.06 });
gsap.to(elements, { opacity: 1, stagger: { amount: 0.4, from: 'random' } });
```

### Timeline Positioning
```tsx
tl.to(el1, { x: 0 })           // After previous
  .to(el2, { y: 0 }, '<')      // Same time as previous
  .to(el3, { scale: 1 }, '-=0.1'); // Overlaps by 0.1s
```

### Transform Origin
```tsx
gsap.set(element, { transformOrigin: 'left center' });
gsap.set(svgElement, { svgOrigin: '160 100' });
```

## Colors

**Dark elements:** Gray gradients `#3f3f3f` to `#525252`

**Highlights:** CSS variables `fill="var(--color-primary-500)"`

**Light elements:** White fill + dark stroke `stroke="#525252"`

**Backgrounds:** Very subtle `from-gray-200/30 via-transparent to-gray-100/20`

## Shadows

Keep subtle:
- SVG: `stdDeviation="1.5"`, `floodOpacity="0.25"`
- Tailwind: `shadow-sm shadow-black/20`

## Refs

### Array
```tsx
const elementsRef = useRef<(SVGGElement | null)[]>([]);
{items.map((item, i) => (
  <g ref={(el) => { elementsRef.current[i] = el; }} />
))}
```

## Animation Concepts

| Type | Description |
|------|-------------|
| Merge | Elements apart → slide together → transform into unified result |
| Scatter to Grid | Scattered + rotated → snap into organized grid |
| Stack Collapse | 3D stacked panes → collapse → transform to new element |
| Burst | Central element → spawns elements animating outward |

## Checklist

- [ ] Elements stay within canvas bounds (check scattered positions)
- [ ] Z-order correct (SVG render order, DOM order for 3D)
- [ ] Shadows subtle (not heavy)
- [ ] Primary color highlights in both initial and final states
- [ ] `gsap.context()` with cleanup `ctx.revert()`
- [ ] Null checks for all refs
