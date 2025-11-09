'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import gsap from 'gsap';
import { useNavigationStore } from '@/src/store/navigationStore';
import { useLoader } from '@/src/contexts/LoaderContext';
import Carousel from '@/src/components/Carousel';
import AboutMe from '@/src/components/AboutMe';
import CommercialWork from '@/src/components/CommercialWork';
import BrandsPage from '@/src/components/BrandsPage';
import CreativeProcess from '@/src/components/CreativeProcess';

export default function Home() {
  const currentView = useNavigationStore((state) => state.currentView);
  const { isLoaded } = useLoader();
  
  // Ensure main section is always visible and interactive after navigation
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      gsap.set('.page-container', {
        pointerEvents: 'auto',
        visibility: 'visible',
        opacity: 1,
        filter: 'blur(0px)'
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentView, isLoaded]);
  
  return (
    <main 
      className="fixed inset-0 w-screen h-screen bg-black page-container"
      style={{ 
        overflow: 'hidden'
      }}
    >
      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <motion.div 
            key="home" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <Carousel />
          </motion.div>
        ) : currentView === 'about' ? (
          <motion.div 
            key="about" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <AboutMe />
          </motion.div>
        ) : currentView === 'commercial' ? (
          <motion.div 
            key="commercial" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <CommercialWork />
          </motion.div>
        ) : currentView === 'creative-process' ? (
          <motion.div 
            key="creative-process" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <CreativeProcess />
          </motion.div>
        ) : (
          <motion.div 
            key="brands" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <BrandsPage />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

