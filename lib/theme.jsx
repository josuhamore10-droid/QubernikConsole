'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', setTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('qubernik:theme');
      if (saved === 'light' || saved === 'dark') setThemeState(saved);
    } catch (e) {
      // localStorage no disponible (SSR o navegador restringido); usamos el default.
    }
    setReady(true);
  }, []);

  function setTheme(next) {
    setThemeState(next);
    try {
      window.localStorage.setItem('qubernik:theme', next);
    } catch (e) {
      // Ignorar si no se puede persistir.
    }
  }

  // Evita un flash con el tema equivocado en el primer render.
  if (!ready) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div style={{ background: theme === 'dark' ? '#0B0C0E' : '#F5F5F3', minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
