'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import MenuPopup from './MenuPopup';
import { useNavigationStore } from '@/src/store/navigationStore';
import { creativeProcessContent, CreativeProcessSection } from '@/src/data/creativeProcessContent';

// Component for video-filled text
const VideoTextMask = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  const updateMask = useCallback(() => {
    if (textRef.current && videoRef.current && containerRef.current) {
      const textElement = textRef.current;
      const videoElement = videoRef.current;
      const containerElement = containerRef.current;
      
      // Get computed styles from the text element
      const style = window.getComputedStyle(textElement);
      const fontSize = parseFloat(style.fontSize) || 48;
      const fontFamily = style.fontFamily;
      const fontWeight = style.fontWeight;
      
      // Get container dimensions (full span area)
      const containerRect = containerElement.getBoundingClientRect();
      const textRect = textElement.getBoundingClientRect();
      
      if (containerRect.width > 0 && containerRect.height > 0) {
        // Create canvas to generate mask - use container dimensions
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Set canvas to container size
          canvas.width = Math.ceil(containerRect.width);
          canvas.height = Math.ceil(containerRect.height);
          
          ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
          const metrics = ctx.measureText(text);
          
          // Draw text centered in the canvas (matching container area)
          ctx.fillStyle = 'white';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText(text, canvas.width / 2, canvas.height / 2);
          
          // Apply mask to video
          const maskUrl = canvas.toDataURL();
          (videoElement.style as any).WebkitMaskImage = `url(${maskUrl})`;
          videoElement.style.maskImage = `url(${maskUrl})`;
          (videoElement.style as any).WebkitMaskSize = '100% 100%';
          videoElement.style.maskSize = '100% 100%';
          (videoElement.style as any).WebkitMaskRepeat = 'no-repeat';
          videoElement.style.maskRepeat = 'no-repeat';
          (videoElement.style as any).WebkitMaskPosition = 'center';
          videoElement.style.maskPosition = 'center';
          
          // Video fills the entire container span area
          videoElement.style.width = `${containerRect.width}px`;
          videoElement.style.height = `${containerRect.height}px`;
          videoElement.style.top = '0';
          videoElement.style.left = '0';
        }
      }
    }
  }, [text]);

  useEffect(() => {
    // Wait for text to render
    const timeout = setTimeout(updateMask, 100);
    
    // Store video element reference for cleanup
    const videoElement = videoRef.current;
    
    // Also update on video load
    if (videoElement) {
      videoElement.addEventListener('loadeddata', updateMask);
    }
    
    // Update on window resize
    window.addEventListener('resize', updateMask);
    
    return () => {
      clearTimeout(timeout);
      if (videoElement) {
        videoElement.removeEventListener('loadeddata', updateMask);
      }
      window.removeEventListener('resize', updateMask);
    };
  }, [updateMask]);

  return (
    <span 
      ref={containerRef}
      className="relative inline-flex"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1',
        verticalAlign: 'middle',
      }}
    >
      <span
        ref={textRef}
        style={{
          position: 'relative',
          display: 'block',
          color: 'transparent',
          userSelect: 'none',
          zIndex: 2,
          pointerEvents: 'none',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          fontWeight: 'inherit',
          letterSpacing: 'inherit',
          WebkitTextStroke: '1px transparent',
          lineHeight: '1em',
          margin: 0,
          padding: 0,
        }}
      >
        {text}
      </span>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        onError={() => {
          // Fallback: if video fails to load, show red text
          if (textRef.current) {
            textRef.current.style.color = '#ef4444';
            (textRef.current.style as any).WebkitTextStroke = 'none';
          }
        }}
        onEnded={(e) => {
          // When video ends, play in reverse
          const video = e.currentTarget;
          video.playbackRate = -1;
          video.play();
        }}
        onTimeUpdate={(e) => {
          // When video reaches the start while playing in reverse, play forward again
          const video = e.currentTarget;
          if (video.playbackRate < 0 && video.currentTime <= 0) {
            video.playbackRate = 1;
            video.currentTime = 0;
            video.play();
          }
        }}
      >
        <source src="/util_vids/reds.webm" type="video/webm" />
      </video>
    </span>
  );
};

