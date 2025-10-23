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
  let isClicking = false;
  let clickTimeout: number | null = null;

  // initial hidden
  gsap.set(cursorElement, { opacity: 0 });

  // Hover activation timeline
  const hoverTimeline = gsap.timeline({ paused: true }).to(cursorElement, {
    scale: opts.activateScale,
    borderRadius: opts.activateBorderRadius,
    backgroundColor: 'var(--accent)',
    duration: opts.activateDuration,
    ease: opts.easing,
  });

  // Click squeeze timeline
  const clickTimeline = gsap.timeline({ paused: true }).to(cursorElement, {
    scale: isHovering ? opts.activateScale * 0.8 : 0.8, // Scale down from current size
    duration: 0.55,
    ease: 'power1.in', // Fast start, slow end
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
      hoverTimeline.play();
    } else if (!isInteractiveTarget && isHovering) {
      isHovering = false;
      hoverTimeline.reverse();
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
      hoverTimeline.reverse();
    }

    // Reset click state if needed
    if (isClicking) {
      isClicking = false;
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
      }
      clickTimeline.reverse();
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

  // Pointer down/up handlers for click effect
  const onPointerDown = (e: PointerEvent) => {
    const target = e.target as Element;
    const isInteractiveTarget =
      target.matches?.(opts.interactiveSelectors) || !!target.closest?.(opts.interactiveSelectors);

    if (isInteractiveTarget) {
      isClicking = true;
      // Update the scale target based on current hover state
      clickTimeline.kill();
      clickTimeline.clear();
      clickTimeline.to(cursorElement, {
        scale: isHovering ? opts.activateScale * 0.8 : 0.8,
        duration: 0.05,
        ease: 'power1.in', // Fast start, slow end
      });
      clickTimeline.play();
    }
  };

  const onPointerUp = () => {
    if (isClicking) {
      isClicking = false;
      // Add a small delay to ensure the animation has time to play
      clickTimeout = window.setTimeout(() => {
        clickTimeline.reverse();
      }, 50); // 50ms delay
    }
  };

  // Global listeners
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);
  document.addEventListener('mouseenter', onEnter);
  document.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('pointerup', onPointerUp);

  return {
    destroy: () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointerup', onPointerUp);
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
      hoverTimeline.kill();
      clickTimeline.kill();
    },
  };
}
