// app/components/ThemeToggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors border border-gray-200 dark:border-gray-700 group"
      aria-label={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-600 group-hover:text-amber-600 transition-colors" />
      ) : (
        <Sun className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors" />
      )}
    </button>
  );
}