const CreativeProcess = () => {
  const goBack = useNavigationStore((state: { goBack: () => void }) => state.goBack);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const maxSection = creativeProcessContent.length - 1;
  
  // Refs for scroll debouncing
  const isChangingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  
  // Use about_me.webm as background video (can be changed later)
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

  // Function to change section with debouncing
  const changeSection = useCallback((direction: 1 | -1) => {
    if (isChangingRef.current) return;
    
    isChangingRef.current = true;
    
    if (direction > 0) {
      setCurrentSection(prev => Math.min(prev + 1, maxSection));
    } else {
      setCurrentSection(prev => Math.max(prev - 1, 0));
    }
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Reset after debounce period
    timeoutRef.current = setTimeout(() => {
      isChangingRef.current = false;
      timeoutRef.current = null;
    }, 1000);
  }, [maxSection]);

  // Wheel event handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isChangingRef.current) return;
      
      if (Math.abs(e.deltaY) > 10) { // Only trigger on significant scroll
        if (e.deltaY > 0) {
          changeSection(1);
        } else {
          changeSection(-1);
        }
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [maxSection, changeSection]);

  // Touch event handlers for swipe gestures
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartYRef.current - touchEndY;
      const minSwipeDistance = 50; // Minimum distance for a swipe
      
      if (Math.abs(diff) > minSwipeDistance) {
        if (diff > 0) {
          // Swipe up - go to next section
          changeSection(1);
        } else {
          // Swipe down - go to previous section
          changeSection(-1);
        }
      }
      
      touchStartYRef.current = null;
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [changeSection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isChangingRef.current) return;

      let shouldChange = false;
      let direction: 1 | -1 | 0 = 0;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        shouldChange = true;
        direction = 1;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        shouldChange = true;
        direction = -1;
      }

      if (shouldChange && direction !== 0) {
        e.preventDefault();
        changeSection(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [changeSection]);


  const renderSection = (section: CreativeProcessSection) => {
    switch (section.type) {
      case 'script':
        return (
          <div className="h-full flex items-center justify-center px-4 sm:px-8">
            <div className="text-center" style={{ maxWidth: '95%', width: '100%' }}>
              <h1 
                className="font-bold uppercase text-center"
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  color: '#a0a0a0',
                  textAlign: 'center',
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  lineHeight: '1.1',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {section.content.title ? (
                  <>
                    <div style={{ whiteSpace: 'nowrap' }}>
                      <VideoTextMask text="IF IT'S NOT IN THE SCRIPT" />
                    </div>
                    <div style={{ whiteSpace: 'nowrap' }}>
                      <VideoTextMask text="IT'S NOT IN THE F***ING MOVIE" />
                    </div>
                  </>
                ) : null}
              </h1>
            </div>
          </div>
        );

      case 'emotion':
        return (
          <div className="h-full flex flex-col items-center justify-center px-4 sm:px-8">
            <div className="text-center" style={{ maxWidth: '95%', width: '100%' }}>
              <h2 
                className="font-bold uppercase text-center mb-8"
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  color: '#a0a0a0',
                  textAlign: 'center',
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  lineHeight: '1.1',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {section.content.subtitle ? (
                  <div style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
                    <VideoTextMask text={section.content.subtitle.replace(/^"|"$/g, '')} />
                  </div>
                ) : null}
              </h2>
              <p 
                className="leading-relaxed text-center"
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                  lineHeight: '1.6',
                  color: '#a0a0a0',
                }}
              >
                {section.content.text ? (
                  (() => {
                    // Split text into exactly two lines
                    const text = section.content.text.replace(/\n/g, ' ').trim();
                    // Split after "moodboards" for a natural break
                    const splitIndex = text.indexOf('moodboards');
                    if (splitIndex > 0) {
                      const line1 = text.substring(0, splitIndex + 'moodboards'.length);
                      const line2 = text.substring(splitIndex + 'moodboards'.length).trim();
                      return (
                        <>
                          <div style={{ whiteSpace: 'nowrap' }}>{line1}</div>
                          <div style={{ whiteSpace: 'nowrap' }}>{line2}</div>
                        </>
                      );
                    }
                    return text;
                  })()
                ) : null}
              </p>
            </div>
          </div>
        );

      case 'planning':
        return (
          <div className="h-full flex items-center justify-center px-4 sm:px-8">
            <div className="text-center" style={{ maxWidth: '95%', width: '100%' }}>
              <p 
                className="text-gray-300 leading-relaxed text-center"
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: 'clamp(0.9rem, 2.2vw, 1.3rem)',
                  lineHeight: '1.6',
                }}
              >
                {section.content.text ? (
                  (() => {
                    // Split text into exactly three lines
                    const text = section.content.text.replace(/\n/g, ' ').trim();
                    // Split at natural break points
                    const split1 = text.indexOf('team roles.');
                    const split2 = text.indexOf('sculpted.');
                    
                    if (split1 > 0 && split2 > split1) {
                      const line1 = text.substring(0, split1 + 'team roles.'.length);
                      const line2 = text.substring(split1 + 'team roles.'.length, split2 + 'sculpted.'.length).trim();
                      const line3 = text.substring(split2 + 'sculpted.'.length).trim();
                      return (
                        <>
                          <div style={{ whiteSpace: 'nowrap' }}>{line1}</div>
                          <div style={{ whiteSpace: 'nowrap' }}>{line2}</div>
                          <div style={{ whiteSpace: 'nowrap' }}>{line3}</div>
                        </>
                      );
                    }
                    return text;
                  })()
                ) : null}
              </p>
            </div>
          </div>
        );

      case 'tools':
        return (
          <div className="h-full flex flex-col items-center justify-center px-4 sm:px-8" style={{ paddingBottom: '120px' }}>
            <div className="w-full max-w-6xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wider text-center mb-12" style={{ color: '#a0a0a0' }}>
                {section.content.title}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {section.content.tools?.map((tool, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-black rounded-lg p-1 sm:p-1.5 border border-gray-300/30 flex items-center justify-center overflow-hidden shadow-md min-w-[70px] sm:min-w-[90px]"
                  >
                    {tool.imagePath && (
                      <div className="relative w-[85%] h-[85%]">
                        <Image
                          src={tool.imagePath}
                          alt={tool.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 70px, 90px"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="h-full flex flex-col items-center justify-center px-4 sm:px-8">
            <div className="max-w-4xl w-full" style={{ margin: '0 auto' }}>
              <p 
                className="mb-8 leading-relaxed"
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                  whiteSpace: 'nowrap',
                  textAlign: 'left',
                  color: '#a0a0a0',
                }}
              >
                {section.content.title}
              </p>
              <ol 
                className="font-bold uppercase tracking-wider space-y-4 list-decimal"
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  textAlign: 'left',
                  listStylePosition: 'inside',
                  color: '#a0a0a0',
                }}
              >
                {section.content.items?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        );

      case 'identity':
        return (
          <div className="h-full flex flex-col items-center justify-center px-4 sm:px-8">
            <div className="text-center w-full flex flex-col items-center justify-center">
              <div 
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(8rem, 20vw, 18rem)',
                  letterSpacing: '0.02em',
                  textAlign: 'center',
                  marginBottom: '-1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <VideoTextMask text="WHO'S" />
              </div>
              <h1 
                className="font-bold uppercase tracking-wider"
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(2.8rem, 7vw, 6.3rem)',
                  letterSpacing: '0.02em',
                  color: '#a0a0a0',
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <VideoTextMask text="RONIT BHATT?" />
              </h1>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="h-full flex items-center justify-center px-4 sm:px-8 overflow-y-auto py-20">
            <div className="w-full" style={{ margin: '0 auto', maxWidth: '80%' }}>
              <div 
                className="grid grid-cols-2 gap-6 sm:gap-8"
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  color: '#a0a0a0',
                  gridAutoRows: '1fr',
                }}
              >
                {/* Top Left: Roles */}
                <div 
                  className="flex flex-col justify-start"
                  style={{
                    padding: '1.2rem 1.2rem 0.8rem 1.2rem',
                    border: '1px solid rgba(160, 160, 160, 0.2)',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    textAlign: 'left',
                    height: '100%',
                  }}
                >
                  {section.content.roles?.map((role, idx) => (
                    <div key={idx} style={{ marginBottom: idx === (section.content.roles?.length || 0) - 1 ? '0' : '1rem' }}>
                      <span 
                        style={{
                          fontWeight: 700,
                          fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                        }}
                      >
                        {role.title}
                      </span>
                      <span> – </span>
                      <span
                        style={{
                          fontWeight: 400,
                          fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                        }}
                      >
                        {role.description}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Top Right: Pre-Production */}
                {section.content.workflow && (
                  <div 
                    className="flex flex-col justify-start"
                    style={{
                      padding: '1.2rem 1.2rem 0.8rem 1.2rem',
                      border: '1px solid rgba(160, 160, 160, 0.2)',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      textAlign: 'left',
                      height: '100%',
                    }}
                  >
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                        }}
                      >
                        Pre-Production:
                      </span>
                    </div>
                    <div style={{ marginLeft: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)' }}>Scripts & breakdowns: {section.content.workflow.scripts}</span>
                    </div>
                    <div style={{ marginLeft: '0.75rem', marginBottom: '0' }}>
                      <span style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)' }}>Visual planning - {section.content.workflow.visualPlanning}</span>
                    </div>
                  </div>
                )}
                
                {/* Bottom Left: Cinematography */}
                {section.content.workflow && (
                  <div 
                    className="flex flex-col justify-start"
                    style={{
                      padding: '1.2rem 1.2rem 0.8rem 1.2rem',
                      border: '1px solid rgba(160, 160, 160, 0.2)',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      textAlign: 'left',
                      height: '100%',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Cinematography:
                    </div>
                    <div style={{ marginLeft: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)' }}>Cameras - {section.content.workflow.cameras}</span>
                    </div>
                    <div style={{ marginLeft: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)' }}>Primary - {section.content.workflow.primary}</span>
                    </div>
                    <div style={{ marginLeft: '0.75rem', marginBottom: '0' }}>
                      <span style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)' }}>Gear - {section.content.workflow.gear}</span>
                    </div>
                  </div>
                )}
                
                {/* Bottom Right: Post-Production */}
                {section.content.workflow && (
                  <div 
                    className="flex flex-col justify-start"
                    style={{
                      padding: '1.2rem 1.2rem 0.8rem 1.2rem',
                      border: '1px solid rgba(160, 160, 160, 0.2)',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      textAlign: 'left',
                      height: '100%',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Post-Production:
                    </div>
                    <div style={{ marginLeft: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)' }}>Edit - {section.content.workflow.edit}</span>
                    </div>
                    <div style={{ marginLeft: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)' }}>Color - {section.content.workflow.color}</span>
                    </div>
                    <div style={{ marginLeft: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)' }}>Sound - {section.content.workflow.sound}</span>
                    </div>
                    <div style={{ marginLeft: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)' }}>Delivery - {section.content.workflow.delivery}</span>
                    </div>
                    <div style={{ marginLeft: '0.75rem', marginBottom: '0' }}>
                      <span style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)' }}>Workflow - {section.content.workflow.workflow}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="h-full flex flex-col items-center justify-center px-4 sm:px-8">
            <div className="text-center max-w-5xl">
              <h1 
                className="font-bold uppercase tracking-wider leading-tight mb-6"
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  letterSpacing: '0.02em',
                  color: '#a0a0a0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {section.content.title ? (
                  <VideoTextMask text={section.content.title} />
                ) : null}
              </h1>
              <p 
                className="text-gray-300 leading-relaxed"
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                }}
              >
                {section.content.subtitle}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentSectionData = creativeProcessContent[currentSection];

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Background Video with Blur */}
      <motion.video
        ref={backgroundVideoRef}
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-30 blur-sm"
        animate={{
          scale: 1.1,
        }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
      />

      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/40 z-10" />

      {/* Top Navigation - BACK */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 sm:px-8 pt-16 sm:pt-14 pb-6">
        <button 
          onClick={goBack}
          className="uppercase tracking-wider text-sm sm:text-base hover:text-gray-300 transition-colors"
          style={{ color: '#a0a0a0' }}
        >
          BACK
        </button>
        <div></div>
      </div>

      {/* EXPLORE and THE CREATIVE PROCESS Text at Top */}
      <div className="fixed top-16 sm:top-14 left-1/2 z-50 -translate-x-1/2 px-4 pointer-events-none">
        <div className="flex flex-col items-center">
          <p className="text-gray-400 uppercase tracking-[0.2em] text-sm text-center mb-1 font-san-francisco">
            EXPLORE
          </p>
          <h1 className="text-white uppercase tracking-[0.1em] text-[2.34375rem] font-bold text-center font-inter">
            The Creative Process
          </h1>
        </div>
      </div>

      {/* Main Content - Fixed Overlay Sections with Crossfade */}
      <AnimatePresence mode="wait">
        {currentSectionData && (
          <motion.div
            key={currentSectionData.id}
            className="fixed inset-0 z-30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {renderSection(currentSectionData)}
          </motion.div>
        )}
      </AnimatePresence>

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
        currentVideoTitle="Creative Process"
      />
    </div>
  );
};

export default CreativeProcess;

