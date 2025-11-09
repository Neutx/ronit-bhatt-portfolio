'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCarousel } from '@/src/hooks/useCarousel';
import { usePreloadMedia } from '@/src/hooks/usePreloadMedia';
import { commercialContent } from '@/src/data/commercialContent';
import VideoPlayer from './VideoPlayer';
import MenuPopup from './MenuPopup';
import { CardContainer, CardItem } from './ui/3d-card';
import { EncryptedText } from './ui/encrypted-text';
import { useNavigationStore } from '@/src/store/navigationStore';

const CommercialWork = () => {
  const { currentIndex, goToNext, goToPrevious } =
    useCarousel({
      itemsCount: commercialContent.length,
      autoPlayDelay: 5000,
      enableAutoPlay: false,
    });

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedYoutubeUrl, setSelectedYoutubeUrl] = useState<string | null>(null);
  const [selectedInstagramUrl, setSelectedInstagramUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'left' | 'right'>('right');
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0); // 0 or 1 for crossfade
  const backgroundVideoRef1 = useRef<HTMLVideoElement>(null);
  const backgroundVideoRef2 = useRef<HTMLVideoElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);
  const scrollAccumulatorRef = useRef(0);

  const currentItem = commercialContent[currentIndex];
  const prevIndex = currentIndex === 0 ? commercialContent.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === commercialContent.length - 1 ? 0 : currentIndex + 1;
  const prevItem = commercialContent[prevIndex];
  const nextItem = commercialContent[nextIndex];

  // Preload adjacent carousel items to prevent black screens
  usePreloadMedia({
    items: commercialContent,
    currentIndex,
    preloadRange: 1, // Preload previous and next items
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load Instagram embed script when Instagram URL is selected
  useEffect(() => {
    if (selectedInstagramUrl) {
      // Check if Instagram embed script is already loaded
      if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
          // Cleanup: remove script when component unmounts or Instagram URL changes
          const instagramScript = document.querySelector('script[src*="instagram.com/embed.js"]');
          if (instagramScript) {
            document.body.removeChild(instagramScript);
          }
        };
      }
    }
  }, [selectedInstagramUrl]);

  // Handle background video playback with crossfade transition
  useEffect(() => {
    const videoUrl = currentItem.backgroundVideoUrl || currentItem.videoUrl;
    if (!videoUrl) return;

    const currentVideoRef = activeVideoIndex === 0 ? backgroundVideoRef1 : backgroundVideoRef2;
    const nextVideoRef = activeVideoIndex === 0 ? backgroundVideoRef2 : backgroundVideoRef1;
    
    // Get current video source filename for comparison
    const getVideoFilename = (src: string) => {
      if (!src) return '';
      const parts = src.split('/');
      return parts[parts.length - 1];
    };
    
    const currentSrc = currentVideoRef.current?.src || currentVideoRef.current?.currentSrc || '';
    const currentFilename = getVideoFilename(currentSrc);
    const targetFilename = getVideoFilename(videoUrl);
    const needsNewVideo = !currentSrc || currentFilename !== targetFilename;
    
    if (needsNewVideo) {
      // First time loading or video changed
      if (!currentSrc && currentVideoRef.current) {
        // Initial load - load into current video
        setIsVideoLoading(true);
        currentVideoRef.current.src = videoUrl;
        currentVideoRef.current.load(); // Explicitly load the video
        
        const handleCanPlay = () => {
          setIsVideoLoading(false);
          const playPromise = currentVideoRef.current?.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              // Video started playing successfully
            }).catch(() => {
              // Autoplay may fail, that's okay
            });
          }
        };
        
        const handleLoadedData = () => {
          // Try to play when data is loaded
          currentVideoRef.current?.play().catch(() => {});
        };
        
        const handleError = () => {
          setIsVideoLoading(false);
        };
        
        currentVideoRef.current.addEventListener('canplay', handleCanPlay, { once: true });
        currentVideoRef.current.addEventListener('loadeddata', handleLoadedData, { once: true });
        currentVideoRef.current.addEventListener('error', handleError, { once: true });
        
        return () => {
          if (currentVideoRef.current) {
            currentVideoRef.current.removeEventListener('canplay', handleCanPlay);
            currentVideoRef.current.removeEventListener('loadeddata', handleLoadedData);
            currentVideoRef.current.removeEventListener('error', handleError);
          }
        };
      } else if (currentSrc && nextVideoRef.current) {
        // Video changed - load into next video for crossfade
        setIsVideoLoading(true);
        nextVideoRef.current.src = videoUrl;
        nextVideoRef.current.load(); // Explicitly load the video
        
        const handleCanPlay = () => {
          setIsVideoLoading(false);
          // Start playing the new video
          const playPromise = nextVideoRef.current?.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              // Video started playing successfully
            }).catch(() => {
              // Autoplay may fail, that's okay
            });
          }
          // Switch active video after a brief moment for smooth crossfade
          setTimeout(() => {
            setActiveVideoIndex(activeVideoIndex === 0 ? 1 : 0);
          }, 100);
        };
        
        const handleLoadedData = () => {
          // Try to play when data is loaded
          nextVideoRef.current?.play().catch(() => {});
        };
        
        const handleError = () => {
          setIsVideoLoading(false);
        };
        
        nextVideoRef.current.addEventListener('canplay', handleCanPlay, { once: true });
        nextVideoRef.current.addEventListener('loadeddata', handleLoadedData, { once: true });
        nextVideoRef.current.addEventListener('error', handleError, { once: true });
        
        return () => {
          if (nextVideoRef.current) {
            nextVideoRef.current.removeEventListener('canplay', handleCanPlay);
            nextVideoRef.current.removeEventListener('loadeddata', handleLoadedData);
            nextVideoRef.current.removeEventListener('error', handleError);
          }
        };
      }
    } else {
      // Video is already loaded, just ensure it's playing
      setIsVideoLoading(false);
      const playPromise = currentVideoRef.current?.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [currentIndex, currentItem.backgroundVideoUrl, currentItem.videoUrl, activeVideoIndex]);

  // Handle scroll wheel events - ONLY manual scroll with better debouncing
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent default scroll behavior
      e.preventDefault();
      e.stopPropagation();

      // Accumulate scroll delta
      scrollAccumulatorRef.current += Math.abs(e.deltaY);

      // Only trigger if scroll threshold is met (prevents multiple triggers)
      // Lower threshold for better responsiveness
      if (scrollAccumulatorRef.current < 30) {
        return;
      }

      // Prevent rapid changes - only allow one change per scroll action
      if (isScrollingRef.current) {
        scrollAccumulatorRef.current = 0;
        return;
      }

      isScrollingRef.current = true;
      scrollAccumulatorRef.current = 0;

      // Determine direction and update
      // Scroll down = move carousel right (next item)
      // Scroll up = move carousel left (previous item)
      if (e.deltaY > 0) {
        // Scroll down - move carousel right (next item comes from right)
        setScrollDirection('right');
        goToNext();
      } else if (e.deltaY < 0) {
        // Scroll up - move carousel left (previous item comes from left)
        setScrollDirection('left');
        goToPrevious();
      }

      // Reset scrolling flag after delay to prevent rapid changes
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        scrollAccumulatorRef.current = 0;
      }, 800);
    };

    // Attach to both window and document for better compatibility
    window.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [goToNext, goToPrevious]);

  // Handle keyboard arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrollingRef.current) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        isScrollingRef.current = true;
        setScrollDirection('left');
        goToPrevious();
        
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 800);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        isScrollingRef.current = true;
        setScrollDirection('right');
        goToNext();
        
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 800);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNext, goToPrevious]);

  const handleExplore = () => {
    if (currentItem.videoUrl) {
      setSelectedVideo(currentItem.videoUrl);
    } else if (currentItem.link) {
      window.location.href = currentItem.link;
    }
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handleOpenYoutube = (url?: string) => {
    const mediaUrl = url || currentItem.instagramUrl;
    if (!mediaUrl) return;
    
    // Check if it's an Instagram URL
    if (mediaUrl.includes('instagram.com')) {
      setSelectedInstagramUrl(mediaUrl);
    } 
    // Check if it's a YouTube URL
    else if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
      setSelectedYoutubeUrl(mediaUrl);
    }
  };

  const handleCloseYoutube = () => {
    setSelectedYoutubeUrl(null);
    setSelectedInstagramUrl(null);
  };

  // Get Instagram embed URL
  const getInstagramEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Extract post ID from various Instagram URL formats
    // Format: https://www.instagram.com/p/{POST_ID}/
    // Format: https://www.instagram.com/reel/{POST_ID}/
    // Format: https://www.instagram.com/tv/{POST_ID}/
    const patterns = [
      /instagram\.com\/p\/([^\/\?]+)/,
      /instagram\.com\/reel\/([^\/\?]+)/,
      /instagram\.com\/tv\/([^\/\?]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://www.instagram.com/p/${match[1]}/embed/`;
      }
    }
    
    return '';
  };

  // Extract YouTube video ID from URL and determine if it's a Short
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    let videoId = '';
    let isShorts = false;
    
    // Handle YouTube Shorts (e.g., https://youtube.com/shorts/8iXALkskiZ8)
    const shortsMatch = url.match(/youtube\.com\/shorts\/([^\/\?]+)/);
    if (shortsMatch && shortsMatch[1]) {
      videoId = shortsMatch[1];
      isShorts = true;
    } else {
      // Handle regular YouTube URLs
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      videoId = (match && match[2].length === 11) ? match[2] : '';
    }
    
    if (!videoId) return '';
    
    // For Shorts, we need to use a different embed approach
    if (isShorts) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&modestbranding=1&rel=0`;
    }
    
    // Regular YouTube videos
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;
  };

  // Check if URL is a YouTube Shorts
  const isYoutubeShorts = (url: string) => {
    if (!url) return false;
    return url.includes('youtube.com/shorts/') || url.includes('youtu.be/') && url.includes('shorts');
  };

  return (
    <div
      className="relative w-full h-full"
      style={{ overflow: 'visible' }}
    >
      {/* Background Video with Crossfade - Two video elements for seamless transition */}
      {(currentItem.backgroundVideoUrl || currentItem.videoUrl) && (
        <>
          {/* Thumbnail placeholder while first video loads */}
          {isVideoLoading && activeVideoIndex === 0 && currentItem.thumbnail && (
            <motion.div
              className="absolute inset-0 w-full h-full z-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={currentItem.thumbnail}
                alt={currentItem.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          )}
          
          {/* Video 1 - Active when activeVideoIndex === 0 */}
          <motion.video
            ref={backgroundVideoRef1}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            animate={{
              scale: 1.1,
              x: scrollDirection === 'right' ? -20 : 20,
              opacity: (selectedYoutubeUrl || selectedInstagramUrl) ? 0.3 : activeVideoIndex === 0 ? 1 : 0,
            }}
            transition={{
              scale: { duration: 0.8, ease: 'easeOut' },
              x: { duration: 0.8, ease: 'easeOut' },
              opacity: { duration: 0.5, ease: 'easeInOut' },
            }}
            style={{ zIndex: activeVideoIndex === 0 ? 1 : 0 }}
          />
          
          {/* Video 2 - Active when activeVideoIndex === 1 */}
          <motion.video
            ref={backgroundVideoRef2}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            animate={{
              scale: 1.1,
              x: scrollDirection === 'right' ? -20 : 20,
              opacity: (selectedYoutubeUrl || selectedInstagramUrl) ? 0.3 : activeVideoIndex === 1 ? 1 : 0,
            }}
            transition={{
              scale: { duration: 0.8, ease: 'easeOut' },
              x: { duration: 0.8, ease: 'easeOut' },
              opacity: { duration: 0.5, ease: 'easeInOut' },
            }}
            style={{ zIndex: activeVideoIndex === 1 ? 1 : 0 }}
          />
        </>
      )}

      {/* Permanent 10% darker overlay on background video */}
      <div className="absolute inset-0 bg-black/10 z-10" />

      {/* Dark overlay with Parallax */}
      <motion.div
        className="absolute inset-0 bg-black z-20"
        animate={{
          opacity: (selectedYoutubeUrl || selectedInstagramUrl) ? 0.6 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
      />

      {/* Top Navigation - BACK and CREATIVE PROCESS */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 sm:px-8 pt-16 sm:pt-14 pb-6">
        {(selectedYoutubeUrl || selectedInstagramUrl) ? (
          <button 
            onClick={() => {
              handleCloseYoutube();
            }}
            className="text-white uppercase tracking-wider text-sm sm:text-base hover:text-gray-300 transition-colors"
          >
            BACK
          </button>
        ) : (
          <div></div>
        )}
        <button 
          onClick={() => {
            const setView = useNavigationStore.getState().setView;
            setView('creative-process');
          }}
          className="px-6 py-3 rounded-full border border-gray-400 bg-transparent backdrop-blur-md text-white uppercase tracking-wider text-sm sm:text-base hover:bg-white/5 hover:border-gray-300 transition-all duration-200"
        >
          CREATIVE PROCESS
        </button>
      </div>

      {/* EXPLORE and THE REAL CINEMA Text at Top */}
      <div className="fixed top-16 sm:top-14 left-0 right-0 z-50 flex flex-col items-center px-4 pointer-events-none">
        <p className="text-gray-400 uppercase tracking-[0.2em] text-sm text-center mb-1 font-san-francisco">
          EXPLORE
        </p>
        <h1 className="text-white uppercase tracking-[0.1em] text-3xl font-bold text-center font-inter">
          The Real Cinema
        </h1>
      </div>

      {/* Main Content - Continuous Horizontal Carousel */}
      <div className="fixed inset-0 flex items-center justify-center z-30 px-4 overflow-hidden">
        <motion.div 
          className="flex items-center justify-center w-full h-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragMomentum={false}
          onDragStart={() => {
            setIsDragging(true);
          }}
          onDragEnd={(e, { offset }) => {
            const swipeThreshold = 50;

            if (offset.x < -swipeThreshold) {
              // Dragged left - go to next
              setScrollDirection('right');
              goToNext();
            } else if (offset.x > swipeThreshold) {
              // Dragged right - go to previous
              setScrollDirection('left');
              goToPrevious();
            }

            // Reset dragging state after a short delay
            setTimeout(() => setIsDragging(false), 100);
          }}
          style={{ willChange: 'transform' }}
        >
          {/* Continuous Horizontal Container */}
          <div className="relative w-full h-full flex items-center justify-center overflow-visible">
            <div className="relative w-full h-full">
              {/* Render all cards in continuous row with absolute positioning */}
              {commercialContent.map((item, index) => {
                const position = index - currentIndex;
                const isCenter = position === 0;
                const isLeft = position === -1;
                const isRight = position === 1;
                const isVisible = Math.abs(position) <= 1;

                // Fixed scale and opacity based on position (no animation)
                const scale = isCenter ? 1 : 0.7;
                const opacity = isCenter ? 1 : 0.4;
                const zIndex = isCenter ? 20 : 10;

                // Calculate horizontal offset from center
                // Cards are positioned with left: 50% (left edge at screen center)
                const cardWidth = 346; // Max card width in px
                const halfCard = cardWidth / 2;
                
                let xOffset;
                if (isCenter) {
                  // Center the card at viewport center
                  xOffset = -halfCard;
                } else if (isLeft) {
                  // Position at left edge with half outside screen
                  // Card center should be at viewport left edge (x=0)
                  xOffset = -(windowWidth / 2) - halfCard;
                } else if (isRight) {
                  // Position at right edge with half outside screen  
                  // Card center should be at viewport right edge (x=windowWidth)
                  xOffset = (windowWidth / 2) - halfCard;
                } else {
                  // Off-screen cards positioned far away
                  xOffset = (index - currentIndex) * 1000 - halfCard;
                }

                return (
                  <motion.div
                    key={item.id}
                    className="flex flex-col items-center justify-center gap-4"
                    initial={false}
                    onClick={() => {
                      if (!isDragging) {
                        if (isLeft) {
                          setScrollDirection('left');
                          goToPrevious();
                        } else if (isRight) {
                          setScrollDirection('right');
                          goToNext();
                        }
                      }
                    }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      scale,
                      opacity: isVisible ? opacity : 0,
                      zIndex,
                      pointerEvents: isVisible ? 'auto' : 'none',
                      cursor: (isLeft || isRight) ? 'pointer' : 'default',
                    }}
                    animate={{
                      x: xOffset,
                      y: -200, // Negative half of approximate card height for vertical centering
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 210, // Reduced by 30% for slower animation
                      damping: 30,
                    }}
                  >
                  {/* Square Box - Show when there's a background video */}
                  {item.backgroundVideoUrl && (
                    <>
                      {isCenter ? (
                        <CardContainer className="w-auto h-auto" intensity={3}>
                          <CardItem translateZ={20} as="div">
                            <motion.button
                              onClick={() => {
                                if (!isDragging && item.instagramUrl) {
                                  handleOpenYoutube(item.instagramUrl);
                                }
                              }}
                              className="relative w-[202px] h-[202px] sm:w-[230px] sm:h-[230px] md:w-[288px] md:h-[288px] lg:w-[346px] lg:h-[346px] overflow-hidden group rounded-md cursor-pointer"
                              transition={{ duration: 0.2 }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50 shadow-2xl rounded-md pointer-events-none">
                                <Image
                                  src={item.thumbnail}
                                  alt={item.title}
                                  fill
                                  className="object-cover opacity-90 rounded-md transition-opacity duration-300"
                                  sizes="(max-width: 640px) 202px, (max-width: 768px) 230px, (max-width: 1024px) 288px, 346px"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-md" />
                                {/* Darkening overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 rounded-md" />
                                {/* Explore button overlay - liquid glass effect */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md pointer-events-none">
                                  <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-medium text-xs sm:text-sm uppercase tracking-wider border border-white/30">
                                    EXPLORE
                                  </span>
                                </div>
                              </div>
                            </motion.button>
                          </CardItem>
                        </CardContainer>
                      ) : (
                        <div
                          className="relative w-[202px] h-[202px] sm:w-[230px] sm:h-[230px] md:w-[288px] md:h-[288px] lg:w-[346px] lg:h-[346px] overflow-hidden group rounded-md"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50 shadow-2xl rounded-md pointer-events-none">
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              fill
                              className="object-cover opacity-90 rounded-md transition-opacity duration-300"
                              sizes="(max-width: 640px) 202px, (max-width: 768px) 230px, (max-width: 1024px) 288px, 346px"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-md" />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Video Title Below Box - only show for center card */}
                  {item.backgroundVideoUrl && isCenter && (
                    <p className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wider font-inter mt-2">
                      <EncryptedText
                        key={`title-${currentIndex}`}
                        text={item.title}
                        encryptedClassName="text-white"
                        revealedClassName="text-white"
                      />
                    </p>
                  )}
                  
                  {/* Fallback: Show title if no background video - only for center card */}
                  {!item.backgroundVideoUrl && isCenter && (
                    <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider font-inter text-center">
                      <EncryptedText
                        key={`title-fallback-${currentIndex}`}
                        text={item.title}
                        encryptedClassName="text-white"
                        revealedClassName="text-white"
                      />
                    </p>
                  )}
                </motion.div>
              );
            })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Circular Film Icon Button at Bottom */}
      {!isMenuOpen && (
        <motion.button
          onClick={() => setIsMenuOpen(true)}
          className="absolute bottom-8 sm:bottom-12 z-50 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-transparent backdrop-blur-md border-2 border-gray-400 flex items-center justify-center hover:border-white"
          style={{ 
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
          whileHover={{
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.6)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            transition: {
              duration: 0.3,
            },
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
        currentVideoTitle={currentItem.title}
      />

      {/* Video Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={handleCloseVideo}
        >
          <div
            className="w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <VideoPlayer
              src={selectedVideo}
              poster={currentItem.thumbnail}
              title={currentItem.title}
              onClose={handleCloseVideo}
            />
          </div>
        </motion.div>
      )}

      {/* YouTube Embed Modal */}
      {selectedYoutubeUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30"
          onClick={handleCloseYoutube}
        >
          {/* EXPLORE and THE REAL CINEMA Text - Overlapping Homepage Text */}
          <div className="fixed top-16 sm:top-14 left-0 right-0 z-50 flex flex-col items-center px-4 pointer-events-none">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-gray-400 uppercase tracking-[0.2em] text-sm text-center mb-1 font-san-francisco"
            >
              EXPLORE
            </motion.p>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-white uppercase tracking-[0.1em] text-3xl font-bold text-center font-inter"
            >
              The Real Cinema
            </motion.h1>
          </div>

          {/* YouTube Video Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: -2, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="w-full max-w-3xl lg:max-w-4xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* YouTube Embed - Handle Shorts differently */}
              {isYoutubeShorts(selectedYoutubeUrl) ? (
                <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center mx-auto" style={{ maxHeight: '562px', width: 'auto', aspectRatio: '9/16' }}>
                  <iframe
                    src={getYoutubeEmbedUrl(selectedYoutubeUrl)}
                    title={currentItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    style={{ maxHeight: '562px', aspectRatio: '9/16' }}
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
                  <iframe
                    src={getYoutubeEmbedUrl(selectedYoutubeUrl)}
                    title={currentItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Instagram Embed Modal */}
      {selectedInstagramUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30"
          onClick={handleCloseYoutube}
        >
          {/* EXPLORE and THE REAL CINEMA Text - Overlapping Homepage Text */}
          <div className="fixed top-16 sm:top-14 left-0 right-0 z-50 flex flex-col items-center px-4 pointer-events-none">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-gray-400 uppercase tracking-[0.2em] text-sm text-center mb-1 font-san-francisco"
            >
              EXPLORE
            </motion.p>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-white uppercase tracking-[0.1em] text-3xl font-bold text-center font-inter"
            >
              The Real Cinema
            </motion.h1>
          </div>

          {/* Instagram Embed Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: -2, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl border border-white/10">
                <iframe
                  src={getInstagramEmbedUrl(selectedInstagramUrl)}
                  title={currentItem.title}
                  allow="encrypted-media"
                  className="w-full"
                  style={{ 
                    minHeight: '500px',
                    maxHeight: '800px',
                    border: 'none',
                    overflow: 'hidden'
                  }}
                  scrolling="no"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CommercialWork;

