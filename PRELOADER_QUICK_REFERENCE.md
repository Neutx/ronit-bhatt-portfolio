# Preloader Quick Reference Guide
## For Implementation Agent

---

## 🚀 Quick Start

### Essential Files to Create:

1. **CSS File** (`styles/loader.css` or add to global CSS)
   - Copy CSS from `PRELOADER_IMPLEMENTATION_PLAN.md` → [CSS Styles](#css-styles)
   - Use simplified version if not using custom `--vr` variables

2. **Loader Component** (`components/Loader.tsx` or `Loader.js`)
   - Copy React component from `PRELOADER_IMPLEMENTATION_PLAN.md` → [JavaScript Implementation](#javascript-implementation)
   - Or use vanilla JavaScript version if not using React

3. **Font Loading Hook** (`hooks/useFontsLoaded.ts`)
   - Copy from `PRELOADER_IMPLEMENTATION_PLAN.md` → [Font Loading](#font-loading)

---

## 📦 Required Dependencies

```bash
npm install gsap
```

If using React/Next.js:
```bash
npm install gsap react react-dom
```

---

## 🎯 Key Implementation Points

### 1. HTML Structure
```html
<div class="loader">
  <div class="container">
    <span class="text">WELCOME</span>
    <div class="cursor">
      <div class="cursor__inner"></div>
    </div>
    <span class="text"></span>
  </div>
  <p class="progress">0%</p>
</div>
```

### 2. CSS Requirements
- `--z-index-loader: 5` (must be defined)
- Fixed positioning, full viewport
- Hidden on mobile (`@media (max-width: 768px)`)
- Red cursor background: `background: red`

### 3. JavaScript Requirements
- GSAP for animations
- Font loading detection
- Progress tracking (0-1)
- Route detection (only show on `/`)

### 4. Animation Sequence
**Entrance:**
1. Text fades in (stagger 0.3s)
2. Cursor starts blinking (infinite loop)
3. Ready state set

**Exit:**
1. Hide progress
2. Show cursor
3. Scale cursor to 0
4. Show page content
5. Hide loader text
6. Call completion callback

---

## 🔧 Integration Steps

### Step 1: Add CSS
```css
/* Add to your global stylesheet */
.loader { /* ... copy from plan ... */ }
```

### Step 2: Add Component
```tsx
// In your _app.tsx or main component
import Loader from '@/components/Loader';
import { useFontsLoaded } from '@/hooks/useFontsLoaded';

function MyApp() {
  const fontsLoaded = useFontsLoaded();
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Loader
        enabled={true}
        loaderProgress={loaderProgress}
        setIsLoaded={setIsLoaded}
        fontsLoaded={fontsLoaded}
      />
      {/* Your app content */}
    </>
  );
}
```

### Step 3: Track Progress
```javascript
// Example: Track image loading
const images = document.querySelectorAll('img');
let loaded = 0;

images.forEach((img) => {
  if (img.complete) {
    loaded++;
  } else {
    img.addEventListener('load', () => {
      loaded++;
      setLoaderProgress(loaded / images.length);
    });
  }
});
```

---

## 🎨 Customization

### Change Text
```tsx
<span className="text">YOUR TEXT</span>
```

### Change Cursor Color
```css
.loader .cursor .cursor__inner {
  background: #your-color;
}
```

### Show Progress
```tsx
<p className="progress" style={{ opacity: 1, display: 'block' }}>
  {Math.round(loaderProgress * 100)}%
</p>
```

---

## ✅ Checklist

- [ ] GSAP installed
- [ ] CSS added
- [ ] Component created
- [ ] Font loading hook implemented
- [ ] Loader added to app
- [ ] Progress tracking implemented
- [ ] Fonts loading detected
- [ ] Only shows on homepage
- [ ] Hidden on mobile
- [ ] Animations working
- [ ] Page content fades in after

---

## 🐛 Common Issues

**Loader doesn't appear:**
- Check z-index
- Verify `enabled={true}`
- Check route (must be `/`)

**Animations not working:**
- Verify GSAP installed
- Check refs are attached
- Check browser console

**Doesn't complete:**
- Ensure `fontsLoaded` is `true`
- Check `loaderProgress` reaches 1
- Verify all conditions met

---

## 📚 Full Documentation

See `PRELOADER_IMPLEMENTATION_PLAN.md` for complete details including:
- Full code examples
- State management
- Animation details
- Font loading implementation
- Troubleshooting guide

---

**Ready to implement!** Follow the steps above and refer to the full plan for detailed code.

