'use client';

import { AnimatePresence, LazyMotion, m } from 'framer-motion';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useNavigationStore } from '@/src/store/navigationStore';
import Carousel from '@/src/components/Carousel';
import { afterLoad } from '@/src/lib/afterLoad';
import { markMotionFeaturesReady } from '@/src/lib/motionReady';

// Non-initial views are code-split out of the boot bundle; Carousel stays static
// because it is the initial view and holds the LCP image.
const loadAboutMe = () => import('@/src/components/AboutMe');
const loadCommercialWork = () => import('@/src/components/CommercialWork');
const loadBrandsPage = () => import('@/src/components/BrandsPage');
const loadCreativeProcess = () => import('@/src/components/CreativeProcess');

// framer-motion's feature bundle (animations, gestures, drag) is split out of
// the boot bundle and fetched once the page has loaded and the main thread is
// idle, or on the first user input if that comes sooner. The `m` components
// render their initial frame without it, so first paint and LCP never wait on
// it. The split views use the self-contained `motion` component.
const loadMotionFeatures = () =>
  new Promise<void>((resolve) => {
    const inputEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    let cancelAfterLoad = () => {};
    const done = () => {
      cancelAfterLoad();
      inputEvents.forEach((type) => window.removeEventListener(type, done, true));
      resolve();
    };
    inputEvents.forEach((type) =>
      window.addEventListener(type, done, { capture: true, passive: true, once: true })
    );
    cancelAfterLoad = afterLoad(done, { timeout: 1500 });
  }).then(() =>
    import('@/src/lib/motionFeatures').then((mod) => {
      // Flag first so components render with their final keys when LazyMotion
      // re-renders with the loaded renderer (see Carousel).
      markMotionFeaturesReady();
      return mod.default;
    })
  );

const AboutMe = dynamic(loadAboutMe, { ssr: false });
const CommercialWork = dynamic(loadCommercialWork, { ssr: false });
const BrandsPage = dynamic(loadBrandsPage, { ssr: false });
const CreativeProcess = dynamic(loadCreativeProcess, { ssr: false });

export default function Home() {
  const currentView = useNavigationStore((state) => state.currentView);

  // Warm the split view chunks once the page has loaded and the main thread is
  // idle, so switching views inside AnimatePresence mode="wait" never shows an
  // empty frame while a chunk downloads.
  useEffect(
    () =>
      afterLoad(
        () => {
          void Promise.all([
            loadAboutMe(),
            loadCommercialWork(),
            loadBrandsPage(),
            loadCreativeProcess(),
          ]).catch(() => {
            // Ignore: dynamic() retries the import when the view is opened
          });
        },
        { timeout: 5000 }
      ),
    []
  );

  return (
    <main 
      className="fixed inset-0 bg-black page-container"
      style={{ 
        overflow: 'hidden'
      }}
    >
      {/* initial={false}: the first view is server-rendered visible (no opacity:0
          in the static HTML) so it paints at FCP; later view switches still fade. */}
      <LazyMotion features={loadMotionFeatures}>
      <AnimatePresence mode="wait" initial={false}>
        {currentView === 'home' ? (
          <m.div 
            key="home" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <Carousel />
          </m.div>
        ) : currentView === 'about' ? (
          <m.div 
            key="about" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <AboutMe />
          </m.div>
        ) : currentView === 'commercial' ? (
          <m.div 
            key="commercial" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <CommercialWork />
          </m.div>
        ) : currentView === 'creative-process' ? (
          <m.div 
            key="creative-process" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <CreativeProcess />
          </m.div>
        ) : (
          <m.div 
            key="brands" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <BrandsPage />
          </m.div>
        )}
      </AnimatePresence>
      </LazyMotion>
    </main>
  );
}

