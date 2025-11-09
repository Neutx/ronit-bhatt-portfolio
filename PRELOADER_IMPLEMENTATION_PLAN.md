# Preloader Implementation Plan
## Complete Guide to Replicating the Roman Jean-Elie Website Preloader

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Component Structure](#component-structure)
3. [CSS Styles](#css-styles)
4. [JavaScript Implementation](#javascript-implementation)
5. [Dependencies](#dependencies)
6. [State Management](#state-management)
7. [Animation Details](#animation-details)
8. [Font Loading](#font-loading)
9. [Step-by-Step Implementation](#step-by-step-implementation)
10. [File Structure](#file-structure)
11. [Testing Checklist](#testing-checklist)

---

## 🎯 Overview

The preloader is a React component that displays a loading screen with:
- "WELCOME" text with a blinking red cursor
- Progress percentage (optional, hidden by default)
- GSAP-powered animations
- Font loading detection
- Page content fade-in on completion

**Key Features:**
- Only visible on desktop (hidden on mobile/tablet)
- Shows on homepage route only (`/`)
- Waits for fonts to load before completing
- Smooth GSAP animations for entrance/exit
- Progress tracking (0-1, displayed as percentage)

---

## 🏗️ Component Structure

### HTML Structure
```html
<div class="loader">
  <div class="container">
    <span class="text">WELCOME</span>
    <div class="cursor">
      <div class="cursor__inner"></div>
    </div>
    <span class="text"></span>
  </div>
  <p class="progress" style="opacity: 0;">0%</p>
</div>
```

**Notes:**
- The loader is positioned fixed, covering the entire viewport
- The container centers the text and cursor horizontally
- Two text spans (one with "WELCOME", one empty) for animation purposes
- Progress element is positioned absolutely in bottom-right corner
- Cursor has an inner div for the red background

---

## 🎨 CSS Styles

### Complete CSS for Preloader

```css
/* Z-index variable (must be defined in root) */
:root {
  --z-index-loader: 5;
  --vr: calc((100vw / var(--size-width) * 16 * var(--vw-ratio, 1) + (1 - var(--vw-ratio, 1)) * 16px + 100vh / var(--size-height) * 16 * var(--vh-ratio, 1) + (1 - var(--vh-ratio, 1)) * 16px) / 2 / 16);
  --size-width: 390;
  --size-height: 844;
  --vw-ratio: 0.5;
  --vh-ratio: 1;
}

@media (min-width: 768px) {
  :root {
    --size-width: 1920;
    --size-height: 1080;
  }
}

/* Main Loader Container */
.loader {
  font-family: Inter_Bold, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: calc(16 * calc(1 * var(--vr)) * 0.8);
  line-height: calc(110/100 * 16 * calc(1 * var(--vr)) * 0.8);
  letter-spacing: calc(0 * calc(1 * var(--vr)) * 0.8);
  text-rendering: geometricPrecision;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-index-loader);
  pointer-events: none;
  background-color: #000; /* Optional: add black background */
}

/* Hide loader on mobile */
@media (max-width: 768px) {
  .loader {
    display: none;
  }
}

/* Container for text and cursor */
.loader .container {
  display: flex;
  align-items: center;
  gap: calc(10 * var(--vr));
  transform: translateX(calc(-50% + 19 * var(--vr)));
}

/* Text spans */
.loader .text {
  font-family: Inter_Bold, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: calc(16 * calc(1 * var(--vr)) * 1.5);
  line-height: calc(110/100 * 16 * calc(1 * var(--vr)) * 1.5);
  letter-spacing: calc(0 * calc(1 * var(--vr)) * 1.5);
  text-rendering: geometricPrecision;
  white-space: nowrap;
  color: #fff; /* Add white color for text */
}

/* Cursor container */
.loader .cursor {
  width: calc(19 * var(--vr));
  height: calc(19 * var(--vr));
}

/* Cursor inner (red square) */
.loader .cursor .cursor__inner {
  width: 100%;
  height: 100%;
  background: red;
}

/* Progress indicator */
.loader .progress {
  font-family: Inter_Bold, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: calc(16 * calc(1 * var(--vr)) * 1);
  line-height: calc(110/100 * 16 * calc(1 * var(--vr)) * 1);
  letter-spacing: calc(0 * calc(1 * var(--vr)) * 1);
  text-rendering: geometricPrecision;
  display: none; /* Hidden by default */
  position: absolute;
  right: 16px;
  bottom: 16px;
  color: red;
  text-transform: uppercase;
}
```

### Simplified CSS (Without Custom Variables)

If you don't want to use the complex `--vr` variable system, here's a simplified version:

```css
:root {
  --z-index-loader: 5;
}

.loader {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-index-loader);
  pointer-events: none;
  background-color: #000;
}

@media (max-width: 768px) {
  .loader {
    display: none;
  }
}

.loader .container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.loader .text {
  font-size: 24px;
  white-space: nowrap;
  color: #fff;
}

.loader .cursor {
  width: 19px;
  height: 19px;
}

.loader .cursor .cursor__inner {
  width: 100%;
  height: 100%;
  background: red;
}

.loader .progress {
  display: none;
  position: absolute;
  right: 16px;
  bottom: 16px;
  color: red;
  text-transform: uppercase;
  font-size: 16px;
}
```

---

## 💻 JavaScript Implementation

### React Component (TypeScript/JavaScript)

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation'; // or 'next/router' for Pages Router
import gsap from 'gsap';

interface LoaderProps {
  enabled?: boolean;
  loaderProgress?: number; // 0 to 1
  setIsLoaded?: (loaded: boolean) => void;
  fontsLoaded?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  enabled = true,
  loaderProgress = 0,
  setIsLoaded,
  fontsLoaded = false,
}) => {
  const pathname = usePathname();
  const loaderRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const blinkTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [readyToHide, setReadyToHide] = useState(false);

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
  const playEntranceAnimation = async () => {
    const tl = gsap.timeline();
    
    // Fade in text elements with stagger
    tl.set([text1Ref.current, text2Ref.current], { autoAlpha: 1, stagger: 0.3 }, '<')
      .add(() => {
        createBlinkAnimation().play();
      }, '<')
      .add(() => {
        setReadyToHide(true);
      }, '<');
  };

  // Exit animation
  const playExitAnimation = () => {
    const tl = gsap.timeline();
    
    if (blinkTimelineRef.current) {
      blinkTimelineRef.current.kill();
    }
    
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
      // Show page sections
      .set('.section', { autoAlpha: 1 }, '<')
      // Hide loader text elements
      .set([text1Ref.current, text2Ref.current], { autoAlpha: 0 }, '<')
      // Call completion callback
      .add(() => {
        if (setIsLoaded) {
          setIsLoaded(true);
        }
      });
  };

  // Initialize on mount
  useEffect(() => {
    // Reset initial states
    gsap.set(cursorRef.current, { opacity: 0 });
    gsap.set([text1Ref.current, text2Ref.current], { autoAlpha: 0 });
    
    if (enabled) {
      gsap.delayedCall(0.01, playEntranceAnimation);
    } else {
      gsap.delayedCall(0.02, () => {
        if (setIsLoaded) {
          setIsLoaded(true);
        }
      });
    }
    
    return () => {
      if (blinkTimelineRef.current) {
        blinkTimelineRef.current.kill();
      }
    };
  }, []);

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
  }, [imagesLoaded, readyToHide, fontsLoaded]);

  // Only show on homepage
  const isHomePage = pathname === '/';
  const visibility = isHomePage ? 'visible' : 'hidden';

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
```

### Vanilla JavaScript Version

```javascript
class Preloader {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this.loaderProgress = options.loaderProgress || 0;
    this.onComplete = options.onComplete || (() => {});
    this.fontsLoaded = options.fontsLoaded || false;
    
    this.loaderEl = null;
    this.text1El = null;
    this.text2El = null;
    this.cursorEl = null;
    this.progressEl = null;
    this.blinkTimeline = null;
    
    this.imagesLoaded = false;
    this.readyToHide = false;
    
    this.init();
  }

  init() {
    this.createLoaderHTML();
    this.setupAnimations();
    
    if (this.enabled) {
      setTimeout(() => this.playEntranceAnimation(), 10);
    } else {
      setTimeout(() => this.onComplete(), 20);
    }
  }

  createLoaderHTML() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
      <div class="container">
        <span class="text" data-ref="text1">WELCOME</span>
        <div class="cursor" data-ref="cursor">
          <div class="cursor__inner"></div>
        </div>
        <span class="text" data-ref="text2"></span>
      </div>
      <p class="progress" data-ref="progress" style="opacity: 0;">0%</p>
    `;
    
    document.body.appendChild(loader);
    
    this.loaderEl = loader;
    this.text1El = loader.querySelector('[data-ref="text1"]');
    this.text2El = loader.querySelector('[data-ref="text2"]');
    this.cursorEl = loader.querySelector('[data-ref="cursor"]');
    this.progressEl = loader.querySelector('[data-ref="progress"]');
    
    // Hide initially
    gsap.set([this.text1El, this.text2El], { autoAlpha: 0 });
    gsap.set(this.cursorEl, { opacity: 0 });
  }

  createBlinkAnimation() {
    if (this.blinkTimeline) {
      this.blinkTimeline.kill();
    }
    
    this.blinkTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.1 });
    this.blinkTimeline
      .set(this.cursorEl, { opacity: 0 })
      .set(this.cursorEl, { opacity: 1, delay: 0.1 });
    
    return this.blinkTimeline;
  }

  playEntranceAnimation() {
    const tl = gsap.timeline();
    
    tl.set([this.text1El, this.text2El], { autoAlpha: 1, stagger: 0.3 }, '<')
      .add(() => {
        this.createBlinkAnimation().play();
      }, '<')
      .add(() => {
        this.readyToHide = true;
        this.checkCompletion();
      }, '<');
  }

  playExitAnimation() {
    const tl = gsap.timeline();
    
    if (this.blinkTimeline) {
      this.blinkTimeline.kill();
    }
    
    tl.set(this.progressEl, { autoAlpha: 0 })
      .set(this.cursorEl, { autoAlpha: 1 })
      .to(this.cursorEl, {
        delay: 0.2,
        scale: 0,
        duration: 0.1,
        ease: 'power2.in',
      })
      .set('.section', { autoAlpha: 1 }, '<')
      .set([this.text1El, this.text2El], { autoAlpha: 0 }, '<')
      .add(() => {
        this.onComplete();
      });
  }

  updateProgress(progress) {
    this.loaderProgress = progress;
    if (this.progressEl) {
      this.progressEl.textContent = Math.round(progress * 100) + '%';
    }
    
    if (progress === 1 && this.readyToHide) {
      this.imagesLoaded = true;
      this.checkCompletion();
    }
  }

  setFontsLoaded(loaded) {
    this.fontsLoaded = loaded;
    this.checkCompletion();
  }

  checkCompletion() {
    if (this.imagesLoaded && this.readyToHide && this.fontsLoaded) {
      this.playExitAnimation();
    }
  }

  destroy() {
    if (this.blinkTimeline) {
      this.blinkTimeline.kill();
    }
    if (this.loaderEl) {
      this.loaderEl.remove();
    }
  }
}

// Usage
const preloader = new Preloader({
  enabled: true,
  onComplete: () => {
    console.log('Preloader complete!');
  },
});

// Update progress
preloader.updateProgress(0.5); // 50%

// Set fonts loaded
preloader.setFontsLoaded(true);
```

---

## 📦 Dependencies

### Required Packages

1. **GSAP (GreenSock Animation Platform)**
   ```bash
   npm install gsap
   # or
   yarn add gsap
   ```

2. **React** (if using React version)
   ```bash
   npm install react react-dom
   ```

3. **Next.js** (if using Next.js)
   ```bash
   npm install next
   ```

### Font Files Required

The loader uses `Inter_Bold` font. You need:

- `Inter_Bold.woff2` (or `.woff`)
- Font files should be placed in `/fonts/` directory

**Font Loading:**
```css
@font-face {
  font-display: swap;
  font-family: Inter_Bold;
  src: url(/fonts/Inter_Bold.woff2) format('woff2'),
       url(/fonts/Inter_Bold.woff) format('woff');
}
```

---

## 🔄 State Management

### Required State Variables

1. **loaderProgress** (0 to 1)
   - Tracks loading progress
   - Updated by image/resource loading logic
   - Displayed as percentage (0-100%)

2. **fontsLoaded** (boolean)
   - Indicates when web fonts are fully loaded
   - Required before loader can complete

3. **isLoaded** (boolean)
   - Global state indicating page is ready
   - Set to `true` when loader completes
   - Used to show/hide page content

### State Management Hook (React Context Example)

```tsx
// contexts/LoaderContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoaderContextType {
  loaderProgress: number;
  setLoaderProgress: (progress: number) => void;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <LoaderContext.Provider
      value={{
        loaderProgress,
        setLoaderProgress,
        isLoaded,
        setIsLoaded,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within LoaderProvider');
  }
  return context;
};
```

---

## 🎬 Animation Details

### GSAP Animation Timeline

#### Entrance Animation Sequence:
1. **Text Fade In** (0.3s stagger)
   - Both text spans fade in with 0.3s delay between them
   - Uses `autoAlpha` (opacity + visibility)

2. **Cursor Blink Start** (starts after text)
   - Infinite blinking animation
   - Opacity: 0 → 1 → 0 (repeat)
   - 0.1s delay between blinks

3. **Ready State** (after animations)
   - Sets `readyToHide = true`
   - Allows exit animation to trigger

#### Exit Animation Sequence:
1. **Hide Progress** (immediate)
   - Sets progress opacity to 0

2. **Show Cursor** (immediate)
   - Ensures cursor is visible before scaling

3. **Scale Cursor Down** (0.2s delay, 0.1s duration)
   - Scale from 1 to 0
   - Ease: `power2.in`

4. **Show Page Content** (simultaneous with cursor scale)
   - Fades in `.section` elements
   - Uses `autoAlpha: 1`

5. **Hide Loader Text** (simultaneous)
   - Fades out text elements

6. **Complete Callback** (after all animations)
   - Calls `setIsLoaded(true)`

### GSAP Configuration

```javascript
// Register GSAP plugins if needed
import { gsap } from 'gsap';

// Set default ease
gsap.defaults.ease = 'power2.out';

// Use autoAlpha for better performance
// autoAlpha combines opacity and visibility
```

---

## 🔤 Font Loading

### Font Loading Detection Hook

```tsx
// hooks/useFontsLoaded.ts
import { useState, useEffect } from 'react';

export const useFontsLoaded = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if ('fonts' in document) {
      // Modern browsers with Font Loading API
      Promise.all([
        document.fonts.load('1em Inter_Bold'),
        // Add other fonts if needed
        // document.fonts.load('1em Anton-Regular'),
      ]).then(() => {
        setFontsLoaded(true);
      });
    } else {
      // Fallback for older browsers
      const checkFonts = () => {
        if (document.fonts && document.fonts.check) {
          if (document.fonts.check('1em Inter_Bold')) {
            setFontsLoaded(true);
          } else {
            setTimeout(checkFonts, 100);
          }
        } else {
          // Ultimate fallback - wait 1 second
          setTimeout(() => setFontsLoaded(true), 1000);
        }
      };
      checkFonts();
    }
  }, []);

  return fontsLoaded;
};
```

### Vanilla JavaScript Font Loading

```javascript
function checkFontsLoaded() {
  return new Promise((resolve) => {
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        // Check specific fonts
        const interBold = document.fonts.check('1em Inter_Bold');
        resolve(interBold);
      });
    } else {
      // Fallback
      setTimeout(() => resolve(true), 1000);
    }
  });
}

// Usage
checkFontsLoaded().then((loaded) => {
  if (loaded) {
    preloader.setFontsLoaded(true);
  }
});
```

---

## 📝 Step-by-Step Implementation

### Step 1: Install Dependencies
```bash
npm install gsap
# or for React/Next.js
npm install gsap react react-dom next
```

### Step 2: Add CSS
- Copy the CSS styles from [CSS Styles](#css-styles) section
- Add to your global stylesheet or component styles
- Ensure `--z-index-loader` variable is defined

### Step 3: Create Loader Component
- Copy the React component code from [JavaScript Implementation](#javascript-implementation)
- Or use the vanilla JavaScript version
- Place in appropriate directory (e.g., `components/Loader.tsx`)

### Step 4: Set Up Font Loading
- Add font files to `/fonts/` directory
- Add `@font-face` declarations
- Implement font loading detection hook/function

### Step 5: Integrate Loader
- Add loader to your main app component
- Set up state management for progress
- Connect font loading detection

### Step 6: Add Progress Tracking
- Implement image/resource loading logic
- Update `loaderProgress` as resources load
- Example: Track image loading with `Image` objects

### Step 7: Test
- Verify loader shows on homepage
- Check animations work smoothly
- Ensure loader hides after completion
- Test on mobile (should be hidden)

---

## 📁 File Structure

```
your-project/
├── components/
│   └── Loader.tsx (or Loader.js)
├── hooks/
│   └── useFontsLoaded.ts (or useFontsLoaded.js)
├── contexts/
│   └── LoaderContext.tsx (optional, for React)
├── styles/
│   └── loader.css (or add to global.css)
├── fonts/
│   ├── Inter_Bold.woff2
│   └── Inter_Bold.woff
└── pages/ (or app/ for Next.js 13+)
    └── _app.tsx (or _app.js)
```

---

## ✅ Testing Checklist

- [ ] Loader appears on page load
- [ ] "WELCOME" text fades in correctly
- [ ] Red cursor blinks continuously
- [ ] Loader only shows on homepage (`/`)
- [ ] Loader is hidden on mobile devices (< 768px)
- [ ] Progress updates correctly (if enabled)
- [ ] Fonts load before completion
- [ ] Exit animation plays smoothly
- [ ] Page content fades in after loader
- [ ] No console errors
- [ ] Works in all major browsers
- [ ] Performance is smooth (60fps)

---

## 🎨 Customization Options

### Change Text
```tsx
<span ref={text1Ref} className="text">
  YOUR TEXT HERE
</span>
```

### Change Cursor Color
```css
.loader .cursor .cursor__inner {
  background: #your-color;
}
```

### Adjust Animation Speed
```javascript
// In playEntranceAnimation
tl.set([text1Ref.current, text2Ref.current], { 
  autoAlpha: 1, 
  stagger: 0.5 // Increase for slower
}, '<')
```

### Show Progress
```tsx
<p
  ref={progressRef}
  className="progress"
  style={{ opacity: 1, display: 'block' }} // Show progress
>
  {Math.round(loaderProgress * 100)}%
</p>
```

---

## 🐛 Troubleshooting

### Loader doesn't appear
- Check z-index is high enough
- Verify `enabled` prop is `true`
- Check if on homepage route
- Ensure CSS is loaded

### Animations not working
- Verify GSAP is installed and imported
- Check browser console for errors
- Ensure refs are properly attached
- Verify GSAP version compatibility

### Fonts not loading
- Check font file paths
- Verify `@font-face` declarations
- Test font loading API support
- Check network tab for font requests

### Loader doesn't complete
- Verify `fontsLoaded` is set to `true`
- Check `loaderProgress` reaches 1
- Ensure `readyToHide` is `true`
- Check completion conditions in `useEffect`

---

## 📚 Additional Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/FontFace)
- [React Hooks](https://react.dev/reference/react)
- [Next.js Routing](https://nextjs.org/docs/routing/introduction)

---

## 📄 License & Credits

This implementation plan is based on the preloader from:
**Roman Jean-Elie Portfolio Website**
- Website: https://romanjeanelie.com
- Developer: Roman Jean-Elie

---

**End of Implementation Plan**

