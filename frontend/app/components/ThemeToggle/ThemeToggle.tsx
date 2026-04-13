'use client';

import { useTheme } from '@/app/contexts/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className={styles.container}>
      <button
        className={`${styles.toggleBtn} ${theme === 'light' ? styles.active : ''}`}
        onClick={() => setTheme('light')}
        title="Modo Claro"
        aria-label="Ativar modo claro"
      >
        <Sun size={16} />
      </button>
      <button
        className={`${styles.toggleBtn} ${theme === 'dark' ? styles.active : ''}`}
        onClick={() => setTheme('dark')}
        title="Modo Escuro"
        aria-label="Ativar modo escuro"
      >
        <Moon size={16} />
      </button>
      <button
        className={`${styles.toggleBtn} ${theme === 'system' ? styles.active : ''}`}
        onClick={() => setTheme('system')}
        title="Usar preferência do sistema"
        aria-label="Usar preferência do sistema"
      >
        <Monitor size={16} />
      </button>
    </div>
  );
}

export function ThemeToggleSimple() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.simpleToggle}
      onClick={toggleTheme}
      title={resolvedTheme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      aria-label={resolvedTheme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
