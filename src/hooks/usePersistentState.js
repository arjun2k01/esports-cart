import { useState, useEffect } from 'react';

export function usePersistentState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const localValue = localStorage.getItem(key);
      return localValue ? JSON.parse(localValue) : defaultValue;
    } catch (error) {
      console.error(`Error parsing localStorage key “${key}”:`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}