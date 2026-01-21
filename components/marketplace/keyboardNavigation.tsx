// src/components/marketplace/keyboardNavigation.tsx
'use client';

import { useEffect } from 'react';

interface KeyboardNavigationProps {
  containerRef: React.RefObject<HTMLElement>;
  items: string[];
  onSelect?: (index: number) => void;
  enabled?: boolean;
}

export default function KeyboardNavigation({ 
  containerRef, 
  items, 
  onSelect,
  enabled = true 
}: KeyboardNavigationProps) {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      
      // Only handle navigation keys
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', ' '].includes(key)) {
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      const currentIndex = Array.from(focusableElements).findIndex(
        element => element === document.activeElement
      );

      let nextIndex = -1;

      switch (key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = focusableElements.length - 1;
          break;
        case 'Enter':
        case ' ':
          if (currentIndex >= 0 && onSelect) {
            event.preventDefault();
            onSelect(currentIndex);
          }
          return;
        default:
          return;
      }

      if (nextIndex >= 0 && focusableElements[nextIndex]) {
        focusableElements[nextIndex].focus();
      }
    };

    const container = containerRef.current;
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, items, onSelect, enabled]);

  return null;
}

// Hook for skip links
export const useSkipLinks = () => {
  useEffect(() => {
    // Add skip links for keyboard navigation
    const skipLinks = [
      { href: '#main-content', text: 'Skip to main content' },
      { href: '#navigation', text: 'Skip to navigation' },
      { href: '#search', text: 'Skip to search' },
      { href: '#footer', text: 'Skip to footer' }
    ];

    // Create skip links container
    const skipLinksContainer = document.createElement('div');
    skipLinksContainer.className = 'sr-only focus-within:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white p-2 rounded shadow-lg';
    
    skipLinks.forEach(link => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.text;
      a.className = 'block px-3 py-2 text-blue-600 hover:bg-blue-50 rounded';
      skipLinksContainer.appendChild(a);
    });

    document.body.insertBefore(skipLinksContainer, document.body.firstChild);

    return () => {
      if (document.body.contains(skipLinksContainer)) {
        document.body.removeChild(skipLinksContainer);
      }
    };
  }, []);
};

// Focus management hook
export const useFocusManagement = (isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen) return;

    // Store the element that had focus before modal opened
    const previousFocus = document.activeElement as HTMLElement;

    // Find all focusable elements within the modal
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length > 0) {
      // Focus first element
      focusableElements[0].focus();
    }

    // Trap focus within modal
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Close modal logic would go here
        previousFocus?.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
      previousFocus?.focus();
    };
  }, [isOpen]);
};
