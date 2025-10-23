import gsap from 'gsap';

export interface CustomCursorOptions {
  offset?: number;
  easing?: string;
  interactiveSelectors?: string;
  activateScale?: number;
  activateBorderRadius?: number;
  activateDuration?: number;
}

const DEFAULTS: Required<CustomCursorOptions> = {
  offset: 10,
  easing: 'power3.out',
  interactiveSelectors: "a, button, [data-cursor='active']",
  activateScale: 2.5,
  activateBorderRadius: 9999,
  activateDuration: 0.25,
};

export function createCustomCursor(cursorElement: HTMLDivElement, options?: CustomCursorOptions) {
  if (typeof window === 'undefined' || !cursorElement) {
    return { destroy: () => {} };
  }

  const opts = { ...DEFAULTS, ...(options || {}) };

  // state
  let lastX = 0;
  let lastY = 0;
  let firstMove = true;
  let isHovering = false;

  // initial hidden
  gsap.set(cursorElement, { opacity: 0 });

  // Hover activation timeline
  const timeline = gsap.timeline({ paused: true }).to(cursorElement, {
    scale: opts.activateScale,
    borderRadius: opts.activateBorderRadius,
    backgroundColor: 'var(--accent)',
    duration: opts.activateDuration,
    ease: opts.easing,
  });

  const onPointerMove = (e: PointerEvent) => {
    lastX = e.clientX;
    lastY = e.clientY;

    // Check if target is interactive using event delegation
    const target = e.target as Element;
    const isInteractiveTarget =
      target.matches?.(opts.interactiveSelectors) || !!target.closest?.(opts.interactiveSelectors);

    // Update hover state
    if (isInteractiveTarget && !isHovering) {
      isHovering = true;
      timeline.play();
    } else if (!isInteractiveTarget && isHovering) {
      isHovering = false;
      timeline.reverse();
    }

    if (firstMove) {
      firstMove = false;
      gsap.set(cursorElement, {
        x: lastX - opts.offset,
        y: lastY - opts.offset,
        opacity: 1,
      });
      return;
    }

    gsap.to(cursorElement, {
      x: lastX - opts.offset,
      y: lastY - opts.offset,
      duration: 0,
      ease: opts.easing,
    });
  };

  const onLeave = () => {
    gsap.to(cursorElement, { opacity: 0, duration: 0.2 });

    // Reset hover state when mouse leaves document
    if (isHovering) {
      isHovering = false;
      timeline.reverse();
    }
  };

  const onEnter = () => {
    // show at last known position
    gsap.set(cursorElement, {
      x: lastX - opts.offset,
      y: lastY - opts.offset,
      opacity: 1,
    });
  };

  // Global listeners
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);
  document.addEventListener('mouseenter', onEnter);

  return {
    destroy: () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      timeline.kill();
    },
  };
}
