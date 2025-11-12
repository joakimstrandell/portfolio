'use client';

import { useSyncExternalStore } from 'react';
import { interactiveState } from '@/lib/interactive-state';

/**
 * React hook that subscribes to interactive element state changes
 * Uses useSyncExternalStore for optimal React integration
 *
 * @returns true if cursor is currently over an interactive element
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isOverInteractive = useInteractiveState();
 *
 *   return (
 *     <div>
 *       {isOverInteractive ? 'Over interactive' : 'Not over interactive'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useInteractiveState(): boolean {
  return useSyncExternalStore(
    // subscribe function
    (callback) => interactiveState.subscribe(callback),
    // getSnapshot function (client-side)
    () => interactiveState.getState(),
    // getServerSnapshot function (server-side, always false)
    () => false,
  );
}
