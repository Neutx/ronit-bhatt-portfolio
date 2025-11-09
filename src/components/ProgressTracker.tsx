'use client';

import { useEffect } from 'react';
import { useLoader } from '@/src/contexts/LoaderContext';

/**
 * ProgressTracker component that simulates loading progress
 * Updates loaderProgress from 0 to 1 over a specified duration
 */
export default function ProgressTracker() {
  const { setLoaderProgress, isLoaded } = useLoader();

  useEffect(() => {
    // Don't track progress if already loaded
    if (isLoaded) {
      return;
    }

    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const interval = 16; // ~60fps updates

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setLoaderProgress(progress);

      if (progress < 1 && !isLoaded) {
        setTimeout(updateProgress, interval);
      } else {
        // Ensure we end at exactly 1
        setLoaderProgress(1);
      }
    };

    // Start progress tracking
    updateProgress();
  }, [setLoaderProgress, isLoaded]);

  return null;
}

