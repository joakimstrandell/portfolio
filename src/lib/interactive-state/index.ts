/**
 * Interactive Element State Tracker
 *
 * A high-performance vanilla JS singleton that tracks whether the cursor
 * is over an interactive element. Uses a single document-level event listener
 * for optimal performance.
 */
import { isTouchDevice } from '@/lib/utils';

type Subscriber = (isOverInteractive: boolean) => void;

class InteractiveStateManager {
  private isOverInteractive = false;
  private subscribers = new Set<Subscriber>();
  private isInitialized = false;

  // CSS selectors for auto-detection of interactive elements
  private readonly interactiveSelectors = [
    'a',
    'button',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    "[data-cursor='active']",
    '[data-interactive]', // Opt-in data attribute
  ].join(', ');

  /**
   * Checks if an element is interactive
   * Supports both data-interactive attribute and CSS selector auto-detection
   */
  private checkIsInteractive(element: Element | null): boolean {
    if (!element) return false;

    // Check for opt-in data attribute first (fastest)
    if (element.hasAttribute('data-interactive')) {
      return true;
    }

    // Check if element matches any interactive selector
    if (element.matches?.(this.interactiveSelectors)) {
      return true;
    }

    // Check if element is within an interactive parent
    if (element.closest?.(this.interactiveSelectors)) {
      return true;
    }

    return false;
  }

  /**
   * Handles mouse move events and updates state
   */
  private handleMouseMove = (e: MouseEvent) => {
    const target = e.target as Element | null;
    const newState = this.checkIsInteractive(target);

    // Only update and notify if state changed
    if (newState !== this.isOverInteractive) {
      this.isOverInteractive = newState;
      this.notifySubscribers();
    }
  };

  /**
   * Notifies all subscribers of state changes
   */
  private notifySubscribers() {
    this.subscribers.forEach((callback) => {
      callback(this.isOverInteractive);
    });
  }

  /**
   * Initializes the event listener (lazy initialization)
   */
  private initialize() {
    if (this.isInitialized) return;

    // Don't initialize on touch devices
    if (isTouchDevice()) {
      this.isInitialized = true;
      return;
    }

    // Use capture phase for better performance and to catch events early
    document.addEventListener('mousemove', this.handleMouseMove, { passive: true, capture: true });

    // Also check on mouse leave to reset state
    document.addEventListener('mouseleave', () => {
      if (this.isOverInteractive) {
        this.isOverInteractive = false;
        this.notifySubscribers();
      }
    });

    this.isInitialized = true;
  }

  /**
   * Gets the current interactive state
   * @returns true if cursor is over an interactive element
   */
  public getState(): boolean {
    this.initialize();
    return this.isOverInteractive;
  }

  /**
   * Subscribes to state changes
   * @param callback Function called when state changes
   * @returns Unsubscribe function
   */
  public subscribe(callback: Subscriber): () => void {
    this.initialize();
    this.subscribers.add(callback);

    // Immediately call with current state
    callback(this.isOverInteractive);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Unsubscribes from state changes
   * @param callback The callback function to remove
   */
  public unsubscribe(callback: Subscriber): void {
    this.subscribers.delete(callback);
  }

  /**
   * Destroys the manager and cleans up event listeners
   * Useful for testing or cleanup
   */
  public destroy(): void {
    if (!this.isInitialized) return;

    document.removeEventListener('mousemove', this.handleMouseMove, { capture: true });
    this.subscribers.clear();
    this.isOverInteractive = false;
    this.isInitialized = false;
  }
}

// Export singleton instance
export const interactiveState = new InteractiveStateManager();

// Export convenience functions
export const isOverInteractive = () => interactiveState.getState();
export const subscribeToInteractiveState = (callback: Subscriber) => interactiveState.subscribe(callback);
export const unsubscribeFromInteractiveState = (callback: Subscriber) => interactiveState.unsubscribe(callback);
