'use client';

import { motion } from 'framer-motion';
import { UtopiaItem } from '@/src/data/utopiaContent';

interface CarouselItemProps {
  item: UtopiaItem;
  isActive: boolean;
  onClick: () => void;
  direction?: 'left' | 'right';
  isPreview?: boolean;
}

const CarouselItem = ({ item, isActive, onClick, direction = 'right', isPreview = false }: CarouselItemProps) => {
  // Extract the main identifier from title (e.g., "4X4" from "4X4 Video")
  const titleId = item.title.split(' ')[0];

  // Animation variants based on direction
  const slideVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -300 : 300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  // For preview cards, don't animate, just show
  if (isPreview) {
    return (
      <div className="relative w-full aspect-square max-w-[300px] sm:max-w-[350px] md:max-w-[400px]">
        <div className="relative w-full h-full bg-gray-800 border-2 border-gray-600 overflow-hidden shadow-2xl">
          {/* Background Image/Thumbnail */}
          {item.thumbnail && (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Embossed Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="text-white font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider"
              style={{
                textShadow: `
                  -1px -1px 0 rgba(0,0,0,0.8),
                  1px 1px 0 rgba(255,255,255,0.1),
                  -2px -2px 4px rgba(0,0,0,0.9),
                  2px 2px 4px rgba(0,0,0,0.5)
                `,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              {titleId}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative w-full aspect-square max-w-[400px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px] cursor-pointer"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      }}
      onClick={onClick}
    >
      {/* Square Thumbnail Container */}
      <div className="relative w-full h-full bg-gray-800 border-2 border-gray-600 overflow-hidden shadow-2xl">
        {/* Background Image/Thumbnail */}
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}

        {/* Dark overlay for texture effect */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Embossed/Carved Logo Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Embossed text effect using text-shadow and filters */}
            <div
              className="text-white font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider"
              style={{
                textShadow: `
                  -1px -1px 0 rgba(0,0,0,0.8),
                  1px 1px 0 rgba(255,255,255,0.1),
                  -2px -2px 4px rgba(0,0,0,0.9),
                  2px 2px 4px rgba(0,0,0,0.5)
                `,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              {titleId}
            </div>
          </motion.div>
        </div>

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 70% 70%, rgba(0,0,0,0.3) 0%, transparent 50%)`,
        }} />

        {/* Hover effect overlay */}
        <motion.div
          className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors duration-300"
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        />
      </div>
    </motion.div>
  );
};

export default CarouselItem;
