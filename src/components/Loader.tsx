'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import type { gsap as Gsap } from 'gsap';
import { useLoader } from '@/src/contexts/LoaderContext';
import { useFontsLoaded } from '@/src/hooks/useFontsLoaded';

interface LoaderProps {
  enabled?: boolean;
}

type GsapInstance = typeof Gsap;
type GsapTimeline = ReturnType<GsapInstance['timeline']>;
type GsapTween = ReturnType<GsapInstance['delayedCall']>;

// The intro (and the hidden .page-container state in globals.css) only exists
// on desktop; on mobile the .loader is display:none and content paints at FCP.
const DESKTOP_INTRO_QUERY = '(min-width: 769px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
// Minimum time the loader stays up (replaces the old 0 -> 1 ProgressTracker)
const MIN_DISPLAY_MS = 2000;

const getPageContainers = () =>
  Array.from(document.querySelectorAll<HTMLElement>('.page-container'));

// Make the page visible and interactive without any blur or transition.
const revealPageContainer = () => {
  getPageContainers().forEach((el) => {
    el.style.opacity = '1';
    el.style.visibility = 'visible';
    el.style.filter = 'none';
    el.style.pointerEvents = 'auto';
  });
  // Keeps any .page-container mounted later (client navigation) visible too
  document.documentElement.classList.add('intro-done');
};

const Loader: React.FC<LoaderProps> = ({ enabled = true }) => {
  const pathname = usePathname();
  const { setIsLoaded } = useLoader();
  const fontsLoaded = useFontsLoaded();

  const loaderRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const blinkTimelineRef = useRef<GsapTimeline | null>(null);
  const gsapRef = useRef<GsapInstance | null>(null);
  const introStartedRef = useRef(false);
  const exitStartedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const [readyToHide, setReadyToHide] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Initial entrance animation
  const playEntranceAnimation = useCallback((gsap: GsapInstance) => {
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

  // Exit animation (desktop intro only)
  const playExitAnimation = useCallback((gsap: GsapInstance) => {
    const tl = gsap.timeline();
    const reducedMotion = reducedMotionRef.current;

    if (blinkTimelineRef.current) {
      blinkTimelineRef.current.kill();
    }

    // Set initial state for main content (blurred and invisible).
    // Reduced motion: same timing, opacity only.
    gsap.set('.page-container', reducedMotion
      ? { autoAlpha: 0, filter: 'none' }
      : { autoAlpha: 0, filter: 'blur(20px)' });

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
      .to('.page-container', reducedMotion
        ? { autoAlpha: 1, duration: 2, ease: 'power2.out' }
        : { autoAlpha: 1, filter: 'blur(0px)', duration: 2, ease: 'power2.out' }, '-=0.2')
      // Ensure page container is fully visible and interactive
      .set('.page-container', {
        pointerEvents: 'auto',
        visibility: 'visible',
        opacity: 1
      }, '+=0.1')
      // Call completion callback - this will trigger React re-render and show sections
      .add(() => {
        document.documentElement.classList.add('intro-done');
        if (setIsLoaded) {
          setIsLoaded(true);
        }
      });
  }, [setIsLoaded]);

  // Initialize on mount / route change
  useEffect(() => {
    const isHomePage = pathname === '/';
    // Decided in the effect (never during render) so SSR and hydration match
    const desktopIntro = window.matchMedia(DESKTOP_INTRO_QUERY).matches;

    if (!(enabled && isHomePage && desktopIntro) || introStartedRef.current) {
      // Mobile, preloader disabled, not on the homepage, or the intro already
      // ran: show the page immediately, no blur and no re-hide.
      revealPageContainer();
      if (enabled && isHomePage && !introStartedRef.current && loaderRef.current) {
        // Mobile homepage: the intro never runs, so keep the overlay out of the
        // way if the viewport later grows past the desktop breakpoint.
        loaderRef.current.style.opacity = '0';
      }
      if (setIsLoaded) {
        setIsLoaded(true);
      }
      return;
    }

    // Desktop homepage intro
    introStartedRef.current = true;
    reducedMotionRef.current = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    // Set initial blur state for page container only on homepage with preloader
    getPageContainers().forEach((el) => {
      el.style.opacity = '0';
      el.style.visibility = 'hidden';
      el.style.filter = reducedMotionRef.current ? 'none' : 'blur(20px)';
    });

    const minDisplayTimer = setTimeout(() => setMinTimeElapsed(true), MIN_DISPLAY_MS);

    let cancelled = false;
    let entranceCall: GsapTween | null = null;

    (async () => {
      const { default: gsap } = await import('gsap');
      if (cancelled) return;
      gsapRef.current = gsap;
      // Reset initial states right before the entrance (as before), so the
      // server-rendered WELCOME + cursor never blink out while gsap loads
      gsap.set(cursorRef.current, { opacity: 0 });
      gsap.set([text1Ref.current, text2Ref.current], { autoAlpha: 0 });
      entranceCall = gsap.delayedCall(0.01, () => playEntranceAnimation(gsap));
    })().catch(() => {
      // gsap chunk failed to load: never leave the page stuck behind the loader
      if (cancelled) return;
      if (loaderRef.current) loaderRef.current.style.visibility = 'hidden';
      revealPageContainer();
      setIsLoaded(true);
    });

    return () => {
      cancelled = true;
      clearTimeout(minDisplayTimer);
      if (entranceCall) {
        entranceCall.kill();
      }
      if (blinkTimelineRef.current) {
        blinkTimelineRef.current.kill();
      }
      // Allow the intro to restart (e.g. React strict-mode remount) unless it
      // has already reached its exit sequence.
      if (!exitStartedRef.current) {
        introStartedRef.current = false;
      }
    };
  }, [enabled, pathname, playEntranceAnimation, setIsLoaded]);

  // Complete loader when all conditions are met (desktop intro only:
  // minTimeElapsed and readyToHide are never set on mobile)
  useEffect(() => {
    const gsap = gsapRef.current;
    if (minTimeElapsed && readyToHide && fontsLoaded && gsap && !exitStartedRef.current) {
      exitStartedRef.current = true;
      playExitAnimation(gsap);
    }
  }, [minTimeElapsed, readyToHide, fontsLoaded, playExitAnimation]);

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
      />
    </div>
  );
};

export default Loader;
