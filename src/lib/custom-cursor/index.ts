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
  let isVisible = false;

  // initial hidden
  gsap.set(cursorElement, { opacity: 0 });

  // Centralized show/hide helpers to avoid tween conflicts
  function showCursorAt(x: number, y: number) {
    // Only kill opacity tweens to avoid interrupting hover timeline (scale, radius, bg)
    gsap.killTweensOf(cursorElement, 'opacity');
    gsap.set(cursorElement, {
      x: x - opts.offset,
      y: y - opts.offset,
    });
    gsap.to(cursorElement, { opacity: 1, duration: 0.15, ease: opts.easing, overwrite: 'auto' });
    isVisible = true;
  }

  function hideCursor() {
    // Only kill opacity tweens
    gsap.killTweensOf(cursorElement, 'opacity');
    gsap.to(cursorElement, { opacity: 0, duration: 0.15, ease: opts.easing, overwrite: 'auto' });
    isVisible = false;
  }

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
      showCursorAt(lastX, lastY);
      return;
    }

    gsap.to(cursorElement, {
      x: lastX - opts.offset,
      y: lastY - opts.offset,
      duration: 0,
      ease: opts.easing,
    });

    // If for any reason we are hidden but the pointer is moving inside, reshow
    if (!isVisible) {
      showCursorAt(lastX, lastY);
    }
  };

  // Boundary aware leave using document-level pointerleave
  const onPointerLeaveDoc = () => {
    hideCursor();

    // Reset hover state when pointer leaves window
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
  document.addEventListener('pointerleave', onPointerLeaveDoc);
  document.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('pointerup', onPointerUp);

  // Keep state consistent when tab visibility changes
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      hideCursor();
    } else {
      showCursorAt(lastX, lastY);
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Fallbacks for window focus changes
  const onWindowBlur = () => hideCursor();
  const onWindowFocus = () => showCursorAt(lastX, lastY);
  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('focus', onWindowFocus);

  return {
    destroy: () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeaveDoc);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('focus', onWindowFocus);
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
      hoverTimeline.kill();
      clickTimeline.kill();
    },
  };
}
