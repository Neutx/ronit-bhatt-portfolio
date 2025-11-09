import { useState, useEffect, useCallback } from 'react';

interface UseCarouselProps {
  itemsCount: number;
  autoPlayDelay?: number;
  enableAutoPlay?: boolean;
}

export const useCarousel = ({
  itemsCount,
  autoPlayDelay = 5000,
  enableAutoPlay = false,
}: UseCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(enableAutoPlay);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === itemsCount - 1 ? 0 : prevIndex + 1
    );
  }, [itemsCount]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? itemsCount - 1 : prevIndex - 1
    );
  }, [itemsCount]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const resumeAutoPlay = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayDelay);

    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, autoPlayDelay]);

  // Keyboard navigation removed - only scroll-based navigation

  return {
    currentIndex,
    goToNext,
    goToPrevious,
    goToSlide,
    pauseAutoPlay,
    resumeAutoPlay,
  };
};

