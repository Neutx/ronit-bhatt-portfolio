'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '@/src/store/navigationStore';

interface MenuPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentVideoTitle?: string;
}

const MenuPopup = ({ isOpen, onClose, currentVideoTitle = '4X4 VIDEO' }: MenuPopupProps) => {
  const setView = useNavigationStore((state: { setView: (view: 'home' | 'about' | 'commercial' | 'brands') => void }) => state.setView);
  
  const menuItems = [
    { label: 'ABOUT ME', href: '/about-me' },
    { label: 'FILMS', href: '/' },
    { label: 'COMMERCIAL WORK', href: '/commercial-work' },
    { label: "BRANDS I've Worked WITH", href: '#brands' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.3, ease: 'easeIn' } }}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center"
          onClick={onClose}
        >
          {/* Header - Positioned exactly where homepage text is (fixed to viewport) */}
          <div className="fixed top-20 left-0 right-0 z-50 flex flex-col items-center px-4 pointer-events-none">
            <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px] sm:text-xs text-center mb-2 font-san-francisco">
              EXPLORE
            </p>
            <h2 className="text-white uppercase tracking-[0.1em] text-[1.5625rem] sm:text-[1.875rem] lg:text-[2.34375rem] font-bold text-center font-inter">
              The Real Cinema
            </h2>
          </div>

          {/* Close Button - Positioned exactly where RB button is */}
          <motion.button
            variants={{
              hidden: { opacity: 0, filter: 'blur(10px)' },
              visible: { 
                opacity: 1,
                filter: 'blur(0px)',
                transition: { delay: 0.3, duration: 0.25, ease: 'easeOut' }
              },
              exit: { 
                opacity: 0, 
                filter: 'blur(10px)',
                transition: { delay: 0, duration: 0.2, ease: 'easeIn' }
              }
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-transparent backdrop-blur-md border-2 border-gray-400 text-gray-400 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:border-white hover:text-white transition-all duration-300 flex items-center justify-center"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ 
                display: 'block',
                margin: '0 auto',
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
          <motion.div
            className="relative w-full max-w-md px-8 py-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Buttons */}
            <div className="space-y-20 mb-6 flex flex-col items-center">
              <AnimatePresence>
                {isOpen && menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ y: 800 }}
                    animate={{ 
                      y: 0,
                      transition: { 
                        delay: index * 0.05 + 0.2, 
                        duration: 0.0,
                        ease: [0.4, 0, 0.2, 1] 
                      }
                    }}
                    exit={{ 
                      y: 800,
                      transition: { 
                        delay: (menuItems.length - 1 - index) * 0.05,
                        duration: 0.1, 
                        ease: [0.4, 0, 0.2, 1] 
                      }
                    }}
                    className="relative w-3/5 py-2.5 px-3.5 text-white text-center text-xs font-light font-san-francisco uppercase tracking-wider overflow-hidden"
                    style={{
                      borderRadius: '150px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(0, 0, 0, 0.2)',
                      backdropFilter: 'blur(1px)',
                      WebkitBackdropFilter: 'blur(1px)',
                      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
                      filter: 'brightness(1.05) contrast(1) saturate(1.1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    whileHover={{
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(2px)',
                      boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.35), 0 0 20px rgba(255, 255, 255, 0.1)',
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    onClick={() => {
                      onClose();
                      if (item.href === '/about-me') {
                        setView('about');
                      } else if (item.href === '/commercial-work') {
                        setView('commercial');
                      } else if (item.href === '/') {
                        setView('home');
                      } else if (item.href === '#brands') {
                        setView('brands');
                      }
                    }}
                  >
                    {/* Inner highlight for liquid glass effect */}
                    <div 
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%)',
                        mixBlendMode: 'overlay',
                      }}
                    />
                    <span className="relative z-10">{item.label}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            {/* Side Labels */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.2, duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                },
                exit: { 
                  opacity: 0, 
                  x: 50,
                  transition: { delay: 0, duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                }
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-[20%] top-1/2 -translate-y-1/2 z-50 group"
            >
              <a
                href="mailto:bhattronit751@gamil.com"
                onClick={(e) => e.stopPropagation()}
                className="text-gray-400 group-hover:text-gray-200 text-sm uppercase tracking-wider font-space-grotesk whitespace-nowrap transition-colors duration-200 cursor-pointer"
              >
                EMAIL
              </a>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.2, duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                },
                exit: { 
                  opacity: 0, 
                  x: -50,
                  transition: { delay: 0, duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                }
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-[20%] top-1/2 -translate-y-1/2 z-50 group"
            >
              <a
                href="https://wa.me/916351260485"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-gray-400 group-hover:text-gray-200 text-sm uppercase tracking-wider font-space-grotesk whitespace-nowrap transition-colors duration-200 cursor-pointer"
              >
                TEXT
              </a>
            </motion.div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuPopup;

