'use client';

import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

interface LoaderContextType {
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Stable value: consumers only re-render when isLoaded actually changes
  const value = useMemo(() => ({ isLoaded, setIsLoaded }), [isLoaded]);

  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>;
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within LoaderProvider');
  }
  return context;
};
