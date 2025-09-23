"use client";

import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      let nextIsDark = false;
      if (stored === 'dark') nextIsDark = true;
      if (!stored) {
        nextIsDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      setIsDark(nextIsDark);
      const root = document.documentElement;
      root.classList.remove('theme-light', 'theme-dark');
      root.classList.add(`theme-${nextIsDark ? 'dark' : 'light'}`);
    } catch {}
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${nextIsDark ? 'dark' : 'light'}`);
    try { localStorage.setItem('theme', nextIsDark ? 'dark' : 'light'); } catch {}
  };

  return (
    <button
      aria-label="Toggle theme"
      aria-pressed={isDark}
      onClick={toggleTheme}
      className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--card-background)] hover:bg-[var(--card-background)] transition-colors shadow fixed right-6 top-20 z-40"
    >
      {isDark ? (
        <svg className="h-5 w-5 text-[var(--text-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeWidth="1.5"/>
        </svg>
      ) : (
        <svg className="h-5 w-5 text-[var(--text-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="4" strokeWidth="1.5"/>
          <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364l-1.414 1.414M8.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M8.05 7.05L6.636 5.636" strokeWidth="1.5"/>
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;