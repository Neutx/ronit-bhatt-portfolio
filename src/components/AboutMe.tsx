'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { FaInstagram, FaEnvelope, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import MenuPopup from './MenuPopup';
import { CardContainer, CardItem } from './ui/3d-card';
import { useNavigationStore } from '@/src/store/navigationStore';

const AboutMe = () => {
  const setView = useNavigationStore((state: { setView: (view: 'home' | 'about' | 'commercial' | 'brands' | 'creative-process') => void }) => state.setView);
  const goBack = useNavigationStore((state: { goBack: () => void }) => state.goBack);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Use about_me.webm as background video
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
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 sm:px-8 pt-16 sm:pt-14 pb-6">
        <button 
          onClick={goBack}
          className="text-white uppercase tracking-wider text-sm sm:text-base hover:text-gray-300 transition-colors"
        >
          BACK
        </button>
        <button 
          onClick={() => setView('creative-process')}
          className="px-6 py-3 rounded-full border border-gray-400 bg-transparent backdrop-blur-md text-white uppercase tracking-wider text-sm sm:text-base hover:bg-white/5 hover:border-gray-300 transition-all duration-200"
        >
          CREATIVE PROCESS
        </button>
      </div>

      {/* EXPLORE and THE REAL CINEMA Text at Top */}
      <div className="fixed top-16 sm:top-14 left-1/2 z-50 -translate-x-1/2 px-4 pointer-events-none">
        <div className="flex flex-col items-center">
          <p className="text-gray-400 uppercase tracking-[0.2em] text-sm text-center mb-1 font-san-francisco">
            EXPLORE
          </p>
          <h1 className="text-white uppercase tracking-[0.1em] text-[2.34375rem] font-bold text-center font-inter">
            The Real Cinema
          </h1>
        </div>
      </div>

      {/* Main Content - Image and Text */}
      <div className="fixed inset-0 flex items-center justify-center z-30 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 lg:gap-16 max-w-7xl w-full"
        >
          {/* About Me Image - Left Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <CardContainer className="w-auto h-auto" intensity={3}>
              <CardItem translateZ={20} as="div">
                <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] overflow-hidden rounded-md">
                  <Image
                    src="/images/about_me.webp"
                    alt="About Me"
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 350px, (max-width: 1024px) 400px, 450px"
                    priority
                  />
                </div>
              </CardItem>
            </CardContainer>
          </motion.div>

          {/* Text Content - Right Side */}
          <motion.div
            initial={{ opacity: 0, y: 20, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white text-left flex-1 px-4 sm:px-0"
          >
            {/* Header */}
            <h2 className="text-white uppercase tracking-wider text-base sm:text-lg md:text-xl lg:text-2xl font-san-francisco mb-6 whitespace-pre-line">
              FILM DIRECTOR | CINEMATOGRAPHER{'\n'}
              EDITOR | WRITER
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-san-francisco whitespace-pre-line mb-8">
              I&apos;m a 21-year-old filmmaker driven by
              a passion for visual storytelling that
              evokes real emotion. What began as a
              childhood love for the camera has
              evolved into a focused pursuit of
              filmmaking—spanning photography,
              cinematography, concept
              development, writing, and direction. I
              specialize in narrative, documentary,
              and branded content, bringing depth
              and intention to every frame. My
              process is rooted in close
              collaboration, transforming brand
              messages and human stories into
              powerful, cinematic experiences.
            </p>
            
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-6 flex-wrap"
            >
              {/* Instagram */}
              <a
                href="https://www.instagram.com/itsronittt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:text-gray-300 hover:border-white transition-all duration-200"
                aria-label="Instagram"
              >
                <FaInstagram className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              
              {/* Email */}
              <a
                href="mailto:bhattronit751@gamil.com"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:text-gray-300 hover:border-white transition-all duration-200"
                aria-label="Email"
              >
                <FaEnvelope className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@RONITBHATT"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:text-gray-300 hover:border-white transition-all duration-200"
                aria-label="YouTube"
              >
                <FaYoutube className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              
              {/* X (Twitter) */}
              <a
                href="https://x.com/itsronittt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:text-gray-300 hover:border-white transition-all duration-200"
                aria-label="X (Twitter)"
              >
                <FaXTwitter className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Circular Film Icon Button at Bottom */}
      {!isMenuOpen && (
        <motion.button
          onClick={() => setIsMenuOpen(true)}
          className="fixed bottom-8 sm:bottom-12 z-50 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-transparent backdrop-blur-md border-2 border-gray-400 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:border-white"
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
        currentVideoTitle="About Me"
      />
    </div>
  );
};

export default AboutMe;

