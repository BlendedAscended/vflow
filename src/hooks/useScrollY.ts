'use client';

import { useEffect } from 'react';

export function useScrollY() {
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}`);
    };

    const handler = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);
}
