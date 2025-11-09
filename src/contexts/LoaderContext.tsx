'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoaderContextType {
  loaderProgress: number;
  setLoaderProgress: (progress: number) => void;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <LoaderContext.Provider
      value={{
        loaderProgress,
        setLoaderProgress,
        isLoaded,
        setIsLoaded,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within LoaderProvider');
  }
  return context;
};

