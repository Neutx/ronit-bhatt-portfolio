import { useState, useEffect } from 'react';

export const useFontsLoaded = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if ('fonts' in document) {
      // Modern browsers with Font Loading API
      // Wait for all fonts to be ready
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      }).catch(() => {
        // Fallback if font loading fails
        setTimeout(() => setFontsLoaded(true), 1000);
      });
    } else {
      // Fallback for older browsers - wait 1 second
      setTimeout(() => setFontsLoaded(true), 1000);
    }
  }, []);

  return fontsLoaded;
};

