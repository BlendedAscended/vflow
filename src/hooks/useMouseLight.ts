'use client';

import { useEffect } from 'react';

export function useMouseLight() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const tile = target?.closest<HTMLElement>('.mouse-light');
      if (!tile) return;

      const rect = tile.getBoundingClientRect();
      tile.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
      tile.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    };

    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);
}
