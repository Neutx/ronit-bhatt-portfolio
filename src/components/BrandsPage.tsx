'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import MenuPopup from './MenuPopup';
import { useNavigationStore } from '@/src/store/navigationStore';
import { topRowLogos, bottomRowLogos } from '@/src/data/brandLogos';

const BrandsPage = () => {
  const setView = useNavigationStore((state: { setView: (view: 'home' | 'about' | 'commercial' | 'brands' | 'creative-process') => void }) => state.setView);
  const goBack = useNavigationStore((state: { goBack: () => void }) => state.goBack);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTopHovered, setIsTopHovered] = useState(false);
  const [isBottomHovered, setIsBottomHovered] = useState(false);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const topAnimationRef = useRef<number | null>(null);
  const bottomAnimationRef = useRef<number | null>(null);
  const topPositionRef = useRef(0);
  const bottomPositionRef = useRef(-50); // Start at -50% for bottom row (opposite direction)
  
  // Use about_me.webm as background video (blurred)
  const backgroundVideoUrl = '/videos/about_me.webm';

  // Handle background video playback
  useEffect(() => {
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.src = backgroundVideoUrl;
      backgroundVideoRef.current.play().catch(() => {
        // Autoplay may fail, that's okay
      });
    }
  }, [backgroundVideoUrl]);


  // Handle back navigation
  const handleBack = () => {
    goBack();
  };

  // Duplicate logos for seamless infinite scroll
  const duplicatedTopLogos = [...topRowLogos, ...topRowLogos];
  const duplicatedBottomLogos = [...bottomRowLogos, ...bottomRowLogos];

  // Continuous animation for infinite scroll using requestAnimationFrame
  useEffect(() => {
    let lastTime = performance.now();
    const targetDuration = 35000; // 35 seconds for full cycle (matching original)
    const totalDistance = 50; // 50% of width
    const speed = totalDistance / targetDuration; // % per millisecond
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      if (!isTopHovered && topRowRef.current) {
        topPositionRef.current -= speed * deltaTime;
        // Reset to exactly 0% when crossing -50% threshold to continue seamlessly
        // Since content is duplicated, this creates a perfect loop without visible jump
        if (topPositionRef.current <= -50) {
          topPositionRef.current = 0;
        }
        topRowRef.current.style.transform = `translateX(${topPositionRef.current}%)`;
      }
      
      if (!isBottomHovered && bottomRowRef.current) {
        bottomPositionRef.current += speed * deltaTime; // Move in opposite direction
        // Reset to exactly -50% when crossing 0% threshold to continue seamlessly
        // Since content is duplicated, this creates a perfect loop without visible jump
        if (bottomPositionRef.current >= 0) {
          bottomPositionRef.current = -50;
        }
        bottomRowRef.current.style.transform = `translateX(${bottomPositionRef.current}%)`;
      }
      
      topAnimationRef.current = requestAnimationFrame(animate);
    };
    
    topAnimationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (topAnimationRef.current) {
        cancelAnimationFrame(topAnimationRef.current);
      }
    };
  }, [isTopHovered, isBottomHovered]);

  return (
    <div
      className="relative w-full h-full"
      style={{ overflow: 'visible' }}
    >
      {/* Background Video with Blur */}
      <motion.video
        ref={backgroundVideoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
        animate={{
          scale: 1.1,
        }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
      />

      {/* Dark overlay */}
      <motion.div
        className="absolute inset-0 bg-black/40"
      />

      {/* Top Navigation - BACK and CREATIVE PROCESS */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 sm:px-8 pt-[max(1rem,env(safe-area-inset-top))] lg:pt-14 pb-6">
        <button 
          onClick={handleBack}
          className="inline-flex items-center min-h-[48px] min-w-[48px] -ml-3 px-3 text-white uppercase tracking-wider text-sm sm:text-base hover:text-gray-300 transition-colors"
        >
          BACK
        </button>
        <button 
          onClick={() => {
            const setView = useNavigationStore.getState().setView;
            setView('creative-process');
          }}
          className="px-4 py-3 min-h-[48px] sm:px-6 rounded-full border border-gray-400 bg-transparent backdrop-blur-md text-white uppercase tracking-wider text-xs sm:text-sm lg:text-base hover:bg-white/5 hover:border-gray-300 transition-all duration-200"
        >
          CREATIVE PROCESS
        </button>
      </div>

      {/* EXPLORE and THE REAL CINEMA Text at Top */}
      <div className="fixed inset-x-0 top-[5.5rem] lg:top-14 [@media(max-height:500px)]:top-3 z-50 flex flex-col items-center px-4 pointer-events-none">
        <div className="flex flex-col items-center">
          <p className="text-gray-400 uppercase tracking-[0.2em] text-sm text-center mb-1 font-san-francisco">
            EXPLORE
          </p>
          <h1 className="text-white uppercase tracking-[0.1em] text-[1.5rem] min-[400px]:text-[1.875rem] sm:text-[clamp(1.75rem,3.6vw,2.34375rem)] lg:text-[2.34375rem] sm:whitespace-nowrap [@media(max-height:500px)]:text-xl font-bold text-center font-inter">
            The Real Cinema
          </h1>
        </div>
      </div>

      {/* Main Content - Two Scrolling Rows of Logos */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-30 px-4 overflow-hidden [@media(max-height:500px)]:pt-16 [@media(max-height:500px)]:pb-[60px]">
        {/* Top Row - Scrolls Left to Right (moves left) */}
        <div 
          className="w-full overflow-hidden mb-8 [@media(max-height:799px)]:mb-3"
          onMouseEnter={() => setIsTopHovered(true)}
          onMouseLeave={() => setIsTopHovered(false)}
        >
          <div
            ref={topRowRef}
            className="flex gap-6"
            style={{ 
              width: '200%',
              transform: `translateX(${topPositionRef.current}%)`,
              transition: isTopHovered ? 'transform 0.3s ease-out' : 'none',
            }}
          >
            {duplicatedTopLogos.map((logo, index) => (
              <motion.div
                key={`top-${logo.id}-${index}`}
                className="flex-shrink-0"
                whileHover={{}}
              >
                <div className="w-[320px] h-[240px] [@media(min-height:501px)_and_(max-height:799px)]:h-[min(240px,24svh)] [@media(min-height:501px)_and_(max-height:799px)]:w-[calc(min(240px,24svh)*4/3)] [@media(max-height:500px)]:h-[min(120px,30svh)] [@media(max-height:500px)]:w-[calc(min(120px,30svh)*3/2)] [@media(max-height:500px)]:p-4 rounded-lg border border-gray-300/30 bg-black flex items-center justify-center p-6 overflow-hidden group cursor-pointer shadow-md">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={logo.imagePath}
                      alt={logo.name}
                      fill
                      unoptimized
                      className="object-contain transition-all duration-300"
                      sizes="320px"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Row - Scrolls Right to Left (moves right) */}
        <div 
          className="w-full overflow-hidden"
          onMouseEnter={() => setIsBottomHovered(true)}
          onMouseLeave={() => setIsBottomHovered(false)}
        >
          <div
            ref={bottomRowRef}
            className="flex gap-6"
            style={{ 
              width: '200%',
              transform: `translateX(${bottomPositionRef.current}%)`,
              transition: isBottomHovered ? 'transform 0.3s ease-out' : 'none',
            }}
          >
            {duplicatedBottomLogos.map((logo, index) => (
              <motion.div
                key={`bottom-${logo.id}-${index}`}
                className="flex-shrink-0"
                whileHover={{}}
              >
                <div className="w-[320px] h-[240px] [@media(min-height:501px)_and_(max-height:799px)]:h-[min(240px,24svh)] [@media(min-height:501px)_and_(max-height:799px)]:w-[calc(min(240px,24svh)*4/3)] [@media(max-height:500px)]:h-[min(120px,30svh)] [@media(max-height:500px)]:w-[calc(min(120px,30svh)*3/2)] [@media(max-height:500px)]:p-4 rounded-lg border border-gray-300/30 bg-black flex items-center justify-center p-6 overflow-hidden group cursor-pointer shadow-md">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={logo.imagePath}
                      alt={logo.name}
                      fill
                      unoptimized
                      className="object-contain transition-all duration-300"
                      sizes="320px"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Circular Film Icon Button at Bottom */}
      {!isMenuOpen && (
        <motion.button
          onClick={() => setIsMenuOpen(true)}
          className="fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] sm:bottom-[calc(3rem+env(safe-area-inset-bottom))] [@media(max-height:500px)]:bottom-3 z-50 w-16 h-16 sm:w-20 sm:h-20 [@media(max-height:500px)]:w-12 [@media(max-height:500px)]:h-12 rounded-full bg-transparent backdrop-blur-md border-2 border-gray-400 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:border-white"
          style={{ 
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
          whileHover={{
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.6)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
          transition={{
            duration: 0.3,
          }}
          aria-label="Menu Button"
        >
          <div className="orb-dot" />
        </motion.button>
      )}

      {/* Menu Popup */}
      <MenuPopup
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentVideoTitle="Brands I've Worked With"
      />
    </div>
  );
};

export default BrandsPage;

