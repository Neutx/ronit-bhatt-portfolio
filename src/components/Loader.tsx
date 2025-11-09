'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useLoader } from '@/src/contexts/LoaderContext';
import { useFontsLoaded } from '@/src/hooks/useFontsLoaded';

interface LoaderProps {
  enabled?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ enabled = true }) => {
  const pathname = usePathname();
  const { loaderProgress, setIsLoaded } = useLoader();
  const fontsLoaded = useFontsLoaded();
  
  const loaderRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const blinkTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const [readyToHide, setReadyToHide] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Create blinking cursor animation
  const createBlinkAnimation = () => {
    if (blinkTimelineRef.current) {
      blinkTimelineRef.current.kill();
    }
    
    blinkTimelineRef.current = gsap.timeline({ repeat: -1, repeatDelay: 0.1 });
    blinkTimelineRef.current
      .set(cursorRef.current, { opacity: 0 })
      .set(cursorRef.current, { opacity: 1, delay: 0.1 });
    
    return blinkTimelineRef.current;
  };

  // Initial entrance animation
  const playEntranceAnimation = useCallback(async () => {
    const tl = gsap.timeline();
    
    // Fade in text elements with stagger
    tl.set([text1Ref.current, text2Ref.current], { autoAlpha: 1, stagger: 0.3 }, '<')
      .add(() => {
        createBlinkAnimation().play();
      }, '<')
      .add(() => {
        setReadyToHide(true);
      }, '<');
  }, []);

  // Exit animation
  const playExitAnimation = useCallback(() => {
    const tl = gsap.timeline();
    
    if (blinkTimelineRef.current) {
      blinkTimelineRef.current.kill();
    }
    
    // Set initial state for main content (blurred and invisible)
    gsap.set('.page-container', { 
      autoAlpha: 0,
      filter: 'blur(20px)'
    });
    
    // Hide progress
    tl.set(progressRef.current, { autoAlpha: 0 })
      // Show cursor one last time
      .set(cursorRef.current, { autoAlpha: 1 })
      // Scale cursor down
      .to(cursorRef.current, {
        delay: 0.2,
        scale: 0,
        duration: 0.1,
        ease: 'power2.in',
      })
      // Hide loader text elements
      .set([text1Ref.current, text2Ref.current], { autoAlpha: 0 }, '<')
      // Hide loader itself
      .to(loaderRef.current, {
        autoAlpha: 0,
        duration: 0.3,
      }, '<')
      // Fade in and unblur main content
      .to('.page-container', {
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 2,
        ease: 'power2.out',
      }, '-=0.2')
      // Ensure page container is fully visible and interactive
      .set('.page-container', {
        pointerEvents: 'auto',
        visibility: 'visible',
        opacity: 1
      }, '+=0.1')
      // Call completion callback - this will trigger React re-render and show sections
      .add(() => {
        if (setIsLoaded) {
          setIsLoaded(true);
        }
      });
  }, [setIsLoaded]);

  // Initialize on mount
  useEffect(() => {
    // Reset initial states
    gsap.set(cursorRef.current, { opacity: 0 });
    gsap.set([text1Ref.current, text2Ref.current], { autoAlpha: 0 });
    
    // Only hide page container if preloader is enabled and we're on homepage
    const isHomePage = pathname === '/';
    if (enabled && isHomePage) {
      // Set initial blur state for page container only on homepage with preloader
      gsap.set('.page-container', { 
        autoAlpha: 0,
        filter: 'blur(20px)'
      });
      gsap.delayedCall(0.01, playEntranceAnimation);
    } else {
      // If preloader is disabled or not on homepage, ensure page container is visible
      gsap.set('.page-container', {
        pointerEvents: 'auto',
        visibility: 'visible',
        opacity: 1,
        filter: 'blur(0px)'
      });
      if (setIsLoaded) {
        setIsLoaded(true);
      }
    }
    
    return () => {
      if (blinkTimelineRef.current) {
        blinkTimelineRef.current.kill();
      }
    };
  }, [enabled, pathname, playEntranceAnimation, setIsLoaded]);

  // Update progress display
  useEffect(() => {
    if (loaderProgress === 1 && readyToHide) {
      setImagesLoaded(true);
    }
  }, [loaderProgress, readyToHide]);

  // Complete loader when all conditions are met
  useEffect(() => {
    if (imagesLoaded && readyToHide && fontsLoaded) {
      playExitAnimation();
    }
  }, [imagesLoaded, readyToHide, fontsLoaded, playExitAnimation]);

  // Only show on homepage
  const isHomePage = pathname === '/';
  const visibility = isHomePage ? 'visible' : 'hidden';

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={loaderRef}
      className="loader"
      style={{ visibility }}
    >
      <div className="container">
        <span ref={text1Ref} className="text">
          WELCOME
        </span>
        <div ref={cursorRef} className="cursor">
          <div ref={cursorInnerRef} className="cursor__inner" />
        </div>
        <span ref={text2Ref} className="text"></span>
      </div>
      <p
        ref={progressRef}
        className="progress"
        style={{ opacity: enabled ? 1 : 0 }}
      >
        {Math.round(loaderProgress * 100)}%
      </p>
    </div>
  );
};

export default Loader;

