'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Constants
const CURSOR_OFFSET = 2;
const ACTIVATE_SCALE = 10;
const ACTIVATE_DURATION = 0.25;
const EASING = 'power3.out';
const INTERACTIVE_SELECTORS = "a, button, [data-cursor='active']";

// Types
interface CursorPosition {
  x: number;
  y: number;
}

// Custom hook for cursor positioning logic
function useCursorPosition() {
  const pos = useRef<CursorPosition>({ x: 0, y: 0 });
  const isFirstMove = useRef(true);
  const isVisible = useRef(true);

  const handleMove = (e: MouseEvent) => {
    const state = pos.current;

    state.x = e.clientX;
    state.y = e.clientY;

    // First mouse move or re-entering after leaving
    if (isFirstMove.current || !isVisible.current) {
      isFirstMove.current = false;
      isVisible.current = true;
      return { isFirstMove: true, x: state.x, y: state.y };
    }

    // Subsequent moves
    return { isFirstMove: false, x: state.x, y: state.y };
  };

  const handleLeave = () => {
    isVisible.current = false;
  };

  const handleEnter = () => {
    isVisible.current = true;
  };

  return { handleMove, handleLeave, handleEnter, isVisible, pos };
}

// Custom hook for cursor animations
function useCursorAnimations(elementRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Hide cursor initially
    gsap.set(el, { opacity: 0 });
  }, [elementRef]);

  const animateToPosition = (x: number, y: number, isFirstMove: boolean) => {
    const el = elementRef.current;
    if (!el) return;

    if (isFirstMove) {
      // First move - show cursor at actual position
      gsap.set(el, {
        x: x - CURSOR_OFFSET,
        y: y - CURSOR_OFFSET,
        opacity: 1,
      });
    } else {
      // Subsequent moves - instant follow
      gsap.to(el, {
        x: x - CURSOR_OFFSET,
        y: y - CURSOR_OFFSET,
        duration: 0,
        ease: EASING,
      });
    }
  };

  const hideCursor = () => {
    const el = elementRef.current;
    if (!el) return;
    gsap.to(el, { opacity: 0, duration: 0.2 });
  };

  const showCursor = (x: number, y: number) => {
    const el = elementRef.current;
    if (!el) return;
    gsap.set(el, {
      x: x - CURSOR_OFFSET,
      y: y - CURSOR_OFFSET,
      opacity: 1,
    });
  };

  return { animateToPosition, hideCursor, showCursor };
}

// Custom hook for mouse tracking and animation
function useCursorTracking(
  handleMove: (e: MouseEvent) => { isFirstMove: boolean; x: number; y: number },
  animateToPosition: (x: number, y: number, isFirstMove: boolean) => void,
  handleLeave: () => void,
  handleEnter: () => void,
  hideCursor: () => void,
  showCursor: (x: number, y: number) => void,
  pos: React.RefObject<CursorPosition>,
) {
  useEffect(() => {
    const moveHandler = (e: MouseEvent) => {
      const { isFirstMove, x, y } = handleMove(e);
      animateToPosition(x, y, isFirstMove);
    };

    const leaveHandler = () => {
      handleLeave();
      hideCursor();
    };

    const enterHandler = () => {
      handleEnter();
      // Show cursor at the stored position
      if (pos.current) {
        showCursor(pos.current.x, pos.current.y);
      }
    };

    window.addEventListener('pointermove', moveHandler);
    document.addEventListener('mouseleave', leaveHandler);
    document.addEventListener('mouseenter', enterHandler);

    return () => {
      window.removeEventListener('pointermove', moveHandler);
      document.removeEventListener('mouseleave', leaveHandler);
      document.removeEventListener('mouseenter', enterHandler);
    };
  }, [handleMove, animateToPosition, handleLeave, handleEnter, hideCursor, showCursor, pos]);
}

// Custom hook for hover/focus interactions
function useCursorInteractions(elementRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Create a timeline for smooth animation control
    const tl = gsap.timeline({ paused: true });

    // Set up the animation timeline
    tl.to(el, {
      scale: ACTIVATE_SCALE,
      backgroundColor: 'var(--accent)',
      duration: ACTIVATE_DURATION,
      ease: EASING,
    });

    // Morph shape on interactive hover
    const activate = () => {
      tl.play();
    };

    const deactivate = () => {
      tl.reverse();
    };

    // Function to attach event listeners to elements
    const attachListeners = (target: Element) => {
      target.addEventListener('mouseenter', activate);
      target.addEventListener('mouseleave', deactivate);
      target.addEventListener('focus', activate);
      target.addEventListener('blur', deactivate);
    };

    // Function to remove event listeners from elements
    const removeListeners = (target: Element) => {
      target.removeEventListener('mouseenter', activate);
      target.removeEventListener('mouseleave', deactivate);
      target.removeEventListener('focus', activate);
      target.removeEventListener('blur', deactivate);
    };

    // Track elements that already have listeners attached
    const attachedElements = new Set<Element>();

    // Function to safely attach listeners (avoid duplicates)
    const safeAttachListeners = (target: Element) => {
      if (!attachedElements.has(target)) {
        attachListeners(target);
        attachedElements.add(target);
      }
    };

    // Function to safely remove listeners
    const safeRemoveListeners = (target: Element) => {
      if (attachedElements.has(target)) {
        removeListeners(target);
        attachedElements.delete(target);
      }
    };

    // Initially attach listeners to existing elements
    const initialTargets = document.querySelectorAll(INTERACTIVE_SELECTORS);
    initialTargets.forEach(safeAttachListeners);

    // Set up MutationObserver to watch for new interactive elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Handle added nodes
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;

            // Check if the added element itself matches our selectors
            if (element.matches && element.matches(INTERACTIVE_SELECTORS)) {
              safeAttachListeners(element);
            }

            // Check for interactive elements within the added node
            const interactiveChildren = element.querySelectorAll?.(INTERACTIVE_SELECTORS);
            interactiveChildren?.forEach(safeAttachListeners);
          }
        });

        // Handle removed nodes
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;

            // Remove listeners from the removed element
            if (element.matches && element.matches(INTERACTIVE_SELECTORS)) {
              safeRemoveListeners(element);
            }

            // Remove listeners from interactive children
            const interactiveChildren = element.querySelectorAll?.(INTERACTIVE_SELECTORS);
            interactiveChildren?.forEach(safeRemoveListeners);
          }
        });
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      // Clean up initial targets
      initialTargets.forEach(safeRemoveListeners);

      // Stop observing
      observer.disconnect();
    };
  }, [elementRef]);
}

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const { handleMove, handleLeave, handleEnter, pos } = useCursorPosition();
  const { animateToPosition, hideCursor, showCursor } = useCursorAnimations(ref);

  useCursorTracking(handleMove, animateToPosition, handleLeave, handleEnter, hideCursor, showCursor, pos);
  useCursorInteractions(ref);

  return (
    <div
      ref={ref}
      className="bg-accent pointer-events-none fixed top-0 left-0 z-[9999] h-1 w-1 rounded-full opacity-0 mix-blend-difference"
    />
  );
}
